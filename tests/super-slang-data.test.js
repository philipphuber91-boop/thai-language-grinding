const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

test("Super Slang curriculum data and story integrity", () => {
    const jsonPath = path.resolve(__dirname, "..", "data", "super-slang.json");
    const jsPath = path.resolve(__dirname, "..", "data", "super-slang.js");

    const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const ctx = {};
    eval(fs.readFileSync(jsPath, "utf8") + "; ctx.content = superSlangContent;");

    assert.deepStrictEqual(json, ctx.content, "data/super-slang.json and data/super-slang.js must match exactly");

    const words = json.words;
    assert.strictEqual(words.length, 103, "Expected 103 words in Super Slang curriculum");

    const wordMap = new Map();
    words.forEach(w => {
        assert(w.id, `Word missing id: ${JSON.stringify(w)}`);
        assert(!wordMap.has(w.id), `Duplicate word id: ${w.id}`);
        wordMap.set(w.id, w);
        assert(w.thai, `Word missing thai: ${w.id}`);
        assert(w.transliteration, `Word missing transliteration: ${w.id}`);
        assert(Array.isArray(w.meanings) && w.meanings.length > 0, `Word missing meanings: ${w.id}`);
        assert(Array.isArray(w.syllables) && w.syllables.length > 0, `Word missing syllables: ${w.id}`);
        const joined = w.syllables.map(s => s.thai).join("");
        assert.strictEqual(joined, w.thai, `Syllable mismatch for ${w.id}: ${joined} !== ${w.thai}`);
    });

    const stories = json.levels[0].bosses[0].blocks[0].miniStories;
    assert.strictEqual(stories.length, 3, "Expected 3 mini-stories in block 1");

    let totalSentences = 0;
    stories.forEach((story, sIdx) => {
        assert(story.id, `Story missing id at index ${sIdx}`);
        assert(story.title, `Story missing title at index ${sIdx}`);
        assert(Array.isArray(story.sentences), `Story missing sentences at index ${sIdx}`);
        story.sentences.forEach((st, idx) => {
            totalSentences++;
            assert.strictEqual(st.number, totalSentences, `Sentence number mismatch at ${st.id}`);
            assert.strictEqual(st.numberInStory, idx + 1, `Sentence numberInStory mismatch at ${st.id}`);
            assert(st.speaker, `Sentence missing speaker: ${st.id}`);
            assert(st.thai, `Sentence missing thai: ${st.id}`);
            assert(st.transliteration, `Sentence missing transliteration: ${st.id}`);
            assert(st.translation, `Sentence missing translation: ${st.id}`);
            assert(Array.isArray(st.tokens) && st.tokens.length > 0, `Sentence missing tokens: ${st.id}`);
            st.tokens.forEach(tok => {
                if (tok.kind === "word") {
                    assert(tok.wordId, `Token missing wordId in ${st.id}: ${tok.text}`);
                    assert(wordMap.has(tok.wordId), `Unknown wordId in ${st.id}: ${tok.wordId}`);
                }
            });
        });
    });

    assert.strictEqual(totalSentences, 23, "Expected 23 total sentences across the 3 stories");
});
