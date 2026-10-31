const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const adapter = require("../js/games/sentence-mix/adapter.js");
const sentenceMixUI = require("../js/games/sentence-mix/ui.js");

test("campaign quest dialogue is converted to stable Wordmix rounds", () => {
    const quests = {
        3: {
            titel: "Im Markt",
            kapitel: "Kapitel 1",
            thaiZeilen: ["สวัสดีครับ ฉันไปตลาด", "สวัสดี"],
            deutschZeilen: ["Hallo, ich gehe zum Markt.", "Hallo."]
        }
    };

    const rounds = adapter.extractCampaignQuestSentences(quests);

    assert.equal(rounds.length, 1);
    assert.equal(rounds[0].sentenceId, "quest-3-line-1");
    assert.equal(rounds[0].thai, "สวัสดีครับ ฉันไปตลาด");
    assert.equal(rounds[0].translation, "Hallo, ich gehe zum Markt.");
    assert.equal(rounds[0].meta.contentSource, "quests");
    assert.equal(rounds[0].meta.questId, "3");
    assert.equal(rounds[0].meta.questTitle, "Im Markt");
    assert.equal(rounds[0].meta.questChapter, "Kapitel 1");
    assert.equal(rounds[0].meta.lineNumber, 1);
    assert.deepEqual(rounds[0].words.map(word => word.text), [
        "สวัสดี",
        "ครับ",
        "ฉัน",
        "ไป",
        "ตลาด"
    ]);
    assert.deepEqual(rounds[0].expectedTokenIds, rounds[0].words.map(word => word.id));
});

test("Thai short vowel is not emitted as a standalone Wordmix token", () => {
    const [round] = adapter.extractCampaignQuestSentences({
        1: { titel: "Urlaub", thaiZeilen: ["ธีระอยู่ในช่วงพักร้อนที่ภาคใต้"] }
    });

    assert.equal(round.words[0].text, "ธีระ");
    assert.ok(round.words.every(word => word.text !== "ะ"));
});

test("campaign quest selection includes only quests with Thai dialogue", () => {
    const options = adapter.getCampaignQuestOptions({
        1: { titel: "Erste Quest", thaiZeilen: ["สวัสดีครับ"] },
        2: { titel: "Leere Quest", thaiZeilen: [" "] },
        3: { titel: "Keine Thai-Zeilen", deutschZeilen: ["Hallo"] }
    });

    assert.deepEqual(options, [
        { id: "1", title: "Erste Quest", chapter: "" }
    ]);
});

test("Wordmix can load the production campaign quest data", () => {
    const source = fs.readFileSync(
        path.join(__dirname, "../data/quests.js"),
        "utf8"
    );
    const sandbox = { window: {} };
    vm.runInNewContext(source, sandbox, { filename: "data/quests.js" });

    const questOptions = adapter.getCampaignQuestOptions(
        sandbox.window.wordMixCampaignQuests
    );
    const rounds = adapter.extractCampaignQuestSentences(
        sandbox.window.wordMixCampaignQuests
    );

    assert.ok(questOptions.length > 0);
    assert.ok(rounds.length > 0);
    assert.ok(rounds.every(round =>
        round.tokenCount >= 2 &&
        round.expectedTokenIds.length === round.tokenCount &&
        round.meta.contentSource === "quests"
    ));
    assert.ok(rounds.every(round => round.words.every(word => word.text !== "ะ")));
});

test("campaign quest adapter rejects missing data instead of silently returning no rounds", () => {
    assert.throws(
        () => adapter.extractCampaignQuestSentences(null),
        /Kampagnen-Quests sind nicht verfügbar/
    );
});

test("quest Wordmix reports when Thai segmentation is unavailable", () => {
    const source = fs.readFileSync(
        path.join(__dirname, "../js/games/sentence-mix/adapter.js"),
        "utf8"
    );
    const module = { exports: {} };
    vm.runInNewContext(source, {
        Intl: {},
        module
    });

    assert.throws(
        () => module.exports.extractCampaignQuestSentences({}),
        /Thai-Wortsegmentierung/
    );
});

test("Wordmix keeps Giga Drill as the source for existing saved configurations", () => {
    const ui = new sentenceMixUI.SentenceMixUI();

    assert.equal(ui.wordMixConfiguration.contentSource, "giga");
});

test("Wordmix filters by source and selected campaign quests", () => {
    const ui = new sentenceMixUI.SentenceMixUI();
    ui.allSentences = [
        {
            sentenceId: "giga-1",
            tokenCount: 3,
            meta: { contentSource: "giga", bossId: "boss-a" }
        },
        {
            sentenceId: "quest-1",
            tokenCount: 3,
            meta: { contentSource: "quests", questId: "1" }
        },
        {
            sentenceId: "quest-2",
            tokenCount: 4,
            meta: { contentSource: "quests", questId: "2" }
        }
    ];
    ui.wordMixConfiguration = {
        contentSource: "both",
        contentMode: "all",
        bossIds: [],
        questFilterMode: "selected",
        questIds: ["2"],
        minWords: 2,
        maxWords: 12
    };

    ui.applySentenceConfiguration();

    assert.deepEqual(
        ui.filteredSentences.map(sentence => sentence.sentenceId),
        ["giga-1", "quest-2"]
    );

    ui.wordMixConfiguration.contentSource = "quests";
    ui.wordMixConfiguration.questFilterMode = "all";
    ui.wordMixConfiguration.questIds = [];
    ui.applySentenceConfiguration();
    assert.deepEqual(
        ui.filteredSentences.map(sentence => sentence.sentenceId),
        ["quest-1", "quest-2"]
    );

    ui.wordMixConfiguration.contentSource = "giga";
    ui.applySentenceConfiguration();
    assert.deepEqual(
        ui.filteredSentences.map(sentence => sentence.sentenceId),
        ["giga-1"]
    );
});

test("Wordmix playlist source remains isolated from saved content-source selection", () => {
    const ui = new sentenceMixUI.SentenceMixUI();
    ui.isPlaylistSource = true;
    ui.allSentences = [{
        sentenceId: "playlist-entry",
        tokenCount: 3,
        meta: { contentSource: "giga", bossId: "boss-a" }
    }];
    ui.wordMixConfiguration = {
        contentSource: "quests",
        contentMode: "all",
        bossIds: [],
        questFilterMode: "all",
        questIds: [],
        minWords: 2,
        maxWords: 12
    };

    ui.applySentenceConfiguration();

    assert.deepEqual(
        ui.filteredSentences.map(sentence => sentence.sentenceId),
        ["playlist-entry"]
    );
});

test("Wordmix page loads campaign data before the adapter and exposes source filters", () => {
    const page = fs.readFileSync(
        path.join(__dirname, "../html/satzmix.html"),
        "utf8"
    );

    assert.ok(
        page.indexOf("../data/quests.js") <
        page.indexOf("../js/games/sentence-mix/adapter.js")
    );
    assert.match(page, /name="sentenceMixContentSource" value="giga"/);
    assert.match(page, /name="sentenceMixContentSource" value="quests"/);
    assert.match(page, /name="sentenceMixContentSource" value="both"/);
    assert.match(page, /id="sentenceMixQuestOptions"/);
});
