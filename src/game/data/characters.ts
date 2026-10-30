import type { CharId, ThreadId } from '../types'

export interface Character {
  id: CharId
  name: string
  short: string
  number: string
  email?: string
  /** Tailwind-free hex so avatars stay consistent everywhere. */
  color: string
  bio: string
  social?: string
}

export const CHARACTERS: Record<CharId, Character> = {
  nara: {
    id: 'nara',
    name: 'Nara Kirana',
    short: 'Nara',
    number: '0812-1402-2009',
    email: 'nara.kirana@mail.id',
    color: '#7dd3fc',
    bio: 'Kamu. Siswi kelas XI IPA 2, SMA Cendana.',
    social: 'nara.ka',
  },
  raka: {
    id: 'raka',
    name: 'Raka Pradipta',
    short: 'Raka',
    number: '0812-4471-0927',
    email: 'raka.pradipta@mail.id',
    color: '#fbbf24',
    bio: 'Sahabat sejak MPLS. Suka bintang, benci matematika. Hilang sejak Sabtu malam.',
    social: 'raka.pradipta',
  },
  fake: {
    id: 'fake',
    name: 'Raka Pradipta',
    short: 'Raka',
    number: '0812-4471-0927',
    color: '#fbbf24',
    bio: 'Nomor Raka.',
  },
  unknown: {
    id: 'unknown',
    name: '+62 857-1947-0447',
    short: 'Tak Dikenal',
    number: '0857-1947-0447',
    color: '#a78bfa',
    bio: 'Nomor tidak tersimpan.',
  },
  sinta: {
    id: 'sinta',
    name: 'Sinta Ayudia',
    short: 'Sinta',
    number: '0813-2211-0505',
    email: 'sinta.ayu@mail.id',
    color: '#f472b6',
    bio: 'Sahabat Nara. Cerewet, setia, takut gelap.',
    social: 'sintaa.ay',
  },
  kevin: {
    id: 'kevin',
    name: 'Kevin Aditya',
    short: 'Kevin',
    number: '0811-9090-3131',
    email: 'kevin.aditya@mail.id',
    color: '#34d399',
    bio: 'Ketua OSIS. Penerima beasiswa prestasi. Terlalu tenang.',
    social: 'kevin.ketos',
  },
  bima: {
    id: 'bima',
    name: 'Bima Sakti',
    short: 'Bima',
    number: '0857-3030-1212',
    color: '#60a5fa',
    bio: 'Anak band. Selalu online jam 2 pagi.',
    social: 'bimasakti_',
  },
  tiara: {
    id: 'tiara',
    name: 'Tiara Putri',
    short: 'Tiara',
    number: '0896-4545-7878',
    color: '#fb923c',
    bio: 'Sekretaris kelas. Tahu semua gosip.',
    social: 'tiaraaputri',
  },
  ibu: {
    id: 'ibu',
    name: 'Mama',
    short: 'Mama',
    number: '0812-7000-1975',
    color: '#f87171',
    bio: 'Mama. Perawat shift malam.',
  },
  gunawan: {
    id: 'gunawan',
    name: 'Pak Gunawan (BK)',
    short: 'Pak Gunawan',
    number: '0811-2020-4747',
    email: 'gunawan.hadi@smacendana.sch.id',
    color: '#94a3b8',
    bio: 'Guru BK & koordinator ujian SMA Cendana.',
  },
  operator: {
    id: 'operator',
    name: 'INFO Seluler',
    short: 'INFO',
    number: '888',
    color: '#64748b',
    bio: 'Layanan operator.',
  },
}

export const CONTACT_ORDER: CharId[] = ['ibu', 'raka', 'sinta', 'kevin', 'bima', 'tiara', 'gunawan']

export interface ThreadDef {
  id: ThreadId
  title: string
  char: CharId
  group?: CharId[]
  subtitle?: string
}

export const THREADS: Record<ThreadId, ThreadDef> = {
  grup: {
    id: 'grup',
    title: 'XI IPA 2 🌙',
    char: 'bima',
    group: ['sinta', 'kevin', 'bima', 'tiara'],
    subtitle: 'Sinta, Kevin, Bima, Tiara, Kamu',
  },
  raka: { id: 'raka', title: 'Raka Pradipta', char: 'fake' },
  unknown: { id: 'unknown', title: '+62 857-1947-0447', char: 'unknown' },
  sinta: { id: 'sinta', title: 'Sinta Ayudia', char: 'sinta' },
  kevin: { id: 'kevin', title: 'Kevin Aditya', char: 'kevin' },
  ibu: { id: 'ibu', title: 'Mama', char: 'ibu' },
  operator: { id: 'operator', title: 'INFO Seluler', char: 'operator' },
}

/** Lines a character sends when the player writes outside of a story prompt. */
export const IDLE_REPLIES: Partial<Record<ThreadId, { from: CharId; lines: string[] }>> = {
  sinta: {
    from: 'sinta',
    lines: ['iya Nar? 🥺', 'aku masih kepikiran Raka terus', 'kabarin aku ya kalau ada apa-apa', 'Nar jangan begadang 😭'],
  },
  kevin: { from: 'kevin', lines: ['Nanti dulu ya, Nar.', 'Aku lagi rapat OSIS.', '…'] },
  ibu: { from: 'ibu', lines: ['Iya sayang. Mama masih di RS.', 'Kunci pintu ya Nak.', 'Jangan lupa makan ❤️'] },
  grup: { from: 'tiara', lines: ['hm?', 'Nara ngetik apa sih 😶', 'udah tidur woi besok sekolah'] },
  raka: { from: 'fake', lines: ['?', 'nanti aja', 'jangan banyak tanya dulu'] },
  unknown: { from: 'raka', lines: ['jangan chat sembarangan dulu, Nar.', 'baterai tinggal sedikit. nanti aku kabari.'] },
  operator: { from: 'operator', lines: ['Maaf, layanan ini tidak menerima balasan.'] },
}
