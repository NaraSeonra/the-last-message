import { at, dateMinutes } from '../clock'
import type { ChatMessage, ThreadId } from '../types'

let n = 0
const m = (from: ChatMessage['from'], text: string, time: number, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  id: `h${n++}`,
  from,
  text,
  time,
  ...extra,
})

/** Chat history already on Nara's phone when the game begins. */
export function initialThreads(): Record<ThreadId, ChatMessage[]> {
  return {
    grup: [
      m('tiara', 'guys besok upacara pake seragam lengkap ya', at(0, 19, 2)),
      m('bima', 'raka masih belum ada kabar?', at(0, 19, 40)),
      m('sinta', 'belum 😭 mamanya udah lapor polisi', at(0, 19, 41)),
      m('kevin', 'Teman-teman, Pak Gunawan minta kita jangan menyebar spekulasi di grup. Biar pihak sekolah yang urus.', at(0, 19, 55)),
      m('bima', 'spekulasi apaan, temen kita ilang vin', at(0, 19, 56)),
      m('tiara', 'udah udah jangan ribut', at(0, 20, 3)),
    ],
    raka: [
      m('nara', 'ka, kamu di mana? katanya mau nunjukin sesuatu abis penutupan', dateMinutes(2026, 10, 24, 21, 30)),
      m('raka', 'bentar. aku nemu sesuatu. nanti kukirim fotonya', dateMinutes(2026, 10, 24, 21, 52)),
      m('raka', '', dateMinutes(2026, 10, 24, 21, 58), { kind: 'image', ref: 'g_musicroom' }),
      m('raka', 'ada yang aneh di ruang musik. nanti aku cerita.', dateMinutes(2026, 10, 24, 21, 58)),
      m('nara', 'aneh gimana??', dateMinutes(2026, 10, 24, 22, 10)),
      m('nara', 'ka?', dateMinutes(2026, 10, 25, 7, 4)),
      m('nara', 'RAKA bales plis', dateMinutes(2026, 10, 25, 20, 11)),
      m('nara', 'semua orang nyariin kamu', at(0, 21, 3)),
    ],
    unknown: [],
    sinta: [
      m('sinta', 'nar aku bikin poster pencarian, bantu share ya', at(0, 7, 31)),
      m('sinta', '', at(0, 7, 31), { kind: 'image', ref: 'g_missing' }),
      m('nara', 'udah aku share 🙏', at(0, 7, 50)),
    ],
    kevin: [
      m('kevin', 'Nara, kamu kelompok fisika sama Raka kan? Kalau dia ngehubungin kamu, kabari aku dulu ya. Biar OSIS bisa koordinasi.', at(0, 12, 10)),
      m('nara', 'oke vin', at(0, 12, 30)),
    ],
    ibu: [
      m('ibu', 'Nak, Mama shift malam sampai besok pagi. Pintu dikunci ya ❤️', at(0, 18, 30)),
      m('nara', 'iya ma', at(0, 18, 34)),
    ],
    operator: [
      m('operator', 'Paket internet 15GB Anda aktif hingga 30/11/2026. Info: *888#', dateMinutes(2026, 10, 1, 8, 0)),
    ],
  }
}
