/** Lowercase, strip punctuation and collapse whitespace for keyword checks. */
export function norm(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when any keyword appears as a word prefix in the text. */
export function hasAny(text: string, words: string[]) {
  const t = ` ${norm(text)} `
  return words.some((w) => t.includes(` ${w}`))
}

export const LEAK_WORDS = ['lentera', 'rekaman', 'bukti', 'arsip', 'flashdisk', 'map biru', 'kunci jawaban', 'lampukota', 'sandi', 'password']
export const KIND_WORDS = ['maaf', 'percaya', 'bantu', 'ngerti', 'paham', 'tenang', 'aman', 'nggak apa', 'gapapa', 'ga apa', 'tidak apa', 'kasihan', 'sabar', 'peluk', 'sayang', 'jaga', 'hati hati', 'semangat', 'kuat', 'di sini', 'disini', 'ada aku', 'temen', 'teman']
export const HOSTILE_WORDS = ['jahat', 'pembohong', 'bohong', 'pengkhianat', 'brengsek', 'bodoh', 'tolol', 'benci', 'lapor', 'polisi', 'penjahat', 'munafik', 'pengecut', 'gila']
export const YES_WORDS = ['iya', 'ya', 'yap', 'yup', 'dapet', 'dapat', 'barusan', 'aku dichat', 'dichat', 'betul', 'bener', 'benar', 'udah', 'sudah']
export const NO_WORDS = ['nggak', 'gak', 'ngga', 'enggak', 'engga', 'tidak', 'tdk', 'belum', 'blm', 'ga ', 'no']
