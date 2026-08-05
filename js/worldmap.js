function getWorldMapNodePosition(index) {
    const column = Math.floor(index / 3);
    const lane = index % 3;

    return {
        x: 7 + (column % 14) * 6.6,
        y: 22 + lane * 27 + (Math.floor(column / 14) * 7)
    };
}

function getCampaignQuestIds() {
    return Object.keys(quests)
        .sort((left, right) => Number(left) - Number(right));
}

function getCampaignUnlockState(questNumber) {
    const previousMode = contentMode;
    contentMode = "campaign";
    const unlockState = getQuestUnlockState(
        quests[questNumber],
        questNumber
    );
    contentMode = previousMode;
    return unlockState;
}

function getCampaignQuestStats(questNumber) {
    return getQuestStats(
        `campaign:${questNumber}`,
        quests[questNumber]?.version ?? 1
    );
}

function openCampaignQuestFromMap(questNumber) {
    contentMode = "campaign";
    starteQuest(questNumber);
}

function renderWorldMap() {
    const map = document.getElementById("worldMap");

    if (!map) {
        return;
    }

    const questIds = getCampaignQuestIds();
    const path = `
        <svg class="world-map-route" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M 12 76 C 18 68, 19 66, 25 62 S 34 66, 38 70 S 45 56, 51 50 S 60 56, 64 58 S 70 42, 75 38 S 81 42, 84 46 S 76 28, 68 23 S 58 17, 50 18 S 41 20, 34 30"></path>
        </svg>
    `;

    map.innerHTML = `
        <div class="world-map-image" aria-hidden="true"></div>
        <div class="world-map-overlay" aria-hidden="true"></div>
        ${path}
        <div class="world-map-nodes"></div>
        <div class="world-map-legend">
            <span><i class="legend-dot legend-dot-current"></i>Aktueller Flow</span>
            <span><i class="legend-dot legend-dot-locked">⌕</i>Gesperrt</span>
        </div>
    `;

    const nodes = map.querySelector(".world-map-nodes");

    questIds.forEach((questNumber, index) => {
        const quest = quests[questNumber];
        const stats = getCampaignQuestStats(questNumber);
        const unlockState = getCampaignUnlockState(questNumber);
        const position = getWorldMapNodePosition(index);
        const node = document.createElement("button");
        const isCompleted = Boolean(stats.completed);
        const isCurrent = unlockState.unlocked && !isCompleted;

        node.type = "button";
        node.className = [
            "world-map-node",
            isCompleted ? "is-complete" : "",
            isCurrent ? "is-current" : "",
            unlockState.unlocked ? "" : "is-locked"
        ].filter(Boolean).join(" ");
        node.style.left = `${position.x}%`;
        node.style.top = `${position.y}%`;
        node.setAttribute(
            "aria-label",
            `${quest.titel}${unlockState.unlocked
                ? " öffnen"
                : ` gesperrt: ${unlockState.requirementText}`}`
        );
        node.innerHTML = `
            <span class="world-map-node-orb" aria-hidden="true">
                ${unlockState.unlocked ? (isCompleted ? "✓" : questNumber) : "🔒"}
            </span>
            <span class="world-map-node-label">${quest.beschreibung}</span>
        `;
        node.addEventListener("click", () => {
            openCampaignQuestFromMap(questNumber);
        });
        nodes.appendChild(node);
    });
}

function getDailyStreak() {
    const entries = Array.isArray(player.stats.history?.daily)
        ? player.stats.history.daily
        : [];
    const dates = new Set(entries.map(entry => entry.date));
    let streak = 0;
    let date = new Date();

    while (dates.has(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    )) {
        streak++;
        date.setDate(date.getDate() - 1);
    }

    return streak;
}

function renderHomePlayer() {
    const xpSummary = getPlayerXpSummary();
    const xpFill = document.getElementById("homeXpFill");

    document.getElementById("homeLevelLabel").textContent =
        `Level ${xpSummary.level}`;
    document.getElementById("homeLevelBadge").textContent =
        String(xpSummary.level);
    document.getElementById("homeXpLabel").textContent =
        `${xpSummary.progressXp} / ${xpSummary.requiredXp} XP`;
    document.getElementById("homeXpValue").textContent =
        xpSummary.totalXp.toLocaleString("de-DE");
    document.getElementById("homeQuestCountValue").textContent =
        String(player.stats.completedQuests || 0);
    document.getElementById("homeStreakValue").textContent =
        String(getDailyStreak());

    if (xpFill) {
        xpFill.style.width = `${xpSummary.percent}%`;
    }
}

function renderHomeStatistics() {
    const container = document.getElementById("homeStatistics");

    if (!container) {
        return;
    }

    const statistics = [
        ["book", "Neue Wörter", Number(player.stats.totalThaiWords || 0), "Wörter gelernt"],
        ["brain", "Gemeisterte Wörter", Number(player.stats.masteredThaiWords || 0), "Wörter gemeistert"],
        ["blitz", "Bestes Tempo", Number(player.stats.bestCPM || 0), "CPM Rekord"],
        ["scharfschütze", "Beste Genauigkeit", `${Number(player.stats.bestAccuracy || 0).toFixed(1)} %`, "Genauigkeit"]
    ];

    container.innerHTML = statistics.map(([icon, iconAlt, value, label]) => `
        <article class="home-statistic">
            <span class="home-statistic-icon">
                <img src="../assets/icons/achievements/${icon}.png" alt="${iconAlt}">
            </span>
            <strong>${typeof value === "number" ? value.toLocaleString("de-DE") : value}</strong>
            <span>${label}</span>
        </article>
    `).join("");
}

function getCampaignRecommendations() {
    const questIds = getCampaignQuestIds();
    const recommendations = questIds.filter(questNumber => {
        const stats = getCampaignQuestStats(questNumber);
        const unlockState = getCampaignUnlockState(questNumber);
        return unlockState.unlocked && (!stats.completed ||
            getQuestStatus(`campaign:${questNumber}`, quests[questNumber].version ?? 1) === "due");
    });

    return (recommendations.length > 0 ? recommendations : questIds).slice(0, 3);
}

function renderCampaignRecommendations() {
    const container = document.getElementById("campaignRecommendations");

    if (!container) {
        return;
    }

    const recommendationIds = getCampaignRecommendations();
    container.innerHTML = recommendationIds.map(questNumber => {
        const quest = quests[questNumber];
        const stats = getCampaignQuestStats(questNumber);
        const unlockState = getCampaignUnlockState(questNumber);
        const progress = stats.completed
            ? Math.min(100, Math.round(((stats.repetition.level + 1) / 8) * 100))
            : 0;

        return `
            <button class="campaign-recommendation${unlockState.unlocked ? "" : " is-locked"}" type="button" data-quest-number="${questNumber}">
                <span class="campaign-recommendation-image">
                    <img src="../assets/quest/${quest.bild}.png" alt="">
                </span>
                <span class="campaign-recommendation-content">
                    <strong>${quest.beschreibung}</strong>
                    <small>${quest.kapitel} · ${quest.schwierigkeit} · ${quest.xp} XP</small>
                    <span class="recommendation-progress"><i style="width:${progress}%"></i></span>
                </span>
                <span class="campaign-recommendation-percent">${stats.completed ? `${progress}%` : "Neu"}</span>
            </button>
        `;
    }).join("");

    container.querySelectorAll("[data-quest-number]").forEach(button => {
        button.addEventListener("click", () => {
            openCampaignQuestFromMap(button.dataset.questNumber);
        });
    });

    const startButton = document.getElementById("recommendationStartButton");
    if (startButton) {
        startButton.onclick = () => {
            const firstRecommendation = recommendationIds[0];
            if (firstRecommendation) {
                openCampaignQuestFromMap(firstRecommendation);
            }
        };
    }
}

function renderWorldMapHome() {
    renderHomePlayer();
    renderDailyQuests();
    renderWorldMap();
    renderCampaignRecommendations();
    renderHomeStatistics();
}

document.getElementById("homeStatisticsButton")?.addEventListener(
    "click",
    () => switchContent("chronik")
);

switchContent("worldmap");
