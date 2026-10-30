// Core types for THE LAST MESSAGE game engine.

export type AppId =
  | 'messages'
  | 'contacts'
  | 'phone'
  | 'camera'
  | 'gallery'
  | 'social'
  | 'browser'
  | 'email'
  | 'notes'
  | 'files'
  | 'maps'
  | 'calendar'
  | 'clock'
  | 'music'
  | 'recorder'
  | 'calculator'
  | 'settings'

export type CharId =
  | 'nara'
  | 'raka'
  | 'fake'
  | 'unknown'
  | 'sinta'
  | 'kevin'
  | 'bima'
  | 'tiara'
  | 'ibu'
  | 'gunawan'
  | 'operator'

export type ThreadId = 'grup' | 'raka' | 'unknown' | 'sinta' | 'kevin' | 'ibu' | 'operator'

export interface ChatMessage {
  id: string
  from: CharId
  text: string
  /** Game minutes (see clock.ts). */
  time: number
  kind?: 'text' | 'voice' | 'image' | 'system'
  /** Recording id for voice, gallery id for image. */
  ref?: string
}

export type UnlockCategory =
  | 'gallery'
  | 'emails'
  | 'notes'
  | 'files'
  | 'recordings'
  | 'posts'
  | 'pages'
  | 'events'

export type Action =
  | {
      t: 'msg'
      thread: ThreadId
      from: CharId
      text: string
      delay?: number
      kind?: ChatMessage['kind']
      ref?: string
    }
  | { t: 'notify'; app: AppId; title: string; body: string; delay?: number }
  | {
      t: 'unlock'
      cat: UnlockCategory
      id: string
      notify?: { app: AppId; title: string; body: string }
      delay?: number
    }
  | { t: 'flag'; key: string; value?: boolean; delay?: number }
  | { t: 'rel'; who: RelKey; delta: number; delay?: number }
  | { t: 'leak'; delay?: number }
  | { t: 'prompt'; id: PromptId; delay?: number }
  | { t: 'call'; id: string; delay?: number }
  | { t: 'objective'; id: string; delay?: number }
  | { t: 'goto'; node: string; delay?: number }
  | { t: 'episodeEnd'; episode: number; delay?: number }
  | { t: 'decide'; choice: Decision; delay?: number }
  | { t: 'ending'; delay?: number }
  | { t: 'wait'; delay: number }

export type RelKey = 'sinta' | 'kevin' | 'raka'
export type Decision = 'journalist' | 'social' | 'kevin' | 'delete'
export type EndingId = 'cahaya' | 'fajar' | 'api' | 'penebusan' | 'pesan_terakhir' | 'sunyi'

export type PromptId =
  | 'fake1'
  | 'group1'
  | 'sinta1'
  | 'prove'
  | 'afterRec'
  | 'fake2'
  | 'kevin1'
  | 'final'

export interface PromptResult {
  actions: Action[]
  /** Keep the prompt active (e.g. wrong puzzle answer). */
  keep?: boolean
}

export interface PromptDef {
  id: PromptId
  thread: ThreadId
  placeholder: string
  suggestions: string[]
  evaluate: (text: string, s: GameState) => PromptResult
}

export type CallStep =
  | { s: CharId; text: string }
  | { jump: number }
  | { choice: { label: string; actions?: Action[]; goto: number }[] }
  | { end: true; actions?: Action[] }

export interface CallDef {
  id: string
  who: CharId
  /** Shown as the caller name when not a known contact. */
  label?: string
  steps: CallStep[]
  /** Actions queued when the player declines or misses the call. */
  onMissed?: Action[]
}

export interface ActiveCall {
  id: string
  status: 'ringing' | 'dialing' | 'active' | 'ended'
  idx: number
  log: { s: CharId; text: string }[]
  incoming: boolean
  startedAt: number
}

export interface Notif {
  id: string
  app: AppId
  title: string
  body: string
  time: number
  thread?: ThreadId
  read?: boolean
}

export interface CallLogEntry {
  id: string
  who: CharId | string
  number: string
  dir: 'in' | 'out' | 'missed'
  time: number
  duration?: number
}

export interface UserNote {
  id: string
  title: string
  body: string
  time: number
}

export interface UserPhoto {
  id: string
  variant: number
  front: boolean
  zoom: number
  time: number
}

export interface UserRecording {
  id: string
  name: string
  seconds: number
  time: number
}

export interface UserContact {
  id: string
  name: string
  number: string
  email?: string
}

export interface UserEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time?: string
}

export interface SentEmail {
  id: string
  to: string
  subject: string
  body: string
  attachments: string[]
  time: number
}

export interface UserPost {
  id: string
  text: string
  image?: string
  time: number
}

export interface Alarm {
  id: string
  time: string
  label: string
  on: boolean
  note?: string
}

export interface DeviceState {
  wifi: boolean
  data: boolean
  airplane: boolean
  flashlight: boolean
  dnd: boolean
  rotate: boolean
  saver: boolean
  brightness: number
  wallpaper: string
  textScale: number
}

export interface EpisodeCard {
  type: 'start' | 'end'
  episode: number
}

export interface GameState {
  version: 1
  episode: number
  episodesDone: number[]
  locked: boolean
  gameMinutes: number
  threads: Record<ThreadId, ChatMessage[]>
  unread: Partial<Record<ThreadId, number>>
  prompts: PromptId[]
  promptAttempts: Partial<Record<PromptId, number>>
  queue: Action[]
  flags: Record<string, boolean>
  rel: Record<RelKey, number>
  leaks: number
  unlocked: Record<UnlockCategory, string[]>
  readEmails: string[]
  notes: UserNote[]
  photos: UserPhoto[]
  recordings: UserRecording[]
  contacts: UserContact[]
  events: UserEvent[]
  sentEmails: SentEmail[]
  posts: UserPost[]
  likes: string[]
  alarms: Alarm[]
  callLog: CallLogEntry[]
  call: ActiveCall | null
  notifications: Notif[]
  objective: string
  hintsUsed: Record<string, number>
  decision: Decision | null
  ending: EndingId | null
  card: EpisodeCard | null
  device: DeviceState
  viewingThread: ThreadId | null
  playedRecordings: string[]
  seq: number
}
