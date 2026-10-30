import type { Decision, EndingId, GameState } from '../types'

export interface Ending {
  id: EndingId
  title: string
  tag: string
  tone: 'good' | 'mixed' | 'bad' | 'secret'
  epilogue: (s: GameState) => string[]
}

export function computeEnding(s: GameState, d: Decision): EndingId {
  switch (d) {
    case 'journalist':
      return s.leaks === 0 ? 'cahaya' : 'fajar'
    case 'social':
      return 'api'
    case 'kevin':
      return s.rel.kevin >= 1 && s.flags.kevin_confessed ? 'penebusan' : 'pesan_terakhir'
    case 'delete':
      return 'sunyi'
  }
}

const sintaLine = (s: GameState) =>
  s.rel.sinta >= 2
    ? 'Sinta menunggumu di gerbang sekolah keesokan paginya, membawa dua gelas es teh dan pelukan yang terlalu erat.'
    : s.rel.sinta <= -1
      ? 'Sinta tahu semuanya dari berita. Ia tidak marah, hanya diam. Butuh waktu lama sebelum kalian bisa tertawa bersama lagi.'
      : 'Sinta mengirim satu pesan: "lain kali, cerita ya." Kamu berjanji dalam hati.'

const kevinLine = (s: GameState) =>
  s.rel.kevin >= 1
    ? 'Kevin bersaksi. Beasiswanya hilang, tapi untuk pertama kalinya ia bisa tidur nyenyak.'
    : 'Kevin pindah sekolah tanpa pamit. Akun Lingkarnya kosong, kecuali satu kata: "maaf."'

export const ENDINGS: Record<EndingId, Ending> = {
  cahaya: {
    id: 'cahaya',
    title: 'Cahaya Lentera',
    tag: 'Akhir Sejati',
    tone: 'good',
    epilogue: (s) => [
      'Tiga hari kemudian, Suara Kota menerbitkan laporan utama: "Jual-Beli Soal UAS di SMA Cendana Terbongkar." Identitas sumber dirahasiakan.',
      'Gunawan Hadi diberhentikan dan diperiksa polisi sebelum sempat menghapus apa pun. UAS diundur dan soal disusun ulang.',
      kevinLine(s),
      sintaLine(s),
      'Raka pulang sore itu. Di depan pintu rumahmu, ia menyodorkan peta bintang. "Buat ulang tahunku," katanya, "tapi kamu yang simpan."',
    ],
  },
  fajar: {
    id: 'fajar',
    title: 'Fajar yang Terlambat',
    tag: 'Akhir Baik',
    tone: 'mixed',
    epilogue: (s) => [
      'Berita itu terbit. Tapi seseorang sudah memperingatkan Gunawan; separuh berkas di ruang BK lenyap semalam sebelum polisi datang.',
      'Ia tetap diberhentikan, namun beberapa nama di daftar transfer tak pernah tersentuh.',
      kevinLine(s),
      sintaLine(s),
      'Raka pulang. "Kita menang setengah," katanya. Kamu tahu, setengah lebih baik daripada gelap sama sekali. Tapi kamu juga tahu: ada kata-katamu yang sampai ke telinga yang salah.',
    ],
  },
  api: {
    id: 'api',
    title: 'Api di Linimasa',
    tag: 'Akhir Campuran',
    tone: 'mixed',
    epilogue: (s) => [
      'Dalam satu jam, unggahanmu dibagikan ribuan kali. #ProyekLentera menjadi trending.',
      'Sekolah panik, Gunawan dinonaktifkan. Tapi akunmu dibanjiri ancaman, dan nama Raka ikut tersebar bersama lokasi persembunyiannya.',
      'Raka dijemput polisi di observatorium sebelum orang lain menemukannya lebih dulu. Ia selamat, tapi harus pindah kota.',
      sintaLine(s),
      'Kebenaran menyala terang. Terlalu terang, sampai membakar orang-orang yang kamu sayangi.',
    ],
  },
  penebusan: {
    id: 'penebusan',
    title: 'Penebusan',
    tag: 'Akhir Rahasia',
    tone: 'good',
    epilogue: (s) => [
      'Kevin tidak lari. Pagi itu ia berjalan ke kantor polisi membawa bukti Lentera, ditemani ibunya.',
      '"Saya kurirnya," katanya. "Dan saya siap menanggungnya."',
      'Pengakuannya membuat seluruh jaringan runtuh. Gunawan ditangkap di rumahnya.',
      sintaLine(s),
      'Raka pulang, dan hal pertama yang ia lakukan adalah menelepon Kevin. Kamu tidak tahu apa yang mereka bicarakan. Tapi kamu tahu, kadang orang hanya butuh satu orang yang percaya.',
    ],
  },
  pesan_terakhir: {
    id: 'pesan_terakhir',
    title: 'Pesan Terakhir',
    tag: 'Akhir Buruk',
    tone: 'bad',
    epilogue: () => [
      'Kevin menerima bukti itu. Satu jam kemudian, folder LENTERA di ponselmu kosong.',
      'Kevin tak pernah membalas lagi. Ia terlalu takut, dan Gunawan terlalu dekat.',
      'UAS berjalan seperti biasa. Tidak ada berita, tidak ada yang ditangkap.',
      'Malam itu, pukul 23.47, nomor tak dikenal mengirim satu pesan terakhir: "makasih udah nyoba, Nar." Lalu nomornya tak pernah aktif lagi.',
    ],
  },
  sunyi: {
    id: 'sunyi',
    title: 'Sunyi',
    tag: 'Akhir Sunyi',
    tone: 'secret',
    epilogue: (s) => [
      'Kamu menghapus semuanya: arsip, rekaman, foto. Layar ponselmu kembali bersih, seolah tak pernah terjadi apa-apa.',
      'Raka pulang seminggu kemudian, bilang ia "kabur karena stres ujian". Semua orang percaya.',
      s.rel.raka >= 1 ? 'Kalian masih berteman. Tapi setiap kali melihat lampu kota, kalian sama-sama diam terlalu lama.' : 'Kalian tak pernah lagi membicarakan malam itu.',
      'Lentera tetap gelap. Dan di suatu tempat, seseorang sudah menyiapkan soal untuk semester berikutnya.',
    ],
  },
}

export const ENDING_ORDER: EndingId[] = ['cahaya', 'fajar', 'penebusan', 'api', 'pesan_terakhir', 'sunyi']
