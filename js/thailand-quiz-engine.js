(function (root) {
    "use strict";

    const QUESTION_COUNT = 10;
    const MAX_GENERAL_XP_PER_DAY = 10;
    const GENERAL_XP_PER_CORRECT_ANSWER = 1;
    const RECENT_QUESTION_LIMIT = 20;
    const BASE_POINTS = [0, 5, 8, 12, 18, 25];
    const QUESTION_TYPES = new Set([
        "single_choice",
        "multiple_choice",
        "true_false"
    ]);

    function validateQuestionBank(data) {
        const errors = [];
        const categories = Array.isArray(data?.categories) ? data.categories : [];
        const questions = Array.isArray(data?.questions) ? data.questions : [];
        const categoryIds = new Set(categories.map(category => category.id));
        const questionIds = new Set();

        if (categories.length === 0) {
            errors.push("Die Fragebank benötigt mindestens eine Kategorie.");
        }
        if (questions.length < QUESTION_COUNT) {
            errors.push(`Die Fragebank benötigt mindestens ${QUESTION_COUNT} Fragen.`);
        }

        for (const question of questions) {
            if (!question?.id || questionIds.has(question.id)) {
                errors.push(`Frage-ID fehlt oder ist doppelt: ${question?.id || "(leer)"}`);
            }
            questionIds.add(question?.id);

            if (!categoryIds.has(question?.categoryId)) {
                errors.push(`${question?.id || "Frage"} verweist auf eine unbekannte Kategorie.`);
            }
            if (!Number.isInteger(question?.difficulty) || question.difficulty < 1 || question.difficulty > 5) {
                errors.push(`${question?.id || "Frage"} hat einen ungültigen Schwierigkeitsgrad.`);
            }
            if (!QUESTION_TYPES.has(question?.type)) {
                errors.push(`${question?.id || "Frage"} hat einen unbekannten Fragetyp.`);
            }
            if (!question?.question?.th || !question?.question?.de) {
                errors.push(`${question?.id || "Frage"} benötigt Thai- und Deutsch-Fragetext.`);
            }
            if (!Array.isArray(question?.options) || question.options.length < 2) {
                errors.push(`${question?.id || "Frage"} benötigt mindestens zwei Antwortmöglichkeiten.`);
                continue;
            }

            const optionIds = new Set();
            for (const option of question.options) {
                if (!option?.id || optionIds.has(option.id)) {
                    errors.push(`${question.id} enthält eine fehlende oder doppelte Antwort-ID.`);
                }
                optionIds.add(option?.id);
                if (!option?.th || !option?.de) {
                    errors.push(`${question.id} enthält eine Antwort ohne Thai- oder Deutschtext.`);
                }
            }

            const correctAnswers = question.correctAnswers;
            if (
                !Array.isArray(correctAnswers) ||
                correctAnswers.length === 0 ||
                correctAnswers.some(id => !optionIds.has(id))
            ) {
                errors.push(`${question.id} enthält ungültige richtige Antworten.`);
            } else if (
                question.type !== "multiple_choice" &&
                correctAnswers.length !== 1
            ) {
                errors.push(`${question.id} muss genau eine richtige Antwort haben.`);
            } else if (
                question.type === "multiple_choice" &&
                correctAnswers.length < 2
            ) {
                errors.push(`${question.id} benötigt mehrere richtige Antworten.`);
            }

            if (!question?.explanation?.th || !question?.explanation?.de) {
                errors.push(`${question.id} benötigt eine Erklärung auf Thai und Deutsch.`);
            }
        }

        return errors;
    }

    function shuffle(items, random) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index--) {
            const target = Math.floor(random() * (index + 1));
            [result[index], result[target]] = [result[target], result[index]];
        }
        return result;
    }

    function shuffleOptions(options, previousOrder = [], random = Math.random, correctIds = []) {
        if (!Array.isArray(options) || !Array.isArray(previousOrder) || !Array.isArray(correctIds)) {
            throw new TypeError("Antworten, die vorige Reihenfolge und richtige IDs müssen Listen sein.");
        }
        if (typeof random !== "function") {
            throw new TypeError("Der Zufallsgenerator muss eine Funktion sein.");
        }
        const optionIds = options.map(option => option?.id);
        const uniqueOptionIds = new Set(optionIds);
        if (
            optionIds.some(id => typeof id !== "string" || !id) ||
            uniqueOptionIds.size !== optionIds.length
        ) {
            throw new Error("Antworten benötigen eindeutige IDs, um sie sicher zu mischen.");
        }
        const correctSet = new Set(correctIds);
        if (correctIds.some(id => !uniqueOptionIds.has(id))) {
            throw new Error("Eine richtige Antwort-ID ist in den Antwortmöglichkeiten nicht vorhanden.");
        }

        let result = shuffle(options, random);
        const previousIsValid =
            previousOrder.length === optionIds.length &&
            new Set(previousOrder).size === optionIds.length &&
            previousOrder.every(id => uniqueOptionIds.has(id));
        if (!previousIsValid || options.length < 2) {
            return result;
        }

        const previousOrderMatches = order =>
            order.every((option, index) => option.id === previousOrder[index]);
        const correctPositionsMatch = order => {
            const priorPositions = [...correctSet]
                .map(id => previousOrder.indexOf(id))
                .sort((left, right) => left - right);
            const newPositions = [...correctSet]
                .map(id => order.findIndex(option => option.id === id))
                .sort((left, right) => left - right);
            return priorPositions.every((position, index) => position === newPositions[index]);
        };
        const canMoveCorrectPositions =
            correctSet.size > 0 && correctSet.size < options.length;

        if (
            previousOrderMatches(result) ||
            (canMoveCorrectPositions && correctPositionsMatch(result))
        ) {
            for (let offset = 1; offset < result.length; offset++) {
                const rotated = [...result.slice(offset), ...result.slice(0, offset)];
                if (
                    !previousOrderMatches(rotated) &&
                    (!canMoveCorrectPositions || !correctPositionsMatch(rotated))
                ) {
                    result = rotated;
                    break;
                }
            }
        }
        return result;
    }

    function filterQuestions(questions, filters = {}) {
        if (!Array.isArray(questions)) {
            throw new TypeError("Die Fragen müssen als Liste übergeben werden.");
        }
        const categories = Array.isArray(filters.categories)
            ? new Set(filters.categories)
            : null;
        const difficulties = Array.isArray(filters.difficulties)
            ? new Set(filters.difficulties.map(Number))
            : null;

        return questions.filter(question =>
            (!categories || categories.has(question.categoryId)) &&
            (!difficulties || difficulties.has(question.difficulty))
        );
    }

    function selectRound(
        questions,
        recentIds = [],
        random = Math.random,
        count = QUESTION_COUNT,
        filters = {}
    ) {
        if (!Number.isInteger(count) || count < 1 || count > 100) {
            throw new RangeError("Die Rundengröße muss zwischen 1 und 100 liegen.");
        }
        if (typeof random !== "function") {
            throw new TypeError("Der Zufallsgenerator muss eine Funktion sein.");
        }

        const filteredQuestions = filterQuestions(questions, filters);
        if (filteredQuestions.length === 0) {
            return [];
        }
        const targetCount = Math.min(count, filteredQuestions.length);
        const recent = new Set(recentIds);
        const freshQuestions = filteredQuestions.filter(question => !recent.has(question.id));
        const pool = shuffle(
            freshQuestions.length >= targetCount ? freshQuestions : filteredQuestions,
            random
        );
        const categoryCounts = new Map();
        const difficultyCounts = new Map();
        const selected = [];
        const categoryLimit = Math.ceil(
            targetCount / new Set(filteredQuestions.map(q => q.categoryId)).size
        );
        const difficultyLimit = Math.ceil(targetCount / new Set(filteredQuestions.map(q => q.difficulty)).size);

        for (const question of pool) {
            if (selected.length === targetCount) {
                break;
            }
            if (
                (categoryCounts.get(question.categoryId) || 0) >= categoryLimit ||
                (difficultyCounts.get(question.difficulty) || 0) >= difficultyLimit
            ) {
                continue;
            }
            selected.push(question);
            categoryCounts.set(
                question.categoryId,
                (categoryCounts.get(question.categoryId) || 0) + 1
            );
            difficultyCounts.set(
                question.difficulty,
                (difficultyCounts.get(question.difficulty) || 0) + 1
            );
        }

        if (selected.length < count) {
            for (const question of pool) {
                if (selected.length === targetCount) {
                    break;
                }
                if (selected.some(item => item.id === question.id)) {
                    continue;
                }
                selected.push(question);
            }
        }

        if (selected.length !== targetCount) {
            throw new Error(`Die Fragebank lieferte nur ${selected.length} eindeutige Fragen.`);
        }
        return selected;
    }

    function createEndlessCycle(questions, random = Math.random, previousQuestionId = "") {
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new RangeError("Für den Endlosmodus werden passende Fragen benötigt.");
        }
        if (typeof random !== "function") {
            throw new TypeError("Der Zufallsgenerator muss eine Funktion sein.");
        }
        const questionIds = new Set(questions.map(question => question.id));
        if (questionIds.size !== questions.length) {
            throw new Error("Der Endlos-Fragenpool darf keine doppelten Fragen enthalten.");
        }

        let bag = [];
        let lastQuestionId = previousQuestionId;

        function refill() {
            bag = shuffle(questions, random);
            if (
                bag.length > 1 &&
                bag[0].id === lastQuestionId
            ) {
                const differentIndex = bag.findIndex(
                    question => question.id !== lastQuestionId
                );
                [bag[0], bag[differentIndex]] = [bag[differentIndex], bag[0]];
            }
        }

        return {
            next() {
                if (bag.length === 0) {
                    refill();
                }
                const question = bag.shift();
                lastQuestionId = question.id;
                return question;
            }
        };
    }

    function scoreAnswer(question, selectedIds, elapsedSeconds) {
        if (!Array.isArray(selectedIds)) {
            throw new TypeError("Ausgewählte Antwort-IDs müssen als Liste übergeben werden.");
        }
        const elapsed = Number(elapsedSeconds);
        if (!Number.isFinite(elapsed) || elapsed < 0) {
            throw new RangeError("Die Antwortzeit muss eine nicht negative Zahl sein.");
        }

        const selected = [...new Set(selectedIds)].sort();
        const correct = [...question.correctAnswers].sort();
        const isCorrect =
            selected.length === correct.length &&
            selected.every((id, index) => id === correct[index]);
        const timeMultiplier = Math.max(0.25, 1.4 - elapsed / 30);
        const points = isCorrect
            ? Math.round(BASE_POINTS[question.difficulty] * timeMultiplier)
            : 0;

        return {
            isCorrect,
            points,
            timeMultiplier,
            elapsedSeconds: elapsed,
            selectedIds: selected
        };
    }

    function createEmptyStats() {
        return {
            totalQuestionsAnswered: 0,
            correctAnswers: 0,
            totalQuizPoints: 0,
            currentStreak: 0,
            bestStreak: 0,
            roundsCompleted: 0,
            recentQuestionIds: [],
            dailyXpDate: "",
            dailyXpAwarded: 0
        };
    }

    function normalizeStats(stats) {
        const defaults = createEmptyStats();
        const source = stats && typeof stats === "object" ? stats : {};
        const normalized = { ...defaults };
        for (const key of [
            "totalQuestionsAnswered",
            "correctAnswers",
            "totalQuizPoints",
            "currentStreak",
            "bestStreak",
            "roundsCompleted",
            "dailyXpAwarded"
        ]) {
            const value = Number(source[key]);
            normalized[key] = Number.isFinite(value) && value >= 0
                ? Math.floor(value)
                : 0;
        }
        normalized.recentQuestionIds = Array.isArray(source.recentQuestionIds)
            ? [...new Set(source.recentQuestionIds.filter(id => typeof id === "string"))]
                .slice(-RECENT_QUESTION_LIMIT)
            : [];
        normalized.dailyXpDate = typeof source.dailyXpDate === "string"
            ? source.dailyXpDate
            : "";
        normalized.dailyXpAwarded = Math.min(
            normalized.dailyXpAwarded,
            MAX_GENERAL_XP_PER_DAY
        );
        normalized.correctAnswers = Math.min(
            normalized.correctAnswers,
            normalized.totalQuestionsAnswered
        );
        normalized.bestStreak = Math.max(
            normalized.bestStreak,
            normalized.currentStreak
        );
        return normalized;
    }

    function recordAnswer(stats, question, selectedIds, elapsedSeconds, dateKey) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
            throw new TypeError("Das Quizdatum muss das Format JJJJ-MM-TT haben.");
        }
        const normalized = normalizeStats(stats);
        const answer = scoreAnswer(question, selectedIds, elapsedSeconds);

        if (normalized.dailyXpDate !== dateKey) {
            normalized.dailyXpDate = dateKey;
            normalized.dailyXpAwarded = 0;
        }
        normalized.totalQuestionsAnswered++;

        if (answer.isCorrect) {
            normalized.correctAnswers++;
            normalized.currentStreak++;
            normalized.bestStreak = Math.max(
                normalized.bestStreak,
                normalized.currentStreak
            );
            normalized.totalQuizPoints += answer.points;
        } else {
            normalized.currentStreak = 0;
        }

        const xpAwarded = answer.isCorrect &&
            normalized.dailyXpAwarded < MAX_GENERAL_XP_PER_DAY
            ? GENERAL_XP_PER_CORRECT_ANSWER
            : 0;
        normalized.dailyXpAwarded += xpAwarded;

        return { stats: normalized, answer, xpAwarded };
    }

    function completeRound(stats, questionIds) {
        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            throw new TypeError("Zum Abschließen einer Runde werden Frage-IDs benötigt.");
        }
        const uniqueIds = [...new Set(questionIds)];
        if (uniqueIds.length !== questionIds.length) {
            throw new Error("Eine Quizrunde darf keine doppelten Fragen enthalten.");
        }
        const normalized = normalizeStats(stats);
        normalized.roundsCompleted++;
        normalized.recentQuestionIds = [
            ...normalized.recentQuestionIds.filter(id => !uniqueIds.includes(id)),
            ...uniqueIds
        ].slice(-RECENT_QUESTION_LIMIT);
        return normalized;
    }

    function getQuizLevel(totalPoints) {
        const points = Number(totalPoints);
        if (!Number.isFinite(points) || points < 0) {
            throw new RangeError("Quizpunkte müssen eine nicht negative Zahl sein.");
        }
        let level = 1;
        while (
            level < 1000 &&
            points >= Math.round(150 * Math.pow(level, 1.5))
        ) {
            level++;
        }
        return level;
    }

    const engine = {
        QUESTION_COUNT,
        MAX_GENERAL_XP_PER_DAY,
        validateQuestionBank,
        shuffleOptions,
        filterQuestions,
        selectRound,
        createEndlessCycle,
        scoreAnswer,
        createEmptyStats,
        normalizeStats,
        recordAnswer,
        completeRound,
        getQuizLevel
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = engine;
    }
    if (root) {
        root.THAILAND_QUIZ_ENGINE = engine;
    }
})(typeof window !== "undefined" ? window : null);
