const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const dailyQuestsSource = fs.readFileSync(
    path.join(__dirname, "../js/daily-quests.js"),
    "utf8"
);

function createDailyQuestsContext(initialStorage = {}) {
    const values = new Map(Object.entries(initialStorage));
    const sandbox = {
        localStorage: {
            getItem: key => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, String(value))
        },
        player: {
            stats: {
                masteredThaiWords: 0,
                totalCleanWords: 0,
                history: { daily: [] }
            }
        },
        getToday: () => "2026-11-15",
        document: { getElementById: () => null },
        window: { addEventListener: () => {} },
        console: { warn: () => {} },
        awardPlayerXp: () => {}
    };

    vm.createContext(sandbox);
    vm.runInContext(dailyQuestsSource, sandbox, {
        filename: "js/daily-quests.js"
    });

    return {
        sandbox,
        readStorage: key => values.get(key)
    };
}

test("daily quest selection always includes core, Wordmix, and quiz quests", () => {
    const { sandbox, readStorage } = createDailyQuestsContext();
    const state = JSON.parse(readStorage("dailyQuests"));
    const categories = JSON.parse(vm.runInContext(
        `JSON.stringify(getDailyQuestCards().map(quest => quest.category).sort())`,
        sandbox
    ));

    assert.equal(state.questIds.length, 3);
    assert.deepEqual(categories, ["core", "quiz", "wordmix"]);
});

test("Wordmix and quiz quests measure progress from the daily baseline", () => {
    const { sandbox } = createDailyQuestsContext({
        "thaiGigaDrill:v1:wordmix-points": "100",
        "thaiGigaDrill:v1:wordmix-solved-sentences": "4",
        thailandQuizStats: JSON.stringify({
            totalQuestionsAnswered: 20,
            roundsCompleted: 3
        })
    });

    const progress = JSON.parse(vm.runInContext(`
        const state = getDailyQuestState();
        const getProgress = id =>
            dailyQuestDefinitions.find(quest => quest.id === id).getProgress(null, state);
        localStorage.setItem("thaiGigaDrill:v1:wordmix-points", "161");
        localStorage.setItem("thaiGigaDrill:v1:wordmix-solved-sentences", "7");
        localStorage.setItem("thailandQuizStats", JSON.stringify({
            totalQuestionsAnswered: 25,
            roundsCompleted: 4
        }));
        JSON.stringify({
            wordmixPoints: getProgress("wordmix-points"),
            wordmixSentences: getProgress("wordmix-solved-sentences"),
            quizQuestions: getProgress("quiz-questions"),
            quizRounds: getProgress("quiz-rounds")
        });
    `, sandbox));

    assert.deepEqual(progress, {
        wordmixPoints: 61,
        wordmixSentences: 3,
        quizQuestions: 5,
        quizRounds: 1
    });
});

test("typing time is tracked separately from active time across all games", () => {
    const { sandbox } = createDailyQuestsContext();
    const progress = JSON.parse(vm.runInContext(`
        const state = getDailyQuestState();
        const getProgress = id =>
            dailyQuestDefinitions.find(quest => quest.id === id).getProgress(
                { typingTime: 7 * 60, playTime: 15 * 60 },
                state
            );
        JSON.stringify({
            typingMinutes: getProgress("typing-time"),
            activePlayMinutes: getProgress("active-play-time")
        });
    `, sandbox));

    assert.deepEqual(progress, {
        typingMinutes: 7,
        activePlayMinutes: 15
    });
});

test("daily quest goals match the requested difficulty", () => {
    const { sandbox } = createDailyQuestsContext();
    const goals = JSON.parse(vm.runInContext(`
        JSON.stringify(Object.fromEntries(
            dailyQuestDefinitions.map(quest => [quest.id, quest.goal])
        ));
    `, sandbox));

    assert.deepEqual(goals, {
        "typing-time": 7,
        "active-play-time": 15,
        "completed-quests": 1,
        "mastered-words": 2,
        "clean-words": 30,
        "daily-accuracy": 95,
        "wordmix-solved-sentences": 20,
        "wordmix-points": 500,
        "quiz-questions": 20,
        "quiz-rounds": 1
    });
});
