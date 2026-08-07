const WORLD_MAP_PAGE_SIZE = 5;
const WORLD_MAP_PAGE_LAYOUTS = [
    {
        backgroundPosition: "left center",
        path: "M 12 72 C 22 66, 28 53, 38 57 S 48 76, 58 65 S 70 35, 86 45",
        positions: [
            { x: 12, y: 72 },
            { x: 28, y: 53 },
            { x: 48, y: 76 },
            { x: 70, y: 35 },
            { x: 86, y: 45 }
        ]
    },
    {
        backgroundPosition: "28% center",
        path: "M 13 42 C 24 55, 28 72, 42 64 S 55 30, 67 42 S 76 70, 88 57",
        positions: [
            { x: 13, y: 42 },
            { x: 28, y: 72 },
            { x: 55, y: 30 },
            { x: 76, y: 70 },
            { x: 88, y: 57 }
        ]
    },
    {
        backgroundPosition: "52% center",
        path: "M 12 67 C 22 50, 29 43, 40 52 S 50 78, 62 62 S 74 30, 88 39",
        positions: [
            { x: 12, y: 67 },
            { x: 29, y: 43 },
            { x: 50, y: 78 },
            { x: 74, y: 30 },
            { x: 88, y: 39 }
        ]
    },
    {
        backgroundPosition: "76% center",
        path: "M 12 38 C 23 48, 26 70, 39 62 S 51 27, 63 39 S 77 66, 89 51",
        positions: [
            { x: 12, y: 38 },
            { x: 26, y: 70 },
            { x: 51, y: 27 },
            { x: 77, y: 66 },
            { x: 89, y: 51 }
        ]
    },
    {
        backgroundPosition: "right center",
        path: "M 12 67 C 22 56, 30 36, 42 47 S 52 73, 64 61 S 76 34, 88 42",
        positions: [
            { x: 12, y: 67 },
            { x: 30, y: 36 },
            { x: 52, y: 73 },
            { x: 76, y: 34 },
            { x: 88, y: 42 }
        ]
    }
];

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

function getCampaignQuestFamiliarityCategory(questNumber) {
    const quest = quests[questNumber];
    const familiarityStats = getThaiWordFamiliarityStatistics(
        quest.thaiZeilen,
        player.stats.wordStats
    );

    return {
        familiarityStats,
        category: getThaiWordFamiliarityCategory(familiarityStats)
    };
}

function openCampaignQuestFromMap(questNumber) {
    contentMode = "campaign";
    starteQuest(questNumber);
}

function getWorldMapPages(questIds) {
    const pages = [];

    for (let index = 0; index < questIds.length; index += WORLD_MAP_PAGE_SIZE) {
        pages.push(questIds.slice(index, index + WORLD_MAP_PAGE_SIZE));
    }

    return pages;
}

function getWorldMapStartPage(questIds, pages) {
    let highestUnlockedIndex = 0;

    questIds.forEach((questNumber, index) => {
        if (getCampaignUnlockState(questNumber).unlocked) {
            highestUnlockedIndex = index;
        }
    });

    return Math.min(
        pages.length - 1,
        Math.floor(highestUnlockedIndex / WORLD_MAP_PAGE_SIZE)
    );
}

function renderWorldMap() {
    const map = document.getElementById("worldMap");

    if (!map) {
        return;
    }

    const questIds = getCampaignQuestIds();
    const pages = getWorldMapPages(questIds);
    const startPage = getWorldMapStartPage(questIds, pages);

    map.innerHTML = `
        <div class="world-map-viewport" tabindex="0" aria-label="Weltkartenabschnitte">
            <div class="world-map-pages"></div>
        </div>
        <button class="world-map-arrow world-map-arrow-previous" type="button"
                aria-label="Vorherigen Kartenabschnitt anzeigen">‹</button>
        <button class="world-map-arrow world-map-arrow-next" type="button"
                aria-label="Nächsten Kartenabschnitt anzeigen">›</button>
        <div class="world-map-pagination" aria-label="Kartenabschnitt auswählen"></div>
    `;

    const pagesContainer = map.querySelector(".world-map-pages");
    const pagination = map.querySelector(".world-map-pagination");
    const viewport = map.querySelector(".world-map-viewport");
    const previousButton = map.querySelector(".world-map-arrow-previous");
    const nextButton = map.querySelector(".world-map-arrow-next");

    pages.forEach((pageQuestIds, pageIndex) => {
        const layout = WORLD_MAP_PAGE_LAYOUTS[
            pageIndex % WORLD_MAP_PAGE_LAYOUTS.length
        ];
        const page = document.createElement("section");
        const pageNodes = document.createElement("div");

        page.className = "world-map-page";
        page.dataset.pageIndex = String(pageIndex);
        page.style.setProperty(
            "--world-map-background-position",
            layout.backgroundPosition
        );
        page.setAttribute(
            "aria-label",
            `Kartenabschnitt ${pageIndex + 1} von ${pages.length}`
        );
        page.innerHTML = `
            <div class="world-map-image" aria-hidden="true"></div>
            <div class="world-map-overlay" aria-hidden="true"></div>
            <svg class="world-map-route" viewBox="0 0 100 100" aria-hidden="true">
                <path d="${layout.path}"></path>
            </svg>
        `;
        pageNodes.className = "world-map-nodes";

        pageQuestIds.forEach((questNumber, nodeIndex) => {
            const quest = quests[questNumber];
            const stats = getCampaignQuestStats(questNumber);
            const unlockState = getCampaignUnlockState(questNumber);
            const position = layout.positions[nodeIndex];
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
            pageNodes.appendChild(node);
        });

        page.appendChild(pageNodes);
        pagesContainer.appendChild(page);

        const pageButton = document.createElement("button");
        pageButton.type = "button";
        pageButton.className = "world-map-page-dot";
        pageButton.dataset.pageIndex = String(pageIndex);
        pageButton.setAttribute(
            "aria-label",
            `Kartenabschnitt ${pageIndex + 1} anzeigen`
        );
        pageButton.addEventListener("click", () => {
            scrollToWorldMapPage(viewport, pageIndex);
        });
        pagination.appendChild(pageButton);
    });

    const updateNavigation = () => {
        const pageWidth = viewport.clientWidth || 1;
        const activePage = Math.max(
            0,
            Math.min(
                pages.length - 1,
                Math.round(viewport.scrollLeft / pageWidth)
            )
        );

        map.dataset.activePage = String(activePage);
        previousButton.disabled = activePage === 0;
        nextButton.disabled = activePage === pages.length - 1;
        pagination.querySelectorAll(".world-map-page-dot").forEach(
            (button, index) => {
                const isActive = index === activePage;
                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-current", isActive ? "page" : "false");
            }
        );
    };

    viewport.addEventListener("scroll", updateNavigation, { passive: true });
    previousButton.addEventListener("click", () => {
        scrollToWorldMapPage(
            viewport,
            Math.max(0, Number(map.dataset.activePage || startPage) - 1)
        );
    });
    nextButton.addEventListener("click", () => {
        scrollToWorldMapPage(
            viewport,
            Math.min(pages.length - 1, Number(map.dataset.activePage || startPage) + 1)
        );
    });
    viewport.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previousButton.click();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nextButton.click();
        }
    });

    requestAnimationFrame(() => {
        scrollToWorldMapPage(viewport, startPage, false);
        updateNavigation();
    });
}

function scrollToWorldMapPage(viewport, pageIndex, smooth = true) {
    viewport.scrollTo({
        left: viewport.clientWidth * pageIndex,
        behavior: smooth ? "smooth" : "auto"
    });
}

function getDailyStreak() {
    const entries = Array.isArray(player.stats.history?.daily)
        ? player.stats.history.daily
        : [];
    const dates = new Set(entries.map(entry => entry.date));
    const today = getToday();
    const yesterday = addDays(today, -1);
    let streakStart = dates.has(today)
        ? today
        : dates.has(yesterday)
            ? yesterday
            : null;

    if (!streakStart) {
        return 0;
    }

    let streak = 0;
    while (dates.has(streakStart)) {
        streak++;
        streakStart = addDays(streakStart, -1);
    }

    return streak;
}

function renderHomePlayer() {
    const xpSummary = getPlayerXpSummary();
    const profileCard = document.getElementById("homeProfileCard");

    if (profileCard && typeof getProfileHeaderMarkup === "function") {
        profileCard.innerHTML = getProfileHeaderMarkup(
            xpSummary,
            getProfileRankSummary(xpSummary.level),
            "home"
        );
    }

    document.getElementById("homeXpValue").textContent =
        xpSummary.totalXp.toLocaleString("de-DE");
    document.getElementById("homeQuestCountValue").textContent =
        String(player.stats.completedQuests || 0);
    document.getElementById("homeStreakValue").textContent =
        String(getDailyStreak());
}

function renderHomeStatistics() {
    const container = document.getElementById("homeStatistics");

    if (!container) {
        return;
    }

    const statistics = [
        [
            "sanduhr",
            "Gesamtspielzeit",
            formatTime(Number(player.stats.totalTime || 0)),
            "Gesamtspielzeit"
        ],
        [
            "keyboard",
            "Getippte Zeichen",
            Number(player.stats.totalCharacters || 0).toLocaleString("de-DE"),
            "Getippte Zeichen"
        ],
        [
            "blitz",
            "Durchschnittliches Tempo",
            `${Number(player.stats.averageCPM || 0).toFixed(1)} CPM`,
            "Durchschnittliches Tempo"
        ],
        [
            "scharfschütze",
            "Durchschnittliche Genauigkeit",
            `${Number(player.stats.averageAccuracy || 0).toFixed(1)} %`,
            "Durchschnittliche Genauigkeit"
        ]
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
    const availableQuests = questIds.filter(questNumber =>
        getCampaignUnlockState(questNumber).unlocked
    );

    const priority = [
        "perfect-flow",
        "challenging",
        "too-easy",
        "too-difficult"
    ];
    const groupedQuests = new Map(
        priority.map(categoryKey => [categoryKey, []])
    );

    availableQuests.forEach(questNumber => {
        const categoryKey =
            getCampaignQuestFamiliarityCategory(questNumber).category.key;
        const categoryQuests = groupedQuests.get(categoryKey);

        if (categoryQuests) {
            categoryQuests.push(questNumber);
        }
    });

    const prioritizedQuests = priority.flatMap(
        categoryKey => groupedQuests.get(categoryKey)
    );

    return (prioritizedQuests.length > 0
        ? prioritizedQuests
        : availableQuests
    ).slice(0, 3);
}

function renderCampaignRecommendations() {
    const container = document.getElementById("campaignRecommendations");

    if (!container) {
        return;
    }

    const recommendationIds = getCampaignRecommendations();
    const startButton = document.getElementById("recommendationStartButton");

    if (recommendationIds.length === 0) {
        container.innerHTML = `
            <p class="campaign-recommendations-empty" role="status">
                Noch ist keine weitere Quest freigeschaltet.
            </p>
        `;
        if (startButton) {
            startButton.disabled = true;
        }
        return;
    }

    container.innerHTML = recommendationIds.map(questNumber => {
        const quest = quests[questNumber];
        const unlockState = getCampaignUnlockState(questNumber);
        const { familiarityStats, category } =
            getCampaignQuestFamiliarityCategory(questNumber);
        const mastery = familiarityStats.supported
            ? familiarityStats.masteryPercentage
            : 0;

        return `
            <button class="campaign-recommendation${unlockState.unlocked ? "" : " is-locked"}" type="button" data-quest-number="${questNumber}">
                <span class="campaign-recommendation-image">
                    <img src="../assets/quest/${quest.bild}.png" alt="">
                </span>
                <span class="campaign-recommendation-content">
                    <strong>${quest.beschreibung}</strong>
                    <small>${category.label} · ${mastery}% Beherrschung · ${quest.xp} XP</small>
                    <span class="recommendation-progress" aria-label="${mastery}% Beherrschungsgrad"><i style="width:${mastery}%"></i></span>
                </span>
                <span class="campaign-recommendation-percent">${mastery}%</span>
            </button>
        `;
    }).join("");

    container.querySelectorAll("[data-quest-number]").forEach(button => {
        button.addEventListener("click", () => {
            openCampaignQuestFromMap(button.dataset.questNumber);
        });
    });

    if (startButton) {
        startButton.disabled = false;
        startButton.onclick = () => {
            const firstRecommendation = recommendationIds[0];
            if (firstRecommendation) {
                openCampaignQuestFromMap(firstRecommendation);
            }
        };
    }
}

function renderWorldMapHome() {
    renderDailyQuests();
    renderHomePlayer();
    renderWorldMap();
    renderCampaignRecommendations();
    renderHomeStatistics();
}

document.getElementById("homeStatisticsButton")?.addEventListener(
    "click",
    () => switchContent("chronik")
);

switchContent("worldmap");
