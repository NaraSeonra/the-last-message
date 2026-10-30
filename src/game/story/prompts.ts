import type { Action, CharId, PromptDef, PromptId, ThreadId } from '../types'
import { HOSTILE_WORDS, KIND_WORDS, LEAK_WORDS, NO_WORDS, YES_WORDS, hasAny, norm } from './text'

export const say = (thread: ThreadId, from: CharId, ...lines: string[]): Action[] =>
  lines.map((text) => ({ t: 'msg', thread, from, text }))

export const PROMPTS: Record<PromptId, PromptDef> = {
  // ── Episode 1 ────────────────────────────────────────────────────────────
  fake1: {
    id: 'fake1',
    thread: 'raka',
    placeholder: 'Balas sebagai Nara…',
    suggestions: ['Raka?! Kamu di mana??', 'Titipan apa maksudmu?', 'Ini siapa sebenarnya?'],
    evaluate: (text) => {
      if (hasAny(text, LEAK_WORDS)) {
        return {
          actions: [
            { t: 'leak' },
            { t: 'flag', key: 'leak_fake1' },
            ...say('raka', 'fake', 'bagus. simpan baik-baik.', 'jangan kasih tau siapa-siapa. besok aku kabari.'),
            { t: 'goto', node: 'ep1_group', delay: 2500 },
          ],
        }
      }
      if (hasAny(text, ['siapa', 'bukan raka', 'buktikan', 'bukti', 'curiga', 'aneh', 'beda'])) {
        return {
          actions: [
            { t: 'flag', key: 'doubt_fake' },
            ...say('raka', 'fake', 'ya aku lah. raka. siapa lagi.', 'udah, nggak usah banyak tanya dulu.'),
            { t: 'goto', node: 'ep1_group', delay: 2500 },
          ],
        }
      }
      return {
        actions: [
          ...say('raka', 'fake', 'nanti aku jelasin.', 'yang penting kamu masih simpan, kan?'),
          { t: 'goto', node: 'ep1_group', delay: 2500 },
        ],
      }
    },
  },
  group1: {
    id: 'group1',
    thread: 'grup',
    placeholder: 'Balas di grup…',
    suggestions: ['Iya, barusan aku dichat.', 'Nggak, aku nggak dapet apa-apa.', 'Kenapa nanya gitu, Vin?'],
    evaluate: (text) => {
      const t = norm(text)
      if (hasAny(text, LEAK_WORDS)) {
        return {
          actions: [
            { t: 'leak' },
            { t: 'flag', key: 'told_group' },
            ...say('grup', 'kevin', 'Lentera? Maksudnya apa, Nar?'),
            ...say('grup', 'sinta', 'nar japri aku sekarang.'),
            { t: 'msg', thread: 'grup', from: 'tiara', text: 'kevin barusan keluar dari grup?? eh nggak, masuk lagi. sinyal kali' },
            { t: 'goto', node: 'ep1_unknown', delay: 3000 },
          ],
        }
      }
      if (hasAny(text, YES_WORDS) && !t.startsWith('ga') && !t.startsWith('nggak')) {
        return {
          actions: [
            { t: 'flag', key: 'told_group' },
            ...say('grup', 'kevin', 'Oh ya? Dia bilang apa? Dia di mana?'),
            ...say('grup', 'bima', 'WOI SERIUS'),
            ...say('grup', 'sinta', 'nar japri aku ya 🥺'),
            { t: 'goto', node: 'ep1_unknown', delay: 3000 },
          ],
        }
      }
      if (hasAny(text, NO_WORDS)) {
        return {
          actions: [
            { t: 'flag', key: 'hid_group' },
            ...say('grup', 'kevin', 'Oke. Kabari aku dulu kalau ada apa-apa.'),
            ...say('grup', 'sinta', 'nar japri aku ya'),
            { t: 'goto', node: 'ep1_unknown', delay: 3000 },
          ],
        }
      }
      return {
        actions: [
          ...say('grup', 'tiara', 'nara jawabnya misterius banget 😶'),
          ...say('grup', 'kevin', 'Ya sudah. Istirahat semua.'),
          { t: 'goto', node: 'ep1_unknown', delay: 3000 },
        ],
      }
    },
  },
  sinta1: {
    id: 'sinta1',
    thread: 'sinta',
    placeholder: 'Balas Sinta…',
    suggestions: ['Aku nggak apa-apa, Sin. Kamu tenang ya.', 'Aku juga takut.', 'Nanti aku cerita.'],
    evaluate: (text) => {
      if (hasAny(text, KIND_WORDS) || hasAny(text, ['takut', 'juga', 'cerita'])) {
        return { actions: [{ t: 'rel', who: 'sinta', delta: 1 }, ...say('sinta', 'sinta', 'makasih nar 🥹', 'kita cari raka bareng ya. janji.')] }
      }
      return { actions: say('sinta', 'sinta', 'oke… jangan tidur kemaleman.') }
    },
  },
  prove: {
    id: 'prove',
    thread: 'unknown',
    placeholder: 'Jawab pertanyaannya…',
    suggestions: ['Di kantin?', 'Siapa kamu?', 'Di perpustakaan…'],
    evaluate: (text, s) => {
      if (hasAny(text, ['perpus', 'perpustakaan', 'library'])) {
        return { actions: [{ t: 'flag', key: 'proved' }, { t: 'goto', node: 'ep1_proved' }] }
      }
      if (hasAny(text, ['siapa', 'kamu siapa', 'raka'])) {
        return { keep: true, actions: say('unknown', 'unknown', 'jawab dulu. aku harus yakin ini kamu, bukan orang yang pegang HP-mu.') }
      }
      const tries = (s.promptAttempts.prove ?? 0) + 1
      if (tries >= 2) {
        return { keep: true, actions: say('unknown', 'unknown', 'bukan. lihat galerimu. Agustus 2024. hari pertama MPLS.') }
      }
      return { keep: true, actions: say('unknown', 'unknown', 'bukan. kamu pasti ingat. ada fotonya.') }
    },
  },
  afterRec: {
    id: 'afterRec',
    thread: 'unknown',
    placeholder: 'Balas Raka…',
    suggestions: ['Aku percaya kamu. Aku bantu.', 'Kenapa kamu nggak lapor polisi?', 'Aku takut, Ka.'],
    evaluate: (text) => {
      const kind = hasAny(text, KIND_WORDS) || hasAny(text, ['takut', 'kangen', 'khawatir'])
      return {
        actions: [
          ...(kind ? [{ t: 'rel', who: 'raka', delta: 1 } as Action] : []),
          ...(hasAny(text, ['polisi', 'lapor'])
            ? say('unknown', 'raka', 'belum bisa. dia kenal orang-orang penting. aku butuh bukti yang nggak bisa dibantah.')
            : say('unknown', 'raka', kind ? 'makasih, Nar. beneran.' : 'aku ngerti kalau kamu bingung.')),
          ...say('unknown', 'raka', 'besok sore cek emailmu. aku jadwalkan kirim arsipnya.', 'satu lagi: jangan percaya Kevin dulu. aku belum yakin dia di pihak siapa.'),
          { t: 'episodeEnd', episode: 1, delay: 4000 },
        ],
      }
    },
  },
  // ── Episode 2 ────────────────────────────────────────────────────────────
  fake2: {
    id: 'fake2',
    thread: 'raka',
    placeholder: 'Balas nomor Raka…',
    suggestions: ['Aku tahu kamu bukan Raka.', 'Udah, aku udah buka.', 'Arsip apa?'],
    evaluate: (text) => {
      if (hasAny(text, ['lampukota', 'sandi', 'password', 'udah', 'sudah', 'iya', 'kirim', 'nih'])) {
        return {
          actions: [
            { t: 'leak' },
            { t: 'flag', key: 'leak_fake2' },
            ...say('raka', 'fake', 'bagus. kirim ke aku aja, biar aman.', 'jangan ke orang lain.'),
            { t: 'goto', node: 'ep2_call', delay: 3000 },
          ],
        }
      }
      if (hasAny(text, ['bukan raka', 'bukan kamu', 'tau', 'tahu', 'siapa', 'kevin', 'gunawan', 'pak'])) {
        return {
          actions: [
            { t: 'flag', key: 'called_out' },
            ...say('raka', 'fake', '…', 'kamu nggak tahu kamu lagi berurusan sama siapa.'),
            { t: 'goto', node: 'ep2_call', delay: 3000 },
          ],
        }
      }
      return { actions: [...say('raka', 'fake', 'jangan main-main, Nar.'), { t: 'goto', node: 'ep2_call', delay: 3000 }] }
    },
  },
  kevin1: {
    id: 'kevin1',
    thread: 'kevin',
    placeholder: 'Balas Kevin…',
    suggestions: ['Aku dengar rekamannya. Kamu dipaksa, kan?', 'Kamu pembohong, Vin.', 'Kenapa kamu pegang HP Raka?'],
    evaluate: (text) => {
      if (hasAny(text, HOSTILE_WORDS)) {
        return {
          actions: [
            { t: 'rel', who: 'kevin', delta: -1 },
            ...say('kevin', 'kevin', 'Oke. Terserah kamu mau mikir apa.', 'Tapi hati-hati. Dia bukan cuma guru BK.'),
            { t: 'goto', node: 'ep2_end', delay: 3500 },
          ],
        }
      }
      if (hasAny(text, KIND_WORDS) || hasAny(text, ['dipaksa', 'diancam', 'terpaksa'])) {
        return {
          actions: [
            { t: 'rel', who: 'kevin', delta: 1 },
            { t: 'flag', key: 'kevin_confessed' },
            ...say('kevin', 'kevin', 'Iya. Pak Gunawan ngancam cabut beasiswaku.', 'Dia juga yang nyuruh aku ambil HP Raka di ruang musik dan pura-pura jadi dia.', 'Aku nyesel, Nar. Kalau kamu butuh saksi… aku mau.'),
            { t: 'goto', node: 'ep2_end', delay: 3500 },
          ],
        }
      }
      if (hasAny(text, ['kenapa', 'mengapa', 'siapa', 'apa', 'hp', 'ponsel'])) {
        return {
          actions: [
            { t: 'flag', key: 'kevin_confessed' },
            ...say('kevin', 'kevin', 'Pak Gunawan yang suruh aku chat kamu pakai HP Raka.', 'Aku nggak punya pilihan. Itu aja yang bisa kubilang sekarang.'),
            { t: 'goto', node: 'ep2_end', delay: 3500 },
          ],
        }
      }
      return { actions: [...say('kevin', 'kevin', '…oke. Aku cuma mau kamu tahu aku bukan musuhmu.'), { t: 'goto', node: 'ep2_end', delay: 3500 }] }
    },
  },
  // ── Episode 3 ────────────────────────────────────────────────────────────
  final: {
    id: 'final',
    thread: 'unknown',
    placeholder: 'Apa yang kita lakukan dengan bukti ini?',
    suggestions: ['Kirim ke jurnalis Suara Kota.', 'Unggah ke Lingkar biar viral.', 'Serahkan ke Kevin.', 'Hapus semuanya.'],
    evaluate: (text) => {
      if (hasAny(text, ['jurnalis', 'wartawan', 'suara kota', 'suarakota', 'redaksi', 'koran', 'berita', 'media', 'polisi', 'lapor'])) {
        return { actions: [{ t: 'decide', choice: 'journalist' }] }
      }
      if (hasAny(text, ['unggah', 'upload', 'posting', 'post', 'viral', 'lingkar', 'sosmed', 'publik', 'sebar'])) {
        return { actions: [{ t: 'decide', choice: 'social' }] }
      }
      if (hasAny(text, ['kevin', 'vin'])) {
        return { actions: [{ t: 'decide', choice: 'kevin' }] }
      }
      if (hasAny(text, ['hapus', 'buang', 'lupakan', 'delete', 'musnah', 'bakar'])) {
        return { actions: [{ t: 'decide', choice: 'delete' }] }
      }
      return {
        keep: true,
        actions: [{ t: 'msg', thread: 'unknown', from: 'raka', text: 'aku butuh jawaban jelas, Nar. jurnalis, Lingkar, Kevin… atau kita hapus semuanya?' }],
      }
    },
  },
}
