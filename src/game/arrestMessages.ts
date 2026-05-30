import type { Suspect } from './types'

export function wrongSuspectArrestMessage(accused: Suspect): string {
  return (
    `נעצרתם את ${accused.nickname} (${accused.name}), ` +
    'אך אליבי בלתי עורף הוכיח/ה שלא היה/הייתה שם. ' +
    `${accused.nickname} שוחרר/ה, והמשטרה מוציאה התנצלות רשמית על האשמה השגויה. ` +
    'גם עליכם ננזפה נזיפה חמורה.'
  )
}

export function wrongCityArrestMessage(): string {
  return 'ניסיתם לבצע מעצר לפני שהגעתם לעיר המחבוא — החשוד נמלט/ת.'
}

export function wonArrestMessage(thief: Suspect, treasure: string, atHideout: boolean): string {
  const base = `עצרתם את ${thief.name} (${thief.nickname}) והחזרתם את ${treasure}!`
  return atHideout ? `${base} מצאתם גם את מקום המחבוא המדויק.` : base
}
