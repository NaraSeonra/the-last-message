import type { Action, Decision, GameState } from '../types'
import { say } from './prompts'

type Node = Action[] | ((s: GameState) => Action[])

/** Story beats. Each node is a sequence of timed actions queued by the engine. */
export const NODES: Record<string, Node> = {
  // ── Episode 1: Pesan Terakhir ───────────────────────────────────────────
  ep1_start: [
    { t: 'objective', id: 'unlock' },
    { t: 'wait', delay: 1800 },
    { t: 'msg', thread: 'raka', from: 'fake', text: 'Nar.', delay: 800 },
    ...say('raka', 'fake', 'ini aku.', 'jangan bilang siapa-siapa dulu.', 'kamu masih simpan yang kutitipin, kan?'),
    { t: 'prompt', id: 'fake1' },
  ],
  ep1_group: [
    ...say('grup', 'bima', 'WOI ada yang masih bangun?'),
    ...say('grup', 'tiara', 'kenapa bim'),
    ...say('grup', 'bima', 'nomor raka barusan ONLINE 😳'),
    ...say('grup', 'sinta', 'serius??'),
    ...say('grup', 'kevin', 'Jangan bikin panik. Mungkin HP-nya ditemukan orang.', 'Ada yang dichat sama nomor Raka? Nara?'),
    { t: 'objective', id: 'group' },
    { t: 'prompt', id: 'group1' },
  ],
  ep1_unknown: [
    ...say('unknown', 'unknown', 'jangan balas nomor Raka lagi.', 'HP-ku diambil orang.', 'kalau ini benar kamu, jawab:', 'di mana kita pertama kali ngobrol?'),
    { t: 'objective', id: 'prove' },
    { t: 'prompt', id: 'prove' },
    { t: 'wait', delay: 5000 },
    ...say('sinta', 'sinta', 'nar kamu oke?', 'aku takut. kenapa nomor raka tiba-tiba aktif 😭'),
    { t: 'prompt', id: 'sinta1' },
  ],
  ep1_proved: [
    ...say('unknown', 'raka', '…oke. ini aku. Raka.', 'dengar baik-baik.', 'ada yang jual soal ujian di sekolah. namanya Proyek Lentera.', 'aku punya buktinya. makanya aku ngilang.'),
    { t: 'unlock', cat: 'recordings', id: 'rec_raka1' },
    { t: 'msg', thread: 'unknown', from: 'raka', text: 'Pesan suara (0:34)', kind: 'voice', ref: 'rec_raka1' },
    ...say('unknown', 'raka', 'putar pas nggak ada orang.'),
    { t: 'objective', id: 'listen' },
  ],
  ep1_after_rec: [
    { t: 'flag', key: 'heard1' },
    ...say('unknown', 'raka', 'sudah dengar?'),
    { t: 'objective', id: 'after_rec' },
    { t: 'prompt', id: 'afterRec' },
  ],

  // ── Episode 2: Arsip Lentera ────────────────────────────────────────────
  ep2_start: [
    ...say('ibu', 'ibu', 'Nak, Mama pulang malam lagi. Makan dulu ya ❤️'),
    { t: 'wait', delay: 2500 },
    {
      t: 'unlock',
      cat: 'emails',
      id: 'em_lentera',
      notify: { app: 'email', title: 'Raka Pradipta (terjadwal)', body: 'Kalau aku nggak sempat · 📎 LENTERA.zip' },
    },
    { t: 'unlock', cat: 'files', id: 'f_zip' },
    { t: 'unlock', cat: 'events', id: 'c_bk' },
    { t: 'objective', id: 'open_zip' },
    {
      t: 'unlock',
      cat: 'notes',
      id: 'n_untukN',
      delay: 3000,
      notify: { app: 'notes', title: 'Raka membagikan catatan', body: '"Untuk N 🌙"' },
    },
    { t: 'unlock', cat: 'emails', id: 'em_spam_lentera', delay: 6000 },
  ],
  ep2_zip: [
    { t: 'unlock', cat: 'gallery', id: 'g_kunci' },
    { t: 'unlock', cat: 'files', id: 'f_kunci' },
    { t: 'unlock', cat: 'files', id: 'f_transfer' },
    { t: 'unlock', cat: 'files', id: 'f_bk' },
    { t: 'unlock', cat: 'recordings', id: 'rec_bk' },
    { t: 'flag', key: 'has_evidence' },
    { t: 'objective', id: 'listen_bk' },
    ...say('unknown', 'raka', 'kamu berhasil buka?', 'dengar rekaman ruang BK. kamu bakal ngerti kenapa aku nggak bisa percaya siapa-siapa.'),
  ],
  ep2_fake: [
    { t: 'unlock', cat: 'posts', id: 'p_kevin_sorry' },
    ...say('raka', 'fake', 'Nar.', 'arsipnya udah kamu buka ya?', 'kirim ke aku aja. biar aman.'),
    { t: 'objective', id: 'fake2' },
    { t: 'prompt', id: 'fake2' },
  ],
  ep2_call: [
    { t: 'objective', id: 'sinta_call' },
    { t: 'call', id: 'call_sinta1', delay: 2500 },
  ],
  ep2_kevin: [
    ...say('kevin', 'kevin', 'Nar.', 'Aku tahu kamu buka arsip itu.', 'Tolong dengerin aku dulu sebelum kamu lakuin apa-apa.'),
    { t: 'objective', id: 'kevin' },
    { t: 'prompt', id: 'kevin1' },
  ],
  ep2_end: [
    ...say('unknown', 'raka', 'Nar, mereka nyari aku ke rumah nenek.', 'aku pindah malam ini.', 'kalau mau ketemu, cari aku di tempat kita lihat gerhana.', 'jangan tulis nama tempatnya di chat.'),
    { t: 'episodeEnd', episode: 2, delay: 4500 },
  ],

  // ── Episode 3: Tempat Gerhana ───────────────────────────────────────────
  ep3_start: (s) => [
    { t: 'unlock', cat: 'events', id: 'c_gerhana' },
    ...say('grup', 'tiara', 'kalian liat postingan kevin jam 3 pagi kemarin?'),
    ...say('grup', 'bima', 'dia nggak masuk sekolah hari ini. HP-nya mati.'),
    ...(s.flags.told_sinta
      ? say('sinta', 'sinta', 'nar, aku udah bilang om-ku. kalau buktinya siap, kirim ke redaksi@suarakota.id', 'dia janji lindungi identitas kalian 🤍')
      : say('sinta', 'sinta', 'nar… kamu masih nggak mau cerita? 🥺')),
    ...say('unknown', 'raka', 'aku sudah di sana.', 'hati-hati, jangan sampai diikuti.'),
    { t: 'objective', id: 'find_place' },
  ],
  ep3_wrong: [...say('unknown', 'raka', 'bukan di situ, Nar. ingat foto kita.')],
  ep3_gate: [
    { t: 'flag', key: 'at_gate' },
    ...say('unknown', 'raka', 'kamu sudah di gerbang?', 'gemboknya aku ganti. kodenya: alarm yang kupasang di HP-mu waktu kemah.', 'kalikan dua. empat digit.'),
    { t: 'objective', id: 'gate' },
  ],
  ep3_meet: [
    { t: 'flag', key: 'gate_open' },
    { t: 'objective', id: 'raka_call' },
    { t: 'call', id: 'call_raka_meet', delay: 2000 },
  ],
  ep3_decide: [
    ...say('unknown', 'raka', 'sekarang kamu yang pegang buktinya.', 'aku percaya kamu. mau kita apakan?'),
    { t: 'objective', id: 'decide' },
    { t: 'prompt', id: 'final' },
  ],
}

export const DECISION_NODES: Record<Decision, Action[]> = {
  journalist: [
    ...say('unknown', 'raka', 'oke. kita kirim ke Suara Kota.', 'apa pun yang terjadi setelah ini… makasih, Nar.'),
    { t: 'objective', id: 'done' },
    { t: 'ending', delay: 4000 },
  ],
  social: [
    ...say('unknown', 'raka', 'Nar, tunggu—', '…sudah terlanjur ya.', 'semoga mereka nggak tahu aku di mana.'),
    { t: 'objective', id: 'done' },
    { t: 'ending', delay: 4000 },
  ],
  kevin: [
    ...say('kevin', 'kevin', 'Aku terima, Nar.', 'Percaya sama aku.'),
    { t: 'objective', id: 'done' },
    { t: 'ending', delay: 4000 },
  ],
  delete: [
    ...say('unknown', 'raka', '…kalau itu maumu.', 'mungkin memang ada hal yang lebih baik tetap gelap.'),
    { t: 'objective', id: 'done' },
    { t: 'ending', delay: 4000 },
  ],
}
