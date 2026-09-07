"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const GIGA_DRILL_FILE = path.join(ROOT_DIR, "data", "thai-giga-drill.v1.json");
const OUTPUT_FILE = path.join(ROOT_DIR, "data", "staging", "drills", "boss-7-block-2.json");

// Load existing production words
const prodData = JSON.parse(fs.readFileSync(GIGA_DRILL_FILE, "utf8"));
const prodWordMap = new Map();
const prodWordDetailsMap = new Map();
prodData.words.forEach(w => {
    if (!prodWordMap.has(w.thai)) {
        prodWordMap.set(w.thai, w.id);
        prodWordDetailsMap.set(w.thai, w);
    }
});
const prodStoriesById = new Map();
for (const level of prodData.levels || []) {
    for (const boss of level.bosses || []) {
        for (const block of boss.blocks || []) {
            for (const story of block.miniStories || []) {
                prodStoriesById.set(story.id, story);
            }
        }
    }
}

// New vocabulary definition for Block 2 (3-level Goldstandard)
const newVocab = [
    {
        id: "temp-w-thaa",
        thai: "ถ้า",
        transliteration: "thâa",
        meanings: ["wenn", "falls"],
        note: "Konditionale Konjunktion am Satzanfang (z. B. ถ้าฝนตก = Wenn es regnet)."
    },
    {
        id: "temp-w-fon-tok",
        thai: "ฝนตก",
        transliteration: "fǒn-dtòk",
        meanings: ["es regnet", "Regen fällt"],
        note: "Zusammengesetzt aus ฝน (Regen) + ตก (fallen)."
    },
    {
        id: "temp-w-yuu-baan",
        thai: "อยู่บ้าน",
        transliteration: "yùu-bâan",
        meanings: ["zu Hause sein", "zu Hause bleiben"],
        note: "อยู่ (sein/bleiben) + บ้าน (Haus)."
    },
    {
        id: "temp-w-mai-tok",
        thai: "ไม่ตก",
        transliteration: "mâi-dtòk",
        meanings: ["fällt nicht", "regnet nicht"]
    },
    {
        id: "temp-w-rom",
        thai: "ร่ม",
        transliteration: "rôm",
        meanings: ["Regenschirm", "Sonnenschirm", "Schatten"]
    },
    {
        id: "temp-w-bpai-duai",
        thai: "ไปด้วย",
        transliteration: "bpai-dûai",
        meanings: ["mitgehen", "mitnehmen"]
    },
    {
        id: "temp-w-ao-bpai",
        thai: "เอาไป",
        transliteration: "ao-bpai",
        meanings: ["mitnehmen", "wegnehmen"]
    },
    {
        id: "temp-w-thoong-faa",
        thai: "ท้องฟ้า",
        transliteration: "thɔ́ɔng-fáa",
        meanings: ["Himmel", "Firmament"]
    },
    {
        id: "temp-w-muut",
        thai: "มืด",
        transliteration: "mʉ̂ʉt",
        meanings: ["dunkel", "finster"]
    },
    {
        id: "temp-w-riip",
        thai: "รีบ",
        transliteration: "rîip",
        meanings: ["sich beeilen", "eilig"]
    },
    {
        id: "temp-w-glap-baan",
        thai: "กลับบ้าน",
        transliteration: "glàp-bâan",
        meanings: ["nach Hause zurückkehren", "heimgehen"]
    },
    {
        id: "temp-w-thoe",
        thai: "เถอะ",
        transliteration: "thə̀",
        meanings: ["lass uns...", "doch bitte"],
        note: "Aufforderungspartikel am Satzende (z. B. ไปกันเถอะ = Lass uns gehen)."
    },
    {
        id: "temp-w-tok-nak",
        thai: "ตกหนัก",
        transliteration: "dtòk-nàk",
        meanings: ["stark regnen", "schwer niedergehen"]
    },
    {
        id: "temp-w-fit-net",
        thai: "ฟิตเนส",
        transliteration: "fít-nèet",
        meanings: ["Fitnessstudio", "Gym"],
        note: "Englisches Lehnwort (Fitness), sehr gebräuchlich in Thailand."
    },
    {
        id: "temp-w-jet-moong-chao",
        thai: "เจ็ดโมงเช้า",
        transliteration: "jèt moong cháo",
        meanings: ["7:00 Uhr morgens"],
        note: "Klassische thailändische Vormittagszählung (เจ็ดโมง = 7 Uhr)."
    },
    {
        id: "temp-w-ook-gam-lang-gaai",
        thai: "ออกกำลังกาย",
        transliteration: "ɔ̀ɔk-gam-lang-gaai",
        meanings: ["Sport treiben", "trainieren"],
        note: "ออก (ausüben) + กำลัง (Kraft) + กาย (Körper)."
    },
    {
        id: "temp-w-bpra-maan",
        thai: "ประมาณ",
        transliteration: "bprà-maan",
        meanings: ["ungefähr", "circa", "etwa"]
    },
    {
        id: "temp-w-chua-moong",
        thai: "ชั่วโมง",
        transliteration: "chûa-moong",
        meanings: ["Stunde (Zeitdauer)"]
    },
    {
        id: "temp-w-naa-ja",
        thai: "น่าจะ",
        transliteration: "nâa-jà",
        meanings: ["dürfte wohl", "wahrscheinlich werden", "sollte"],
        note: "Modalpartikel für Vermutungen und hohe Wahrscheinlichkeiten vor Verben."
    },
    {
        id: "temp-w-saai",
        thai: "สาย",
        transliteration: "sǎai",
        meanings: ["zu spät", "verspätet"]
    },
    {
        id: "temp-w-muu-nii",
        thai: "มื้อนี้",
        transliteration: "mʉ́ʉ níi",
        meanings: ["diese Mahlzeit", "dieses Mal beim Essen"],
        note: "มื้อ ist das Zählwort für Mahlzeiten."
    },
    {
        id: "temp-w-a-rai-dii",
        thai: "อะไรดี",
        transliteration: "à-rai dii",
        meanings: ["was am besten", "was Gutes"],
        note: "Häufige Wendung bei Entscheidungen (z. B. กินอะไรดี = Was sollen wir essen?)."
    },
    {
        id: "temp-w-phat-thai",
        thai: "ผัดไทย",
        transliteration: "phàt-thai",
        meanings: ["Pad Thai (gebratene Thai-Nudeln)"]
    },
    {
        id: "temp-w-khruang-duum",
        thai: "เครื่องดื่ม",
        transliteration: "khrʉ̂ang-dʉ̀ʉm",
        meanings: ["Getränk", "Getränke"]
    },
    {
        id: "temp-w-naam-som-khan",
        thai: "น้ำส้มคั้น",
        transliteration: "náam-sôm-khán",
        meanings: ["frisch gepresster Orangensaft"]
    },
    {
        id: "temp-w-riak",
        thai: "เรียก",
        transliteration: "rîak",
        meanings: ["rufen", "nennen", "heranwinken"]
    },
    {
        id: "temp-w-pha-nak-ngaan",
        thai: "พนักงาน",
        transliteration: "phá-nák-ngaan",
        meanings: ["Angestellter", "Bedienung", "Mitarbeiter"]
    },
    {
        id: "temp-w-mai-naan",
        thai: "ไม่นาน",
        transliteration: "mâi naan",
        meanings: ["nicht lange", "in Kürze"]
    },
    {
        id: "temp-w-daai-mai",
        thai: "ได้ไหม",
        transliteration: "dâai mái",
        meanings: ["geht das?", "kannst du?", "ist das möglich?"]
    },
    {
        id: "temp-w-san-yaa",
        thai: "สัญญา",
        transliteration: "sǎn-yaa",
        meanings: ["versprechen", "Vertrag"],
        note: "สัญญาว่า = versprechen, dass..."
    },
    {
        id: "temp-w-than",
        thai: "ทัน",
        transliteration: "than",
        meanings: ["rechtzeitig sein", "pünktlich schaffen"]
    },
    {
        id: "temp-w-hai-dii-thii-sut",
        thai: "ให้ดีที่สุด",
        transliteration: "hâi dii thîi-sùt",
        meanings: ["so gut wie möglich", "mein Bestes"]
    },
    {
        id: "temp-w-khaao",
        thai: "ข่าว",
        transliteration: "khàao",
        meanings: ["Nachricht", "Neuigkeiten"]
    },
    {
        id: "temp-w-yoot-yiam",
        thai: "ยอดเยี่ยม",
        transliteration: "yɔ̂ɔt-yîam",
        meanings: ["großartig", "ausgezeichnet", "hervorragend"]
    },
    {
        id: "temp-w-sao-nii",
        thai: "เสาร์นี้",
        transliteration: "sǎo níi",
        meanings: ["diesen Samstag"]
    },
    {
        id: "temp-w-jat",
        thai: "จัด",
        transliteration: "jàt",
        meanings: ["organisieren", "einrichten", "arrangieren"]
    },
    {
        id: "temp-w-hoong-noon",
        thai: "ห้องนอน",
        transliteration: "hɔ̂ɔng-nɔɔn",
        meanings: ["Schlafzimmer"]
    },
    {
        id: "temp-w-dto",
        thai: "โต๊ะ",
        transliteration: "dtó",
        meanings: ["Tisch"]
    },
    {
        id: "temp-w-dto-tham-ngaan",
        thai: "โต๊ะทำงาน",
        transliteration: "dtó tham-ngaan",
        meanings: ["Schreibtisch", "Arbeitstisch"]
    },
    {
        id: "temp-w-gao-ii",
        thai: "เก้าอี้",
        transliteration: "gâo-îi",
        meanings: ["Stuhl"]
    },
    {
        id: "temp-w-dtua-gao",
        thai: "ตัวเก่า",
        transliteration: "dtua gào",
        meanings: ["das alte Stück / der alte (Stuhl)"]
    },
    {
        id: "temp-w-blian",
        thai: "เปลี่ยน",
        transliteration: "bplìan",
        meanings: ["wechseln", "tauschen", "ändern"]
    },
    {
        id: "temp-w-dtua-mai",
        thai: "ตัวใหม่",
        transliteration: "dtua mài",
        meanings: ["ein neues Stück / der neue (Stuhl)"]
    },
    {
        id: "temp-w-yok-khoong",
        thai: "ยกของ",
        transliteration: "yók khɔ̌ɔng",
        meanings: ["Sachen heben", "Gegenstände tragen"]
    },
    {
        id: "temp-w-chuai-daai",
        thai: "ช่วยได้",
        transliteration: "chûai dâai",
        meanings: ["kann helfen", "hilft"]
    },
    {
        id: "temp-w-gwaang-khuen",
        thai: "กว้างขึ้น",
        transliteration: "gwâang khʉ̂n",
        meanings: ["geräumiger werden", "breiter/weiter werden"]
    },
    {
        id: "temp-w-tham-set",
        thai: "ทำเสร็จ",
        transliteration: "tham sèt",
        meanings: ["fertig machen", "erledigen"]
    },
    {
        id: "temp-w-chuan",
        thai: "ชวน",
        transliteration: "chuan",
        meanings: ["einladen", "auffordern mitzukommen"]
    },
    {
        id: "temp-w-mai-khooi",
        thai: "ไม่ค่อย",
        transliteration: "mâi khɔ̂i",
        meanings: ["nicht sonderlich", "nicht so recht"]
    },
    {
        id: "temp-w-buat-hua",
        thai: "ปวดหัว",
        transliteration: "bpùat-hǔa",
        meanings: ["Kopfschmerzen haben"]
    },
    {
        id: "temp-w-bpai-haa-moo",
        thai: "ไปหาหมอ",
        transliteration: "bpai hǎa mɔ̌ɔ",
        meanings: ["zum Arzt gehen"]
    },
    {
        id: "temp-w-khlii-nik",
        thai: "คลินิก",
        transliteration: "khlii-nìk",
        meanings: ["Klinik", "Arztpraxis"]
    },
    {
        id: "temp-w-laa-ngaan",
        thai: "ลางาน",
        transliteration: "laa-ngaan",
        meanings: ["sich von der Arbeit freinehmen", "Urlaub/Krankheit einreichen"]
    },
    {
        id: "temp-w-chuang-baai",
        thai: "ช่วงบ่าย",
        transliteration: "chûang bàai",
        meanings: ["nachmittags", "im Laufe des Nachmittags"]
    },
    {
        id: "temp-w-glap-goon",
        thai: "กลับก่อน",
        transliteration: "glàp gɔ̀ɔn",
        meanings: ["vorher/früher nach Hause gehen"]
    },
    {
        id: "temp-w-gin-yaa",
        thai: "กินยา",
        transliteration: "gin yaa",
        meanings: ["Medikamente einnehmen", "Medizin nehmen"]
    },
    {
        id: "temp-w-diao-goo",
        thai: "เดี๋ยวก็",
        transliteration: "dǐao-gɔ̂",
        meanings: ["bald wird schon", "gleich dann"]
    },
    {
        id: "temp-w-haai-dii",
        thai: "หายดี",
        transliteration: "hǎai dii",
        meanings: ["vollständig genesen", "wieder gesund sein"]
    },
    {
        id: "temp-w-dii-khuen",
        thai: "ดีขึ้น",
        transliteration: "dii khʉ̂n",
        meanings: ["besser werden", "sich verbessern"]
    },
    {
        id: "temp-w-thrip-nii",
        thai: "ทริปนี้",
        transliteration: "thríp níi",
        meanings: ["diese Reise", "dieser Ausflug"]
    },
    {
        id: "temp-w-chiang-mai",
        thai: "เชียงใหม่",
        transliteration: "Chiiang-mài",
        meanings: ["Chiang Mai (Großstadt in Nordthailand)"]
    },
    {
        id: "temp-w-doen-thaang",
        thai: "เดินทาง",
        transliteration: "dəən-thaang",
        meanings: ["reisen", "eine Reise antreten"]
    },
    {
        id: "temp-w-rot-fai-duan",
        thai: "รถไฟด่วน",
        transliteration: "rót-fai dùan",
        meanings: ["Schnellzug", "Expresszug"]
    },
    {
        id: "temp-w-ook-jaak",
        thai: "ออกจาก",
        transliteration: "ɔ̀ɔk jàak",
        meanings: ["abfahren von", "verlassen"]
    },
    {
        id: "temp-w-sa-thaa-nii",
        thai: "สถานี",
        transliteration: "sà-thǎa-nii",
        meanings: ["Station", "Bahnhof"]
    },
    {
        id: "temp-w-soong-thum",
        thai: "สองทุ่ม",
        transliteration: "sɔ̌ɔng thûm",
        meanings: ["20:00 Uhr (abends)"],
        note: "Thailändische Abendzeitzählung (ทุ่ม von 19:00 bis 23:00 Uhr; สองทุ่ม = 20:00 Uhr)."
    },
    {
        id: "temp-w-joong-dtua",
        thai: "จองตั๋ว",
        transliteration: "jɔɔng dtǔa",
        meanings: ["Ticket reservieren", "Fahrkarte buchen"]
    },
    {
        id: "temp-w-luang-naa",
        thai: "ล่วงหน้า",
        transliteration: "lûang-nâa",
        meanings: ["im Voraus", "vorab"]
    },
    {
        id: "temp-w-phaan",
        thai: "ผ่าน",
        transliteration: "phàan",
        meanings: ["über", "durch", "bestehen"]
    },
    {
        id: "temp-w-aap",
        thai: "แอป",
        transliteration: "ɛ́ɛp",
        meanings: ["App (Smartphone-Anwendung)"]
    },
    {
        id: "temp-w-phoo-dii",
        thai: "พอดี",
        transliteration: "phɔɔ-dii",
        meanings: ["genau passend", "gerade rechtzeitig"]
    },
    {
        id: "temp-w-soop",
        thai: "สอบ",
        transliteration: "sɔ̀ɔp",
        meanings: ["Prüfung ablegen", "testen"]
    },
    {
        id: "temp-w-dtang-jai",
        thai: "ตั้งใจ",
        transliteration: "dtâng-jai",
        meanings: ["zielstrebig sein", "sich vornehmen", "aufmerksam"]
    },
    {
        id: "temp-w-aan-nang-suu",
        thai: "อ่านหนังสือ",
        transliteration: "àan nǎng-sʉ̌ʉ",
        meanings: ["lesen", "für Prüfungen lernen"]
    },
    {
        id: "temp-w-fuk-phuut",
        thai: "ฝึกพูด",
        transliteration: "fʉ̀k phûut",
        meanings: ["sprechen üben"]
    },
    {
        id: "temp-w-wan-la",
        thai: "วันละ",
        transliteration: "wan-lá",
        meanings: ["pro Tag", "täglich"]
    },
    {
        id: "temp-w-gaan-soop",
        thai: "การสอบ",
        transliteration: "gaan-sɔ̀ɔp",
        meanings: ["die Prüfung", "das Examen"]
    },
    {
        id: "temp-w-kha-yan",
        thai: "ขยัน",
        transliteration: "khà-yǎn",
        meanings: ["fleißig", "arbeitsam"]
    },
    {
        id: "temp-w-soop-phaan",
        thai: "สอบผ่าน",
        transliteration: "sɔ̀ɔp-phàan",
        meanings: ["die Prüfung bestehen"]
    },
    {
        id: "temp-w-dtiu",
        thai: "ติว",
        transliteration: "dtiu",
        meanings: ["Nachhilfe geben", "intensiv wiederholen/coachen"]
    },
    {
        id: "temp-w-yoom-phaae",
        thai: "ยอมแพ้",
        transliteration: "yɔɔm-phɛ́ɛ",
        meanings: ["aufgeben", "kapitulieren"]
    },
    {
        id: "temp-w-wan-goet",
        thai: "วันเกิด",
        transliteration: "wan-gə̀ət",
        meanings: ["Geburtstag"]
    },
    {
        id: "temp-w-luak-suu",
        thai: "เลือกซื้อ",
        transliteration: "lʉ̂ak sʉ́ʉ",
        meanings: ["aussuchen und kaufen", "shoppen"]
    },
    {
        id: "temp-w-haang-sap-pha-sin-khaa",
        thai: "ห้างสรรพสินค้า",
        transliteration: "hâang-sàp-phá-sǐn-kháa",
        meanings: ["Kaufhaus", "Einkaufszentrum", "Mall"]
    },
    {
        id: "temp-w-sii-naam-ngoen",
        thai: "สีน้ำเงิน",
        transliteration: "sǐi náam-ngən",
        meanings: ["dunkelblaue Farbe", "Blau"]
    },
    {
        id: "temp-w-ngaan-liang",
        thai: "งานเลี้ยง",
        transliteration: "ngaan-lían",
        meanings: ["Feier", "Party", "Bankett"]
    },
    {
        id: "temp-w-jat-ngaan",
        thai: "จัดงาน",
        transliteration: "jàt ngaan",
        meanings: ["eine Feier/Veranstaltung ausrichten"]
    },
    {
        id: "temp-w-phroom-naa-gan",
        thai: "พร้อมหน้ากัน",
        transliteration: "phrɔ́ɔm-nâa gan",
        meanings: ["alle vollzählig beisammen", "in versammelter Runde"]
    },
    {
        id: "temp-w-bpra-thap-jai",
        thai: "ประทับใจ",
        transliteration: "bprà-tháp-jai",
        meanings: ["beeindruckt sein", "berührt sein"]
    },
    {
        id: "temp-w-gaao-dtɔɔ-bpai",
        thai: "ก้าวต่อไป",
        transliteration: "gâao dtɔ̀ɔ-bpai",
        meanings: ["den nächsten Schritt machen", "weiterschreiten"]
    },
    {
        id: "temp-w-rian-ruu",
        thai: "เรียนรู้",
        transliteration: "rian-rúu",
        meanings: ["dazulernen", "etwas erlernen"]
    },
    {
        id: "temp-w-a-rai-mai-mai",
        thai: "อะไรใหม่ๆ",
        transliteration: "à-rai mài-mài",
        meanings: ["neue Dinge", "Neues"]
    },
    {
        id: "temp-w-ja-daai",
        thai: "จะได้",
        transliteration: "jà dâai",
        meanings: ["werden können", "damit man kann", "wird dann"]
    },
    {
        id: "temp-w-khlong-khuen",
        thai: "คล่องขึ้น",
        transliteration: "khlɔ̂ng khʉ̂n",
        meanings: ["flüssiger werden", "gewandter werden"]
    },
    {
        id: "temp-w-gaan-phuut",
        thai: "การพูด",
        transliteration: "gaan-phûut",
        meanings: ["das Sprechen", "das Reden"]
    },
    {
        id: "temp-w-glua",
        thai: "กลัว",
        transliteration: "glua",
        meanings: ["Angst haben", "sich fürchten"]
    },
    {
        id: "temp-w-iik-dtɔɔ-bpai",
        thai: "อีกต่อไป",
        transliteration: "ìik dtɔ̀ɔ-bpai",
        meanings: ["mehr (in der Zukunft)", "weiterhin"]
    },
    {
        id: "temp-w-bpaao-maai",
        thai: "เป้าหมาย",
        transliteration: "bpâo-mǎai",
        meanings: ["Ziel", "Vorsatz"]
    },
    {
        id: "temp-w-sam-ret",
        thai: "สำเร็จ",
        transliteration: "sǎm-rèt",
        meanings: ["Erfolg haben", "Erfolg", "gelingen"]
    },
    {
        id: "temp-w-fuk-fon",
        thai: "ฝึกฝน",
        transliteration: "fʉ̀k-fǒn",
        meanings: ["eifrig trainieren", "üben"]
    },
    {
        id: "temp-w-sa-mooe",
        thai: "เสมอ",
        transliteration: "sà-mə̌ə",
        meanings: ["immer", "stets", "durchweg"]
    },
    {
        id: "temp-w-blok-naa",
        thai: "บล็อกหน้า",
        transliteration: "blɔ́k nâa",
        meanings: ["im nächsten Block"]
    },
    {
        id: "temp-w-lui",
        thai: "ลุย",
        transliteration: "lui",
        meanings: ["loslegen", "anpacken", "durchstarten"]
    },
    {
        id: "temp-w-suu-suu",
        thai: "สู้ๆ",
        transliteration: "sûu-sûu",
        meanings: ["Kämpfe!", "Gib dein Bestes!", "Viel Erfolg!"]
    },
    {
        id: "temp-w-ja-mai",
        thai: "จะไม่",
        transliteration: "jà-mâi",
        meanings: ["nicht werden", "nicht wollen"],
        note: "Verneinter Zukunftsmarker vor dem Hauptverb."
    },
    {
        id: "temp-w-nae-nae",
        thai: "แน่ๆ",
        transliteration: "nɛ̂ɛ-nɛ̂ɛ",
        meanings: ["ganz sicher", "garantiert", "ohne Zweifel"]
    },
    {
        id: "temp-w-wing",
        thai: "วิ่ง",
        transliteration: "wîng",
        meanings: ["rennen", "laufen", "joggen"]
    },
    {
        id: "temp-w-mai-phet",
        thai: "ไม่เผ็ด",
        transliteration: "mâi phèt",
        meanings: ["nicht scharf", "mild"]
    },
    {
        id: "temp-w-baai-nii",
        thai: "บ่ายนี้",
        transliteration: "bàai níi",
        meanings: ["heute Nachmittag"]
    },
    {
        id: "temp-w-yoe-yoe",
        thai: "เยอะๆ",
        transliteration: "yə́-yə́",
        meanings: ["sehr viel", "reichlich", "ordentlich"]
    },
    {
        id: "temp-w-thrip",
        thai: "ทริป",
        transliteration: "thríp",
        meanings: ["Trip", "Reise", "Ausflug"],
        note: "Englisches Lehnwort für Reisen und Urlaube."
    },
    {
        id: "temp-w-duan-naa",
        thai: "เดือนหน้า",
        transliteration: "dʉan-nâa",
        meanings: ["nächster Monat"]
    },
    {
        id: "temp-w-thuk-wan",
        thai: "ทุกวัน",
        transliteration: "thúk wan",
        meanings: ["jeden Tag", "täglich"]
    },
    {
        id: "temp-w-fuk",
        thai: "ฝึก",
        transliteration: "fʉ̀k",
        meanings: ["trainieren", "üben", "praktizieren"]
    },
    {
        id: "temp-w-nueng-chua-moong",
        thai: "หนึ่งชั่วโมง",
        transliteration: "nʉ̀ng chûa-moong",
        meanings: ["eine Stunde"]
    },
    {
        id: "temp-w-geng-khuen",
        thai: "เก่งขึ้น",
        transliteration: "gèng khʉ̂n",
        meanings: ["besser werden", "sich verbessern (Fähigkeiten)"]
    },
    {
        id: "temp-w-reo-maak",
        thai: "เร็วมาก",
        transliteration: "reo-mâak",
        meanings: ["sehr schnell", "rapide"]
    },
    {
        id: "temp-w-yen-nii",
        thai: "เย็นนี้",
        transliteration: "yen níi",
        meanings: ["heute Abend"]
    },
    {
        id: "temp-w-lek-lek",
        thai: "เล็กๆ",
        transliteration: "lék-lék",
        meanings: ["klein", "in kleinem Rahmen"]
    },
    {
        id: "temp-w-thii-baan",
        thai: "ที่บ้าน",
        transliteration: "thîi bâan",
        meanings: ["zu Hause", "daheim"]
    },
    {
        id: "temp-w-phroom-laeo",
        thai: "พร้อมแล้ว",
        transliteration: "phrɔ́ɔm lɛ́ɛo",
        meanings: ["fertig / bereit sein"]
    },
    {
        id: "temp-w-gan-dtɔɔ",
        thai: "กันต่อ",
        transliteration: "gan dtɔ̀ɔ",
        meanings: ["gemeinsam weitermachen"]
    }
];

// Keep regenerated drafts aligned with the canonical syllable data.
newVocab.forEach(vocab => {
    const existing = prodWordDetailsMap.get(vocab.thai);
    if (existing && existing.syllables) {
        vocab.syllables = existing.syllables;
    }
});

const newVocabMap = new Map();
newVocab.forEach(v => {
    newVocabMap.set(v.thai, v.id);
});

console.log(`Defined ${newVocab.length} new vocabulary entries.`);

// Helper to resolve word ID (new vocab first, then production)
function resolveWordId(text) {
    if (newVocabMap.has(text)) return newVocabMap.get(text);
    if (prodWordMap.has(text)) return prodWordMap.get(text);
    return null;
}

// 10 Mini-Stories Raw Data
const rawStories = [
    {
        id: "level-1-boss-7-story-11",
        title: "Mini-Story 11 — Wetter & Ausweichpläne (Sätze 3101–3110)",
        sentences: [
            {
                number: 3101,
                numberInStory: 1,
                thai: "ถ้าฝนตก คุณจะไปไหนไหม",
                transliteration: "thâa fǒn-dtòk khun jà bpai nǎi mái",
                translation: "Wenn es regnet, wirst du irgendwohin gehen?",
                tokenDefs: [
                    ["ถ้า", "wenn"],
                    ["ฝนตก", "es regnet"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ไป", "gehen"],
                    ["ไหน", "wohin"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3102,
                numberInStory: 2,
                thai: "ถ้าฝนตก ผมจะอยู่บ้านครับ",
                transliteration: "thâa fǒn-dtòk phǒm jà yùu-bâan khráp",
                translation: "Wenn es regnet, werde ich zu Hause bleiben.",
                tokenDefs: [
                    ["ถ้า", "wenn"],
                    ["ฝนตก", "es regnet"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["อยู่บ้าน", "zu Hause bleiben"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3103,
                numberInStory: 3,
                thai: "แล้วถ้าฝนไม่ตก ล่ะครับ",
                transliteration: "lɛ́ɛo thâa fǒn mâi-dtòk lâ khráp",
                translation: "Und was ist, wenn es nicht regnet?",
                tokenDefs: [
                    ["แล้ว", "und"],
                    ["ถ้า", "wenn"],
                    ["ฝน", "Regen"],
                    ["ไม่ตก", "nicht fällt/regnet"],
                    ["ล่ะ", "und was ist mit"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3104,
                numberInStory: 4,
                thai: "ผมจะไปเดินเล่นที่สวน",
                transliteration: "phǒm jà bpai dəən-lên thîi sǔan",
                translation: "Ich werde im Park spazieren gehen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ไป", "gehen"],
                    ["เดินเล่น", "spazieren gehen"],
                    ["ที่", "im"],
                    ["สวน", "Park"]
                ]
            },
            {
                number: 3105,
                numberInStory: 5,
                thai: "คุณจะเอาร่มไปด้วยไหม",
                transliteration: "khun jà ao rôm bpai-dûai mái",
                translation: "Wirst du einen Regenschirm mitnehmen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["เอา", "nehmen"],
                    ["ร่ม", "Regenschirm"],
                    ["ไปด้วย", "mitnehmen"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3106,
                numberInStory: 6,
                thai: "เอาไปครับ เดี๋ยวฝนจะตกอีก",
                transliteration: "ao-bpai khráp dǐao fǒn jà dtòk ìik",
                translation: "Ja, nehme ich mit. Gleich regnet es bestimmt wieder.",
                tokenDefs: [
                    ["เอาไป", "mitnehmen"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["เดี๋ยว", "gleich"],
                    ["ฝน", "Regen"],
                    ["จะ", "wird"],
                    ["ตก", "fallen / regnen"],
                    ["อีก", "wieder"]
                ]
            },
            {
                number: 3107,
                numberInStory: 7,
                thai: "ตอนนี้ท้องฟ้ามืดมากแล้ว",
                transliteration: "dtaawn-níi thɔ́ɔng-fáa mʉ̂ʉt mâak lɛ́ɛo",
                translation: "Jetzt ist der Himmel schon sehr dunkel.",
                tokenDefs: [
                    ["ตอนนี้", "jetzt"],
                    ["ท้องฟ้า", "Himmel"],
                    ["มืด", "dunkel"],
                    ["มาก", "sehr"],
                    ["แล้ว", "schon"]
                ]
            },
            {
                number: 3108,
                numberInStory: 8,
                thai: "เราจะรีบกลับบ้านไหม",
                transliteration: "rao jà rîip glàp-bâan mái",
                translation: "Werden wir uns beeilen, nach Hause zu kommen?",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["รีบ", "sich beeilen"],
                    ["กลับบ้าน", "heimkehren"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3109,
                numberInStory: 9,
                thai: "รีบกลับกันเถอะครับ",
                transliteration: "rîip glàp gan thə̀ khráp",
                translation: "Lass uns schnell zurückgehen!",
                tokenDefs: [
                    ["รีบ", "sich beeilen"],
                    ["กลับ", "zurückgehen"],
                    ["กัน", "zusammen"],
                    ["เถอะ", "lass uns"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3110,
                numberInStory: 10,
                thai: "ฝนจะตกหนักแน่ๆ",
                transliteration: "fǒn jà dtòk-nàk nɛ̂ɛ-nɛ̂ɛ",
                translation: "Es wird sicher stark regnen.",
                tokenDefs: [
                    ["ฝน", "Regen"],
                    ["จะ", "wird"],
                    ["ตกหนัก", "stark regnen"],
                    ["แน่ๆ", "ganz sicher"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-12",
        title: "Mini-Story 12 — Sport & Fitness-Absprache (Sätze 3111–3120)",
        sentences: [
            {
                number: 3111,
                numberInStory: 1,
                thai: "พรุ่งนี้คุณจะไปวิ่งไหม",
                transliteration: "phrûng-níi khun jà bpai wîng mái",
                translation: "Wirst du morgen joggen gehen?",
                tokenDefs: [
                    ["พรุ่งนี้", "morgen"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ไป", "gehen"],
                    ["วิ่ง", "joggen / laufen"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3112,
                numberInStory: 2,
                thai: "ไปครับ ผมจะไปฟิตเนส",
                transliteration: "bpai khráp phǒm jà bpai fít-nèet",
                translation: "Ja! Ich werde ins Fitnessstudio gehen.",
                tokenDefs: [
                    ["ไป", "gehen"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ไป", "gehen"],
                    ["ฟิตเนส", "Fitnessstudio"]
                ]
            },
            {
                number: 3113,
                numberInStory: 3,
                thai: "คุณจะเริ่มกี่โมงครับ",
                transliteration: "khun jà rə̂əm gìi moong khráp",
                translation: "Um wie viel Uhr wirst du anfangen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["เริ่ม", "beginnen"],
                    ["กี่โมง", "um wie viel Uhr"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3114,
                numberInStory: 4,
                thai: "ผมจะเริ่มตอนเจ็ดโมงเช้า",
                transliteration: "phǒm jà rə̂əm dtaawn jèt moong cháo",
                translation: "Ich werde um sieben Uhr morgens anfangen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["เริ่ม", "anfangen"],
                    ["ตอน", "um"],
                    ["เจ็ดโมงเช้า", "7:00 Uhr morgens"]
                ]
            },
            {
                number: 3115,
                numberInStory: 5,
                thai: "คุณจะออกกำลังกายนานไหม",
                transliteration: "khun jà ɔ̀ɔk-gam-lang-gaai naan mái",
                translation: "Wirst du lange trainieren?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ออกกำลังกาย", "Sport treiben / trainieren"],
                    ["นาน", "lange"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3116,
                numberInStory: 6,
                thai: "ประมาณหนึ่งชั่วโมงครับ",
                transliteration: "bprà-maan nʉ̀ng chûa-moong khráp",
                translation: "Ungefähr eine Stunde.",
                tokenDefs: [
                    ["ประมาณ", "ungefähr"],
                    ["หนึ่ง", "ein"],
                    ["ชั่วโมง", "Stunde"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3117,
                numberInStory: 7,
                thai: "แล้วคุณจะเหนื่อยไหม",
                transliteration: "lɛ́ɛo khun jà nʉ̀ai mái",
                translation: "Und wirst du dann müde sein?",
                tokenDefs: [
                    ["แล้ว", "und"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["เหนื่อย", "erschöpft sein"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3118,
                numberInStory: 8,
                thai: "เหนื่อยแต่น่าจะสนุกครับ",
                transliteration: "nʉ̀ai dtɛ̀ɛ nâa-jà sà-nùk khráp",
                translation: "Erschöpft, aber es wird bestimmt Spaß machen.",
                tokenDefs: [
                    ["เหนื่อย", "müde / erschöpft"],
                    ["แต่", "aber"],
                    ["น่าจะ", "dürfte wohl"],
                    ["สนุก", "Spaß machen"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3119,
                numberInStory: 9,
                thai: "พรุ่งนี้เจอกันที่ฟิตเนสนะ",
                transliteration: "phrûng-níi jəə-gan thîi fít-nèet ná",
                translation: "Dann sehen wir uns morgen im Fitnessstudio!",
                tokenDefs: [
                    ["พรุ่งนี้", "morgen"],
                    ["เจอกัน", "sich treffen"],
                    ["ที่", "im"],
                    ["ฟิตเนส", "Fitnessstudio"],
                    ["นะ", "Aufforderungspartikel"]
                ]
            },
            {
                number: 3120,
                numberInStory: 10,
                thai: "ได้เลยครับ ผมจะไม่สาย",
                transliteration: "dâai ləəi khráp phǒm jà-mâi sǎai",
                translation: "Abgemacht! Ich werde nicht zu spät kommen.",
                tokenDefs: [
                    ["ได้เลย", "abgemacht"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะไม่", "werde nicht"],
                    ["สาย", "zu spät kommen"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-13",
        title: "Mini-Story 13 — Im Restaurant bestellen & Neues probieren (Sätze 3121–3130)",
        sentences: [
            {
                number: 3121,
                numberInStory: 1,
                thai: "มื้อนี้คุณจะกินอะไรดีครับ",
                transliteration: "mʉ́ʉ níi khun jà gin à-rai dii khráp",
                translation: "Was möchtest du zu dieser Mahlzeit essen?",
                tokenDefs: [
                    ["มื้อนี้", "zu dieser Mahlzeit"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["กิน", "essen"],
                    ["อะไรดี", "was am besten"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3122,
                numberInStory: 2,
                thai: "ผมจะลองกินผัดไทยครับ",
                transliteration: "phǒm jà lɔɔng gin phàt-thai khráp",
                translation: "Ich werde Pad Thai probieren.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ลอง", "probieren"],
                    ["กิน", "essen"],
                    ["ผัดไทย", "Pad Thai"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3123,
                numberInStory: 3,
                thai: "คุณจะสั่งเผ็ดไหมครับ",
                transliteration: "khun jà sàng phèt mái khráp",
                translation: "Wirst du es scharf bestellen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["สั่ง", "bestellen"],
                    ["เผ็ด", "scharf"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3124,
                numberInStory: 4,
                thai: "จะสั่งแบบไม่เผ็ดครับ",
                transliteration: "jà sàng bɛ̀ɛp mâi phèt khráp",
                translation: "Ich werde es ungeschärft bestellen.",
                tokenDefs: [
                    ["จะ", "werde"],
                    ["สั่ง", "bestellen"],
                    ["แบบ", "Art"],
                    ["ไม่เผ็ด", "nicht scharf"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3125,
                numberInStory: 5,
                thai: "แล้วเครื่องดื่มจะเอาอะไรครับ",
                transliteration: "lɛ́ɛo khrʉ̂ang-dʉ̀ʉm jà ao à-rai khráp",
                translation: "Und was möchtest du als Getränk nehmen?",
                tokenDefs: [
                    ["แล้ว", "und"],
                    ["เครื่องดื่ม", "Getränk"],
                    ["จะ", "wirst"],
                    ["เอา", "nehmen"],
                    ["อะไร", "was"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3126,
                numberInStory: 6,
                thai: "ผมจะดื่มน้ำส้มคั้นครับ",
                transliteration: "phǒm jà dʉ̀ʉm náam-sôm-khán khráp",
                translation: "Ich werde frischen Orangensaft trinken.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ดื่ม", "trinken"],
                    ["น้ำส้มคั้น", "frisch gepresster Orangensaft"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3127,
                numberInStory: 7,
                thai: "เดี๋ยวผมจะเรียกพนักงานนะ",
                transliteration: "dǐao phǒm jà rîak phá-nák-ngaan ná",
                translation: "Ich werde gleich die Bedienung rufen.",
                tokenDefs: [
                    ["เดี๋ยว", "gleich"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["เรียก", "rufen"],
                    ["พนักงาน", "Bedienung"],
                    ["นะ", "Hinweispartikel"]
                ]
            },
            {
                number: 3128,
                numberInStory: 8,
                thai: "สั่งอาหารเสร็จแล้วครับ",
                transliteration: "sàng aa-hǎan sèt lɛ́ɛo khráp",
                translation: "Das Essen ist fertig bestellt.",
                tokenDefs: [
                    ["สั่ง", "bestellen"],
                    ["อาหาร", "Essen"],
                    ["เสร็จ", "fertig"],
                    ["แล้ว", "bereits"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3129,
                numberInStory: 9,
                thai: "อาหารจะมาเร็วไหมครับ",
                transliteration: "aa-hǎan jà maa reo mái khráp",
                translation: "Wird das Essen schnell kommen?",
                tokenDefs: [
                    ["อาหาร", "Essen"],
                    ["จะ", "wird"],
                    ["มา", "kommen"],
                    ["เร็ว", "schnell"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3130,
                numberInStory: 10,
                thai: "น่าจะรอไม่นานครับ",
                transliteration: "nâa-jà rɔɔ mâi naan khráp",
                translation: "Wir müssen wahrscheinlich nicht lange warten.",
                tokenDefs: [
                    ["น่าจะ", "dürfte wohl"],
                    ["รอ", "warten"],
                    ["ไม่นาน", "nicht lange"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-14",
        title: "Mini-Story 14 — Feste Zusagen & Versprechen (Sätze 3131–3140)",
        sentences: [
            {
                number: 3131,
                numberInStory: 1,
                thai: "คุณจะช่วยผมได้ไหมครับ",
                transliteration: "khun jà chûai phǒm dâai mái khráp",
                translation: "Wirst du mir helfen können?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ช่วย", "helfen"],
                    ["ผม", "mir"],
                    ["ได้ไหม", "können"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3132,
                numberInStory: 2,
                thai: "ได้ครับ ผมจะช่วยคุณเอง",
                transliteration: "dâai khráp phǒm jà chûai khun eeng",
                translation: "Klar, ich werde dir persönlich helfen.",
                tokenDefs: [
                    ["ได้", "in Ordnung"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ช่วย", "helfen"],
                    ["คุณ", "dir"],
                    ["เอง", "selbst"]
                ]
            },
            {
                number: 3133,
                numberInStory: 3,
                thai: "คุณจะไม่ลืมใช่ไหม",
                transliteration: "khun jà-mâi lʉʉm châi mái",
                translation: "Du wirst es nicht vergessen, oder?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะไม่", "wirst nicht"],
                    ["ลืม", "vergessen"],
                    ["ใช่ไหม", "nicht wahr?"]
                ]
            },
            {
                number: 3134,
                numberInStory: 4,
                thai: "ผมสัญญาว่าจะไม่ลืมครับ",
                transliteration: "phǒm sǎn-yaa wâa jà-mâi lʉʉm khráp",
                translation: "Ich verspreche, dass ich es nicht vergessen werde.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["สัญญา", "versprechen"],
                    ["ว่า", "dass"],
                    ["จะไม่", "werde nicht"],
                    ["ลืม", "vergessen"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3135,
                numberInStory: 5,
                thai: "งานนี้จะเสร็จทันไหม",
                transliteration: "ngaan níi jà sèt than mái",
                translation: "Wird diese Arbeit rechtzeitig fertig?",
                tokenDefs: [
                    ["งาน", "Arbeit"],
                    ["นี้", "diese"],
                    ["จะ", "wird"],
                    ["เสร็จ", "fertig"],
                    ["ทัน", "rechtzeitig"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3136,
                numberInStory: 6,
                thai: "จะเสร็จทันพรุ่งนี้แน่นอน",
                transliteration: "jà sèt than phrûng-níi nɛ̂ɛ-nɔɔn",
                translation: "Sie wird bis morgen ganz sicher rechtzeitig fertig.",
                tokenDefs: [
                    ["จะ", "wird"],
                    ["เสร็จ", "fertig"],
                    ["ทัน", "rechtzeitig"],
                    ["พรุ่งนี้", "morgen"],
                    ["แน่นอน", "ganz sicher"]
                ]
            },
            {
                number: 3137,
                numberInStory: 7,
                thai: "ขอบคุณมากที่คุณใจดี",
                transliteration: "khɔ̀ɔp-khun mâak thîi khun jai-dii",
                translation: "Vielen Dank, dass du so nett bist!",
                tokenDefs: [
                    ["ขอบคุณ", "danke"],
                    ["มาก", "sehr"],
                    ["ที่", "dass"],
                    ["คุณ", "du"],
                    ["ใจดี", "gutherzig"]
                ]
            },
            {
                number: 3138,
                numberInStory: 8,
                thai: "ผมจะทำให้ดีที่สุดครับ",
                transliteration: "phǒm jà tham hâi dii thîi-sùt khráp",
                translation: "Ich werde mein Bestes geben.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ทำ", "machen"],
                    ["ให้ดีที่สุด", "mein Bestes geben"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3139,
                numberInStory: 9,
                thai: "แล้วผมจะบอกข่าวนะครับ",
                transliteration: "lɛ́ɛo phǒm jà bɔ̀ɔk khàao ná khráp",
                translation: "Und ich werde dir Neuigkeiten mitteilen.",
                tokenDefs: [
                    ["แล้ว", "und"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["บอก", "sagen"],
                    ["ข่าว", "Neuigkeiten"],
                    ["นะ", "Hinweispartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3140,
                numberInStory: 10,
                thai: "ยอดเยี่ยมมากเลยครับ",
                transliteration: "yɔ̂ɔt-yîam mâak ləəi khráp",
                translation: "Das ist absolut großartig!",
                tokenDefs: [
                    ["ยอดเยี่ยม", "großartig"],
                    ["มาก", "sehr"],
                    ["เลย", "durchaus"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-15",
        title: "Mini-Story 15 — Zimmer umgestalten & neue Möbel (Sätze 3141–3150)",
        sentences: [
            {
                number: 3141,
                numberInStory: 1,
                thai: "เสาร์นี้คุณจะทำอะไรครับ",
                transliteration: "sǎo níi khun jà tham à-rai khráp",
                translation: "Was wirst du diesen Samstag machen?",
                tokenDefs: [
                    ["เสาร์นี้", "diesen Samstag"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ทำ", "machen"],
                    ["อะไร", "was"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3142,
                numberInStory: 2,
                thai: "ผมจะจัดห้องนอนใหม่ครับ",
                transliteration: "phǒm jà jàt hɔ̂ɔng-nɔɔn mài khráp",
                translation: "Ich werde mein Schlafzimmer neu einrichten.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["จัด", "einrichten"],
                    ["ห้องนอน", "Schlafzimmer"],
                    ["ใหม่", "neu"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3143,
                numberInStory: 3,
                thai: "คุณจะซื้อโต๊ะใหม่ไหม",
                transliteration: "khun jà sʉ́ʉ dtó mài mái",
                translation: "Wirst du einen neuen Tisch kaufen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ซื้อ", "kaufen"],
                    ["โต๊ะ", "Tisch"],
                    ["ใหม่", "neu"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3144,
                numberInStory: 4,
                thai: "จะซื้อโต๊ะทำงานใหม่ครับ",
                transliteration: "jà sʉ́ʉ dtó tham-ngaan mài khráp",
                translation: "Ich werde einen neuen Arbeitstisch kaufen.",
                tokenDefs: [
                    ["จะ", "werde"],
                    ["ซื้อ", "kaufen"],
                    ["โต๊ะทำงาน", "Schreibtisch"],
                    ["ใหม่", "neu"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3145,
                numberInStory: 5,
                thai: "แล้วเก้าอี้ตัวเก่าล่ะครับ",
                transliteration: "lɛ́ɛo gâo-îi dtua gào lâ khráp",
                translation: "Und was ist mit dem alten Stuhl?",
                tokenDefs: [
                    ["แล้ว", "und"],
                    ["เก้าอี้", "Stuhl"],
                    ["ตัวเก่า", "das alte Exemplar"],
                    ["ล่ะ", "und was ist mit"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3146,
                numberInStory: 6,
                thai: "ผมจะเปลี่ยนเป็นตัวใหม่ครับ",
                transliteration: "phǒm jà bplìan bpen dtua mài khráp",
                translation: "Ich werde ihn durch ein neues Stück ersetzen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["เปลี่ยน", "austauschen"],
                    ["เป็น", "zu / als"],
                    ["ตัวใหม่", "ein neues Stück"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3147,
                numberInStory: 7,
                thai: "ให้ผมช่วยยกของไหมครับ",
                transliteration: "hâi phǒm chûai yók khɔ̌ɔng mái khráp",
                translation: "Soll ich dir beim Tragen helfen?",
                tokenDefs: [
                    ["ให้", "soll / lassen"],
                    ["ผม", "ich"],
                    ["ช่วย", "helfen"],
                    ["ยกของ", "Sachen tragen"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3148,
                numberInStory: 8,
                thai: "ขอบคุณครับ จะช่วยได้เยอะเลย",
                transliteration: "khɔ̀ɔp-khun khráp jà chûai dâai yə́ ləəi",
                translation: "Danke, das wird sehr viel helfen!",
                tokenDefs: [
                    ["ขอบคุณ", "danke"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["จะ", "wird"],
                    ["ช่วยได้", "helfen können"],
                    ["เยอะ", "viel"],
                    ["เลย", "durchaus"]
                ]
            },
            {
                number: 3149,
                numberInStory: 9,
                thai: "ห้องจะดูกว้างขึ้นมาก",
                transliteration: "hɔ̂ɔng jà duu gwâang khʉ̂n mâak",
                translation: "Das Zimmer wird viel geräumiger wirken.",
                tokenDefs: [
                    ["ห้อง", "Zimmer"],
                    ["จะ", "wird"],
                    ["ดู", "wirken"],
                    ["กว้างขึ้น", "geräumiger"],
                    ["มาก", "sehr"]
                ]
            },
            {
                number: 3150,
                numberInStory: 10,
                thai: "ทำเสร็จแล้วจะชวนมากินข้าวนะ",
                transliteration: "tham sèt lɛ́ɛo jà chuan maa gin khâao ná",
                translation: "Wenn es fertig ist, lade ich dich zum Essen ein!",
                tokenDefs: [
                    ["ทำเสร็จ", "fertig machen"],
                    ["แล้ว", "danach"],
                    ["จะ", "werde"],
                    ["ชวน", "einladen"],
                    ["มา", "kommen"],
                    ["กินข้าว", "essen"],
                    ["นะ", "Hinweispartikel"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-16",
        title: "Mini-Story 16 — Unwohlsein & Arztbesuch (Sätze 3151–3160)",
        sentences: [
            {
                number: 3151,
                numberInStory: 1,
                thai: "วันนี้คุณดูไม่ค่อยสบายนะ",
                transliteration: "wan-níi khun duu mâi khɔ̂i sà-baai ná",
                translation: "Heute siehst du nicht sonderlich fit aus.",
                tokenDefs: [
                    ["วันนี้", "heute"],
                    ["คุณ", "du"],
                    ["ดู", "aussehen"],
                    ["ไม่ค่อย", "nicht sonderlich"],
                    ["สบาย", "wohlauf"],
                    ["นะ", "Partikel"]
                ]
            },
            {
                number: 3152,
                numberInStory: 2,
                thai: "ผมปวดหัวนิดหน่อยครับ",
                transliteration: "phǒm bpùat-hǔa nít-nɔ̀i khráp",
                translation: "Ich habe ein wenig Kopfschmerzen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["ปวดหัว", "Kopfschmerzen haben"],
                    ["นิดหน่อย", "ein bisschen"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3153,
                numberInStory: 3,
                thai: "คุณจะไปหาหมอไหมครับ",
                transliteration: "khun jà bpai hǎa mɔ̌ɔ mái khráp",
                translation: "Wirst du zum Arzt gehen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ไปหาหมอ", "zum Arzt gehen"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3154,
                numberInStory: 4,
                thai: "บ่ายนี้ผมจะไปคลินิกครับ",
                transliteration: "bàai níi phǒm jà bpai khlii-nìk khráp",
                translation: "Heute Nachmittag werde ich in die Praxis gehen.",
                tokenDefs: [
                    ["บ่ายนี้", "heute Nachmittag"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ไป", "gehen"],
                    ["คลินิก", "Praxis / Klinik"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3155,
                numberInStory: 5,
                thai: "คุณจะลางานช่วงบ่ายไหม",
                transliteration: "khun jà laa-ngaan chûang bàai mái",
                translation: "Wirst du dir für den Nachmittag freinehmen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ลางาน", "sich freinehmen"],
                    ["ช่วงบ่าย", "nachmittags"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3156,
                numberInStory: 6,
                thai: "ครับ ผมจะขอกลับก่อน",
                transliteration: "khráp phǒm jà khɔ̌ɔ glàp gɔ̀ɔn",
                translation: "Ja, ich werde darum bitten, früher gehen zu dürfen.",
                tokenDefs: [
                    ["ครับ", "ja"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ขอ", "bitten um"],
                    ["กลับก่อน", "früher nach Hause gehen"]
                ]
            },
            {
                number: 3157,
                numberInStory: 7,
                thai: "อย่าลืมกินยานะครับ",
                transliteration: "yàa lʉʉm gin yaa ná khráp",
                translation: "Vergiss nicht, Medizin zu nehmen!",
                tokenDefs: [
                    ["อย่า", "nicht"],
                    ["ลืม", "vergessen"],
                    ["กินยา", "Medizin nehmen"],
                    ["นะ", "Partikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3158,
                numberInStory: 8,
                thai: "ผมจะกินยาแล้วนอนพัก",
                transliteration: "phǒm jà gin yaa lɛ́ɛo nɔɔn-phák",
                translation: "Ich werde Medizin nehmen und mich ausruhen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["กินยา", "Medizin nehmen"],
                    ["แล้ว", "und dann"],
                    ["นอนพัก", "hinlegen und ausruhen"]
                ]
            },
            {
                number: 3159,
                numberInStory: 9,
                thai: "พักผ่อนเยอะๆ เดี๋ยวก็หายดี",
                transliteration: "phák-phɔ̀ɔn yə́-yə́ dǐao-gɔ̂ hǎai dii",
                translation: "Ruh dich viel aus, dann wird es bald wieder gut sein.",
                tokenDefs: [
                    ["พักผ่อน", "ausruhen"],
                    ["เยอะๆ", "viel"],
                    ["เดี๋ยวก็", "bald wird schon"],
                    ["หายดี", "vollständig genesen"]
                ]
            },
            {
                number: 3160,
                numberInStory: 10,
                thai: "พรุ่งนี้ผมจะดีขึ้นครับ",
                transliteration: "phrûng-níi phǒm jà dii khʉ̂n khráp",
                translation: "Morgen wird es mir besser gehen.",
                tokenDefs: [
                    ["พรุ่งนี้", "morgen"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ดีขึ้น", "besser werden"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-17",
        title: "Mini-Story 17 — Urlaubsreise mit dem Nachtzug (Sätze 3161–3170)",
        sentences: [
            {
                number: 3161,
                numberInStory: 1,
                thai: "ทริปนี้คุณจะไปเที่ยวไหน",
                transliteration: "thríp níi khun jà bpai-thîao nǎi",
                translation: "Wohin wirst du auf dieser Reise fahren?",
                tokenDefs: [
                    ["ทริปนี้", "diese Reise"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ไปเที่ยว", "verreisen"],
                    ["ไหน", "wohin"]
                ]
            },
            {
                number: 3162,
                numberInStory: 2,
                thai: "ผมจะไปเที่ยวเชียงใหม่ครับ",
                transliteration: "phǒm jà bpai-thîao Chiiang-mài khráp",
                translation: "Ich werde nach Chiang Mai reisen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ไปเที่ยว", "verreisen nach"],
                    ["เชียงใหม่", "Chiang Mai"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3163,
                numberInStory: 3,
                thai: "คุณจะเดินทางยังไงครับ",
                transliteration: "khun jà dəən-thaang yang-ngai khráp",
                translation: "Wie wirst du reisen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["เดินทาง", "reisen"],
                    ["ยังไง", "wie"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3164,
                numberInStory: 4,
                thai: "ผมจะนั่งรถไฟด่วนไปครับ",
                transliteration: "phǒm jà nâng rót-fai dùan bpai khráp",
                translation: "Ich werde mit dem Expresszug fahren.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["นั่ง", "mitfahren"],
                    ["รถไฟด่วน", "Expresszug"],
                    ["ไป", "fahren / hin"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3165,
                numberInStory: 5,
                thai: "รถไฟจะออกจากสถานีกี่โมง",
                transliteration: "rót-fai jà ɔ̀ɔk jàak sà-thǎa-nii gìi moong",
                translation: "Um wie viel Uhr fährt der Zug vom Bahnhof ab?",
                tokenDefs: [
                    ["รถไฟ", "Zug"],
                    ["จะ", "wird"],
                    ["ออกจาก", "abfahren von"],
                    ["สถานี", "Bahnhof"],
                    ["กี่โมง", "um wie viel Uhr"]
                ]
            },
            {
                number: 3166,
                numberInStory: 6,
                thai: "รถไฟจะออกตอนสองทุ่มครับ",
                transliteration: "rót-fai jà ɔ̀ɔk dtaawn sɔ̌ɔng thûm khráp",
                translation: "Der Zug fährt um 20:00 Uhr ab.",
                tokenDefs: [
                    ["รถไฟ", "Zug"],
                    ["จะ", "wird"],
                    ["ออก", "abfahren"],
                    ["ตอน", "um"],
                    ["สองทุ่ม", "20:00 Uhr"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3167,
                numberInStory: 7,
                thai: "คุณจะจองตั๋วไว้ล่วงหน้าไหม",
                transliteration: "khun jà jɔɔng dtǔa wái lûang-nâa mái",
                translation: "Wirst du das Ticket im Voraus buchen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["จองตั๋ว", "Ticket buchen"],
                    ["ไว้", "vorsorglich"],
                    ["ล่วงหน้า", "im Voraus"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3168,
                numberInStory: 8,
                thai: "ผมจะจองผ่านแอปวันนี้",
                transliteration: "phǒm jà jɔɔng phàan ɛ́ɛp wan-níi",
                translation: "Ich werde es heute über die App buchen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["จอง", "buchen"],
                    ["ผ่าน", "über / per"],
                    ["แอป", "App"],
                    ["วันนี้", "heute"]
                ]
            },
            {
                number: 3169,
                numberInStory: 9,
                thai: "รถไฟจะถึงตอนเช้าพอดี",
                transliteration: "rót-fai jà thʉ̌ng dtaawn cháo phɔɔ-dii",
                translation: "Der Zug wird genau morgens ankommen.",
                tokenDefs: [
                    ["รถไฟ", "Zug"],
                    ["จะ", "wird"],
                    ["ถึง", "ankommen"],
                    ["ตอนเช้า", "morgens"],
                    ["พอดี", "genau passend"]
                ]
            },
            {
                number: 3170,
                numberInStory: 10,
                thai: "น่าจะเป็นทริปที่ยอดเยี่ยม",
                transliteration: "nâa-jà bpen thríp thîi yɔ̂ɔt-yîam",
                translation: "Das wird bestimmt eine fantastische Reise!",
                tokenDefs: [
                    ["น่าจะ", "wird bestimmt"],
                    ["เป็น", "sein"],
                    ["ทริป", "Reise"],
                    ["ที่", "welche"],
                    ["ยอดเยี่ยม", "großartig"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-18",
        title: "Mini-Story 18 — Thai-Prüfung & Fleißiges Lernen (Sätze 3171–3180)",
        sentences: [
            {
                number: 3171,
                numberInStory: 1,
                thai: "เดือนหน้าคุณจะสอบภาษาไทยไหม",
                transliteration: "dʉan-nâa khun jà sɔ̀ɔp phaa-sǎa thai mái",
                translation: "Wirst du nächsten Monat die Thai-Prüfung ablegen?",
                tokenDefs: [
                    ["เดือนหน้า", "nächster Monat"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["สอบ", "Prüfung machen"],
                    ["ภาษาไทย", "Thaisprache"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3172,
                numberInStory: 2,
                thai: "สอบครับ ผมจะตั้งใจอ่านหนังสือ",
                transliteration: "sɔ̀ɔp khráp phǒm jà dtâng-jai àan nǎng-sʉ̌ʉ",
                translation: "Ja! Ich werde aufmerksam lernen.",
                tokenDefs: [
                    ["สอบ", "Prüfung machen"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ตั้งใจ", "aufmerksam / zielstrebig"],
                    ["อ่านหนังสือ", "lernen / lesen"]
                ]
            },
            {
                number: 3173,
                numberInStory: 3,
                thai: "คุณจะฝึกพูดทุกวันไหม",
                transliteration: "khun jà fʉ̀k phûut thúk wan mái",
                translation: "Wirst du jeden Tag sprechen üben?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ฝึกพูด", "sprechen üben"],
                    ["ทุกวัน", "jeden Tag"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3174,
                numberInStory: 4,
                thai: "ผมจะฝึกวันละหนึ่งชั่วโมง",
                transliteration: "phǒm jà fʉ̀k wan-lá nʉ̀ng chûa-moong",
                translation: "Ich werde eine Stunde pro Tag üben.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ฝึก", "üben"],
                    ["วันละ", "pro Tag"],
                    ["หนึ่งชั่วโมง", "eine Stunde"]
                ]
            },
            {
                number: 3175,
                numberInStory: 5,
                thai: "การสอบจะยากมากไหมครับ",
                transliteration: "gaan-sɔ̀ɔp jà yâak mâak mái khráp",
                translation: "Wird die Prüfung sehr schwer sein?",
                tokenDefs: [
                    ["การสอบ", "die Prüfung"],
                    ["จะ", "wird"],
                    ["ยาก", "schwer"],
                    ["มาก", "sehr"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3176,
                numberInStory: 6,
                thai: "ถ้าเราขยัน เราจะสอบผ่าน",
                transliteration: "thâa rao khà-yǎn rao jà sɔ̀ɔp-phàan",
                translation: "Wenn wir fleißig sind, werden wir die Prüfung bestehen.",
                tokenDefs: [
                    ["ถ้า", "wenn"],
                    ["เรา", "wir"],
                    ["ขยัน", "fleißig"],
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["สอบผ่าน", "Prüfung bestehen"]
                ]
            },
            {
                number: 3177,
                numberInStory: 7,
                thai: "ผมจะช่วยติวให้คุณเอง",
                transliteration: "phǒm jà chûai dtiu hâi khun eeng",
                translation: "Ich werde dir persönlich beim Nachhilfe-Üben helfen.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ช่วย", "helfen"],
                    ["ติว", "Nachhilfe geben"],
                    ["ให้", "für"],
                    ["คุณ", "dich"],
                    ["เอง", "selbst"]
                ]
            },
            {
                number: 3178,
                numberInStory: 8,
                thai: "ขอบคุณครับ ผมจะไม่ยอมแพ้",
                transliteration: "khɔ̀ɔp-khun khráp phǒm jà-mâi yɔɔm-phɛ́ɛ",
                translation: "Danke! Ich werde nicht aufgeben.",
                tokenDefs: [
                    ["ขอบคุณ", "danke"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะไม่", "werde nicht"],
                    ["ยอมแพ้", "aufgeben"]
                ]
            },
            {
                number: 3179,
                numberInStory: 9,
                thai: "ภาษาไทยของคุณจะเก่งขึ้นเร็วมาก",
                transliteration: "phaa-sǎa thai khɔ̌ɔng khun jà gèng khʉ̂n reo mâak",
                translation: "Dein Thai wird sehr schnell besser werden.",
                tokenDefs: [
                    ["ภาษาไทย", "Thaisprache"],
                    ["ของ", "von"],
                    ["คุณ", "dir"],
                    ["จะ", "wird"],
                    ["เก่งขึ้น", "besser werden"],
                    ["เร็วมาก", "sehr schnell"]
                ]
            },
            {
                number: 3180,
                numberInStory: 10,
                thai: "เราจะผ่านไปด้วยกันครับ",
                transliteration: "rao jà phàan bpai dûai-gan khráp",
                translation: "Wir werden es zusammen schaffen!",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["ผ่าน", "bestehen"],
                    ["ไปด้วยกัน", "zusammen vorangehen"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-19",
        title: "Mini-Story 19 — Geburtstagsgeschenk & Feier (Sätze 3181–3190)",
        sentences: [
            {
                number: 3181,
                numberInStory: 1,
                thai: "วันเกิดเพื่อน คุณจะให้อะไรครับ",
                transliteration: "wan-gə̀ət phʉ̂an khun jà hâi à-rai khráp",
                translation: "Was wirst du deinem Freund zum Geburtstag schenken?",
                tokenDefs: [
                    ["วันเกิด", "Geburtstag"],
                    ["เพื่อน", "Freund"],
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ให้", "schenken"],
                    ["อะไร", "was"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3182,
                numberInStory: 2,
                thai: "ผมจะซื้อเสื้อสวยๆ ให้ครับ",
                transliteration: "phǒm jà sʉ́ʉ sʉ̂a sǔai-sǔai hâi khráp",
                translation: "Ich werde ihm ein schönes Shirt schenken.",
                tokenDefs: [
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ซื้อ", "kaufen"],
                    ["เสื้อ", "Shirt"],
                    ["สวยๆ", "schön"],
                    ["ให้", "für / schenken"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3183,
                numberInStory: 3,
                thai: "คุณจะไปเลือกซื้อที่ไหน",
                transliteration: "khun jà bpai lʉ̂ak sʉ́ʉ thîi-nǎi",
                translation: "Wo wirst du es aussuchen gehen?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะ", "wirst"],
                    ["ไป", "gehen"],
                    ["เลือกซื้อ", "aussuchen und kaufen"],
                    ["ที่ไหน", "wo"]
                ]
            },
            {
                number: 3184,
                numberInStory: 4,
                thai: "เย็นนี้จะไปห้างสรรพสินค้าครับ",
                transliteration: "yen níi jà bpai hâang-sàp-phá-sǐn-kháa khráp",
                translation: "Heute Abend werde ich ins Kaufhaus gehen.",
                tokenDefs: [
                    ["เย็นนี้", "heute Abend"],
                    ["จะ", "werde"],
                    ["ไป", "gehen"],
                    ["ห้างสรรพสินค้า", "Kaufhaus"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3185,
                numberInStory: 5,
                thai: "เพื่อนจะชอบสีอะไรครับ",
                transliteration: "phʉ̂an jà chɔ̂ɔp sǐi à-rai khráp",
                translation: "Welche Farbe wird dein Freund mögen?",
                tokenDefs: [
                    ["เพื่อน", "Freund"],
                    ["จะ", "wird"],
                    ["ชอบ", "mögen"],
                    ["สี", "Farbe"],
                    ["อะไร", "welche"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3186,
                numberInStory: 6,
                thai: "เขาน่าจะชอบสีน้ำเงิน",
                transliteration: "kǎo nâa-jà chɔ̂ɔp sǐi náam-ngən",
                translation: "Er mag wahrscheinlich Blau.",
                tokenDefs: [
                    ["เขา", "er"],
                    ["น่าจะ", "dürfte wohl"],
                    ["ชอบ", "mögen"],
                    ["สีน้ำเงิน", "dunkelblau"]
                ]
            },
            {
                number: 3187,
                numberInStory: 7,
                thai: "เราจะจัดงานเลี้ยงไหมครับ",
                transliteration: "rao jà jàt ngaan-lían mái khráp",
                translation: "Werden wir eine Feier veranstalten?",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["จัด", "ausrichten"],
                    ["งานเลี้ยง", "Feier / Party"],
                    ["ไหม", "Fragepartikel"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            },
            {
                number: 3188,
                numberInStory: 8,
                thai: "เราจะจัดงานเล็กๆ ที่บ้าน",
                transliteration: "rao jà jàt ngaan lék-lék thîi bâan",
                translation: "Wir werden eine kleine Feier zu Hause machen.",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["จัดงาน", "eine Feier ausrichten"],
                    ["เล็กๆ", "klein"],
                    ["ที่บ้าน", "zu Hause"]
                ]
            },
            {
                number: 3189,
                numberInStory: 9,
                thai: "ทุกคนจะมาพร้อมหน้ากัน",
                transliteration: "thúk khon jà maa phrɔ́ɔm-nâa gan",
                translation: "Alle werden zusammenkommen.",
                tokenDefs: [
                    ["ทุกคน", "jeder / alle"],
                    ["จะ", "werden"],
                    ["มา", "kommen"],
                    ["พร้อมหน้ากัน", "in versammelter Runde"]
                ]
            },
            {
                number: 3190,
                numberInStory: 10,
                thai: "เพื่อนจะประทับใจแน่นอน",
                transliteration: "phʉ̂an jà bprà-tháp-jai nɛ̂ɛ-nɔɔn",
                translation: "Der Freund wird sicher begeistert sein.",
                tokenDefs: [
                    ["เพื่อน", "Freund"],
                    ["จะ", "wird"],
                    ["ประทับใจ", "beeindruckt sein"],
                    ["แน่นอน", "ganz sicher"]
                ]
            }
        ]
    },
    {
        id: "level-1-boss-7-story-20",
        title: "Mini-Story 20 — Nächste Schritte & Meisterschaft (Sätze 3191–3200)",
        sentences: [
            {
                number: 3191,
                numberInStory: 1,
                thai: "ตอนนี้คุณพร้อมจะก้าวต่อไปไหม",
                transliteration: "dtaawn-níi khun phrɔ́ɔm jà gâao dtɔ̀ɔ-bpai mái",
                translation: "Bist du jetzt bereit, weiter voranzuschreiten?",
                tokenDefs: [
                    ["ตอนนี้", "jetzt"],
                    ["คุณ", "du"],
                    ["พร้อม", "bereit"],
                    ["จะ", "zu"],
                    ["ก้าวต่อไป", "den nächsten Schritt machen"],
                    ["ไหม", "Fragepartikel"]
                ]
            },
            {
                number: 3192,
                numberInStory: 2,
                thai: "พร้อมแล้วครับ ผมจะตั้งใจต่อไป",
                transliteration: "phrɔ́ɔm lɛ́ɛo khráp phǒm jà dtâng-jai dtɔ̀ɔ-bpai",
                translation: "Bereit! Ich werde mich weiter bemühen.",
                tokenDefs: [
                    ["พร้อมแล้ว", "bereit"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะ", "werde"],
                    ["ตั้งใจ", "zielstrebig sein"],
                    ["ต่อไป", "weiterhin"]
                ]
            },
            {
                number: 3193,
                numberInStory: 3,
                thai: "เราจะเรียนรู้อะไรใหม่ๆ อีก",
                transliteration: "rao jà rian-rúu à-rai mài-mài ìik",
                translation: "Was werden wir noch alles Neues lernen?",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["เรียนรู้", "lernen"],
                    ["อะไรใหม่ๆ", "Neues"],
                    ["อีก", "noch"]
                ]
            },
            {
                number: 3194,
                numberInStory: 4,
                thai: "เราจะได้คุยกับคนไทยคล่องขึ้น",
                transliteration: "rao jà dâai khui gàp khon thai khlɔ̂ng khʉ̂n",
                translation: "Wir werden flüssiger mit Thais sprechen können.",
                tokenDefs: [
                    ["เรา", "wir"],
                    ["จะได้", "werden können"],
                    ["คุย", "sprechen"],
                    ["กับ", "mit"],
                    ["คนไทย", "Thailändern"],
                    ["คล่องขึ้น", "flüssiger"]
                ]
            },
            {
                number: 3195,
                numberInStory: 5,
                thai: "คุณจะไม่กลัวการพูดแล้วใช่ไหม",
                transliteration: "khun jà-mâi glua gaan-phûut lɛ́ɛo châi mái",
                translation: "Du wirst keine Angst mehr vor dem Sprechen haben, oder?",
                tokenDefs: [
                    ["คุณ", "du"],
                    ["จะไม่", "wirst nicht"],
                    ["กลัว", "Angst haben"],
                    ["การพูด", "das Sprechen"],
                    ["แล้ว", "mehr"],
                    ["ใช่ไหม", "nicht wahr?"]
                ]
            },
            {
                number: 3196,
                numberInStory: 6,
                thai: "ใช่ครับ ผมจะไม่กลัวอีกต่อไป",
                transliteration: "châi khráp phǒm jà-mâi glua ìik dtɔ̀ɔ-bpai",
                translation: "Genau! Ich werde mich nicht mehr fürchten.",
                tokenDefs: [
                    ["ใช่", "ja"],
                    ["ครับ", "Höflichkeitspartikel (m)"],
                    ["ผม", "ich"],
                    ["จะไม่", "werde nicht"],
                    ["กลัว", "fürchten"],
                    ["อีกต่อไป", "mehr in Zukunft"]
                ]
            },
            {
                number: 3197,
                numberInStory: 7,
                thai: "เป้าหมายของเราจะสำเร็จแน่นอน",
                transliteration: "bpâo-mǎai khɔ̌ɔng rao jà sǎm-rèt nɛ̂ɛ-nɔɔn",
                translation: "Unser Ziel wird ganz sicher erreicht werden.",
                tokenDefs: [
                    ["เป้าหมาย", "Ziel"],
                    ["ของ", "von"],
                    ["เรา", "uns"],
                    ["จะ", "wird"],
                    ["สำเร็จ", "gelingen"],
                    ["แน่นอน", "ganz sicher"]
                ]
            },
            {
                number: 3198,
                numberInStory: 8,
                thai: "ขอบคุณที่ฝึกฝนด้วยกันเสมอ",
                transliteration: "khɔ̀ɔp-khun thîi fʉ̀k-fǒn dûai-gan sà-mə̌ə",
                translation: "Danke, dass du immer mit mir übst!",
                tokenDefs: [
                    ["ขอบคุณ", "danke"],
                    ["ที่", "dass"],
                    ["ฝึกฝน", "trainieren"],
                    ["ด้วยกัน", "zusammen"],
                    ["เสมอ", "immer"]
                ]
            },
            {
                number: 3199,
                numberInStory: 9,
                thai: "บล็อกหน้าเราจะลุยกันต่อนะ",
                transliteration: "blɔ́k nâa rao jà lui gan-dtɔ̀ɔ ná",
                translation: "Im nächsten Block legen wir direkt weiter los!",
                tokenDefs: [
                    ["บล็อกหน้า", "im nächsten Block"],
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["ลุย", "loslegen"],
                    ["กันต่อ", "zusammen weiter"],
                    ["นะ", "Hinweispartikel"]
                ]
            },
            {
                number: 3200,
                numberInStory: 10,
                thai: "สู้ๆ เราจะเก่งขึ้นทุกวันครับ",
                transliteration: "sûu-sûu rao jà gèng khʉ̂n thúk wan khráp",
                translation: "Kämpfen! Wir werden jeden Tag besser!",
                tokenDefs: [
                    ["สู้ๆ", "kämpfen"],
                    ["เรา", "wir"],
                    ["จะ", "werden"],
                    ["เก่งขึ้น", "besser werden"],
                    ["ทุกวัน", "jeden Tag"],
                    ["ครับ", "Höflichkeitspartikel (m)"]
                ]
            }
        ]
    }
];

// Transform rawStories into structured miniStories and sampleSentences
const sampleSentences = [];
const miniStories = [];
let unmappedTokens = [];

rawStories.forEach(st => {
    const existingStory = prodStoriesById.get(st.id);
    const storyObj = {
        id: st.id,
        title: st.title,
        ...(existingStory?.speakers
            ? { speakers: existingStory.speakers.map(speaker => ({ ...speaker })) }
            : {}),
        sentences: []
    };

    st.sentences.forEach(s => {
        const existingSentence = existingStory?.sentences?.find(
            sentence => sentence.number === s.number
        );
        const tokens = s.tokenDefs.map((def, tIdx) => {
            const text = def[0];
            const contextMeaning = def[1];
            const wordId = resolveWordId(text);
            if (!wordId) {
                unmappedTokens.push({ sentence: s.number, text });
            }
            return {
                id: `t${tIdx + 1}`,
                text: text,
                kind: "word",
                wordId: wordId || `missing-${text}`,
                contextMeaning: contextMeaning
            };
        });

        const sentObj = {
            number: s.number,
            numberInStory: s.numberInStory,
            thai: s.thai,
            transliteration: s.transliteration,
            translation: s.translation,
            audio: existingSentence?.audio || { type: "speechSynthesis" },
            ...(existingSentence?.speakerId
                ? { speakerId: existingSentence.speakerId }
                : {}),
            tokens: tokens
        };

        storyObj.sentences.push(sentObj);
        sampleSentences.push(sentObj);
    });

    miniStories.push(storyObj);
});

if (unmappedTokens.length > 0) {
    console.error("Unmapped tokens found:", unmappedTokens);
} else {
    console.log("All tokens resolved successfully!");
}

// Full Staging Object
const finalStagingData = {
    staging: {
        type: "giga-drill",
        source: "Gemini",
        model: "Gemini 3.7 Flash",
        createdAt: new Date().toISOString(),
        target: "Grammar Boss 7 · Block 2",
        sentenceRange: "3101–3200",
        status: "AWAITING HUMAN APPROVAL 👤"
    },
    topic: "จะ · Zukunft & Absichten",
    introduction: {
        description: "In Block 2 vertiefst du Vorhaben und Absichten mit จะ: Von Wenn-Bedingungen (ถ้า...จะ...), über Vermutungen (น่าจะ) bis hin zu festen Zusagen (สัญญาว่าจะ...), Reise- und Alltagsplänen.",
        example: {
            thai: "ถ้าฝนตก ผมจะอยู่บ้านครับ",
            transliteration: "thâa fǒn-dtòk phǒm jà yùu-bâan khráp",
            translation: "Wenn es regnet, werde ich zu Hause bleiben."
        },
        parts: [
            { thai: "ถ้า", transliteration: "thâa", translation: "wenn" },
            { thai: "ฝนตก", transliteration: "fǒn-dtòk", translation: "es regnet" },
            { thai: "ผม", transliteration: "phǒm", translation: "ich" },
            { thai: "จะ", transliteration: "jà", translation: "werde" },
            { thai: "อยู่บ้าน", transliteration: "yùu-bâan", translation: "zu Hause bleiben" }
        ],
        assembly: {
            thai: "ถ้าฝนตก + ผม + จะ + อยู่บ้าน",
            transliteration: "thâa fǒn-dtòk + phǒm + jà + yùu-bâan",
            translation: "Wenn es regnet + ich + werde + zu Hause bleiben"
        },
        warning: "Konditionale Sätze bilden im Thai: ถ้า [Bedingung] + Subjekt + จะ [Aktion]. Für Vermutungen sagst du น่าจะ + Verb (น่าจะสนุก = dürfte Spaß machen)."
    },
    midpointReminder: {
        title: "💎 REMINDER · SÄTZE 3101–3150",
        message: "Konditionale Pläne (ถ้า...จะ...), Vermutungen (น่าจะ) & Feste Zusagen (สัญญาว่าจะ...)",
        lead: "Was du in den ersten 50 Sätzen von Block 2 gelernt hast",
        sections: [
            {
                title: "Neue Wörter (Sätze 3101–3150)",
                words: [
                    { thai: "ถ้า", transliteration: "thâa", translation: "wenn / falls" },
                    { thai: "ฝนตก", transliteration: "fǒn-dtòk", translation: "es regnet" },
                    { thai: "อยู่บ้าน", transliteration: "yùu-bâan", translation: "zu Hause bleiben" },
                    { thai: "ร่ม", transliteration: "rôm", translation: "Regenschirm" },
                    { thai: "ฟิตเนส", transliteration: "fít-nèet", translation: "Fitnessstudio" },
                    { thai: "ออกกำลังกาย", transliteration: "ɔ̀ɔk-gam-lang-gaai", translation: "trainieren" },
                    { thai: "น่าจะ", transliteration: "nâa-jà", translation: "dürfte wohl / wahrscheinlich" },
                    { thai: "สาย", transliteration: "sǎai", translation: "zu spät kommen" },
                    { thai: "ผัดไทย", transliteration: "phàt-thai", translation: "Pad Thai" },
                    { thai: "สัญญา", transliteration: "sǎn-yaa", translation: "versprechen" },
                    { thai: "ทัน", transliteration: "than", translation: "rechtzeitig" },
                    { thai: "จัด", transliteration: "jàt", translation: "einrichten / aufräumen" },
                    { thai: "ห้องนอน", transliteration: "hɔ̂ɔng-nɔɔn", translation: "Schlafzimmer" },
                    { thai: "โต๊ะทำงาน", transliteration: "dtó tham-ngaan", translation: "Schreibtisch" },
                    { thai: "เปลี่ยน", transliteration: "bplìan", translation: "wechseln / austauschen" }
                ],
                note: "Mit ถ้า leitest du Bedingungen ein, auf die im Hauptsatz จะ folgt. สัญญาว่าจะ drückt verbindliche Versprechen aus."
            }
        ],
        patternLead: "Wichtiges Konditional- & Absichtsmuster",
        pattern: {
            thai: "ถ้าฝนตก ผมจะอยู่บ้านครับ",
            transliteration: "thâa fǒn-dtòk phǒm jà yùu-bâan khráp",
            translation: "Wenn es regnet, werde ich zu Hause bleiben."
        },
        discoveries: [
            {
                thai: "ผมสัญญาว่าจะไม่ลืมครับ",
                transliteration: "phǒm sǎn-yaa wâa jà-mâi lʉʉm khráp",
                translation: "Ich verspreche, dass ich es nicht vergessen werde."
            },
            {
                thai: "เหนื่อยแต่น่าจะสนุกครับ",
                transliteration: "nʉ̀ai dtɛ̀ɛ nâa-jà sà-nùk khráp",
                translation: "Erschöpft, aber es wird wahrscheinlich Spaß machen."
            }
        ],
        closing: "Du beherrschst nun Wenn-Dann-Pläne, Vermutungen mit น่าจะ und klare Versprechen auf Thailändisch."
    },
    completion: {
        title: "🏆 3200 / 3500 · FOUNDATION BLOCK 2 COMPLETE",
        sentenceRange: "3101–3200",
        progress: "Alltags- & Zukunftsentscheidungen: Arztbesuche (หาหมอ), Fernreisen (รถไฟด่วน), Prüfungen (สอบผ่าน), Feiern (งานเลี้ยง) & Meisterschaft (สำเร็จ)",
        sections: [
            {
                title: "Neue Wörter (Sätze 3151–3200)",
                words: [
                    { thai: "ไปหาหมอ", transliteration: "bpai hǎa mɔ̌ɔ", translation: "zum Arzt gehen" },
                    { thai: "คลินิก", transliteration: "khlii-nìk", translation: "Arztpraxis" },
                    { thai: "ลางาน", transliteration: "laa-ngaan", translation: "sich freinehmen" },
                    { thai: "กินยา", transliteration: "gin yaa", translation: "Medizin nehmen" },
                    { thai: "หายดี", transliteration: "hǎai dii", translation: "genesen" },
                    { thai: "เชียงใหม่", transliteration: "Chiiang-mài", translation: "Chiang Mai" },
                    { thai: "รถไฟด่วน", transliteration: "rót-fai dùan", translation: "Expresszug" },
                    { thai: "สถานี", transliteration: "sà-thǎa-nii", translation: "Bahnhof" },
                    { thai: "จองตั๋ว", transliteration: "jɔɔng dtǔa", translation: "Ticket reservieren" },
                    { thai: "สอบ", transliteration: "sɔ̀ɔp", translation: "Prüfung ablegen" },
                    { thai: "ตั้งใจ", transliteration: "dtâng-jai", translation: "zielstrebig lernen" },
                    { thai: "ขยัน", transliteration: "khà-yǎn", translation: "fleißig" },
                    { thai: "สอบผ่าน", transliteration: "sɔ̀ɔp-phàan", translation: "Prüfung bestehen" },
                    { thai: "ยอมแพ้", transliteration: "yɔɔm-phɛ́ɛ", translation: "aufgeben" },
                    { thai: "วันเกิด", transliteration: "wan-gə̀ət", translation: "Geburtstag" },
                    { thai: "งานเลี้ยง", transliteration: "ngaan-lían", translation: "Feier" },
                    { thai: "เป้าหมาย", transliteration: "bpâo-mǎai", translation: "Ziel" },
                    { thai: "สำเร็จ", transliteration: "sǎm-rèt", translation: "Erfolg haben" }
                ],
                note: "Souverän Zukunftsszenarien meistern, Termine koordinieren und Zukunftsziele mit Entschlossenheit formulieren."
            }
        ],
        questionLead: "Zentrales Zukunfts- & Ermutigungsmuster",
        question: {
            thai: "ถ้าเราขยัน เราจะสอบผ่านไหม",
            transliteration: "thâa rao khà-yǎn rao jà sɔ̀ɔp-phàan mái",
            translation: "Wenn wir fleißig sind, werden wir die Prüfung bestehen?"
        },
        answerLead: "Echte Reaktion",
        answer: {
            thai: "สอบผ่านแน่นอนครับ เราจะไม่ยอมแพ้",
            transliteration: "sɔ̀ɔp-phàan nɛ̂ɛ-nɔɔn khráp rao jà-mâi yɔɔm-phɛ́ɛ",
            translation: "Ganz sicher bestehen! Wir werden nicht aufgeben."
        },
        closing: "3.200 Sätze: Du meisterst Zukunftspläne, Reisevorbereitungen, Vorsätze und Alltagsentscheidungen auf echtem Thai-Niveau."
    },
    vocabulary: newVocab,
    miniStories: miniStories,
    sampleSentences: sampleSentences
};

// Ensure directory exists
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

// Write JSON file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalStagingData, null, 2), "utf8");
console.log(`Generated ${OUTPUT_FILE} successfully with ${sampleSentences.length} sentences and ${newVocab.length} vocabulary items.`);
