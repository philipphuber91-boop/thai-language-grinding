const DAILY_QUESTS_STORAGE_KEY = "dailyQuests";
const DAILY_QUEST_REWARD_XP = 50;
const DAILY_QUEST_STATE_VERSION = 2;
const WORDMIX_POINTS_STORAGE_KEY = "thaiGigaDrill:v1:wordmix-points";
const WORDMIX_SOLVED_SENTENCES_STORAGE_KEY =
    "thaiGigaDrill:v1:wordmix-solved-sentences";
const THAILAND_QUIZ_STATS_STORAGE_KEY = "thailandQuizStats";

const dailyQuestDefinitions = [
    {
        id: "typing-time",
        category: "core",
        title: "Tippe 7 Minuten",
        description: "Sammle heute 7 Minuten reine aktive Tippzeit.",
        icon: "sanduhr",
        iconAlt: "Lernzeit",
        goal: 7,
        unit: "Min.",
        getProgress: (entry) => Math.floor(Number(entry?.typingTime || 0) / 60)
    },
    {
        id: "active-play-time",
        category: "core",
        title: "Sammle 15 Minuten aktive Spielzeit",
        description: "Die aktive Zeit aus allen Spielen zählt.",
        icon: "sanduhr",
        iconAlt: "Aktive Spielzeit",
        goal: 15,
        unit: "Min.",
        getProgress: (entry) => Math.floor(Number(entry?.playTime || 0) / 60)
    },
    {
        id: "completed-quests",
        category: "core",
        title: "Schließe 1 Quest ab",
        description: "Beende heute eine Lernrunde.",
        icon: "pokal",
        iconAlt: "Abgeschlossene Quests",
        goal: 1,
        unit: "Quests",
        getProgress: (entry) => Number(entry?.quests || 0)
    },
    {
        id: "mastered-words",
        category: "core",
        title: "Meistere 2 neue Wörter",
        description: "Erweitere heute deinen aktiven Wortschatz.",
        icon: "brain",
        iconAlt: "Gemeisterte Wörter",
        goal: 2,
        unit: "Wörter",
        getProgress: (entry, state) =>
            Math.max(
                0,
                Number(player.stats.masteredThaiWords || 0) -
                    Number(state.baseline.masteredThaiWords || 0)
            )
    },
    {
        id: "clean-words",
        category: "core",
        title: "Tippe 30 Wörter fehlerfrei",
        description: "Sammle saubere Sätze ohne Tippfehler.",
        icon: "scharfschütze",
        iconAlt: "Fehlerfreie Wörter",
        goal: 30,
        unit: "Wörter",
        getProgress: (entry, state) =>
            Math.max(
                0,
                Number(player.stats.totalCleanWords || 0) -
                    Number(state.baseline.totalCleanWords || 0)
            )
    },
    {
        id: "daily-accuracy",
        category: "core",
        title: "Erreiche 95 % Genauigkeit",
        description: "Beende heute eine präzise Lernrunde.",
        icon: "scharfschütze",
        iconAlt: "Genauigkeit",
        goal: 95,
        unit: "%",
        getProgress: (entry) => Number(entry?.averageAccuracy || 0)
    },
    {
        id: "wordmix-solved-sentences",
        category: "wordmix",
        title: "Löse 20 Sätze im Wortmix",
        description: "Baue heute zwanzig Sätze richtig zusammen.",
        icon: "brain",
        iconAlt: "Wortmix-Sätze",
        goal: 20,
        unit: "Sätze",
        getProgress: (entry, state) =>
            Math.max(
                0,
                Math.floor(
                    readStoredNumber(WORDMIX_SOLVED_SENTENCES_STORAGE_KEY) -
                        Number(state.baseline.wordMixSolvedSentences || 0)
                )
            )
    },
    {
        id: "wordmix-points",
        category: "wordmix",
        title: "Sammle 500 Wortmix-Punkte",
        description: "Verdiene heute Punkte mit richtig gebauten Sätzen.",
        icon: "pokal",
        iconAlt: "Wortmix-Punkte",
        goal: 500,
        unit: "Punkte",
        getProgress: (entry, state) =>
            Math.max(
                0,
                Math.floor(
                    readStoredNumber(WORDMIX_POINTS_STORAGE_KEY) -
                        Number(state.baseline.wordMixPoints || 0)
                )
            )
    },
    {
        id: "quiz-questions",
        category: "quiz",
        title: "Beantworte 20 Quizfragen",
        description: "Übe heute mit zwanzig Fragen im Thailand-Quiz.",
        icon: "brain",
        iconAlt: "Quizfragen",
        goal: 20,
        unit: "Fragen",
        getProgress: (entry, state) =>
            Math.max(
                0,
                readStoredNumber(
                    THAILAND_QUIZ_STATS_STORAGE_KEY,
                    "totalQuestionsAnswered"
                ) - Number(state.baseline.quizQuestionsAnswered || 0)
            )
    },
    {
        id: "quiz-rounds",
        category: "quiz",
        title: "Beende eine Quizrunde",
        description: "Schließe heute eine Runde im Thailand-Quiz ab.",
        icon: "pokal",
        iconAlt: "Abgeschlossene Quizrunde",
        goal: 1,
        unit: "Runde",
        getProgress: (entry, state) =>
            Math.max(
                0,
                readStoredNumber(
                    THAILAND_QUIZ_STATS_STORAGE_KEY,
                    "roundsCompleted"
                ) - Number(state.baseline.quizRoundsCompleted || 0)
            )
    }
];

function readStoredNumber(storageKey, property) {
    try {
        const storedValue = localStorage.getItem(storageKey);

        if (storedValue === null) {
            return 0;
        }

        const value = property
            ? JSON.parse(storedValue)?.[property]
            : storedValue;
        const number = Number(value);
        return Number.isFinite(number) ? Math.max(0, number) : 0;
    } catch (error) {
        console.warn(`Tagesquest-Fortschritt konnte nicht aus ${storageKey} gelesen werden.`, error);
        return 0;
    }
}

function getDailyQuestDate() {
    return typeof getToday === "function"
        ? getToday()
        : new Date().toISOString().slice(0, 10);
}

function createDailyQuestState(date = getDailyQuestDate()) {
    const questIds = ["core", "wordmix", "quiz"].map(category => {
        const categoryQuests = dailyQuestDefinitions.filter(
            quest => quest.category === category
        );
        return categoryQuests[Math.floor(Math.random() * categoryQuests.length)].id;
    });

    for (let index = questIds.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [questIds[index], questIds[swapIndex]] = [
            questIds[swapIndex],
            questIds[index]
        ];
    }

    return {
        version: DAILY_QUEST_STATE_VERSION,
        date,
        questIds,
        rewardedQuestIds: [],
        baseline: {
            masteredThaiWords: Number(player.stats.masteredThaiWords || 0),
            totalCleanWords: Number(player.stats.totalCleanWords || 0),
            wordMixPoints: readStoredNumber(WORDMIX_POINTS_STORAGE_KEY),
            wordMixSolvedSentences: readStoredNumber(
                WORDMIX_SOLVED_SENTENCES_STORAGE_KEY
            ),
            quizQuestionsAnswered: readStoredNumber(
                THAILAND_QUIZ_STATS_STORAGE_KEY,
                "totalQuestionsAnswered"
            ),
            quizRoundsCompleted: readStoredNumber(
                THAILAND_QUIZ_STATS_STORAGE_KEY,
                "roundsCompleted"
            )
        }
    };
}

function getDailyQuestState() {
    const today = getDailyQuestDate();
    let state = null;

    try {
        state = JSON.parse(localStorage.getItem(DAILY_QUESTS_STORAGE_KEY) || "null");
    } catch (error) {
        console.warn("Tagesquests konnten nicht geladen werden.", error);
    }

    const validIds = state?.version === DAILY_QUEST_STATE_VERSION &&
        Array.isArray(state?.questIds) &&
        state.questIds.length === 3 &&
        new Set(state.questIds).size === 3 &&
        state.questIds.every(id =>
            dailyQuestDefinitions.some(quest => quest.id === id)
        ) &&
        ["core", "wordmix", "quiz"].every(category =>
            state.questIds.some(id =>
                dailyQuestDefinitions.find(quest => quest.id === id)?.category === category
            )
        );

    if (!validIds || state.date !== today) {
        state = createDailyQuestState(today);
        localStorage.setItem(DAILY_QUESTS_STORAGE_KEY, JSON.stringify(state));
    } else if (!Array.isArray(state.rewardedQuestIds)) {
        state.rewardedQuestIds = [];
        localStorage.setItem(DAILY_QUESTS_STORAGE_KEY, JSON.stringify(state));
    }

    return state;
}

function getDailyQuestEntry() {
    const today = getDailyQuestDate();
    return player.stats.history?.daily?.find(entry => entry.date === today) || null;
}

function getDailyQuestCards() {
    const state = getDailyQuestState();
    const entry = getDailyQuestEntry();

    return state.questIds
        .map(id => dailyQuestDefinitions.find(quest => quest.id === id))
        .filter(Boolean)
        .map(quest => {
            const progress = Math.min(
                quest.goal,
                Math.max(0, quest.getProgress(entry, state))
            );

            return {
                ...quest,
                progress,
                percent: Math.round((progress / quest.goal) * 100),
                completed: progress >= quest.goal
            };
        });
}

function claimDailyQuestRewards(state, cards) {
    const rewardedQuestIds = new Set(
        Array.isArray(state.rewardedQuestIds)
            ? state.rewardedQuestIds
            : []
    );
    let stateChanged = false;

    cards.forEach(quest => {
        if (!quest.completed || rewardedQuestIds.has(quest.id)) {
            return;
        }

        awardPlayerXp(DAILY_QUEST_REWARD_XP);
        rewardedQuestIds.add(quest.id);
        stateChanged = true;
    });

    if (!stateChanged) {
        return;
    }

    state.rewardedQuestIds = [...rewardedQuestIds];
    localStorage.setItem(DAILY_QUESTS_STORAGE_KEY, JSON.stringify(state));
}

function renderDailyQuests() {
    const container = document.getElementById("dailyQuestList");

    if (!container) {
        return;
    }

    const state = getDailyQuestState();
    const cards = getDailyQuestCards();
    claimDailyQuestRewards(state, cards);

    container.innerHTML = cards
        .map(quest => `
            <article class="daily-quest-card${quest.completed ? " is-complete" : ""}">
                <div class="daily-quest-icon">
                    <img src="../assets/icons/achievements/${quest.icon}.png" alt="${quest.iconAlt}">
                </div>
                <div class="daily-quest-content">
                    <div class="daily-quest-heading">
                        <strong>${quest.title}</strong>
                        <span>${quest.progress} / ${quest.goal} ${quest.unit}</span>
                    </div>
                    <p>${quest.description}</p>
                    <div class="daily-quest-track" aria-label="${quest.progress} von ${quest.goal} erreicht">
                        <div class="daily-quest-fill" style="width:${quest.percent}%"></div>
                    </div>
                    <div class="daily-quest-reward">
                        Belohnung: +${DAILY_QUEST_REWARD_XP} XP
                    </div>
                </div>
                <span class="daily-quest-status" aria-label="${quest.completed ? "Abgeschlossen" : "Offen"}">
                    ${quest.completed ? "✓" : ""}
                </span>
            </article>
        `)
        .join("");
}

function initializeDailyQuests() {
    getDailyQuestState();
    renderDailyQuests();

    document.getElementById("dailyQuestDetailsButton")?.addEventListener(
        "click",
        event => {
            const list = document.getElementById("dailyQuestList");
            const expanded = list.classList.toggle("is-expanded");
            event.currentTarget.textContent = expanded
                ? "Tagesquests einklappen"
                : "Alle täglichen Quests anzeigen";
        }
    );
}

window.addEventListener("storage", event => {
    if (
        [
            "player",
            "questStats",
            WORDMIX_POINTS_STORAGE_KEY,
            WORDMIX_SOLVED_SENTENCES_STORAGE_KEY,
            THAILAND_QUIZ_STATS_STORAGE_KEY
        ].includes(event.key)
    ) {
        renderDailyQuests();
    }
});

initializeDailyQuests();
