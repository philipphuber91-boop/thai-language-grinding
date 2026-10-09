#!/usr/bin/env node
'use strict';
/**
 * Inject 100 new Beginner (Level 1-2) questions into data/thailand-quiz.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUIZ_FILE = path.join(ROOT, 'data/thailand-quiz.js');

const rawQuestions = [
    // === BLOCK 1: Essen & Trinken (101-110) ===
    {
        id: "thq-beg-101",
        category: "food",
        difficulty: 1,
        questionTh: "เราสั่งไข่ดาวกับผัดกะเพราอย่างไร?",
        questionDe: "Wie bestellt man ein Spiegelei zum Pad Kra Pao?",
        questionTr: "Rao sang khai dao kap phat kaphrao yangrai?",
        options: [
            ["a", "ไข่ดาว", "Spiegelei", "Khai dao"],
            ["b", "ไข่กลม", "Rundes Ei", "Khai klom"],
            ["c", "ไข่ไฟ", "Feuer-Ei", "Khai fai"],
            ["d", "ไข่บิน", "Fliegendes Ei", "Khai bin"]
        ],
        explanationTh: "ไข่ดาว (Khai Dao) หมายถึงไข่ทอดแบบดาว กรอบนอกไข่แดงเยิ้ม",
        explanationDe: "Spiegeleier heißen auf Thai wörtlich 'Stern-Ei' (Khai Dao) und werden knusprig frittiert.",
        source: { title: "Tourism Authority of Thailand – Street Food", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-102",
        category: "food",
        difficulty: 1,
        questionTh: "คำว่า 'ไม่เผ็ด' ในร้านอาหารหมายถึงอะไร?",
        questionDe: "Was bedeutet der Ausdruck 'Mai Phet' am Essensstand?",
        questionTr: "Kham wa 'mai phet' nai ran ahan maithueng arai?",
        options: [
            ["a", "ไม่เผ็ด", "Nicht scharf", "Mai phet"],
            ["b", "เผ็ดมาก", "Sehr scharf", "Phet mak"],
            ["c", "ไม่มีเนื้อ", "Ohne Fleisch", "Mai mi nuea"],
            ["d", "ใส่พริกเยอะ", "Viel Chili", "Sai phrik yoet"]
        ],
        explanationTh: "ไม่เผ็ด (Mai Phet) ใช้บอกแม่ค้าไม่ให้ใส่พริกหรือไม่ให้เผ็ด",
        explanationDe: "'Mai Phet' bedeutet 'nicht scharf' und bittet um eine milde Zubereitung.",
        source: { title: "Tourism Authority of Thailand – Thai Food Guide", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-103",
        category: "food",
        difficulty: 1,
        questionTh: "ชาเย็นของไทยมักมีสีอะไร?",
        questionDe: "Welche auffällige Farbe hat traditioneller thailändischer Eistee (Cha Yen)?",
        questionTr: "Cha yen khong Thai mak mi si arai?",
        options: [
            ["a", "สีส้ม", "Orange", "Si som"],
            ["b", "สีเขียว", "Grün", "Si khiao"],
            ["c", "สีฟ้า", "Hellblau", "Si fa"],
            ["d", "สีม่วง", "Lila", "Si muang"]
        ],
        explanationTh: "ชาเย็นไทยมีสีส้มสดใส ผสมนมข้นหวานและน้ำแข็ง",
        explanationDe: "Thailändischer Eistee (Cha Yen) hat eine markante orange Farbe und wird süß mit Kondensmilch serviert.",
        source: { title: "Tourism Authority of Thailand – Thai Drinks", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-104",
        category: "food",
        difficulty: 1,
        questionTh: "ข้าวเหนียวมะม่วงเป็นขนมหวานที่ทำจากอะไร?",
        questionDe: "Woraus besteht das beliebte Dessert 'Khao Niao Mamuang'?",
        questionTr: "Khao niao mamuang pen khanom wan thi tham chak arai?",
        options: [
            ["a", "ข้าวเหนียวและมะม่วงสุก", "Klebreis und reife Mango", "Khao niao lae mamuang suk"],
            ["b", "ข้าวผัดและเนื้อวัว", "Gebratener Reis und Rind", "Khao phat lae nuea wua"],
            ["c", "ก๋วยเตี๋ยวและมะนาว", "Nudelsuppe und Limette", "Kuaitiao lae manao"],
            ["d", "กล้วยทอดและน้ำผึ้ง", "Frittierte Banane und Honig", "Kluai thot lae nam phueng"]
        ],
        explanationTh: "ข้าวเหนียวมะม่วงเป็นของหวานชื่อดังที่ทำจากข้าวเหนียวมูน มะม่วงสุก และกะทิ",
        explanationDe: "Mango Sticky Rice ist das berühmteste Dessert Thailands aus süßem Kokos-Klebreis und reifer Mango.",
        source: { title: "Tourism Authority of Thailand – Thai Desserts", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-105",
        category: "food",
        difficulty: 2,
        questionTh: "ทำไมโรงแรมและรถไฟฟ้าหลายแห่งถึงห้ามนำทุเรียนเข้ามา?",
        questionDe: "Warum ist die Durian-Frucht in vielen Hotels und Zügen verboten?",
        questionTr: "Thammai rongraem lae rotfaifa lai haeng thueng ham nam thurian khao ma?",
        options: [
            ["a", "เพราะมีกลิ่นแรงมาก", "Wegen ihres extrem starken Geruchs", "Phro mi klin raeng mak"],
            ["b", "เพราะเปลือกระเบิดได้", "Weil ihre Schale explodiert", "Phro plueak raboet dai"],
            ["c", "เพราะมีก๊าซพิษ", "Weil sie giftige Gase ausstößt", "Phro mi kat phit"],
            ["d", "เพราะผิดกฎหมาย", "Weil sie gesetzlich verboten ist", "Phro phit kotmai"]
        ],
        explanationTh: "ทุเรียนมีกลิ่นหอมเฉพาะตัวที่แรงมาก ทำให้หลายสถานที่มีป้ายห้ามนำทุเรียนเข้า",
        explanationDe: "Die 'Königin der Früchte' schmeckt cremig süß, riecht aber so intensiv, dass sie oft verboten ist.",
        source: { title: "Encyclopaedia Britannica – Durian", url: "https://www.britannica.com/plant/durian" }
    },
    {
        id: "thq-beg-106",
        category: "food",
        difficulty: 1,
        questionTh: "คนไทยมักใช้อะไรรับประทานข้าวผัด?",
        questionDe: "Womit isst man in Thailand typischerweise Reisgerichte wie gebratenen Reis?",
        questionTr: "Khon Thai mak chai arai rapprathan khao phat?",
        options: [
            ["a", "ช้อนและส้อม", "Löffel und Gabel", "Chon lae som"],
            ["b", "ตะเกียบเท่านั้น", "Nur Stäbchen", "Takiap thaonan"],
            ["c", "มีดและส้อม", "Messer und Gabel", "Mit lae som"],
            ["d", "มือเปล่า", "Mit bloßen Händen", "Mue plao"]
        ],
        explanationTh: "คนไทยใช้ช้อนเป็นหลักและใช้ส้อมช่วยดันข้าวใส่ช้อน",
        explanationDe: "Der Löffel führt die Speise zum Mund, die Gabel schiebt den Reis auf den Löffel.",
        source: { title: "Tourism Authority of Thailand – Dining Etiquette", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-107",
        category: "food",
        difficulty: 1,
        questionTh: "สิ่งใดที่ร้านอาหารไทยมักใส่ในแก้วเบียร์หรือเครื่องดื่มในวันอากาศร้อน?",
        questionDe: "Was servieren thailändische Restaurants an heißen Tagen fast immer im Bierglas?",
        questionTr: "Sing dai thi ran ahan Thai mak sai nai kaeo bia nai wan akat ron?",
        options: [
            ["a", "น้ำแข็ง", "Eiswürfel", "Nam khaeng"],
            ["b", "พริกสด", "Frische Chilis", "Phrik sot"],
            ["c", "ไอศกรีม", "Vanilleeis", "Ai-sakhlim"],
            ["d", "เกลือ", "Salz", "Kluea"]
        ],
        explanationTh: "คนไทยนิยมใส่น้ำแข็งในแก้วเบียร์เพื่อให้เย็นสดชื่นท่ามกลางอากาศร้อน",
        explanationDe: "'Bia sai nam khaeng' (Bier mit Eiswürfeln) ist in Thailand ein beliebter Durstlöscher bei Hitze.",
        source: { title: "Tourism Authority of Thailand – Thai Culture", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-108",
        category: "food",
        difficulty: 1,
        questionTh: "ต้มยำกุ้งเป็นอาหารประเภทใด?",
        questionDe: "Was für ein Gericht ist 'Tom Yum Kung'?",
        questionTr: "Tom yam kung pen ahan praphet dai?",
        options: [
            ["a", "ต้มยำรสเปรี้ยวเผ็ดใส่กุ้ง", "Scharf-saure Garnelensuppe", "Tom yam rot priao phet sai kung"],
            ["b", "ขนมหวานกะทิ", "Süßer Kokospudding", "Khanom wan kathi"],
            ["c", "สลัดผลไม้", "Fruchtsalat", "Salat phonlamai"],
            ["d", "ข้าวต้มปลา", "Milder Fischbrei", "Khao tom pla"]
        ],
        explanationTh: "ต้มยำกุ้งเป็นซุปสมุนไพรที่มีรสชาติเปรี้ยว เผ็ด และเค็มกลมกล่อม",
        explanationDe: "Tom Yum Kung ist die weltberühmte Nationalsuppe Thailands mit Limette, Zitronengras und Garnelen.",
        source: { title: "Tourism Authority of Thailand – Tom Yum Kung", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-109",
        category: "food",
        difficulty: 1,
        questionTh: "ส้มตำไทยทำจากผลไม้อะไรเป็นหลัก?",
        questionDe: "Aus welcher Frucht wird thailändischer Papayasalat (Som Tam) zubereitet?",
        questionTr: "Som tam Thai tham chak phonlamai arai pen lak?",
        options: [
            ["a", "มะละกอดิบ", "Grüne, unreife Papaya", "Malako dip"],
            ["b", "กล้วยสุก", "Reife Banane", "Kluai suk"],
            ["c", "แตงโม", "Wassermelone", "Taengmo"],
            ["d", "ส้มโอ", "Grapefruit", "Som-o"]
        ],
        explanationTh: "ส้มตำใช้เส้นมะละกอดิบตำในครกกับพริก กระเทียม ถั่วลิสง และน้ำปลา",
        explanationDe: "Som Tam wird im Mörser aus frischen Streifen unreifer grüner Papaya gestampft.",
        source: { title: "Tourism Authority of Thailand – Som Tam", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-110",
        category: "food",
        difficulty: 2,
        questionTh: "พวงเครื่องปรุงบนโต๊ะอาหารไทยมักมีอะไรบ้าง?",
        questionDe: "Welche 4 Gewürze findet man auf fast jedem thailändischen Streetfood-Tisch?",
        questionTr: "Phuang khrueang prung bon to ahan Thai mak mi arai bang?",
        options: [
            ["a", "น้ำตาล น้ำปลา พริกป่น น้ำส้มสายชู", "Zucker, Fischsauce, Chilipulver, Essig", "Namtan nampla phrikpon namsomsaichu"],
            ["b", "ซอสมะเขือเทศ มายองเนส มัสตาร์ด เกลือ", "Ketchup, Mayonnaise, Senf, Salz", "Sos makhoeathet mayongnet matsataet kluea"],
            ["c", "เนย แยม น้ำผึ้ง ช็อกโกแลต", "Butter, Marmelade, Honig, Schokolade", "Noei yaem namphueng chokkolet"],
            ["d", "วาซาบิ ขิงดอง ซีอิ๊วญี่ปุ่น น้ำมันงา", "Wasabi, Ingwer, Sojasauce, Sesamöl", "Wasabi khingdong si-io nammannga"]
        ],
        explanationTh: "พวงพริกมีรสหวาน เค็ม เผ็ด และเปรี้ยว เพื่อให้ผู้กินปรุงรสตามใจชอบ",
        explanationDe: "Der Gewürzständer erlaubt es jedem Gast, die Nudelsuppe nach Geschmack abzurunden.",
        source: { title: "Tourism Authority of Thailand – Dining Guide", url: "https://www.tourismthailand.org/" }
    },

    // === BLOCK 2: Höflichkeit, Sitten & Kultur-Knigge (111-120) ===
    {
        id: "thq-beg-111",
        category: "culture",
        difficulty: 1,
        questionTh: "การทักทายแบบไทยด้วยการพนมมือเรียกว่าอะไร?",
        questionDe: "Wie nennt man die traditionelle thailändische Begrüßungsgeste mit gefalteten Händen?",
        questionTr: "Kan thakthai baep Thai duai kan phanom mue riak wa arai?",
        options: [
            ["a", "ไหว้", "Wai", "Wai"],
            ["b", "กอด", "Umarmung", "Kot"],
            ["c", "จับมือ", "Händeschütteln", "Chap mue"],
            ["d", "โค้ง", "Verbeugung", "Khong"]
        ],
        explanationTh: "การไหว้เป็นการแสดงความเคารพ ทักทาย และขอบคุณตามวัฒนธรรมไทย",
        explanationDe: "Der Wai ist das Herzstück der thailändischen Höflichkeit bei Begrüßung und Dank.",
        source: { title: "UNESCO Intangible Cultural Heritage", url: "https://ich.unesco.org/" }
    },
    {
        id: "thq-beg-112",
        category: "culture",
        difficulty: 1,
        questionTh: "ส่วนใดของร่างกายที่ถือว่าอยู่สูงและไม่ควรจับศีรษะของผู้อื่น?",
        questionDe: "Welcher Körperteil gilt als heilig und sollte bei anderen nicht berührt werden?",
        questionTr: "Suan dai khong rangkai thi thue wa yu sung lae mai khuan chap?",
        options: [
            ["a", "ศีรษะหรือหัว", "Der Kopf", "Sisa rue hua"],
            ["b", "แขน", "Der Arm", "Khaen"],
            ["c", "มือ", "Die Hand", "Mue"],
            ["d", "หัวเข่า", "Das Knie", "Hua khao"]
        ],
        explanationTh: "คนไทยถือว่าศีรษะเป็นของสูง จึงไม่ควรแตะต้องศีรษะของผู้อื่นโดยไม่ได้รับอนุญาต",
        explanationDe: "Der Kopf ist der spirituell höchste Teil des Körpers und darf nicht achtlos berührt werden.",
        source: { title: "Tourism Authority of Thailand – Dos and Don'ts", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-113",
        category: "culture",
        difficulty: 1,
        questionTh: "สิ่งใดไม่ควรชี้ไปยังพระพุทธรูปหรือผู้อื่นด้วยความเคารพ?",
        questionDe: "Welcher Körperteil sollte aus Respekt niemals auf Menschen oder Buddha-Statuen zeigen?",
        questionTr: "Sing dai mai khuan chi pai yang phraphuttharup rue phu uen?",
        options: [
            ["a", "เท้า", "Die Füße / Fußsohlen", "Thao"],
            ["b", "จมูก", "Die Nase", "Chamuk"],
            ["c", "ตา", "Die Augen", "Ta"],
            ["d", "หู", "Die Ohren", "Hu"]
        ],
        explanationTh: "เท้าถือเป็นของต่ำ จึงไม่ควรใช้เท้าชี้สิ่งของ คน หรือพระพุทธรูป",
        explanationDe: "Die Fußsohlen gelten als unreinster Teil und sollten nie auf Personen oder Altäre gerichtet werden.",
        source: { title: "Tourism Authority of Thailand – Dos and Don'ts", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-114",
        category: "culture",
        difficulty: 1,
        questionTh: "สิ่งที่เราควรทำก่อนเข้าบ้านหรือพระอุโบสถคืออะไร?",
        questionDe: "Was tut man in Thailand fast immer, bevor man ein Wohnhaus oder einen Tempel betritt?",
        questionTr: "Sing thi rao khuan tham kon khao ban rue phra ubosot khue arai?",
        options: [
            ["a", "ถอดรองเท้า", "Schuhe ausziehen", "Thot rongthao"],
            ["b", "ล้างหน้า", "Gesicht waschen", "Lang na"],
            ["c", "ร้องเพลง", "Ein Lied singen", "Rong phleng"],
            ["d", "เคาะประตูสามครั้ง", "Dreimal klopfen", "Kho pratu sam khrang"]
        ],
        explanationTh: "การถอดรองเท้าก่อนเข้าบ้านหรือวัดเป็นธรรมเนียมรักษาความสะอาดและความเคารพ",
        explanationDe: "Schuhe bleiben draußen, um Schmutz fernzuhalten und dem Raum Respekt zu zollen.",
        source: { title: "Tourism Authority of Thailand – Cultural Etiquette", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-115",
        category: "culture",
        difficulty: 1,
        questionTh: "ผู้หญิงไทยใช้คำสุภาพลงท้ายประโยคว่าอะไร?",
        questionDe: "Welches Höflichkeitswort hängen Frauen auf Thai an das Satzende?",
        questionTr: "Phuying Thai chai kham suphap longthai prayok wa arai?",
        options: [
            ["a", "ค่ะ / คะ", "Kha (ค่ะ / คะ)", "Kha"],
            ["b", "ครับ", "Khrap", "Khrap"],
            ["c", "ฮะ", "Ha", "Ha"],
            ["d", "จ้ะ", "Cha", "Cha"]
        ],
        explanationTh: "ผู้หญิงใช้คำว่า 'ค่ะ' ในประโยคบอกเล่า และ 'คะ' ในคำถาม",
        explanationDe: "Frauen beenden Aussagen höflich mit 'Kha' (ค่ะ) und Fragen mit 'Kha' (คะ).",
        source: { title: "Royal Society of Thailand – Grammar", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-116",
        category: "culture",
        difficulty: 1,
        questionTh: "ผู้ชายไทยใช้คำสุภาพลงท้ายประโยคว่าอะไร?",
        questionDe: "Welches Höflichkeitswort hängen Männer auf Thai an das Satzende?",
        questionTr: "Phuchai Thai chai kham suphap longthai prayok wa arai?",
        options: [
            ["a", "ครับ", "Khrap (ครับ)", "Khrap"],
            ["b", "ค่ะ", "Kha", "Kha"],
            ["c", "คะ", "Kha", "Kha"],
            ["d", "นะ", "Na", "Na"]
        ],
        explanationTh: "ผู้ชายใช้คำว่า 'ครับ' เพื่อแสดงความสุภาพและเคารพผู้ฟัง",
        explanationDe: "Männer nutzen universell 'Khrap' (ครับ) am Satzende für einen höflichen Umgangston.",
        source: { title: "Royal Society of Thailand – Grammar", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-117",
        category: "culture",
        difficulty: 2,
        questionTh: "ทำไมคนดูในโรงภาพยนตร์ไทยจึงยืนขึ้นก่อนภาพยนตร์เริ่มฉาย?",
        questionDe: "Warum stehen Kinobesucher in Thailand vor Beginn des Films auf?",
        questionTr: "Thammai khon du nai rong phapphayon Thai chueng yuen khuen kon phapphayon roem chai?",
        options: [
            ["a", "เพื่อเคารพเพลงสรรเสริญพระบารมี", "Aus Respekt vor der Königshymne", "Phuea khaorop phleng sansoen phra barami"],
            ["b", "เพื่อออกกำลังกาย", "Um sich kurz zu dehnen", "Phuea ok kamlangkai"],
            ["c", "เพื่อซื้อขนมเพิ่ม", "Um Snacks nachzukaufen", "Phuea sue khanom phoem"],
            ["d", "เพื่อเช็คเก้าอี้", "Um die Sitze zu prüfen", "Phuea chek kao-i"]
        ],
        explanationTh: "ในโรงภาพยนตร์จะมีการเปิดเพลงสรรเสริญพระบารมีก่อนหนังเริ่มฉาย",
        explanationDe: "Vor jeder Filmvorführung ertönt die königliche Hymne, zu der traditionell aufgestanden wird.",
        source: { title: "Encyclopaedia Britannica – Thailand", url: "https://www.britannica.com/place/Thailand" }
    },
    {
        id: "thq-beg-118",
        category: "culture",
        difficulty: 1,
        questionTh: "คนไทยมักมีสิ่งใดที่ใช้เรียกกันในชีวิตประจำวันแทนชื่อจริง?",
        questionDe: "Was benutzen Thailänder im Alltag meist anstelle ihrer langen offiziellen Namen?",
        questionTr: "Khon Thai mak mi sing dai thi chai riak kan nai chiwit prachamwan?",
        options: [
            ["a", "ชื่อเล่น", "Spitzname (Chue Len)", "Chue len"],
            ["b", "หมายเลขประจำตัว", "Ausweisnummer", "Mailek prachamtua"],
            ["c", "ชื่อโรงเรียน", "Schulname", "Chue rongrian"],
            ["d", "ชื่อจังหวัด", "Provinzname", "Chue changwat"]
        ],
        explanationTh: "ชื่อเล่นมักมีพยางค์เดียว เช่น นก แบงค์ มุก หรือส้ม เพื่อให้เรียกง่าย",
        explanationDe: "Kurze Spitznamen wie Nok, Benz, Bank oder Som sind im thailändischen Alltag üblich.",
        source: { title: "Royal Society of Thailand – Thai Naming Culture", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-119",
        category: "culture",
        difficulty: 1,
        questionTh: "คำว่า 'สบายๆ' สื่อถึงความรู้สึกอย่างไร?",
        questionDe: "Welches Lebensgefühl drückt der bekannte thailändische Ausdruck 'Sabai Sabai' aus?",
        questionTr: "Kham wa 'sabai sabai' sue thueng khwam rusuek yangrai?",
        options: [
            ["a", "ผ่อนคลายและสบายใจ", "Entspannt, gemütlich, unbeschwert", "Phonkhlai lae sabai chai"],
            ["b", "เครียดและเร่งรีบ", "Gestresst und in Eile", "Khriat lae rengrip"],
            ["c", "โกรธเคือง", "Wütend und verärgert", "Krot khueang"],
            ["d", "กลัวและตกใจ", "Ängstlich und schockiert", "Klua lae tokchai"]
        ],
        explanationTh: "สบายๆ แสดงถึงวิถีชีวิตที่เรียบง่าย ผ่อนคลาย และไม่เร่งร้อน",
        explanationDe: "'Sabai Sabai' ist die thailändische Formel für Gelassenheit und inneren Frieden.",
        source: { title: "Tourism Authority of Thailand – Thai Lifestyle", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-120",
        category: "culture",
        difficulty: 2,
        questionTh: "สีประจำวันจันทร์ในวัฒนธรรมไทยคือสีอะไร?",
        questionDe: "Welche Farbe wird in Thailand traditionell dem Montag zugeordnet?",
        questionTr: "Si pracham wan chan nai watthanatham Thai khue si arai?",
        options: [
            ["a", "สีเหลือง", "Gelb", "Si lueang"],
            ["b", "สีชมพู", "Rosa", "Si chomphu"],
            ["c", "สีเขียว", "Grün", "Si khiao"],
            ["d", "สีส้ม", "Orange", "Si som"]
        ],
        explanationTh: "วันจันทร์มีสีประจำวันคือสีเหลือง ซึ่งเป็นสีวันพระบรมราชสมภพของในหลวงรัชกาลที่ 9 และ 10",
        explanationDe: "Jedem Wochentag entspricht eine Farbe; Gelb steht für Montag und die königliche Flagge.",
        source: { title: "Royal Society of Thailand – Colors of the Week", url: "https://dictionary.orst.go.th/" }
    },

    // === BLOCK 3: Geisterhäuschen, Glaube & Traditionen (121-130) ===
    {
        id: "thq-beg-121",
        category: "culture",
        difficulty: 1,
        questionTh: "ศาลพระภูมิที่ตั้งอยู่หน้าบ้านมีไว้เพื่ออะไร?",
        questionDe: "Wozu dient das 'San Phra Phum' (Geisterhäuschen) vor vielen Häusern?",
        questionTr: "San phra phum thi tang yu na ban mi wai phuea arai?",
        options: [
            ["a", "เป็นที่สถิตของพระภูมิเจ้าที่เพื่อคุ้มครองบ้าน", "Als Wohnort der Schutzgeister des Grundstücks", "Pen thi sathit khong phra phum"],
            ["b", "เป็นตู้จดหมาย", "Als Briefkasten", "Pen tu chotmai"],
            ["c", "เป็นบ้านของนกพิราบ", "Als Taubenhaus", "Pen ban khong nok phirap"],
            ["d", "เป็นที่เก็บของเล่น", "Als Spielzeugschrank", "Pen thi kep khonglen"]
        ],
        explanationTh: "คนไทยตั้งศาลพระภูมิเพื่อให้เจ้าที่ปกปักรักษาและให้ผู้อยู่อาศัยร่มเย็นเป็นสุข",
        explanationDe: "Geisterhäuschen bieten den Erdgeistern ein Heim und bringen dem Haus Segen und Schutz.",
        source: { title: "Tourism Authority of Thailand – Spirit Houses", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-122",
        category: "culture",
        difficulty: 1,
        questionTh: "เครื่องดื่มยอดนิยมที่มีสีแดงที่มักนำมาถวายศาลพระภูมิคือน้ำอะไร?",
        questionDe: "Welches rote Getränk wird an Geisterhäuschen besonders häufig als Opfergabe hingestellt?",
        questionTr: "Khrueang duem yotniyom thi mi si daeng thi mak nam ma thawai san khue nam arai?",
        options: [
            ["a", "น้ำแดง (แฟนต้าสีแดง)", "Rote Limonade (Rote Fanta)", "Nam daeng"],
            ["b", "น้ำสลัด", "Salatdressing", "Nam salat"],
            ["c", "กาแฟดำร้อน", "Heißer schwarzer Kaffee", "Ka-fae dam ron"],
            ["d", "น้ำซุปกระดูกหมู", "Schweineknochenbrühe", "Nam sup kraduk mu"]
        ],
        explanationTh: "น้ำแดงเป็นสัญลักษณ์แทนของไหว้สีแดงแบบดั้งเดิม สะดวกและมีรสหวาน",
        explanationDe: "Die rote Fanta mit Strohhalm symbolisiert traditionelle rote Opfergaben und erfreut die Geister.",
        source: { title: "Tourism Authority of Thailand – Thai Beliefs", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-123",
        category: "culture",
        difficulty: 2,
        questionTh: "ตัวเลขใดที่คนไทยถือว่าเป็นเลขมงคลเพราะพ้องเสียงกับคำว่า 'ก้าวหน้า'?",
        questionDe: "Welche Zahl gilt in Thailand als Glückszahl, weil sie wie 'Fortschritt' klingt?",
        questionTr: "Tualek dai thi khon Thai thue wa pen lek mongkhon?",
        options: [
            ["a", "เลข 9 (เก้า)", "Zahl 9 (Kao)", "Lek kao"],
            ["b", "เลข 4 (สี่)", "Zahl 4 (Si)", "Lek si"],
            ["c", "เลข 0 (ศูนย์)", "Zahl 0 (Sun)", "Lek sun"],
            ["d", "เลข 13 (สิบสาม)", "Zahl 13 (Sip Sam)", "Lek sip sam"]
        ],
        explanationTh: "เลข 9 พ้องกับคำว่า 'ก้าวหน้า' หมายถึงความเจริญรุ่งเรืองในชีวิต",
        explanationDe: "Neun (๙ / Kao) klingt wie 'Kao Na' (voranschreiten) und ist als Glückszahl heiß begehrt.",
        source: { title: "Royal Society of Thailand – Thai Numerology", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-124",
        category: "culture",
        difficulty: 2,
        questionTh: "ทำไมบางคนจึงทาแป้งบนต้นไม้แปลกๆ ในชนบท?",
        questionDe: "Warum reiben manche Menschen in Thailand Baumrinde mit weißem Puder ein?",
        questionTr: "Thammai bang khon chueng tha phaeng bon tonmai plaek nai chonnabot?",
        options: [
            ["a", "เพื่อส่องหาตัวเลขเสี่ยงโชคสลากกินแบ่ง", "Um nach Glückszahlen für die Lotterie zu suchen", "Phuea song ha tualek lotto"],
            ["b", "เพื่อไล่มดและปลวก", "Um Ameisen abzuwehren", "Phuea lai mot"],
            ["c", "เพื่อให้ต้นไม้เติบโตเร็วขึ้น", "Damit der Baum schneller wächst", "Phuea hai tonmai toepto"],
            ["d", "เพื่อให้ต้นไม้มีกลิ่นหอม", "Damit der Baum duftet", "Phuea hai tonmai mi klin hom"]
        ],
        explanationTh: "ผู้คนหวังเห็นตัวเลขจากลายเปลือกไม้เพื่อนำไปซื้อสลากกินแบ่งรัฐบาล",
        explanationDe: "Vor den zweiwöchentlichen Lotterieziehungen werden Rindenmuster nach Glückszahlen abgesucht.",
        source: { title: "Tourism Authority of Thailand – Folk Beliefs", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-125",
        category: "culture",
        difficulty: 1,
        questionTh: "จิ้งจกร้องทักตามความเชื่อโบราณสื่อถึงอะไร?",
        questionDe: "Was bedeutet das Rufen eines Hausgeckos (Jing-Jok) im thailändischen Volksglauben?",
        questionTr: "Chingchok rong thak tam khwamchue boran sue thueng arai?",
        options: [
            ["a", "เตือนให้ระวังหรือหยุดคิดก่อนออกจากบ้าน", "Eine Warnung, innezuhalten", "Tuean hai rawang kon ok chak ban"],
            ["b", "หิมะกำลังจะตก", "Es wird bald schneien", "Hima kamlang cha tok"],
            ["c", "ฝนจะไม่ตกอีกเลย", "Es wird nie wieder regnen", "Fon cha mai tok ik loei"],
            ["d", "มีพายุหิมะ", "Ein Schneesturm naht", "Mi phayu hima"]
        ],
        explanationTh: "โบราณเชื่อว่าหากจิ้งจกร้องทักตอนจะออกจากบ้าน ควรหยุดรอและระมัดระวังการเดินทาง",
        explanationDe: "Ruft ein Gecko beim Hinaustreten, galt das früher als Omen, vorsichtig zu sein.",
        source: { title: "Royal Society of Thailand – Thai Proverbs and Beliefs", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-126",
        category: "culture",
        difficulty: 1,
        questionTh: "ด้ายสีขาวที่พระสงฆ์หรือผู้ใหญ่นำมาผูกข้อมือเพื่อความเป็นสิริมงคลเรียกว่าอะไร?",
        questionDe: "Wie heißt der weiße Segensfaden, den Mönche Besuchern um das Handgelenk binden?",
        questionTr: "Dai si khao thi phra phuk khomue riak wa arai?",
        options: [
            ["a", "สายสิญจน์", "Sai Sin (สายสิญจน์)", "Sai sin"],
            ["b", "เชือกรองเท้า", "Schnürsenkel", "Chueak rongthao"],
            ["c", "สายกีตาร์", "Gitarrensaite", "Sai kita"],
            ["d", "เข็มขัด", "Gürtel", "Khemkhat"]
        ],
        explanationTh: "สายสิญจน์เป็นด้ายมงคลที่ผ่านการสวดพระพุทธมนต์เพื่อคุ้มครองและให้พร",
        explanationDe: "Der geweihte weiße Baumwollfaden 'Sai Sin' spendet Schutz und spirituellen Segen.",
        source: { title: "Royal Society of Thailand – Buddhist Customs", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-127",
        category: "culture",
        difficulty: 2,
        questionTh: "วันใดในสัปดาห์ที่ร้านตัดผมในไทยมักปิดตามความเชื่อโบราณ?",
        questionDe: "An welchem Wochentag haben traditionelle Barbiere in Thailand oft geschlossen?",
        questionTr: "Wan dai nai sapda thi ran tat phom mak pit tam khwamchue?",
        options: [
            ["a", "วันพุธ", "Mittwoch (Wan Phut)", "Wan phut"],
            ["b", "วันอาทิตย์", "Sonntag", "Wan athit"],
            ["c", "วันศุกร์", "Freitag", "Wan suk"],
            ["d", "วันเสาร์", "Samstag", "Wan sao"]
        ],
        explanationTh: "คนโบราณถือคติว่า 'วันพุธห้ามตัดผม วันพฤหัสบดีห้ามถอนฟัน'",
        explanationDe: "Mittwochs ließen sich früher Könige die Haare schneiden; fürs Volk galt es als Ruhetag ('Wan Phut ham tat phom').",
        source: { title: "Royal Society of Thailand – Traditional Customs", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-128",
        category: "culture",
        difficulty: 2,
        questionTh: "พระเครื่องที่คนไทยนิยมคล้องคอมีวัตถุประสงค์เพื่ออะไรเป็นหลัก?",
        questionDe: "Wozu tragen viele Thailänder ein Amulett (Phra Khrueang) an einer Halskette?",
        questionTr: "Phrakhrueang thi khon Thai niyom khlong kho mi watthuprasong phuea arai?",
        options: [
            ["a", "เพื่อเตือนใจถึงพระธรรมและคุ้มครองความปลอดภัย", "Als Schutzsymbol und Mahnung zur Achtsamkeit", "Phuea khumkhrong lae tuean chai"],
            ["b", "เพื่อฟังเพลง", "Um Musik zu hören", "Phuea fang phleng"],
            ["c", "เพื่อบอกเวลา", "Um die Uhrzeit abzulesen", "Phuea bok wela"],
            ["d", "เพื่อวัดอุณหภูมิ", "Als Fieberthermometer", "Phuea wat unnahaphum"]
        ],
        explanationTh: "พระเครื่องช่วยเสริมสิริมงคล เป็นเครื่องยึดเหนี่ยวจิตใจและเตือนให้ทำความดี",
        explanationDe: "Amulette mit Buddha-Bildnissen dienen als persönlicher Schutz und mahnen zu tugendhaftem Verhalten.",
        source: { title: "Department of Cultural Promotion Thailand", url: "http://www.culture.go.th/" }
    },
    {
        id: "thq-beg-129",
        category: "culture",
        difficulty: 1,
        questionTh: "ผ้าสามสีที่นำไปผูกรอบต้นไม้ใหญ่มีไว้เพื่ออะไร?",
        questionDe: "Warum werden alte Bäume in Thailand oft mit bunten Seidentüchern geschmückt?",
        questionTr: "Pha sam si thi phuk rop tonmai yai mi wai phuea arai?",
        options: [
            ["a", "เพื่อแสดงความเคารพต่อรุกขเทวดาหรือเจ้าที่", "Um den Baumgeist (Nang Mai) zu ehren", "Phuea sadaeng khwam khaorop thewada"],
            ["b", "เพื่อป้องกันไม่ให้ใบไม้ร่วง", "Damit keine Blätter abfallen", "Phuea pongkan bai mai ruang"],
            ["c", "เพื่อทาสีต้นไม้", "Um den Stamm anzumalen", "Phuea tha si tonmai"],
            ["d", "เพื่อตากผ้าให้แห้ง", "Als Wäscheleine", "Phuea tak pha"]
        ],
        explanationTh: "ผ้าสามสีแสดงถึงการคารวะสิ่งศักดิ์สิทธิ์หรือวิญญาณธรรมชาติที่สถิตในต้นไม้ใหญ่",
        explanationDe: "Alte Bäume gelten als beseelt von Schutzgeistern und werden mit bunten Bändern geehrt.",
        source: { title: "Tourism Authority of Thailand – Sacred Trees", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-130",
        category: "culture",
        difficulty: 1,
        questionTh: "การสักยันต์แบบไทยมีความหมายหลักในด้านใด?",
        questionDe: "Welche Bedeutung haben traditionelle 'Sak Yant'-Tattoos in Thailand?",
        questionTr: "Kan sak yant baep Thai mi khwammai lak nai dan dai?",
        options: [
            ["a", "เป็นความเชื่อเรื่องเมตตามหานิยมและแคล้วคลาด", "Magischer Schutz, Mut und Segen", "Khwamchue rueang metta lae klaeokhlat"],
            ["b", "เพื่อใช้แทนตั๋วรถไฟ", "Als Fahrkarte für den Zug", "Chai thaen tua rotfai"],
            ["c", "เพื่อระบุเบอร์โทรศัพท์", "Als Telefonnummern-Ersatz", "Rabu bo tho"],
            ["d", "เป็นสติกเกอร์กันแดด", "Als Sonnenschutz", "Stikkoe kan daet"]
        ],
        explanationTh: "การสักยันต์เป็นศิลปะความเชื่อโบราณที่ให้พรด้านความปลอดภัยและเมตตา",
        explanationDe: "Sak Yant wird mit Segenssprüchen gestochen und soll den Träger vor Schaden bewahren.",
        source: { title: "Department of Cultural Promotion Thailand", url: "http://www.culture.go.th/" }
    },

    // === BLOCK 4: Tiere & Natur (131-140) ===
    {
        id: "thq-beg-131",
        category: "nature",
        difficulty: 1,
        questionTh: "สัตว์ประจำชาติอย่างเป็นทางการของประเทศไทยคือสัตว์ชนิดใด?",
        questionDe: "Welches Tier ist das offizielle Wappentier und Nationalsymbol Thailands?",
        questionTr: "Sat pracham chat yang pen thangkan khong prathet Thai khue sat chanit dai?",
        options: [
            ["a", "ช้างไทย", "Der Elefant (Chang Thai)", "Chang Thai"],
            ["b", "เสือโคร่ง", "Der Tiger", "Suea khrong"],
            ["c", "ลิงลม", "Der Plumplori", "Ling lom"],
            ["d", "นกยูง", "Der Pfau", "Nok yung"]
        ],
        explanationTh: "ช้างไทยมีความผูกพันกับประวัติศาสตร์และวิถีชีวิตคนไทยมาอย่างยาวนาน",
        explanationDe: "Der Asiatische Elefant ist das traditionsreiche Nationalsymbol Thailands.",
        source: { title: "Department of National Parks Thailand", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-132",
        category: "nature",
        difficulty: 1,
        questionTh: "สัตว์เลื้อยคลานขนาดใหญ่ที่พบเห็นได้ทั่วไปในสวนลุมพินีคือสัตว์ชนิดใด?",
        questionDe: "Welches große Reptil kann man im Bangkoker Lumphini-Park frei herumlaufen sehen?",
        questionTr: "Sat lueakhlan khanat yai thi phop hen dai nai Suan Lumphini khue sat dai?",
        options: [
            ["a", "ตัวเงินตัวทอง (เหี้ย)", "Bindenwaran / Wasserwaran", "Tua ngoen tua thong"],
            ["b", "จระเข้น้ำเค็ม", "Salzwasserkrokodil", "Chorakhe nam khem"],
            ["c", "เต่ายักษ์กาลาปากอส", "Galapagos-Riesenschildkröte", "Tao yak Kalapakot"],
            ["d", "มังกรโคโมโด", "Komodowaran", "Mangkon Khomodo"]
        ],
        explanationTh: "ตัวเงินตัวทองชอบอาศัยอยู่ริมสระน้ำในสวนสาธารณะและกินปลาหรือซากสัตว์",
        explanationDe: "Bindenwarane sonnen sich friedlich an den Ufern der Teiche im Lumphini-Park.",
        source: { title: "Department of National Parks Thailand – Wildlife", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-133",
        category: "nature",
        difficulty: 1,
        questionTh: "สุนัขจรจัดที่อาศัยอยู่ตามตรอกซอกซอยในไทยมักเรียกกันว่าอะไร?",
        questionDe: "Wie nennt man die Straßenhunde in thailändischen Wohnvierteln umgangssprachlich?",
        questionTr: "Sunak chonchat thi asai yu tam trok soi nai Thai mak riak wa arai?",
        options: [
            ["a", "หมาซอย", "Soi-Hunde (Hma Soi)", "Hma soi"],
            ["b", "หมาป่าภูเขา", "Bergwölfe", "Hma pa phukhao"],
            ["c", "สิงโตเมือง", "Stadtlöwen", "Singto mueang"],
            ["d", "สุนัขหิมะ", "Schneehunde", "Sunak hima"]
        ],
        explanationTh: "คำว่า 'ซอย' หมายถึงถนนย่อย หมาซอยจึงเป็นสุนัขชุมชนที่ชาวบ้านช่วยกันให้อาหาร",
        explanationDe: "'Soi Dogs' gehören zu den Gassen Thailands und werden oft von Anwohnern versorgt.",
        source: { title: "Tourism Authority of Thailand – Life in Sois", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-134",
        category: "nature",
        difficulty: 1,
        questionTh: "สัตว์เลื้อยคลานชนิดใดที่ส่งเสียงร้อง 'ตุ๊ก-แก' ชัดเจนในเวลากลางคืน?",
        questionDe: "Welcher Gecko ruft nachts laut und deutlich seinen eigenen Namen?",
        questionTr: "Sat lueakhlan chanit dai thi song siang rong 'tuk-kae' nai wela klangkhuen?",
        options: [
            ["a", "ตุ๊กแก", "Tokay-Gecko (Tuk-kae)", "Tuk-kae"],
            ["b", "กิ้งก่าคาเมเลียน", "Chamäleon", "Kingka khamelian"],
            ["c", "อีกัวน่า", "Leguan", "Ikuana"],
            ["d", "กบภูเขา", "Bergfrosch", "Kop phukhao"]
        ],
        explanationTh: "ตุ๊กแกตัวใหญ่กว่าจิ้งจก มีลวดลายจุดสีส้มฟ้า และร้องเสียงดังกังวาน",
        explanationDe: "Der Tokay-Gecko ruft laut 'To-kay! To-kay!' und gilt beim Zählen als Glücksbote.",
        source: { title: "Department of National Parks Thailand", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-135",
        category: "nature",
        difficulty: 2,
        questionTh: "เมืองใดในภาคกลางที่มีชื่อเสียงเรื่องฝูงลิงอาศัยอยู่ร่วมกับชาวเมืองและศาลพระกาฬ?",
        questionDe: "In welcher Stadt leben hunderte Affen mitten zwischen den Einwohnern und Ruinen?",
        questionTr: "Mueang dai thi mi chuesiang rueang fung ling asai yu kap chao mueang?",
        options: [
            ["a", "ลพบุรี", "Lopburi", "Lop Buri"],
            ["b", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
            ["c", "ภูเก็ต", "Phuket", "Phuket"],
            ["d", "พัทยา", "Pattaya", "Phatthaya"]
        ],
        explanationTh: "ลพบุรีมีฝูงลิงแสมอาศัยอยู่ที่พระปรางค์สามยอด และมีงานเลี้ยงโต๊ะจีนลิงทุกปี",
        explanationDe: "In Lopburi teilen sich freche Makaken die Straßen mit den Menschen und bekommen alljährlich ein Riesenbankett.",
        source: { title: "Tourism Authority of Thailand – Lopburi Monkeys", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-136",
        category: "nature",
        difficulty: 1,
        questionTh: "อาหารโปรดสองอย่างที่ช้างในศูนย์อนุรักษ์ชอบกินเป็นของว่างคืออะไร?",
        questionDe: "Welche zwei Snacks fressen Elefanten in Schutzstationen besonders gerne?",
        questionTr: "Ahan prot song yang thi chang nai sun anurak chop kin khue arai?",
        options: [
            ["a", "กล้วยและอ้อย", "Bananen und Zuckerrohr", "Kluai lae oi"],
            ["b", "พิซซ่าและไก่ทอด", "Pizza und Hähnchen", "Phitsa lae kai thot"],
            ["c", "พริกและกระเทียม", "Chili und Knoblauch", "Phrik lae krathiam"],
            ["d", "ปลาทอดกรอบ", "Knuspriger Fisch", "Pla thot krop"]
        ],
        explanationTh: "ช้างกินพืชเป็นหลัก กล้วยและอ้อยมีรสหวานและให้พลังงานสูง",
        explanationDe: "Bananen und Zuckerrohrstangen sind die Lieblings-Leckerlis sanfter Dickhäuter.",
        source: { title: "Department of National Parks Thailand – Elephant Care", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-137",
        category: "nature",
        difficulty: 2,
        questionTh: "โลมาสีชมพูที่พบในทะเลอำเภอขนอม จังหวัดนครศรีธรรมราช คือสัตว์ชนิดใด?",
        questionDe: "Welche seltenen Meeressäuger mit rosa Färbung kann man in Khanom beobachten?",
        questionTr: "Loma si chomphu thi phop nai thale Khanom khue sat chanit dai?",
        options: [
            ["a", "โลมาขาวเทาอินโดแปซิฟิก", "Indopazifische Weiße Delfine (Rosa Delfine)", "Loma khao thao Indo-Paesifik"],
            ["b", "วาฬสีน้ำเงิน", "Blauwale", "Wan si namngoen"],
            ["c", "ฉลามขาว", "Weiße Haie", "Chalam khao"],
            ["d", "สิงโตทะเล", "Seelöwen", "Singto thale"]
        ],
        explanationTh: "เมื่อโลมาชนิดนี้โตเต็มวัย เส้นเลือดใต้ผิวหนังจะทำให้ตัวเปลี่ยนเป็นสีชมพู",
        explanationDe: "Die Delfine vor Khanom verfärben sich mit dem Alter rosa und sind eine Attraktion.",
        source: { title: "Department of Marine and Coastal Resources Thailand", url: "https://dmcr.go.th/" }
    },
    {
        id: "thq-beg-138",
        category: "nature",
        difficulty: 1,
        questionTh: "สิ่งมีชีวิตในทะเลที่มีพิษและต้องระวังป้ายเตือนริมหาดคืออะไร?",
        questionDe: "Vor welchem giftigen Meerestier warnen Schilder an thailändischen Stränden zur Monsunzeit?",
        questionTr: "Sing mi chiwit nai thale thi mi phit lae tong rawang khue arai?",
        options: [
            ["a", "แมงกะพรุนกล่อง", "Würfelquallen / giftige Quallen", "Maengkraphrun klong"],
            ["b", "ปลาโลมา", "Delfine", "Pla loma"],
            ["c", "นกนางนวล", "Möwen", "Nok nang nuan"],
            ["d", "ปลาดาว", "Seesterne", "Pla dao"]
        ],
        explanationTh: "แมงกะพรุนกล่องมีพิษรุนแรง ชายหาดจึงมีน้ำส้มสายชูไว้ปฐมพยาบาลเบื้องต้น",
        explanationDe: "An manchen Stränden schützen Netze und Essigstationen vor giftigen Quallen.",
        source: { title: "Department of Disease Control Thailand – Jellyfish Safety", url: "https://ddc.moph.go.th/" }
    },
    {
        id: "thq-beg-139",
        category: "nature",
        difficulty: 1,
        questionTh: "ดอกไม้ประจำชาติไทยที่บานสะพรั่งเป็นช่อสีเหลืองอร่ามคือดอกอะไร?",
        questionDe: "Welche gelbe Blüte ist die offizielle Nationalblume Thailands?",
        questionTr: "Dokmai pracham chat Thai thi ban pen cho si lueang khue dok arai?",
        options: [
            ["a", "ดอกราชพฤกษ์ (คูน)", "Ratchaphruek (Goldregen)", "Dok ratchaphruek"],
            ["b", "ดอกกุหลาบ", "Rose", "Dok kulap"],
            ["c", "ดอกทิวลิป", "Tulpe", "Dok thiulip"],
            ["d", "ดอกทานตะวัน", "Sonnenblume", "Dok thantawan"]
        ],
        explanationTh: "ดอกราชพฤกษ์มีสีเหลืองอร่าม บานในช่วงฤดูร้อนและเป็นสัญลักษณ์มงคลของไทย",
        explanationDe: "Der Ratchaphruek blüht im März/April in goldgelben Kaskaden im ganzen Land.",
        source: { title: "Royal Society of Thailand – National Symbols", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-140",
        category: "nature",
        difficulty: 2,
        questionTh: "อุทยานแห่งชาติใดในสุราษฎร์ธานีที่มีป่าดงดิบดึกดำบรรพ์และเขื่อนเชี่ยวหลาน?",
        questionDe: "In welchem bekannten Nationalpark in Surat Thani liegt der Cheow-Lan-See mit Kalksteinfelsen?",
        questionTr: "Utthayan haeng chat dai thi mi pa dong dip lae khuean Chiao Lan?",
        options: [
            ["a", "อุทยานแห่งชาติเขาสก", "Khao-Sok-Nationalpark", "Utthayan haeng chat Khao Sok"],
            ["b", "สวนจตุจักร", "Chatuchak-Park", "Suan Chatuchak"],
            ["c", "เขาใหญ่", "Khao Yai", "Khao Yai"],
            ["d", "ดอยสุเทพ", "Doi Suthep", "Doi Suthep"]
        ],
        explanationTh: "เขาสกเป็นแหล่งท่องเที่ยวธรรมชาติที่มีภูเขาหินปูนสูงตระหง่านและป่าฝนที่อุดมสมบูรณ์",
        explanationDe: "Khao Sok begeistert mit schwimmenden Hütten auf dem Stausee und uraltem Regenwald.",
        source: { title: "Department of National Parks Thailand – Khao Sok", url: "https://www.dnp.go.th/" }
    },

    // === BLOCK 5: Verkehr & Transport (141-150) ===
    {
        id: "thq-beg-141",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "ยานพาหนะสามล้อเครื่องที่เป็นเอกลักษณ์โด่งดังของไทยคืออะไร?",
        questionDe: "Welches dreirädrige Motorfahrzeug ist weltberühmt für Thailand?",
        questionTr: "Yanphahana sam lo khrueang thi pen ekkalak khong Thai khue arai?",
        options: [
            ["a", "รถตุ๊กตุ๊ก", "Tuk-Tuk", "Rot tuk tuk"],
            ["b", "เกวียนวัว", "Ochsenkarren", "Kwian wua"],
            ["c", "รถไฟเหาะ", "Achterbahn", "Rotfai ho"],
            ["d", "เรือดำน้ำ", "U-Boot", "Ruea dam nam"]
        ],
        explanationTh: "รถตุ๊กตุ๊กเป็นรถสามล้อเครื่องที่ส่งเสียงดังเอกลักษณ์และเป็นสัญลักษณ์การท่องเที่ยวไทย",
        explanationDe: "Das motorisierte Dreirad verdankt seinen Namen dem knatternden Zweitakt-Sound.",
        source: { title: "Tourism Authority of Thailand – Getting Around", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-142",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "ประเทศไทยขับขี่ยานพาหนะทางเลนฝั่งใด?",
        questionDe: "Auf welcher Straßenseite fahren Autos und Motorräder in Thailand?",
        questionTr: "Prathet Thai khapkhi yanphahana thang len fang dai?",
        options: [
            ["a", "ด้านซ้าย", "Linksverkehr", "Dan sai"],
            ["b", "ด้านขวา", "Rechtsverkehr", "Dan khwa"],
            ["c", "ตรงกลางทาง", "Auf dem Mittelstreifen", "Trong klang thang"],
            ["d", "บนทางเท้า", "Auf dem Gehweg", "Bon thangthao"]
        ],
        explanationTh: "ประเทศไทยใช้ระบบการจราจรพวงมาลัยขวาและขับชิดซ้ายของถนน",
        explanationDe: "In Thailand herrscht Linksverkehr; das Lenkrad befindet sich auf der rechten Seite.",
        source: { title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }
    },
    {
        id: "thq-beg-143",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "รถกระบะดัดแปลงที่มีที่นั่งสองแถวด้านหลังเรียกว่าอะไร?",
        questionDe: "Wie heißt das Sammeltaxi aus einem umgebauten Pick-up mit zwei Sitzreihen?",
        questionTr: "Rot kraba datplaeng thi mi thi nang song thaeo riak wa arai?",
        options: [
            ["a", "รถสองแถว", "Songthaew (รถสองแถว)", "Rot songthaeo"],
            ["b", "รถแท็กซี่มิเตอร์", "Metertaxi", "Rot taeksi mitae"],
            ["c", "รถดับเพลิง", "Feuerwehrauto", "Rot dap phloeng"],
            ["d", "รถพยาบาล", "Krankenwagen", "Rot phayaban"]
        ],
        explanationTh: "สองแถวเป็นรถโดยสารประจำทางยอดนิยมในต่างจังหวัดและตามเกาะต่างๆ",
        explanationDe: "'Songthaew' bedeutet wörtlich 'zwei Reihen' – benannt nach den beiden Sitzbänken.",
        source: { title: "Tourism Authority of Thailand – Transport Guide", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-144",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "ระบบรถไฟฟ้าลอยฟ้าที่แล่นเหนือท้องถนนในกรุงเทพฯ เรียกว่าอะไร?",
        questionDe: "Wie heißt das Hochbahn-System in Bangkok?",
        questionTr: "Rabbot rotfaifa loi fa thi laen nuea thong thanon nai Krung Thep riak wa arai?",
        options: [
            ["a", "รถไฟฟ้าบีทีเอส (BTS Skytrain)", "BTS Skytrain", "Rotfaifa BTS"],
            ["b", "เคเบิลคาร์", "Seilbahn", "Kheboen kha"],
            ["c", "รถไฟรางเบาหิมะ", "Schlittenbahn", "Rotfai hima"],
            ["d", "เรือด่วนคลอง", "Kanalboot", "Ruea duan khlong"]
        ],
        explanationTh: "รถไฟฟ้า BTS ช่วยให้การเดินทางใจกลางกรุงเทพฯ สะดวก รวดเร็ว และหนีปัญหารถติด",
        explanationDe: "Der klimatisierte BTS Skytrain gleitet staufrei auf Stelzen über Bangkoks Boulevards.",
        source: { title: "Bangkok Mass Transit System", url: "https://www.bts.co.th/" }
    },
    {
        id: "thq-beg-145",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "ระบบรถไฟฟ้าใต้ดินในกรุงเทพมหานครมีชื่อย่อว่าอะไร?",
        questionDe: "Welche Abkürzung trägt die unterirdische U-Bahn in Bangkok?",
        questionTr: "Rabbot rotfaifa taidin nai Krung Thep mi chue yo wa arai?",
        options: [
            ["a", "MRT (รถไฟฟ้ามหานคร)", "MRT", "Em-ar-thi"],
            ["b", "ICE", "ICE", "Ai-si-i"],
            ["c", "TGV", "TGV", "Thi-chi-wi"],
            ["d", "U-Bahn Berlin", "U-Bahn Berlin", "U-ban Boelin"]
        ],
        explanationTh: "MRT ให้บริการรถไฟฟ้าใต้ดินเชื่อมโยงสถานีสำคัญทั่วกรุงเทพฯ",
        explanationDe: "Die MRT (Mass Rapid Transit) verbindet Bangkoks Stadtteile im Untergrund.",
        source: { title: "Mass Rapid Transit Authority of Thailand", url: "https://www.mrta.co.th/" }
    },
    {
        id: "thq-beg-146",
        category: "beginner_transport",
        difficulty: 2,
        questionTh: "ตลาดร่มหุบ (ตลาดแม่กลอง) มีความน่าตื่นตาตื่นใจเรื่องใด?",
        questionDe: "Was passiert mehrmals täglich auf dem berühmten 'Mae Klong Railway Market'?",
        questionTr: "Talat Rom Hup mi khwam na tuentatenchai rueang dai?",
        options: [
            ["a", "รถไฟวิ่งผ่ากลางตลาดและพ่อค้าแม่ค้าต้องหุบร่มหลบ", "Ein Zug fährt mitten durch, Händler klappen Schirme ein", "Rotfai wing pha klang talat"],
            ["b", "ตลาดลอยอยู่กลางอากาศ", "Der Markt schwebt in der Luft", "Talat loi klang akat"],
            ["c", "ขายแต่ร่มกันฝนเท่านั้น", "Es werden nur Regenschirme verkauft", "Khai tae rom kanfon"],
            ["d", "เปิดขายเฉพาะตอนตีสาม", "Er öffnet nur um drei Uhr morgens", "Poet khai chapho ti sam"]
        ],
        explanationTh: "เมื่อรถไฟแล่นผ่าน พ่อค้าแม่ค้าจะหุบร่มและเก็บของอย่างรวดเร็วเป็นเอกลักษณ์",
        explanationDe: "Zentimeter am Zug vorbei klappen die Händler blitzschnell ihre Markisen ein und aus.",
        source: { title: "Tourism Authority of Thailand – Maeklong Railway Market", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-147",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "เรือไม้แบบดั้งเดิมที่มีเพลาใบพัดยาวเรียกว่าเรืออะไร?",
        questionDe: "Wie heißen die thailändischen Holzboote mit dem langen Propellerarm?",
        questionTr: "Ruea mai baep dangdoem thi mi phlao baiphat yao riak wa ruea arai?",
        options: [
            ["a", "เรือหางยาว", "Longtail-Boot (Ruea Hang Yao)", "Ruea hang yao"],
            ["b", "เรือสำราญยักษ์", "Kreuzfahrtschiff", "Ruea samran yak"],
            ["c", "เรือใบแข่ง", "Rennsegler", "Ruea bai khaeng"],
            ["d", "เรือพายยาง", "Schlauchboot", "Ruea phai yang"]
        ],
        explanationTh: "เรือหางยาวใช้เครื่องยนต์รถยนต์ต่อกับก้านใบพัดยาวเพื่อขับเคลื่อนในน้ำตื้น",
        explanationDe: "Longtail-Boote nutzen Auto-Motoren an langen Achsen und brausen flink über Flüsse und Meere.",
        source: { title: "Tourism Authority of Thailand – Boat Travel", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-148",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "ใครที่สวมเสื้อกั๊กสีส้มและพาผู้โดยสารซอกแซกฝ่ารถติดในกรุงเทพฯ ได้เร็วที่สุด?",
        questionDe: "Wer trägt eine orangefarbene Weste und bringt Passagiere am schnellsten durch den Bangkok-Stau?",
        questionTr: "Khai thi suam suea kak si som lae pha phudoisan fa rot tit?",
        options: [
            ["a", "มอเตอร์ไซค์รับจ้าง (วินมอเตอร์ไซค์)", "Motorrad-Taxi (Win Mo-tœ-sai)", "Mo-toe-sai rap chang"],
            ["b", "คนขับรถบรรทุก", "Lkw-Fahrer", "Khon khap rot banthuk"],
            ["c", "กัปตันเรือบิน", "Flugzeugpilot", "Kap-tan ruea bin"],
            ["d", "คนปั่นจักรยานสามล้อโบราณ", "Traditionelle Fahrrad-Rikscha", "Khon pan sam lo"]
        ],
        explanationTh: "วินมอเตอร์ไซค์รับจ้างช่วยให้ผู้คนเดินทางในซอยและฝ่ารถติดได้อย่างรวดเร็ว",
        explanationDe: "Motorrad-Taxis mit Kennwesten navigieren gewandt durch jede Lücke des Großstadtverkehrs.",
        source: { title: "Tourism Authority of Thailand – Getting Around Bangkok", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-149",
        category: "beginner_transport",
        difficulty: 1,
        questionTh: "แม่น้ำสายหลักในกรุงเทพฯ ที่มีเรือด่วนบริการทุกวันคือแม่น้ำสายใด?",
        questionDe: "Auf welchem Hauptfluss in Bangkok verkehren täglich günstige Expressboote?",
        questionTr: "Maenam sai lak nai Krung Thep thi mi ruea duan borikan khue maenam sai dai?",
        options: [
            ["a", "แม่น้ำเจ้าพระยา", "Chao Phraya", "Maenam Chao Phraya"],
            ["b", "แม่น้ำอเมซอน", "Amazonas", "Maenam Ame-son"],
            ["c", "แม่น้ำดานูบ", "Donau", "Maenam Danup"],
            ["d", "แม่น้ำไรน์", "Rhein", "Maenam Rain"]
        ],
        explanationTh: "เรือด่วนเจ้าพระยาเป็นเส้นทางสัญจรทางน้ำยอดนิยมที่เลี่ยงปัญหารถติดบนถนน",
        explanationDe: "Die Chao-Phraya-Expressboote verbinden Sehenswürdigkeiten und Viertel ohne jeden Stau.",
        source: { title: "Chao Phraya Express Boat", url: "https://www.chaophrayaexpressboat.com/" }
    },
    {
        id: "thq-beg-150",
        category: "beginner_transport",
        difficulty: 2,
        questionTh: "คำว่า 'รถติด' ในภาษาไทยหมายถึงสภาพการจราจรแบบใด?",
        questionDe: "Was bedeutet das häufig zu hörende thailändische Wort 'Rot Tit' (รถติด)?",
        questionTr: "Kham wa 'rot tit' nai phasa Thai maithueng saphap kan charachon baep dai?",
        options: [
            ["a", "การจราจรติดขัด / รถติด", "Stau / dichter Verkehr", "Kan charachon titkhat"],
            ["b", "ถนนโล่งไม่มีรถ", "Völlig leere Straße", "Thanon long mai mi rot"],
            ["c", "รถล้างสะอาด", "Frisch gewaschenes Auto", "Rot lang saat"],
            ["d", "รถไฟเหาะ", "Achterbahn", "Rotfai ho"]
        ],
        explanationTh: "กรุงเทพฯ ขึ้นชื่อเรื่องการจราจรติดขัด คำว่า 'รถติด' จึงได้ยินบ่อยมาก",
        explanationDe: "'Rot Tit' bedeutet Stau – eine der meistbenutzten Redewendungen im Berufsverkehr.",
        source: { title: "Royal Society of Thailand – Traffic Terms", url: "https://dictionary.orst.go.th/" }
    },

    // === BLOCK 6: Alltag & 7-Eleven Kultur (151-160) ===
    {
        id: "thq-beg-151",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "ร้านสะดวกซื้อยอดนิยมที่มีสาขาแทบทุกหัวมุมถนนในไทยคือร้านใด?",
        questionDe: "Welche Supermarktkette hat in Thailand an fast jeder Ecke rund um die Uhr geöffnet?",
        questionTr: "Ran saduak sue yotniyom thi mi sakha thaep thuk hua mum thanon khue ran dai?",
        options: [
            ["a", "เซเว่น อีเลฟเว่น (7-Eleven)", "7-Eleven", "Se-wen I-loe-wen"],
            ["b", "อัลดี้", "Aldi", "Al-di"],
            ["c", "วอลมาร์ท", "Walmart", "Won-mat"],
            ["d", "อิเกีย", "IKEA", "I-khia"]
        ],
        explanationTh: "เซเว่น อีเลฟเว่น มีมากกว่า 14,000 สาขาทั่วประเทศไทยและเปิดตลอด 24 ชั่วโมง",
        explanationDe: "7-Eleven ist die Drehscheibe des thailändischen Alltags mit kühler Luft und Rund-um-die-Uhr-Service.",
        source: { title: "CP ALL – 7-Eleven Thailand", url: "https://www.cpall.co.th/" }
    },
    {
        id: "thq-beg-152",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "เสียงที่เป็นเอกลักษณ์เมื่อเปิดประตูเดินเข้าเซเว่นในไทยคือเสียงอะไร?",
        questionDe: "Welches markante Begrüßungsgeräusch ertönt beim Betreten eines thailändischen 7-Eleven?",
        questionTr: "Siang thi pen ekkalak muea poet pratu khao Se-wen khue siang arai?",
        options: [
            ["a", "เสียงดนตรี 'ติ๊งต่อง' (Ding-Dong)", "Zweitöniges 'Ding-Dong'", "Siang ting tong"],
            ["b", "เสียงไซเรนตำรวจ", "Polizeisirene", "Siang sairen"],
            ["c", "เสียงแตรรถบรรทุก", "Lkw-Hupe", "Siang trae rot"],
            ["d", "เสียงสิงโตร้อง", "Löwengebrüll", "Siang singto"]
        ],
        explanationTh: "เสียงติ๊งต่องคู่กับคำทักทาย 'เซเว่นอีเลฟเว่นยินดีต้อนรับค่ะ/ครับ' เป็นภาพจำของทุกคน",
        explanationDe: "Das heitere 'Ding-Dong' kündigt Besucher an, gefolgt vom herzlichen Willkommensgruß des Personals.",
        source: { title: "Tourism Authority of Thailand – Modern Culture", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-153",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "อาหารอุ่นร้อนยอดนิยมที่พนักงานเซเว่นช่วยปิ้งให้คืออะไร?",
        questionDe: "Welcher Kult-Snack wird an der 7-Eleven-Kasse frisch im Sandwich-Maker getoastet?",
        questionTr: "Ahan un ron yotniyom thi phanakngan Se-wen ping hai khue arai?",
        options: [
            ["a", "แซนด์วิชแฮมชีส (โทสต์)", "Schinken-Käse-Toastie", "Saenwit haem chit"],
            ["b", "เป็ดย่างทั้งตัว", "Eine ganze gebratene Ente", "Pet yang thang tua"],
            ["c", "ขนมปังเพรทเซลเยอรมัน", "Brezel mit Salz", "Khanom pang phret-sen"],
            ["d", "ซุปกะหล่ำปลีดอง", "Sauerkrautsuppe", "Sup kalam pli dong"]
        ],
        explanationTh: "แซนด์วิชอบร้อนแฮมชีสเป็นของว่างยอดนิยมที่อร่อย สะดวก และรวดเร็ว",
        explanationDe: "Das warme 'Ham-Cheese-Toastie' ist der legendäre Lieblingssnack für zwischendurch.",
        source: { title: "CP ALL – Food Menu", url: "https://www.cpall.co.th/" }
    },
    {
        id: "thq-beg-154",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "ทำไมสุนัขจรจัดมักชอบนอนหน้าร้านเซเว่น อีเลฟเว่น ในช่วงบ่าย?",
        questionDe: "Warum dösen Straßenhunde nachmittags oft direkt vor der automatischen Schiebetür von 7-Eleven?",
        questionTr: "Thammai sunak mak chop non na ran Se-wen nai chuang bai?",
        options: [
            ["a", "เพราะมีลมแอร์เย็นพัดออกมาทุกครั้งที่ประตูเปิด", "Wegen der kühlen Klimaanlagen-Luft beim Türöffnen", "Phro mi lom ae yen phat ok ma"],
            ["b", "เพราะชอบดูโทรทัศน์ในร้าน", "Weil sie den Fernseher im Laden sehen wollen", "Phro chop du thorathat"],
            ["c", "เพราะต้องการช่วยเก็บเงิน", "Um beim Kassieren zu helfen", "Phro tongkan chuai kep ngoen"],
            ["d", "เพราะกลัวต้นไม้", "Aus Angst vor Bäumen", "Phro klua tonmai"]
        ],
        explanationTh: "สุนัขจะมานอนรับความเย็นจากเครื่องปรับอากาศที่พัดผ่านประตูอัตโนมัติเพื่อคลายร้อน",
        explanationDe: "Hunde schätzen den kühlen Luftzug der Klimaanlage, wenn Kunden ein- und ausgehen.",
        source: { title: "Tourism Authority of Thailand – Daily Life", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-155",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "เครื่องดื่มเย็นตามร้านรถเข็นข้างทางมักใส่ภาชนะแบบใดเพื่อความสะดวกในการถือ?",
        questionDe: "Wie werden Eiskaffee und Eistee an kleinen Straßenständen oft serviert?",
        questionTr: "Khrueang duem yen tam ran rot khen mak sai phachana baep dai?",
        options: [
            ["a", "ถุงพลาสติกมีหูหิ้วพร้อมหลอดดูด", "Im Plastikbeutel mit Strohhalm und Trageschlaufe", "Thung phlasatik mi hu hiu"],
            ["b", "ชามกระเบื้องเคลือบ", "In einer Suppenschüssel", "Cham krabueang"],
            ["c", "กะลามะพร้าวปิดฝา", "In geschlossener Kokosnuss", "Kala maphrao"],
            ["d", "หม้อดินเผา", "Im Tontopf", "Mo din phao"]
        ],
        explanationTh: "โอเลี้ยงหรือชาเย็นใส่ถุงมีหูหิ้วพกพาง่ายและสามารถแขวนไว้กับแฮนด์มอเตอร์ไซค์ได้",
        explanationDe: "Getränke im Beutel ('Sai Thung') halten eiskalt und lassen sich leicht transportieren.",
        source: { title: "Tourism Authority of Thailand – Street Drink Culture", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-156",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "สายชำระที่ติดตั้งอยู่ข้างโถส้วมในห้องน้ำไทยมีไว้เพื่ออะไร?",
        questionDe: "Wozu dient die handliche Sprühbrause ('Bum Gun') in thailändischen Badezimmern?",
        questionTr: "Sai chamra thi tittang yu khang tho suam mi wai phuea arai?",
        options: [
            ["a", "เพื่อทำความสะอาดร่างกายหลังใช้ห้องน้ำ", "Zur hygienischen Reinigung nach dem Toilettengang", "Phuea tham khwam saat rangkai"],
            ["b", "เพื่อรดน้ำต้นไม้ในห้องนอน", "Zum Blumengießen im Schlafzimmer", "Phuea rot nam tonmai"],
            ["c", "เพื่อดับเพลิงฉุกเฉิน", "Zur Brandbekämpfung", "Phuea dap phloeng"],
            ["d", "เพื่อสระผมอย่างเดียว", "Ausschließlich zum Haarewaschen", "Phuea sra phom yang diao"]
        ],
        explanationTh: "สายฉีดชำระเป็นอุปกรณ์สุขอนามัยมาตรฐานในห้องน้ำไทยที่สะดวกและสะอาด",
        explanationDe: "Die Bidet-Brause (Sai Chit Chamra) ist der unverzichtbare Standard in thailändischen Bädern.",
        source: { title: "Department of Health Thailand – Sanitation Guide", url: "https://anamai.moph.go.th/" }
    },
    {
        id: "thq-beg-157",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "คำว่า 'ร้อน' ในภาษาไทยตรงกับภาษาเยอรมันว่าอะไร?",
        questionDe: "Was bedeutet das thailändische Wort 'Ron' (ร้อน) auf Deutsch?",
        questionTr: "Kham wa 'ron' nai phasa Thai trong kap phasa Yoeraman wa arai?",
        options: [
            ["a", "Heiß (warm)", "Heiß / Warm", "Heiß"],
            ["b", "Kalt", "Kalt", "Kalt"],
            ["c", "Nass", "Nass", "Nass"],
            ["d", "Dunkel", "Dunkel", "Dunkel"]
        ],
        explanationTh: "คำว่า ร้อน ใช้บอกอุณหภูมิอากาศหรืออาหาร เช่น 'วันนี้อากาศร้อนมาก'",
        explanationDe: "'Ron' bedeutet heiß; 'Akat ron mak' heißt 'Das Wetter ist sehr heiß'.",
        source: { title: "Royal Society of Thailand – Basic Vocabulary", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-158",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "คำว่า 'เย็น' ในภาษาไทยตรงกับภาษาเยอรมันว่าอะไร?",
        questionDe: "Was bedeutet das thailändische Wort 'Yen' (เย็น) auf Deutsch?",
        questionTr: "Kham wa 'yen' nai phasa Thai trong kap phasa Yoeraman wa arai?",
        options: [
            ["a", "Kühl / Kalt", "Kühl / Kalt", "Kuehl / Kalt"],
            ["b", "Kochend heiß", "Kochend heiß", "Kochend heiss"],
            ["c", "หวาน", "Süß", "Suess"],
            ["d", "เผ็ด", "Scharf", "Scharf"]
        ],
        explanationTh: "คำว่า เย็น หมายถึงอุณหภูมิที่เย็นสบาย หรือเครื่องดื่มเย็น เช่น น้ำเย็น ชาเย็น",
        explanationDe: "'Yen' steht für kühl/kalt; 'Nam Yen' ist erfrischendes kaltes Trinkwasser.",
        source: { title: "Royal Society of Thailand – Basic Vocabulary", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-159",
        category: "beginner_daily_life",
        difficulty: 2,
        questionTh: "ทำไมบ้านคนไทยส่วนใหญ่ในอดีตจึงไม่ค่อยมีเตาอบขนาดใหญ่?",
        questionDe: "Warum findet man in traditionellen thailändischen Küchen selten große Backöfen?",
        questionTr: "Thammai ban khon Thai suan yai mai khoi mi tao op khanat yai?",
        options: [
            ["a", "เพราะการทำอาหารไทยเน้นใช้กระทะ ทอด ต้ม นึ่ง และย่าง", "Weil im Wok gebraten, gekocht, gedämpft und gegrillt wird", "Phro ahan Thai nen chai kratha"],
            ["b", "เพราะมีกฎหมายห้ามใช้เตาอบ", "Weil Backöfen verboten sind", "Phro mi kotmai ham chai"],
            ["c", "เพราะเมืองไทยไม่มีไฟใช้", "Weil es früher keinen Strom gab", "Phro mai mi fai"],
            ["d", "เพราะห้ามทำอาหารร้อน", "Weil warmes Essen verboten war", "Phro ham tham ahan ron"]
        ],
        explanationTh: "ครัวไทยเน้นผัดด้วยกระทะ ต้มแกง หรือปิ้งย่างบนเตาถ่าน จึงไม่จำเป็นต้องมีเตาอบขนมปัง",
        explanationDe: "Thailändische Kochkultur nutzt offene Wokflammen, Dämpfer und Grills statt Backöfen.",
        source: { title: "Tourism Authority of Thailand – Culinary Heritage", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-160",
        category: "beginner_daily_life",
        difficulty: 1,
        questionTh: "เครื่องใช้ไฟฟ้าชิ้นใดที่แทบทุกบ้านในไทยต้องมีติดครัวไว้เสมอ?",
        questionDe: "Welches Elektrogerät steht in absolut jedem thailändischen Haushalt?",
        questionTr: "Khrueang chai faifa chin dai thi thuk ban tong mi tit khrua wai?",
        options: [
            ["a", "หม้อหุงข้าวไฟฟ้า", "Elektrischer Reiskocher", "Mo hung khao faifa"],
            ["b", "เครื่องทำวาฟเฟิล", "Waffeleisen", "Khrueang tham waffen"],
            ["c", "เครื่องทำขนมปังอบ", "Brotbackautomat", "Khrueang op khanompang"],
            ["d", "เครื่องทำฟองดูว์", "Fondueset", "Khrueang fongdu"]
        ],
        explanationTh: "หม้อหุงข้าวไฟฟ้าเป็นหัวใจของครัวไทย เพื่อให้มีข้าวสวยร้อนๆ รับประทานทุกมื้อ",
        explanationDe: "Der elektrische Reiskocher läuft täglich und versorgt die Familie mit duftendem Jasminreis.",
        source: { title: "Department of Cultural Promotion Thailand", url: "http://www.culture.go.th/" }
    },

    // === BLOCK 7: Tempel, Religion & Mönche (161-170) ===
    {
        id: "thq-beg-161",
        category: "religion",
        difficulty: 1,
        questionTh: "คำว่า 'วัด' ในภาษาไทยตรงกับภาษาเยอรมันว่าอะไร?",
        questionDe: "Was bedeutet das thailändische Wort 'Wat' (วัด) auf Deutsch?",
        questionTr: "Kham wa 'wat' nai phasa Thai trong kap phasa Yoeraman wa arai?",
        options: [
            ["a", "Buddhistischer Tempel / Kloster", "Buddhistischer Tempel / Kloster", "Buddhistischer Tempel"],
            ["b", "Flughafen", "Flughafen", "Flughafen"],
            ["c", "โรงพยาบาล", "Krankenhaus", "Krankenhaus"],
            ["d", "ห้างสรรพสินค้า", "Einkaufszentrum", "Einkaufszentrum"]
        ],
        explanationTh: "วัดเป็นศูนย์รวมจิตใจของชาวพุทธและเป็นที่ประกอบพิธีกรรมทางศาสนา",
        explanationDe: "'Wat' bezeichnet eine buddhistische Tempelanlage und das geistliche Zentrum der Gemeinde.",
        source: { title: "National Office of Buddhism Thailand", url: "https://www.onab.go.th/" }
    },
    {
        id: "thq-beg-162",
        category: "religion",
        difficulty: 1,
        questionTh: "การแต่งกายที่เหมาะสมในการเข้าชมวัดไทยคือข้อใด?",
        questionDe: "Welche Kleiderordnung gilt beim Besuch eines thailändischen Tempels?",
        questionTr: "Kan taeng kai thi mo som nai kan khao chom wat khue kho dai?",
        options: [
            ["a", "สวมเสื้อผ้าสุภาพคลุมไหล่และหัวเข่า", "Schultern und Knie müssen bedeckt sein", "Khluam lai lae hua khao"],
            ["b", "สวมชุดว่ายน้ำ", "Badekleidung", "Suam chut wai nam"],
            ["c", "สวมเสื้อกล้ามแขนกุดและกางเกงขาสั้นมาก", "Ärmelloses Top und Minishorts", "Suea klam lae san mak"],
            ["d", "ไม่สวมเสื้อ", "Oberkörperfrei", "Mai suam suea"]
        ],
        explanationTh: "การแต่งกายสุภาพเรียบร้อยเป็นการให้เกียรติสถานที่ศักดิ์สิทธิ์และพระพุทธศาสนา",
        explanationDe: "Respektvolle Kleidung ohne freie Schultern oder kurze Hosen ist in Tempeln vorgeschrieben.",
        source: { title: "Tourism Authority of Thailand – Temple Etiquette", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-163",
        category: "religion",
        difficulty: 1,
        questionTh: "พระสงฆ์ในประเทศไทยมีข้อปฏิบัติอย่างไรเกี่ยวกับสตรี?",
        questionDe: "Dürfen buddhistische Mönche in Thailand Frauen direkt körperlich berühren?",
        questionTr: "Phra song nai prathet Thai mi kho patibat yangrai kieokap satri?",
        options: [
            ["a", "ห้ามแตะต้องหรือสัมผัสร่างกายสตรีโดยตรง", "Nein, Mönchen ist Körperkontakt mit Frauen untersagt", "Ham tae tong rangkai satri"],
            ["b", "สามารถกอดทักทายได้", "Ja, eine Umarmung ist üblich", "Khot thakthai dai"],
            ["c", "จับมือทักทายได้ทุกคน", "Ja, Händeschütteln ist normal", "Chap mue dai"],
            ["d", "เฉพาะวันพระเท่านั้นที่จับได้", "Nur an Feiertagen", "Chapho wan phra"]
        ],
        explanationTh: "พระวินัยกำหนดห้ามพระสงฆ์ถูกเนื้อต้องตัวสตรี หากต้องการถวายของต้องวางบนผ้ารับประเคน",
        explanationDe: "Frauen legen Gaben für Mönche auf ein bereitgelegtes Tuch, um Berührungen zu vermeiden.",
        source: { title: "National Office of Buddhism Thailand – Vinaya Rules", url: "https://www.onab.go.th/" }
    },
    {
        id: "thq-beg-164",
        category: "religion",
        difficulty: 1,
        questionTh: "ดอกไม้ชนิดใดที่นิยมนำมาไหว้พระและเป็นสัญลักษณ์แห่งความบริสุทธิ์ในพุทธศาสนา?",
        questionDe: "Welche Blume wird Buddha-Bildnissen bevorzugt geopfert und symbolisiert Reinheit?",
        questionTr: "Dokmai chanit dai thi niyom nam ma wai phra lae pen sanyalak khwam borisut?",
        options: [
            ["a", "ดอกบัว", "Lotusblüte (Dok Bua)", "Dok bua"],
            ["b", "ดอกกุหลาบหนาม", "Dornenrose", "Dok kulap"],
            ["c", "ดอกแคคตัส", "Kaktusblüte", "Dok khaektat"],
            ["d", "ต้นสน", "Tannenzweig", "Ton son"]
        ],
        explanationTh: "ดอกบัวเปรียบเสมือนจิตใจที่เบ่งบานบริสุทธิ์เหนือผิวน้ำ พ้นจากกิเลสทั้งปวง",
        explanationDe: "Der Lotus wächst aus dem Schlamm zum Licht und steht für die Entfaltung des Geistes.",
        source: { title: "National Office of Buddhism Thailand – Buddhist Symbols", url: "https://www.onab.go.th/" }
    },
    {
        id: "thq-beg-165",
        category: "religion",
        difficulty: 2,
        questionTh: "พระพุทธมหามณีรัตนปฏิมากร (พระแก้วมรกต) แกะสลักขึ้นจากหินชนิดใด?",
        questionDe: "Aus welchem Stein wurde der berühmte 'Smaragd-Buddha' im Wat Phra Kaew gehauen?",
        questionTr: "Phra Kaeo Morakot kaesalak khuen chak hin chanit dai?",
        options: [
            ["a", "หินหยกสีเขียว (ไม่ใช่แก้วหรือมรกตแท้)", "Grüne Jade / Jaspis (kein echter Smaragd)", "Hin yok si khiao"],
            ["b", "เพชรสีฟ้า", "Blauer Diamant", "Phet si fa"],
            ["c", "ทับทิมสีแดง", "Roter Rubin", "Thapthim si daeng"],
            ["d", "อำพันสีเหลือง", "Gelber Bernstein", "Amphan si lueang"]
        ],
        explanationTh: "พระแก้วมรกตแกะสลักจากหยกสีเขียวทั้งก้อน มีความงดงามและเป็นพระคู่บ้านคู่เมือง",
        explanationDe: "Thailands heiligste Statue besteht aus edlem grünem Jaspis/Jade, nicht aus Smaragd.",
        source: { title: "Encyclopaedia Britannica – Emerald Buddha", url: "https://www.britannica.com/topic/Emerald-Buddha" }
    },
    {
        id: "thq-beg-166",
        category: "religion",
        difficulty: 1,
        questionTh: "พิธีที่ชาวพุทธนำอาหารใส่บาตรพระสงฆ์ในยามเช้าเรียกว่าอะไร?",
        questionDe: "Wie heißt das morgendliche Ritual, bei dem Gläubige Mönchen Speisen in die Almosenschale geben?",
        questionTr: "Phithi thi chao phut nam ahan sai bat phra song yam chao riak wa arai?",
        options: [
            ["a", "ตักบาตร", "Tak Bat (Almosenspeisung)", "Tak bat"],
            ["b", "เล่นสงกรานต์", "Wasserschlacht", "Len Songkran"],
            ["c", "ทอดกฐินตอนเที่ยงคืน", "Mitternachtsfest", "Thot kathin"],
            ["d", "เวียนเทียน", "Kerzenlauf", "Wian thian"]
        ],
        explanationTh: "การตักบาตรยามเช้าเป็นการทำบุญสร้างกุศลและค้ำจุนพระพุทธศาสนา",
        explanationDe: "Bei Sonnenaufgang empfangen barfüßige Mönche respektvoll frisches Essen für den Tag.",
        source: { title: "Tourism Authority of Thailand – Morning Alms", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-167",
        category: "religion",
        difficulty: 1,
        questionTh: "ท่านั่งที่สุภาพเมื่อนั่งบนพื้นต่อหน้าพระพุทธรูปหรือพระสงฆ์คือท่าใด?",
        questionDe: "Wie sitzt man respektvoll auf dem Boden vor Mönchen oder einem Altar?",
        questionTr: "Tha nang thi suphap to na phraphuttharup khue tha dai?",
        options: [
            ["a", "นั่งพับเพียบโดยเก็บปลายเท้าไว้ด้านหลัง", "Fersensitz / Seitwärtssitz (Füße nach hinten)", "Nang phapphiap"],
            ["b", "เหยียดเท้าตรงไปข้างหน้า", "Beine nach vorne ausstrecken", "Yiat thao pai khang na"],
            ["c", "นั่งไขว่ห้างบนเก้าอี้สูง", "Beine auf hohem Stuhl überschlagen", "Nang khwai hang"],
            ["d", "นอนหงายราบกับพื้น", "Flach auf den Rücken legen", "Non ngai"]
        ],
        explanationTh: "การนั่งพับเพียบทำให้ปลายเท้าไม่ชี้ไปทางพระสงฆ์หรือสิ่งศักดิ์สิทธิ์ แสดงถึงความนอบน้อม",
        explanationDe: "Die Füße werden nach hinten oder zur Seite geklappt, damit sie nie auf Heiligtümer zeigen.",
        source: { title: "National Office of Buddhism Thailand – Etiquette", url: "https://www.onab.go.th/" }
    },
    {
        id: "thq-beg-168",
        category: "religion",
        difficulty: 1,
        questionTh: "ทำไมพุทธศาสนิกชนจึงนิยมปิดทองคำเปลวบนองค์พระพุทธรูป?",
        questionDe: "Warum kleben Tempelbesucher zarte Blattgold-Blättchen auf Buddha-Statuen?",
        questionTr: "Thammai phutศาสนิกชน chueng pit thongkham plaeo bon ong phra?",
        options: [
            ["a", "เพื่อแสดงความเคารพบูชาและสร้างบุญบารมี", "Aus Verehrung und zum Erwerb von Verdiensten (Tham Bun)", "Phuea sadaeng khwam khaorop"],
            ["b", "เพื่อให้พระพุทธรูปหนักขึ้น", "Damit die Statue schwerer wird", "Phuea hai phra nak khuen"],
            ["c", "เพื่อกันฝนรั่ว", "Um Regenwasser abzuhalten", "Phuea kan fon"],
            ["d", "เพื่อทดสอบความเหนียวของทอง", "Um den Klebstoff zu testen", "Phuea thotsop thong"]
        ],
        explanationTh: "การปิดทองพระพุทธรูปเปรียบเหมือนการทำความดีด้วยใจบริสุทธิ์และยกย่องพระธรรม",
        explanationDe: "Das Aufbringen von Blattgold gilt als verdienstvolle Tat ('Tham Bun') und Zeichen tiefen Respekts.",
        source: { title: "Department of Cultural Promotion Thailand – Buddhist Traditions", url: "http://www.culture.go.th/" }
    },
    {
        id: "thq-beg-169",
        category: "religion",
        difficulty: 2,
        questionTh: "พระพุทธรูปประจำวันเกิดในไทยสร้างขึ้นตามสิ่งใด?",
        questionDe: "Woran orientieren sich die verschiedenen Buddha-Körperhaltungen der Wochentage?",
        questionTr: "Phraphuttharup pracham wan koet sang khuen tam sing dai?",
        options: [
            ["a", "ปางพระพุทธรูปตามเหตุการณ์ในพุทธประวัติแต่ละตอน", "Episoden und Haltungen aus dem Leben Buddhas", "Pang phraphuttharup tam phutthaprawat"],
            ["b", "สภาพอากาศในวันนั้น", "Nach der Wettervorhersage", "Saphap akat"],
            ["c", "ประเภทของกีฬา", "Nach antiken Sportarten", "Praphet kila"],
            ["d", "ชื่อของดวงดาว", "Reine Tierkreiszeichen", "Chue duangdao"]
        ],
        explanationTh: "แต่ละวันในสัปดาห์มีปางพระพุทธรูปที่สะท้อนเรื่องราวสำคัญ เช่น ปางไสยาสน์ (นอน) ประจำวันอังคาร",
        explanationDe: "Jedem Wochentag ist eine Haltung zugeordnet (z. B. Liegender Buddha für Dienstag).",
        source: { title: "National Office of Buddhism Thailand – Buddha Postures", url: "https://www.onab.go.th/" }
    },
    {
        id: "thq-beg-170",
        category: "religion",
        difficulty: 1,
        questionTh: "วัดที่มีพระปรางค์ประดับกระเบื้องเคลือบงดงามริมแม่น้ำเจ้าพระยาคือวัดใด?",
        questionDe: "Wie heißt der berühmte Tempel der Morgenröte mit seinem reich verzierten Prang am Fluss?",
        questionTr: "Wat thi mi phra prang pradit krabueang rim maenam Chao Phraya khue wat dai?",
        options: [
            ["a", "วัดอรุณราชวราราม (Wat Arun)", "Wat Arun (วัดอรุณ)", "Wat Arun"],
            ["b", "วัดพระแก้ว", "Wat Phra Kaew", "Wat Phra Kaeo"],
            ["c", "วัดสระเกศ", "Wat Saket", "Wat Saket"],
            ["d", "วัดไตรมิตร", "Wat Traimit", "Wat Traimit"]
        ],
        explanationTh: "วัดอรุณฯ โดดเด่นด้วยพระปรางค์สูงสง่าริมน้ำเจ้าพระยา ประดับด้วยชิ้นกระเบื้องถ้วยชามโบราณหลากสี",
        explanationDe: "Wat Arun erstrahlt besonders im Morgen- und Abendlicht direkt am Flussufer Bangkoks.",
        source: { title: "Tourism Authority of Thailand – Wat Arun", url: "https://www.tourismthailand.org/" }
    },

    // === BLOCK 8: Sprache, Redewendungen & Kommunikation (171-180) ===
    {
        id: "thq-beg-171",
        category: "language_daily",
        difficulty: 1,
        questionTh: "สำนวนไทยยอดนิยมคำว่า 'ไม่เป็นไร' มีความหมายว่าอย่างไร?",
        questionDe: "Was bedeutet die berühmte thailändische Redewendung 'Mai Pen Rai' (ไม่เป็นไร)?",
        questionTr: "Samnuan Thai yotniyom kham wa 'mai pen rai' mi khwammai wa yangrai?",
        options: [
            ["a", "Macht nichts / Kein Problem / Gern geschehen", "Macht nichts / Kein Problem", "Macht nichts"],
            ["b", "Ich bin furchtbar böse", "Ich bin furchtbar böse", "Böse"],
            ["c", "Das ist viel zu teuer", "Das ist viel zu teuer", "Zu teuer"],
            ["d", "Gefahr im Verzug", "Gefahr im Verzug", "Gefahr"]
        ],
        explanationTh: "ไม่เป็นไร ใช้ปลอบใจ ให้อภัย และแสดงน้ำใจไมตรีว่าทุกอย่างเรียบร้อยดี",
        explanationDe: "'Mai Pen Rai' spiegelt die herzliche thailändische Gelassenheit in jeder Lebenslage wider.",
        source: { title: "Royal Society of Thailand – Everyday Phrases", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-172",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำว่า 'อร่อยมาก' ในภาษาไทยใช้พูดเมื่อใด?",
        questionDe: "Wann sagt man auf Thai anerkennend 'Aroi Mak' (อร่อยมาก)?",
        questionTr: "Kham wa 'aroi mak' nai phasa Thai chai phut muea dai?",
        options: [
            ["a", "เมื่ออาหารมีรสชาติอร่อยถูกปากมาก", "Wenn das Essen hervorragend schmeckt", "Muea ahan aroi"],
            ["b", "เมื่ออากาศหนาวจัด", "Wenn es bitterkalt ist", "Muea akat nao"],
            ["c", "เมื่อรถติดบนถนน", "Wenn man im Stau steht", "Muea rot tit"],
            ["d", "เมื่อต้องการนอนหลับ", "Wenn man schlafen möchte", "Muea tongkan non"]
        ],
        explanationTh: "อร่อยมาก ใช้ชมแม่ครัวหรือพ่อค้าเมื่ออาหารรสชาติดีเยี่ยม",
        explanationDe: "'Aroi Mak!' zaubert jedem thailändischen Koch ein breites Lächeln ins Gesicht.",
        source: { title: "Tourism Authority of Thailand – Useful Thai Phrases", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-173",
        category: "language_daily",
        difficulty: 1,
        questionTh: "ผู้ชายไทยกล่าวคำขอบคุณอย่างสุภาพว่าอย่างไร?",
        questionDe: "Wie bedankt sich ein Mann auf Thai höflich?",
        questionTr: "Phuchai Thai klao kham khopkhun yang suphap wa yangrai?",
        options: [
            ["a", "ขอบคุณครับ", "Khop khun khrap", "Khop khun khrap"],
            ["b", "ขอบคุณค่ะ", "Khop khun kha", "Khop khun kha"],
            ["c", "ไม่เอาครับ", "Mai ao khrap", "Mai ao khrap"],
            ["d", "ลาก่อนค่ะ", "La kon kha", "La kon kha"]
        ],
        explanationTh: "ผู้ชายใช้คำว่า 'ขอบคุณครับ' เพื่อแสดงความซาบซึ้งใจและสุภาพ",
        explanationDe: "'Khop khun khrap' ist das höfliche Danke für männliche Sprecher.",
        source: { title: "Royal Society of Thailand – Basic Conversational Thai", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-174",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำถามว่า 'อันนี้ราคาเท่าไร?' ใช้ถามเรื่องใด?",
        questionDe: "Wie fragt man auf dem Markt freundlich nach dem Preis: 'Wie viel kostet das?'?",
        questionTr: "Khamtham wa 'an ni rakha thao rai?' chai tham rueang dai?",
        options: [
            ["a", "ราคาของสินค้า", "Nach dem Preis der Ware", "Rakha khong sinkha"],
            ["b", "เวลาเครื่องบินออก", "Nach der Abflugzeit", "Wela khrueangbin ok"],
            ["c", "ชื่อของแม่ค้า", "Nach dem Namen der Verkäuferin", "Chue khong maekha"],
            ["d", "น้ำหนักตัว", "Nach dem Körpergewicht", "Namnak tua"]
        ],
        explanationTh: "เท่าไร แปลว่า wie viel ใช้ถามราคาสินค้าเวลาซื้อของตามตลาด",
        explanationDe: "'Thao rai khrap/kha?' ist die Standardfrage zum Bezahlen und Feilschen.",
        source: { title: "Tourism Authority of Thailand – Shopping Phrases", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-175",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำว่า 'ไม่เอา' ในภาษาไทยมีความหมายตรงกับภาษาเยอรมันว่าอะไร?",
        questionDe: "Wie sagt man auf Thai freundlich 'Ich möchte nicht / Nein danke'?",
        questionTr: "Kham wa 'mai ao' nai phasa Thai mi khwammai trong kap arai?",
        options: [
            ["a", "Ich möchte nicht / Nein danke", "Ich möchte nicht / Nein danke", "Nein danke"],
            ["b", "Ich will alles kaufen", "Ich will alles kaufen", "Alles kaufen"],
            ["c", "Sehr billig", "Sehr billig", "Billig"],
            ["d", "Guten Morgen", "Guten Morgen", "Guten Morgen"]
        ],
        explanationTh: "ไม่เอา (Mai ao) เติม ครับ/ค่ะ เพื่อปฏิเสธข้อเสนออย่างสุภาพและนุ่มนวล",
        explanationDe: "'Mai ao khrap/kha' lehnt Angebote von Händlern oder Fahrern respektvoll ab.",
        source: { title: "Royal Society of Thailand – Everyday Thai", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-176",
        category: "language_daily",
        difficulty: 1,
        questionTh: "การนับเลข 1 ถึง 3 ในภาษาไทยว่าอย่างไร?",
        questionDe: "Wie zählt man auf Thai von eins bis drei?",
        questionTr: "Kan nap lek nueng thueng sam nai phasa Thai wa yangrai?",
        options: [
            ["a", "หนึ่ง, สอง, สาม", "Nueng, Song, Sam", "Nueng, Song, Sam"],
            ["b", "สี่, ห้า, หก", "Si, Ha, Hok", "Si, Ha, Hok"],
            ["c", "เจ็ด, แปด, เก้า", "Chet, Paet, Kao", "Chet, Paet, Kao"],
            ["d", "สิบ, ร้อย, พัน", "Sip, Roi, Phan", "Sip, Roi, Phan"]
        ],
        explanationTh: "1 = หนึ่ง (nueng), 2 = สอง (song), 3 = สาม (sam)",
        explanationDe: "Nueng (1), Song (2) und Sam (3) sind die allerersten Zahlwörter beim Thai-Lernen.",
        source: { title: "Royal Society of Thailand – Thai Numbers", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-177",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำถามทักทายว่า 'สบายดีไหม?' หมายถึงอะไร?",
        questionDe: "Was bedeutet die Begrüßungsfrage 'Sabai di mai?' auf Deutsch?",
        questionTr: "Khamtham thakthai wa 'sabai di mai?' maithueng arai?",
        options: [
            ["a", "Wie geht es dir?", "Wie geht es dir?", "Wie geht es dir?"],
            ["b", "Wie spät ist es?", "Wie spät ist es?", "Wie spaet ist es?"],
            ["c", "Wo wohnst du?", "Wo wohnst du?", "Wo wohnst du?"],
            ["d", "Was isst du?", "Was isst du?", "Was isst du?"]
        ],
        explanationTh: "สบายดีไหม เป็นประโยคถามไถ่สารทุกข์สุกดิบตามแบบสากล",
        explanationDe: "'Sabai di mai?' erkundigt sich freundlich nach dem Befinden des Gegenübers.",
        source: { title: "Tourism Authority of Thailand – Conversational Thai", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-178",
        category: "language_daily",
        difficulty: 1,
        questionTh: "ทำไมคนไทยจึงมักทักทายกันว่า 'กินข้าวหรือยัง?'?",
        questionDe: "Warum fragen Thailänder zur Begrüßung oft 'Kin khao rue yang?' (Hast du schon gegessen?)?",
        questionTr: "Thammai khon Thai chueng mak thakthai kan wa 'kin khao rue yang?'?",
        options: [
            ["a", "เป็นการแสดงความห่วงใยและไถ่ถามสารทุกข์สุกดิบอย่างอบอุ่น", "Herzliche Fürsorgeformel ähnlich wie 'Wie geht's?'", "Sadaeng khwam huangyai"],
            ["b", "เพื่อจะแย่งอาหารของอีกฝ่าย", "Um dem anderen das Essen wegzunehmen", "Phuea yaeng ahan"],
            ["c", "เพราะเป็นกฎหมายบังคับ", "Weil es gesetzlich vorgeschrieben ist", "Phro pen kotmai"],
            ["d", "เพื่อบังคับให้ไปซื้อข้าว", "Um jemanden zum Einkaufen zu zwingen", "Phuea bangkhap"]
        ],
        explanationTh: "คนไทยให้ความสำคัญกับเรื่องอาหารการกิน การถามว่ากินข้าวหรือยังจึงสะท้อนความผูกพันและปรารถนาดี",
        explanationDe: "Gemeinsames Essen bedeutet Geborgenheit – die Frage zeigt echtes Interesse am Wohlbefinden.",
        source: { title: "Tourism Authority of Thailand – Thai Greetings", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-179",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำว่า 'น้ำ' ในภาษาไทยมีความหมายว่าอะไร?",
        questionDe: "Was bedeutet das thailändische Wort 'Nam' (น้ำ)?",
        questionTr: "Kham wa 'nam' nai phasa Thai mi khwammai wa arai?",
        options: [
            ["a", "Wasser / Flüssigkeit", "Wasser / Flüssigkeit", "Wasser"],
            ["b", "ข้าวสวย", "Gekochter Reis", "Reis"],
            ["c", "เปลวไฟ", "Feuer", "Feuer"],
            ["d", "ภูเขาหิน", "Felsiger Berg", "Berg"]
        ],
        explanationTh: "น้ำ เป็นคำพื้นฐานที่นำไปประกอบคำเครื่องดื่มมากมาย เช่น น้ำส้ม น้ำแข็ง น้ำเปล่า",
        explanationDe: "'Nam' bildet die Basis aller Getränke (Nam Plao = Wasser, Nam Som = Saft).",
        source: { title: "Royal Society of Thailand – Basic Vocabulary", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-180",
        category: "language_daily",
        difficulty: 1,
        questionTh: "คำนำหน้าชื่อว่า 'พี่' ใช้เรียกบุคคลแบบใดเพื่อความสุภาพ?",
        questionDe: "Wen spricht man auf Thai respektvoll mit der Anrede 'Phi' (พี่) an?",
        questionTr: "Kham nam na chue wa 'phi' chai riak bukkhon baep dai?",
        options: [
            ["a", "บุคคลที่อาวุโสหรืออายุมากกว่าตนเอง", "Eine ältere Person / ältere Geschwister", "Bukkhon thi awuso kwa"],
            ["b", "เด็กทารกแรกเกิด", "Ein Neugeborenes", "Dek tharok"],
            ["c", "สัตว์เลี้ยงตัวเล็ก", "Ein kleines Haustier", "Sat liang tua lek"],
            ["d", "ศัตรูคู่อาฆาต", "Einen Erzfeind", "Sattru"]
        ],
        explanationTh: "คนไทยใช้คำว่า 'พี่' เพื่อแสดงความเคารพและสนิทสนมกับผู้ที่มีอายุมากกว่า",
        explanationDe: "Ältere spricht man höflich mit 'Phi' an, Jüngere mit 'Nong' (น้อง).",
        source: { title: "Royal Society of Thailand – Social Etiquette", url: "https://dictionary.orst.go.th/" }
    },

    // === BLOCK 9: Geografie, Inseln & Sehenswürdigkeiten (181-190) ===
    {
        id: "thq-beg-181",
        category: "geography",
        difficulty: 1,
        questionTh: "ชื่อเรียกสั้นๆ ในภาษาไทยของเมืองหลวงกรุงเทพมหานครคืออะไร?",
        questionDe: "Wie nennen die Thailänder ihre Hauptstadt Bangkok in der Alltags-Kurzform?",
        questionTr: "Chue riak san nai phasa Thai khong Krung Thep Maha Nakhon khue arai?",
        options: [
            ["a", "กรุงเทพฯ (Krung Thep)", "Krung Thep (Stadt der Engel)", "Krung Thep"],
            ["b", "สยามสแควร์", "Siam Square", "Sayam Sakhwae"],
            ["c", "เมืองเก่า", "Altstadt", "Mueang Kao"],
            ["d", "บางกอกน้อย", "Bangkok Noi", "Bangkok Noi"]
        ],
        explanationTh: "คนไทยเรียกเมืองหลวงสั้นๆ ว่า กรุงเทพฯ ซึ่งย่อมาจากชื่อเต็มที่ยาวที่สุดในโลก",
        explanationDe: "Bangkok heißt auf Thai 'Krung Thep' ('Stadt der Engel') – Teil des längsten Ortsnamens der Welt.",
        source: { title: "Thailand.go.th – Bangkok History", url: "https://thailand.go.th/" }
    },
    {
        id: "thq-beg-182",
        category: "geography",
        difficulty: 1,
        questionTh: "เกาะใดเป็นเกาะที่มีขนาดใหญ่ที่สุดในประเทศไทย?",
        questionDe: "Welche Insel ist die flächenmäßig größte Thailands?",
        questionTr: "Ko dai pen ko thi mi khanat yai thi sut nai prathet Thai?",
        options: [
            ["a", "เกาะภูเก็ต", "Phuket", "Ko Phuket"],
            ["b", "เกาะสมุย", "Koh Samui", "Ko Samui"],
            ["c", "เกาะพีพี", "Koh Phi Phi", "Ko Phi Phi"],
            ["d", "เกาะเสม็ด", "Koh Samet", "Ko Samet"]
        ],
        explanationTh: "ภูเก็ตเป็นเกาะและจังหวัดที่ใหญ่ที่สุดในฝั่งทะเลอันดามัน",
        explanationDe: "Phuket in der Andamanensee ist Thailands größte Insel und eine eigenständige Provinz.",
        source: { title: "Tourism Authority of Thailand – Phuket", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-183",
        category: "geography",
        difficulty: 1,
        questionTh: "เกาะใดในอ่าวไทยที่มีชื่อเสียงระดับโลกเรื่องการดำน้ำและเต่าทะเล?",
        questionDe: "Welche Insel im Golf von Thailand ist weltberühmt für ihre Tauchschulen?",
        questionTr: "Ko dai nai Ao Thai thi mi chuesiang radap lok rueang kan dam nam?",
        options: [
            ["a", "เกาะเต่า", "Koh Tao (Schildkröteninsel)", "Ko Tao"],
            ["b", "เกาะลันตา", "Koh Lanta", "Ko Lanta"],
            ["c", "เกาะกูด", "Koh Kood", "Ko Kut"],
            ["d", "เกาะสีชัง", "Koh Sichang", "Ko Sichang"]
        ],
        explanationTh: "เกาะเต่าเป็นศูนย์กลางการเรียนดำน้ำที่มีแนวปะการังสมบูรณ์และเต่าทะเลชุกชุม",
        explanationDe: "'Koh Tao' bedeutet wörtlich 'Schildkröteninsel' und bildet Taucher aus aller Welt aus.",
        source: { title: "Tourism Authority of Thailand – Koh Tao", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-184",
        category: "geography",
        difficulty: 1,
        questionTh: "ยอดเขาที่สูงที่สุดในประเทศไทยตั้งอยู่ในจังหวัดเชียงใหม่มีชื่อว่าอะไร?",
        questionDe: "Wie heißt der höchste Berg Thailands in der Provinz Chiang Mai?",
        questionTr: "Yotkhao thi sung thi sut nai prathet Thai mi chue wa arai?",
        options: [
            ["a", "ดอยอินทนนท์", "Doi Inthanon (2.565 m)", "Doi Inthanon"],
            ["b", "ดอยสุเทพ", "Doi Suthep", "Doi Suthep"],
            ["c", "ภูชี้ฟ้า", "Phu Chi Fa", "Phu Chi Fa"],
            ["d", "ภูกระดึง", "Phu Kradueng", "Phu Kradueng"]
        ],
        explanationTh: "ดอยอินทนนท์สูง 2,565 เมตรจากระดับน้ำทะเล มีอากาศหนาวเย็นตลอดทั้งปี",
        explanationDe: "Der Doi Inthanon ragt 2.565 Meter empor und wird liebevoll 'Dach Thailands' genannt.",
        source: { title: "Department of National Parks Thailand – Doi Inthanon", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-185",
        category: "geography",
        difficulty: 1,
        questionTh: "ประเทศไทยมีชายฝั่งติดกับทะเลอันดามันทางทิศตะวันตก และอ่าวไทยทางทิศใด?",
        questionDe: "Welche Meere umgeben Thailand im Westen bzw. im Osten?",
        questionTr: "Prathet Thai mi chaifang tit kap thale Andaman lae ao dai?",
        options: [
            ["a", "ทะเลอันดามันและอ่าวไทย", "Andamanensee (Westen) und Golf von Thailand (Osten)", "Thale Andaman lae Ao Thai"],
            ["b", "ทะเลบอลติกและทะเลเหนือ", "Ostsee und Nordsee", "Thale Bon-tik lae Nuea"],
            ["c", "ทะเลเมดิเตอร์เรเนียน", "Mittelmeer", "Thale Meditœrenian"],
            ["d", "ทะเลสาบสงขลาเท่านั้น", "Nur der Songkhla-See", "Thalesap Songkhla"]
        ],
        explanationTh: "ชายฝั่งตะวันตกเปิดสู่อันดามัน (มหาสมุทรอินเดีย) ส่วนตะวันออกและใต้ติดอ่าวไทย (แปซิฟิก)",
        explanationDe: "Thailand besitzt Traumstrände an zwei Weltmeeren: Indischer Ozean und Pazifik.",
        source: { title: "Thailand.go.th – Geography", url: "https://thailand.go.th/" }
    },
    {
        id: "thq-beg-186",
        category: "geography",
        difficulty: 1,
        questionTh: "สะพานประวัติศาสตร์ชื่อดังในสงครามโลกครั้งที่ 2 ที่กาญจนบุรีคือสะพานใด?",
        questionDe: "Welche historische Eisenbahnbrücke aus dem 2. Weltkrieg steht in Kanchanaburi?",
        questionTr: "Saphan prawattisat chue dang nai songkhram lok thi Kanchanaburi khue saphan dai?",
        options: [
            ["a", "สะพานข้ามแม่น้ำแคว", "Brücke am Kwai (Saphan Kham Maenam Khwae)", "Saphan kham maenam khwae"],
            ["b", "สะพานโกลเดนเกต", "Golden Gate Bridge", "Saphan Golden Ket"],
            ["c", "สะพานทาวเวอร์บริดจ์", "Tower Bridge", "Saphan Thao-woe Brit"],
            ["d", "สะพานพระรามแปด", "Rama-VIII-Brücke", "Saphan Phra Ram Paet"]
        ],
        explanationTh: "สะพานข้ามแม่น้ำแควเป็นส่วนหนึ่งของทางรถไฟสายมรณะในประวัติศาสตร์สงครามโลกครั้งที่สอง",
        explanationDe: "Die Brücke am Kwai ist durch bewegende Geschichte und weltberühmte Verfilmungen bekannt.",
        source: { title: "Tourism Authority of Thailand – Bridge on the River Kwai", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-187",
        category: "geography",
        difficulty: 1,
        questionTh: "เกาะหินปูนรูปทรงตะปูชื่อดังในอ่าวพังงาที่โด่งดังจากภาพยนตร์ 007 เรียกว่าเกาะอะไร?",
        questionDe: "Welcher Kalksteinfelsen in der Phang-Nga-Bucht ist nach einem berühmten Geheimagenten benannt?",
        questionTr: "Ko hinpun thi dongdang chak nang 007 riak wa ko arai?",
        options: [
            ["a", "เกาะเจมส์บอนด์ (เกาะตาปู)", "James-Bond-Insel / Koh Tapu", "Ko Chem Bon (Ko Tapu)"],
            ["b", "เกาะแบทแมน", "Batman-Insel", "Ko Baet-maen"],
            ["c", "เกาะเชอร์ล็อกโฮล์มส์", "Sherlock-Holmes-Insel", "Ko Chœ-lok Hom"],
            ["d", "เกาะทาร์ซาน", "Tarzan-Felsen", "Ko Tha-san"]
        ],
        explanationTh: "เกาะตาปูมีชื่อเสียงไปทั่วโลกหลังจากเป็นฉากถ่ายทำภาพยนตร์เจมส์ บอนด์ เมื่อปี 1974",
        explanationDe: "Koh Tapu ('Nagel-Felsen') wurde 1974 durch Roger Moore als 007 zur weltberühmten Kulisse.",
        source: { title: "Department of National Parks Thailand – Ao Phang-nga", url: "https://www.dnp.go.th/" }
    },
    {
        id: "thq-beg-188",
        category: "geography",
        difficulty: 1,
        questionTh: "ภูมิภาคตะวันออกเฉียงเหนือของไทยมีชื่อเรียกติดปากทั่วไปว่าอะไร?",
        questionDe: "Wie wird die weite nordöstliche Region Thailands im Alltag genannt?",
        questionTr: "Phumiphak tawan-ok chiang nuea khong Thai mi chue riak titpak wa arai?",
        options: [
            ["a", "ภาคอีสาน", "Isan (ภาคอีสาน)", "Phak Isan"],
            ["b", "ภาคใต้", "Der Süden", "Phak Tai"],
            ["c", "ภาคตะวันตก", "Der Westen", "Phak Tawan-tok"],
            ["d", "ภาคกลางตอนล่าง", "Unterzentralregion", "Phak Klang"]
        ],
        explanationTh: "ภาคอีสานมีวัฒนธรรม ภาษาถิ่น อาหาร และประเพณีที่เป็นเอกลักษณ์โดดเด่น",
        explanationDe: "Der Isan begeistert mit eigener Mundart, herzlicher Gastfreundschaft und würzigem Essen.",
        source: { title: "Tourism Authority of Thailand – Isan Region", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-189",
        category: "geography",
        difficulty: 1,
        questionTh: "ประเทศไทยแบ่งการปกครองส่วนภูมิภาคออกเป็นกี่จังหวัด (ไม่รวม กทม.)?",
        questionDe: "In wie viele Provinzen (Changwat) gliedert sich Thailand neben der Hauptstadt Bangkok?",
        questionTr: "Prathet Thai baeng kan pokkhrong ok pen ki changwat?",
        options: [
            ["a", "76 จังหวัด (รวมกรุงเทพฯ เป็น 77)", "76 Provinzen (mit Bangkok 77)", "76 changwat"],
            ["b", "10 จังหวัด", "10 Provinzen", "10 changwat"],
            ["c", "50 จังหวัด", "50 Provinzen", "50 changwat"],
            ["d", "100 จังหวัด", "100 Provinzen", "100 changwat"]
        ],
        explanationTh: "ประเทศไทยมี 76 จังหวัด และมีกรุงเทพมหานครเป็นการปกครองส่วนท้องถิ่นรูปแบบพิเศษ",
        explanationDe: "Thailand besteht aus 76 Provinzen plus der Sonderverwaltungszone Bangkok.",
        source: { title: "Department of Provincial Administration Thailand", url: "https://www.dopa.go.th/" }
    },
    {
        id: "thq-beg-190",
        category: "geography",
        difficulty: 1,
        questionTh: "เมืองประวัติศาสตร์ล้านนาทางภาคเหนือที่มีคูเมืองล้อมรอบรูปสี่เหลี่ยมคือเมืองใด?",
        questionDe: "In welcher nördlichen Metropole ist die historische Altstadt von einem quadratischen Wassergraben umgeben?",
        questionTr: "Mueang prawattisat Lanna thi mi khu mueang si liam khue mueang dai?",
        options: [
            ["a", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
            ["b", "พัทยา", "Pattaya", "Phatthaya"],
            ["c", "หาดใหญ่", "Hat Yai", "Hat Yai"],
            ["d", "หัวหิน", "Hua Hin", "Hua Hin"]
        ],
        explanationTh: "เชียงใหม่เป็นเมืองหลวงโบราณของอาณาจักรล้านนาที่มีคูเมืองและกำแพงเมืองเก่าแก่",
        explanationDe: "Chiang Mai verzaubert mit seiner historischen Altstadt, Tempeln und dem berühmten Stadtgraben.",
        source: { title: "Tourism Authority of Thailand – Chiang Mai", url: "https://www.tourismthailand.org/" }
    },

    // === BLOCK 10: Geschichte, Nationalsymbole & Feste (191-200) ===
    {
        id: "thq-beg-191",
        category: "history",
        difficulty: 1,
        questionTh: "เทศกาลปีใหม่ไทยโบราณในเดือนเมษายนที่มีการสาดน้ำคลายร้อนคือเทศกาลใด?",
        questionDe: "Welches weltberühmte Neujahrs-Wasserfest feiern Thailänder im heißen April?",
        questionTr: "Thetsakan pi mai Thai nai duean mesayon thi mi kan sat nam khue thetsakan dai?",
        options: [
            ["a", "เทศกาลสงกรานต์", "Songkran (Wasserfest)", "Thetsakan Songkran"],
            ["b", "เทศกาลเบียร์มิวนิก", "Oktoberfest", "Thetsakan bia"],
            ["c", "วันคริสต์มาส", "Weihnachten", "Wan khrit-mat"],
            ["d", "เทศกาลฮาโลวีน", "Halloween", "Thetsakan Ha-lo-win"]
        ],
        explanationTh: "สงกรานต์เป็นวันขึ้นปีใหม่ไทยที่มีประเพณีรดน้ำดำหัวผู้ใหญ่และเล่นน้ำดับร้อน",
        explanationDe: "Songkran reinigt symbolisch vom Alten und verwandelt Straßen in fröhliche Wasserspiele.",
        source: { title: "UNESCO Intangible Cultural Heritage – Songkran in Thailand", url: "https://ich.unesco.org/" }
    },
    {
        id: "thq-beg-192",
        category: "history",
        difficulty: 1,
        questionTh: "สิ่งที่ชาวไทยนำไปลอยในแม่น้ำลำคลองในคืนวันเพ็ญเดือน 12 คืออะไร?",
        questionDe: "Was lässt man beim Lichterfest 'Loy Krathong' im November auf dem Wasser treiben?",
        questionTr: "Sing thi chao Thai nam pai loi nai maenam nai khuen wan phen khue arai?",
        options: [
            ["a", "กระทงประดับดอกไม้และเทียน", "Mit Blumen und Kerzen geschmückte Bananenblatt-Flößchen", "Krathong pradit dokmai"],
            ["b", "ขวดพลาสติกเก่า", "Alte Plastikflaschen", "Khuat phlasatik kao"],
            ["c", "ยางรถยนต์เผาไฟ", "Brennende Autoreifen", "Yang rotyon"],
            ["d", "ถุงขยะ", "Müllsäcke", "Thung khaya"]
        ],
        explanationTh: "การลอยกระทงเพื่อขอขมาพระแม่คงคาและลอยความทุกข์โศกให้ลอยไปกับสายน้ำ",
        explanationDe: "Die leuchtenden Krathongs danken der Wassergöttin und tragen symbolisch Sorgen davon.",
        source: { title: "Tourism Authority of Thailand – Loy Krathong", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-193",
        category: "history",
        difficulty: 1,
        questionTh: "ก่อนเปลี่ยนชื่อเป็นประเทศไทยอย่างเป็นทางการ ประเทศนี้เคยมีชื่อว่าอะไร?",
        questionDe: "Unter welchem historischen Namen war Thailand bis zum Jahr 1939 offiziell bekannt?",
        questionTr: "Kon bplian chue pen prathet Thai prathet ni khoei mi chue wa arai?",
        options: [
            ["a", "สยาม (Siam)", "Siam (สยาม)", "Sayam"],
            ["b", "พม่า", "Burma", "Phama"],
            ["c", "ลังกา", "Ceylon", "Langka"],
            ["d", "อินโดจีน", "Indochina", "Indo-chin"]
        ],
        explanationTh: "ประเทศสยามได้เปลี่ยนชื่อเป็นประเทศไทยในสมัยจอมพล ป. พิบูลสงคราม เมื่อปี พ.ศ. 2482",
        explanationDe: "Das Königreich Siam wurde 1939 offiziell in 'Prathet Thai' (Thailand) umbenannt.",
        source: { title: "Encyclopaedia Britannica – History of Thailand", url: "https://www.britannica.com/place/Thailand" }
    },
    {
        id: "thq-beg-194",
        category: "history",
        difficulty: 1,
        questionTh: "ศิลปะการต่อสู้ป้องกันตัวประจำชาติไทยที่ใช้หมัด เท้า เข่า ศอก คืออะไร?",
        questionDe: "Welche Kampfkunst gilt als offizielle Nationalsportart Thailands?",
        questionTr: "Sinlapa kan tosu pracham chat Thai thi chai mat thao khao sok khue arai?",
        options: [
            ["a", "มวยไทย (Muay Thai)", "Muay Thai (Thaiboxen)", "Muay Thai"],
            ["b", "ซูโม่", "Sumo", "Sumo"],
            ["c", "คาราเต้", "Karate", "Kharate"],
            ["d", "ฟันดาบสากล", "Sportfechten", "Fan dap sakon"]
        ],
        explanationTh: "มวยไทยได้รับฉายาว่าศาสตร์แห่งอาวุธทั้งแปด จากการใช้หมัด ศอก เข่า และแข้งอย่างมีประสิทธิภาพ",
        explanationDe: "Muay Thai ist als traditionsreiche 'Kunst der acht Gliedmaßen' weltbekannt.",
        source: { title: "Tourism Authority of Thailand – Muay Thai Heritage", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-195",
        category: "history",
        difficulty: 1,
        questionTh: "ธงไตรรงค์ของไทยประกอบด้วยสามสีใดบ้าง?",
        questionDe: "Aus welchen drei Farben besteht die thailändische Nationalflagge (Thong Trairong)?",
        questionTr: "Thong Trairong khong Thai prakop duai sam si dai bang?",
        options: [
            ["a", "สีแดง สีขาว และสีน้ำเงิน", "Rot, Weiß und Blau", "Si daeng si khao si namngoen"],
            ["b", "สีดำ สีแดง และสีทอง", "Schwarz, Rot und Gold", "Si dam si daeng si thong"],
            ["c", "สีเขียว สีเหลือง และสีแดง", "Grün, Gelb und Rot", "Si khiao si lueang si daeng"],
            ["d", "สีส้ม สีม่วง และสีฟ้า", "Orange, Lila und Hellblau", "Si som si muang si fa"]
        ],
        explanationTh: "สีแดงหมายถึงชาติ สีขาวหมายถึงศาสนา และสีน้ำเงินหมายถึงพระมหากษัตริย์",
        explanationDe: "Rot symbolisiert die Nation, Weiß die Religion und Blau die thailändische Monarchie.",
        source: { title: "Royal Society of Thailand – National Flag", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-196",
        category: "history",
        difficulty: 1,
        questionTh: "เวลา 08:00 และ 18:00 น. ในที่สาธารณะของไทย ผู้คนมักทำอะไรเมื่อได้ยินเสียงเพลงชาติ?",
        questionDe: "Was tun Menschen in Thailand um 08:00 und 18:00 Uhr auf Bahnhöfen und Plätzen, wenn die Hymne ertönt?",
        questionTr: "Wela paet mong chao lae hok mong yen phu khon tham arai muea daiyin phleng chat?",
        options: [
            ["a", "ยืนตรงเคารพธงชาติและเพลงชาติ", "Aufrecht stehen bleiben und innehalten", "Yuen trong khaorop phleng chat"],
            ["b", "วิ่งแข่งกันไปที่ประตูทางออก", "Um die Wette rennen", "Wing khaeng kan"],
            ["c", "ปรบมือและเต้นรำ", "Tanzen und klatschen", "Ten ram"],
            ["d", "ปิดตาสิบวินาที", "Die Augen schließen", "Pit ta sip winathi"]
        ],
        explanationTh: "คนไทยจะหยุดยืนตรงเมื่อได้ยินเสียงเพลงชาติเพื่อแสดงความเคารพต่อชาติและสถาบัน",
        explanationDe: "Zweimal täglich hält das öffentliche Leben für zwei Minuten andächtig inne.",
        source: { title: "Thailand.go.th – Thai National Anthem", url: "https://thailand.go.th/" }
    },
    {
        id: "thq-beg-197",
        category: "history",
        difficulty: 2,
        questionTh: "เมืองหลวงโบราณของสยามที่รุ่งเรืองกว่า 400 ปีและเป็นมรดกโลกยูเนสโกในปัจจุบันคือเมืองใด?",
        questionDe: "Welche frühere Hauptstadt Siams blühte über 400 Jahre lang und ist heute ein UNESCO-Welterbe?",
        questionTr: "Mueang luang boran khong Sayam thi pen moradok lok UNESCO khue mueang dai?",
        options: [
            ["a", "พระนครศรีอยุธยา", "Ayutthaya (อยุธยา)", "Phra Nakhon Si Ayutthaya"],
            ["b", "พัทยา", "Pattaya", "Phatthaya"],
            ["c", "หัวหิน", "Hua Hin", "Hua Hin"],
            ["d", "เกาะช้าง", "Koh Chang", "Ko Chang"]
        ],
        explanationTh: "กรุงศรีอยุธยาเป็นราชธานีเก่าแก่ของไทยที่มีวัดวาอารามและโบราณสถานงดงามระดับโลก",
        explanationDe: "Ayutthaya war einst eine der prächtigsten Metropolen Asiens mit eindrucksvollen Tempeltürmen.",
        source: { title: "UNESCO World Heritage Centre – Historic City of Ayutthaya", url: "https://whc.unesco.org/en/list/576/" }
    },
    {
        id: "thq-beg-198",
        category: "history",
        difficulty: 1,
        questionTh: "คำว่า 'ไทย' ในชื่อประเทศไทยมีความหมายดั้งเดิมว่าอะไร?",
        questionDe: "Was bedeutet das Wort 'Thai' (ไทย) im Namen des Landes wörtlich übersetzt?",
        questionTr: "Kham wa 'Thai' nai chue prathet Thai mi khwammai dangdoem wa arai?",
        options: [
            ["a", "อิสระ / มีอิสรภาพ (เสรี)", "Frei / Die Freien", "Itsara / Seri"],
            ["b", "ร่ำรวย", "Reich / Wohlhabend", "Ramruai"],
            ["c", "เผ็ดร้อน", "Scharf / Würzig", "Phet ron"],
            ["d", "หนาวเย็น", "Kalt / Frostig", "Nao yen"]
        ],
        explanationTh: "ประเทศไทยหมายถึง 'ดินแดนแห่งคนอิสระ' สะท้อนความภาคภูมิใจในเอกราช",
        explanationDe: "'Thailand' bedeutet wörtlich 'Land der Freien' – stolz auf seine ununterbrochene Unabhängigkeit.",
        source: { title: "Royal Society of Thailand – Meaning of Thai", url: "https://dictionary.orst.go.th/" }
    },
    {
        id: "thq-beg-199",
        category: "history",
        difficulty: 1,
        questionTh: "คำอวยพรยอดนิยมที่คนไทยใช้กล่าวทักทายกันในวันสงกรานต์คืออะไร?",
        questionDe: "Mit welchem Gruß wünscht man sich zu Songkran gegenseitig Glück fürs neue Jahr?",
        questionTr: "Kham uaiphon yotniyom nai wan Songkran khue arai?",
        options: [
            ["a", "สวัสดีปีใหม่ไทย (สุขสันต์วันสงกรานต์)", "Sawatdi Pi Mai Thai (Frohes Neujahr!)", "Sawatdi pi mai Thai"],
            ["b", "สุขสันต์วันเกิด", "Alles Gute zum Geburtstag", "Suksan wan koet"],
            ["c", "ขอให้โชคดีในการสอบ", "Viel Erfolg bei der Prüfung", "Chok di nai kan sop"],
            ["d", "ราตรีสวัสดิ์", "Gute Nacht", "Ratri sawat"]
        ],
        explanationTh: "คนไทยนิยมกล่าว 'สุขสันต์วันสงกรานต์' หรือ 'สวัสดีปีใหม่ไทย' เมื่อรดน้ำอวยพรกัน",
        explanationDe: "Mit 'Sawatdi Pi Mai Thai' wünscht man Familie und Freunden Segen für den Neuanfang.",
        source: { title: "Tourism Authority of Thailand – Songkran Festival", url: "https://www.tourismthailand.org/" }
    },
    {
        id: "thq-beg-200",
        category: "history",
        difficulty: 1,
        questionTh: "เทศกาลปล่อยโคมลอยสว่างไสวเต็มท้องฟ้ายามค่ำคืนในเชียงใหม่เรียกว่าอะไร?",
        questionDe: "Welches Lanna-Fest lässt tausende leuchtende Heißluft-Laternen in den Nachthimmel von Chiang Mai steigen?",
        questionTr: "Thetsakan ploi khom loi sawang sawai nai Chiang Mai riak wa arai?",
        options: [
            ["a", "ประเพณียี่เป็ง", "Yi Peng Festival (ประเพณียี่เป็ง)", "Prapheni Yi Peng"],
            ["b", "เทศกาลผีตาโขน", "Phi Ta Khon Geisterfest", "Phi Ta Khon"],
            ["c", "งานบุญบั้งไฟ", "Raketenfest Bun Bang Fai", "Bun Bang Fai"],
            ["d", "เทศกาลกินเจ", "Vegetarisches Festival", "Thetsakan kin che"]
        ],
        explanationTh: "ประเพณียี่เป็งเป็นวัฒนธรรมล้านนา มีการจุดประทีปและปล่อยโคมลอยเพื่อบูชาพระเกศแก้วจุฬามณี",
        explanationDe: "Beim Yi-Peng-Fest erhellen Myriaden leuchtender Papier-Laternen ('Khom Loi') den Nachthimmel.",
        source: { title: "Tourism Authority of Thailand – Yi Peng Festival Chiang Mai", url: "https://www.tourismthailand.org/" }
    }
];

function formatQuestionJs(q) {
    const optsStr = q.options.map(o => `                [${JSON.stringify(o[0])}, ${JSON.stringify(o[1])}, ${JSON.stringify(o[2])}, ${JSON.stringify(o[3])}]`).join(',\r\n');
    const srcStr = JSON.stringify([q.source]);
    return `        makeQuestion(\r\n            ${JSON.stringify(q.id)}, ${JSON.stringify(q.category)}, ${q.difficulty}, "single_choice",\r\n            ${JSON.stringify(q.questionTh)},\r\n            ${JSON.stringify(q.questionDe)},\r\n            ${JSON.stringify(q.questionTr)},\r\n            [\r\n${optsStr}\r\n            ],\r\n            "a",\r\n            ${JSON.stringify(q.explanationTh)},\r\n            ${JSON.stringify(q.explanationDe)},\r\n            ${srcStr}\r\n        )`;
}

function injectQuestions() {
    let content = fs.readFileSync(QUIZ_FILE, 'utf8');

    // 1. Verify not already injected
    if (content.includes('"thq-beg-101"')) {
        console.log('thq-beg-101 already present in thailand-quiz.js. Skipping questions injection.');
        return;
    }

    // 2. Locate thq-beg-100 block
    const targetMarker = 'makeQuestion(\r\n            "thq-beg-100",';
    const idx = content.indexOf(targetMarker);
    if (idx === -1) {
        throw new Error('Could not find thq-beg-100 marker in thailand-quiz.js');
    }

    const endSnippet = '        ),\r\n        ...[';
    const endIdx = content.indexOf(endSnippet, idx);
    if (endIdx === -1) {
        throw new Error('Could not find end of thq-beg-100 block in thailand-quiz.js');
    }

    const insertionPoint = endIdx + 11; // length of '        ),\r\n'

    const questionsFormatted = rawQuestions.map(formatQuestionJs).join(',\r\n');

    const newContent = content.slice(0, insertionPoint) +
        questionsFormatted +
        ',\r\n' +
        content.slice(insertionPoint);

    // 3. Inject into legacyDifficultyReview
    const revMarker = '"thq-beg-100": 2,';
    const revIdx = newContent.indexOf(revMarker);
    if (revIdx === -1) {
        throw new Error('Could not find thq-beg-100 in legacyDifficultyReview');
    }

    const revInsertPoint = revIdx + revMarker.length;
    let revLines = '\r\n';
    rawQuestions.forEach(q => {
        revLines += `        "${q.id}": ${q.difficulty},\r\n`;
    });

    const finalContent = newContent.slice(0, revInsertPoint) +
        revLines.slice(0, -2) + // without trailing \r\n as revMarker had line end
        newContent.slice(revInsertPoint);

    fs.writeFileSync(QUIZ_FILE, finalContent, 'utf8');
    console.log(`Successfully injected ${rawQuestions.length} questions (thq-beg-101 to thq-beg-200) into thailand-quiz.js!`);
}

injectQuestions();
