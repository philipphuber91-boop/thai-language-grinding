#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const WORDS_FILE = path.join(ROOT, "data/thailand-quiz-words.js");
const { auditQuiz } = require("./quiz-vocabulary-pipeline.js");
const { analyze, applyTone } = require("./thai-tone-engine.js");

const manualSyllables = {
    "ตราด": [["ตราด", "traat"]],
    "ธาร": [["ธาร", "thaan"]],
    "บีเรีย": [["บี", "bii"], ["เรีย", "ria"]],
    "อาหรับ": [["อา", "aa"], ["หรับ", "rap"]],
    "ข่าน": [["ข่าน", "khaan"]],
    "เหล่า": [["เหล่า", "lao"]],
    "เลย์": [["เลย์", "lee"]],
    "เชียงคาน": [["เชียง", "chiang"], ["คาน", "khaan"]],
    "จักรี": [["จัก", "chak"], ["รี", "rii"]],
    "พุทธศักราช": [["พุทธ", "phut"], ["ศัก", "sak"], ["ราช", "raat"]],
    "ศักราช": [["ศัก", "sak"], ["ราช", "raat"]],
    "เอ": [["เอ", "ee"]],
    "โดะ": [["โดะ", "do"]],
    "ไวกิง": [["ไวกิง", "wai king"]],
    "ทูต": [["ทูต", "thuut"]],
    "แตงกวา": [["แตง", "dtaeng"], ["กวา", "gwaa"]],
    "เกี๊ยว": [["เกี๊ยว", "kiao"]],
    "เกรียบ": [["เกรียบ", "kriap"]],
    "พุดดิ้ง": [["พุด", "phut"], ["ดิ้ง", "ding"]],
    "แห้ว": [["แห้ว", "haeo"]],
    "เมี่ยง": [["เมี่ยง", "miang"]],
    "ตะกร้า": [["ตะ", "ta"], ["กร้า", "graa"]],
    "ปาล์ม": [["ปาล์ม", "paam"]],
    "บ่อ": [["บ่อ", "bɔɔ"]],
    "เตี้ย": [["เตี้ย", "tia"]],
    "ลิเก": [["ลิ", "li"], ["เก", "kee"]],
    "ชัน": [["ชัน", "chan"]],
    "ซ่อน": [["ซ่อน", "sɔɔn"]],
    "แหวน": [["แหวน", "waen"]],
    "ปล่อง": [["ปล่อง", "plɔɔng"]],
    "เกล็ด": [["เกล็ด", "glet"]],
    "ขั้ว": [["ขั้ว", "khua"]],
    "หมี": [["หมี", "mii"]],
    "ปา": [["ปา", "paa"]],
    "ลามา": [["ลา", "laa"], ["มา", "maa"]],
    "สมเสร็จ": [["สม", "som"], ["เสร็จ", "set"]],
    "เงือก": [["เงือก", "ngʉak"]],
    "จะงอย": [["จะ", "cha"], ["งอย", "ngoi"]],
    "กวาง": [["กวาง", "gwaang"]],
    "นิ่ม": [["นิ่ม", "nim"]],
    "ผีเสื้อ": [["ผี", "phii"], ["เสื้อ", "sʉa"]],
    "วางไข่": [["วาง", "waang"], ["ไข่", "khai"]],
    "หลุม": [["หลุม", "lum"]],
    "บ่อน้ำ": [["บ่อ", "bɔɔ"], ["น้ำ", "naam"]],
    "หัก": [["หัก", "hak"]],
    "ละลาย": [["ละ", "la"], ["ลาย", "laai"]],
    "ลุ่ม": [["ลุ่ม", "lum"]],
    "ทลาย": [["ท", "tha"], ["ลาย", "laai"]],
    "หอย": [["หอย", "hɔɔi"]],
    "เกสร": [["เก", "gee"], ["สร", "sɔɔn"]],
    "ดัก": [["ดัก", "dak"]],
    "หิ่งห้อย": [["หิ่ง", "hing"], ["ห้อย", "hɔɔi"]],
    "เชื่อง": [["เชื่อง", "chʉang"]],
    "ใย": [["ใย", "yai"]],
    "กัก": [["กัก", "gak"]],
    "พัง": [["พัง", "phang"]],
    "ฮอกกี้": [["ฮอก", "hɔk"], ["กี้", "kii"]],
    "ยิง": [["ยิง", "ying"]],
    "ชั่วคราว": [["ชั่ว", "chua"], ["คราว", "khraao"]],
    "จดจ่อ": [["จด", "jot"], ["จ่อ", "jɔɔ"]],
    "เว้น": [["เว้น", "wen"]],
    "คั่น": [["คั่น", "khan"]],
    "เกร็ด": [["เกร็ด", "gret"]],
    "ชื้น": [["ชื้น", "chʉn"]],
    "ลืม": [["ลืม", "lʉʉm"]],
    "ขิม": [["ขิม", "khim"]],
    "เขย่า": [["เข", "khao"], ["ย่า", "yaa"]],
    "อิสลาม": [["อิ", "i"], ["ส", "sa"], ["ลาม", "laam"]],
    "เอโดะ": [["เอ", "ee"], ["โดะ", "do"]],
    "กริยา": [["กริ", "kri"], ["ยา", "yaa"]]
};

const meaningOverrides = {
    "ตราด": "Trat (Provinz)",
    "ลำปาง": "Lampang (Provinz)",
    "เชียงคาน": "Chiang Khan",
    "จักรี": "Chakri",
    "ราชวงศ์": "Dynastie",
    "พุทธศักราช": "buddhistische Jahreszählung",
    "ศักราช": "Jahreszählung",
    "อาณานิคม": "Kolonie",
    "ทูต": "Diplomat",
    "ประนีประนอม": "Kompromiss",
    "ไส้กรอก": "Wurst",
    "ขนมครก": "Kokos-Reis-Pfannküchlein",
    "โรตี": "Roti; dünner Pfannkuchen",
    "สายไหม": "Zuckerwatte",
    "ข้าวยำ": "südthailändischer Kräuter-Reis-Salat",
    "หนุ่ม": "junger Mann",
    "เมี่ยง": "kleiner Happen in einem Blatt",
    "ยกพื้น": "auf Stelzen erhöht",
    "ผลก": "Wortteil in ผลกระทบ",
    "ของใช้": "Gebrauchsgegenstand",
    "ตะกร้า": "Korb",
    "ศาลา": "Pavillon",
    "พบปะ": "sich treffen",
    "เส้นใย": "Faser",
    "ประติมากรรม": "Skulptur",
    "โนรา": "Nora-Tanztheater",
    "ขันโตก": "niedriger Esstisch aus Nordthailand",
    "บายศรี": "Bai-Sri-Segensarrangement",
    "ลิเก": "volkstümliches Thai-Theater",
    "แต่งงาน": "heiraten; Hochzeit",
    "สมเสร็จ": "Tapir",
    "จะงอย": "Schnabel",
    "กวาง": "Hirsch",
    "ผีเสื้อ": "Schmetterling",
    "หิ่งห้อย": "Glühwürmchen",
    "ขิม": "Khim; Hackbrett",
    "ระนาด": "Ranat; Xylophon",
    "แคน": "Khaen; Mundorgel",
    "พิณ": "Phin; Zupfinstrument",
    "หมอลำ": "Mor Lam; Musik aus dem Isan",
    "ลำโพง": "Lautsprecher",
    "เจดีย์": "Chedi; Stupa",
    "สารีริกธาตุ": "Reliquien",
    "บวช": "ordinieren; Mönch werden",
    "ชั่วคราว": "vorübergehend",
    "ธรรมะ": "Dhamma; buddhistische Lehre",
    "คณะสงฆ์": "buddhistische Mönchsgemeinschaft",
    "วรรณยุกต์": "Tonzeichen; Ton",
    "ลักษณนาม": "Zählwort; Klassifikator",
    "กริยา": "Verb",
    "ขยาย": "beschreiben; erweitern",
    "พิมาย": "Phimai",
    "ปราสาท": "Tempelburg; Palast",
    "โรมัน": "römisch",
    "ช่องเขา": "Gebirgspass",
    "รูปี": "Rupie",
    "มรสุม": "Monsun",
    "น้ำค้างแข็ง": "Raureif",
    "เขย่า": "schütteln",
    "อิสลาม": "Islam"
};

function knownSyllableReadings(words) {
    const readings = new Map();
    for (const word of words) {
        for (const syllable of word.syllables || []) {
            if (syllable.thai && syllable.transliteration) {
                readings.set(syllable.thai, syllable.transliteration);
            }
        }
    }
    return readings;
}

function splitWithKnownSyllables(token, readings) {
    const syllables = [...readings.keys()].sort((left, right) =>
        right.length - left.length
    );
    const paths = Array(token.length + 1).fill(null);
    paths[0] = [];
    for (let index = 0; index < token.length; index++) {
        if (!paths[index]) {
            continue;
        }
        for (const syllable of syllables) {
            if (!token.startsWith(syllable, index)) {
                continue;
            }
            const end = index + syllable.length;
            const nextPath = [...paths[index], syllable];
            if (!paths[end] || nextPath.length < paths[end].length) {
                paths[end] = nextPath;
            }
        }
    }
    return paths[token.length];
}

function toneMarkedSyllable(thai, base) {
    const tone = analyze(thai).tone;
    if (!tone) {
        throw new Error(`Tone could not be determined for ${thai}`);
    }
    return applyTone(base, tone);
}

function injectWords() {
    const wordsModule = require(WORDS_FILE);
    const report = auditQuiz();
    const readings = knownSyllableReadings(wordsModule.words);
    const missing = new Map(
        [...report.missing, ...report.invalidSyllables]
            .map(item => [item.text, item])
    );

    const additions = [];
    const unresolved = [];
    for (const item of missing.values()) {
        const existing = wordsModule.words.find(word => word.thai === item.text);
        if (existing?.syllables?.map(syllable => syllable.thai).join("") === item.text) {
            continue;
        }
        let syllablePairs = manualSyllables[item.text];
        if (!syllablePairs) {
            const split = splitWithKnownSyllables(item.text, readings);
            if (split) {
                syllablePairs = split.map(syllable => [
                    syllable,
                    readings.get(syllable).replace(/[\u0300\u0301\u0302\u030c]/gu, "")
                ]);
            }
        }
        if (!syllablePairs || syllablePairs.map(pair => pair[0]).join("") !== item.text) {
            unresolved.push(item.text);
            continue;
        }
        const syllableThai = syllablePairs.map(pair => pair[0]);
        const syllableReadings = syllablePairs.map(([thai, base]) =>
            toneMarkedSyllable(thai, base)
        );
        const transliteration = syllableReadings.join(" ");
        const meaning = meaningOverrides[item.text] ||
            item.contexts[0]?.de ||
            "Quizwort";
        additions.push([
            item.text,
            transliteration,
            meaning,
            syllableThai.join("|"),
            syllableReadings.join("|")
        ]);
    }

    if (unresolved.length) {
        throw new Error(`Syllable readings still needed: ${unresolved.join(", ")}`);
    }
    if (additions.length === 0) {
        console.log("Quiz glossary already covers all new tokens with valid syllables.");
        return;
    }

    const content = fs.readFileSync(WORDS_FILE, "utf8");
    const marker = "    const rawWords = [\n";
    const markerWin = "    const rawWords = [\r\n";
    const isWindowsLineEnding = content.includes(markerWin);
    const usedMarker = isWindowsLineEnding ? markerWin : marker;
    const newline = isWindowsLineEnding ? "\r\n" : "\n";
    const insertionIndex = content.indexOf(usedMarker);
    if (insertionIndex < 0) {
        throw new Error("Could not find rawWords marker in thailand-quiz-words.js");
    }

    const entries = additions.map(([thai, transliteration, meaning, syllableText, syllableReadings]) =>
        `        [${JSON.stringify(thai)},${JSON.stringify(transliteration)},${JSON.stringify(meaning)},${JSON.stringify(syllableText)},${JSON.stringify(syllableReadings)}],${newline}`
    ).join("");
    fs.writeFileSync(
        WORDS_FILE,
        content.slice(0, insertionIndex + usedMarker.length) +
            entries +
            content.slice(insertionIndex + usedMarker.length),
        "utf8"
    );
    console.log(`Added ${additions.length} glossary entries for thq-beg-201 through thq-beg-300.`);
}

injectWords();
