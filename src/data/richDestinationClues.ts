import type { ClueSegment } from '../game/types'
import { segmentsToPlainText } from '../utils/clueSegments'
import {
  gatherDestinationTemplates,
  pickBalancedDestinationClue,
  finalizeClueTemplate,
  pickVariedTemplate,
  type ClueCategory,
  type RichClueTemplate,
} from '../game/clueVariety'
import type { AlmanacEntry, City } from '../game/types'

export type { RichClueTemplate }

const he = (text: string): ClueSegment => ({ type: 'he', text })
const en = (word: string, speak?: string): ClueSegment => ({ type: 'en', word, speak })
const flag = (countryId: string): ClueSegment => ({ type: 'flag', countryId })

/** Harder clues — flags, English phrases, cultural hints (tap English to hear) */
export const richDestinationClues: Record<string, RichClueTemplate[]> = {
  'tel-aviv': [
    {
      id: 'tel-aviv-1',
      countryId: 'israel',
      segments: [flag('israel'), he(' העד שמע '), en('Shalom'), he(' וראה '), en('falafel'), he(' על הדלפק.')],
    },
    {
      id: 'tel-aviv-2',
      countryId: 'israel',
      segments: [he('האיש אמר '), en('Dead Sea'), he(' ו'), en('Mediterranean'), he(' — ודגל '), flag('israel'), he('.')],
    },
    {
      id: 'tel-aviv-3',
      countryId: 'israel',
      segments: [he('נושא '), en('shekel'), he(' בכיס ומזכיר '), en('Western Wall'), he(' בירושלים.')],
    },
    {
      id: 'tel-aviv-4',
      countryId: 'israel',
      segments: [flag('israel'), he(' על החולצה — שאל על '), en('Mediterranean beach'), he(' ו'), en('hummus'), he('.')],
    },
    {
      id: 'tel-aviv-5',
      countryId: 'israel',
      segments: [he('לחש '), en('Sababa'), he(' — מבטא '), en('Hebrew'), he(' וחום '), en('Middle East'), he('.')],
    },
  ],
  paris: [
    {
      id: 'paris-1',
      countryId: 'france',
      segments: [flag('france'), he(' העד שמע '), en('Bonjour'), he(' ו'), en('croissant'), he(' על השולחן.')],
    },
    {
      id: 'paris-2',
      countryId: 'france',
      segments: [he('דיבר על '), en('Eiffel Tower'), he(' ו'), en('Seine River'), he(' — דגל '), flag('france'), he('.')],
    },
    {
      id: 'paris-3',
      countryId: 'france',
      segments: [he('שילם ב'), en('euro'), he(' ואמר '), en('Louvre Museum'), he(' בלחש.')],
    },
    {
      id: 'paris-4',
      countryId: 'france',
      segments: [flag('france'), he(' על התיק — '), en('Merci'), he(' ו'), en('baguette'), he(' ביד.')],
    },
    {
      id: 'paris-5',
      countryId: 'france',
      segments: [he('הזכיר '), en('Notre Dame'), he(' ו'), en('croissant'), he(' על השולחן.')],
    },
  ],
  cairo: [
    {
      id: 'cairo-1',
      countryId: 'egypt',
      segments: [flag('egypt'), he(' העד שמע '), en('Salaam'), he(' ו'), en('pyramids'), he(' במדבר.')],
    },
    {
      id: 'cairo-2',
      countryId: 'egypt',
      segments: [he('דיבר על '), en('Nile River'), he(' ו'), en('Sphinx'), he(' — דגל '), flag('egypt'), he('.')],
    },
    {
      id: 'cairo-3',
      countryId: 'egypt',
      segments: [he('אמר '), en('pharaoh'), he(' ו'), en('desert'), he(' — שפה '), en('Arabic'), he('.')],
    },
    {
      id: 'cairo-4',
      countryId: 'egypt',
      segments: [flag('egypt'), he(' על הכובע — '), en('spice bazaar'), he(' ו'), en('spices'), he('.')],
    },
    {
      id: 'cairo-5',
      countryId: 'egypt',
      segments: [he('הזכיר '), en('Egyptian pound'), he(' ו'), en('ancient tomb'), he(' במוזיאון.')],
    },
  ],
  tokyo: [
    {
      id: 'tokyo-1',
      countryId: 'japan',
      segments: [flag('japan'), he(' העד שמע: «'), en('I am a samurai'), he('» — דגל עם עיגול אדום.')],
    },
    {
      id: 'tokyo-2',
      countryId: 'japan',
      segments: [he('אמר '), en('sayonara'), he(' ו'), en('sushi'), he(' — '), flag('japan'), he(' על החולצה.')],
    },
    {
      id: 'tokyo-3',
      countryId: 'japan',
      segments: [he('דיבר על '), en('Mount Fuji'), he(' ו'), en('sushi'), he(' בלילה.')],
    },
    {
      id: 'tokyo-4',
      countryId: 'japan',
      segments: [flag('japan'), he(' — שילם '), en('yen'), he(' ולחש '), en('konnichiwa'), he('.')],
    },
    {
      id: 'tokyo-5',
      countryId: 'japan',
      segments: [he('הזכיר '), en('shrine'), he(', '), en('bullet train'), he(' ו'), en('Japanese'), he('.')],
    },
  ],
  'new-york': [
    {
      id: 'new-york-1',
      countryId: 'usa',
      segments: [flag('usa'), he(' העד שמע '), en('Howdy'), he(' ו'), en('Statue of Liberty'), he('.')],
    },
    {
      id: 'new-york-2',
      countryId: 'usa',
      segments: [he('אכל '), en('hot dog'), he(' ודיבר על '), en('Central Park'), he(' — '), flag('usa'), he('.')],
    },
    {
      id: 'new-york-3',
      countryId: 'usa',
      segments: [he('שילם '), en('dollar'), he(' ואמר '), en('New York City'), he(' בטלפון.')],
    },
    {
      id: 'new-york-4',
      countryId: 'usa',
      segments: [flag('usa'), he(' על התיק — '), en('yellow taxi'), he(' ו'), en('Broadway'), he('.')],
    },
    {
      id: 'new-york-5',
      countryId: 'usa',
      segments: [he('הזכיר '), en('American English'), he(' ו'), en('skyscraper'), he(' גבוה.')],
    },
  ],
  berlin: [
    {
      id: 'berlin-1',
      countryId: 'germany',
      segments: [flag('germany'), he(' העד שמע '), en('Guten Tag'), he(' ו'), en('Bratwurst'), he('.')],
    },
    {
      id: 'berlin-2',
      countryId: 'germany',
      segments: [he('דיבר על '), en('Brandenburg Gate'), he(' — '), flag('germany'), he(' ו'), en('pretzel'), he('.')],
    },
    {
      id: 'berlin-3',
      countryId: 'germany',
      segments: [he('שתה '), en('beer'), he(' ואמר '), en('German'), he(' עם מבטא קשה.')],
    },
    {
      id: 'berlin-4',
      countryId: 'germany',
      segments: [flag('germany'), he(' — '), en('euro'), he(' בכיס ו'), en('Autobahn'), he(' בכרטיס.')],
    },
    {
      id: 'berlin-5',
      countryId: 'germany',
      segments: [he('הזכיר '), en('Oktoberfest'), he(' ו'), en('castle'), he(' ביער.')],
    },
  ],
  'buenos-aires': [
    {
      id: 'buenos-aires-1',
      countryId: 'argentina',
      segments: [flag('argentina'), he(' העד אמר '), en('Hola'), he(' ו'), en('tango'), he(' בלילה.')],
    },
    {
      id: 'buenos-aires-2',
      countryId: 'argentina',
      segments: [he('דיבר על '), en('Obelisco'), he(' — '), flag('argentina'), he(' ו'), en('pampas'), he('.')],
    },
    {
      id: 'buenos-aires-3',
      countryId: 'argentina',
      segments: [he('אמר '), en('Spanish'), he(' דרום-אמריקאי ו'), en('steak'), he(' על האש.')],
    },
    {
      id: 'buenos-aires-4',
      countryId: 'argentina',
      segments: [flag('argentina'), he(' — '), en('peso'), he(' ו'), en('Buenos Aires'), he(' על גלויה.')],
    },
    {
      id: 'buenos-aires-5',
      countryId: 'argentina',
      segments: [he('הזכיר '), en('gaucho'), he(' ו'), en('mate tea'), he(' בקנקן.')],
    },
  ],
  sydney: [
    {
      id: 'sydney-1',
      countryId: 'australia',
      segments: [flag('australia'), he(' העד אמר '), en('G day mate'), he(' ו'), en('Opera House'), he('.')],
    },
    {
      id: 'sydney-2',
      countryId: 'australia',
      segments: [he('דיבר על '), en('Harbour Bridge'), he(' — '), flag('australia'), he(' ו'), en('kangaroo'), he('.')],
    },
    {
      id: 'sydney-3',
      countryId: 'australia',
      segments: [he('אמר '), en('Australian dollar'), he(' ו'), en('English'), he(' עם מבטא מוזר.')],
    },
    {
      id: 'sydney-4',
      countryId: 'australia',
      segments: [flag('australia'), he(' — '), en('koala'), he(' ו'), en('beach'), he(' זהוב.')],
    },
    {
      id: 'sydney-5',
      countryId: 'australia',
      segments: [he('הזכיר '), en('outback'), he(' ו'), en('koala'), he(' על חולצה.')],
    },
  ],
  mumbai: [
    {
      id: 'mumbai-1',
      countryId: 'india',
      segments: [flag('india'), he(' העד אמר '), en('Namaste'), he(' ו'), en('curry'), he(' חריף.')],
    },
    {
      id: 'mumbai-2',
      countryId: 'india',
      segments: [he('דיבר על '), en('Taj Mahal'), he(' — '), flag('india'), he(' ו'), en('rupee'), he('.')],
    },
    {
      id: 'mumbai-3',
      countryId: 'india',
      segments: [he('הזכיר '), en('Hindi'), he(', '), en('Bollywood'), he(' ו'), en('monsoon'), he('.')],
    },
    {
      id: 'mumbai-4',
      countryId: 'india',
      segments: [flag('india'), he(' — '), en('Taj Mahal'), he(' ו'), en('spicy chai'), he(' בכוס.')],
    },
    {
      id: 'mumbai-5',
      countryId: 'india',
      segments: [he('אמר '), en('Gateway of India'), he(' ו'), en('elephant'), he(' בכרטיס.')],
    },
  ],
  london: [
    {
      id: 'london-1',
      countryId: 'uk',
      segments: [flag('uk'), he(' העד אמר '), en('Cheerio'), he(' ו'), en('Big Ben'), he('.')],
    },
    {
      id: 'london-2',
      countryId: 'uk',
      segments: [he('דיבר על '), en('Tower Bridge'), he(' — '), flag('uk'), he(' ו'), en('Buckingham Palace'), he('.')],
    },
    {
      id: 'london-3',
      countryId: 'uk',
      segments: [he('שילם '), en('pound'), he(' ואמר '), en('British English'), he(' מושלם.')],
    },
    {
      id: 'london-4',
      countryId: 'uk',
      segments: [flag('uk'), he(' — '), en('fish and chips'), he(' ו'), en('red bus'), he('.')],
    },
    {
      id: 'london-5',
      countryId: 'uk',
      segments: [he('הזכיר '), en('Big Ben'), he(' ו'), en('double decker'), he(' ברחוב.')],
    },
  ],
  rio: [
    {
      id: 'rio-1',
      countryId: 'brazil',
      segments: [flag('brazil'), he(' העד אמר '), en('Ola'), he(' ו'), en('Carnival'), he('.')],
    },
    {
      id: 'rio-2',
      countryId: 'brazil',
      segments: [he('דיבר על '), en('Christ the Redeemer'), he(' — '), flag('brazil'), he(' ו'), en('samba'), he('.')],
    },
    {
      id: 'rio-3',
      countryId: 'brazil',
      segments: [he('אמר '), en('Portuguese'), he(' ו'), en('Copacabana beach'), he('.')],
    },
    {
      id: 'rio-4',
      countryId: 'brazil',
      segments: [flag('brazil'), he(' — '), en('real'), he(' ו'), en('rainforest'), he(' בכרטיס.')],
    },
    {
      id: 'rio-5',
      countryId: 'brazil',
      segments: [he('הזכיר '), en('samba'), he(' ו'), en('football'), he(' על החולצה.')],
    },
  ],
  istanbul: [
    {
      id: 'istanbul-1',
      countryId: 'turkey',
      segments: [flag('turkey'), he(' העד אמר '), en('Merhaba'), he(' ו'), en('bazaar'), he('.')],
    },
    {
      id: 'istanbul-2',
      countryId: 'turkey',
      segments: [he('דיבר על '), en('Hagia Sophia'), he(' — '), flag('turkey'), he(' ו'), en('Bosphorus'), he('.')],
    },
    {
      id: 'istanbul-3',
      countryId: 'turkey',
      segments: [he('אמר '), en('Turkish'), he(' ו'), en('kebab'), he(' על הרחוב.')],
    },
    {
      id: 'istanbul-4',
      countryId: 'turkey',
      segments: [flag('turkey'), he(' — '), en('lira'), he(' ו'), en('mosque'), he(' עם מינרеты.')],
    },
    {
      id: 'istanbul-5',
      countryId: 'turkey',
      segments: [he('הזכיר '), en('Bosphorus'), he(' ו'), en('Europe and Asia'), he('.')],
    },
  ],
  rome: [
    {
      id: 'rome-1',
      countryId: 'italy',
      segments: [flag('italy'), he(' העד אמר '), en('Ciao'), he(' ו'), en('pizza'), he('.')],
    },
    {
      id: 'rome-2',
      countryId: 'italy',
      segments: [he('דיבר על '), en('Colosseum'), he(' — '), flag('italy'), he(' ו'), en('Vatican'), he('.')],
    },
    {
      id: 'rome-3',
      countryId: 'italy',
      segments: [he('אמר '), en('Italian'), he(' ו'), en('gelato'), he(' ביד.')],
    },
    {
      id: 'rome-4',
      countryId: 'italy',
      segments: [flag('italy'), he(' — '), en('euro'), he(' ו'), en('Roman Empire'), he(' בכרטיס.')],
    },
    {
      id: 'rome-5',
      countryId: 'italy',
      segments: [he('הזכיר '), en('Colosseum'), he(' ו'), en('Trevi Fountain'), he('.')],
    },
  ],
  madrid: [
    {
      id: 'madrid-1',
      countryId: 'spain',
      segments: [flag('spain'), he(' העד אמר '), en('Hola'), he(' ו'), en('flamenco'), he('.')],
    },
    {
      id: 'madrid-2',
      countryId: 'spain',
      segments: [he('דיבר על '), en('Prado Museum'), he(' — '), flag('spain'), he(' ו'), en('tapas'), he('.')],
    },
    {
      id: 'madrid-3',
      countryId: 'spain',
      segments: [he('אמר '), en('Spanish'), he(' ו'), en('bullfight'), he(' בכרטיס.')],
    },
    {
      id: 'madrid-4',
      countryId: 'spain',
      segments: [flag('spain'), he(' — '), en('flamenco'), he(' ו'), en('siesta'), he(' אחר הצהריים.')],
    },
    {
      id: 'madrid-5',
      countryId: 'spain',
      segments: [he('הזכיר '), en('euro'), he(' ו'), en('plaza'), he(' גדולה.')],
    },
  ],
  moscow: [
    {
      id: 'moscow-1',
      countryId: 'russia',
      segments: [flag('russia'), he(' העד אמר '), en('Privyet'), he(' ו'), en('vodka'), he('.')],
    },
    {
      id: 'moscow-2',
      countryId: 'russia',
      segments: [he('דיבר על '), en('Red Square'), he(' — '), flag('russia'), he(' ו'), en('Kremlin'), he('.')],
    },
    {
      id: 'moscow-3',
      countryId: 'russia',
      segments: [he('אמר '), en('Russian'), he(' ו'), en('ruble'), he(' בכיס.')],
    },
    {
      id: 'moscow-4',
      countryId: 'russia',
      segments: [flag('russia'), he(' — '), en('Red Square'), he(' ו'), en('winter'), he(' קשה.')],
    },
    {
      id: 'moscow-5',
      countryId: 'russia',
      segments: [he('הזכיר '), en('St Basil'), he(' ו'), en('matryoshka'), he(' doll.')],
    },
  ],
  beijing: [
    {
      id: 'beijing-1',
      countryId: 'china',
      segments: [flag('china'), he(' העד שמע '), en('Ni Hao', 'Nee how'), he(' — ודגל אדום עם כוכבים.')],
    },
    {
      id: 'beijing-2',
      countryId: 'china',
      segments: [he('אמר '), en('Great Wall'), he(' ו'), flag('china'), he(' על הכובע.')],
    },
    {
      id: 'beijing-3',
      countryId: 'china',
      segments: [he('דיבר על '), en('Forbidden City'), he(', '), en('dragon'), he(' ו'), en('Mandarin'), he('.')],
    },
    {
      id: 'beijing-4',
      countryId: 'china',
      segments: [flag('china'), he(' — '), en('yuan'), he(' ו'), en('kung fu'), he(' על החולצה.')],
    },
    {
      id: 'beijing-5',
      countryId: 'china',
      segments: [he('הזכיר '), en('Great Wall'), he(' ו'), en('red lantern'), he(' בחנות.')],
    },
  ],
  bangkok: [
    {
      id: 'bangkok-1',
      countryId: 'thailand',
      segments: [flag('thailand'), he(' העד אמר '), en('Sawadee'), he(' ו'), en('temple'), he('.')],
    },
    {
      id: 'bangkok-2',
      countryId: 'thailand',
      segments: [he('דיבר על '), en('Grand Palace'), he(' — '), flag('thailand'), he(' ו'), en('Thai baht'), he('.')],
    },
    {
      id: 'bangkok-3',
      countryId: 'thailand',
      segments: [he('אמר '), en('Thai'), he(' ו'), en('pad thai'), he(' בקופסה.')],
    },
    {
      id: 'bangkok-4',
      countryId: 'thailand',
      segments: [flag('thailand'), he(' — '), en('tuk tuk'), he(' ו'), en('Buddha temple'), he(' ברחוב.')],
    },
    {
      id: 'bangkok-5',
      countryId: 'thailand',
      segments: [he('הזכיר '), en('Buddha'), he(' ו'), en('floating market'), he('.')],
    },
  ],
  athens: [
    {
      id: 'athens-1',
      countryId: 'greece',
      segments: [flag('greece'), he(' העד אמר '), en('Yassas'), he(' ו'), en('Acropolis'), he('.')],
    },
    {
      id: 'athens-2',
      countryId: 'greece',
      segments: [he('דיבר על '), en('Parthenon'), he(' — '), flag('greece'), he(' ו'), en('Greek'), he('.')],
    },
    {
      id: 'athens-3',
      countryId: 'greece',
      segments: [he('אמר '), en('euro'), he(' ו'), en('olive oil'), he(' בבקבוק.')],
    },
    {
      id: 'athens-4',
      countryId: 'greece',
      segments: [flag('greece'), he(' — '), en('Acropolis'), he(' ו'), en('democracy'), he(' בכיתה.')],
    },
    {
      id: 'athens-5',
      countryId: 'greece',
      segments: [he('הזכיר '), en('Mediterranean'), he(' ו'), en('ancient ruins'), he('.')],
    },
  ],
  'mexico-city': [
    {
      id: 'mexico-city-1',
      countryId: 'mexico',
      segments: [flag('mexico'), he(' העד אמר '), en('Hola amigo'), he(' ו'), en('taco'), he('.')],
    },
    {
      id: 'mexico-city-2',
      countryId: 'mexico',
      segments: [he('דיבר על '), en('Aztec pyramid'), he(' — '), flag('mexico'), he(' ו'), en('peso'), he('.')],
    },
    {
      id: 'mexico-city-3',
      countryId: 'mexico',
      segments: [he('אמר '), en('Spanish'), he(' מקסיקני ו'), en('sombrero'), he(' ביד.')],
    },
    {
      id: 'mexico-city-4',
      countryId: 'mexico',
      segments: [flag('mexico'), he(' — '), en('Mexico City'), he(' ו'), en('high altitude'), he('.')],
    },
    {
      id: 'mexico-city-5',
      countryId: 'mexico',
      segments: [he('הזכיר '), en('mariachi'), he(' ו'), en('guacamole'), he('.')],
    },
  ],
  montreal: [
    {
      id: 'montreal-1',
      countryId: 'canada',
      segments: [flag('canada'), he(' העד אמר '), en('Bonjour'), he(' ו'), en('maple syrup'), he('.')],
    },
    {
      id: 'montreal-2',
      countryId: 'canada',
      segments: [he('דיבר '), en('English'), he(' ו'), en('French'), he(' עם המוכר.')],
    },
    {
      id: 'montreal-2-flag',
      countryId: 'canada',
      segments: [he('החשוד לבש חולצה עם דגל '), flag('canada'), he('.')],
    },
    {
      id: 'montreal-3',
      countryId: 'canada',
      segments: [he('אמר '), en('maple leaf'), he(' ו'), en('poutine'), he(' בגלוי.')],
    },
    {
      id: 'montreal-4',
      countryId: 'canada',
      segments: [flag('canada'), he(' — '), en('maple leaf'), he(' ו'), en('winter'), he(' קפוא.')],
    },
    {
      id: 'montreal-5',
      countryId: 'canada',
      segments: [he('הזכיר '), en('hockey'), he(' ו'), en('poutine'), he(' במסעדה.')],
    },
  ],
  amsterdam: [
    {
      id: 'amsterdam-1',
      countryId: 'netherlands',
      segments: [flag('netherlands'), he(' העד אמר '), en('Hallo'), he(' ו'), en('canal'), he('.')],
    },
    {
      id: 'amsterdam-2',
      countryId: 'netherlands',
      segments: [he('דיבר על '), en('tulip'), he(' — '), flag('netherlands'), he(' ו'), en('bicycle'), he('.')],
    },
    {
      id: 'amsterdam-3',
      countryId: 'netherlands',
      segments: [he('אמר '), en('Dutch'), he(' ו'), en('euro'), he(' בכיס.')],
    },
    {
      id: 'amsterdam-4',
      countryId: 'netherlands',
      segments: [flag('netherlands'), he(' — '), en('tulip'), he(' ו'), en('windmill'), he('.')],
    },
    {
      id: 'amsterdam-5',
      countryId: 'netherlands',
      segments: [he('הזכיר '), en('Van Gogh'), he(' ו'), en('Dutch cheese'), he('.')],
    },
  ],
  johannesburg: [
    {
      id: 'johannesburg-1',
      countryId: 'south-africa',
      segments: [flag('south-africa'), he(' העד אמר '), en('Howzit'), he(' ו'), en('safari'), he('.')],
    },
    {
      id: 'johannesburg-2',
      countryId: 'south-africa',
      segments: [he('דיבר על '), en('Apartheid Museum'), he(' — '), flag('south-africa'), he('.')],
    },
    {
      id: 'johannesburg-3',
      countryId: 'south-africa',
      segments: [he('אמר '), en('English'), he(' דרום-אפריקאי ו'), en('rand'), he('.')],
    },
    {
      id: 'johannesburg-4',
      countryId: 'south-africa',
      segments: [flag('south-africa'), he(' — '), en('safari'), he(' ו'), en('gold mine'), he('.')],
    },
    {
      id: 'johannesburg-5',
      countryId: 'south-africa',
      segments: [he('הזכיר '), en('lion'), he(' ו'), en('savanna'), he(' בכרטיס.')],
    },
  ],
  warsaw: [
    {
      id: 'warsaw-1',
      countryId: 'poland',
      segments: [flag('poland'), he(' העד אמר '), en('pierogi'), he(' ו'), en('zloty'), he('.')],
    },
    {
      id: 'warsaw-2',
      countryId: 'poland',
      segments: [he('הזכיר '), en('Marie Curie'), he(' ו'), en('Warsaw Old Town'), he('.')],
    },
    {
      id: 'warsaw-3',
      countryId: 'poland',
      segments: [he('דיבר '), en('Polish'), he(' ו'), en('Solidarity movement'), he('.')],
    },
  ],
  lisbon: [
    {
      id: 'lisbon-1',
      countryId: 'portugal',
      segments: [flag('portugal'), he(' — '), en('pastel de nata'), he(' ו'), en('Belem Tower'), he('.')],
    },
    {
      id: 'lisbon-2',
      countryId: 'portugal',
      segments: [he('הזכיר '), en('Vasco da Gama'), he(' ו'), en('Age of Discovery'), he('.')],
    },
    {
      id: 'lisbon-3',
      countryId: 'portugal',
      segments: [he('דיבר '), en('Portuguese'), he(' עם '), en('euro'), he(' בכיס.')],
    },
  ],
  stockholm: [
    {
      id: 'stockholm-1',
      countryId: 'sweden',
      segments: [flag('sweden'), he(' — '), en('Swedish meatballs'), he(' ו'), en('Nobel Prize'), he('.')],
    },
    {
      id: 'stockholm-2',
      countryId: 'sweden',
      segments: [he('הזכיר '), en('ABBA'), he(' ו'), en('Vasa Museum'), he('.')],
    },
    {
      id: 'stockholm-3',
      countryId: 'sweden',
      segments: [he('דיבר '), en('Swedish'), he(' ו'), en('krona'), he('.')],
    },
  ],
  'ho-chi-minh': [
    {
      id: 'ho-chi-minh-1',
      countryId: 'vietnam',
      segments: [flag('vietnam'), he(' — '), en('pho'), he(' ו'), en('spring rolls'), he('.')],
    },
    {
      id: 'ho-chi-minh-2',
      countryId: 'vietnam',
      segments: [he('הזכיר '), en('Ho Chi Minh'), he(' ו'), en('Ha Long Bay'), he('.')],
    },
    {
      id: 'ho-chi-minh-3',
      countryId: 'vietnam',
      segments: [he('דיבר '), en('Vietnamese'), he(' ו'), en('dong'), he('.')],
    },
  ],
  nairobi: [
    {
      id: 'nairobi-1',
      countryId: 'kenya',
      segments: [flag('kenya'), he(' — '), en('safari'), he(' ו'), en('nyama choma'), he('.')],
    },
    {
      id: 'nairobi-2',
      countryId: 'kenya',
      segments: [he('הזכיר '), en('Wangari Maathai'), he(' ו'), en('Mount Kenya'), he('.')],
    },
    {
      id: 'nairobi-3',
      countryId: 'kenya',
      segments: [he('דיבר '), en('Swahili'), he(' ו'), en('shilling'), he('.')],
    },
  ],
  seoul: [
    {
      id: 'seoul-1',
      countryId: 'south-korea',
      segments: [flag('south-korea'), he(' — '), en('kimchi'), he(' ו'), en('Korean barbecue'), he('.')],
    },
    {
      id: 'seoul-2',
      countryId: 'south-korea',
      segments: [he('הזכיר '), en('King Sejong'), he(' ו'), en('Seoul Olympics'), he('.')],
    },
    {
      id: 'seoul-3',
      countryId: 'south-korea',
      segments: [he('דיבר '), en('Korean'), he(' ו'), en('won'), he('.')],
    },
  ],
}

function pickUnusedTemplate(
  pool: RichClueTemplate[],
  usedKeys: Set<string>,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedEnglish: Set<string>,
  usedTexts: Set<string>,
  entry?: AlmanacEntry,
  usedPlaceGroups?: Set<number>,
): RichClueTemplate | null {
  return pickVariedTemplate(
    pool,
    usedKeys,
    globalUsed,
    cityUsed,
    usedEnglish,
    usedTexts,
    entry,
    usedPlaceGroups,
  )
}

export function pickRichClueForCity(
  cityId: string,
  usedKeys: Set<string>,
  globalUsed: Set<ClueCategory>,
  cityUsed: Set<ClueCategory>,
  usedEnglish: Set<string>,
  city?: City,
  entry?: AlmanacEntry,
  usedTexts: Set<string> = usedKeys,
  usedFacts: Set<string> = new Set(),
  usedPlaceGroups: Set<number> = new Set(),
  _slotIndex = 0,
): RichClueTemplate | null {
  const staticPool = richDestinationClues[cityId] ?? []

  if (city && entry) {
    const allTemplates = gatherDestinationTemplates(
      city,
      entry,
      staticPool,
      globalUsed,
      cityUsed,
      usedFacts,
      usedPlaceGroups,
    )
    const balanced = pickBalancedDestinationClue(
      allTemplates,
      globalUsed,
      cityUsed,
      usedEnglish,
      usedTexts,
      entry,
      usedPlaceGroups,
    )
    if (balanced) return balanced
  }

  if (staticPool.length) {
    return pickUnusedTemplate(
      staticPool,
      usedKeys,
      globalUsed,
      cityUsed,
      usedEnglish,
      usedTexts,
      entry,
      usedPlaceGroups,
    )
  }

  return null
}

export function pickRichClueForWrongCity(
  excludeCityId: string,
  usedKeys: Set<string>,
  usedCategories: Set<ClueCategory>,
  usedEnglish: Set<string>,
  usedTexts: Set<string> = usedKeys,
): RichClueTemplate {
  const pool = Object.entries(richDestinationClues)
    .filter(([id]) => id !== excludeCityId)
    .flatMap(([, clues]) => clues)
  if (!pool.length) {
    return {
      id: 'wrong-fallback',
      countryId: '',
      segments: [he('העד נתן רמז מטעה — פרטים שלא תואמים את האזור.')],
    }
  }
  return pickUnusedTemplate(pool, usedKeys, usedCategories, new Set(), usedEnglish, usedTexts) ?? pool[0]!
}

export function richClueToDisplay(
  template: RichClueTemplate,
  city: City,
  entry: AlmanacEntry,
  usedFacts: Set<string> = new Set(),
  usedPlaceGroups: Set<number> = new Set(),
) {
  const finalized = finalizeClueTemplate(template, city, entry, usedFacts, usedPlaceGroups)
  const text = segmentsToPlainText(finalized.segments)
  return {
    dedupeKey: text,
    text,
    segments: finalized.segments,
    targetCountryId: finalized.countryId,
  }
}

// Re-export for plain-text fallback consumers
export { segmentsToPlainText }
