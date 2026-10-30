w// Pure game reducer. All story progression flows through here so the whole
// state can be serialised to localStorage and resumed at any moment.
import { EPISODE_START } from './clock'
import { CHARACTERS, IDLE_REPLIES, THREADS } from './data/characters'
import { INITIAL_ALARMS } from './data/content'
import { CALLS, resolveDial } from './story/calls'
import { computeEnding } from './story/endings'
import { EVENTS } from './story/events'
import { initialThreads } from './story/initial'
import { DECISION_NODES, NODES } from './story/nodes'
import { PROMPTS } from './story/prompts'
import type { Action, ChatMessage, Decision, DeviceState, GameState, Notif, ThreadId } from './types'

export type Cmd =
  | { type: 'LOAD'; state: GameState }
  | { type: 'DISMISS_CARD' }
  | { type: 'APPLY_HEAD' } 
  | { type: 'TICK' }
  | { type: 'UNLOCK_SCREEN' }
  | { type: 'LOCK_SCREEN' }
  | { type: 'SEND'; thread: ThreadId; text: string }
  | { type: 'VIEW_THREAD'; thread: ThreadId | null }
  | { type: 'EVENT'; id: string }
  | { type: 'DIAL'; number: string }
  | { type: 'CALL_CONNECT' }
  | { type: 'CALL_ANSWER' }
  | { type: 'CALL_DECLINE' }
  | { type: 'CALL_ADVANCE' }
  | { type: 'CALL_CHOOSE'; index: number }
  | { type: 'CALL_HANGUP' }
  | { type: 'CALL_CLOSE' }
  | { type: 'NOTIF_DISMISS'; id: string }
  | { type: 'NOTIF_CLEAR' }
  | { type: 'NOTIF_READ_ALL' }
  | { type: 'USE_HINT' }
  | { type: 'DEVICE'; patch: Partial<DeviceState> }
  | { type: 'DECIDE'; choice: Decision }
  | { type: 'UPDATE'; fn: (s: GameState) => Partial<GameState> }

export const DEFAULT_DEVICE: DeviceState = {
  wifi: true,
  data: true,
  airplane: false,
  flashlight: false,
  dnd: false,
  rotate: false,
  saver: false,
  brightness: 0.95,
  wallpaper: 'hujan',
  textScale: 1,
}

export function newGame(device: DeviceState = DEFAULT_DEVICE): GameState {
  return {
    version: 1,
    episode: 1,
    episodesDone: [],
    locked: true,
    gameMinutes: EPISODE_START[1],
    threads: initialThreads(),
    unread: { raka: 0 },
    prompts: [],
    promptAttempts: {},
    queue: [],
    flags: {},
    rel: { sinta: 0, kevin: 0, raka: 0 },
    leaks: 0,
    unlocked: { gallery: [], emails: [], notes: [], files: [], recordings: [], posts: [], pages: [], events: [] },
    readEmails: [],
    notes: [],
    photos: [],
    recordings: [],
    contacts: [],
    events: [],
    sentEmails: [],
    posts: [],
    likes: [],
    alarms: INITIAL_ALARMS,
    callLog: [
      { id: 'cl1', who: 'raka', number: CHARACTERS.raka.number, dir: 'out', time: EPISODE_START[1] - 1440 - 200 },
      { id: 'cl2', who: 'raka', number: CHARACTERS.raka.number, dir: 'out', time: EPISODE_START[1] - 1440 - 190 },
      { id: 'cl3', who: 'ibu', number: CHARACTERS.ibu.number, dir: 'missed', time: EPISODE_START[1] - 400 },
      { id: 'cl4', who: 'raka', number: CHARACTERS.raka.number, dir: 'out', time: EPISODE_START[1] - 160 },
    ],
    call: null,
    notifications: [],
    objective: 'unlock',
    hintsUsed: {},
    decision: null,
    ending: null,
    card: { type: 'start', episode: 1 },
    device,
    viewingThread: null,
    playedRecordings: [],
    seq: 1,
  }
}

/** Episode `n` start state carried over from a finished previous episode. */
export function startEpisode(s: GameState, n: number): GameState {
  return {
    ...s,
    episode: n,
    locked: true,
    gameMinutes: Math.max(s.gameMinutes, EPISODE_START[n] ?? s.gameMinutes),
    prompts: [],
    queue: [],
    call: null,
    card: { type: 'start', episode: n },
    viewingThread: null,
  }
}

const id = (s: GameState, p: string) => `${p}${s.seq}`

function pushNotif(s: GameState, n: Omit<Notif, 'id' | 'time'>): GameState {
  const notif: Notif = { ...n, id: id(s, 'n'), time: s.gameMinutes }
  return { ...s, seq: s.seq + 1, notifications: [notif, ...s.notifications].slice(0, 30) }
}

function addMessage(s: GameState, thread: ThreadId, msg: Omit<ChatMessage, 'id' | 'time'>): GameState {
  const full: ChatMessage = { ...msg, id: id(s, 'm'), time: s.gameMinutes }
  let next: GameState = { ...s, seq: s.seq + 1, threads: { ...s.threads, [thread]: [...s.threads[thread], full] } }
  if (msg.from !== 'nara' && s.viewingThread !== thread) {
    next = { ...next, unread: { ...next.unread, [thread]: (next.unread[thread] ?? 0) + 1 } }
    const def = THREADS[thread]
    const sender = CHARACTERS[msg.from]
    const title = def.group ? `${sender.short} · ${def.title}` : def.title
    const body = msg.kind === 'voice' ? '🎤 Pesan suara' : msg.kind === 'image' ? '📷 Foto' : msg.text
    next = pushNotif(next, { app: 'messages', title, body, thread })
  }
  return next
}

function resolveNode(s: GameState, node: string): Action[] {
  const n = NODES[node]
  if (!n) return []
  return typeof n === 'function' ? n(s) : n
}

function fireEvent(s: GameState, eventId: string): GameState {
  const def = EVENTS[eventId]
  if (!def) return s
  const key = `ev:${eventId}`
  if (def.once !== false && s.flags[key]) return s
  if (def.when && !def.when(s)) return s
  const next = { ...s, flags: { ...s.flags, [key]: true } }
  return { ...next, queue: [...resolveNode(next, def.node), ...next.queue] }
}

function applyAction(s: GameState, a: Action): GameState {
  switch (a.t) {
    case 'msg':
      return addMessage(s, a.thread, { from: a.from, text: a.text, kind: a.kind, ref: a.ref })
    case 'notify':
      return pushNotif(s, { app: a.app, title: a.title, body: a.body })
    case 'unlock': {
      if (s.unlocked[a.cat].includes(a.id)) return s
      const next = { ...s, unlocked: { ...s.unlocked, [a.cat]: [...s.unlocked[a.cat], a.id] } }
      return a.notify ? pushNotif(next, a.notify) : next
    }
    case 'flag':
      return { ...s, flags: { ...s.flags, [a.key]: a.value ?? true } }
    case 'rel':
      return { ...s, rel: { ...s.rel, [a.who]: s.rel[a.who] + a.delta } }
    case 'leak':
      return { ...s, leaks: s.leaks + 1 }
    case 'prompt':
      return s.prompts.includes(a.id) ? s : { ...s, prompts: [...s.prompts, a.id], promptAttempts: { ...s.promptAttempts, [a.id]: 0 } }
    case 'call': {
      if (s.call) return { ...s, queue: [{ ...a, delay: 4000 }, ...s.queue] }
      const def = CALLS[a.id]
      return {
        ...s,
        call: { id: a.id, status: 'ringing', idx: 0, log: [], incoming: true, startedAt: Date.now() },
        callLog: [{ id: id(s, 'c'), who: def.who, number: CHARACTERS[def.who === 'raka' ? 'unknown' : def.who].number, dir: 'in' as const, time: s.gameMinutes }, ...s.callLog],
        seq: s.seq + 1,
      }
    }
    case 'objective':
      return { ...s, objective: a.id }
    case 'goto':
      return { ...s, queue: [...resolveNode(s, a.node), ...s.queue] }
    case 'episodeEnd':
      return {
        ...s,
        episodesDone: s.episodesDone.includes(a.episode) ? s.episodesDone : [...s.episodesDone, a.episode],
        card: { type: 'end', episode: a.episode },
      }
    case 'decide':
      return decide(s, a.choice)
    case 'ending':
      return s.decision ? { ...s, ending: computeEnding(s, s.decision) } : s
    case 'wait':
      return s
  }
}

function decide(s: GameState, choice: Decision): GameState {
  if (s.decision) return s
  return { ...s, decision: choice, prompts: s.prompts.filter((p) => p !== 'final'), queue: [...DECISION_NODES[choice], ...s.queue] }
}

export const canDecide = (s: GameState) => s.prompts.includes('final') && !s.decision

function advanceCall(s: GameState): GameState {
  const call = s.call
  if (!call || call.status !== 'active') return s
  const def = CALLS[call.id]
  const step = def.steps[call.idx]
  if (!step) return { ...s, call: { ...call, status: 'ended' } }
  if ('jump' in step) return advanceCall({ ...s, call: { ...call, idx: step.jump } })
  if ('choice' in step) return s
  if ('end' in step) {
    let next: GameState = { ...s, call: { ...call, status: 'ended' } }
    if (step.actions) next = { ...next, queue: [...step.actions, ...next.queue] }
    return fireEvent(next, `call_end:${call.id}`)
  }
  return { ...s, call: { ...call, idx: call.idx + 1, log: [...call.log, step] } }
}

export function reducer(s: GameState, c: Cmd): GameState {
  switch (c.type) {
    case 'LOAD':
      return c.state
    case 'DISMISS_CARD': {
      if (!s.card) return s
      if (s.card.type === 'start') {
        return { ...s, card: null, queue: [...resolveNode(s, `ep${s.card.episode}_start`), ...s.queue] }
      }
      return startEpisode(s, s.card.episode + 1)
    }
    case 'APPLY_HEAD': {
      const [head, ...rest] = s.queue
      if (!head) return s
      return applyAction({ ...s, queue: rest }, head)
    }
    case 'TICK':
      return { ...s, gameMinutes: s.gameMinutes + 1 }
    case 'UNLOCK_SCREEN': {
      const next = { ...s, locked: false }
      return s.objective === 'unlock' ? { ...next, objective: 'read_raka' } : next
    }
    case 'LOCK_SCREEN':
      return { ...s, locked: true, viewingThread: null }
    case 'VIEW_THREAD':
      return c.thread
        ? {
            ...s,
            viewingThread: c.thread,
            unread: { ...s.unread, [c.thread]: 0 },
            notifications: s.notifications.filter((n) => n.thread !== c.thread),
          }
        : { ...s, viewingThread: null }
    case 'SEND': {
      const text = c.text.trim()
      if (!text) return s
      let next = addMessage(s, c.thread, { from: 'nara', text })
      const promptId = next.prompts.find((p) => PROMPTS[p].thread === c.thread)
      if (promptId) {
        const result = PROMPTS[promptId].evaluate(text, next)
        next = {
          ...next,
          prompts: result.keep ? next.prompts : next.prompts.filter((p) => p !== promptId),
          promptAttempts: { ...next.promptAttempts, [promptId]: (next.promptAttempts[promptId] ?? 0) + 1 },
          queue: [...result.actions, ...next.queue],
        }
        return next
      }
      const idle = IDLE_REPLIES[c.thread]
      if (idle && (c.thread !== 'unknown' || next.flags.proved)) {
        const line = idle.lines[next.seq % idle.lines.length]
        next = { ...next, queue: [...next.queue, { t: 'msg', thread: c.thread, from: idle.from, text: line }] }
      }
      return next
    }
    case 'EVENT':
      return fireEvent(s, c.id)
    case 'DIAL': {
      if (s.call) return s
      const { callId, who } = resolveDial(c.number, s)
      return {
        ...s,
        call: { id: callId, status: 'dialing', idx: 0, log: [], incoming: false, startedAt: Date.now() },
        callLog: [{ id: id(s, 'c'), who, number: c.number, dir: 'out', time: s.gameMinutes }, ...s.callLog],
        seq: s.seq + 1,
      }
    }
    case 'CALL_CONNECT':
      return s.call?.status === 'dialing' ? { ...s, call: { ...s.call, status: 'active', startedAt: Date.now() } } : s
    case 'CALL_ANSWER':
      return s.call?.status === 'ringing' ? { ...s, call: { ...s.call, status: 'active', startedAt: Date.now() } } : s
    case 'CALL_DECLINE': {
      if (s.call?.status !== 'ringing') return s
      const def = CALLS[s.call.id]
      const [first, ...log] = s.callLog
      return {
        ...s,
        call: null,
        callLog: first ? [{ ...first, dir: 'missed' }, ...log] : s.callLog,
        queue: [...(def.onMissed ?? []), ...s.queue],
      }
    }
    case 'CALL_ADVANCE':
      return advanceCall(s)
    case 'CALL_CHOOSE': {
      const call = s.call
      if (!call || call.status !== 'active') return s
      const step = CALLS[call.id].steps[call.idx]
      if (!step || !('choice' in step)) return s
      const opt = step.choice[c.index]
      if (!opt) return s
      return {
        ...s,
        call: { ...call, idx: opt.goto },
        queue: [...(opt.actions ?? []), ...s.queue],
      }
    }
    case 'CALL_HANGUP': {
      const call = s.call
      if (!call) return s
      if (call.status === 'ringing') return reducer(s, { type: 'CALL_DECLINE' })
      if (call.status === 'ended') return { ...s, call: null }
      const def = CALLS[call.id]
      const duration = Math.round((Date.now() - call.startedAt) / 1000)
      const [first, ...log] = s.callLog
      const next: GameState = { ...s, call: { ...call, status: 'ended' }, callLog: first ? [{ ...first, duration }, ...log] : s.callLog }
      // Hanging up right away counts as a missed call; later on, the conversation simply ends there.
      if (def.onMissed && call.log.length < 2) return { ...next, queue: [...def.onMissed, ...next.queue] }
      return fireEvent(next, `call_end:${call.id}`)
    }
    case 'CALL_CLOSE': {
      if (!s.call) return s
      const duration = Math.round((Date.now() - s.call.startedAt) / 1000)
      const [first, ...log] = s.callLog
      return { ...s, call: null, callLog: first && first.duration == null ? [{ ...first, duration }, ...log] : s.callLog }
    }
    case 'NOTIF_DISMISS':
      return { ...s, notifications: s.notifications.filter((n) => n.id !== c.id) }
    case 'NOTIF_CLEAR':
      return { ...s, notifications: [] }
    case 'NOTIF_READ_ALL':
      return { ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }
    case 'USE_HINT':
      return { ...s, hintsUsed: { ...s.hintsUsed, [s.objective]: Math.min((s.hintsUsed[s.objective] ?? 0) + 1, 3) } }
    case 'DEVICE':
      return { ...s, device: { ...s.device, ...c.patch } }
    case 'DECIDE':
      return canDecide(s) ? decide(s, c.choice) : s
    case 'UPDATE':
      return { ...s, ...c.fn(s) }
  }
}

/** Delay before a queued action is applied, in ms. */
export function actionDelay(a: Action) {
  if (a.delay != null) return a.delay
  if (a.t === 'msg') return 900 + Math.min(a.text.length * 32, 2600)
  if (a.t === 'wait') return a.delay
  return 250
}
