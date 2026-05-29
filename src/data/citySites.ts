import type { InvestigationSite } from '../game/types'

/** Varied investigation actions per city — each with a matching cartoon scene */
export const citySites: Record<string, InvestigationSite[]> = {
  'tel-aviv': [
    { id: 'tel-aviv-delivery', name: 'שאל את שליח המשלוחים', scene: 'delivery-boy' },
    { id: 'tel-aviv-market', name: 'שאל בשוק הכרמל', scene: 'market' },
    { id: 'tel-aviv-beach', name: 'שאל את המציל בחוף', scene: 'beach-lifeguard' },
  ],
  paris: [
    { id: 'paris-cafe', name: 'שאל את המלצר בביסטרו', scene: 'cafe-waiter' },
    { id: 'paris-museum', name: 'שאל שומר במוזיאון', scene: 'museum-guard' },
    { id: 'paris-taxi', name: 'דבר עם נהג מונית', scene: 'taxi-driver' },
  ],
  cairo: [
    { id: 'cairo-bazaar', name: 'שאל בשוק המקורה', scene: 'bazaar' },
    { id: 'cairo-hotel', name: 'שאל בקבלת המלון', scene: 'hotel-clerk' },
    { id: 'cairo-tour', name: 'שאל מדריך תיירים', scene: 'tour-guide' },
  ],
  tokyo: [
    { id: 'tokyo-fish', name: 'שאל בשוק הדגים', scene: 'fish-market' },
    { id: 'tokyo-subway', name: 'חקור בתחנת הרכבת', scene: 'subway' },
    { id: 'tokyo-monk', name: 'שאל ליד המקדש', scene: 'monk' },
  ],
  'new-york': [
    { id: 'new-york-park', name: 'שאל רץ בפארק', scene: 'park-jogger' },
    { id: 'new-york-news', name: 'שאל בדוכן העיתונים', scene: 'newsstand' },
    { id: 'new-york-alley', name: 'חקור בסמטה חשוכה', scene: 'alley' },
  ],
  berlin: [
    { id: 'berlin-construction', name: 'שאל באתר בנייה', scene: 'construction' },
    { id: 'berlin-subway', name: 'חקור במטרו', scene: 'subway' },
    { id: 'berlin-vendor', name: 'שאל דוכן רחוב', scene: 'street-vendor' },
  ],
  'buenos-aires': [
    { id: 'buenos-aires-cafe', name: 'שאל בבית קפה', scene: 'cafe-waiter' },
    { id: 'buenos-aires-taxi', name: 'דבר עם נהג מונית', scene: 'taxi-driver' },
    { id: 'buenos-aires-dock', name: 'שאל בנמל', scene: 'dock-worker' },
  ],
  sydney: [
    { id: 'sydney-beach', name: 'שאל את המציל', scene: 'beach-lifeguard' },
    { id: 'sydney-harbour', name: 'שאל עובד בנמל', scene: 'dock-worker' },
    { id: 'sydney-tour', name: 'שאל מדריך תיירים', scene: 'tour-guide' },
  ],
  mumbai: [
    { id: 'mumbai-market', name: 'שאל בשוק העיר', scene: 'market' },
    { id: 'mumbai-train', name: 'דבר עם כרטיסן ברכבת', scene: 'train-conductor' },
    { id: 'mumbai-vendor', name: 'שאל דוכן רחוב', scene: 'street-vendor' },
  ],
  london: [
    { id: 'london-bus', name: 'דבר עם נהג אוטובוס', scene: 'bus-driver' },
    { id: 'london-bridge', name: 'שאל בגשר', scene: 'bridge-toll' },
    { id: 'london-underground', name: 'חקור בחניון תת-קרקעי', scene: 'underground-garage' },
  ],
  rio: [
    { id: 'rio-beach', name: 'שאל את המציל בחוף', scene: 'beach-lifeguard' },
    { id: 'rio-rooftop', name: 'חקור על הגג', scene: 'rooftop' },
    { id: 'rio-vendor', name: 'שאל דוכן רחוב', scene: 'street-vendor' },
  ],
  istanbul: [
    { id: 'istanbul-bazaar', name: 'שאל בשוק הגדול', scene: 'bazaar' },
    { id: 'istanbul-delivery', name: 'שאל את שליח המשלוחים', scene: 'delivery-boy' },
    { id: 'istanbul-alley', name: 'חקור בסמטה עתיקה', scene: 'alley' },
  ],
  rome: [
    { id: 'rome-tour', name: 'שאל מדריך תיירים', scene: 'tour-guide' },
    { id: 'rome-cafe', name: 'שאל במסעדה', scene: 'cafe-waiter' },
    { id: 'rome-museum', name: 'שאל שומר במוזיאון', scene: 'museum-guard' },
  ],
  madrid: [
    { id: 'madrid-market', name: 'שאל בשוק', scene: 'market' },
    { id: 'madrid-park', name: 'שאל רץ בפארק', scene: 'park-jogger' },
    { id: 'madrid-cafe', name: 'שאל בבית קפה', scene: 'cafe-waiter' },
  ],
  moscow: [
    { id: 'moscow-subway', name: 'חקור בתחנת המטרו', scene: 'subway' },
    { id: 'moscow-sewers', name: 'חקור בביוב', scene: 'sewers' },
    { id: 'moscow-informant', name: 'דבר עם מקור במשטרה', scene: 'police-informant' },
  ],
  beijing: [
    { id: 'beijing-market', name: 'שאל בשוק', scene: 'market' },
    { id: 'beijing-monk', name: 'שאל ליד המקדש', scene: 'monk' },
    { id: 'beijing-construction', name: 'שאל באתר בנייה', scene: 'construction' },
  ],
  bangkok: [
    { id: 'bangkok-bazaar', name: 'שאל בשוק צ׳אטוצ׳אק', scene: 'bazaar' },
    { id: 'bangkok-dock', name: 'שאל בנמל הנהר', scene: 'dock-worker' },
    { id: 'bangkok-tuk', name: 'דבר עם נהג מונית', scene: 'taxi-driver' },
  ],
  athens: [
    { id: 'athens-tour', name: 'שאל מדריך באקרופוליס', scene: 'tour-guide' },
    { id: 'athens-cafe', name: 'שאל בטברנה', scene: 'cafe-waiter' },
    { id: 'athens-news', name: 'שאל בדוכן העיתונים', scene: 'newsstand' },
  ],
  'mexico-city': [
    { id: 'mexico-vendor', name: 'שאל דוכן רחוב', scene: 'street-vendor' },
    { id: 'mexico-bus', name: 'דבר עם נהג אוטובוס', scene: 'bus-driver' },
    { id: 'mexico-market', name: 'שאל בשוק', scene: 'market' },
  ],
  montreal: [
    { id: 'montreal-train', name: 'דבר עם כרטיסן ברכבת', scene: 'train-conductor' },
    { id: 'montreal-cafe', name: 'שאל בבית קפה', scene: 'cafe-waiter' },
    { id: 'montreal-park', name: 'שאל רץ בפארק', scene: 'park-jogger' },
  ],
  amsterdam: [
    { id: 'amsterdam-bridge', name: 'שאל בגשר', scene: 'bridge-toll' },
    { id: 'amsterdam-market', name: 'שאל בשוק הפרחים', scene: 'market' },
    { id: 'amsterdam-bike', name: 'שאל שליח אופניים', scene: 'delivery-boy' },
  ],
  johannesburg: [
    { id: 'johannesburg-airport', name: 'חקור בשדה התעופה', scene: 'airport' },
    { id: 'johannesburg-taxi', name: 'דבר עם נהג מונית', scene: 'taxi-driver' },
    { id: 'johannesburg-hotel', name: 'שאל בקבלת המלון', scene: 'hotel-clerk' },
  ],
}
