const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const sentenceMix = require("../js/games/sentence-mix/engine.js");

test("Wordmix XP increases by one for each word after the first three", () => {
    assert.deepEqual(
        [1, 2, 3, 4, 5, 6, 7, 8, 12].map(sentenceMix.calculateXpForWordCount),
        [1, 1, 1, 2, 3, 4, 5, 6, 10]
    );
});

test("Wordmix XP rejects invalid sentence lengths", () => {
    for (const wordCount of [0, -1, 1.5, Number.NaN]) {
        assert.throws(
            () => sentenceMix.calculateXpForWordCount(wordCount),
            RangeError
        );
    }
});

test("standalone Wordmix loads and initializes player XP before the game UI", () => {
    const page = fs.readFileSync(
        path.join(__dirname, "../html/satzmix.html"),
        "utf8"
    );
    const saveScript = page.indexOf("../js/save.js");
    const playerScript = page.indexOf("../js/player.js");
    const loadPlayerCall = page.indexOf("loadPlayer();");
    const gameUiScript = page.indexOf("../js/games/sentence-mix/ui.js");

    assert.ok(saveScript >= 0);
    assert.ok(playerScript > saveScript);
    assert.ok(loadPlayerCall > playerScript);
    assert.ok(gameUiScript > loadPlayerCall);
});
