import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { audio } from './audio'
import type { AudioSettings } from './audio'
import { actionDelay, newGame, reducer } from './engine'
import type { Cmd } from './engine'
import { CALLS } from './story/calls'
import { clearSave, loadAudio, loadCheckpoint, loadMeta, loadSave, writeAudio, writeCheckpoint, writeMeta, writeSave } from './storage'
import type { Meta } from './storage'
import type { GameState } from './types'

export type Screen = 'title' | 'phone'

interface GameCtx {
  state: GameState
  dispatch: Dispatch<Cmd>
  screen: Screen
  hasSave: boolean
  meta: Meta
  audioSettings: AudioSettings
  setAudioSettings: (a: AudioSettings) => void
  tutorial: number | null
  setTutorial: (n: number | null) => void
  finishTutorial: () => void
  startNew: () => void
  continueGame: () => void
  playEpisode: (n: number) => void
  toTitle: () => void
  resetAll: () => void
}

const Ctx = createContext<GameCtx | null>(null)

export function useGame() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGame must be used inside GameProvider')
  return c
}

/** Shorthand for UPDATE commands. */
export function useUpdate() {
  const { dispatch } = useGame()
  return useCallback((fn: (s: GameState) => Partial<GameState>) => dispatch({ type: 'UPDATE', fn }), [dispatch])
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => newGame())
  const [screen, setScreen] = useState<Screen>('title')
  const [hasSave, setHasSave] = useState(false)
  const [meta, setMetaState] = useState<Meta>({ endingsSeen: [], tutorialDone: false })
  const [audioSettings, setAudio] = useState<AudioSettings>(() => loadAudio())
  const [tutorial, setTutorial] = useState<number | null>(null)

  useEffect(() => {
    setHasSave(!!loadSave())
    setMetaState(loadMeta())
  }, [])

  const setMeta = useCallback((m: Meta) => {
    setMetaState(m)
    writeMeta(m)
  }, [])

  const setAudioSettings = useCallback((a: AudioSettings) => {
    setAudio(a)
    writeAudio(a)
  }, [])

  useEffect(() => audio.configure(audioSettings), [audioSettings])
  useEffect(() => audio.setBgm(screen === 'phone' || screen === 'title'), [screen])

  // ── Story queue runner ──────────────────────────────────────────────────
  const head = state.queue[0]
  const paused =
    screen !== 'phone' || !!state.card || !!state.ending || state.device.airplane || (!!state.call && state.call.status !== 'ended')
  useEffect(() => {
    if (!head || paused) return
    const t = window.setTimeout(() => dispatch({ type: 'APPLY_HEAD' }), actionDelay(head))
    return () => window.clearTimeout(t)
  }, [head, paused, state.queue.length])

  // ── Game clock ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'phone' || state.card || state.ending) return
    const t = window.setInterval(() => dispatch({ type: 'TICK' }), 30_000)
    return () => window.clearInterval(t)
  }, [screen, state.card, state.ending])

  // ── Calls: dialing → connect, auto-advance transcript, auto-close ───────
  const call = state.call
  useEffect(() => {
    if (!call) return
    if (call.status === 'dialing') {
      const t = window.setTimeout(() => dispatch({ type: 'CALL_CONNECT' }), 2600)
      return () => window.clearTimeout(t)
    }
    if (call.status === 'active') {
      const step = CALLS[call.id].steps[call.idx]
      if (step && 'choice' in step) return
      const prev = call.log[call.log.length - 1]
      const wait = call.log.length === 0 ? 900 : 1100 + Math.min((prev?.text.length ?? 20) * 38, 3400)
      const t = window.setTimeout(() => dispatch({ type: 'CALL_ADVANCE' }), wait)
      return () => window.clearTimeout(t)
    }
    if (call.status === 'ended') {
      audio.play('hangup')
      const t = window.setTimeout(() => dispatch({ type: 'CALL_CLOSE' }), 1600)
      return () => window.clearTimeout(t)
    }
  }, [call])

  // ── Persistence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'phone') return
    const t = window.setTimeout(() => {
      writeSave(state)
      setHasSave(true)
    }, 400)
    return () => window.clearTimeout(t)
  }, [state, screen])

  // Snapshot a checkpoint whenever an episode's opening card appears.
  const cardKey = state.card ? `${state.card.type}${state.card.episode}` : ''
  const stateRef = useRef(state)
  stateRef.current = state
  useEffect(() => {
    const s = stateRef.current
    if (screen === 'phone' && s.card?.type === 'start') writeCheckpoint(s.card.episode, s)
  }, [cardKey, screen])

  // Record endings across playthroughs.
  useEffect(() => {
    if (state.ending && !meta.endingsSeen.includes(state.ending)) {
      setMeta({ ...meta, endingsSeen: [...meta.endingsSeen, state.ending] })
    }
  }, [state.ending, meta, setMeta])

  const finishTutorial = useCallback(() => {
    setTutorial(null)
    setMeta({ ...meta, tutorialDone: true })
  }, [meta, setMeta])

  const begin = useCallback(
    (s: GameState) => {
      dispatch({ type: 'LOAD', state: { ...s, viewingThread: null } })
      setScreen('phone')
    },
    [dispatch],
  )

  const startNew = useCallback(() => {
    clearSave()
    begin(newGame(state.device))
    if (!meta.tutorialDone) setTutorial(0)
  }, [begin, meta.tutorialDone, state.device])

  const continueGame = useCallback(() => {
    const s = loadSave()
    if (s) begin(s)
  }, [begin])

  const playEpisode = useCallback(
    (n: number) => {
      const cp = loadCheckpoint(n)
      if (cp) begin({ ...cp, ending: null, decision: null })
      else if (n === 1) startNew()
    },
    [begin, startNew],
  )

  const toTitle = useCallback(() => {
    writeSave(stateRef.current)
    audio.stopTrack()
    audio.ring(false)
    audio.tape(false)
    setScreen('title')
  }, [])

  const resetAll = useCallback(() => {
    clearSave()
    setHasSave(false)
    setMeta({ endingsSeen: meta.endingsSeen, tutorialDone: false })
    dispatch({ type: 'LOAD', state: newGame() })
    setScreen('title')
  }, [meta.endingsSeen, setMeta])

  const value = useMemo<GameCtx>(
    () => ({
      state,
      dispatch,
      screen,
      hasSave,
      meta,
      audioSettings,
      setAudioSettings,
      tutorial,
      setTutorial,
      finishTutorial,
      startNew,
      continueGame,
      playEpisode,
      toTitle,
      resetAll,
    }),
    [state, screen, hasSave, meta, audioSettings, setAudioSettings, tutorial, finishTutorial, startNew, continueGame, playEpisode, toTitle, resetAll],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
