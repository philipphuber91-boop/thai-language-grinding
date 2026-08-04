let phase = "auftrag";

// Kampagne = Lernmodus
// Challenge = direkt zur Prüfung
let mode = "learning";
let startZeit = null;
let endZeit = null;
let fehler = 0;
let currentSentenceHasError = false;
let cleanSentenceStreak = 0;
let maxCleanSentenceStreak = 0;
let runCleanWords = 0;
let runNewWords = 0;
let runMasteredWords = 0;
let runXpEarned = 0;
let runAwards = [];
let runAwardIds = new Set();
const typingAwardToastQueue = [];
let activeTypingAwardToasts = 0;
const zeile1 = document.getElementById("zeile1");
const zeile2 = document.getElementById("zeile2");
const eingabe = document.getElementById("eingabe");
const aktuelleQuest = localStorage.getItem("aktuelleQuest");
const questMode = localStorage.getItem("questMode") || "campaign";

// Die Übersetzung physischer Tasten bleibt für Desktop und die
// mobile Spiel-Tastatur aktiv. Der mobile Systemtastatur-Modus
// verarbeitet stattdessen die nativen input-Events direkt.
const keyboardTutorModeEnabled = true;

const contentMode =
    localStorage.getItem("contentMode") || "campaign";

const daten =
    contentMode === "campaign"
        ? quests
        : missions;

const typingAudioContainer =
    document.getElementById("typingAudioContainer");

if (typingAudioContainer && window.questAudio) {
    typingAudioContainer.innerHTML =
        window.questAudio.renderQuestAudioPlayer({
            contentMode,
            questNumber: aktuelleQuest,
            className: "typing-audio-player"
        });
    window.questAudio.initializeQuestAudioPlayers(typingAudioContainer);
}

// Separate IDs prevent a campaign quest and a mission with the same number
// from sharing progress, records, and review dates.
const questStatsId = `${contentMode}:${aktuelleQuest}`;
const stats = getQuestStats(questStatsId, daten[aktuelleQuest].version ?? 1);

const keyboardElement = document.getElementById("thaiKeyboard");
let highlightedKeyElements = [];
let tastenhilfeTimer = null;
let tastenhilfeRequestId = 0;
let pendingTutorInput = null;

function getCurrentTypingCpm() {
    const activeTime = ActivityManager.getActiveTimeMs();

    if (activeTime <= 0) {
        return 0;
    }

    return gesamtZeichen / (activeTime / 60000);
}

function getCurrentTypingAccuracy() {
    return gesamtZeichen + fehler > 0
        ? (gesamtZeichen / (gesamtZeichen + fehler)) * 100
        : 100;
}

function updateTypingXpUi() {
    const xpSummary = getPlayerXpSummary();
    const xpValue = document.getElementById("typingXpValue");
    const comboValue = document.getElementById("typingComboValue");

    if (xpValue) {
        xpValue.textContent = `${xpSummary.totalXp} XP`;
    }

    if (comboValue) {
        const multiplier = cleanSentenceStreak >= 10
            ? 3
            : cleanSentenceStreak >= 5
                ? 2
                : 1;

        comboValue.textContent = `🔥 ${cleanSentenceStreak} · x${multiplier}`;
    }

    renderQuestAchievementPanel();

    const awardsOverview = document.getElementById(
        "typingQuestAwardsOverview"
    );

    if (awardsOverview && !awardsOverview.hidden) {
        renderTypingAwardsOverview();
    }
}

function resetTypingAwardRun() {
    currentSentenceHasError = false;
    cleanSentenceStreak = 0;
    maxCleanSentenceStreak = 0;
    runCleanWords = 0;
    runNewWords = 0;
    runMasteredWords = 0;
    runXpEarned = 0;
    runAwards = [];
    runAwardIds = new Set();
    updateTypingXpUi();
}

function enqueueTypingAwardToast(award) {
    typingAwardToastQueue.push(award);
    showNextTypingAwardToast();
}

function showNextTypingAwardToast() {
    if (
        activeTypingAwardToasts >= 3 ||
        typingAwardToastQueue.length === 0
    ) {
        return;
    }

    const award = typingAwardToastQueue.shift();
    const container = document.getElementById("typingAwardContainer");

    if (!container) {
        return;
    }

    activeTypingAwardToasts++;

    const toast = document.createElement("div");
    toast.className = `typing-award-toast rarity-${award.rarity}`;
    toast.setAttribute("role", "status");

    const icon = document.createElement("img");
    icon.src = `../assets/icons/achievements/${award.icon}.png`;
    icon.alt = "";

    const text = document.createElement("div");
    text.className = "typing-award-toast-text";

    const title = document.createElement("strong");
    title.textContent = award.title;

    const reward = document.createElement("span");
    reward.textContent = `+${award.xpAwarded} XP`;

    text.append(title, reward);
    toast.append(icon, text);
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("is-visible");
    });

    setTimeout(() => {
        toast.classList.remove("is-visible");

        setTimeout(() => {
            toast.remove();
            activeTypingAwardToasts--;
            showNextTypingAwardToast();
        }, 280);
    }, 2200);

    showNextTypingAwardToast();
}

function evaluateCurrentTypingAwards(extra = {}) {
    const awards = evaluateTypingRunAwards({
        questId: questStatsId,
        cpm: getCurrentTypingCpm(),
        accuracy: getCurrentTypingAccuracy(),
        cleanWords: runCleanWords,
        newWords: runNewWords,
        masteredWords: runMasteredWords,
        cleanSentenceStreak,
        perfectQuest: extra.perfectQuest || 0,
        newRecord: extra.newRecord || 0,
        tastenhilfeEnabled,
        awardIds: runAwardIds
    });

    if (awards.length === 0) {
        return;
    }

    runAwards.push(...awards);
    runXpEarned += awards.reduce(
        (total, award) => total + award.xpAwarded,
        0
    );
    awards.forEach(enqueueTypingAwardToast);
    updateTypingXpUi();
}

function renderQuestAchievementPanel() {
    const container = document.getElementById("typingQuestAchievements");

    if (
        !container ||
        typeof getQuestAchievementCards !== "function"
    ) {
        return;
    }

    const cards = getQuestAchievementCards(questStatsId, {
        cpm: getCurrentTypingCpm(),
        accuracy: getCurrentTypingAccuracy(),
        cleanWords: runCleanWords,
        newWords: runNewWords,
        masteredWords: runMasteredWords,
        cleanSentenceStreak,
        perfectQuest: 0,
        newRecord: 0,
        tastenhilfeEnabled
    });

    const unlockedCards = cards.filter(card => card.unlocked);
    container.innerHTML = "";

    if (unlockedCards.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "typing-quest-achievement-empty";
        emptyState.textContent = "Noch keine Auszeichnung erreicht";
        container.appendChild(emptyState);
        return;
    }

    const cardsById = new Map(
        unlockedCards.map(card => [card.id, card])
    );
    const currentRunCards = runAwards
        .map(award => cardsById.get(award.id))
        .filter(Boolean);
    const currentRunIds = new Set(currentRunCards.map(card => card.id));
    const olderCards = unlockedCards.filter(card => !currentRunIds.has(card.id));
    const visibleCards = [...olderCards, ...currentRunCards].slice(-5);

    for (const card of visibleCards) {
        const item = document.createElement("article");
        item.className = "typing-quest-achievement is-unlocked";

        const icon = document.createElement("img");
        icon.src = `../assets/icons/achievements/${card.icon}.png`;
        icon.alt = "";

        const body = document.createElement("div");
        body.className = "typing-quest-achievement-body";

        const title = document.createElement("strong");
        title.textContent = card.title;

        const description = document.createElement("span");
        description.textContent = card.repeatCount > 0
            ? `Erreicht · ${card.repeatCount}× wiederholt`
            : "Erreicht in dieser Quest";

        body.append(title, description);

        const reward = document.createElement("em");
        reward.textContent = card.unlocked
            ? `✓ +${card.bonusXp} XP`
            : `+${card.bonusXp} XP`;

        item.append(icon, body, reward);
        container.appendChild(item);
    }
}

function getQuestAchievementUnit(card) {
    if (card.runType === "cpm") {
        return "CPM";
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

function getTypingAchievementRequirement(card) {
    const goal = card.goal;
    const noHelpSuffix = card.requiresNoTastenhilfe
        ? " ohne Tastenhilfe"
        : "";

    if (card.runType === "cpm") {
        return `Erreiche ${goal} CPM${noHelpSuffix} in einer Runde.`;
    }

    if (card.runType === "accuracy") {
        return `Erreiche ${goal}% Genauigkeit${noHelpSuffix}.`;
    }

    if (card.runType === "cleanWords") {
        return `Tippe ${goal} Wörter fehlerfrei.`;
    }

    if (card.runType === "newWords") {
        return `Entdecke ${goal} neue Wörter in einer Runde.`;
    }

    if (card.runType === "masteredWords") {
        return goal === 1
            ? "Meistere 1 einzigartiges Wort."
            : `Meistere ${goal} einzigartige Wörter.`;
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
        return `Tippe ${goal} Sätze fehlerfrei hintereinander.`;
    }

    return card.description;
}

function renderTypingAwardsOverview() {
    const list = document.getElementById(
        "typingQuestAwardsOverviewList"
    );
    const summary = document.getElementById(
        "typingQuestAwardsOverviewSummary"
    );

    if (
        !list ||
        !summary ||
        typeof getQuestAchievementCards !== "function"
    ) {
        return;
    }

    const cards = getQuestAchievementCards(questStatsId);
    const unlockedCount = cards.filter(card => card.unlocked).length;

    summary.textContent =
        `${unlockedCount} / ${cards.length} Auszeichnungen gesammelt`;
    list.innerHTML = "";

    for (const card of cards) {
        const item = document.createElement("article");
        item.className =
            `typing-award-overview-card ${card.unlocked ? "is-unlocked" : ""}`;

        const icon = document.createElement("img");
        icon.src = `../assets/icons/achievements/${card.icon}.png`;
        icon.alt = "";

        const content = document.createElement("div");
        content.className = "typing-award-overview-content";

        const title = document.createElement("strong");
        title.textContent = card.title;

        const requirement = document.createElement("p");
        requirement.textContent = getTypingAchievementRequirement(card);

        const progressText = document.createElement("small");
        progressText.textContent = card.unlocked
            ? `✓ Gesammelt${card.repeatCount > 0
                ? ` · ${card.repeatCount}× wiederholt`
                : ""}`
            : `${card.progress} / ${card.goal} ${getQuestAchievementUnit(card)}`;

        const track = document.createElement("div");
        track.className = "typing-award-overview-track";

        const fill = document.createElement("div");
        fill.className = "typing-award-overview-fill";
        fill.style.width = `${card.percent}%`;
        track.appendChild(fill);

        content.append(title, requirement, progressText, track);

        const reward = document.createElement("em");
        reward.textContent = `+${card.bonusXp} XP`;

        item.append(icon, content, reward);
        list.appendChild(item);
    }
}

function initializeTypingAwardsOverview() {
    const buttons = [
        document.getElementById("typingQuestAwardsButton"),
        document.getElementById("typingMobileAwardsButton")
    ].filter(Boolean);
    const overlay = document.getElementById("typingQuestAwardsOverview");
    const closeButton = document.getElementById(
        "typingQuestAwardsOverviewClose"
    );

    if (buttons.length === 0 || !overlay || !closeButton) {
        return;
    }

    let openingButton = buttons[0];

    const setButtonsExpanded = expanded => {
        buttons.forEach(button => {
            button.setAttribute("aria-expanded", String(expanded));
        });
    };

    const closeOverview = () => {
        overlay.classList.remove("is-open");
        overlay.hidden = true;
        setButtonsExpanded(false);
        openingButton.focus();
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            openingButton = button;
            renderTypingAwardsOverview();
            overlay.hidden = false;
            overlay.classList.add("is-open");
            setButtonsExpanded(true);
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", closeOverview);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeOverview();
        }
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            !overlay.hidden
        ) {
            closeOverview();
        }
    });
}

initializeTypingAwardsOverview();

function registerCompletedTypingSentence() {
    const sentenceWords = getThaiWordList([text]).words.length;
    const cleanSentence = !currentSentenceHasError;

    if (cleanSentence) {
        cleanSentenceStreak++;
        maxCleanSentenceStreak = Math.max(
            maxCleanSentenceStreak,
            cleanSentenceStreak
        );
        runCleanWords += sentenceWords;

        registerCleanTypingSentence(
            sentenceWords,
            cleanSentenceStreak
        );

        const multiplier = cleanSentenceStreak >= 10
            ? 3
            : cleanSentenceStreak >= 5
                ? 2
                : 1;
        const xpResult = awardPlayerXp(
            XP_PER_CLEAN_SENTENCE * multiplier
        );

        runXpEarned += xpResult.awardedXp;
    } else {
        cleanSentenceStreak = 0;
    }

    evaluateCurrentTypingAwards();
    currentSentenceHasError = false;
    updateTypingXpUi();
}

function renderTypingRunSummary(xpSummary) {
    const awardsContainer = document.getElementById("typingRunAwards");
    const xpValue = document.getElementById("typingRunXp");
    const levelValue = document.getElementById("typingRunLevel");
    const levelProgress = document.getElementById("typingRunLevelProgress");
    const comboValue = document.getElementById("typingRunCombo");

    if (awardsContainer) {
        awardsContainer.innerHTML = "";

        if (runAwards.length === 0) {
            const empty = document.createElement("p");
            empty.className = "typing-run-awards-empty";
            empty.textContent = "Diesmal keine neue Auszeichnung.";
            awardsContainer.appendChild(empty);
        } else {
            runAwards.forEach(award => {
                const item = document.createElement("div");
                item.className = `typing-run-award rarity-${award.rarity}`;
                item.innerHTML = `
                    <img src="../assets/icons/achievements/${award.icon}.png" alt="">
                    <span>${award.title}</span>
                    <strong>+${award.xpAwarded} XP</strong>
                `;
                awardsContainer.appendChild(item);
            });
        }
    }

    if (xpValue) {
        xpValue.textContent = `+${runXpEarned} XP`;
    }

    if (levelValue) {
        levelValue.textContent = `Level ${xpSummary.level}`;
    }

    if (levelProgress) {
        levelProgress.style.width = `${xpSummary.percent}%`;
    }

    if (comboValue) {
        comboValue.textContent = `🔥 Beste Combo: ${maxCleanSentenceStreak} Sätze`;
    }
}

// Tastenhilfe (Lernhilfen-Einstellung): steuert, ob und nach welcher
// Verzögerung die Taste des als nächstes erwarteten Zeichens auf der
// virtuellen Tastatur hervorgehoben wird. Gilt einheitlich für Lern-
// und Prüfungsphase, siehe syncKeyboardHighlight().
const TASTENHILFE_MIN_SEKUNDEN = 0;
const TASTENHILFE_MAX_SEKUNDEN = 5;
const TASTENHILFE_STANDARD_SEKUNDEN = 2;

function clampTastenhilfeSekunden(value, minSekunden = TASTENHILFE_MIN_SEKUNDEN) {
    const zahl = Number(value);
    if (!Number.isFinite(zahl)) {
        return TASTENHILFE_STANDARD_SEKUNDEN;
    }
    return Math.min(
        TASTENHILFE_MAX_SEKUNDEN,
        Math.max(minSekunden, Math.round(zahl))
    );
}

let gameTastenhilfeEnabled =
    localStorage.getItem("tastenhilfeAktiviert") !== "false";
let tastenhilfeEnabled = gameTastenhilfeEnabled;

const MOBILE_INPUT_METHOD_KEY = "mobileInputMethod";
let mobileInputMethod =
    localStorage.getItem(MOBILE_INPUT_METHOD_KEY) === "system"
        ? "system"
        : "game";

let tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(
    localStorage.getItem("tastenhilfeVerzoegerung") ?? TASTENHILFE_STANDARD_SEKUNDEN,
    TASTENHILFE_MIN_SEKUNDEN
);

const keyPressAnimationDurationMs = 130;

// keyboard.js liefert: thaiKeyboardMap, latinToThaiMap, physicalKeyLayout,
// resolvePhysicalLayoutKeyFromCode, translatePhysicalCode, translatePhysicalKey

function getKeyElements(character) {
    if (!keyboardElement || character === null || character === undefined) {
        return [];
    }

    const str = String(character);
    return Array.from(keyboardElement.querySelectorAll(".key")).filter(
        el => el.getAttribute("data-key") === str
    );
}

function clearHighlight() {
    highlightedKeyElements.forEach(el => el.classList.remove("active"));
    highlightedKeyElements = [];
}

function highlightKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.add("active");

        if (!highlightedKeyElements.includes(el)) {
            highlightedKeyElements.push(el);
        }
    });
}

function applyKeyboardHighlight(character) {
    const mapping = thaiKeyboardMap[character];

    if (!mapping) {
        return;
    }

    highlightKey(mapping.key);

    if (mapping.shift) {
        highlightKey("Shift");
    }
}

function clearTastenhilfeTimer() {
    if (tastenhilfeTimer !== null) {
        clearTimeout(tastenhilfeTimer);
        tastenhilfeTimer = null;
    }
}

function getCurrentExpectedCharacter() {
    if (!text || typeof text !== "string") {
        return null;
    }

    return text[position] || null;
}

function syncKeyboardHighlight() {
    clearHighlight();
    clearTastenhilfeTimer();

    if (phase !== "typing") {
        return;
    }

    // Lernhilfen-Einstellung "Tastenhilfe": komplett aus = keine
    // Hervorhebung, weder in der Lern- noch in der Prüfungsphase.
    if (!tastenhilfeEnabled) {
        return;
    }

    const expectedCharacter = getCurrentExpectedCharacter();

    if (!expectedCharacter) {
        return;
    }

    const currentRequestId = ++tastenhilfeRequestId;
    const verzoegerungMs = tastenhilfeVerzoegerungSekunden * 1000;

    if (verzoegerungMs <= 0) {
        applyKeyboardHighlight(expectedCharacter);
        return;
    }

    tastenhilfeTimer = setTimeout(() => {
        if (currentRequestId !== tastenhilfeRequestId) {
            return;
        }

        if (phase !== "typing") {
            return;
        }

        const currentCharacter = getCurrentExpectedCharacter();

        if (currentCharacter) {
            applyKeyboardHighlight(currentCharacter);
        }

        tastenhilfeTimer = null;
    }, verzoegerungMs);
}

function pressKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.remove("pressed");
        void el.offsetWidth;
        el.classList.add("pressed");

        if (el.__pressTimeoutId) {
            clearTimeout(el.__pressTimeoutId);
        }

        el.__pressTimeoutId = setTimeout(() => {
            el.classList.remove("pressed");
            el.__pressTimeoutId = null;
        }, keyPressAnimationDurationMs);
    });
}

function releaseKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.remove("pressed");

        if (el.__pressTimeoutId) {
            clearTimeout(el.__pressTimeoutId);
            el.__pressTimeoutId = null;
        }
    });
}

function resolvePressedVirtualKeys(event) {
    if (!event || event.defaultPrevented || event.isComposing) {
        return [];
    }

    const translatedCharacter = translatePhysicalKey(event);

    if (translatedCharacter) {
        const mapping = thaiKeyboardMap[translatedCharacter];
        if (mapping) {
            const pressedKeys = [mapping.key];
            if (mapping.shift) {
                pressedKeys.push("Shift");
            }
            return pressedKeys;
        }
    }

    // Nicht-Text-Sondertasten bleiben direkt abgebildet.
    if (event.key === "Shift") return ["Shift"];
    if (event.key === "Backspace") return ["Backspace"];
    if (event.key === "Enter") return ["Enter"];

    return [];
}


function zeigePhase() {
    clearHighlight();
    clearTastenhilfeTimer();

    // Alles ausblenden
    auftrag.style.display = "none";
    deutsch.style.display = "none";
    typingBereich.style.display = "none";
    popup.classList.remove("active");
    stopQuestCompletionAudio();

    switch (phase) {
 
        case "auftrag":
            auftrag.style.display = "block";
            break;
 
        case "deutsch":
            deutsch.style.display = "block";
            break;
 
case "typing":
 
    typingBereich.style.display = "block";
    zeigeZeilen();
 
    setTimeout(function () {
 
        focusEingabeWithoutScroll();
 
    }, 0);
 
    syncKeyboardHighlight();
    break;
 
case "abschluss":
 
    break;
    }
 
}


const zeitAnzeigeElement = document.getElementById("zeitAnzeige");
const wpmAnzeigeElement = document.getElementById("wpmAnzeige");
const accuracyAnzeigeElement = document.getElementById("accuracyAnzeige");

const popup =
document.getElementById("questCompleteOverlay");
const popupZeit = document.getElementById("popupZeit");

const popupCPM = document.getElementById("popupCPM");

const popupKapitel =
    document.getElementById("popupKapitel");

const popupAccuracy = document.getElementById("popupAccuracy");
const popupNewWords = document.getElementById("popupNewWords");
const popupNewWordsStat = document.getElementById("popupNewWordsStat");
const popupMasteredWordsSection = document.getElementById(
    "popupMasteredWordsSection"
);
const popupMasteredWordsTitle = document.getElementById(
    "popupMasteredWordsTitle"
);
const popupMasteredWords = document.getElementById("popupMasteredWords");

const weiterButton = document.getElementById("weiterButton");

function openQuestCompletionOverlay() {
    if (!popup) {
        return;
    }

    popup.classList.add("active");
    popup.scrollTop = 0;

    const completionWindow = popup.querySelector(".quest-complete-window");
    if (completionWindow) {
        completionWindow.scrollTop = 0;
    }
}

function renderMasteredWordsSummary(words) {
    if (!popupMasteredWordsSection || !popupMasteredWords) {
        return;
    }

    const masteredWords = Array.isArray(words)
        ? words.filter(word => String(word).trim().length > 0)
        : [];

    popupMasteredWords.replaceChildren();
    popupMasteredWordsSection.hidden = masteredWords.length === 0;

    if (popupMasteredWordsTitle) {
        popupMasteredWordsTitle.textContent =
            masteredWords.length === 1
                ? "🧠 Neues Wort gemeistert"
                : "🧠 Neue Wörter gemeistert";
    }

    for (const word of masteredWords) {
        const wordElement = document.createElement("span");
        wordElement.className = "mastered-word";
        wordElement.lang = "th";
        wordElement.textContent = word;
        popupMasteredWords.appendChild(wordElement);
    }
}

const QUEST_COMPLETION_AUDIO_START_SECONDS = 58;
const questCompletionAudio = new Audio("../assets/audio/quest-complete.mp3");
questCompletionAudio.preload = "metadata";
let questCompletionAudioMetadataHandler = null;

function stopQuestCompletionAudio() {
    if (questCompletionAudioMetadataHandler) {
        questCompletionAudio.removeEventListener(
            "loadedmetadata",
            questCompletionAudioMetadataHandler
        );
        questCompletionAudioMetadataHandler = null;
    }

    questCompletionAudio.pause();
    questCompletionAudio.currentTime = 0;
}

function playQuestCompletionAudio() {
    stopQuestCompletionAudio();

    const seekToStart = () => {
        questCompletionAudioMetadataHandler = null;
        questCompletionAudio.currentTime = QUEST_COMPLETION_AUDIO_START_SECONDS;
    };

    if (questCompletionAudio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        seekToStart();
    } else {
        questCompletionAudioMetadataHandler = seekToStart;
        questCompletionAudio.addEventListener(
            "loadedmetadata",
            seekToStart,
            { once: true }
        );
        questCompletionAudio.load();
    }

    const playback = questCompletionAudio.play();
    playback.catch(error => {
        console.warn("Quest-Abschlussaudio konnte nicht gestartet werden.", error);
    });
}

const activityStatusElement = document.getElementById("activityStatus");
const afkOverlay = document.getElementById("afkOverlay");
const afkCountdown = document.getElementById("afkCountdown");
const resumeAfkButton = document.getElementById("resumeAfkButton");

const completeInfo = document.querySelector(".complete-info");
const completeStats = document.querySelector(".complete-stats");
const masteredWordsSummary = document.querySelector(".mastered-words-summary");
const typingRunSummary = document.querySelector(".typing-run-summary");
const comparisonSection = document.querySelector(".comparison-section");

ActivityManager.onStatusChange = updateActivityStatus;
ActivityManager.onAfkDialogOpen = showAfkOverlay;
ActivityManager.onAfkDialogClose = hideAfkOverlay;
ActivityManager.onAutoAbort = handleAutoAbort;

updateActivityStatus();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
}

function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateActivityStatus() {
    if (!activityStatusElement) {
        return;
    }

    activityStatusElement.textContent = ActivityManager.getCurrentStatusLabel();
    activityStatusElement.classList.toggle("afk", ActivityManager.isAFK);
}

let afkCountdownInterval = null;

function updateAfkCountdown() {
    if (!afkCountdown) {
        return;
    }

    afkCountdown.textContent = formatCountdown(
        ActivityManager.getAfkRemainingMs()
    );
}

function showAfkOverlay() {
    if (!afkOverlay) {
        return;
    }

    updateAfkCountdown();
    afkOverlay.classList.add("active");

    clearInterval(afkCountdownInterval);
    afkCountdownInterval = setInterval(updateAfkCountdown, 1000);
}

function hideAfkOverlay() {
    if (!afkOverlay) {
        return;
    }

    afkOverlay.classList.remove("active");
    clearInterval(afkCountdownInterval);
    afkCountdownInterval = null;
}

function handleAutoAbort() {
    hideAfkOverlay();
    ActivityManager.stopPlaying();
    stopQuestCompletionAudio();
    popup.classList.remove("active");
    window.location.href = "index.html";
}

function animateNumber(element, start, end, duration = 1200, formatter = value => String(Math.round(value))) {
    return new Promise(resolve => {
        const startTime = performance.now();

        const step = currentTime => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            const value = start + (end - start) * progress;
            element.textContent = formatter(value);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(step);
    });
}

function animateTimeValue(element, startSeconds, endSeconds, duration = 1200) {
    return animateNumber(element, startSeconds, endSeconds, duration, value => formatTime(Math.round(value)));
}

function waitForTransition(element, propertyName = "opacity", timeout = 600) {
    return new Promise(resolve => {
        let finished = false;

        const cleanup = () => {
            if (finished) {
                return;
            }
            finished = true;
            element.removeEventListener("transitionend", onTransitionEnd);
            clearTimeout(timeoutId);
            resolve();
        };

        const onTransitionEnd = event => {
            if (event.target === element && event.propertyName === propertyName) {
                cleanup();
            }
        };

        const timeoutId = setTimeout(cleanup, timeout);
        element.addEventListener("transitionend", onTransitionEnd);
    });
}

function hideCompletionSections() {
    [
        completeInfo,
        completeStats,
        masteredWordsSummary,
        typingRunSummary,
        comparisonSection
    ].forEach(el => {
        if (!el) return;
        el.classList.remove("animated-visible");
    });
}

function revealElement(element) {
    if (!element) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            element.classList.add("animated-visible");
            waitForTransition(element).then(resolve);
        });
    });
}


const questTitel = document.getElementById("questTitel");
const deutscherText = document.getElementById("deutscherText");
const thaiText = document.getElementById("thaiText");
const storyText = document.getElementById("storyText");
const deutschAktuell =
    document.getElementById("deutschAktuell");
const settingsGermanToggle =
    document.getElementById("settingsGermanToggle");
const settingsThaiFontSelect =
    document.getElementById("settingsThaiFontSelect");
const storyThaiFontSelect =
    document.getElementById("storyThaiFontSelect");
const learningContainer =
    document.getElementById("learningContainer");
const typingFenster =
    document.getElementById("typingFenster");

    const deutschTitel =
    document.getElementById("deutschTitel");

let germanVisible = true;

const THAI_FONT_STORAGE_KEY = "thaiFontFamily";
const THAI_FONT_OPTIONS = [
    "standard",
    "noto-sans-thai",
    "sarabun",
    "prompt",
    "kanit"
];

function normalizeThaiFontSelection(value) {
    const selection = String(value ?? "");
    return THAI_FONT_OPTIONS.includes(selection)
        ? selection
        : "standard";
}

function applyThaiFontSelection(value) {
    const selection = normalizeThaiFontSelection(value);
    const fontClasses = THAI_FONT_OPTIONS.map(
        option => `thai-font-${option}`
    );

    document.body.classList.remove(...fontClasses);
    document.body.classList.add(`thai-font-${selection}`);

    if (settingsThaiFontSelect) {
        settingsThaiFontSelect.value = selection;
    }

    if (storyThaiFontSelect) {
        storyThaiFontSelect.value = selection;
    }

    return selection;
}

function setThaiFontSelection(value) {
    const selection = applyThaiFontSelection(value);
    localStorage.setItem(THAI_FONT_STORAGE_KEY, selection);
}

applyThaiFontSelection(
    localStorage.getItem(THAI_FONT_STORAGE_KEY) || "standard"
);

function aktualisiereGermanToggle() {

    if (!settingsGermanToggle) {
        return;
    }

    settingsGermanToggle.checked = germanVisible;

    settingsGermanToggle.disabled =
        startZeit !== null && !isMobileViewport();

}

questTitel.textContent =
    daten[aktuelleQuest].titel;

storyText.textContent =
    daten[aktuelleQuest].story;

function renderBuchZeilen(deutschZeilen, thaiZeilen) {
    deutscherText.replaceChildren();
    thaiText.replaceChildren();

    const anzahlZeilen =
        Math.max(deutschZeilen.length, thaiZeilen.length);

    for (let index = 0; index < anzahlZeilen; index += 1) {
        const gridZeile = String(index + 2);
        const deutschSatz = document.createElement("div");
        const thaiSatz = document.createElement("div");

        deutschSatz.className = "buch-satz";
        thaiSatz.className = "buch-satz";
        deutschSatz.style.gridRow = gridZeile;
        thaiSatz.style.gridRow = gridZeile;
        deutschSatz.textContent = deutschZeilen[index] || "";
        thaiSatz.textContent = thaiZeilen[index] || "";

        deutscherText.appendChild(deutschSatz);
        thaiText.appendChild(thaiSatz);
    }
}

renderBuchZeilen(
    daten[aktuelleQuest].deutschZeilen,
    daten[aktuelleQuest].thaiZeilen
);
const auftrag = document.getElementById("auftrag");
const deutsch = document.getElementById("deutsch");
const typingBereich =
    document.getElementById("typingBereich");

const startThaiButton =
    document.getElementById("startThai");

const startDeutschButton =
    document.getElementById("startDeutsch");
const thaiZeilen =
    daten[aktuelleQuest].thaiZeilen;

const deutschZeilen =
    daten[aktuelleQuest].deutschZeilen;
let text = thaiZeilen[0];

let position = 0;
let aktuelleZeile = 0;
let fehlerTimeout = null;
let gesamtZeichen = 0;

const MOBILE_THAI_LINE_BUFFER_CLUSTERS = 4;
const MOBILE_THAI_ACTIVE_PADDING = 6;
let mobileThaiGraphemeSegmenter = null;
let mobileThaiWordSegmenter = null;
let mobileThaiMeasureCanvas = null;

// --- Quest-Infoleiste (rein optische Anzeige, siehe html/typing.html) ---
// Diese Elemente spiegeln nur den bereits vorhandenen Spielzustand
// (gesamtZeichen, thaiZeilen) und greifen an keiner Stelle in die
// Eingabelogik oder Wertung ein.
const typingQuestBadgeImage = document.getElementById("typingQuestBadgeImage");
const typingQuestTitel = document.getElementById("typingQuestTitel");
const typingQuestKapitel = document.getElementById("typingQuestKapitel");
const typingQuestSchwierigkeit = document.getElementById("typingQuestSchwierigkeit");
const typingProgressFill = document.getElementById("typingProgressFill");
const typingProgressText = document.getElementById("typingProgressText");
const desktopTypingCpm = document.getElementById("desktopTypingCpm");
const desktopTypingAccuracy = document.getElementById("desktopTypingAccuracy");
const desktopTypingTarget = document.getElementById("desktopTypingTarget");
const desktopTypingProgressFill = document.getElementById("desktopTypingProgressFill");
const desktopTypingWords = document.getElementById("desktopTypingWords");
const desktopTypingLines = document.getElementById("desktopTypingLines");
const desktopTypingErrors = document.getElementById("desktopTypingErrors");

const gesamtZeichenQuest = thaiZeilen.reduce(
    (summe, zeile) => summe + zeile.length,
    0
);

function aktualisiereQuestInfoleiste() {

    if (typingQuestTitel) {
        typingQuestTitel.textContent = daten[aktuelleQuest].titel;
    }

    if (typingQuestKapitel) {
        typingQuestKapitel.textContent = daten[aktuelleQuest].kapitel || "";
    }

    if (typingQuestSchwierigkeit) {
        typingQuestSchwierigkeit.textContent = daten[aktuelleQuest].schwierigkeit || "";
    }

    if (typingQuestBadgeImage && daten[aktuelleQuest].bild) {
        typingQuestBadgeImage.src = "../assets/quest/" + daten[aktuelleQuest].bild + ".png";
        typingQuestBadgeImage.alt = daten[aktuelleQuest].titel || "";
    }

}

function aktualisiereQuestFortschrittUI() {

    const prozent = gesamtZeichenQuest > 0
        ? Math.min(100, Math.round((gesamtZeichen / gesamtZeichenQuest) * 100))
        : 0;

    if (typingProgressFill) {
        typingProgressFill.style.width = prozent + "%";
    }

    if (typingProgressText) {
        typingProgressText.textContent =
            gesamtZeichen + " / " + gesamtZeichenQuest + " Zeichen (" + prozent + "%)";
        typingProgressText.dataset.mobileText =
            gesamtZeichen + " / " + gesamtZeichenQuest;
    }

    const activeTime = ActivityManager.getActiveTimeMs();
    const currentCpm = activeTime > 0
        ? gesamtZeichen / (activeTime / 60000)
        : 0;
    const currentAccuracy = gesamtZeichen + fehler > 0
        ? (gesamtZeichen / (gesamtZeichen + fehler)) * 100
        : 100;
    const totalWords = getThaiWordList(thaiZeilen).words.length;
    const typedWords = getThaiWordList(
        thaiZeilen.slice(0, aktuelleZeile)
    ).words.length;
    const targetCpm = Math.max(
        1,
        Number(player.stats.averageCPM) > 0
            ? Number(player.stats.averageCPM)
            : 20
    );
    const targetMinutes = Math.max(
        1,
        Math.ceil(gesamtZeichenQuest / targetCpm)
    );

    if (desktopTypingCpm) {
        desktopTypingCpm.textContent = Math.round(currentCpm);
    }

    if (desktopTypingAccuracy) {
        desktopTypingAccuracy.textContent =
            `${Math.round(currentAccuracy)}%`;
    }

    if (desktopTypingTarget) {
        desktopTypingTarget.textContent = `${targetMinutes} MIN`;
    }

    if (desktopTypingProgressFill) {
        desktopTypingProgressFill.style.width = `${prozent}%`;
    }

    if (desktopTypingWords) {
        desktopTypingWords.innerHTML =
            `Buchstaben<br><strong>${gesamtZeichen} / ${gesamtZeichenQuest}</strong>`;
    }

    if (desktopTypingLines) {
        desktopTypingLines.innerHTML =
            `Zeilen<br><strong>${Math.min(aktuelleZeile, thaiZeilen.length)} / ${thaiZeilen.length}</strong>`;
    }

    if (desktopTypingErrors) {
        desktopTypingErrors.innerHTML =
            `Fehler<br><strong>${fehler}</strong>`;
    }

    renderQuestAchievementPanel();
}

aktualisiereQuestInfoleiste();
aktualisiereQuestFortschrittUI();

function aktualisiereDeutsch() {

    deutschTitel.style.display =
        germanVisible ? "block" : "none";
    learningContainer?.classList.toggle("is-hidden", !germanVisible);
    typingFenster?.classList.toggle("german-hidden", !germanVisible);

    deutschAktuell.textContent =
        germanVisible
            ? deutschZeilen[aktuelleZeile] || ""
            : "";

}

function getMobileThaiGraphemes(value) {
    if (!value) {
        return [];
    }

    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
        if (!mobileThaiGraphemeSegmenter) {
            mobileThaiGraphemeSegmenter =
                new Intl.Segmenter("th", { granularity: "grapheme" });
        }

        return Array.from(
            mobileThaiGraphemeSegmenter.segment(value),
            segment => ({
                text: segment.segment,
                start: segment.index,
                end: segment.index + segment.segment.length
            })
        );
    }

    const graphemes = [];

    for (const character of value) {
        const previous = graphemes[graphemes.length - 1];

        if (previous && istThailaendischesKombinationszeichen(character)) {
            previous.text += character;
            previous.end += character.length;
        } else {
            const start = previous ? previous.end : 0;
            graphemes.push({
                text: character,
                start,
                end: start + character.length
            });
        }
    }

    return graphemes;
}

function getMobileThaiPreferredBreaks(value) {
    if (
        !value ||
        typeof Intl === "undefined" ||
        typeof Intl.Segmenter !== "function"
    ) {
        return new Set();
    }

    if (!mobileThaiWordSegmenter) {
        mobileThaiWordSegmenter =
            new Intl.Segmenter("th", { granularity: "word" });
    }

    const breakEnds = new Set();

    for (const segment of mobileThaiWordSegmenter.segment(value)) {
        breakEnds.add(segment.index + segment.segment.length);
    }

    return breakEnds;
}

function getMobileThaiMeasureContext() {
    if (!mobileThaiMeasureCanvas) {
        mobileThaiMeasureCanvas = document.createElement("canvas");
    }

    return mobileThaiMeasureCanvas.getContext("2d");
}

function measureMobileThaiText(value) {
    const style = getComputedStyle(zeile1);
    const fontSize = parseFloat(style.fontSize) || 20;
    const context = getMobileThaiMeasureContext();

    if (!context) {
        return Math.max(fontSize * 0.8, value.length * fontSize * 0.9);
    }

    context.font =
        `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    return context.measureText(value).width;
}

function getMobileThaiLineWidth() {
    const style = getComputedStyle(zeile1);
    const horizontalPadding =
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.paddingRight) || 0);
    const elementWidth = zeile1.clientWidth - horizontalPadding;

    if (elementWidth > 0) {
        return elementWidth;
    }

    const windowStyle = getComputedStyle(typingFenster);
    const windowPadding =
        (parseFloat(windowStyle.paddingLeft) || 0) +
        (parseFloat(windowStyle.paddingRight) || 0);

    return Math.max(160, typingFenster.clientWidth - windowPadding);
}

function getMobileThaiLineLayout(value) {
    const graphemes = getMobileThaiGraphemes(value);

    if (graphemes.length === 0) {
        return [];
    }

    const lineWidth = getMobileThaiLineWidth();
    const bufferWidth =
        MOBILE_THAI_LINE_BUFFER_CLUSTERS * measureMobileThaiText("ก");
    const safeWidth = Math.max(
        1,
        lineWidth - bufferWidth - MOBILE_THAI_ACTIVE_PADDING
    );
    const widths = graphemes.map(grapheme =>
        measureMobileThaiText(grapheme.text)
    );
    const preferredBreaks = getMobileThaiPreferredBreaks(value);
    const lines = [];
    let lineStart = 0;

    while (lineStart < graphemes.length) {
        let lineEnd = lineStart;
        let lineUsedWidth = 0;
        let preferredLineEnd = lineStart;

        while (lineEnd < graphemes.length) {
            const nextWidth = widths[lineEnd];

            if (
                lineEnd > lineStart &&
                lineUsedWidth + nextWidth > safeWidth
            ) {
                break;
            }

            lineUsedWidth += nextWidth;
            lineEnd++;

            if (preferredBreaks.has(graphemes[lineEnd - 1].end)) {
                preferredLineEnd = lineEnd;
            }
        }

        if (lineEnd === lineStart) {
            lineEnd++;
        }

        if (
            lineEnd < graphemes.length &&
            preferredLineEnd > lineStart
        ) {
            lineEnd = preferredLineEnd;
        }

        lines.push({
            start: graphemes[lineStart].start,
            end: graphemes[lineEnd - 1].end
        });
        lineStart = lineEnd;
    }

    return lines;
}

function escapeMobileThaiHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getThaiHighlightRange(lineStart, lineEnd) {
    const highlightStart = Math.max(lineStart, Math.min(position, lineEnd - 1));

    return {
        start: highlightStart,
        end: Math.min(lineEnd, highlightStart + 1)
    };
}

function renderMobileThaiLines(highlightClass = "aktuell") {
    const lines = getMobileThaiLineLayout(text);
    const currentLineIndex = lines.findIndex(line =>
        position >= line.start && position < line.end
    );

    zeile1.innerHTML = lines.map((line, lineIndex) => {
        const lineText = text.slice(line.start, line.end);

        if (lineIndex < currentLineIndex) {
            return `<span class="mobile-thai-line"><span class="geschrieben">${escapeMobileThaiHtml(lineText)}</span></span>`;
        }

        if (lineIndex > currentLineIndex) {
            return `<span class="mobile-thai-line"><span class="rest">${escapeMobileThaiHtml(lineText)}</span></span>`;
        }

        const highlightRange = getThaiHighlightRange(line.start, line.end);
        const geschrieben = text.slice(line.start, highlightRange.start);
        const aktuell = text.slice(highlightRange.start, highlightRange.end);
        const rest = text.slice(highlightRange.end, line.end);

        return `<span class="mobile-thai-line"><span class="geschrieben">${escapeMobileThaiHtml(geschrieben)}</span><span class="${highlightClass}">${escapeMobileThaiHtml(aktuell)}</span><span class="rest">${escapeMobileThaiHtml(rest)}</span></span>`;
    }).join("");

    zeile1.classList.add("mobile-thai-lines");
}

// Thailändische Ton- und Vokalzeichen (nicht abstandshaltende
// Kombinationszeichen) verbinden sich optisch mit dem vorherigen Zeichen.
// Landet die aktuelle Tippposition genau auf so einem Zeichen, darf es nicht
// allein in der farbig hervorgehobenen "aktuell"-Box stehen: ohne sein
// Basiszeichen im selben Textlauf kann der Browser es nicht korrekt
// platzieren und zeigt stattdessen ein abgetrenntes, kaputt wirkendes
// Kästchen an. Siehe zeigeZeilen().
const THAI_COMBINING_MARKS = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;

function istThailaendischesKombinationszeichen(zeichen) {
    return !!zeichen && THAI_COMBINING_MARKS.test(zeichen);
}

function zeigeZeilen() {

    aktualisiereDeutsch();

    if (usesStableThaiLines()) {
        renderMobileThaiLines();
        zeile2.textContent = "";
        return;
    }

    let geschrieben, aktuell, rest;

    // Basiszeichen mit in die Hervorhebung aufnehmen, falls das aktuelle
    // Zeichen selbst ein Kombinationszeichen ist.
    let hervorhebungStart = position;
    while (
        hervorhebungStart > 0 &&
        istThailaendischesKombinationszeichen(text[hervorhebungStart])
    ) {
        hervorhebungStart--;
    }

    geschrieben =
        text.substring(0, hervorhebungStart);

    aktuell =
        text.substring(hervorhebungStart, position + 1);

    rest =
        text.substring(position + 1);

    zeile1.innerHTML =
        "<span class='geschrieben'>" +
        geschrieben +
        "</span>" +

        "<span class='aktuell'>" +
        aktuell +
        "</span>" +

        "<span class='rest'>" +
        rest +
        "</span>";

    zeile2.textContent = isMobileViewport()
        ? ""
        : (thaiZeilen[aktuelleZeile + 1] || "");

}


function naechsteZeile() {
    if (isMobileViewport()) {
        zeile1.classList.add("mobile-sentence-exit");

        setTimeout(function () {
            text = thaiZeilen[aktuelleZeile];
            position = 0;

            zeigeZeilen();
            syncKeyboardHighlight();

            zeile1.classList.remove("mobile-sentence-exit");
            zeile1.classList.add("mobile-sentence-enter");

            requestAnimationFrame(function () {
                zeile1.classList.add("mobile-sentence-enter-active");
            });

            setTimeout(function () {
                zeile1.classList.remove("mobile-sentence-enter");
                zeile1.classList.remove("mobile-sentence-enter-active");
            }, 180);
        }, 150);
        return;
    }

    zeile1.classList.add("nach-oben");

    setTimeout(function(){

        text = thaiZeilen[aktuelleZeile];
        position = 0;

        zeigeZeilen();
        syncKeyboardHighlight();

        zeile1.classList.remove("nach-oben");

    },250);

}

function zeigeFehler() {

    clearTimeout(fehlerTimeout);

    if (usesStableThaiLines()) {
        if (isMobileViewport() && mobileInputMethod === "game") {
            window.typingFeedback?.triggerError();
        }

        renderMobileThaiLines("fehler");
        zeile2.textContent = "";
        fehlerTimeout = setTimeout(function () {
            zeigeZeilen();
        }, 150);
        return;
    }

    let geschrieben, aktuell, rest;

    // Ensure combining marks are grouped with their base character when
    // showing the 'fehler' highlight - otherwise a detached combining mark
    // can render as a broken glyph.
    let hervorhebungStart = position;
    while (
        hervorhebungStart > 0 &&
        istThailaendischesKombinationszeichen(text[hervorhebungStart])
    ) {
        hervorhebungStart--;
    }

    geschrieben =
        text.substring(0, hervorhebungStart);

    aktuell =
        text.substring(hervorhebungStart, position + 1) || "";

    rest =
        text.substring(position + 1);

    zeile1.innerHTML =

        "<span class='geschrieben'>" +
        geschrieben +
        "</span>" +

        "<span class='fehler'>" +
        aktuell +
        "</span>" +

        "<span class='rest'>" +
        rest +
        "</span>";

    fehlerTimeout = setTimeout(function(){

        zeigeZeilen();

    },150);

}

function verarbeiteRichtigenBuchstaben() {
 
    position++;
    gesamtZeichen++;

    aktualisiereQuestFortschrittUI();
 
    eingabe.value = "";
 
    if (position < text.length) {
 
        zeigeZeilen();
        syncKeyboardHighlight();
 
    }
 
    // Zeile fertig?
    if (position >= text.length) {

        registerCompletedTypingSentence();
 
        aktuelleZeile++;
 
        // Quest fertig?
        if (aktuelleZeile >= thaiZeilen.length) {
 
            endZeit = Date.now();
 
            if (mode === "learning") {
 
                ActivityManager.stopPlaying();
                document
                    .getElementById("examOverlay")
                    .classList.add("active");
 
                syncKeyboardHighlight();
                return;
 
            }
 
            beendePruefung();
 
            return;
 
        }
 
        naechsteZeile();
  
    }
 
}

function beendePruefung() {

    const zeit = ActivityManager.getActiveTimeMs();
    const sekunden = Math.floor(zeit / 1000);

    const minuten = Math.floor(sekunden / 60);
    const restSekunden = sekunden % 60;

    const minutenGesamt = zeit / 60000;

    const cpm = (gesamtZeichen / minutenGesamt).toFixed(1);

    const accuracy =
        (
            (gesamtZeichen / (gesamtZeichen + fehler)) * 100
        ).toFixed(1);

    ActivityManager.stopPlaying();

    const zeitAnzeige =
        String(minuten).padStart(2, "0") +
        ":" +
        String(restSekunden).padStart(2, "0");

    zeitAnzeigeElement.textContent = zeitAnzeige;
    wpmAnzeigeElement.textContent = cpm;
    accuracyAnzeigeElement.textContent = accuracy + "%";

    popupKapitel.textContent = daten[aktuelleQuest].titel;

    const completeQuestImage =
        document.getElementById("completeQuestImage");

    if (daten[aktuelleQuest].bild) {
        completeQuestImage.src =
            "../assets/quest/" +
            daten[aktuelleQuest].bild +
            ".png";
    }

    popupZeit.textContent = "00:00";
    popupCPM.textContent = "0";
    popupAccuracy.textContent = "0%";
    popupNewWords.textContent = "0";

    const newRecords = completeQuest(
        questStatsId,
        sekunden,
        Number(cpm),
        Number(accuracy),
        gesamtZeichen,
        daten[aktuelleQuest].version ?? 1
    );

    runNewWords = newRecords.newUniqueWords;
    runMasteredWords = newRecords.newMasteredWords;
    evaluateCurrentTypingAwards({
        perfectQuest: accuracy >= 100 ? 1 : 0,
        newRecord:
            newRecords.newBestTime || newRecords.newBestCPM
                ? 1
                : 0,
        tastenhilfeEnabled
    });
    finalizeQuestAchievementProgress(questStatsId, {
        cpm: Number(cpm),
        accuracy: Number(accuracy),
        cleanWords: runCleanWords,
        newWords: runNewWords,
        masteredWords: runMasteredWords,
        cleanSentenceStreak: maxCleanSentenceStreak,
        perfectQuest: accuracy >= 100 ? 1 : 0,
        newRecord:
            newRecords.newBestTime || newRecords.newBestCPM
                ? 1
                : 0,
        tastenhilfeEnabled
    });
    renderQuestAchievementPanel();

    showRecordSummary(newRecords);
    popupNewWords.textContent = newRecords.newUniqueWords;
    popupNewWordsStat.hidden = newRecords.newUniqueWords <= 0;
    renderMasteredWordsSummary(newRecords.newlyMasteredWords);
    renderTypingRunSummary(getPlayerXpSummary());
    hideCompletionSections();
    openQuestCompletionOverlay();
    playQuestCompletionAudio();

    const completionAnimation = async () => {
        await revealElement(completeInfo);
        await revealElement(completeStats);
        await revealElement(masteredWordsSummary);

        await Promise.all([
            animateTimeValue(popupZeit, 0, sekunden, 1300),
            animateNumber(popupCPM, 0, Number(cpm), 1300, value => value.toFixed(1)),
            animateNumber(popupAccuracy, 0, Number(accuracy), 1300, value => `${value.toFixed(1)}%`),
            animateNumber(popupNewWords, 0, newRecords.newUniqueWords),
        ]);

        await revealElement(typingRunSummary);
        await revealElement(comparisonSection);
        await animateRecordSummary(newRecords);
    };

    completionAnimation();

}

function startePruefung() {
 
    if (startZeit !== null) {
 
        return;
 
    }
 
    startZeit = Date.now();
 
    ActivityManager.startPlaying();
 
    aktualisiereGermanToggle();
 
}

function bereitePruefungVor() {

    ActivityManager.stopPlaying();

    startZeit = null;
    endZeit = null;

    fehler = 0;
    gesamtZeichen = 0;
    resetTypingAwardRun();

    aktualisiereQuestFortschrittUI();

    position = 0;
    aktuelleZeile = 0;

    germanVisible = false;

    text = thaiZeilen[0];

    eingabe.value = "";

    zeigeZeilen();
   syncKeyboardHighlight();
 
    focusEingabeWithoutScroll();
 
    aktualisiereGermanToggle();
}


eingabe.addEventListener("input", function () {

    console.log("INPUT", eingabe.value);

    const eingegeben = keyboardTutorModeEnabled && !isSystemKeyboardMode()
        ? pendingTutorInput
        : eingabe.value;
    pendingTutorInput = null;

    // Noch nichts eingegeben
    if (!eingegeben || eingegeben.length === 0) {
        return;
    }

    // Gesamtspielzeit erfassen in beiden Modi
    if (ActivityManager.status !== "PLAYING") {
        ActivityManager.startPlaying();
    }

    ActivityManager.registerActivity();

    if (mode === "exam") {
        // Erster Tastendruck startet nur den Questmodus
        startePruefung();
    }

    // Erwarteter Buchstabe
    const erwartet = text[position];

if (eingegeben === erwartet) {

    if (!isMobileViewport()) {
        window.typingFeedback?.trigger();
    }

    verarbeiteRichtigenBuchstaben();

}

else {

currentSentenceHasError = true;

if (mode === "exam") {
    fehler++;
    }

    if (!isMobileViewport()) {
        window.typingFeedback?.triggerError();
    }

    zeigeFehler();

    eingabe.value = "";

}

});
 
 
startDeutschButton.addEventListener("click", function () {
    phase = "deutsch";

    zeigePhase();

});

startThaiButton.addEventListener("click", function () {

    resetTypingAwardRun();
    phase = "typing";

    zeigePhase();

focusEingabeWithoutScroll();

});

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const settingsTastenhilfeToggle = document.getElementById("settingsTastenhilfeToggle");
const settingsDelaySlider = document.getElementById("settingsDelaySlider");
const settingsDelayValue = document.getElementById("settingsDelayValue");
const settingsVibrationToggle = document.getElementById("settingsVibrationToggle");
const settingsSoundToggle = document.getElementById("settingsSoundToggle");
const settingsSoundPreset = document.getElementById("settingsSoundPreset");
const settingsSoundPresetRow = document.getElementById("settingsSoundPresetRow");
const settingsVibrationRow = document.getElementById("settingsVibrationRow");
const settingsVibrationHint = document.getElementById("settingsVibrationHint");
const mobileBackButton = document.getElementById("mobileBackButton");
const mobileInputGame = document.getElementById("mobileInputGame");
const mobileInputSystem = document.getElementById("mobileInputSystem");
const settingsTutorRow = document.getElementById("settingsTutorRow");
const settingsDelayRow = settingsDelaySlider?.closest(".settings-row");
const systemKeyboardTutorHint = document.getElementById("systemKeyboardTutorHint");
const leaveQuestButton = document.getElementById("leaveQuestButton");
const questBarLeaveButton = document.getElementById("questBarLeaveButton");
const leaveQuestOverlay = document.getElementById("leaveQuestOverlay");
const cancelLeaveQuestButton = document.getElementById("cancelLeaveQuestButton");
const confirmLeaveQuestButton = document.getElementById("confirmLeaveQuestButton");

// Verhindert, dass Tastatureingaben/Klicks im geöffneten Einstellungsmenü
// (z.B. Leertaste zum Umschalten eines Toggles) versehentlich als
// Spieleingabe in #eingabe landen oder ihr den Fokus entziehen.
let settingsPanelOpen = false;

// Gibt true zurück, solange irgendein Overlay (Einstellungsmenü oder
// Quest-verlassen-Bestätigung) sichtbar ist. Wird verwendet, um
// Tastatur-/Zeigereingaben währenddessen vom Spiel fernzuhalten.
function isEingabeGesperrt() {
    return (
        settingsPanelOpen ||
        Boolean(leaveQuestOverlay?.classList.contains("active"))
    );
}

function formatiereTastenhilfeSekunden(sekunden) {
    if (sekunden === 0) {
        return "0 Sekunden (dauerhaft)";
    }
    return sekunden === 1 ? "1 Sekunde" : `${sekunden} Sekunden`;
}

function isMobileViewport() {
    return typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 900px)").matches;
}

function isDesktopTypingViewport() {
    return Boolean(typingBereich) &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(min-width: 901px)").matches;
}

function usesStableThaiLines() {
    return isMobileViewport() || isDesktopTypingViewport();
}

function isSystemKeyboardMode() {
    return isMobileViewport() && mobileInputMethod === "system";
}

function focusEingabeWithoutScroll() {
    if (!eingabe) {
        return;
    }

    try {
        eingabe.focus({ preventScroll: true });
    } catch (_error) {
        eingabe.focus();
    }

    if (isMobileViewport()) {
        window.scrollTo(0, 0);
    }
}

function updateMobileViewportHeightVar() {
    if (!isMobileViewport()) {
        return;
    }

    // Nur im System-Tastatur-Modus wird wirklich eine per JS berechnete Höhe
    // gebraucht (damit Platz für die native Tastatur bleibt). Im normalen
    // Spiel-Modus (eigene virtuelle Tastatur) sorgt das Fixieren auf einen
    // px-Wert dafür, dass die Seite kurz nach Tippbeginn "springt", sobald
    // der Browser seine Adressleiste einklappt und visualViewport.height
    // dadurch wächst. Dort reicht das native, sich weich anpassende 100dvh
    // (Fallback unten in der CSS-Variable) völlig aus.
    if (!isSystemKeyboardMode()) {
        document.documentElement.style.removeProperty("--mobile-vh");
        return;
    }

    const viewportHeight = window.visualViewport
        ? Math.round(window.visualViewport.height)
        : window.innerHeight;

    document.documentElement.style.setProperty(
        "--mobile-vh",
        `${viewportHeight}px`
    );
}

function enforceSystemKeyboardNoScroll() {
    if (!isSystemKeyboardMode()) {
        return;
    }

    window.scrollTo(0, 0);
}

function applyMobileKeyboardStructure() {
    if (!keyboardElement) {
        return;
    }

    const row1 = keyboardElement.querySelector(".row-1");
    const row3 = keyboardElement.querySelector(".row-3");
    const row4 = keyboardElement.querySelector(".row-4");
    const row5 = keyboardElement.querySelector(".row-5");

    if (!row1 || !row3 || !row4 || !row5) {
        return;
    }

    const backspaceKey = keyboardElement.querySelector(".key-backspace");
    const enterKey = keyboardElement.querySelector(".key-enter");
    const shiftKeys = keyboardElement.querySelectorAll(".key-shift");
    const rightShiftKey = shiftKeys.length > 1 ? shiftKeys[1] : null;

    if (isMobileViewport()) {
        if (rightShiftKey) {
            rightShiftKey.classList.add("mobile-secondary-shift");
        }

        if (backspaceKey && backspaceKey.parentElement !== row4) {
            row4.appendChild(backspaceKey);
        }

        if (enterKey && enterKey.parentElement !== row5) {
            row5.appendChild(enterKey);
        }

        return;
    }

    if (rightShiftKey) {
        rightShiftKey.classList.remove("mobile-secondary-shift");
    }

    if (backspaceKey && backspaceKey.parentElement !== row1) {
        row1.appendChild(backspaceKey);
    }

    if (enterKey && enterKey.parentElement !== row3) {
        row3.appendChild(enterKey);
    }
}

function aktualisiereTastenhilfeUI() {

    const systemKeyboardActive = isSystemKeyboardMode();
    const vibrationSupported = window.typingFeedback?.supportsVibration() === true;

    if (settingsTastenhilfeToggle) {
        settingsTastenhilfeToggle.checked = tastenhilfeEnabled;
        settingsTastenhilfeToggle.disabled = systemKeyboardActive;
    }

    if (settingsDelaySlider) {
        const minSekunden = TASTENHILFE_MIN_SEKUNDEN;
        if (tastenhilfeVerzoegerungSekunden < minSekunden) {
            tastenhilfeVerzoegerungSekunden = minSekunden;
            localStorage.setItem(
                "tastenhilfeVerzoegerung",
                String(tastenhilfeVerzoegerungSekunden)
            );
        }

        settingsDelaySlider.min = String(minSekunden);
        settingsDelaySlider.value = String(tastenhilfeVerzoegerungSekunden);
        settingsDelaySlider.disabled = !tastenhilfeEnabled || systemKeyboardActive;
    }

    if (settingsDelayValue) {
        settingsDelayValue.textContent =
            formatiereTastenhilfeSekunden(tastenhilfeVerzoegerungSekunden);
    }

    settingsTutorRow?.classList.toggle("disabled", systemKeyboardActive);
    settingsDelayRow?.classList.toggle("disabled", systemKeyboardActive);
    systemKeyboardTutorHint?.classList.toggle("visible", systemKeyboardActive);

    if (settingsVibrationToggle) {
        settingsVibrationToggle.checked =
            vibrationSupported && window.typingFeedback.isVibrationEnabled();
        settingsVibrationToggle.disabled = !vibrationSupported;
    }

    if (settingsSoundToggle) {
        const soundEnabled = window.typingFeedback?.isSoundEnabled() === true;
        settingsSoundToggle.checked = soundEnabled;

        if (settingsSoundPreset) {
            settingsSoundPreset.value =
                window.typingFeedback?.getSoundPreset() || "recorded-click";
            settingsSoundPreset.disabled = !soundEnabled;
        }

        settingsSoundPresetRow?.classList.toggle("visible", soundEnabled);
    }

    settingsVibrationRow?.classList.toggle("disabled", !vibrationSupported);
    settingsVibrationHint?.classList.toggle("visible", !vibrationSupported);

}

function applyMobileInputMethod() {
    const systemKeyboardActive = isSystemKeyboardMode();

    document.body.classList.toggle("system-keyboard-mode", systemKeyboardActive);
    eingabe.readOnly = isMobileViewport() && !systemKeyboardActive;

    if (mobileInputGame) {
        mobileInputGame.checked = mobileInputMethod === "game";
    }

    if (mobileInputSystem) {
        mobileInputSystem.checked = mobileInputMethod === "system";
    }

    tastenhilfeEnabled = systemKeyboardActive
        ? false
        : gameTastenhilfeEnabled;

    applyMobileKeyboardStructure();
    updateMobileViewportHeightVar();
    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();
    renderVirtualKeyboardLabels();
}

function setMobileInputMethod(method) {
    mobileInputMethod = method === "system" ? "system" : "game";
    localStorage.setItem(MOBILE_INPUT_METHOD_KEY, mobileInputMethod);
    eingabe.blur();
    applyMobileInputMethod();
}

function openSettingsPanel() {

    if (!settingsPanel) {
        return;
    }

    settingsPanelOpen = true;
    settingsPanel.classList.add("open");
    settingsBackdrop?.classList.add("active");
    settingsButton?.setAttribute("aria-expanded", "true");

    // Fokus vom Eingabefeld nehmen, damit Tastatureingaben nicht
    // ungefiltert (ohne Tutor-Übersetzung) im Spiel landen.
    eingabe.blur();

}

function closeSettingsPanel() {

    if (!settingsPanel) {
        return;
    }

    settingsPanelOpen = false;
    settingsPanel.classList.remove("open");
    settingsBackdrop?.classList.remove("active");
    settingsButton?.setAttribute("aria-expanded", "false");

    if (phase === "typing") {
        focusEingabeWithoutScroll();
    }

}

settingsButton?.addEventListener("mousedown", function (event) {
    event.preventDefault();
});

settingsButton?.addEventListener("click", function () {
    if (settingsPanelOpen) {
        closeSettingsPanel();
    } else {
        openSettingsPanel();
    }
});

settingsCloseButton?.addEventListener("click", closeSettingsPanel);
settingsBackdrop?.addEventListener("click", closeSettingsPanel);

settingsGermanToggle?.addEventListener("change", function () {

    germanVisible = settingsGermanToggle.checked;

    aktualisiereGermanToggle();

    zeigeZeilen();

});

settingsThaiFontSelect?.addEventListener("change", function () {
    setThaiFontSelection(settingsThaiFontSelect.value);
});

storyThaiFontSelect?.addEventListener("change", function () {
    setThaiFontSelection(storyThaiFontSelect.value);
});

settingsTastenhilfeToggle?.addEventListener("change", function () {

    tastenhilfeEnabled = settingsTastenhilfeToggle.checked;
    gameTastenhilfeEnabled = tastenhilfeEnabled;

    localStorage.setItem("tastenhilfeAktiviert", String(tastenhilfeEnabled));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

settingsVibrationToggle?.addEventListener("change", function () {
    window.typingFeedback?.setVibrationEnabled(settingsVibrationToggle.checked);
    aktualisiereTastenhilfeUI();
});

settingsSoundToggle?.addEventListener("change", function () {
    window.typingFeedback?.setSoundEnabled(settingsSoundToggle.checked);
    aktualisiereTastenhilfeUI();
});

settingsSoundPreset?.addEventListener("change", function () {
    window.typingFeedback?.setSoundPreset(settingsSoundPreset.value);
    aktualisiereTastenhilfeUI();
});

mobileInputGame?.addEventListener("change", function () {
    if (mobileInputGame.checked) {
        setMobileInputMethod("game");
    }
});

mobileInputSystem?.addEventListener("change", function () {
    if (mobileInputSystem.checked) {
        setMobileInputMethod("system");
    }
});

settingsDelaySlider?.addEventListener("input", function () {

    tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(
        settingsDelaySlider.value,
        TASTENHILFE_MIN_SEKUNDEN
    );

    localStorage.setItem("tastenhilfeVerzoegerung", String(tastenhilfeVerzoegerungSekunden));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

// Gemeinsame Logik für beide "Quest verlassen"-Einstiegspunkte
// (Einstellungsmenü und Quest-Infoleiste) - öffnet denselben
// Bestätigungsdialog, keine zweite Logik.
function oeffneLeaveQuestBestaetigung() {
    closeSettingsPanel();
    leaveQuestOverlay?.classList.add("active");
    eingabe.blur();
}

leaveQuestButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);
questBarLeaveButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);
mobileBackButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);

cancelLeaveQuestButton?.addEventListener("click", function () {

    leaveQuestOverlay?.classList.remove("active");

    if (phase === "typing") {
        focusEingabeWithoutScroll();
    }

});

confirmLeaveQuestButton?.addEventListener("click", function () {

    ActivityManager.stopPlaying();
    stopQuestCompletionAudio();

    leaveQuestOverlay?.classList.remove("active");

    window.location.href = "index.html";

});

weiterButton.addEventListener("click", function () {
 
    ActivityManager.stopPlaying();
    stopQuestCompletionAudio();
 
    popup.classList.remove("active");
 
    window.location.href = "index.html";
 
});

resumeAfkButton?.addEventListener("click", function () {
    if (ActivityManager.isAFK) {
        ActivityManager.resumeFromAfk();
    } else {
        ActivityManager.registerActivity();
    }
    focusEingabeWithoutScroll();
});


document
    .getElementById("startExamButton")
    ?.addEventListener("click", function () {

        mode = "exam";

        document
            .getElementById("examOverlay")
            .classList.remove("active");

        bereitePruefungVor();

    });

applyMobileInputMethod();

if (questMode === "challenge") {

    phase = "typing";
    mode = "exam";
    germanVisible = false;
resetTypingAwardRun();

    focusEingabeWithoutScroll();

}
aktualisiereGermanToggle();

zeigePhase();

zeigeZeilen();
syncKeyboardHighlight();


function showRecordSummary(records){

    const container =
        document.getElementById("recordContainer");

    container.classList.add("active");

    const bestTime =
        records.oldBestTime === null
            ? records.newTime
            : records.oldBestTime;

    const bestAccuracy =
        records.oldBestAccuracy === null
            ? records.newAccuracy
            : records.oldBestAccuracy;

const timeDiff = records.newTime - bestTime;
const accuracyDiff = Number((records.newAccuracy - bestAccuracy).toFixed(1));

const timeColor = timeDiff < 0 ? "#2aa84a" : timeDiff > 0 ? "#cc4040" : "#f1e0a1";
const accuracyColor = accuracyDiff > 0 ? "#2aa84a" : accuracyDiff < 0 ? "#cc4040" : "#f1e0a1";


    // eine gemeinsame Tabelle. Die Berechnungen oberhalb werden weiterverwendet.
    container.innerHTML = `
        <div class="record-row">
            <div class="record-label">&#9201; ZEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong id="bestTimeValue">${formatTime(0)}</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong id="currentTimeValue">${formatTime(0)}</strong>
            </div>
            <div class="record-cell record-result" style="color:${timeColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong id="timeResultText" class="result-hidden"></strong>
            </div>
        </div>

        <div class="record-row">
            <div class="record-label">&#127919; GENAUIGKEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong id="bestAccuracyValue">0 %</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong id="currentAccuracyValue">0 %</strong>
            </div>
            <div class="record-cell record-result" style="color:${accuracyColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong id="accuracyResultText" class="result-hidden"></strong>
            </div>
        </div>
    `;

    return {
        bestTime,
        bestAccuracy,
        timeDiff,
        accuracyDiff,
        timeColor,
        accuracyColor,
        records,
    };

}

function animateRecordSummary(records) {
    const bestTimeValue = document.getElementById("bestTimeValue");
    const currentTimeValue = document.getElementById("currentTimeValue");
    const bestAccuracyValue = document.getElementById("bestAccuracyValue");
    const currentAccuracyValue = document.getElementById("currentAccuracyValue");
    const timeResultText = document.getElementById("timeResultText");
    const accuracyResultText = document.getElementById("accuracyResultText");

    const bestTime = records.oldBestTime === null ? records.newTime : records.oldBestTime;
    const bestAccuracy = records.oldBestAccuracy === null ? records.newAccuracy : records.oldBestAccuracy;
    const timeDiff = records.newTime - bestTime;
    const accuracyDiff = Number((records.newAccuracy - bestAccuracy).toFixed(1));

    const animatePromises = [
        bestTimeValue ? animateTimeValue(bestTimeValue, 0, bestTime, 1200) : Promise.resolve(),
        currentTimeValue ? animateTimeValue(currentTimeValue, 0, records.newTime, 1200) : Promise.resolve(),
        bestAccuracyValue ? animateNumber(bestAccuracyValue, 0, bestAccuracy, 1200, value => `${value.toFixed(1)}%`) : Promise.resolve(),
        currentAccuracyValue ? animateNumber(currentAccuracyValue, 0, records.newAccuracy, 1200, value => `${value.toFixed(1)}%`) : Promise.resolve(),
    ];

    return Promise.all(animatePromises).then(() => {
        if (timeResultText) {
            timeResultText.textContent = timeDiff < 0
                ? `Neuer Rekord! (-${Math.abs(timeDiff)} Sek.)`
                : timeDiff > 0
                    ? `+${timeDiff} Sek.`
                    : "Gleich schnell";
            timeResultText.classList.remove("result-hidden");
            timeResultText.classList.add("result-visible");
        }

        if (accuracyResultText) {
            accuracyResultText.textContent = accuracyDiff > 0
                ? "Neuer Rekord!"
                : accuracyDiff < 0
                    ? `${accuracyDiff}%`
                    : "Unverändert";
            accuracyResultText.classList.remove("result-hidden");
            accuracyResultText.classList.add("result-visible");
        }
    });
}

document.addEventListener("keydown", function (event) {

   if (phase !== "typing") {
       return;
   }

   // Solange das Einstellungsmenü oder der Quest-verlassen-Dialog
   // offen ist, sollen Tastendrücke nicht als Spieleingabe in
   // #eingabe interpretiert werden.
   if (isEingabeGesperrt()) {
       return;
   }

   if (isSystemKeyboardMode()) {
       return;
   }

      resolvePressedVirtualKeys(event).forEach(pressKey);


   if (!keyboardTutorModeEnabled) {
       return;
   }

   const translatedCharacter = translatePhysicalKey(event);

   if (!translatedCharacter) {
       return;
   }

   event.preventDefault();
   pendingTutorInput = translatedCharacter;
   eingabe.value = translatedCharacter;
   eingabe.dispatchEvent(new Event("input", { bubbles: true }));

});

document.addEventListener("pointerdown", function () {
 
    if (phase === "typing" && !isEingabeGesperrt()) {
 
        setTimeout(function () {
 
            focusEingabeWithoutScroll();
 
        }, 0);
 
    }
 
});

/* =========================================================
   MOBILE: Tap-to-Type für die virtuelle Thai-Tastatur
   ---------------------------------------------------------
   Auf Smartphones gibt es keine physische Tastatur - die
   virtuelle Tastatur war bisher rein visuell (Tutor-Highlight
   bei physischen Tastendrücken, siehe weiter oben). Diese
   Erweiterung macht die Tasten zusätzlich antippbar, ohne
   etwas an der physischen Tastatureingabe zu verändern.

   Die Zeichen werden über denselben Weg eingespeist wie im
   bestehenden Keyboard-Tutor-Modus (eingabe.value + "input"
   Event) - es entsteht also KEINE zweite/parallele Spiellogik.

   Aktiv nur auf Touch-Geräten (grobes Zeigegerät / kein Hover):
   Auf Desktop mit Maus bleibt ein Klick auf die Tastatur exakt
   folgenlos, wie es bisher schon der Fall war.
========================================================= */

const isTouchDevice =
    (typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
    navigator.maxTouchPoints > 0;

// Mobile Geräte haben keine physische Shift-Taste: ein Tap auf
// "Shift" aktiviert den Shift-Zustand für genau das nächste
// Zeichen (klassisches Mobile-Keyboard-Verhalten).
var virtualShiftActive = false;
var virtualKeyLabelsInitialized = false;

function initializeVirtualKeyboardLabels() {
    if (virtualKeyLabelsInitialized || !keyboardElement) {
        return;
    }

    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        if (keyElement.classList.contains("key-action")) {
            return;
        }

        keyElement.dataset.baseLabel = keyElement.textContent.trim();

        const shiftLabel = keyElement.getAttribute("data-shift-key");
        if (shiftLabel) {
            keyElement.dataset.shiftLabel = shiftLabel;
        }
    });

    virtualKeyLabelsInitialized = true;
}

function renderVirtualKeyboardLabels() {
    if (!keyboardElement || !isMobileViewport()) {
        return;
    }

    initializeVirtualKeyboardLabels();

    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        if (keyElement.classList.contains("key-action")) {
            return;
        }

        const shiftLabel =
            keyElement.dataset.shiftLabel ||
            keyElement.getAttribute("data-shift-key");

        const baseLabel =
            keyElement.dataset.baseLabel ||
            keyElement.getAttribute("data-key") ||
            "";

        keyElement.textContent =
            virtualShiftActive && shiftLabel
                ? shiftLabel
                : baseLabel;
    });
}

function updateVirtualShiftVisual() {
    getKeyElements("Shift").forEach(el => {
        el.classList.toggle("virtual-shift-active", virtualShiftActive);
    });
    renderVirtualKeyboardLabels();
}

function typeCharacterFromVirtualKey(character) {
    if (phase !== "typing" || !character) {
        return;
    }

    // Gleicher Einspeisungsweg wie der bestehende Tutor-Modus
    // (siehe keydown-Listener oben): funktioniert unabhängig
    // davon, ob der Tutor-Modus aktuell an- oder ausgeschaltet ist.
    pendingTutorInput = character;
    eingabe.value = character;
    eingabe.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleVirtualKeyTap(keyElement) {
    if (!keyElement || phase !== "typing" ||
        !isMobileViewport() || mobileInputMethod !== "game") {
        return;
    }

    if (keyElement.classList.contains("key-shift")) {
        window.typingFeedback?.trigger();
        pressKey("Shift");
        virtualShiftActive = !virtualShiftActive;
        updateVirtualShiftVisual();
        return;
    }

    // Backspace/Enter haben in der bestehenden Eingabelogik keine
    // Funktion (Prüfung erfolgt Zeichen für Zeichen, siehe der
    // "input"-Listener von #eingabe weiter oben) - nur visuelles
    // Feedback, kein Verhalten wird hinzuerfunden.
    if (keyElement.classList.contains("key-action")) {
        window.typingFeedback?.trigger();
        pressKey(keyElement.getAttribute("data-key"));
        return;
    }

    const shiftCharacter = keyElement.getAttribute("data-shift-key");
    const character = virtualShiftActive && shiftCharacter
        ? shiftCharacter
        : keyElement.getAttribute("data-key");

    const isExpectedCharacter = text[position] === character;

    if (isExpectedCharacter) {
        window.typingFeedback?.trigger();
    }

    pressKey(character);
    typeCharacterFromVirtualKey(character);

    if (virtualShiftActive) {
        virtualShiftActive = false;
        updateVirtualShiftVisual();
    }
}

if (isTouchDevice && keyboardElement) {
    initializeVirtualKeyboardLabels();
    renderVirtualKeyboardLabels();
    // Use pointerdown instead of click for faster response on touch devices
    // and prevent the subsequent click event (no double-firing). Passive is
    // false so preventDefault can be used if needed by the platform.
    // Zoom on rapid double-taps is prevented at the browser level via the
    // viewport meta tag (maximum-scale=1, user-scalable=no, see typing.html)
    // and touch-action: manipulation (see mobile.css) - no artificial delay
    // or tap-suppression is needed here, so fast repeated taps of the same
    // key register immediately.
    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        keyElement.addEventListener("pointerdown", function (ev) {
            // Prevent default to avoid delayed click or focus-scroll behavior
            // on some mobile browsers. This only runs on touch-capable devices
            // because of the outer isTouchDevice check.
            if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
            handleVirtualKeyTap(keyElement);
        }, { passive: false });
    });
}

updateMobileViewportHeightVar();

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
        updateMobileViewportHeightVar();
        enforceSystemKeyboardNoScroll();
    });
    window.visualViewport.addEventListener("scroll", enforceSystemKeyboardNoScroll);
}

window.addEventListener("resize", function () {
    applyMobileKeyboardStructure();
    updateMobileViewportHeightVar();
    aktualisiereTastenhilfeUI();
    if (phase === "typing") {
        zeigeZeilen();
    }
    syncKeyboardHighlight();
});
eingabe.addEventListener("focus", function () {
    updateMobileViewportHeightVar();
    enforceSystemKeyboardNoScroll();
});
