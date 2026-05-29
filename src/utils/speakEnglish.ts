function hasHebrewScript(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text)
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const existing = loadVoices()
    if (existing.length) {
      resolve(existing)
      return
    }

    const onVoices = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      resolve(loadVoices())
    }

    window.speechSynthesis.addEventListener('voiceschanged', onVoices)
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
      resolve(loadVoices())
    }, 250)
  })
}

function pickVoice(voices: SpeechSynthesisVoice[], langPrefix: string): SpeechSynthesisVoice | undefined {
  const prefix = langPrefix.toLowerCase()
  return (
    voices.find((v) => v.lang.toLowerCase() === prefix) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    voices.find((v) => v.lang.toLowerCase().includes(prefix.split('-')[0]))
  )
}

function speakUtterance(
  text: string,
  lang: string,
  voices: SpeechSynthesisVoice[],
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve()
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = lang.startsWith('he') ? 0.9 : 0.92

    const voice = pickVoice(voices, lang)
    if (voice) utterance.voice = voice

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

/** Speak an English word or phrase using the browser TTS engine. */
export async function speakEnglish(word: string, speakAs?: string): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
  const voices = await waitForVoices()
  const text = speakAs ?? word
  const lang = /^[\u4e00-\u9fff]/.test(text) ? 'zh-CN' : 'en-US'
  await speakUtterance(text, lang, voices)
}

/** English first, short pause, then Hebrew translation. */
export async function speakEnglishThenHebrew(
  english: string,
  hebrew: string,
  speakAs?: string,
): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  window.speechSynthesis.cancel()
  window.speechSynthesis.resume()

  const voices = await waitForVoices()
  const enText = speakAs ?? english
  const enLang = /^[\u4e00-\u9fff]/.test(enText) ? 'zh-CN' : 'en-US'

  await speakUtterance(enText, enLang, voices)

  const shouldSpeakHebrew =
    hasHebrewScript(hebrew) && hebrew.toLowerCase().trim() !== english.toLowerCase().trim()

  if (!shouldSpeakHebrew) return

  await new Promise((r) => setTimeout(r, 450))
  await speakUtterance(hebrew, 'he-IL', voices)
}
