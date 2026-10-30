
import { useState } from 'react'
import { GameProvider, useGame } from './GameContext'
import type { ThreadId, CharId } from './types'

const threadNames: Record<ThreadId, string> = {
  grup: 'Grup Sahabat',
  raka: 'Raka',
  unknown: 'Nomor Tidak Dikenal',
  sinta: 'Sinta',
  kevin: 'Kevin',
  ibu: 'Ibu',
  operator: 'Operator',
}

const characterNames: Record<CharId, string> = {
  nara: 'Kamu',
  raka: 'Raka',
  fake: 'Tidak Dikenal',
  unknown: 'Nomor Tidak Dikenal',
  sinta: 'Sinta',
  kevin: 'Kevin',
  bima: 'Bima',
  tiara: 'Tiara',
  ibu: 'Ibu',
  gunawan: 'Gunawan',
  operator: 'Operator',
}

function GameScreen() {
  const {
    state,
    dispatch,
    screen,
    hasSave,
    meta,
    startNew,
    continueGame,
  } = useGame()

  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [draft, setDraft] = useState('')

  if (screen === 'title') {
    return (
      <main className="min-h-screen bg-[#05070c] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="space-y-3">
            <p className="text-amber-400 text-xs tracking-[0.5em]">
              AN INTERACTIVE MYSTERY
            </p>

            <h1 className="font-display text-5xl sm:text-6xl tracking-tight glitch">
              THE LAST MESSAGE
            </h1>

            <p className="text-sm text-gray-400 leading-7">
              Pukul 23.47, nomor sahabatmu yang hilang tiba-tiba mengirim pesan.
              Apakah kamu berani membukanya?
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.03] space-y-3">
            <button
              onClick={startNew}
              className="w-full rounded-xl bg-amber-400 text-black font-bold py-4 hover:bg-amber-300"
            >
              MULAI PERMAINAN
            </button>

            {hasSave && (
              <button
                onClick={continueGame}
                className="w-full rounded-xl border border-white/20 py-4 hover:bg-white/10"
              >
                LANJUTKAN PERMAINAN
              </button>
            )}

            <p className="text-xs text-gray-500">
              Sebuah misteri dalam smartphone milik Nara.
            </p>
          </div>

          <div className="text-xs text-gray-600">
            {meta.endingsSeen.length} akhir cerita telah ditemukan
          </div>
        </div>
      </main>
    )
  }

  if (state.card) {
    const isStart = state.card.type === 'start'

    return (
      <main className="min-h-screen bg-[#05070c] text-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center space-y-6">
          <p className="text-amber-400 text-xs tracking-[0.4em]">
            THE LAST MESSAGE
          </p>

          <h2 className="font-display text-5xl">
            {isStart ? 'Episode' : 'Episode Selesai'}
          </h2>

          <p className="text-7xl font-light">
            {String(state.card.episode).padStart(2, '0')}
          </p>

          <p className="text-gray-400 text-sm">
            {isStart
              ? 'Sebuah pesan misterius menunggu untuk dibuka.'
              : 'Perjalananmu berlanjut ke episode berikutnya.'}
          </p>

          <button
            onClick={() => dispatch({ type: 'DISMISS_CARD' })}
            className="w-full rounded-xl bg-amber-400 text-black font-bold py-4"
          >
            {isStart ? 'LANJUTKAN' : 'EPISODE BERIKUTNYA'}
          </button>
        </div>
      </main>
    )
  }

  if (state.locked) {
    return (
      <main className="min-h-screen bg-[#080d17] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-7">
          <div className="text-6xl">◈</div>

          <p className="text-gray-400 text-xs tracking-[0.3em]">
            NARA'S PHONE
          </p>

          <h2 className="text-6xl font-light tracking-widest">
            23:47
          </h2>

          <p className="text-gray-400 text-sm">
            Masukkan PIN untuk membuka smartphone.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()

              if (pin === '1402') {
                dispatch({ type: 'UNLOCK_SCREEN' })
                setPin('')
                setPinError(false)
              } else {
                setPinError(true)
                setPin('')
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, ''))
                setPinError(false)
              }}
              placeholder="••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-center text-2xl tracking-[0.7em] outline-none"
            />

            {pinError && (
              <p className="text-red-400 text-sm">
                PIN salah. Coba lagi.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 text-black font-bold rounded-xl py-4"
            >
              BUKA PONSEL
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (state.viewingThread) {
    const thread = state.viewingThread
    const messages = state.threads[thread] ?? []

    return (
      <main className="min-h-screen bg-[#080d17] text-white flex justify-center">
        <div className="w-full max-w-lg min-h-screen flex flex-col">
          <header className="p-4 border-b border-white/10 flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'VIEW_THREAD', thread: null })}
              className="text-amber-400 text-2xl"
            >
              ←
            </button>
            <div>
              <h2 className="font-bold">{threadNames[thread]}</h2>
              <p className="text-xs text-gray-500">Pesan</p>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto p-4 space-y-3 phone-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === 'nara' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    message.from === 'nara'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.from !== 'nara' && (
                    <p className="text-xs opacity-60 mb-1">
                      {characterNames[message.from]}
                    </p>
                  )}
                  {message.text}
                </div>
              </div>
            ))}
          </section>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!draft.trim()) return

              dispatch({
                type: 'SEND',
                thread,
                text: draft,
              })

              setDraft('')
            }}
            className="p-4 border-t border-white/10 flex gap-2"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ketik pesan..."
              className="min-w-0 flex-1 rounded-xl bg-white/10 p-3 outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-amber-400 text-black rounded-xl px-5 font-bold"
            >
              Kirim
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080d17] text-white p-5">
      <div className="max-w-lg mx-auto space-y-6">
        <header className="border-b border-white/10 pb-5">
          <p className="text-xs text-gray-500">NARA'S SMARTPHONE</p>
          <h1 className="text-2xl font-bold mt-2">Beranda</h1>
          <p className="text-sm text-gray-400 mt-1">
            Episode {state.episode} · THE LAST MESSAGE
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3">
          {[
            ['messages', 'Pesan', '💬'],
            ['phone', 'Telepon', '☎️'],
            ['gallery', 'Galeri', '🖼️'],
            ['notes', 'Catatan', '📝'],
            ['contacts', 'Kontak', '👥'],
          ].map(([app, label, emoji]) => (
            <button
              key={app}
              onClick={() => {
                if (app === 'messages') {
                  dispatch({ type: 'VIEW_THREAD', thread: 'raka' })
                }
              }}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 text-left hover:bg-white/10"
            >
              <span className="text-3xl">{emoji}</span>
              <p className="mt-3 font-semibold">{label}</p>
            </button>
          ))}
        </section>

        <section className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
          <p className="text-xs text-gray-500 mb-3">PESAN MASUK</p>

          {(Object.keys(state.threads) as ThreadId[]).map((thread) => {
            const messages = state.threads[thread] ?? []
            const latest = messages[messages.length - 1]

            return (
              <button
                key={thread}
                onClick={() => dispatch({ type: 'VIEW_THREAD', thread })}
                className="w-full text-left py-3 border-b border-white/5 last:border-0"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-sm">
                    {threadNames[thread]}
                  </span>
                  {(state.unread[thread] ?? 0) > 0 && (
                    <span className="text-xs bg-amber-400 text-black rounded-full px-2">
                      {state.unread[thread]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {latest?.text ?? 'Belum ada pesan'}
                </p>
              </button>
            )
          })}
        </section>

        <button
          onClick={() => dispatch({ type: 'LOCK_SCREEN' })}
          className="w-full border border-white/15 rounded-xl py-3 text-sm text-gray-400"
        >
          Kunci layar
        </button>
      </div>
    </main>
  )
}

export default function GameRoot() {
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  )
}
