import { writeFileSync } from 'fs'

const HAIRS = ['\u05d0\u05d3\u05d5\u05dd', '\u05e9\u05d7\u05d5\u05e8', '\u05d7\u05d5\u05dd', '\u05d1\u05dc\u05d5\u05e0\u05d3', '\u05d0\u05e4\u05d5\u05e8']
const HOBBIES = ['\u05e9\u05d7\u05de\u05d8', '\u05d8\u05e0\u05d9\u05e1', '\u05e6\u05d9\u05dc\u05d5\u05dd', '\u05de\u05e1\u05e2\u05d5\u05ea', '\u05e6\u05d9\u05d5\u05e8', '\u05e6\u05dc\u05d9\u05dc\u05d4', '\u05de\u05d7\u05d5\u05dc', '\u05db\u05d3\u05d5\u05e8\u05d2\u05dc', '\u05d1\u05d9\u05e9\u05d5\u05dc', '\u05e7\u05e8\u05d9\u05d0\u05d4']
const VEHICLES = ['\u05d0\u05d5\u05e4\u05e0\u05d5\u05e2', '\u05de\u05db\u05d5\u05e0\u05d9\u05ea \u05e1\u05e4\u05d5\u05e8\u05d8', '\u05d2\u05f3\u05d9\u05e4', '\u05e8\u05db\u05d1 \u05e9\u05d8\u05d7', '\u05de\u05db\u05d5\u05e0\u05d9\u05ea \u05d9\u05e9\u05e0\u05d4', '\u05de\u05d5\u05e0\u05d9\u05ea', '\u05d0\u05d5\u05e4\u05e0\u05d9\u05d9\u05dd', '\u05de\u05e9\u05d0\u05d9\u05ea', '\u05d9\u05d0\u05db\u05d8\u05d4', '\u05e8\u05db\u05d1\u05ea']
const BUILDS = ['\u05d2\u05d1\u05d5\u05d4', '\u05d2\u05d1\u05d5\u05d4\u05d4', '\u05d1\u05d9\u05e0\u05d5\u05e0\u05d9', '\u05d1\u05d9\u05e0\u05d5\u05e0\u05d9\u05ea', '\u05e0\u05de\u05d5\u05da', '\u05e0\u05de\u05d5\u05db\u05d4']
const GENDERS = ['\u05d2\u05d1\u05e8', '\u05d0\u05d9\u05e9\u05d4']
const ACCENTS = ['\u05d9\u05e9\u05e8\u05d0\u05dc\u05d9', '\u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9', '\u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9', '\u05d0\u05e1\u05d9\u05d0\u05ea\u05d9', '\u05d0\u05e4\u05e8\u05d9\u05e7\u05d0\u05d9']
const ACCESSORIES = ['\u05de\u05e9\u05e7\u05e4\u05d9\u05d9\u05dd', '\u05db\u05d5\u05d1\u05e2', '\u05e2\u05d2\u05d9\u05dc\u05d9\u05dd', '\u05e6\u05e2\u05d9\u05e3', '\u05e9\u05e2\u05d5\u05df']
const AGE_GROUPS = ['\u05e6\u05e2\u05d9\u05e8', '\u05e6\u05e2\u05d9\u05e8\u05d4', '\u05d1\u05d5\u05d2\u05e8', '\u05d1\u05d5\u05d2\u05e8\u05ea', '\u05de\u05d1\u05d5\u05d2\u05e8', '\u05de\u05d1\u05d5\u05d2\u05e8\u05ea']
const PORTRAITS = ['dana', 'yossi', 'maya', 'ron', 'lila', 'omar', 'nina']

const ROSTER = [
  ['dana', 'דנה צל-צל', 'גנבת בלי צל'],
  ['yossi', 'יוסי ג\'ירף', 'הזרוע הארוכה'],
  ['maya', 'מיה ענן-קל', 'הענן הכי כבד'],
  ['ron', 'רון כל-העולם', 'רוצה בחינם'],
  ['lila', 'לילה חתלתול', 'חצי חתול חצי לילה'],
  ['omar', 'עומר גל-גל', 'שלושה גלים בדלי'],
  ['nina', 'נינה פר-פר', 'הפרפר הכנוע'],
  ['avi', 'אבי נמר-דל', 'הנמר שנרדם'],
  ['tali', 'טלי שמש-בוערת', 'חמישה דקות ודהר'],
  ['guy', 'גיא גל-גל-גל', 'הגל שהציף הכל'],
  ['noa', 'נועה ברק-באיחור', 'הברק המאוחר'],
  ['ido', 'עידו קרן-לה', 'קרן של חמאה'],
  ['shira', 'שירה זוהר-חשוך', 'זורחת רק בחושך'],
  ['amir', 'אמיר ברזל-רך', 'ברזל שחלד'],
  ['yael', 'יעל פומה-נחיר', 'הפומה שאפה'],
  ['tom', 'תום אייל-יער', 'אייל בחלון'],
  ['hila', 'הילה ליל-סוד', 'סוד בחצות'],
  ['eran', 'ערן זאב-כושר', 'הזאב שסיר לחדר כושר'],
  ['gal', 'גל להב-עדין', 'להבה עם משקפיים'],
  ['rotem', 'רותם סער-גל', 'סופת אחר הצהריים'],
  ['uri', 'אורי שחף-סחוף', 'שחף במרינה'],
  ['merav', 'מרב אדמה-מתוקה', 'אדמה על גלגל'],
  ['dan', 'דן סער-קטן', 'סער במרוכז'],
  ['inbar', 'ענבר לב-שקוף', 'לב שקוף כמעט'],
  ['itay', 'איתי רימון-מטרף', 'רימון בשלוש חלקים'],
  ['carmit', 'כרמית דג-ביצ\'', 'דג יבש במייבש'],
  ['ben', 'בן הר-על-סיר', 'הר על כף'],
  ['sapir', 'ספיר כחול-באדום', 'כחול שלא קראו'],
]

const suspects = ROSTER.map(([id, name, nickname], i) => ({
  id,
  name,
  nickname,
  hair: HAIRS[i % HAIRS.length],
  hobby: HOBBIES[i % HOBBIES.length],
  vehicle: VEHICLES[i % VEHICLES.length],
  gender: GENDERS[i % GENDERS.length],
  build: BUILDS[i % BUILDS.length],
  accent: ACCENTS[i % ACCENTS.length],
  accessory: ACCESSORIES[i % ACCESSORIES.length],
  ageGroup: AGE_GROUPS[i % AGE_GROUPS.length],
  imageKey: PORTRAITS[i % PORTRAITS.length],
}))

const out = `import type { Suspect } from '../game/types'

/** 28 suspects with overlapping traits — multiple filters needed to identify */
export const suspects: Suspect[] = ${JSON.stringify(suspects, null, 2)}
`

writeFileSync('src/data/suspects.ts', out, 'utf8')
console.log('suspects written', suspects.length)
