import notificationSoundSrc from '../assets/notification_sound.mp3'

let audioContext: AudioContext | null = null
let decodedBuffer: AudioBuffer | null = null
let isDecoding = false

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  if (!audioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      audioContext = new AudioCtx()
    }
  }
  return audioContext
}

export const ensureRunningContext = async (): Promise<AudioContext | null> => {
  const ctx = getAudioContext()
  if (!ctx) return null
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch (err) {
      console.warn('AudioContext resume failed:', err)
    }
  }
  return ctx
}

export const preloadNotificationAudio = async () => {
  if (decodedBuffer || isDecoding) return
  isDecoding = true

  try {
    const ctx = getAudioContext()
    if (!ctx) {
      isDecoding = false
      return
    }

    const targetUrl = '/notification_sound.mp3'
    let arrayBuffer: ArrayBuffer | null = null

    try {
      const resp = await fetch(targetUrl)
      if (resp.ok) {
        arrayBuffer = await resp.arrayBuffer()
      }
    } catch {

      try {
        const resp2 = await fetch(notificationSoundSrc)
        if (resp2.ok) {
          arrayBuffer = await resp2.arrayBuffer()
        }
      } catch {

      }
    }

    if (arrayBuffer && ctx) {
      decodedBuffer = await ctx.decodeAudioData(arrayBuffer)
    }
  } catch (err) {
    console.warn('AudioBuffer decode failed:', err)
  } finally {
    isDecoding = false
  }
}

export const playSynthesizedChime = async () => {
  try {
    const ctx = await ensureRunningContext()
    if (!ctx) return

    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now)
    gain1.gain.setValueAtTime(0.0001, now)
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.48)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880, now + 0.1)
    gain2.gain.setValueAtTime(0.0001, now + 0.1)
    gain2.gain.linearRampToValueAtTime(0.45, now + 0.13)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.8)
  } catch (err) {
    console.warn('Synthesized chime error:', err)
  }
}

const playDecodedBuffer = (ctx: AudioContext): boolean => {
  if (!decodedBuffer) return false
  try {
    const source = ctx.createBufferSource()
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.95, ctx.currentTime)
    source.buffer = decodedBuffer
    source.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start(0)
    return true
  } catch (err) {
    console.warn('playDecodedBuffer failed:', err)
    return false
  }
}

const playHtml5Audio = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio('/notification_sound.mp3')
      audio.volume = 0.95
      audio.onerror = () => {

        const fallback = new Audio(notificationSoundSrc)
        fallback.volume = 0.95
        const p2 = fallback.play()
        if (p2 !== undefined) {
          p2.then(() => resolve()).catch(reject)
        } else {
          resolve()
        }
      }

      const p = audio.play()
      if (p !== undefined) {
        p.then(() => resolve()).catch(reject)
      } else {
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}

export const playNotificationChime = async () => {
  try {
    const ctx = await ensureRunningContext()

    if (ctx && decodedBuffer) {
      const played = playDecodedBuffer(ctx)
      if (played) return
    }

    try {
      await playHtml5Audio()
      return
    } catch {

    }

    await playSynthesizedChime()
  } catch (err) {
    console.warn('playNotificationChime error:', err)
    playSynthesizedChime()
  }
}

export const unlockAudio = () => {
  ensureRunningContext()
  preloadNotificationAudio()
}

if (typeof window !== 'undefined') {
  const events = ['click', 'pointerdown', 'keydown', 'touchstart', 'mousedown']
  const handleFirstInteraction = () => {
    unlockAudio()
    events.forEach((evt) => {
      window.removeEventListener(evt, handleFirstInteraction)
    })
  }
  events.forEach((evt) => {
    window.addEventListener(evt, handleFirstInteraction, { passive: true })
  })

  preloadNotificationAudio()
}
