export type AmbientSoundType = 'none' | 'brown' | 'white' | 'rain' | 'alpha'

class SoundEngine {
  private ctx: AudioContext | null = null
  private sourceNode: AudioNode | null = null
  private gainNode: GainNode | null = null
  private activeType: AmbientSoundType = 'none'

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  play(type: AmbientSoundType, volume = 0.5) {
    this.stop()
    if (type === 'none') return

    const ctx = this.initCtx()
    this.activeType = type

    this.gainNode = ctx.createGain()
    this.gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime)
    this.gainNode.connect(ctx.destination)

    if (type === 'white') {
      // 2 seconds buffer of white noise looped
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true
      noise.connect(this.gainNode)
      noise.start()
      this.sourceNode = noise
    } else if (type === 'brown') {
      // Brown noise: integrate white noise with leaky integrator
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]!
        data[i]! *= 3.5 // gain compensation
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      // Lowpass filter for deep smooth rumble
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, ctx.currentTime)

      noise.connect(filter)
      filter.connect(this.gainNode)
      noise.start()
      this.sourceNode = noise
    } else if (type === 'rain') {
      // Ambient rain sound: filtered noise with bandpass resonance
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1200, ctx.currentTime)
      filter.Q.setValueAtTime(1.5, ctx.currentTime)

      noise.connect(filter)
      filter.connect(this.gainNode)
      noise.start()
      this.sourceNode = noise
    } else if (type === 'alpha') {
      // 40Hz binaural / rhythmic carrier wave at 220Hz + 260Hz
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      osc1.type = 'sine'
      osc2.type = 'sine'
      osc1.frequency.setValueAtTime(216, ctx.currentTime)
      osc2.frequency.setValueAtTime(256, ctx.currentTime)

      osc1.connect(this.gainNode)
      osc2.connect(this.gainNode)
      osc1.start()
      osc2.start()
      this.sourceNode = osc1
    }
  }

  setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime)
    }
  }

  stop() {
    if (this.sourceNode) {
      try {
        if ('stop' in this.sourceNode) {
          ;(this.sourceNode as AudioScheduledSourceNode).stop()
        }
        this.sourceNode.disconnect()
      } catch {
        // ignore
      }
      this.sourceNode = null
    }
    this.activeType = 'none'
  }

  getActiveType(): AmbientSoundType {
    return this.activeType
  }
}

export const soundEngine = new SoundEngine()
