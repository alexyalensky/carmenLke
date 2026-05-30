import type { AlmanacCultureItem } from '../game/types'

export interface CountryCulture {
  foods: AlmanacCultureItem[]
  events: AlmanacCultureItem[]
  famousPeople: AlmanacCultureItem[]
}

const f = (name: string, nameEn: string): AlmanacCultureItem => ({ name, nameEn })

/** Foods, historical events, and notable people — Hebrew display, English for clue TTS */
export const almanacCulture: Record<string, CountryCulture> = {
  israel: {
    foods: [f('פלאפל', 'falafel'), f('חומוס', 'hummus'), f('שקשוקה', 'shakshuka')],
    events: [f('הקמת המדינה', 'Independence Day'), f('חתימת הסכמי אוסלו', 'Oslo Accords')],
    famousPeople: [f('דוד בן-גוריון', 'David Ben-Gurion'), f('גולדה מאיר', 'Golda Meir')],
  },
  france: {
    foods: [f('קרואסון', 'croissant'), f('גבינת ברי', 'Brie cheese'), f('קרפ', 'crepe')],
    events: [f('מהפכת 1789', 'French Revolution'), f('יום ה-14 ליולי', 'Bastille Day')],
    famousPeople: [f('נפוליאון', 'Napoleon'), f('ז\'אן ד\'ארק', 'Joan of Arc')],
  },
  egypt: {
    foods: [f('כושארי', 'koshari'), f('פול', 'ful medames'), f('בסבוסה', 'basbousa')],
    events: [f('תקופת הפירמידות', 'Pyramid building era'), f('מהפכת 2011', 'Arab Spring')],
    famousPeople: [f('קלאופטרה', 'Cleopatra'), f('תותענחעמון', 'Tutankhamun')],
  },
  japan: {
    foods: [f('סושי', 'sushi'), f('ראמן', 'ramen'), f('טמפורה', 'tempura')],
    events: [f('תקופת מייג׳י', 'Meiji Restoration'), f('אולימפיאדה בטוקיו', 'Tokyo Olympics')],
    famousPeople: [f('אקירה קורוסאווה', 'Akira Kurosawa'), f('הקייסר מייג׳י', 'Emperor Meiji')],
  },
  usa: {
    foods: [f('המבורגר', 'hamburger'), f('עוגת תפוחים', 'apple pie'), f('ברבקיו', 'barbecue')],
    events: [f('הכרזת העצמאות', 'Declaration of Independence'), f('הנחיתה על הירח', 'Moon landing'), f('מסיבת התה בבוסטון', 'Boston Tea Party'), f('שיגור אפולו 13', 'Apollo 13 launch')],
    famousPeople: [f('אברהם לינקולן', 'Abraham Lincoln'), f('מרטין לותר קינג', 'Martin Luther King')],
  },
  germany: {
    foods: [f('נקניק', 'bratwurst'), f('בייגל', 'pretzel'), f('כרוב כבוש', 'sauerkraut')],
    events: [f('נפילת חומת ברלין', 'Fall of Berlin Wall'), f('איחוד גרמניה', 'German reunification')],
    famousPeople: [f('אלברט איינשטיין', 'Albert Einstein'), f('יוהן סבסטיאן באך', 'Johann Sebastian Bach')],
  },
  argentina: {
    foods: [f('אסאדו', 'asado'), f('עמפנדה', 'empanada'), f('דולסה דלחה', 'dulce de leche')],
    events: [f('מהפכת מאיו', 'May Revolution'), f('ניצחון במונדיאל', 'World Cup victory')],
    famousPeople: [f('אבה פרון', 'Eva Perón'), f('דיגו מרדונה', 'Diego Maradona')],
  },
  australia: {
    foods: [f('פע של בשר', 'meat pie'), f('למינגטון', 'lamington'), f('וגימייט', 'Vegemite')],
    events: [f('הגעת השיט הראשון', 'First Fleet arrival'), f('הפדרציה', 'Federation')],
    famousPeople: [f('קאתי פרימן', 'Cathy Freeman'), f('סטיו אירוון', 'Steve Irwin')],
  },
  india: {
    foods: [f('קרי', 'curry'), f('ביריאני', 'biryani'), f('סמוסה', 'samosa')],
    events: [f('עצמאות 1947', 'Independence 1947'), f('תנועת גנדי', 'Gandhi movement')],
    famousPeople: [f('מהאתמה גנדי', 'Mahatma Gandhi'), f('רבינדרנאת טגור', 'Rabindranath Tagore')],
  },
  uk: {
    foods: [f('דגים וצ׳יפס', 'fish and chips'), f('ארוחת בוקר אנגלית', 'full English breakfast'), f('סקון', 'scone')],
    events: [f('מגנה כרטה', 'Magna Carta'), f('המהפכה התעשייתית', 'Industrial Revolution')],
    famousPeople: [f('ויליאם שקספייר', 'William Shakespeare'), f('וינסטון צ׳רחיל', 'Winston Churchill')],
  },
  brazil: {
    foods: [f('פיזואדה', 'feijoada'), f('פאו די קיז׳ו', 'pão de queijo'), f('אסאי', 'açaí')],
    events: [f('קרנבל', 'Carnival'), f('עצמאות 1822', 'Independence 1822')],
    famousPeople: [f('פלה', 'Pelé'), f('אוסקר ניימייר', 'Oscar Niemeyer')],
  },
  turkey: {
    foods: [f('קבב', 'kebab'), f('בקלווה', 'baklava'), f('קהוה טורקי', 'Turkish coffee')],
    events: [f('הקמת הרפובליקה', 'Republic founding'), f('תקופה עות\'מאנית', 'Ottoman era')],
    famousPeople: [f('מוסטפה כמל אתאטורך', 'Atatürk'), f('רומי', 'Rumi')],
  },
  italy: {
    foods: [f('פיצה', 'pizza'), f('פסטה', 'pasta'), f('ג׳לטו', 'gelato')],
    events: [f('הרנסנס', 'Renaissance'), f('איחוד איטליה', 'Italian unification')],
    famousPeople: [f('לאונרדו דה ווינצי', 'Leonardo da Vinci'), f('יוליוס קייזר', 'Julius Caesar')],
  },
  spain: {
    foods: [f('פאיה', 'paella'), f('טאפאס', 'tapas'), f('צ׳ורוס', 'churros')],
    events: [f('מלחמת האזרח', 'Spanish Civil War'), f('עידן הגילויים', 'Age of Discovery')],
    famousPeople: [f('מיגל דשאון סרוונטה', 'Miguel de Cervantes'), f('פבלו פיקאסו', 'Pablo Picasso')],
  },
  russia: {
    foods: [f('בורשט', 'borscht'), f('פעלמני', 'pelmeni'), f('בליני', 'blini')],
    events: [f('מהפכת 1917', 'Russian Revolution'), f('השקת ספוטניק', 'Sputnik launch')],
    famousPeople: [f('ליו טולסטוי', 'Leo Tolstoy'), f('יורי גגרין', 'Yuri Gagarin')],
  },
  china: {
    foods: [f('כרוביות', 'dumplings'), f('ברווז פקיני', 'Peking duck'), f('אורז מטוגן', 'fried rice')],
    events: [f('הקמת הרפובליקה העממית', 'People\'s Republic founding'), f('תקופת חומת סין', 'Great Wall era')],
    famousPeople: [f('קונפוציוס', 'Confucius'), f('מאו צדונג', 'Mao Zedong')],
  },
  thailand: {
    foods: [f('פד תאי', 'pad thai'), f('טום יאם', 'tom yum'), f('אורז מאנגו דבש', 'mango sticky rice')],
    events: [f('פסטיואל סונגקרן', 'Songkran festival'), f('ממלכת סוכותאי', 'Sukhothai kingdom')],
    famousPeople: [f('המלך בומיבול', 'King Bhumibol'), f('טוני ג׳א', 'Tony Jaa')],
  },
  greece: {
    foods: [f('מוסאקה', 'moussaka'), f('סובלאקי', 'souvlaki'), f('גבינת פרה', 'feta cheese')],
    events: [f('אולימפיאדה העתיקה', 'Ancient Olympics'), f('מלחמת העצמאות', 'War of Independence')],
    famousPeople: [f('אלכסנדר מאקדון', 'Alexander the Great'), f('סוקרטס', 'Socrates')],
  },
  mexico: {
    foods: [f('טאקוס', 'tacos'), f('גואקמולה', 'guacamole'), f('שוקולד מקסיקאי', 'Mexican chocolate')],
    events: [f('יום המתים', 'Day of the Dead'), f('מהפכת 1910', 'Mexican Revolution')],
    famousPeople: [f('פרידה קאולו', 'Frida Kahlo'), f('אמיליאנו צאפאטה', 'Emiliano Zapata')],
  },
  canada: {
    foods: [f('פוטין', 'poutine'), f('סירופ מיפל', 'maple syrup'), f('פאייז חמאה', 'butter tarts')],
    events: [f('הקונפדרציה 1867', 'Confederation'), f('אמנת זכויות', 'Charter of Rights')],
    famousPeople: [f('טרי פוקס', 'Terry Fox'), f('וויין גרצקי', 'Wayne Gretzky')],
  },
  netherlands: {
    foods: [f('סטרוופוופל', 'stroopwafel'), f('דג מלוח', 'herring'), f('גבינת גאודה', 'Gouda cheese')],
    events: [f('העידן הזהב ההולנדי', 'Dutch Golden Age'), f('יום המלך', 'King\'s Day')],
    famousPeople: [f('ונסנט ון גוג', 'Vincent van Gogh'), f('אנה פרנק', 'Anne Frank')],
  },
  'south-africa': {
    foods: [f('בובוטי', 'bobotie'), f('בילטונג', 'biltong'), f('בוארוורס', 'boerewors')],
    events: [f('סיום האפרטייד', 'End of apartheid'), f('בחירות 1994', '1994 elections')],
    famousPeople: [f('נלסון מנדלה', 'Nelson Mandela'), f('דסמונד טוטו', 'Desmond Tutu')],
  },
  poland: {
    foods: [f('פיאורוגי', 'pierogi'), f('ביגוס', 'bigos'), f('קיילבסה', 'kielbasa')],
    events: [f('תנועת סולידריות', 'Solidarity movement'), f('חוקה מ-3 במאי', 'May 3 Constitution')],
    famousPeople: [f('מרי קורי', 'Marie Curie'), f('פרדריק שופן', 'Frédéric Chopin')],
  },
  portugal: {
    foods: [f('פסטל די נטה', 'pastel de nata'), f('באגלהו', 'bacalhau'), f('קאלדו ורדה', 'caldo verde')],
    events: [f('מהפכת 1910', 'Republic revolution'), f('עידן הגילויים', 'Age of Discovery')],
    famousPeople: [f('ואסו דה גאמה', 'Vasco da Gama'), f('פרנאנדו פסואה', 'Fernando Pessoa')],
  },
  sweden: {
    foods: [f('כדורי בשר שוודיים', 'Swedish meatballs'), f('גראבלאקס', 'gravlax'), f('לחמן קינאמון', 'cinnamon bun')],
    events: [f('פרס נובל', 'Nobel Prize'), f('איחוד עם נורווגיה', 'Union with Norway era')],
    famousPeople: [f('אלפרד נובל', 'Alfred Nobel'), f('אבבא', 'ABBA')],
  },
  vietnam: {
    foods: [f('פו', 'pho'), f('באן מי', 'banh mi'), f('גליליות אביב', 'spring rolls')],
    events: [f('עצמאות 1945', 'Independence 1945'), f('מלחמת ויאטנאם', 'Vietnam War')],
    famousPeople: [f('הו צ׳י מין', 'Ho Chi Minh'), f('האחיות טרונג', 'Trung Sisters')],
  },
  kenya: {
    foods: [f('אוגאלי', 'ugali'), f('ניאמה צ׳ומה', 'nyama choma'), f('סוקומה ויקי', 'sukuma wiki')],
    events: [f('עצמאות 1963', 'Independence 1963'), f('מאבק העצמאות', 'Independence struggle')],
    famousPeople: [f('ואנגרי מאתאי', 'Wangari Maathai'), f('ג׳ומו קניאטה', 'Jomo Kenyatta')],
  },
  'south-korea': {
    foods: [f('קימצ׳י', 'kimchi'), f('ביבימבאפ', 'bibimbap'), f('ברבקיו קוראי', 'Korean barbecue')],
    events: [f('אולימפיאדה בסאול', 'Seoul Olympics'), f('גל הק׳י', 'Korean Wave')],
    famousPeople: [f('המלך סגונג', 'King Sejong'), f('בן קי מון', 'Ban Ki-moon')],
  },
}
