// Game time is counted in minutes since Monday 26 October 2026, 00:00 (in-story).
const BASE = Date.UTC(2026, 9, 26, 0, 0)

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
export const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export function gameDate(minutes: number) {
  return new Date(BASE + minutes * 60_000)
}

export function at(day: number, hh: number, mm: number) {
  return day * 1440 + hh * 60 + mm
}

/** Minutes for an absolute calendar date (used for older content). */
export function dateMinutes(y: number, m: number, d: number, hh = 0, mm = 0) {
  return Math.round((Date.UTC(y, m - 1, d, hh, mm) - BASE) / 60_000)
}

const pad = (n: number) => String(n).padStart(2, '0')

export function fmtTime(minutes: number) {
  const d = gameDate(minutes)
  return `${pad(d.getUTCHours())}.${pad(d.getUTCMinutes())}`
}

export function fmtDateLong(minutes: number) {
  const d = gameDate(minutes)
  return `${HARI[d.getUTCDay()]}, ${d.getUTCDate()} ${BULAN[d.getUTCMonth()]}`
}

export function fmtDateFull(minutes: number) {
  const d = gameDate(minutes)
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function fmtDateShort(minutes: number) {
  const d = gameDate(minutes)
  return `${d.getUTCDate()} ${BULAN[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`
}

/** Relative label for lists: time today, "Kemarin", or a short date. */
export function fmtRelative(minutes: number, now: number) {
  const day = Math.floor(minutes / 1440)
  const today = Math.floor(now / 1440)
  if (day === today) return fmtTime(minutes)
  if (day === today - 1) return 'Kemarin'
  return fmtDateShort(minutes)
}

export function isoDate(minutes: number) {
  const d = gameDate(minutes)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

export const EPISODE_START: Record<number, number> = {
  1: at(0, 23, 47),
  2: at(1, 16, 10),
  3: at(2, 19, 30),
}
