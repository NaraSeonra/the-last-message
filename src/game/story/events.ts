import type { GameState } from '../types'

export interface EventDef {
  node: string
  /** Fire at most once per playthrough (default true). */
  once?: boolean
  when?: (s: GameState) => boolean
}

/** App interactions that advance the story. Apps dispatch these ids. */
export const EVENTS: Record<string, EventDef> = {
  'rec_done:rec_raka1': { node: 'ep1_after_rec', when: (s) => s.episode === 1 && !!s.flags.proved },
  zip_open: { node: 'ep2_zip', when: (s) => s.episode === 2 },
  'rec_done:rec_bk': { node: 'ep2_fake', when: (s) => s.episode === 2 && !!s.flags.has_evidence },
  'call_end:call_sinta1': { node: 'ep2_kevin', when: (s) => s.episode === 2 },
  'map_go:observatorium': { node: 'ep3_gate', when: (s) => s.episode === 3 && s.objective === 'find_place' },
  'map_go:other': { node: 'ep3_wrong', once: false, when: (s) => s.episode === 3 && s.objective === 'find_place' },
  gate_open: { node: 'ep3_meet', when: (s) => s.episode === 3 && !!s.flags.at_gate },
  'call_end:call_raka_meet': { node: 'ep3_decide', when: (s) => s.episode === 3 },
}
