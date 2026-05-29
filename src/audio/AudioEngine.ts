export type MusicTrack = 'menu' | 'alert' | 'investigation' | 'victory' | 'defeat'

export type SfxName =
  | 'click'
  | 'panel'
  | 'alert'
  | 'investigate'
  | 'clue'
  | 'travelOk'
  | 'travelBad'
  | 'warrant'
  | 'win'
  | 'lose'
  | 'urgent'

const STORAGE_KEY = 'carmen-audio-muted'

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private stopMusicFn: (() => void) | null = null
  private _muted = false

  constructor() {
    try {
      this._muted = localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      this._muted = false
    }
  }

  get muted() {
    return this._muted
  }

  set muted(value: boolean) {
    this._muted = value
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      /* ignore */
    }
    if (this.masterGain) {
      this.masterGain.gain.value = value ? 0 : 1
    }
  }

  toggleMute() {
    this.muted = !this._muted
    return this._muted
  }

  async unlock() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.musicGain = this.ctx.createGain()
      this.sfxGain = this.ctx.createGain()
      this.musicGain.gain.value = 0.55
      this.sfxGain.gain.value = 0.75
      this.musicGain.connect(this.masterGain)
      this.sfxGain.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.gain.value = this._muted ? 0 : 1
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
  }

  playMusic(_track: MusicTrack, _crossfadeMs = 900) {
    this.stopMusic()
  }

  stopMusic() {
    if (this.stopMusicFn) {
      this.stopMusicFn()
      this.stopMusicFn = null
    }
  }

  playSfx(name: SfxName) {
    if (!this.ctx || !this.sfxGain || this._muted) return
    const ctx = this.ctx
    const out = this.sfxGain
    const t = ctx.currentTime

    const tone = (
      freq: number,
      dur: number,
      type: OscillatorType = 'sine',
      vol = 0.2,
      when = 0,
    ) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.setValueAtTime(0.0001, t + when)
      g.gain.exponentialRampToValueAtTime(vol, t + when + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + when + dur)
      osc.connect(g).connect(out)
      osc.start(t + when)
      osc.stop(t + when + dur + 0.05)
    }

    const sweep = (
      f0: number,
      f1: number,
      dur: number,
      type: OscillatorType = 'sawtooth',
      vol = 0.12,
    ) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(f0, t)
      osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur)
      g.gain.setValueAtTime(vol, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(g).connect(out)
      osc.start(t)
      osc.stop(t + dur + 0.05)
    }

    switch (name) {
      case 'click':
        tone(920, 0.06, 'square', 0.08)
        break
      case 'panel':
        tone(640, 0.08, 'triangle', 0.1)
        tone(880, 0.06, 'triangle', 0.07, 0.04)
        break
      case 'alert':
        sweep(280, 520, 0.35, 'sawtooth', 0.15)
        sweep(520, 280, 0.35, 'sawtooth', 0.15)
        tone(110, 0.5, 'sine', 0.2, 0.1)
        break
      case 'investigate':
        sweep(320, 780, 0.22, 'square', 0.09)
        break
      case 'clue':
        tone(523.25, 0.18, 'sine', 0.14)
        tone(659.25, 0.22, 'sine', 0.12, 0.1)
        tone(783.99, 0.28, 'sine', 0.1, 0.2)
        break
      case 'travelOk':
        tone(392, 0.12, 'triangle', 0.12)
        tone(493.88, 0.12, 'triangle', 0.12, 0.1)
        tone(587.33, 0.18, 'triangle', 0.14, 0.2)
        break
      case 'travelBad':
        sweep(440, 180, 0.45, 'sawtooth', 0.14)
        tone(98, 0.35, 'square', 0.1, 0.15)
        break
      case 'warrant':
        tone(130.81, 0.08, 'square', 0.18)
        tone(196, 0.25, 'sine', 0.15, 0.06)
        tone(261.63, 0.35, 'triangle', 0.12, 0.12)
        break
      case 'win':
        ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, i * 0.11))
        break
      case 'lose':
        sweep(392, 98, 0.55, 'sawtooth', 0.12)
        tone(73.42, 0.5, 'sine', 0.15, 0.2)
        break
      case 'urgent':
        tone(880, 0.07, 'square', 0.09)
        tone(880, 0.07, 'square', 0.09, 0.14)
        break
    }
  }
}

export const audioEngine = new AudioEngine()
