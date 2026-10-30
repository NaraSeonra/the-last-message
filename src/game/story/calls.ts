import { CHARACTERS } from '../data/characters'
import type { CallDef, CharId, GameState } from '../types'

export const CALLS: Record<string, CallDef> = {
  call_sinta1: {
    id: 'call_sinta1',
    who: 'sinta',
    steps: [
      { s: 'sinta', text: 'Nar! Akhirnya diangkat.' },
      { s: 'sinta', text: 'Tadi Kevin dipanggil ke ruang BK. Lama banget. Pas keluar mukanya pucat.' },
      { s: 'sinta', text: 'Kamu tahu sesuatu soal Raka, kan? Dari semalam kamu aneh.' },
      {
        choice: [
          { label: 'Ceritakan semuanya pada Sinta', actions: [{ t: 'rel', who: 'sinta', delta: 2 }, { t: 'flag', key: 'told_sinta' }], goto: 4 },
          { label: 'Bilang kamu nggak tahu apa-apa', actions: [{ t: 'rel', who: 'sinta', delta: -1 }], goto: 8 },
          { label: 'Minta Sinta menunggu sampai besok', actions: [{ t: 'rel', who: 'sinta', delta: 1 }], goto: 11 },
        ],
      },
      { s: 'nara', text: 'Raka masih hidup, Sin. Dia nemu bukti jual-beli soal UAS.' },
      { s: 'sinta', text: 'Ya ampun… pantes semua orang aneh.' },
      { s: 'sinta', text: 'Oke. Aku di pihakmu. Om-ku redaktur di Suara Kota. Kalau butuh, kirim ke redaksi@suarakota.id.' },
      { end: true },
      { s: 'nara', text: 'Aku nggak tahu apa-apa, Sin. Beneran.' },
      { s: 'sinta', text: '…Oke. Kalau kamu berubah pikiran, aku ada.' },
      { end: true },
      { s: 'nara', text: 'Kasih aku waktu sampai besok, ya. Aku janji cerita.' },
      { s: 'sinta', text: 'Janji ya. Jangan hadapi ini sendirian.' },
      { end: true },
    ],
    onMissed: [
      { t: 'msg', thread: 'sinta', from: 'sinta', text: 'nar angkat dong 😭 penting' },
      { t: 'call', id: 'call_sinta1', delay: 9000 },
    ],
  },
  call_raka_meet: {
    id: 'call_raka_meet',
    who: 'raka',
    label: '+62 857-1947-0447',
    steps: [
      { s: 'raka', text: 'Nar. Aku lihat cahaya senter HP-mu dari atas.' },
      { s: 'raka', text: 'Naik tangga putar. Hati-hati, anak tangga ketujuh patah.' },
      { s: 'operator', text: '(Kamu menaiki tangga berkarat. Di atap, Raka duduk di bawah kubah yang retak, memeluk tasnya.)' },
      { s: 'raka', text: 'Kamu datang.' },
      {
        choice: [
          { label: 'Peluk Raka', actions: [{ t: 'rel', who: 'raka', delta: 1 }], goto: 5 },
          { label: '"Kenapa kamu nggak bilang dari awal?!"', goto: 8 },
          { label: '"Kevin dipaksa, Ka. Dia juga korban."', actions: [{ t: 'flag', key: 'told_raka_kevin' }], goto: 11 },
        ],
      },
      { s: 'nara', text: 'Jangan pernah ngilang kayak gitu lagi.' },
      { s: 'raka', text: 'Maaf, Nar. Aku takut kamu ikut kena.' },
      { jump: 14 },
      { s: 'nara', text: 'Kenapa kamu nggak bilang dari awal?!' },
      { s: 'raka', text: 'Karena aku nggak tahu siapa yang bisa dipercaya. Bahkan HP-ku sendiri.' },
      { jump: 14 },
      { s: 'nara', text: 'Kevin dipaksa, Ka. Pak Gunawan ngancam beasiswanya.' },
      { s: 'raka', text: '…Jadi dia juga korban. Aku nggak nyangka.' },
      { jump: 14 },
      { s: 'raka', text: 'Bukti Lentera sekarang lengkap di HP-mu. UAS tinggal enam hari.' },
      { s: 'raka', text: 'Kalau kita salah langkah, Pak Gunawan bisa hapus semuanya, dan kita yang dituduh.' },
      { s: 'raka', text: 'Aku kirim chat. Putuskan baik-baik, Nar.' },
      { end: true },
    ],
    onMissed: [
      { t: 'msg', thread: 'unknown', from: 'raka', text: 'Nar? angkat. aku telepon lagi.' },
      { t: 'call', id: 'call_raka_meet', delay: 8000 },
    ],
  },
  call_raka_off: {
    id: 'call_raka_off',
    who: 'operator',
    label: 'Raka Pradipta',
    steps: [{ s: 'operator', text: 'Nomor yang Anda tuju sedang tidak aktif atau berada di luar jangkauan. Cobalah beberapa saat lagi.' }, { end: true }],
  },
  call_unknown_none: {
    id: 'call_unknown_none',
    who: 'operator',
    label: '+62 857-1947-0447',
    steps: [{ s: 'operator', text: '(Nada sambung… tidak diangkat.)' }, { end: true }],
  },
  call_unknown_raka: {
    id: 'call_unknown_raka',
    who: 'raka',
    label: '+62 857-1947-0447',
    steps: [{ s: 'raka', text: '(berbisik) Jangan telepon, Nar. Bisa dilacak. Chat aja, ya.' }, { end: true }],
  },
  call_sinta_idle: {
    id: 'call_sinta_idle',
    who: 'sinta',
    steps: [
      { s: 'sinta', text: 'Halo Nar? Aku lagi di angkot, berisik banget.' },
      { s: 'sinta', text: 'Nanti aku telepon balik ya. Kamu jaga diri!' },
      { end: true },
    ],
  },
  call_kevin_idle: {
    id: 'call_kevin_idle',
    who: 'kevin',
    steps: [{ s: 'kevin', text: 'Nar… aku nggak bisa ngomong sekarang. Chat aja.' }, { end: true }],
  },
  call_mama: {
    id: 'call_mama',
    who: 'ibu',
    steps: [
      { s: 'ibu', text: 'Halo sayang? Mama lagi di bangsal.' },
      { s: 'ibu', text: 'Kamu baik-baik aja kan? Suaramu kayak habis nangis.' },
      {
        choice: [
          { label: '"Aku baik, Ma."', goto: 3 },
          { label: '"Ma… temanku hilang."', goto: 6 },
        ],
      },
      { s: 'nara', text: 'Aku baik, Ma.' },
      { s: 'ibu', text: 'Ya sudah. Kunci pintu, jangan begadang. Mama sayang kamu.' },
      { end: true },
      { s: 'nara', text: 'Ma… Raka hilang. Aku takut.' },
      { s: 'ibu', text: 'Mama tahu, Nak. Kalau ada yang bikin kamu takut, jangan dipendam sendiri. Cerita ke orang yang kamu percaya, ya.' },
      { end: true },
    ],
  },
  call_gunawan: {
    id: 'call_gunawan',
    who: 'gunawan',
    steps: [
      { s: 'gunawan', text: 'Halo? Dengan siapa ini?' },
      {
        choice: [
          { label: 'Tutup telepon tanpa bicara', goto: 2 },
          { label: '"Saya tahu soal Lentera, Pak."', actions: [{ t: 'leak' }, { t: 'flag', key: 'taunted_gunawan' }], goto: 4 },
        ],
      },
      { s: 'operator', text: '(Kamu menutup telepon. Jantungmu berdebar.)' },
      { end: true },
      { s: 'nara', text: 'Saya tahu soal Lentera, Pak.' },
      { s: 'gunawan', text: '…Siapa ini? Halo? HALO?' },
      { end: true },
    ],
  },
  call_friend_idle: {
    id: 'call_friend_idle',
    who: 'bima',
    steps: [{ s: 'bima', text: 'Nar? Bentar, lagi latihan band. Ntar aku chat!' }, { end: true }],
  },
  call_tiara_idle: {
    id: 'call_tiara_idle',
    who: 'tiara',
    steps: [{ s: 'tiara', text: 'Halooo Nar! Aduh aku lagi ngerjain notulen. Chat aja ya 💕' }, { end: true }],
  },
  call_112: {
    id: 'call_112',
    who: 'operator',
    label: 'Darurat 112',
    steps: [{ s: 'operator', text: 'Ini hanya simulasi di dalam game. Dalam keadaan darurat sungguhan, hubungi 112 dari ponselmu sendiri.' }, { end: true }],
  },
  call_888: {
    id: 'call_888',
    who: 'operator',
    label: 'Layanan 888',
    steps: [{ s: 'operator', text: 'Sisa kuota internet Anda 11,2 GB, berlaku hingga 30 November 2026. Terima kasih.' }, { end: true }],
  },
  call_none: {
    id: 'call_none',
    who: 'operator',
    label: 'Nomor tidak dikenal',
    steps: [{ s: 'operator', text: 'Nomor yang Anda tuju tidak terdaftar. Periksa kembali nomor tujuan.' }, { end: true }],
  },
}

export const digits = (n: string) => n.replace(/\D/g, '').replace(/^62/, '0')

/** Picks which call plays when the player dials a number. */
export function resolveDial(number: string, s: GameState): { callId: string; who: CharId | string } {
  const d = digits(number)
  if (d === '112') return { callId: 'call_112', who: 'operator' }
  if (d === '888') return { callId: 'call_888', who: 'operator' }
  const match = (Object.keys(CHARACTERS) as CharId[]).find((c) => c !== 'fake' && digits(CHARACTERS[c].number) === d)
  switch (match) {
    case 'raka':
      return { callId: 'call_raka_off', who: 'raka' }
    case 'unknown':
      if (s.objective === 'raka_call') return { callId: 'call_raka_meet', who: 'unknown' }
      return { callId: s.flags.proved ? 'call_unknown_raka' : 'call_unknown_none', who: 'unknown' }
    case 'sinta':
      return { callId: s.objective === 'sinta_call' ? 'call_sinta1' : 'call_sinta_idle', who: 'sinta' }
    case 'kevin':
      return { callId: 'call_kevin_idle', who: 'kevin' }
    case 'ibu':
      return { callId: 'call_mama', who: 'ibu' }
    case 'gunawan':
      return { callId: 'call_gunawan', who: 'gunawan' }
    case 'bima':
      return { callId: 'call_friend_idle', who: 'bima' }
    case 'tiara':
      return { callId: 'call_tiara_idle', who: 'tiara' }
  }
  const user = s.contacts.find((c) => digits(c.number) === d)
  return { callId: 'call_none', who: user?.name ?? number }
}
