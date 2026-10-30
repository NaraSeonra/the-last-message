// Static in-game content for every virtual app. Items with `locked: true`
// only appear once the story unlocks their id (see GameState.unlocked).
import { at, dateMinutes } from '../clock'
import type { Alarm, CharId } from '../types'

/** Netlify Image CDN URL for a generated asset in /public/img. */
export function cdn(file: string, w = 600) {
  return `/.netlify/images?url=/img/${file}&w=${w}&fm=webp&q=70`
}

// ─── Galeri ────────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: string
  album: 'Kamera' | '2024' | '2025' | 'Kiriman' | 'Arsip'
  title: string
  caption: string
  time: number
  location?: string
  img?: string
  art?: 'poster' | 'doc' | 'missing'
  /** Payload revealed when scanned with the camera's Pindai mode. */
  qr?: string
  locked?: boolean
}

export const GALLERY: GalleryItem[] = [
  {
    id: 'g_library',
    album: '2024',
    title: 'IMG_20240812_1021.jpg',
    caption: 'hari pertama MPLS. ketemu anak aneh yang baca buku astronomi di perpus lama 🙄📚',
    time: dateMinutes(2024, 8, 12, 10, 21),
    location: 'SMA Cendana · Perpustakaan Lama (Gedung B)',
    img: 'library.png',
  },
  {
    id: 'g_eclipse',
    album: '2025',
    title: 'IMG_20250908_0112.jpg',
    caption: 'gerhana bulan total. kata Raka ini "tempat rahasia" kita. jangan bilang siapa-siapa.',
    time: dateMinutes(2025, 9, 8, 1, 12),
    location: 'Observatorium Lama · Bukit Kenanga',
    img: 'eclipse.png',
  },
  {
    id: 'g_poster',
    album: 'Kiriman',
    title: 'poster_festival.jpg',
    caption: 'Dari grup kelas. Ada kode QR kecil di pojok bawah, bukan punya OSIS… siapa yang tempel?',
    time: dateMinutes(2026, 10, 22, 19, 4),
    location: 'Mading SMA Cendana',
    art: 'poster',
    qr: 'lentera.arsip/masuk',
  },
  {
    id: 'g_musicroom',
    album: 'Kiriman',
    title: 'IMG-20261024-WA0012.jpg',
    caption: 'Dikirim Raka, 24 Okt 21:58: "ada yang aneh di ruang musik. nanti aku cerita."',
    time: dateMinutes(2026, 10, 24, 21, 58),
    location: 'SMA Cendana · Ruang Musik, Lantai 3',
    img: 'musicroom.png',
  },
  {
    id: 'g_missing',
    album: 'Kiriman',
    title: 'cari_raka.jpg',
    caption: 'Poster pencarian yang dibuat Sinta.',
    time: dateMinutes(2026, 10, 26, 7, 30),
    art: 'missing',
  },
  {
    id: 'g_kunci',
    album: 'Arsip',
    title: 'kunci_jawaban_UAS.jpg',
    caption: 'Dari arsip LENTERA. Kunci jawaban UAS lengkap dengan cap "LENTERA" dan paraf G.H.',
    time: dateMinutes(2026, 10, 24, 20, 41),
    location: 'Ruang BK, SMA Cendana',
    art: 'doc',
    locked: true,
  },
]

// ─── Lingkar (media sosial) ────────────────────────────────────────────────
export interface SocialUser {
  handle: string
  name: string
  char?: CharId
  bio: string
  color: string
  followers: string
}

export const SOCIAL_USERS: SocialUser[] = [
  { handle: 'raka.pradipta', name: 'Raka 🌒', char: 'raka', bio: 'pengamat langit amatir · XI IPA 2 · kalau hilang, cari di atas', color: '#fbbf24', followers: '812' },
  { handle: 'sintaa.ay', name: 'Sinta Ayudia', char: 'sinta', bio: 'ig: jangan. tiktok: jangan juga 🫶', color: '#f472b6', followers: '1.204' },
  { handle: 'kevin.ketos', name: 'Kevin Aditya', char: 'kevin', bio: 'Ketua OSIS SMA Cendana 2026/2027 · Penerima Beasiswa Prestasi', color: '#34d399', followers: '2.430' },
  { handle: 'bimasakti_', name: 'bima', char: 'bima', bio: 'drummer @senjakala.band', color: '#60a5fa', followers: '640' },
  { handle: 'tiaraaputri', name: 'Tiara ✨', char: 'tiara', bio: 'sekretaris kelas, bukan sekretaris hidupmu', color: '#fb923c', followers: '977' },
  { handle: 'osis.cendana', name: 'OSIS SMA Cendana', bio: 'Akun resmi OSIS SMA Cendana', color: '#22d3ee', followers: '3.118' },
  { handle: 'suarakota.id', name: 'Suara Kota', bio: 'Berita lokal terpercaya. Tips: redaksi@suarakota.id', color: '#e11d48', followers: '48,2 rb' },
  { handle: 'nara.ka', name: 'Nara', char: 'nara', bio: 'hidup cuma sekali, jangan dibikin ribet.', color: '#7dd3fc', followers: '358' },
]

export interface SocialPost {
  id: string
  handle: string
  text: string
  time: number
  likes: number
  img?: string
  art?: GalleryItem['art']
  comments: { handle: string; text: string }[]
  locked?: boolean
}

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'p_kevin_sorry',
    handle: 'kevin.ketos',
    text: 'maaf.',
    time: at(1, 3, 12),
    likes: 4,
    comments: [
      { handle: 'tiaraaputri', text: 'vin? kamu kenapa' },
      { handle: 'bimasakti_', text: 'jam 3 pagi bro…' },
    ],
    locked: true,
  },
  {
    id: 'p_suara',
    handle: 'suarakota.id',
    text: 'Seorang siswa SMA Cendana, RP (17), dilaporkan hilang sejak Sabtu (24/10) malam usai festival sekolah. Punya informasi? Kirim ke redaksi@suarakota.id — identitas sumber kami lindungi.',
    time: at(0, 18, 5),
    likes: 1290,
    comments: [
      { handle: 'sintaa.ay', text: 'tolong bantu sebar 🙏🙏' },
      { handle: 'kevin.ketos', text: 'Semoga cepat ditemukan. OSIS siap bantu.' },
    ],
  },
  {
    id: 'p_sinta_cari',
    handle: 'sintaa.ay',
    text: '2 hari. pulang, Ka. kita nggak marah, kita cuma khawatir. #CariRaka',
    time: at(0, 7, 40),
    likes: 431,
    art: 'missing',
    comments: [{ handle: 'nara.ka', text: '🙏' }],
  },
  {
    id: 'p_osis_fest',
    handle: 'osis.cendana',
    text: 'FESTIVAL CENDANA 2026 sukses besar! Terima kasih panitia & seluruh siswa 🎉 Sampai jumpa di UAS, 3 November!',
    time: dateMinutes(2026, 10, 24, 23, 0),
    likes: 655,
    art: 'poster',
    comments: [{ handle: 'kevin.ketos', text: 'Kerja keras kalian luar biasa.' }],
  },
  {
    id: 'p_raka_lentera',
    handle: 'raka.pradipta',
    text: 'kebenaran itu kayak lentera. kecil, tapi bikin orang yang sembunyi di gelap jadi panik.',
    time: dateMinutes(2026, 10, 23, 22, 17),
    likes: 37,
    comments: [
      { handle: 'bimasakti_', text: 'filsuf jam 10 malem' },
      { handle: 'kevin.ketos', text: 'Hapus, Ka.' },
    ],
  },
  {
    id: 'p_kevin_tanggung',
    handle: 'kevin.ketos',
    text: 'Ketua OSIS bukan cuma jabatan. Itu tanggung jawab. Terima kasih Pak Gunawan atas bimbingannya.',
    time: dateMinutes(2026, 10, 1, 15, 0),
    likes: 802,
    comments: [{ handle: 'tiaraaputri', text: 'ketos teladan 👏' }],
  },
  {
    id: 'p_raka_locker',
    handle: 'raka.pradipta',
    text: 'loker 27. markas rahasia sejak kelas X. isinya? rahasia negara 🤫',
    time: dateMinutes(2026, 3, 2, 12, 30),
    likes: 58,
    img: 'locker.png',
    comments: [
      { handle: 'nara.ka', text: 'isinya kaos kaki bau' },
      { handle: 'raka.pradipta', text: '@nara.ka FITNAH' },
    ],
  },
  {
    id: 'p_raka_eclipse',
    handle: 'raka.pradipta',
    text: 'gerhana bulan total dari atap Observatorium Lama. tempat paling sunyi di kota ini 🌒 (kamu tau siapa yang nemenin)',
    time: dateMinutes(2025, 9, 8, 2, 0),
    likes: 96,
    img: 'eclipse.png',
    comments: [{ handle: 'sintaa.ay', text: 'CIEEE siapa tuh' }],
  },
]

// ─── Email ─────────────────────────────────────────────────────────────────
export interface EmailItem {
  id: string
  folder: 'inbox' | 'spam'
  from: string
  fromAddr: string
  subject: string
  body: string
  time: number
  attachments?: { name: string; file: string }[]
  locked?: boolean
}

export const EMAILS: EmailItem[] = [
  {
    id: 'em_lentera',
    folder: 'inbox',
    from: 'Raka Pradipta (terjadwal)',
    fromAddr: 'raka.pradipta@mail.id',
    subject: 'Kalau aku nggak sempat',
    body: 'Nar,\n\nEmail ini kujadwalkan terkirim otomatis. Kalau sampai ke kamu, berarti aku belum bisa pulang.\n\nDi lampiran ada arsip yang mereka cari. Aku kunci pakai sandi. Petunjuknya ada di catatan yang kubagikan ke kamu.\n\nJangan kirim ke siapa pun sebelum kamu yakin.\n\n— R',
    time: at(1, 16, 12),
    attachments: [{ name: 'LENTERA.zip', file: 'f_zip' }],
    locked: true,
  },
  {
    id: 'em_uas',
    folder: 'inbox',
    from: 'Tata Usaha SMA Cendana',
    fromAddr: 'tu@smacendana.sch.id',
    subject: 'Jadwal Ujian Akhir Semester Ganjil 2026',
    body: 'Yth. Siswa/i SMA Cendana,\n\nUAS Ganjil dimulai Senin, 3 November 2026. Soal disusun dan diamankan oleh Koordinator Ujian, Bapak Gunawan Hadi, S.Pd.\n\nJadwal lengkap terlampir.\n\nHormat kami,\nTata Usaha',
    time: dateMinutes(2026, 10, 20, 9, 0),
    attachments: [{ name: 'jadwal_UAS.pdf', file: 'f_jadwal' }],
  },
  {
    id: 'em_beasiswa',
    folder: 'inbox',
    from: 'Panitia Beasiswa Prestasi',
    fromAddr: 'beasiswa@smacendana.sch.id',
    subject: 'Pendaftaran Beasiswa Prestasi 2027 dibuka',
    body: 'Pendaftaran Beasiswa Prestasi 2027 dibuka hingga 30 November. Seluruh rekomendasi diberikan melalui Guru BK.\n\nPenerima tahun ini (Kevin Aditya, XI IPA 2) wajib menjaga nilai dan rekomendasi agar beasiswa tidak dicabut.',
    time: dateMinutes(2026, 10, 15, 8, 0),
  },
  {
    id: 'em_lingkar',
    folder: 'inbox',
    from: 'Lingkar',
    fromAddr: 'notifikasi@lingkar.app',
    subject: 'raka.pradipta menyukai fotomu',
    body: 'raka.pradipta menyukai fotomu dan 2 lainnya.\n\nBuka Lingkar untuk melihat.',
    time: dateMinutes(2026, 10, 24, 22, 3),
  },
  {
    id: 'em_spam_hadiah',
    folder: 'spam',
    from: 'Undian Nasional',
    fromAddr: 'hadiah@undian-resmi.biz',
    subject: 'SELAMAT!! Anda menang 1 unit motor',
    body: 'Klik tautan dan kirim kode OTP Anda untuk klaim hadiah.\n\n(Ini contoh penipuan. Jangan pernah membagikan kode OTP kepada siapa pun.)',
    time: dateMinutes(2026, 10, 21, 13, 0),
  },
  {
    id: 'em_spam_lentera',
    folder: 'spam',
    from: '—',
    fromAddr: 'tanpa.nama@lentera.arsip',
    subject: 'berhenti mencari',
    body: 'Kami tahu kamu membuka sesuatu yang bukan milikmu.\n\nLampu yang terlalu terang akan cepat padam.',
    time: at(1, 16, 40),
    locked: true,
  },
]

export const JOURNALIST_EMAIL = 'redaksi@suarakota.id'

// ─── Catatan ───────────────────────────────────────────────────────────────
export interface NoteItem {
  id: string
  title: string
  body: string
  time: number
  shared?: string
  locked?: boolean
}

export const NOTES: NoteItem[] = [
  {
    id: 'n_untukN',
    title: 'Untuk N 🌙',
    shared: 'Dibagikan oleh Raka Pradipta',
    body: 'Kalau kamu baca ini, arsipnya sudah sampai.\n\nKunci arsip = judul lagu PERTAMA di playlist kita, lalu nomor lokerku.\n\nSemua huruf kecil. Tanpa spasi.\n\n— R',
    time: at(1, 16, 13),
    locked: true,
  },
  {
    id: 'n_jurnal',
    title: 'jurnal',
    body: '24 Okt — festival rame banget. Raka bilang mau nunjukin sesuatu setelah penutupan, tapi dia nggak muncul.\n\n25 Okt — chat nggak dibaca. HP-nya mati.\n\n26 Okt — Mamanya Raka lapor polisi. Pak Gunawan bilang ke kelas "jangan menyebar spekulasi". Kenapa dia yang panik?',
    time: at(0, 22, 30),
  },
  {
    id: 'n_belanja',
    title: 'Titipan Mama',
    body: '- telur 1/2 kg\n- kecap\n- sabun cuci\n- jangan lupa bayar listrik!!',
    time: dateMinutes(2026, 10, 25, 9, 0),
  },
  {
    id: 'n_kemah',
    title: 'kemah juli',
    body: 'Raka iseng pasang alarm di HP-ku pas kemah. Katanya "biar kamu ingat lentera menyala sebelum subuh". Nggak jelas. Tapi alarmnya nggak pernah aku hapus.',
    time: dateMinutes(2026, 7, 14, 21, 0),
  },
]

// ─── File ──────────────────────────────────────────────────────────────────
export interface FileItem {
  id: string
  name: string
  folder: 'Unduhan' | 'Dokumen' | 'Rekaman' | '.rahasia' | 'LENTERA'
  size: string
  time: number
  type: 'zip' | 'text' | 'image' | 'audio' | 'pdf'
  content?: string
  /** Gallery id or recording id the file opens. */
  ref?: string
  locked?: boolean
}

export const ZIP_PASSWORD = 'lampukota27'

export const FILES: FileItem[] = [
  { id: 'f_zip', name: 'LENTERA.zip', folder: 'Unduhan', size: '18,4 MB', time: at(1, 16, 12), type: 'zip', locked: true },
  {
    id: 'f_jadwal',
    name: 'jadwal_UAS.pdf',
    folder: 'Unduhan',
    size: '220 KB',
    time: dateMinutes(2026, 10, 20, 9, 2),
    type: 'pdf',
    content: 'JADWAL UAS GANJIL 2026\n\nSenin 3 Nov — Matematika, B. Indonesia\nSelasa 4 Nov — Fisika, B. Inggris\nRabu 5 Nov — Kimia, Sejarah\nKamis 6 Nov — Biologi, PKn\n\nKoordinator: Gunawan Hadi, S.Pd.',
  },
  {
    id: 'f_fisika',
    name: 'tugas_fisika_kelompok.docx',
    folder: 'Dokumen',
    size: '1,1 MB',
    time: dateMinutes(2026, 10, 19, 20, 0),
    type: 'text',
    content: 'Kelompok 3: Nara, Raka, Sinta\nTopik: Gerak Benda Langit\n\nCatatan Raka: "bagian gerhana biar aku yang tulis, aku pernah lihat langsung 😎"',
  },
  { id: 'f_memo', name: 'memo_PR_kimia.m4a', folder: 'Rekaman', size: '312 KB', time: dateMinutes(2026, 10, 21, 19, 30), type: 'audio', ref: 'rec_memo' },
  {
    id: 'f_untuk',
    name: 'untuk_nara.txt',
    folder: '.rahasia',
    size: '1 KB',
    time: dateMinutes(2026, 7, 14, 21, 40),
    type: 'text',
    content: 'kalau suatu hari aku hilang, jangan panik.\n\ningat: lentera menyala jam 04.47.\nsimpan angkanya. suatu saat kamu butuh.\n\n— R (iya aku pinjam HP-mu bentar pas kemah, maaf 🙏)',
  },
  { id: 'f_kunci', name: 'kunci_jawaban_UAS.jpg', folder: 'LENTERA', size: '4,2 MB', time: dateMinutes(2026, 10, 24, 20, 41), type: 'image', ref: 'g_kunci', locked: true },
  {
    id: 'f_transfer',
    name: 'daftar_transfer.txt',
    folder: 'LENTERA',
    size: '3 KB',
    time: dateMinutes(2026, 10, 24, 20, 44),
    type: 'text',
    locked: true,
    content: 'PROYEK LENTERA — UAS GANJIL 2026\nRek. tujuan: a.n. G. HADI\n\n01. ortu siswa XII-1 ........ Rp 7.500.000\n02. ortu siswa XII-4 ........ Rp 7.500.000\n03. ortu siswa XI-3 ......... Rp 5.000.000\n04. ortu siswa XI-1 ......... Rp 5.000.000\n05. ............................... (14 lainnya)\n\nKurir lembar soal: K.A. (OSIS)\nTotal: Rp 96.000.000',
  },
  { id: 'f_bk', name: 'rekaman_ruang_BK.m4a', folder: 'LENTERA', size: '9,8 MB', time: dateMinutes(2026, 10, 24, 20, 39), type: 'audio', ref: 'rec_bk', locked: true },
]

// ─── Perekam Suara ─────────────────────────────────────────────────────────
export interface RecordingItem {
  id: string
  name: string
  time: number
  seconds: number
  lines: { at: number; s: CharId | 'sfx'; text: string }[]
  locked?: boolean
}

export const RECORDINGS: RecordingItem[] = [
  {
    id: 'rec_raka1',
    name: 'Pesan suara · Raka',
    time: at(0, 23, 58),
    seconds: 34,
    locked: true,
    lines: [
      { at: 0, s: 'sfx', text: '(suara hujan, napas terengah)' },
      { at: 3, s: 'raka', text: 'Nar… kalau kamu dengar ini, berarti aku belum bisa pulang.' },
      { at: 9, s: 'raka', text: 'Waktu festival aku nemu map biru di ruang BK. Isinya kunci jawaban UAS… dan daftar orang yang bayar.' },
      { at: 17, s: 'raka', text: 'Mereka nyebutnya "Lentera".' },
      { at: 21, s: 'raka', text: 'Semua sudah kurekam dan kusimpan di arsip. Kuncinya… ada di lagu kita.' },
      { at: 28, s: 'sfx', text: '(langkah kaki mendekat)' },
      { at: 31, s: 'raka', text: '…aku harus pergi.' },
    ],
  },
  {
    id: 'rec_bk',
    name: 'rekaman_ruang_BK',
    time: dateMinutes(2026, 10, 24, 20, 39),
    seconds: 46,
    locked: true,
    lines: [
      { at: 0, s: 'sfx', text: '(pintu ditutup, musik festival samar dari luar)' },
      { at: 3, s: 'gunawan', text: 'Lembar soal Matematika dan Fisika sudah kamu antar?' },
      { at: 8, s: 'kevin', text: 'Sudah, Pak. Tapi… saya nggak mau lagi. Ini salah.' },
      { at: 14, s: 'gunawan', text: 'Salah? Beasiswamu itu dari rekomendasi saya, Kevin. Satu tanda tangan, dan semuanya hilang.' },
      { at: 23, s: 'kevin', text: '…' },
      { at: 26, s: 'gunawan', text: 'Ada yang lihat kamu tadi? Anak yang suka bintang itu?' },
      { at: 31, s: 'kevin', text: 'Raka? Nggak, Pak. Saya rasa nggak.' },
      { at: 36, s: 'gunawan', text: 'Pastikan. Lentera harus tetap gelap sampai UAS selesai.' },
      { at: 42, s: 'sfx', text: '(bunyi ponsel merekam terhenti)' },
    ],
  },
  {
    id: 'rec_memo',
    name: 'memo PR kimia',
    time: dateMinutes(2026, 10, 21, 19, 30),
    seconds: 9,
    lines: [
      { at: 0, s: 'nara', text: 'PR kimia halaman 47, nomor 1 sampai 10. Jangan lupa. Jangan. Lupa.' },
      { at: 6, s: 'sfx', text: '(Raka di latar: "NARA LUPA!")' },
    ],
  },
]

// ─── Musik ─────────────────────────────────────────────────────────────────
export interface Track {
  id: string
  title: string
  artist: string
  seconds: number
  /** Seed for the procedural synth melody. */
  seed: number
}

export interface Playlist {
  id: string
  name: string
  by: string
  tracks: Track[]
}

export const PLAYLISTS: Playlist[] = [
  {
    id: 'pl_untukn',
    name: 'Untuk N 🌙',
    by: 'dibuat oleh raka.pradipta',
    tracks: [
      { id: 't1', title: 'Lampu Kota', artist: 'Senandika', seconds: 214, seed: 7 },
      { id: 't2', title: 'Hujan di Bulan Oktober', artist: 'Rintik', seconds: 241, seed: 13 },
      { id: 't3', title: 'Gerhana', artist: 'Arunika', seconds: 198, seed: 21 },
      { id: 't4', title: 'Pesan Terakhir (demo)', artist: 'Raka P.', seconds: 96, seed: 47 },
    ],
  },
  {
    id: 'pl_belajar',
    name: 'Fokus Belajar',
    by: 'Nara',
    tracks: [
      { id: 't5', title: 'Pukul Dua Pagi', artist: 'Lofi Nusantara', seconds: 180, seed: 3 },
      { id: 't6', title: 'Teh Hangat', artist: 'Lofi Nusantara', seconds: 166, seed: 5 },
      { id: 't7', title: 'Senja Kala', artist: 'Senjakala Band', seconds: 230, seed: 11 },
    ],
  },
]

// ─── Jam ───────────────────────────────────────────────────────────────────
export const INITIAL_ALARMS: Alarm[] = [
  { id: 'a_bangun', time: '05:30', label: 'Bangun sekolah', on: true },
  { id: 'a_lentera', time: '04:47', label: 'lentera 🌙', on: false, note: 'Dipasang Raka waktu kemah, Juli 2026' },
  { id: 'a_les', time: '15:30', label: 'Les kimia', on: true },
]

export const GATE_CODE = '0894'

// ─── Kalender ──────────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string
  date: string
  time?: string
  title: string
  cal: 'Nara' | 'SMA Cendana' | 'Raka'
  note?: string
  locked?: boolean
}

export const CALENDAR: CalendarEvent[] = [
  { id: 'c_fest', date: '2026-10-24', time: '15:00', title: 'Festival Cendana 2026', cal: 'SMA Cendana', note: 'Penutupan 20.00 di lapangan utama.' },
  { id: 'c_les', date: '2026-10-27', time: '15:30', title: 'Les kimia', cal: 'Nara' },
  { id: 'c_yayasan', date: '2026-10-30', time: '10:00', title: 'Rapat Yayasan — Koordinator Ujian', cal: 'SMA Cendana', note: 'Pemateri: Gunawan Hadi, S.Pd.' },
  { id: 'c_uas', date: '2026-11-03', time: '07:00', title: 'UAS Ganjil dimulai', cal: 'SMA Cendana' },
  { id: 'c_ultah', date: '2026-11-09', title: 'Ultah Raka 🎂', cal: 'Nara', note: 'Kado: peta bintang?' },
  { id: 'c_gerhana', date: '2026-10-28', time: '21:00', title: 'Lihat bintang? (kalau aku udah pulang)', cal: 'Raka', note: 'Dibagikan dari kalender Raka. Lokasi: tempat biasa 🌒', locked: true },
  { id: 'c_bk', date: '2026-10-24', time: '20:30', title: 'Ambil map biru — R.BK', cal: 'Raka', note: 'Dibagikan dari kalender Raka.', locked: true },
]

// ─── Peta ──────────────────────────────────────────────────────────────────
export interface MapPin {
  id: string
  name: string
  address: string
  x: number
  y: number
  kind: 'home' | 'school' | 'place' | 'secret'
  desc: string
}

export const MAP_PINS: MapPin[] = [
  { id: 'rumah', name: 'Rumah Nara', address: 'Jl. Melati No. 14', x: 22, y: 70, kind: 'home', desc: 'Lokasimu sekarang.' },
  { id: 'sekolah', name: 'SMA Cendana', address: 'Jl. Pendidikan No. 1', x: 48, y: 52, kind: 'school', desc: 'Gerbang ditutup pukul 18.00.' },
  { id: 'rumahraka', name: 'Rumah Raka', address: 'Perum. Griya Asri B-7', x: 70, y: 74, kind: 'home', desc: 'Polisi sudah memeriksa rumah ini.' },
  { id: 'perpus', name: 'Perpustakaan Kota', address: 'Jl. Sudirman No. 20', x: 36, y: 34, kind: 'place', desc: 'Buka sampai 20.00.' },
  { id: 'kafe', name: 'Kafe Senja', address: 'Jl. Kenari No. 3', x: 62, y: 30, kind: 'place', desc: 'Tempat nongkrong anak Cendana.' },
  { id: 'stasiun', name: 'Stasiun Kota', address: 'Jl. Stasiun Raya', x: 82, y: 50, kind: 'place', desc: 'Kereta terakhir 22.15.' },
  { id: 'observatorium', name: 'Observatorium Lama', address: 'Puncak Bukit Kenanga', x: 18, y: 18, kind: 'secret', desc: 'Terbengkalai sejak 2009. Jalan setapak dari ujung Jl. Kenanga.' },
]
