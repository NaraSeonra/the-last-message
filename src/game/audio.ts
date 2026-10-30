// Audio engine. Uses local files listed in /audio/manifest.json when present,
// otherwise synthesises every sound with the Web Audio API. Nothing plays
// until `unlock()` is called from a user gesture.

export type Sfx =
  | 'notify'
  | 'open'
  | 'close'
  | 'tap'
  | 'unlock'
  | 'error'
  | 'shutter'
  | 'send'
  | 'success'
  | 'key'
  | 'glitch'
  | 'hangup'

export interface AudioSettings {
  master: number
  music: number
  sfx: number
  muted: boolean
}

export const DEFAULT_AUDIO: AudioSettings = { master: 0.8, music: 0.55, sfx: 0.8, muted: false }

const SFX_FILES: Record<Sfx, string> = {
  notify: 'notify.mp3',
  open: 'open.mp3',
  close: 'close.mp3',
  tap: 'tap.mp3',
  unlock: 'unlock.mp3',
  error: 'error.mp3',
  shutter: 'shutter.mp3',
  send: 'send.mp3',
  success: 'success.mp3',
  key: 'key.mp3',
  glitch: 'glitch.mp3',
  hangup: 'hangup.mp3',
}

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicBus: GainNode | null = null
  private sfxBus: GainNode | null = null
  private available = new Set<string>()
  private bgmEl: HTMLAudioElement | null = null
  private bgmNodes: AudioNode[] = []
  private bgmTimer: number | null = null
  private ringTimer: number | null = null
  private trackTimer: number | null = null
  private trackGain: GainNode | null = null
  private settings: AudioSettings = DEFAULT_AUDIO
  private bgmWanted = false
  private ducked = false
  unlocked = false

  async unlock() {
    if (this.unlocked || typeof window === 'undefined') return
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    this.unlocked = true
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.musicBus = this.ctx.createGain()
    this.sfxBus = this.ctx.createGain()
    this.musicBus.connect(this.master)
    this.sfxBus.connect(this.master)
    this.master.connect(this.ctx.destination)
    this.apply()
    try {
      const res = await fetch('/audio/manifest.json')
      if (res.ok) {
        const data = (await res.json()) as { files?: string[] }
        data.files?.forEach((f) => this.available.add(f))
      }
    } catch {
      // No manifest: synthesised fallback only.
    }
    if (this.bgmWanted) this.startBgm()
  }

  configure(s: AudioSettings) {
    this.settings = s
    this.apply()
  }

  private apply() {
    if (!this.ctx || !this.master || !this.musicBus || !this.sfxBus) return
    const t = this.ctx.currentTime
    const { master, music, sfx, muted } = this.settings
    this.master.gain.setTargetAtTime(muted ? 0 : master, t, 0.05)
    this.musicBus.gain.setTargetAtTime(music * (this.ducked ? 0.25 : 1), t, 0.3)
    this.sfxBus.gain.setTargetAtTime(sfx, t, 0.05)
    if (this.bgmEl) this.bgmEl.volume = muted ? 0 : master * music * (this.ducked ? 0.25 : 1) * 0.6
  }

  duck(on: boolean) {
    this.ducked = on
    this.apply()
  }

  // ── Background music ────────────────────────────────────────────────────
  setBgm(on: boolean) {
    this.bgmWanted = on
    if (!this.unlocked) return
    if (on) this.startBgm()
    else this.stopBgm()
  }

  private startBgm() {
    if (this.bgmEl || this.bgmNodes.length || !this.ctx || !this.musicBus) return
    if (this.available.has('bgm.mp3')) {
      this.bgmEl = new Audio('/audio/bgm.mp3')
      this.bgmEl.loop = true
      this.apply()
      this.bgmEl.play().catch(() => (this.bgmEl = null))
      return
    }
    const ctx = this.ctx
    const out = ctx.createGain()
    out.gain.value = 0
    out.gain.setTargetAtTime(0.32, ctx.currentTime, 3)
    out.connect(this.musicBus)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 520
    filter.Q.value = 6
    filter.connect(out)
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.05
    lfoGain.gain.value = 260
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()
    const nodes: AudioNode[] = [out, filter, lfo, lfoGain]
    // Low drone in D minor with slight detune.
    ;[73.42, 110, 146.83, 174.61].forEach((f, i) => {
      const o = ctx.createOscillator()
      o.type = i % 2 ? 'triangle' : 'sawtooth'
      o.frequency.value = f
      o.detune.value = (i - 1.5) * 7
      const g = ctx.createGain()
      g.gain.value = i === 0 ? 0.35 : 0.12
      o.connect(g).connect(filter)
      o.start()
      nodes.push(o, g)
    })
    // Rain-like filtered noise.
    const noise = ctx.createBufferSource()
    noise.buffer = this.noiseBuffer(4)
    noise.loop = true
    const nf = ctx.createBiquadFilter()
    nf.type = 'bandpass'
    nf.frequency.value = 2200
    nf.Q.value = 0.6
    const ng = ctx.createGain()
    ng.gain.value = 0.05
    noise.connect(nf).connect(ng).connect(out)
    noise.start()
    nodes.push(noise, nf, ng)
    this.bgmNodes = nodes
    // Sparse music-box bell notes.
    const bells = [587.33, 698.46, 880, 523.25, 659.25, 440]
    let i = 0
    this.bgmTimer = window.setInterval(() => {
      if (Math.random() < 0.55) this.bell(bells[i++ % bells.length], out)
    }, 3800)
  }

  private stopBgm() {
    if (this.bgmEl) {
      this.bgmEl.pause()
      this.bgmEl = null
    }
    if (this.bgmTimer) window.clearInterval(this.bgmTimer)
    this.bgmTimer = null
    this.bgmNodes.forEach((n) => {
      try {
        ;(n as OscillatorNode).stop?.()
      } catch {
        // already stopped
      }
      n.disconnect()
    })
    this.bgmNodes = []
  }

  private bell(freq: number, dest: AudioNode, vol = 0.18, dur = 3) {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(dest)
    o.start(t)
    o.stop(t + dur + 0.1)
  }

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  // ── Sound effects ───────────────────────────────────────────────────────
  play(name: Sfx) {
    if (!this.ctx || !this.sfxBus) return
    if (this.available.has(SFX_FILES[name])) {
      const el = new Audio(`/audio/${SFX_FILES[name]}`)
      el.volume = this.settings.muted ? 0 : this.settings.master * this.settings.sfx
      el.play().catch(() => undefined)
      return
    }
    const ctx = this.ctx
    const t = ctx.currentTime
    const out = this.sfxBus
    const tone = (freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.25, toFreq?: number) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.setValueAtTime(freq, t + start)
      if (toFreq) o.frequency.exponentialRampToValueAtTime(toFreq, t + start + dur)
      g.gain.setValueAtTime(0, t + start)
      g.gain.linearRampToValueAtTime(vol, t + start + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur)
      o.connect(g).connect(out)
      o.start(t + start)
      o.stop(t + start + dur + 0.05)
    }
    const noise = (dur: number, freq: number, vol = 0.2, q = 1) => {
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(dur + 0.1)
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.setValueAtTime(freq, t)
      f.frequency.exponentialRampToValueAtTime(freq * 3, t + dur)
      f.Q.value = q
      const g = ctx.createGain()
      g.gain.setValueAtTime(vol, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      src.connect(f).connect(g).connect(out)
      src.start(t)
      src.stop(t + dur + 0.05)
    }
    switch (name) {
      case 'notify':
        tone(987.77, 0, 0.35, 'sine', 0.22)
        tone(1318.5, 0.11, 0.6, 'sine', 0.18)
        break
      case 'open':
        noise(0.22, 500, 0.12, 0.8)
        tone(420, 0, 0.18, 'sine', 0.06, 700)
        break
      case 'close':
        tone(600, 0, 0.15, 'sine', 0.06, 330)
        break
      case 'tap':
        tone(1800, 0, 0.03, 'square', 0.03)
        break
      case 'key':
        tone(1200, 0, 0.05, 'triangle', 0.08)
        break
      case 'unlock':
        tone(523.25, 0, 0.2, 'sine', 0.15)
        tone(783.99, 0.08, 0.35, 'sine', 0.15)
        break
      case 'error':
        tone(160, 0, 0.18, 'sawtooth', 0.12)
        tone(130, 0.12, 0.25, 'sawtooth', 0.12)
        break
      case 'shutter':
        noise(0.08, 3000, 0.35, 0.5)
        tone(2400, 0.05, 0.04, 'square', 0.05)
        break
      case 'send':
        tone(700, 0, 0.12, 'sine', 0.12, 1100)
        break
      case 'success':
        ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.5, 'triangle', 0.12))
        break
      case 'glitch':
        noise(0.4, 200, 0.25, 8)
        tone(90, 0, 0.4, 'square', 0.06, 40)
        break
      case 'hangup':
        tone(480, 0, 0.15, 'sine', 0.12)
        tone(380, 0.18, 0.2, 'sine', 0.12)
        break
    }
  }

  // ── Ringtone ────────────────────────────────────────────────────────────
  ring(on: boolean) {
    if (this.ringTimer) window.clearInterval(this.ringTimer)
    this.ringTimer = null
    if (!on || !this.ctx || !this.sfxBus) return
    const once = () => {
      const ctx = this.ctx!
      ;[659.25, 830.61, 987.77, 830.61].forEach((f, i) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        const t = ctx.currentTime + i * 0.18
        o.frequency.value = f
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.14, t + 0.01)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
        o.connect(g).connect(this.sfxBus!)
        o.start(t)
        o.stop(t + 0.4)
      })
    }
    once()
    this.ringTimer = window.setInterval(once, 2200)
  }

  // ── Music app tracks (procedural) ───────────────────────────────────────
  playTrack(seed: number) {
    this.stopTrack()
    if (!this.ctx || !this.musicBus) return
    this.duck(true)
    const ctx = this.ctx
    const g = ctx.createGain()
    g.gain.value = 0.6 * this.settings.music
    g.connect(this.master!)
    this.trackGain = g
    const scales = [
      [0, 3, 5, 7, 10],
      [0, 2, 3, 7, 8],
      [0, 2, 4, 7, 9],
    ]
    const scale = scales[seed % scales.length]
    const root = 196 * Math.pow(2, (seed % 7) / 12)
    const bpm = 70 + (seed % 5) * 8
    const beat = 60 / bpm
    let rnd = seed * 9301 + 49297
    const rand = () => ((rnd = (rnd * 9301 + 49297) % 233280) / 233280)
    const melody = Array.from({ length: 16 }, () => scale[Math.floor(rand() * scale.length)] + (rand() > 0.7 ? 12 : 0))
    const chords = [0, 5, 3, 4].map((d) => scale[d % scale.length])
    let step = 0
    const tick = () => {
      if (!this.ctx || !this.trackGain) return
      const t = this.ctx.currentTime + 0.05
      const n = melody[step % 16]
      if (step % 4 !== 3 || rand() > 0.5) this.voice(root * Math.pow(2, n / 12) * 2, t, beat * 0.9, 'triangle', 0.12)
      if (step % 8 === 0) {
        const c = chords[(step / 8) % 4]
        ;[0, 7, 12].forEach((iv) => this.voice(root * Math.pow(2, (c + iv) / 12) / 2, t, beat * 7.5, 'sine', 0.07))
      }
      if (step % 2 === 0) this.voice(60, t, 0.12, 'sine', 0.1)
      step++
    }
    tick()
    this.trackTimer = window.setInterval(tick, beat * 1000)
  }

  private voice(freq: number, t: number, dur: number, type: OscillatorType, vol: number) {
    if (!this.ctx || !this.trackGain) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(this.trackGain)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  stopTrack() {
    if (this.trackTimer) window.clearInterval(this.trackTimer)
    this.trackTimer = null
    if (this.trackGain) {
      this.trackGain.disconnect()
      this.trackGain = null
      this.duck(false)
    }
  }

  // ── Voice recording playback (tape hiss) ────────────────────────────────
  private hiss: AudioBufferSourceNode | null = null
  tape(on: boolean) {
    if (this.hiss) {
      this.hiss.stop()
      this.hiss.disconnect()
      this.hiss = null
    }
    if (!on || !this.ctx || !this.sfxBus) return
    const src = this.ctx.createBufferSource()
    src.buffer = this.noiseBuffer(2)
    src.loop = true
    const f = this.ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 1400
    const g = this.ctx.createGain()
    g.gain.value = 0.05
    src.connect(f).connect(g).connect(this.sfxBus)
    src.start()
    this.hiss = src
  }
}

export const audio = new AudioEngine()
