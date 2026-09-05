const questListe = document.getElementById("questListe");
const readingModeCard = document.getElementById("readingModeCard");
const readingButton = document.getElementById("readingButton");

let contentMode = "campaign";
const questUnlockBypassEnabled = true;
const QUEST_UNLOCK_ACHIEVEMENT_GOAL = 7;

function getQuestCollection(mode = contentMode) {
    if (mode === "campaign") {
        return quests;
    }

    if (mode === "comedy") {
        return comedyEpisodes;
    }

    if (mode === "missions") {
        return missions;
    }

    if (mode === "youtube" && typeof getYoutubeQuests === "function") {
        return getYoutubeQuests();
    }

    return {};
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getQuestImageUrl(quest) {
    if (contentMode === "youtube" && quest?.thumbnailUrl) {
        return quest.thumbnailUrl;
    }

    return `../assets/quest/${quest?.bild || "alltag"}.png`;
}

const sidebarToggleButton = document.getElementById("sidebarToggleButton");
const mainSidebar = document.getElementById("mainSidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

function closeMobileSidebar() {
    mainSidebar?.classList.remove("mobile-open");
    sidebarBackdrop?.classList.remove("active");
    sidebarToggleButton?.setAttribute("aria-expanded", "false");
    sidebarToggleButton?.setAttribute("aria-label", "Menü öffnen");
    document.body.classList.remove("drawer-open");
}

function openMobileSidebar() {
    mainSidebar?.classList.add("mobile-open");
    sidebarBackdrop?.classList.add("active");
    sidebarToggleButton?.setAttribute("aria-expanded", "true");
    sidebarToggleButton?.setAttribute("aria-label", "Menü schließen");
    document.body.classList.add("drawer-open");
}

sidebarToggleButton?.addEventListener("click", () => {
    if (mainSidebar?.classList.contains("mobile-open")) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
});

sidebarBackdrop?.addEventListener("click", closeMobileSidebar);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMobileSidebar();
    }
});

window.addEventListener("questaudio:ended", event => {
    const detail = event.detail || {};
    const audioContentMode = detail.contentMode || contentMode;
    const questNumber = Number(detail.questNumber);

    if (
        audioContentMode !== "campaign" ||
        !Number.isInteger(questNumber) ||
        questNumber < 1 ||
        typeof registerQuestAudioListen !== "function"
    ) {
        return;
    }

    registerQuestAudioListen(
        `${audioContentMode}:${questNumber}`
    );
});

function getQuestAchievementCount(questId) {
    const stats = getQuestStats(questId);

    if (!stats.completed) {
        return 0;
    }

    return Object.values(stats.questAchievements || {}).filter(
        achievement => achievement?.unlocked
    ).length;
}

function getQuestUnlockRequirements(quest, questNumber) {
    const index = Math.max(1, Math.floor(Number(questNumber) || 1));
    if (contentMode === "youtube") {
        return {
            requiredLevel: 1,
            previousQuestNumber: 0,
            previousQuestAchievementCount: 0,
            requiredAchievements: 0
        };
    }

    if (contentMode === "comedy") {
        const previousQuestNumber = index - 1;
        const previousQuestStats = previousQuestNumber > 0
            ? getQuestStats(
                `comedy:${previousQuestNumber}`,
                comedyEpisodes[previousQuestNumber]?.version ?? 1
            )
            : null;

        return {
            requiredLevel: 1,
            previousQuestNumber,
            previousQuestAchievementCount: 0,
            previousQuestCompleted: Boolean(previousQuestStats?.completed),
            requiredAchievements: 0
        };
    }

    const configuredLevel = Number(quest?.requiredLevel);
    const requiredLevel = Math.max(
        1,
        Number.isFinite(configuredLevel)
            ? Math.floor(configuredLevel)
            : index
    );
    const previousQuestNumber = index - 1;
    const previousQuestAchievementCount = previousQuestNumber > 0
        ? getQuestAchievementCount(
            `${contentMode}:${previousQuestNumber}`
        )
        : QUEST_UNLOCK_ACHIEVEMENT_GOAL;

    return {
        requiredLevel,
        previousQuestNumber,
        previousQuestAchievementCount,
        requiredAchievements: QUEST_UNLOCK_ACHIEVEMENT_GOAL
    };
}

function getQuestUnlockState(quest, questNumber) {
    const requirements = getQuestUnlockRequirements(quest, questNumber);
    const xpSummary = getPlayerXpSummary();
    const unlocked = contentMode === "youtube"
        ? true
        : contentMode === "comedy"
        ? requirements.previousQuestNumber === 0 ||
            requirements.previousQuestCompleted
        : xpSummary.level >= requirements.requiredLevel &&
            (
                requirements.previousQuestNumber === 0 ||
                requirements.previousQuestAchievementCount >=
                    requirements.requiredAchievements
            );

    return {
        ...requirements,
        unlocked,
        bypassAvailable:
            !unlocked &&
            questUnlockBypassEnabled,
        requirementText:
            contentMode === "youtube"
                ? "Eigene Lektionen sind sofort freigeschaltet."
                : contentMode === "comedy"
                ? requirements.previousQuestNumber === 0
                    ? "Episode 1 ist freigeschaltet."
                    : `Benötigt: Abschluss von Episode ${requirements.previousQuestNumber}`
                : requirements.previousQuestNumber === 0
                ? `Benötigt: Level ${requirements.requiredLevel}`
                : `Benötigt: Level ${requirements.requiredLevel} und mindestens ${requirements.requiredAchievements} Auszeichnungen in Quest ${requirements.previousQuestNumber} (${requirements.previousQuestAchievementCount}/${requirements.requiredAchievements})`
    };
}

function getQuestAchievementUnitForOverview(card) {
    if (card.runType === "cpm") {
        return "CPM";
    }

    if (card.runType === "sentenceChallenge") {
        return "Challenge";
    }

    if (card.runType === "accuracy") {
        return "%";
    }

    if (card.runType === "cleanStreak") {
        return "Sätze";
    }

    if (card.runType === "perfectQuest") {
        return "Quest";
    }

    return "Ziel";
}

function getQuestAchievementRequirementForOverview(card) {
    const noHelpSuffix = card.requiresNoTastenhilfe
        ? " ohne Tastenhilfe"
        : "";

    if (card.runType === "cpm") {
        return `Erreiche ${card.goal} CPM${noHelpSuffix} in einer Runde.`;
    }

    if (card.runType === "sentenceChallenge") {
        return card.description;
    }

    if (card.runType === "accuracy") {
        return `Erreiche ${card.goal}% Genauigkeit${noHelpSuffix}.`;
    }

    if (card.runType === "cleanWords") {
        return `Tippe ${card.goal} Wörter fehlerfrei.`;
    }

    if (card.runType === "masteredWords") {
        return card.goal === 1
            ? "Meistere 1 einzigartiges Wort."
            : `Meistere ${card.goal} einzigartige Wörter.`;
    }

    if (card.runType === "perfectQuest") {
        return card.requiresNoTastenhilfe
            ? "Schließe diese Quest fehlerfrei ohne Tastenhilfe ab."
            : "Schließe diese Quest ohne Fehler ab.";
    }

    if (card.runType === "newRecord") {
        return "Stelle eine persönliche Bestleistung auf.";
    }

    if (card.runType === "cleanStreak") {
        return `Tippe ${card.goal} Sätze fehlerfrei hintereinander.`;
    }

    if (card.runType === "audioListens") {
        return `Höre das Questaudio ${card.goal}-mal vollständig.`;
    }

    return card.description;
}

function openQuestAchievementOverview(questNumber) {
    const overlay = document.getElementById("questAchievementOverview");
    const list = document.getElementById("questAchievementOverviewList");
    const summary = document.getElementById(
        "questAchievementOverviewSummary"
    );

    if (
        !overlay ||
        !list ||
        !summary ||
        typeof getQuestAchievementCards !== "function"
    ) {
        return;
    }

    const questId = `${contentMode}:${questNumber}`;
    const cards = getQuestAchievementCards(questId);
    const unlockedCount = cards.filter(card => card.unlocked).length;

    summary.textContent =
        `${unlockedCount} / ${cards.length} Auszeichnungen gesammelt`;
    list.innerHTML = "";

    for (const card of cards) {
        const item = document.createElement("article");
        item.className =
            `quest-achievement-overview-card${card.unlocked ? " is-unlocked" : ""}`;

        const icon = document.createElement("img");
        icon.src = `../assets/icons/achievements/${card.icon}.png`;
        icon.alt = "";

        const content = document.createElement("div");
        content.className = "quest-achievement-overview-content";

        const title = document.createElement("strong");
        title.textContent = card.title;

        const requirement = document.createElement("p");
        requirement.textContent =
            getQuestAchievementRequirementForOverview(card);

        const progress = document.createElement("small");
        progress.textContent = card.unlocked
            ? "✓ Gesammelt"
            : `${card.progress} / ${card.goal} ${getQuestAchievementUnitForOverview(card)}`;

        const track = document.createElement("div");
        track.className = "quest-achievement-overview-track";

        const fill = document.createElement("div");
        fill.className = "quest-achievement-overview-fill";
        fill.style.width = `${card.percent}%`;
        track.appendChild(fill);

        content.append(title, requirement, progress, track);

        const reward = document.createElement("em");
        reward.textContent = `+${card.bonusXp} XP`;

        item.append(icon, content, reward);
        list.appendChild(item);
    }

    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.getElementById("questAchievementOverviewClose")?.focus();
}

function closeQuestAchievementOverview() {
    const overlay = document.getElementById("questAchievementOverview");

    if (!overlay) {
        return;
    }

    overlay.classList.remove("is-open");
    overlay.hidden = true;
}

function formatQuestInfoHint(
    label,
    description,
    content,
    modifierClass = "",
    triggerContent = "?"
) {

    const ariaLabel = label.endsWith("erklären")
        ? label
        : `${label} erklären`;

    return `
        <span class="quest-help ${modifierClass}">
            <span class="quest-help-value">${content}</span>
            <button
                type="button"
                class="quest-help-trigger"
                aria-label="${ariaLabel}"
                aria-expanded="false">
                ${triggerContent}
            </button>
            <span class="quest-help-tooltip" role="tooltip">
                ${description}
            </span>
        </span>
    `;
}

function closeQuestInfoHints(except = null) {

    document.querySelectorAll(".quest-help.is-open").forEach(help => {

        if (help === except) {
            return;
        }

        help.classList.remove("is-open");
        help.querySelector(".quest-help-trigger")?.setAttribute(
            "aria-expanded",
            "false"
        );

    });
}

function setupQuestInfoHints(container) {

    container.querySelectorAll(".quest-help-trigger").forEach(trigger => {

        trigger.addEventListener("click", event => {

            event.stopPropagation();

            const help = trigger.closest(".quest-help");
            const shouldOpen = !help.classList.contains("is-open");

            closeQuestInfoHints(help);
            help.classList.toggle("is-open", shouldOpen);
            trigger.setAttribute(
                "aria-expanded",
                String(shouldOpen)
            );

        });

    });
}

document.addEventListener("click", event => {

    if (
        !(event.target instanceof Element) ||
        !event.target.closest(".quest-help")
    ) {
        closeQuestInfoHints();
    }

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeQuestInfoHints();
        closeQuestAchievementOverview();
    }

});

function formatQuestMasteryDetails(
    statistics,
    category,
    questStats,
    averageWordLength
) {

    if (!statistics.supported) {
        return `
            <div class="quest-analysis-unavailable">
                Sprachanalyse nicht verfügbar
            </div>
        `;
    }

    const attempts = Number(questStats?.attempts);
    const totalAttempts =
        Number.isFinite(attempts) && attempts >= 0
            ? Math.floor(attempts)
            : 0;
    const wordStatisticsStyle = [
        `--unseen:${statistics.percentages.unseen}%`,
        `--seen:${statistics.percentages.seen}%`,
        `--known:${statistics.percentages.known}%`,
        `--learned:${statistics.percentages.learned}%`,
        `--mastered:${statistics.percentages.mastered}%`
    ].join(";");

    return `
        <div class="quest-detail-panels">

            <section class="quest-detail-panel quest-word-statistics">

                <h3>
                    <span>Wortstatistik</span>
                    ${formatQuestInfoHint(
                        "Wortstatistik erklären",
                        "Diese Übersicht zeigt die einzigartigen Wörter nach Lernstufe: ungesehen (0×), gesehen (1–4×), bekannt (5–9×), gelernt (10–24×) und gemeistert (25×+). Die Prozentwerte beziehen sich auf die einzigartigen Wörter.",
                        "",
                        "quest-panel-help"
                    )}
                </h3>

                <div class="quest-word-statistics-content">

                    <div
                        class="quest-word-ring"
                        style="${wordStatisticsStyle}">
                        <strong>${statistics.unique}</strong>
                        <span>einzigartig</span>
                    </div>

                    <div class="quest-word-legend">

                        <div>
                            <span class="quest-legend-color unseen"></span>
                            <span>Ungesehen</span>
                            <strong>${statistics.percentages.unseen}%</strong>
                        </div>

                        <div>
                            <span class="quest-legend-color seen"></span>
                            <span>Gesehen</span>
                            <strong>${statistics.percentages.seen}%</strong>
                        </div>

                        <div>
                            <span class="quest-legend-color known"></span>
                            <span>Bekannt</span>
                            <strong>${statistics.percentages.known}%</strong>
                        </div>

                        <div>
                            <span class="quest-legend-color learned"></span>
                            <span>Gelernt</span>
                            <strong>${statistics.percentages.learned}%</strong>
                        </div>

                        <div>
                            <span class="quest-legend-color mastered"></span>
                            <span>Gemeistert</span>
                            <strong>${statistics.percentages.mastered}%</strong>
                        </div>

                    </div>

                </div>

            </section>

            <section class="quest-detail-panel quest-understanding">

                <h3>
                    <span>Verständnis</span>
                    ${formatQuestInfoHint(
                        "Verständnis erklären",
                        "Leseverständnis zählt alle Wortvorkommen ab bekannt (5+ Begegnungen). Wortschatz zählt einzigartige Wörter ab gelernt (10+ Begegnungen). Der Beherrschungsgrad zählt Wortvorkommen ab gelernt und bestimmt die Einstufung: 0–49 % schwer, 50–69 % anspruchsvoll, 70–89 % perfekter Flow und ab 90 % leicht.",
                        "",
                        "quest-panel-help"
                    )}
                </h3>

                <div class="quest-understanding-meters">

                    <div class="quest-understanding-meter">
                        <div
                            class="quest-meter"
                            style="--meter-value:${statistics.readingComprehensionPercentage}%">
                            <strong>${statistics.readingComprehensionPercentage}%</strong>
                        </div>
                        <span>Leseverständnis</span>
                    </div>

                    <div class="quest-understanding-meter">
                        <div
                            class="quest-meter quest-meter-vocabulary"
                            style="--meter-value:${statistics.vocabularyCoveragePercentage}%">
                            <strong>${statistics.vocabularyCoveragePercentage}%</strong>
                        </div>
                        <span>Wortschatz</span>
                    </div>

                    <div class="quest-understanding-meter">
                        <div
                            class="quest-meter quest-meter-mastery"
                            style="--meter-value:${statistics.masteryPercentage}%">
                            <strong>${statistics.masteryPercentage}%</strong>
                        </div>
                        <span>Beherrschungsgrad</span>
                    </div>

                </div>

                <p class="quest-understanding-callout">
                    ⭐ ${category.label} für dich.
                </p>

            </section>

            <section class="quest-detail-panel quest-more-info">

                <h3>Weitere Infos</h3>

                <dl>

                    <div>
                        <dt>↻ Versuche insgesamt</dt>
                        <dd>${totalAttempts}</dd>
                    </div>

                    <div>
                        <dt>↔ Durchschnittliche Wortlänge</dt>
                        <dd>${averageWordLength}</dd>
                    </div>

                    <div>
                        <dt>📊 Schwierigkeitsbewertung</dt>
                        <dd class="quest-info-category familiarity-${category.key}">
                            ${category.emoji} ${category.label}
                        </dd>
                    </div>

                </dl>

            </section>

        </div>
    `;
}

function ladeKarten() {

    questListe.innerHTML = "";

    const daten = getQuestCollection();

    if (contentMode === "youtube" && Object.keys(daten).length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "youtube-lesson-empty";
        emptyState.textContent =
            "Noch keine eigenen Lektionen gespeichert. Erstelle oben deine erste Lektion.";
        questListe.appendChild(emptyState);
        return;
    }

    for (const nummer in daten) {

        const quest = daten[nummer];
        const thaiWordStats = getThaiWordStatistics(quest.thaiZeilen);
        const familiarityStats =
            getThaiWordFamiliarityStatistics(
                quest.thaiZeilen,
                player.stats.wordStats
            );
        const familiarityCategory =
            getThaiWordFamiliarityCategory(familiarityStats);
        const averageWordLength =
            thaiWordStats.total > 0
                ? getThaiAverageWordLength(quest.thaiZeilen)
                    .toFixed(1)
                    .replace(".", ",")
                : "–";




const statusIcons = {

    due: '<span class="status-review">↻</span>',

    doneToday: '<span class="status-complete">✔</span>',

    mastered: '<span class="status-mastered">★</span>'

};
const status = getQuestStatus(
    `${contentMode}:${nummer}`,
    daten[nummer].version ?? 1
);

const stats = getQuestStats(
    `${contentMode}:${nummer}`,
    daten[nummer].version ?? 1
);
const unlockState = getQuestUnlockState(quest, nummer);
const questAchievementCards =
    typeof getQuestAchievementCards === "function"
        ? getQuestAchievementCards(`${contentMode}:${nummer}`)
        : [];
const unlockedQuestAchievementCount =
    questAchievementCards.filter(card => card.unlocked).length;
const questAchievementCountLabel =
    `${unlockedQuestAchievementCount}/${questAchievementCards.length}`;

const statusLabel = statusIcons[status] || "";



let progress = 0;

if (stats.completed) {

    progress = Math.round(

        ((stats.repetition.level + 1) /

        repetitionIntervals.length) * 100

    );

}

const karte = document.createElement("div");

karte.className = `quest-card${unlockState.unlocked ? "" : " quest-locked"}`;

        karte.id = "quest-" + nummer;

        karte.onclick = () => toggleQuest(nummer);

karte.innerHTML = `

<div class="quest-status ${status}">

    ${statusLabel || ""}

</div>


<div class="quest-header">

<div class="quest-avatar">

<div class="quest-badge">

    <img
        src="../assets/ui/quest-badge.png"
        class="quest-badge-image">
        
        

    <span class="quest-badge-number">
        ${nummer}
    </span>

</div>

<div class="quest-image">

    <img
    src="${escapeHtml(getQuestImageUrl(quest))}"
    alt="${escapeHtml(quest.titel)}"
        class="quest-image-content">

    <img
        src="../assets/ui/quest-frame.png"
        class="quest-frame"
        alt="">

</div>

</div>

    <div class="quest-main">

        <h2>${escapeHtml(quest.titel)}</h2>

        ${contentMode === "comedy"
            ? `<p class="quest-comedy-subtitle">${escapeHtml(quest.beschreibung)}</p>`
            : ""}

        ${window.questAudio.renderQuestAudioPlayer({
            contentMode,
            questNumber: nummer,
            className: "quest-audio-card"
        })}

        <p class="quest-meta">

            ${escapeHtml(quest.kapitel)}

            •

            <span class="difficulty quest-difficulty-mobile">

                ${escapeHtml(quest.schwierigkeit)}

            </span>

            <span
                class="quest-level-desktop familiarity-${familiarityCategory.key}"
                title="${familiarityCategory.range} Beherrschungsgrad">
                ${familiarityCategory.emoji} ${familiarityCategory.label}
            </span>

        </p>

        <p class="quest-words">
            <img
                class="quest-summary-icon"
                src="../assets/icons/achievements/brain-questkarte.png"
                alt="">
            ${formatThaiWordStatistics(thaiWordStats)}
        </p>

        <p class="quest-familiarity">
            ${formatQuestInfoHint(
                "Bekanntheitsgrad erklären",
                "Bekannt zählt ab 5 erfolgreichen Begegnungen. Unbekannt umfasst einzigartige Wörter mit 0–4 erfolgreichen Begegnungen.",
                `
                    <img
                        class="quest-summary-icon"
                        src="../assets/icons/achievements/wörter-questkarte.png"
                        alt="">
                    ${formatThaiWordFamiliarityStatistics(familiarityStats)}
                `,
                "quest-summary-help"
            )}
        </p>

        <button
            type="button"
            class="familiarity-button familiarity-${familiarityCategory.key}"
            disabled
            title="${familiarityCategory.range} Beherrschungsgrad">
            ${familiarityCategory.emoji} ${familiarityCategory.label}
        </button>

    </div>

    <div class="quest-progress">

<p class="progress-text">

    ${progress}%

</p>

<div class="progress-bar">

    <div
        class="progress"
        style="width:${progress}%">
    </div>

</div>


    </div>

    <div class="quest-actions">

<span
        class="quest-achievement-count"
        aria-label="${unlockedQuestAchievementCount} von ${questAchievementCards.length} Quest-Auszeichnungen erledigt">
    ${questAchievementCountLabel}
</span>

<button
        type="button"
        class="quest-achievement-overview-button"
        aria-label="Quest-Auszeichnungen anzeigen"
        title="Quest-Auszeichnungen anzeigen"
        onclick="event.stopPropagation(); openQuestAchievementOverview('${escapeHtml(nummer)}')">
    🏆
</button>

${contentMode === "youtube"
    ? `
<button
        type="button"
        class="youtube-quest-manage-button"
        onclick="event.stopPropagation(); editYoutubeQuest('${escapeHtml(nummer)}')">
    Bearbeiten
</button>

<button
        type="button"
        class="youtube-quest-manage-button youtube-quest-delete-button"
        onclick="event.stopPropagation(); deleteYoutubeQuestFromCard('${escapeHtml(nummer)}')">
    Löschen
</button>
`
    : ""}

<button class="quest-start-button"
        ${unlockState.unlocked ? "" : "aria-label=\"Gesperrte Quest öffnen\""}
        onclick="event.stopPropagation(); starteQuest('${escapeHtml(nummer)}')">

    <img
        src="../assets/ui/button-start.png"
        alt="Start">

</button>


    </div>

</div>

<div class="quest-details">

    ${formatQuestMasteryDetails(
        familiarityStats,
        familiarityCategory,
        stats,
        averageWordLength
    )}

</div>


`;

        questListe.appendChild(karte);
setupQuestInfoHints(karte);
        window.questAudio.initializeQuestAudioPlayers(karte);

    }
}

if (questListe) {

    ladeKarten();

}


// Quest starten
let ausgewaehlteQuest = null;
let questStartBypassActive = false;

// Quest starten
function starteQuest(questNummer) {

    ausgewaehlteQuest = questNummer;

    const daten = getQuestCollection();

    const quest = daten[questNummer];
    const unlockState = getQuestUnlockState(quest, questNummer);
    questStartBypassActive = false;
    if (readingModeCard) {
        readingModeCard.hidden = contentMode !== "comedy";
    }
    const thaiWordStats = getThaiWordStatistics(quest.thaiZeilen);
    const familiarityStats =
        getThaiWordFamiliarityStatistics(
            quest.thaiZeilen,
            player.stats.wordStats
        );
    const familiarityCategory =
        getThaiWordFamiliarityCategory(familiarityStats);
    const thaiCharacterCount = getThaiCharacterCount(quest.thaiZeilen);

    // Titel des Fensters
    document.getElementById("startOverlayTitle").textContent =
        contentMode === "campaign"
            ? "📖 Kampagne starten"
            : contentMode === "comedy"
                ? "😂 Komödie starten"
                : contentMode === "youtube"
                    ? "📚 Eigene Lektion starten"
                    : "🎯 Mission starten";

    // Questdaten
    document.getElementById("startQuestName").textContent =
        quest.titel;

    document.getElementById("startQuestDifficulty").textContent =
        "🏅 " + quest.schwierigkeit;

    const unlockNotice = document.getElementById("startQuestUnlockNotice");
    if (unlockNotice) {
        unlockNotice.textContent = unlockState.unlocked
            ? "🔓 Diese Quest ist freigeschaltet."
            : `🔒 ${unlockState.requirementText}`;
        unlockNotice.classList.toggle("is-locked", !unlockState.unlocked);
    }

    const bypassButton = document.getElementById("questUnlockBypassButton");
    if (bypassButton) {
        bypassButton.hidden = !unlockState.bypassAvailable;
    }
    [campaignButton, challengeButton].forEach(button => {
        if (button) {
            button.disabled = !unlockState.unlocked;
        }
    });
    if (readingButton) {
        readingButton.disabled = !unlockState.unlocked;
    }

    document.getElementById("startQuestWords").textContent =
        "📖 " + formatThaiWordStatistics(thaiWordStats);
    document.getElementById("startQuestFamiliarity").className =
        "familiarity-button familiarity-" + familiarityCategory.key;
    document.getElementById("startQuestFamiliarity").textContent =
        familiarityCategory.emoji + " " + familiarityCategory.label;
    document.getElementById("startQuestFamiliarity").title =
        familiarityCategory.range + " Beherrschungsgrad";

    // Questbild
    document.getElementById("startQuestImage").src =
        getQuestImageUrl(quest);

    // Zeit anhand der Quest-Wortzahl, der Quest-eigenen durchschnittlichen
    // Zeichenanzahl pro Wort und der persönlichen CPM schätzen.
    const gespeicherteCPM = Number(player?.stats?.averageCPM);
    const cpm =
        Number.isFinite(gespeicherteCPM) && gespeicherteCPM > 0
            ? gespeicherteCPM
            : 20;
    const durchschnittlicheZeichenProWort =
        thaiWordStats.total > 0
            ? thaiCharacterCount / thaiWordStats.total
            : 0;
    const geschaetzteZeichen =
        thaiWordStats.total * durchschnittlicheZeichenProWort;
    const gesamtSekunden =
        thaiWordStats.supported && geschaetzteZeichen > 0
            ? Math.ceil((geschaetzteZeichen / cpm) * 60)
            : null;

    if (gesamtSekunden === null) {
        document.getElementById("startQuestTime").textContent = "⏱ --:--";
    } else {
        const minuten = Math.floor(gesamtSekunden / 60);
        const sekunden =
            String(gesamtSekunden % 60).padStart(2, "0");

        document.getElementById("startQuestTime").textContent =
            `⏱ ${minuten}:${sekunden}`;
    }

        // Platzhalter für spätere Statistik

const questStats = getQuestStats(
    `${contentMode}:${questNummer}`,
    quest.version ?? 1
);

if (questStats.records.bestTime !== null) {

    const minuten = Math.floor(questStats.records.bestTime / 60);
    const sekunden = String(
        Math.floor(questStats.records.bestTime % 60)
    ).padStart(2, "0");

    document.getElementById("startQuestBestTime").textContent =
        `${minuten}:${sekunden}`;

} else {

    document.getElementById("startQuestBestTime").textContent =
        "--:--";

}

if (questStats.records.bestAccuracy !== null) {

    document.getElementById("startQuestAccuracy").textContent =
        `${questStats.records.bestAccuracy.toFixed(1)} %`;

} else {

    document.getElementById("startQuestAccuracy").textContent =
        "-- %";

}

    document
        .getElementById("startQuestOverlay")
        .classList.add("active");

}

const cancelQuestButton =
    document.getElementById("cancelQuestButton");

const questAchievementOverviewClose = document.getElementById(
    "questAchievementOverviewClose"
);

if (questAchievementOverviewClose) {
    questAchievementOverviewClose.onclick =
        closeQuestAchievementOverview;
}

const questAchievementOverview = document.getElementById(
    "questAchievementOverview"
);

if (questAchievementOverview) {
    questAchievementOverview.addEventListener("click", event => {
        if (event.target === questAchievementOverview) {
            closeQuestAchievementOverview();
        }
    });
}

if (cancelQuestButton) {

    cancelQuestButton.onclick = function () {

        document
            .getElementById("startQuestOverlay")
            .classList.remove("active");

    };

}


const campaignButton =
    document.getElementById("campaignButton");

if (campaignButton) {

    campaignButton.onclick = function () {
        if (!questStartBypassActive && !getQuestUnlockState(
            getQuestCollection()[
                ausgewaehlteQuest
            ],
            ausgewaehlteQuest
        ).unlocked) {
            return;
        }

        localStorage.setItem("aktuelleQuest", ausgewaehlteQuest);

    localStorage.setItem("contentMode", contentMode);

    localStorage.setItem("questMode", "learning");

        window.location.href = "typing.html";

    };

}

const challengeButton =
    document.getElementById("challengeButton");

if (challengeButton) {

    challengeButton.onclick = function () {
        if (!questStartBypassActive && !getQuestUnlockState(
            getQuestCollection()[
                ausgewaehlteQuest
            ],
            ausgewaehlteQuest
        ).unlocked) {
            return;
        }

        localStorage.setItem("aktuelleQuest", ausgewaehlteQuest);

        localStorage.setItem("contentMode", contentMode);

        localStorage.setItem("questMode", "challenge");

        window.location.href = "typing.html";

    };

}

if (readingButton) {
    readingButton.onclick = function () {
        if (
            contentMode !== "comedy" ||
            !questStartBypassActive &&
            !getQuestUnlockState(
                getQuestCollection()[ausgewaehlteQuest],
                ausgewaehlteQuest
            ).unlocked
        ) {
            return;
        }

        document
            .getElementById("startQuestOverlay")
            .classList.remove("active");
        window.comedyReader?.open(ausgewaehlteQuest);
    };
}

const questUnlockBypassButton = document.getElementById(
    "questUnlockBypassButton"
);

if (questUnlockBypassButton) {
    questUnlockBypassButton.onclick = function () {
        if (!questUnlockBypassEnabled) {
            return;
        }

        questStartBypassActive = true;
        [campaignButton, challengeButton, readingButton].forEach(button => {
            if (button) {
                button.disabled = false;
            }
        });
        questUnlockBypassButton.hidden = true;

        const unlockNotice = document.getElementById(
            "startQuestUnlockNotice"
        );
        if (unlockNotice) {
            unlockNotice.textContent =
                "🔧 Testmodus aktiv: Die Quest wird ohne Freischaltung geöffnet.";
            unlockNotice.classList.remove("is-locked");
        }
    };
}

function openChronik(){

    if (window.matchMedia("(max-width: 900px)").matches) {
        document.body.classList.add("mobile-chronik-mode");
    }

    renderChronik();

}

function openQuest(questId){

    document
        .getElementById("questOverlay")
        .classList.add("active");

}

function closeQuest(){

    document
        .getElementById("questOverlay")
        .classList.remove("active");

}

function toggleQuest(questId) {

    const karte = document.getElementById("quest-" + questId);

    karte.classList.toggle("expanded");

}

function deleteYoutubeQuestFromCard(questId) {
    const quest = getYoutubeQuests()?.[questId];
    if (!quest) {
        return;
    }

    if (!window.confirm(`„${quest.titel}“ wirklich löschen?`)) {
        return;
    }

    if (deleteYoutubeQuest(questId)) {
        ladeKarten();
    }
}

function switchContent(mode) {

    console.log("switchContent:", mode);

    if (mode === "thai-giga") {
        window.location.href = "thai-giga.html";
        return;
    }

    if (mode === "satzmix") {
        window.location.href = "satzmix.html";
        return;
    }

    contentMode = mode;
    document.body.classList.toggle(
        "worldmap-view-mode",
        mode === "worldmap"
    );
    document.body.classList.toggle(
        "achievements-view-mode",
        mode === "achievements"
    );
    document.body.classList.toggle(
        "profile-view-mode",
        mode === "profile"
    );

   const worldmapHome = document.getElementById("worldmapHome");
   const questView = document.getElementById("questView");
   const statusBar = document.querySelector(".status-bar");
   const topNavigationButtons = document.querySelectorAll(
       ".top-navigation-button[data-content-mode]"
   );

   const showSecondaryView = () => {
       worldmapHome?.setAttribute("hidden", "");
       questView?.setAttribute("hidden", "");
       statusBar?.setAttribute("hidden", "");
       document.getElementById("questListe").style.display = "none";
       document.getElementById("chronikContainer").style.display = "none";
       document.getElementById("achievementContainer").style.display = "none";
       document.getElementById("profileContainer").style.display = "none";
       document.getElementById("youtubeLessonCreator")?.setAttribute("hidden", "");
   };

   const activeNavigationMode =
       mode === "campaign" ||
       mode === "missions" ||
       mode === "comedy" ||
       mode === "youtube"
           ? "quests"
           : mode;

   topNavigationButtons.forEach(button => {
       button.classList.toggle(
           "is-active",
           button.dataset.contentMode === activeNavigationMode
       );
   });

   document.querySelectorAll(".mobile-menu-button").forEach(button => {
       button.classList.toggle(
           "is-active",
           button.dataset.contentMode === mode ||
           (
               button.dataset.contentMode === "quests" &&
               mode === "campaign"
           )
       );
   });

   closeMobileSidebar();

   [
       [campaignListButton, "campaign"],
       [youtubeListButton, "youtube"],
       [comedyListButton, "comedy"],
       [missionsMenuButton, "missions"]
   ].forEach(([button, buttonMode]) => {
       if (!button) {
           return;
       }

       const isActive = buttonMode === mode;
       button.classList.toggle("is-active", isActive);
       button.setAttribute("aria-pressed", String(isActive));
   });

   switch (mode) {

       case "worldmap":
           document.body.classList.remove("mobile-chronik-mode");
           worldmapHome?.removeAttribute("hidden");
           questView?.setAttribute("hidden", "");
           statusBar?.removeAttribute("hidden");
           document.getElementById("questListe").style.display = "none";
           document.getElementById("chronikContainer").style.display = "none";
           document.getElementById("achievementContainer").style.display = "none";
           document.getElementById("profileContainer").style.display = "none";

           if (typeof renderWorldMapHome === "function") {
               renderWorldMapHome();
           }
           break;

        case "campaign":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           questView?.removeAttribute("hidden");
           document.getElementById("questListe").style.display = "block";
           document.getElementById("questViewEyebrow").textContent =
               "Deine Lernpfade";
           document.getElementById("questViewTitle").textContent = "Quests";
           ladeKarten();
           break;

       case "comedy":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           questView?.removeAttribute("hidden");
           document.getElementById("questListe").style.display = "block";
           document.getElementById("questViewEyebrow").textContent =
               "Eine fortlaufende Serie";
           document.getElementById("questViewTitle").textContent = "😂 Komödie";
           ladeKarten();
           break;

       case "youtube":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           questView?.removeAttribute("hidden");
           document.getElementById("questListe").style.display = "block";
           document.getElementById("youtubeLessonCreator")?.removeAttribute("hidden");
           document.getElementById("questViewEyebrow").textContent =
               "Lerne aus deinen Lieblingsvideos";
           document.getElementById("questViewTitle").textContent = "📚 Eigene Lektionen";
           ladeKarten();
           break;

       case "missions":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           questView?.removeAttribute("hidden");
           document.getElementById("questListe").style.display = "block";
           document.getElementById("questViewEyebrow").textContent =
               "Deine Lernpfade";
           document.getElementById("questViewTitle").textContent = "Missionen";
           ladeKarten();
           break;

       case "achievements":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           document.getElementById("achievementContainer").style.display = "block";
           renderAchievements();
           break;

       case "chronik":
           if (window.matchMedia("(max-width: 900px)").matches) {
               document.body.classList.add("mobile-chronik-mode");
           }
           showSecondaryView();
           document.getElementById("chronikContainer").style.display = "block";
           renderChronik();
           break;

       case "profile":
           document.body.classList.remove("mobile-chronik-mode");
           showSecondaryView();
           document.getElementById("profileContainer").style.display = "block";
           renderProfile();
           break;

   }
}


const campaignMenuButton =
    document.getElementById("campaignMenuButton");
const openYoutubeLessonButton =
    document.getElementById("openYoutubeLessonButton");

if (openYoutubeLessonButton) {
    openYoutubeLessonButton.onclick = function () {
        switchContent("youtube");
    };
}

if (campaignMenuButton) {

campaignMenuButton.onclick = function () {

    switchContent("campaign");

};

}

const campaignListButton = document.getElementById("campaignListButton");
const youtubeListButton = document.getElementById("youtubeListButton");
const comedyListButton = document.getElementById("comedyListButton");

if (campaignListButton) {
    campaignListButton.onclick = function () {
        switchContent("campaign");
    };
}

if (youtubeListButton) {
    youtubeListButton.onclick = function () {
        switchContent("youtube");
    };
}

if (comedyListButton) {
    comedyListButton.onclick = function () {
        switchContent("comedy");
    };
}

const missionsMenuButton =
    document.getElementById("missionsMenuButton");

if (missionsMenuButton) {

missionsMenuButton.onclick = function () {

    switchContent("missions");

};

}

const achievementButton =
    document.getElementById("achievementButton");

if (achievementButton) {

    achievementButton.onclick = function () {

        switchContent("achievements");

    };

}

const chronikButton =
    document.getElementById("chronikButton");


if (chronikButton) {

    chronikButton.onclick = function () {

        switchContent("chronik");

    };

}

const worldMapMenuButton = document.getElementById("worldMapMenuButton");

if (worldMapMenuButton) {
    worldMapMenuButton.dataset.contentMode = "worldmap";
    worldMapMenuButton.onclick = function () {
        switchContent("worldmap");
    };
}

document.querySelectorAll(".mobile-menu-button").forEach(button => {
    button.addEventListener("click", () => {
        const mode = button.dataset.contentMode;

        if (mode === "japanese") {
            window.location.href = "japanese.html";
            return;
        }

        if (mode === "quests") {
            switchContent("campaign");
            return;
        }

        switchContent(mode);
    });
});

if (campaignMenuButton) {
    campaignMenuButton.dataset.contentMode = "quests";
}

if (achievementButton) {
    achievementButton.dataset.contentMode = "achievements";
}

if (chronikButton) {
    chronikButton.dataset.contentMode = "chronik";
}
