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
