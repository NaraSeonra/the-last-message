import type { AudioSettings } from './audio'
import { DEFAULT_AUDIO } from './audio'
import type { EndingId, GameState } from './types'

const SAVE = 'tlm:save'
const META = 'tlm:meta'
const AUDIO = 'tlm:audio'
const CP = (n: number) => `tlm:cp:${n}`

export interface Meta {
  endingsSeen: EndingId[]
  tutorialDone: boolean
}

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked (private mode): the game still runs, just without saving.
  }
}

export const loadSave = () => {
  const s = read<GameState>(SAVE)
  return s && s.version === 1 ? s : null
}
export const writeSave = (s: GameState) => write(SAVE, s)
export const clearSave = () => {
  window.localStorage.removeItem(SAVE)
  ;[1, 2, 3].forEach((n) => window.localStorage.removeItem(CP(n)))
}

export const loadCheckpoint = (n: number) => read<GameState>(CP(n))
export const writeCheckpoint = (n: number, s: GameState) => write(CP(n), s)

export const loadMeta = (): Meta => ({ endingsSeen: [], tutorialDone: false, ...read<Meta>(META) })
export const writeMeta = (m: Meta) => write(META, m)

export const loadAudio = (): AudioSettings => ({ ...DEFAULT_AUDIO, ...read<AudioSettings>(AUDIO) })
export const writeAudio = (a: AudioSettings) => write(AUDIO, a)
