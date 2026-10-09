const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../data/thailand-quiz.js");
const quiz = require("../js/thailand-quiz-engine.js");

test("question bank has complete, valid mixed-category questions", () => {
    assert.equal(data.questions.length, 834);
    assert.deepEqual(quiz.validateQuestionBank(data), []);
    assert.equal(new Set(data.questions.map(question => question.categoryId)).size, 28);
    assert.ok(data.questions.every(question =>
        question.transliteration.question &&
        question.options.every(option => option.transliteration) &&
        question.sources.every(source => source.url.startsWith("https://"))
    ));
    assert.ok(data.questions.every(question =>
        !JSON.stringify(question).includes("<") &&
        !JSON.stringify(question).includes("במשך")
    ));
});

test("beginner categories provide varied Thai-first questions at levels one and two", () => {
    const beginnerQuestions = data.questions.filter(question =>
        question.id.startsWith("thq-beginner-")
    );
    const legacyQuestions = data.questions.filter(question =>
        !question.id.startsWith("thq-beginner-")
    );
    const counts = new Map();

    for (const question of beginnerQuestions) {
        counts.set(
            `${question.categoryId}:${question.difficulty}`,
            (counts.get(`${question.categoryId}:${question.difficulty}`) || 0) + 1
        );
    }

    assert.equal(beginnerQuestions.length, 300);
    assert.ok(beginnerQuestions.every(question => question.difficulty <= 2));
    assert.equal(legacyQuestions.length, 534);
    assert.ok(legacyQuestions.every(question => question.difficulty >= 1));
    assert.equal(counts.size, 40);
    assert.ok([...counts.values()].every(count => count === 5 || count === 10));

    const secondPack = beginnerQuestions.filter(question =>
        Number(question.id.slice(-3)) >= 11
    );
    const previousQuestions = data.questions.filter(question =>
        !secondPack.includes(question)
    );
    const previousTexts = new Set(previousQuestions.map(question => question.question.th.trim()));
    const secondPackTexts = secondPack.map(question => question.question.th.trim());

    assert.equal(secondPack.length, 100);
    assert.equal(new Set(secondPackTexts).size, secondPack.length);
    assert.ok(secondPackTexts.every(text => !previousTexts.has(text)));

    const newCategoryIds = new Set([
        "beginner_school",
        "beginner_time",
        "beginner_shopping",
        "beginner_health",
        "beginner_clothing",
        "beginner_jobs",
        "beginner_technology",
        "beginner_home",
        "beginner_music_art",
        "beginner_hobbies"
    ]);
    const newPack = beginnerQuestions.filter(question =>
        newCategoryIds.has(question.categoryId)
    );
    const newPackTexts = newPack.map(question => question.question.th.trim());
    const newPackCounts = new Map();

    for (const question of newPack) {
        const key = `${question.categoryId}:${question.difficulty}`;
        newPackCounts.set(key, (newPackCounts.get(key) || 0) + 1);
    }

    const newPackPreviousQuestions = data.questions.filter(question =>
        !newPack.includes(question)
    );
    const newPackPreviousTexts = new Set(
        newPackPreviousQuestions.map(question => question.question.th.trim())
    );
    assert.equal(newPack.length, 100);
    assert.equal(newPackCounts.size, 20);
    assert.ok([...newPackCounts.values()].every(count => count === 5));
    assert.equal(new Set(newPackTexts).size, newPack.length);
    assert.ok(newPackTexts.every(text => !newPackPreviousTexts.has(text)));

    const levelTwoQuestions = newPack.filter(question => question.difficulty === 2);
    const trueFalseQuestions = newPack.filter(question =>
        question.type === "true_false"
    );
    assert.equal(trueFalseQuestions.length, 10);
    assert.ok(trueFalseQuestions.every(question =>
        question.options.length === 2 &&
        question.options[0].th === "จริง" &&
        question.options[1].th === "ไม่จริง"
    ));
    const yesNoQuestions = levelTwoQuestions.filter(question =>
        question.options.map(option => option.th).join("|") === "ใช่|ไม่ใช่"
    );
    assert.equal(yesNoQuestions.length, 20);
    assert.equal(
        levelTwoQuestions.filter(question =>
            question.type === "single_choice" &&
            question.options.length > 2
        ).length,
        20
    );
});

test("third Thailand beginner pack has 100 unique level-one and level-two questions", () => {
    const newPack = data.questions.filter(question =>
        /^thq-beg-(20[1-9]|2[1-9]\d|300)$/.test(question.id)
    );
    const allOtherTexts = new Set(
        data.questions.filter(question => !newPack.includes(question))
            .map(question => question.question.th.trim())
    );
    const newTexts = newPack.map(question => question.question.th.trim());

    assert.equal(newPack.length, 100);
    assert.ok(newPack.every(question => question.difficulty <= 2));
    assert.equal(new Set(newTexts).size, 100);
    assert.ok(newTexts.every(text => !allOtherTexts.has(text)));
});

test("round selection returns ten unique questions with mixed categories and levels", () => {
    const round = quiz.selectRound(data.questions, [], () => 0.42);

    assert.equal(round.length, quiz.QUESTION_COUNT);
    assert.equal(new Set(round.map(question => question.id)).size, round.length);
    assert.ok(new Set(round.map(question => question.categoryId)).size >= 5);
    assert.ok(new Set(round.map(question => question.difficulty)).size >= 4);
});

test("round selection avoids recently played questions when enough alternatives exist", () => {
    const recentIds = data.questions.slice(0, 10).map(question => question.id);
    const round = quiz.selectRound(data.questions, recentIds, () => 0.3);

    assert.ok(round.every(question => !recentIds.includes(question.id)));
});

test("round filters and short pools return only matching available questions", () => {
    const filters = { categories: ["geography"], difficulties: [2] };
    const filtered = quiz.filterQuestions(data.questions, filters);
    const round = quiz.selectRound(data.questions, [], () => 0.4, 10, filters);

    assert.ok(filtered.length > 0);
    assert.equal(round.length, filtered.length);
    assert.ok(round.every(question =>
        question.categoryId === "geography" && question.difficulty === 2
    ));
    assert.deepEqual(quiz.filterQuestions(data.questions, { categories: [] }), []);
});

test("endless cycle shuffles through each question without immediate repeats", () => {
    const pool = data.questions.slice(0, 3);
    const cycle = quiz.createEndlessCycle(pool, () => 0);
    const played = Array.from({ length: 9 }, () => cycle.next().id);

    assert.equal(new Set(played.slice(0, 3)).size, 3);
    assert.ok(played.every((id, index) => index === 0 || id !== played[index - 1]));
});

test("answer options shuffle and repeated questions move correct answers when possible", () => {
    const question = data.questions.find(item => item.type === "single_choice");
    const firstOrder = quiz.shuffleOptions(
        question.options,
        [],
        () => 0.999,
        question.correctAnswers
    );
    const repeatedOrder = quiz.shuffleOptions(
        question.options,
        firstOrder.map(option => option.id),
        () => 0.999,
        question.correctAnswers
    );
    const correctPosition = options =>
        options.findIndex(option => question.correctAnswers.includes(option.id));

    assert.notDeepEqual(
        repeatedOrder.map(option => option.id),
        firstOrder.map(option => option.id)
    );
    assert.notEqual(correctPosition(repeatedOrder), correctPosition(firstOrder));
    assert.deepEqual(
        [...firstOrder].map(option => option.id).sort(),
        [...question.options].map(option => option.id).sort()
    );
});

test("correct answers receive time-dependent quiz points and wrong answers receive none", () => {
    const question = data.questions.find(item => item.difficulty === 3);
    const answer = question.correctAnswers;
    const fast = quiz.scoreAnswer(question, answer, 0);
    const slow = quiz.scoreAnswer(question, answer, 60);
    const wrong = quiz.scoreAnswer(question, ["not-an-option"], 0);

    assert.equal(fast.isCorrect, true);
    assert.ok(fast.points > slow.points);
    assert.equal(wrong.isCorrect, false);
    assert.equal(wrong.points, 0);
});

test("multiple-choice questions require the complete answer set", () => {
    const question = data.questions.find(item => item.type === "multiple_choice");

    assert.ok(question);
    assert.equal(quiz.scoreAnswer(question, question.correctAnswers, 4).isCorrect, true);
    assert.equal(quiz.scoreAnswer(question, [question.correctAnswers[0]], 4).isCorrect, false);
});

test("answer streaks reset after a wrong answer and retain their best", () => {
    const question = data.questions[0];
    const correct = question.correctAnswers;
    let stats = quiz.createEmptyStats();
    stats = quiz.recordAnswer(stats, question, correct, 2, "2026-01-05").stats;
    stats = quiz.recordAnswer(stats, question, correct, 2, "2026-01-05").stats;
    stats = quiz.recordAnswer(stats, question, ["wrong"], 2, "2026-01-05").stats;

    assert.equal(stats.currentStreak, 0);
    assert.equal(stats.bestStreak, 2);
});

test("general XP is limited to ten per day and the daily allowance resets", () => {
    const question = data.questions[0];
    const correct = question.correctAnswers;
    let stats = quiz.createEmptyStats();

    for (let index = 0; index < 12; index++) {
        const result = quiz.recordAnswer(stats, question, correct, 1, "2026-01-05");
        stats = result.stats;
        assert.equal(result.xpAwarded, index < 10 ? 1 : 0);
    }
    const nextDay = quiz.recordAnswer(stats, question, correct, 1, "2026-01-06");

    assert.equal(nextDay.xpAwarded, 1);
    assert.equal(nextDay.stats.dailyXpAwarded, 1);
});

test("quiz levels are independent and increase with quiz points", () => {
    assert.equal(quiz.getQuizLevel(0), 1);
    assert.ok(quiz.getQuizLevel(1000) > quiz.getQuizLevel(0));
});

test("completed rounds update local history without duplicate questions", () => {
    const ids = data.questions.slice(0, 10).map(question => question.id);
    const stats = quiz.completeRound(quiz.createEmptyStats(), ids);

    assert.equal(stats.roundsCompleted, 1);
    assert.deepEqual(stats.recentQuestionIds, ids);
    assert.throws(() => quiz.completeRound(stats, [ids[0], ids[0]]), /doppelten Fragen/);
});
