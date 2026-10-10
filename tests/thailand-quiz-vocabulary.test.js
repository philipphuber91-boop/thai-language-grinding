const test = require("node:test");
const assert = require("node:assert/strict");
const glossary = require("../data/thailand-quiz-words.js");
const { createVocabulary, getToneClass } = require("../js/thailand-quiz-vocabulary.js");

test("quiz glossary has unique IDs and exact syllable reconstruction", () => {
    const ids = glossary.words.map(word => word.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(glossary.words.every(word =>
        word.syllables.map(syllable => syllable.thai).join("") === word.thai
    ));
    assert.ok(glossary.words.every(word =>
        word.syllables.length > 0 &&
        word.syllables.every(syllable => typeof syllable.transliteration === "string")
    ));
});

test("Thai text uses longest matching vocabulary words and preserves separators", () => {
    const vocabulary = createVocabulary({
        quizWords: [
            {
                id: "province",
                thai: "จังหวัด",
                meanings: ["Provinz"],
                syllables: [
                    { thai: "จัง", transliteration: "jang" },
                    { thai: "หวัด", transliteration: "wat" }
                ]
            },
            {
                id: "chiang-mai",
                thai: "เชียงใหม่",
                meanings: ["Chiang Mai"]
            }
        ]
    });
    const parts = vocabulary.segment("จังหวัดเชียงใหม่!");

    assert.deepEqual(parts.map(part => part.text), ["จังหวัด", "เชียงใหม่", "!"]);
    assert.equal(parts[0].entry.id, "province");
    assert.equal(parts[1].entry.id, "chiang-mai");
});

test("vocabulary prefixes do not split a different Thai word into fragments", () => {
    const vocabulary = createVocabulary({
        quizWords: [{
            id: "lose",
            thai: "เสีย",
            meanings: ["verlieren"]
        }]
    });

    assert.deepEqual(vocabulary.segment("เสียง").map(part => part.text), ["เสียง"]);
});

test("adjacent vocabulary words are segmented properly even if ICU word breaker splits across them", () => {
    const vocabulary = createVocabulary({
        quizWords: [
            {
                id: "be",
                thai: "เป็น",
                meanings: ["sein"],
                syllables: [{ thai: "เป็น", transliteration: "bpen" }]
            },
            {
                id: "group",
                thai: "กลุ่ม",
                meanings: ["Gruppe"],
                syllables: [{ thai: "กลุ่ม", transliteration: "glùm" }]
            }
        ]
    });

    assert.deepEqual(vocabulary.segment("เป็นกลุ่ม").map(part => part.text), ["เป็น", "กลุ่ม"]);
});

test("canonical GigaDrill entries are reused and acquire quiz syllables", () => {
    const vocabulary = createVocabulary({
        gigaWords: [{
            id: "word-bangkok",
            thai: "กรุงเทพมหานคร",
            transliteration: "Krung Thep",
            meanings: ["Bangkok"]
        }],
        quizWords: [{
            id: "quiz-bangkok",
            thai: "กรุงเทพมหานคร",
            transliteration: "Krung Thep Maha Nakhon",
            meanings: ["Hauptstadt Thailands"],
            syllables: [{ thai: "กรุงเทพมหานคร", transliteration: "Krung Thep" }]
        }]
    });
    const entry = vocabulary.find("กรุงเทพมหานคร");

    assert.equal(entry.id, "word-bangkok");
    assert.equal(entry.source, "giga");
    assert.deepEqual(entry.meanings, ["Bangkok", "Hauptstadt Thailands"]);
    assert.equal(entry.syllables[0].thai, "กรุงเทพมหานคร");
});

test("tone colors follow the wordmix transliteration markers", () => {
    assert.equal(getToneClass("mà"), "thai-tone-low");
    assert.equal(getToneClass("má"), "thai-tone-high");
    assert.equal(getToneClass("mâ"), "thai-tone-falling");
    assert.equal(getToneClass("mǎ"), "thai-tone-rising");
    assert.equal(getToneClass("ma"), "thai-tone-mid");
});

test("pseudo-clusters and leading vowel words have correct syllable cuts and tone classes", () => {
    const khayao = glossary.words.find(w => w.thai === "เขย่า");
    assert.ok(khayao);
    assert.deepEqual(khayao.syllables.map(s => s.thai), ["เข", "ย่า"]);
    assert.deepEqual(khayao.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-low", "thai-tone-low"]);

    const chalerm = glossary.words.find(w => w.thai === "เฉลิม");
    assert.ok(chalerm);
    assert.deepEqual(chalerm.syllables.map(s => s.thai), ["เฉ", "ลิม"]);
    assert.deepEqual(chalerm.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-low", "thai-tone-rising"]);

    const chapho = glossary.words.find(w => w.thai === "เฉพาะ");
    assert.ok(chapho);
    assert.deepEqual(chapho.syllables.map(s => s.thai), ["เฉ", "พาะ"]);
    assert.deepEqual(chapho.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-low", "thai-tone-high"]);

    const thamma = glossary.words.find(w => w.thai === "ธรรมะ");
    assert.ok(thamma);
    assert.deepEqual(thamma.syllables.map(s => s.thai), ["ธรร", "มะ"]);
    assert.deepEqual(thamma.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-mid", "thai-tone-high"]);

    const satchanalai = glossary.words.find(w => w.thai === "ศรีสัชนาลัย");
    assert.ok(satchanalai);
    assert.deepEqual(satchanalai.syllables.map(s => s.thai), ["ศรี", "สั", "ช", "นา", "ลัย"]);
    assert.deepEqual(satchanalai.syllables.map(s => getToneClass(s.transliteration)), [
        "thai-tone-rising",
        "thai-tone-low",
        "thai-tone-high",
        "thai-tone-mid",
        "thai-tone-mid"
    ]);
});

test("Mai Yamok repetition retains base word tone diacritics and tone colors", () => {
    const chacha = glossary.words.find(w => w.thai === "ช้าๆ");
    assert.ok(chacha);
    assert.deepEqual(chacha.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-high", "thai-tone-high"]);

    const plaekplaek = glossary.words.find(w => w.thai === "แปลกๆ");
    assert.ok(plaekplaek);
    assert.deepEqual(plaekplaek.syllables.map(s => getToneClass(s.transliteration)), ["thai-tone-low", "thai-tone-low"]);
});

