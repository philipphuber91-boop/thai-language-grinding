/**
 * TEST-ONLY adapter/harness for the compact Grammar Boss 3 editorial pilot.
 *
 * This intentionally does not modify or import the production reader. It keeps
 * the pilot reviewable while exercising the same useful contract: dialogue
 * lines expose clickable Thai tokens, and each token resolves to dictionary
 * data plus sentence-level context.
 */

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const fixturePath = path.join(
    __dirname,
    "..",
    "data",
    "grammar-boss-3-editorial-pilot.json"
);

function loadPilot() {
    return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function assertNonEmptyString(value, label) {
    assert.equal(typeof value, "string", `${label} must be a string`);
    assert.ok(value.trim(), `${label} must not be empty`);
}

function buildDictionaryIndex(pilot) {
    const vocabulary = new Map(pilot.vocabulary.map(entry => [entry.id, entry]));
    const index = new Map();

    pilot.dialogue.forEach(line => {
        line.tokens.forEach(token => {
            if (token.kind !== "word") {
                return;
            }

            const word = vocabulary.get(token.wordId);
            assert.ok(word, `${line.id}: token ${token.id} links to missing vocabulary`);
            assert.equal(
                word.thai,
                token.text,
                `${line.id}: token ${token.id} links ${token.text} to vocabulary word ${word.thai}`
            );
            const occurrences = index.get(token.wordId) || [];
            occurrences.push({
                sentenceId: line.id,
                thai: line.thai,
                translation: line.translation,
                context: line.context,
                contextMeaning: token.contextMeaning
            });
            index.set(token.wordId, occurrences);
        });
    });

    return { vocabulary, index };
}

function adaptToComedyReaderShape(pilot) {
    return {
        titel: pilot.title,
        kapitel: "Test-only fixture",
        dialogue: pilot.dialogue.map(line => ({
            speaker: line.speaker,
            deutsch: line.translation,
            thai: line.thai,
            scene: line.scene,
            sceneIntro: false,
            editorialContext: line.context,
            tokens: line.tokens
        }))
    };
}

function validatePilot(pilot) {
    assert.equal(pilot.fixtureVersion, 1, "fixtureVersion must be 1");
    assert.equal(pilot.testOnly, true, "fixture must be explicitly test-only");
    assertNonEmptyString(pilot.title, "title");
    assertNonEmptyString(pilot.topic, "topic");
    assert.equal(pilot.dialogue.length, 30, "pilot must contain exactly 30 sentences");
    assert.equal(pilot.dialogue.length % 6, 0, "pilot scenes should contain six lines");

    const ids = new Set();
    pilot.dialogue.forEach((line, index) => {
        assertNonEmptyString(line.id, `dialogue[${index}].id`);
        assert.ok(!ids.has(line.id), `duplicate sentence id: ${line.id}`);
        ids.add(line.id);
        assert.ok(Number.isInteger(line.scene), `${line.id}: scene must be an integer`);
        assertNonEmptyString(line.sceneTitle, `${line.id}.sceneTitle`);
        assertNonEmptyString(line.context, `${line.id}.context`);
        assertNonEmptyString(line.speaker, `${line.id}.speaker`);
        assertNonEmptyString(line.thai, `${line.id}.thai`);
        assertNonEmptyString(line.transliteration, `${line.id}.transliteration`);
        assertNonEmptyString(line.translation, `${line.id}.translation`);
        assert.ok(["location", "ongoing-action"].includes(line.usage), `${line.id}: unknown usage`);
        assertNonEmptyString(line.contextNote, `${line.id}.contextNote`);
        assert.ok(Array.isArray(line.tokens) && line.tokens.length > 0, `${line.id}: tokens required`);

        const reconstructedThai = line.tokens.map(token => token.text).join("");
        assert.equal(reconstructedThai, line.thai, `${line.id}: token text must reconstruct Thai`);

        const tokenIds = new Set();
        line.tokens.forEach(token => {
            assertNonEmptyString(token.id, `${line.id}.token.id`);
            assert.ok(!tokenIds.has(token.id), `${line.id}: duplicate token id ${token.id}`);
            tokenIds.add(token.id);
            assert.ok(["word", "space", "punctuation"].includes(token.kind), `${token.id}: invalid kind`);
            if (token.kind === "word") {
                assertNonEmptyString(token.wordId, `${token.id}.wordId`);
                assertNonEmptyString(token.contextMeaning, `${token.id}.contextMeaning`);
            }
        });
    });

    const { vocabulary, index } = buildDictionaryIndex(pilot);
    assert.ok(vocabulary.size > 0, "vocabulary must not be empty");
    assert.ok(index.has("gb3-pilot-word-yuu"), "อยู่ must be clickable");

    const yuuMeanings = new Set(
        index.get("gb3-pilot-word-yuu").map(occurrence => occurrence.contextMeaning)
    );
    assert.ok(
        [...yuuMeanings].some(meaning => meaning.includes("sich befinden")),
        "อยู่ needs a location context"
    );
    assert.ok(
        [...yuuMeanings].some(meaning => meaning.includes("gerade")),
        "อยู่ needs an ongoing-action context"
    );
    [
        "gb3-pilot-word-mai",
        "gb3-pilot-word-mai-question",
        "gb3-pilot-word-kha",
        "gb3-pilot-word-khrap",
        "gb3-pilot-word-na",
        "gb3-pilot-word-thii"
    ]
        .forEach(wordId => assert.ok(index.has(wordId), `${wordId} must be linked by a token`));
    assert.deepEqual(
        vocabulary.get("gb3-pilot-word-mai").meanings,
        ["nicht"],
        "ไม่ must remain separate from the question particle"
    );
    assert.deepEqual(
        vocabulary.get("gb3-pilot-word-mai-question").meanings,
        ["Ja/Nein-Fragepartikel"],
        "ไหม must have its own dictionary entry"
    );

    const adapted = adaptToComedyReaderShape(pilot);
    assert.equal(adapted.dialogue.length, 30, "adapter must preserve all lines");
    adapted.dialogue.forEach((line, index) => {
        assert.equal(line.thai, pilot.dialogue[index].thai, `${line.speaker}: adapter changed Thai`);
        assert.equal(line.deutsch, pilot.dialogue[index].translation, `${line.speaker}: adapter changed German`);
        assert.ok(Array.isArray(line.tokens), `${line.speaker}: adapter dropped token links`);
    });

    return { vocabulary, index, adapted };
}

function run() {
    const pilot = loadPilot();
    const { vocabulary, index } = validatePilot(pilot);
    const clickableWords = [...index.keys()].length;
    console.log(
        `PASS: ${pilot.dialogue.length} sentences, ${pilot.dialogue.length / 6} scenes, ` +
        `${vocabulary.size} vocabulary entries, ${clickableWords} clickable word links.`
    );
    console.log("PASS: อยู่ resolves to both location and ongoing-action contexts.");
    console.log("PASS: compact fixture adapts to the reader dialogue shape without production changes.");
}

if (require.main === module) {
    run();
}

module.exports = {
    adaptToComedyReaderShape,
    buildDictionaryIndex,
    loadPilot,
    validatePilot
};
