const DAILY_QUESTS_STORAGE_KEY = "dailyQuests";

const dailyQuestDefinitions = [
    {
        id: "typing-time",
        title: "Tippe 20 Minuten",
        description: "Sammle heute aktive Lernzeit.",
        icon: "sanduhr",
        iconAlt: "Lernzeit",
        goal: 20,
        unit: "Min.",
        getProgress: (entry) => Math.floor(Number(entry?.playTime || 0) / 60)
    },
    {
        id: "completed-quests",
        title: "Schließe 3 Quests ab",
        description: "Beende heute drei Lernrunden.",
        icon: "pokal",
        iconAlt: "Abgeschlossene Quests",
        goal: 3,
        unit: "Quests",
        getProgress: (entry) => Number(entry?.quests || 0)
    },
    {
        id: "mastered-words",
        title: "Meistere 10 neue Wörter",
        description: "Erweitere heute deinen aktiven Wortschatz.",
        icon: "brain",
        iconAlt: "Gemeisterte Wörter",
        goal: 10,
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
        title: "Erreiche 95 % Genauigkeit",
        description: "Beende heute eine präzise Lernrunde.",
        icon: "scharfschütze",
        iconAlt: "Genauigkeit",
        goal: 95,
        unit: "%",
        getProgress: (entry) => Number(entry?.averageAccuracy || 0)
    }
];

function getDailyQuestDate() {
    return typeof getToday === "function"
        ? getToday()
        : new Date().toISOString().slice(0, 10);
}

function createDailyQuestState(date = getDailyQuestDate()) {
    const shuffledIds = [...dailyQuestDefinitions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(quest => quest.id);

    return {
        date,
        questIds: shuffledIds,
        baseline: {
            masteredThaiWords: Number(player.stats.masteredThaiWords || 0),
            totalCleanWords: Number(player.stats.totalCleanWords || 0)
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

    const validIds = Array.isArray(state?.questIds) &&
        state.questIds.length === 3 &&
        state.questIds.every(id =>
            dailyQuestDefinitions.some(quest => quest.id === id)
        );

    if (!validIds || state.date !== today) {
        state = createDailyQuestState(today);
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

function renderDailyQuests() {
    const container = document.getElementById("dailyQuestList");

    if (!container) {
        return;
    }

    container.innerHTML = getDailyQuestCards()
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
    if (event.key === "player" || event.key === "questStats") {
        renderDailyQuests();
    }
});

initializeDailyQuests();
