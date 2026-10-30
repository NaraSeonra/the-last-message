export interface Objective {
  id: string
  title: string
  hints: string[]
}

export const OBJECTIVES: Record<string, Objective> = {
  unlock: {
    id: 'unlock',
    title: 'Buka kunci ponsel',
    hints: ['PIN ponsel Nara adalah tanggal dan bulan lahirnya.', 'Nara lahir 14 Februari.', 'Ketik PIN 1402.'],
  },
  read_raka: {
    id: 'read_raka',
    title: 'Baca pesan dari nomor Raka',
    hints: ['Buka aplikasi Pesan.', 'Percakapan "Raka Pradipta" ada di paling atas.', 'Ketik balasanmu sendiri, lalu tekan kirim.'],
  },
  group: {
    id: 'group',
    title: 'Jawab pertanyaan Kevin di grup kelas',
    hints: ['Buka grup "XI IPA 2" di aplikasi Pesan.', 'Kevin bertanya apakah kamu dihubungi nomor Raka.', 'Jujur atau tidak, itu pilihanmu. Pikirkan siapa yang membaca grup itu.'],
  },
  prove: {
    id: 'prove',
    title: 'Buktikan dirimu pada nomor tak dikenal',
    hints: ['Kamu dan Raka pertama kali ngobrol saat MPLS, Agustus 2024.', 'Cari foto lama di Galeri, album 2024. Lihat info lokasinya.', 'Jawab: "perpustakaan lama".'],
  },
  listen: {
    id: 'listen',
    title: 'Dengarkan pesan suara Raka',
    hints: ['Ketuk pesan suara di chat, atau buka Perekam Suara.', 'Putar rekaman sampai selesai.', 'Setelah itu, balas Raka di chat.'],
  },
  after_rec: {
    id: 'after_rec',
    title: 'Balas Raka',
    hints: ['Buka chat dengan nomor tak dikenal.', 'Katakan apa yang kamu rasakan.', 'Apa pun jawabanmu, Raka akan menjelaskan langkah berikutnya.'],
  },
  open_zip: {
    id: 'open_zip',
    title: 'Buka arsip LENTERA.zip',
    hints: [
      'Raka membagikan catatan "Untuk N" di aplikasi Catatan.',
      'Judul lagu pertama ada di playlist "Untuk N" (Musik). Nomor loker Raka ada di postingannya di Lingkar.',
      'Buka File › Unduhan › LENTERA.zip, masukkan: lampukota27',
    ],
  },
  listen_bk: {
    id: 'listen_bk',
    title: 'Periksa isi arsip LENTERA',
    hints: ['Folder LENTERA sekarang ada di aplikasi File.', 'Ada rekaman dari ruang BK.', 'Putar "rekaman_ruang_BK" sampai selesai di Perekam Suara.'],
  },
  fake2: {
    id: 'fake2',
    title: 'Hadapi pesan dari nomor Raka',
    hints: ['Nomor Raka mengirim pesan lagi.', 'Ingat: Raka yang asli memakai nomor lain.', 'Apa yang kamu ungkapkan bisa dipakai melawanmu.'],
  },
  sinta_call: {
    id: 'sinta_call',
    title: 'Angkat telepon Sinta',
    hints: ['Sinta sedang menelepon.', 'Tekan tombol hijau untuk mengangkat.', 'Kalau terlewat, telepon balik dari aplikasi Telepon.'],
  },
  kevin: {
    id: 'kevin',
    title: 'Balas pesan Kevin',
    hints: ['Kevin mengirimmu pesan pribadi.', 'Rekaman ruang BK menunjukkan Kevin ditekan Pak Gunawan.', 'Sikapmu pada Kevin akan menentukan apa yang dia lakukan nanti.'],
  },
  find_place: {
    id: 'find_place',
    title: 'Temukan "tempat kita lihat gerhana"',
    hints: ['Raka pernah memposting tentang gerhana di Lingkar.', 'Foto gerhana di Galeri (album 2025) punya info lokasi.', 'Buka Peta, pilih "Observatorium Lama", lalu tekan Pergi.'],
  },
  gate: {
    id: 'gate',
    title: 'Buka gembok gerbang observatorium',
    hints: [
      'Raka bilang: alarm yang dia pasang waktu kemah, dikali dua.',
      'Lihat aplikasi Jam: alarm "lentera" pukul 04:47. Hitung 447 × 2 di Kalkulator.',
      'Kodenya 0894. Masukkan di Peta › Observatorium Lama.',
    ],
  },
  raka_call: {
    id: 'raka_call',
    title: 'Angkat telepon Raka',
    hints: ['Raka menelepon dari nomor barunya.', 'Tekan tombol hijau.', 'Kalau terlewat, telepon balik nomor tak dikenal.'],
  },
  decide: {
    id: 'decide',
    title: 'Putuskan nasib bukti Lentera',
    hints: [
      'Balas Raka di chat, atau bertindak langsung lewat Email maupun Lingkar.',
      'Alamat redaksi Suara Kota tertulis di situs suarakota.id (Browser) dan di Lingkar.',
      'Pikirkan siapa yang bisa dipercaya: jurnalis, publik, Kevin… atau tidak ada.',
    ],
  },
  done: { id: 'done', title: 'Cerita selesai', hints: ['Lihat akhir ceritamu.', 'Coba keputusan lain untuk akhir berbeda.', 'Ada 6 akhir cerita.'] },
}

export const EPISODES = [
  { n: 1, title: 'Pesan Terakhir', blurb: 'Pukul 23.47, nomor sahabatmu yang hilang tiba-tiba mengirim pesan.' },
  { n: 2, title: 'Arsip Lentera', blurb: 'Sebuah email terjadwal membawa arsip terkunci dan rahasia ruang BK.' },
  { n: 3, title: 'Tempat Gerhana', blurb: 'Raka bersembunyi. Hanya kamu yang tahu di mana mencarinya.' },
]
