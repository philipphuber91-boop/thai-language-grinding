const defaultPlayer = {

    

stats: {

    // Allgemein
    xp: 0,
    level: 1,
    xpMigrationVersion: 0,
    bestCleanSentenceStreak: 0,
    totalCleanWords: 0,
    perfectQuests: 0,
    newRecordCount: 0,
    masteredThaiWords: 0,

    // Quests
    completedQuests: 0,
    totalAttempts: 0,

    // Schreiben
    totalCharacters: 0,
    totalThaiWords: 0,
    totalThaiWordsInitialized: false,
    uniqueThaiWords: [],
    wordStats: {},
    wordStatsInitialized: false,
    totalTime: 0,
    averageTime: 0,

    // Geschwindigkeit
    bestCPM: 0,
    averageCPM: 0,

    // Genauigkeit
    bestAccuracy: 0,
    averageAccuracy: 0,

    history: {

        daily: []

    }

}

};


let player = structuredClone(defaultPlayer);

const defaultQuestStats = {};

const repetitionIntervals = [

    1,
    3,
    7,
    14,
    30,
    60,
    120,
    180

];

let questStats = structuredClone(defaultQuestStats);

const XP_PER_CLEAN_SENTENCE = 10;
const QUEST_XP_MIGRATION_VERSION = 1;
const QUEST_REPEAT_XP_BONUS = 5;
const QUEST_REPEAT_XP_BONUS_CAP = 25;
const QUEST_CPM_BONUS_THRESHOLDS = [
    { threshold: 80, xp: 5 },
    { threshold: 120, xp: 5 }
];
const QUEST_ACCURACY_BONUS_THRESHOLDS = [
    { threshold: 98, xp: 5 },
    { threshold: 100, xp: 5 }
];

function getXpRequiredForLevel(level) {
    const normalizedLevel = Math.max(1, Math.floor(Number(level) || 1));

    if (normalizedLevel === 1) {
        return 0;
    }

    return Math.round(
        250 * Math.pow(normalizedLevel - 1, 1.5)
    );
}

function getLevelForXp(xp) {
    const normalizedXp = Math.max(0, Number(xp) || 0);
    let level = 1;

    while (
        level < 1000 &&
        normalizedXp >= getXpRequiredForLevel(level + 1)
    ) {
        level++;
    }

    return level;
}

function getPlayerXpSummary() {
    const totalXp = Math.max(0, Number(player.stats.xp) || 0);
    const level = getLevelForXp(totalXp);
    const currentLevelXp = getXpRequiredForLevel(level);
    const nextLevelXp = getXpRequiredForLevel(level + 1);

    return {
        totalXp,
        level,
        currentLevelXp,
        nextLevelXp,
        progressXp: totalXp - currentLevelXp,
        requiredXp: nextLevelXp - currentLevelXp,
        percent: Math.min(
            100,
            Math.round(
                ((totalXp - currentLevelXp) /
                    (nextLevelXp - currentLevelXp)) *
                    100
            )
        )
    };
}

function normalizePlayerProgress() {
    const xp = Number(player.stats.xp);

    player.stats.xp = Number.isFinite(xp) && xp >= 0 ? xp : 0;
    player.stats.level = getLevelForXp(player.stats.xp);

    for (const key of [
        "bestCleanSentenceStreak",
        "totalCleanWords",
        "perfectQuests",
        "newRecordCount",
        "masteredThaiWords"
    ]) {
        const value = Number(player.stats[key]);
        player.stats[key] = Number.isFinite(value) && value >= 0
            ? Math.floor(value)
            : 0;
    }
}

function awardPlayerXp(amount) {
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
        return {
            awardedXp: 0,
            leveledUp: false,
            ...getPlayerXpSummary()
        };
    }
    const previousLevel = getLevelForXp(player.stats.xp);
    player.stats.xp += Math.round(normalizedAmount);
    player.stats.level = getLevelForXp(player.stats.xp);
    savePlayer();

    return {
        awardedXp: Math.round(normalizedAmount),
        leveledUp: player.stats.level > previousLevel,
        ...getPlayerXpSummary()
    };
}

function getQuestPerformanceXp(cpm, accuracy) {
    const normalizedCpm = Number(cpm);
    const normalizedAccuracy = Number(accuracy);
    let bonusXp = 0;

    for (const threshold of QUEST_CPM_BONUS_THRESHOLDS) {
        if (Number.isFinite(normalizedCpm) && normalizedCpm >= threshold.threshold) {
            bonusXp += threshold.xp;
        }
    }

    for (const threshold of QUEST_ACCURACY_BONUS_THRESHOLDS) {
        if (
            Number.isFinite(normalizedAccuracy) &&
            normalizedAccuracy >= threshold.threshold
        ) {
            bonusXp += threshold.xp;
        }
    }

    return bonusXp;
}

function calculateQuestCompletionXp(quest, stats, cpm, accuracy) {
    const baseXp = Math.max(0, Math.floor(Number(quest?.xp) || 0));
    const attempts = Math.max(1, Math.floor(Number(stats?.attempts) || 1));
    const repeatBonus = Math.min(
        Math.max(0, attempts - 1) * QUEST_REPEAT_XP_BONUS,
        QUEST_REPEAT_XP_BONUS_CAP
    );

    return baseXp + repeatBonus + getQuestPerformanceXp(cpm, accuracy);
}

function awardQuestCompletionXp(
    questId,
    stats,
    quest,
    cpm,
    accuracy,
    { retroactive = false } = {}
) {
    if (!quest || !stats) {
        return {
            awardedXp: 0,
            breakdown: {
                baseXp: 0,
                repeatBonus: 0,
                performanceBonus: 0
            }
        };
    }

    const baseXp = Math.max(0, Math.floor(Number(quest.xp) || 0));
    const attempts = Math.max(1, Math.floor(Number(stats.attempts) || 1));
    const repeatBonus = Math.min(
        Math.max(0, attempts - 1) * QUEST_REPEAT_XP_BONUS,
        QUEST_REPEAT_XP_BONUS_CAP
    );
    const performanceBonus = getQuestPerformanceXp(cpm, accuracy);
    const totalXp = calculateQuestCompletionXp(quest, stats, cpm, accuracy);
    const xpResult = awardPlayerXp(totalXp);

    return {
        ...xpResult,
        questId,
        awardedXp: xpResult.awardedXp,
        breakdown: {
            baseXp,
            repeatBonus,
            performanceBonus,
            totalXp,
            retroactive
        }
    };
}

function migrateRetroactiveQuestXp() {
    const migrationVersion = Number(player.stats.xpMigrationVersion) || 0;

    if (migrationVersion >= QUEST_XP_MIGRATION_VERSION) {
        return {
            migrated: false,
            awardedXp: 0
        };
    }

    let awardedXp = 0;

    for (const questId in questStats) {
        const stats = questStats[questId];
        const quest = getQuestDataFromStatsId(questId);

        if (
            !stats?.completed ||
            !quest ||
            Number(stats.xpMigrationVersion) >= QUEST_XP_MIGRATION_VERSION
        ) {
            continue;
        }

        const migrationResult = awardQuestCompletionXp(
            questId,
            stats,
            quest,
            stats.records?.bestCPM,
            stats.records?.bestAccuracy,
            { retroactive: true }
        );

        stats.xpMigrationVersion = QUEST_XP_MIGRATION_VERSION;
        stats.xpMigrationAwarded = migrationResult.awardedXp;
        awardedXp += migrationResult.awardedXp;
    }

    player.stats.xpMigrationVersion = QUEST_XP_MIGRATION_VERSION;
    saveQuestStats();
    savePlayer();

    return {
        migrated: true,
        awardedXp
    };
}

function registerCleanTypingSentence(wordCount, streak) {
    const normalizedWordCount = Math.max(0, Math.floor(Number(wordCount) || 0));
    const normalizedStreak = Math.max(0, Math.floor(Number(streak) || 0));

    player.stats.totalCleanWords += normalizedWordCount;
    player.stats.bestCleanSentenceStreak = Math.max(
        player.stats.bestCleanSentenceStreak,
        normalizedStreak
    );
    savePlayer();
}

function createQuestStats(version) {

    return {

        version,

        attempts: 0,

        completed: false,

        records: {

            bestTime: null,
            bestCPM: null,
            bestAccuracy: null,

            lastTime: null,
            lastCPM: null,
            lastAccuracy: null

        },

        questAchievements: {},

        repetition: {

            level: 0,

            lastReview: null,

            nextReview: null

        }

    };

}

function getQuestStats(questId, currentVersion) {

    const existingStats = questStats[questId];

    // Noch nie gespielt
    if (!existingStats) {

        const version = currentVersion ?? 1;

        questStats[questId] = createQuestStats(version);

        saveQuestStats();

        return questStats[questId];

    }

    // Quest/Mission wurde geändert -> ALLES zurücksetzen
    if (
        currentVersion !== undefined &&
        existingStats.version !== currentVersion
    ) {

        if (existingStats.completed) {

            player.stats.completedQuests = Math.max(
                0,
                player.stats.completedQuests - 1
            );

            savePlayer();

        }

        questStats[questId] = createQuestStats(currentVersion);

        saveQuestStats();

    }

    if (
        !existingStats.questAchievements ||
        typeof existingStats.questAchievements !== "object" ||
        Array.isArray(existingStats.questAchievements)
    ) {
        existingStats.questAchievements = {};
        saveQuestStats();
    }

    return questStats[questId];

}

function getQuestDataFromStatsId(questId) {

    const separatorIndex = String(questId).indexOf(":");

    if (separatorIndex < 0) {
        return null;
    }

    const contentType = questId.slice(0, separatorIndex);
    const questNumber = questId.slice(separatorIndex + 1);
    const daten =
        contentType === "campaign"
            ? quests
            : contentType === "missions"
                ? missions
                : null;

    return daten ? daten[questNumber] ?? null : null;
}

function getStoredUniqueThaiWords() {

    if (!Array.isArray(player.stats.uniqueThaiWords)) {
        player.stats.uniqueThaiWords = [];
    }

    player.stats.uniqueThaiWords = [
        ...new Set(
            player.stats.uniqueThaiWords
                .map(word => String(word))
                .filter(Boolean)
        )
    ];

    return new Set(player.stats.uniqueThaiWords);
}

function getStoredTotalThaiWords() {

    const totalThaiWords = Number(player.stats.totalThaiWords);

    if (!Number.isFinite(totalThaiWords) || totalThaiWords < 0) {
        player.stats.totalThaiWords = 0;
    }

    return player.stats.totalThaiWords;
}

function getStoredThaiWordStats() {

    if (
        !player.stats.wordStats ||
        typeof player.stats.wordStats !== "object" ||
        Array.isArray(player.stats.wordStats)
    ) {
        player.stats.wordStats = {};
    }

    const normalizedWordStats = {};

    for (const [word, count] of Object.entries(player.stats.wordStats)) {

        const normalizedWord = String(word).normalize("NFC");
        const normalizedCount = Math.floor(Number(count));

        if (
            !normalizedWord ||
            !Number.isFinite(normalizedCount) ||
            normalizedCount < 1
        ) {
            continue;
        }

        normalizedWordStats[normalizedWord] = Math.max(
            normalizedWordStats[normalizedWord] ?? 0,
            normalizedCount
        );

    }

    player.stats.wordStats = normalizedWordStats;

    return normalizedWordStats;
}

function getSuccessfulQuestAttempts(stats) {

    const attempts = Number(stats?.attempts);

    return Number.isFinite(attempts) && attempts > 0
        ? Math.floor(attempts)
        : 1;
}

function getCompletedQuestWordTotal() {

    let totalThaiWords = 0;

    for (const questId in questStats) {

        const stats = questStats[questId];
        const quest = getQuestDataFromStatsId(questId);

        if (
            !stats?.completed ||
            !quest ||
            (
                stats.version !== undefined &&
                quest.version !== undefined &&
                stats.version !== quest.version
            )
        ) {
            continue;
        }

        const wordList = getThaiWordList(quest.thaiZeilen);

        if (!wordList.supported) {
            continue;
        }

        totalThaiWords +=
            wordList.words.length * getSuccessfulQuestAttempts(stats);
    }

    return totalThaiWords;
}

function migrateTotalThaiWordsFromCompletedQuests() {

    if (player.stats.totalThaiWordsInitialized) {
        return;
    }

    const totalThaiWords = getCompletedQuestWordTotal();

    player.stats.totalThaiWords = totalThaiWords;
    player.stats.totalThaiWordsInitialized = true;
    savePlayer();
}

function migrateThaiWordStatsFromCompletedQuests() {

    if (player.stats.wordStatsInitialized) {
        return;
    }

    const wordStats = getStoredThaiWordStats();

    for (const questId in questStats) {

        const stats = questStats[questId];
        const quest = getQuestDataFromStatsId(questId);

        if (
            !stats?.completed ||
            !quest ||
            (
                stats.version !== undefined &&
                quest.version !== undefined &&
                stats.version !== quest.version
            )
        ) {
            continue;
        }

        const wordList = getThaiWordList(quest.thaiZeilen);

        if (!wordList.supported) {
            continue;
        }

        const successfulAttempts = getSuccessfulQuestAttempts(stats);

        for (const word of wordList.words) {
            wordStats[word] =
                (wordStats[word] ?? 0) + successfulAttempts;
        }

    }

    for (const word of getStoredUniqueThaiWords()) {
        wordStats[word] = Math.max(wordStats[word] ?? 0, 1);
    }

    player.stats.wordStats = wordStats;
    player.stats.wordStatsInitialized = true;
    savePlayer();
}

function addCompletedQuestWordsToTotal(questId) {

    const quest = getQuestDataFromStatsId(questId);

    if (!quest) {
        return;
    }

    const wordList = getThaiWordList(quest.thaiZeilen);

    if (!wordList.supported) {
        return;
    }

    player.stats.totalThaiWords =
        getStoredTotalThaiWords() + wordList.words.length;
}

function addQuestWordsToWordStats(questId) {

    const quest = getQuestDataFromStatsId(questId);

    if (!quest) {
        return [];
    }

    const wordList = getThaiWordList(quest.thaiZeilen);

    if (!wordList.supported) {
        return [];
    }

    const wordStats = getStoredThaiWordStats();
    const newlyMasteredWords = new Set();

    for (const word of wordList.words) {
        const previousCount = Number(wordStats[word] ?? 0);
        const nextCount = previousCount + 1;

        wordStats[word] = nextCount;

        if (
            getThaiWordMasteryLevel(previousCount) !== "mastered" &&
            getThaiWordMasteryLevel(nextCount) === "mastered"
        ) {
            newlyMasteredWords.add(word);
        }
    }

    player.stats.wordStats = wordStats;
    player.stats.wordStatsInitialized = true;

    return [...newlyMasteredWords];
}

function updateMasteredThaiWordCount() {
    const wordStats = getStoredThaiWordStats();

    player.stats.masteredThaiWords = Object.values(wordStats)
        .filter(count => getThaiWordMasteryLevel(count) === "mastered")
        .length;
}

function addQuestWordsToUniqueCollection(questId) {

    const quest = getQuestDataFromStatsId(questId);

    if (!quest) {
        return 0;
    }

    const wordList = getThaiWordList(quest.thaiZeilen);

    if (!wordList.supported) {
        return 0;
    }

    const uniqueThaiWords = getStoredUniqueThaiWords();
    let newWords = 0;

    for (const word of new Set(wordList.words)) {

        if (uniqueThaiWords.has(word)) {
            continue;
        }

        uniqueThaiWords.add(word);
        newWords++;
    }

    player.stats.uniqueThaiWords = [...uniqueThaiWords];

    return newWords;
}

function migrateUniqueThaiWordsFromCompletedQuests() {

    const uniqueThaiWords = getStoredUniqueThaiWords();
    let changed = false;

    for (const questId in questStats) {

        const stats = questStats[questId];
        const quest = getQuestDataFromStatsId(questId);

        if (
            !stats?.completed ||
            !quest ||
            (
                stats.version !== undefined &&
                quest.version !== undefined &&
                stats.version !== quest.version
            )
        ) {
            continue;
        }

        const wordList = getThaiWordList(quest.thaiZeilen);

        if (!wordList.supported) {
            continue;
        }

        for (const word of wordList.words) {

            if (uniqueThaiWords.has(word)) {
                continue;
            }

            uniqueThaiWords.add(word);
            changed = true;
        }
    }

    if (!changed) {
        return;
    }

    player.stats.uniqueThaiWords = [...uniqueThaiWords];
    savePlayer();
}

function getOrCreateDailyHistoryEntry(dateString) {
 
    if (!player.stats.history || !Array.isArray(player.stats.history.daily)) {
 
        player.stats.history = { daily: [] };
 
    }
 
    let entry = player.stats.history.daily.find(
 
        day => day.date === dateString
 
    );
 
    if (!entry) {
 
        entry = {
 
            date: dateString,
 
            quests: 0,
 
            playTime: 0,
 
            typedCharacters: 0,
 
            averageCPM: 0,
 
            averageAccuracy: 0
 
        };
 
        player.stats.history.daily.push(entry);
 
    }
 
    return entry;
 
}
 
function updateDailyHistory(zeit, cpm, accuracy, zeichen) {
 
    const today = getToday();
 
    const entry = getOrCreateDailyHistoryEntry(today);
 
    entry.quests = Number(entry.quests ?? 0) + 1;
 
    entry.typedCharacters = Number(entry.typedCharacters ?? 0) + zeichen;
 
    entry.averageCPM = Number(
 
        (
 
            (entry.averageCPM * (entry.quests - 1) + cpm) /
 
            entry.quests
 
        ).toFixed(1)
 
    );
 
    entry.averageAccuracy = Number(
 
        (
 
            (entry.averageAccuracy * (entry.quests - 1) + accuracy) /
 
            entry.quests
 
        ).toFixed(1)
 
    );
 
}
 
function addPlayTimeToDailyHistory(dateString, seconds) {
 
    const entry = getOrCreateDailyHistoryEntry(dateString);
 
    entry.playTime = Number(entry.playTime ?? 0) + seconds;
 
}
 
function recordPlayTimeSpan(startMs, endMs) {
 
    if (endMs <= startMs) {
 
        return;
 
    }
 
    let segmentStart = startMs;
 
    while (segmentStart < endMs) {
 
        const segmentDate = new Date(segmentStart);
 
        const nextMidnight = new Date(segmentDate);
 
        nextMidnight.setHours(24, 0, 0, 0);
 
        const segmentEnd = Math.min(endMs, nextMidnight.getTime());
 
        const elapsedSeconds = Math.round((segmentEnd - segmentStart) / 1000);
 
        if (elapsedSeconds > 0) {
 
            const dayKey = formatIsoDate(segmentDate);
 
            addPlayTimeToDailyHistory(dayKey, elapsedSeconds);
 
            player.stats.totalTime = Number(player.stats.totalTime ?? 0) + elapsedSeconds;
 
        }
 
        segmentStart = segmentEnd;
 
    }
 
    savePlayer();
 
}
 
function formatIsoDate(date) {
 
    const year = date.getFullYear();
 
    const month = String(date.getMonth() + 1).padStart(2, "0");
 
    const day = String(date.getDate()).padStart(2, "0");
 
    return `${year}-${month}-${day}`;
 
}
 
const ActivityManager = {

    status: "INACTIVE",

    activeSince: null,

    inactivityTimer: null,

    afkWarningTimer: null,

    afkAbortTimer: null,

    afkStartTime: null,

    afkAccumulatedMs: 0,

    inactivityDelay: 5000,

    afkWarningDelay: 2 * 60 * 1000,

    afkAbortDelay: 10 * 60 * 1000,

    onStatusChange: null,

    onAfkDialogOpen: null,

    onAfkDialogClose: null,

    onAutoAbort: null,

    get isPlaying() {
        return this.status === "PLAYING";
    },

    get isAFK() {
        return this.status === "AFK";
    },

    getActiveTimeMs() {
        if (this.activeSince !== null && this.status === "PLAYING") {
            return this.sessionActiveMs + (Date.now() - this.activeSince);
        }

        return this.sessionActiveMs;
    },

    getPausedDurationMs() {
        const currentAfkElapsed = this.afkStartTime
            ? Date.now() - this.afkStartTime
            : 0;

        return this.afkAccumulatedMs + currentAfkElapsed;
    },

    getAfkRemainingMs() {
        return Math.max(0, this.afkAbortDelay - this.getPausedDurationMs());
    },

    getCurrentStatusLabel() {
        return this.status === "AFK" ? "🟡 AFK" : "🟢 Aktiv";
    },

    sessionActiveMs: 0,

    startPlaying() {

        if (this.status === "PLAYING") {
            return;
        }

        this.status = "PLAYING";
        this.activeSince = Date.now();
        this.clearAfkTimers();
        this.afkStartTime = null;
        this.afkAccumulatedMs = 0;
        this.resetInactivityTimer();
        this.triggerStatusChange();
    },

    stopPlaying() {

        if (this.activeSince !== null) {
            this.flushActiveTime();
        }

        if (this.afkStartTime !== null) {
            this.afkAccumulatedMs += Date.now() - this.afkStartTime;
            this.afkStartTime = null;
        }

        this.status = "INACTIVE";
        this.activeSince = null;
        this.sessionActiveMs = 0;
        this.afkAccumulatedMs = 0;
        this.clearInactivityTimer();
        this.clearAfkTimers();
        this.triggerAfkDialogClose();
        this.triggerStatusChange();
    },

    resumeCounting() {

        if (this.activeSince === null) {
            this.activeSince = Date.now();
        }

        this.resetInactivityTimer();
    },

    pauseCounting() {

        if (this.status !== "PLAYING") {
            return;
        }

        if (this.activeSince !== null) {
            this.flushActiveTime();
            this.activeSince = null;
        }

        this.status = "AFK";
        this.afkStartTime = Date.now();
        this.clearInactivityTimer();
        this.setupAfkTimers();
        this.triggerStatusChange();
    },

    resumeFromAfk() {
        if (this.status !== "AFK") {
            return;
        }

        this.afkStartTime = null;
        this.afkAccumulatedMs = 0;
        this.clearAfkTimers();
        this.status = "PLAYING";
        this.activeSince = Date.now();
        this.resetInactivityTimer();
        this.triggerAfkDialogClose();
        this.triggerStatusChange();
    },

    registerActivity() {

        if (this.status === "AFK") {
            this.resumeFromAfk();
            return;
        }

        if (this.status !== "PLAYING") {
            return;
        }

        if (this.activeSince === null) {
            this.activeSince = Date.now();
        }

        this.resetInactivityTimer();
    },

    resetInactivityTimer() {

        this.clearInactivityTimer();

        this.inactivityTimer = setTimeout(() => {
            this.pauseCounting();
        }, this.inactivityDelay);
    },

    clearInactivityTimer() {

        if (this.inactivityTimer !== null) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    },

    setupAfkTimers() {

        this.clearAfkTimers();

        const elapsed = this.getPausedDurationMs();
        const warningRemaining = Math.max(0, this.afkWarningDelay - elapsed);
        const abortRemaining = Math.max(0, this.afkAbortDelay - elapsed);

        this.afkWarningTimer = setTimeout(() => {
            if (this.status === "AFK") {
                this.triggerAfkDialogOpen();
            }
        }, warningRemaining);

        this.afkAbortTimer = setTimeout(() => {
            if (this.status === "AFK") {
                this.autoAbort();
            }
        }, abortRemaining);
    },

    clearAfkTimers() {

        if (this.afkWarningTimer !== null) {
            clearTimeout(this.afkWarningTimer);
            this.afkWarningTimer = null;
        }

        if (this.afkAbortTimer !== null) {
            clearTimeout(this.afkAbortTimer);
            this.afkAbortTimer = null;
        }
    },

    triggerStatusChange() {
        if (typeof this.onStatusChange === "function") {
            this.onStatusChange(this.status);
        }
    },

    triggerAfkDialogOpen() {
        if (typeof this.onAfkDialogOpen === "function") {
            this.onAfkDialogOpen();
        }
    },

    triggerAfkDialogClose() {
        if (typeof this.onAfkDialogClose === "function") {
            this.onAfkDialogClose();
        }
    },

    autoAbort() {
        this.clearAfkTimers();

        if (this.afkStartTime !== null) {
            this.afkAccumulatedMs += Date.now() - this.afkStartTime;
            this.afkStartTime = null;
        }

        this.status = "INACTIVE";
        this.activeSince = null;
        this.sessionActiveMs = 0;
        this.clearInactivityTimer();
        this.triggerStatusChange();
        this.triggerAfkDialogClose();

        if (typeof this.onAutoAbort === "function") {
            this.onAutoAbort();
        }
    },

    flushActiveTime() {

        if (this.activeSince === null) {
            return;
        }

        const now = Date.now();
        const elapsedMs = now - this.activeSince;

        this.sessionActiveMs += elapsedMs;
        recordPlayTimeSpan(this.activeSince, now);
        this.activeSince = null;
    }

}; 
window.addEventListener("pagehide", () => {
 
    ActivityManager.stopPlaying();
 
});
 
window.addEventListener("beforeunload", () => {
 
    ActivityManager.stopPlaying();
 
});
 
function updatePlayerStats(zeit, cpm, accuracy, zeichen) {

    player.stats.totalAttempts++;

    player.stats.totalCharacters += zeichen;
 
    // Gesamtspielzeit wird ausschließlich über den ActivityManager erfasst.
 
    // Durchschnittswerte

    player.stats.averageTime =
        player.stats.totalTime / player.stats.totalAttempts;

    player.stats.averageCPM =
    Number(
    (
    (player.stats.averageCPM * (player.stats.totalAttempts - 1) + cpm)
    / player.stats.totalAttempts
    ).toFixed(1));

    player.stats.averageAccuracy =
    Number(
    (
    (player.stats.averageAccuracy * (player.stats.totalAttempts - 1) + accuracy)
    / player.stats.totalAttempts
    ).toFixed(1));

    // Rekorde

    if (cpm > player.stats.bestCPM) {

        player.stats.bestCPM = cpm;

    }

    if (accuracy > player.stats.bestAccuracy) {

        player.stats.bestAccuracy = accuracy;

    }

    updateDailyHistory(zeit, cpm, accuracy, zeichen);
 
    savePlayer();

    updateAchievements();

}

function getToday() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function addDays(dateString, days) {

    const date = new Date(dateString);

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function updateRepetition(stats) {

    const today = getToday();

    // Heute bereits gezählt?
    if (stats.repetition.lastReview === today) {

        return;

    }

    // Erster Abschluss überhaupt
    if (stats.repetition.nextReview === null) {

        stats.repetition.level = 0;

        stats.repetition.lastReview = today;

        stats.repetition.nextReview = addDays(

            today,

            repetitionIntervals[stats.repetition.level]

        );

        return;

    }

    // Noch nicht fällig -> nichts am Level ändern
    if (today < stats.repetition.nextReview) {

        stats.repetition.lastReview = today;

        return;

    }

    // Fällig -> Level erhöhen
    if (stats.repetition.level < repetitionIntervals.length - 1) {

        stats.repetition.level++;

    }

    stats.repetition.lastReview = today;

    stats.repetition.nextReview = addDays(

        today,

        repetitionIntervals[stats.repetition.level]

    );

}

function isQuestDue(questId, currentVersion) {

    const stats = getQuestStats(questId, currentVersion);

    if (!stats.completed) {

        return false;

    }

    if (stats.repetition.nextReview === null) {

        return false;

    }

    return getToday() >= stats.repetition.nextReview;

}

function getDueQuests() {

    const dueQuests = [];

    for (const questId in questStats) {

        if (isQuestDue(questId)) {

            dueQuests.push(questId);

        }

    }

    return dueQuests;

}

function completeQuest(questId, zeit, cpm, accuracy, zeichen, currentVersion) {

    const stats = getQuestStats(questId, currentVersion);
    const quest = getQuestDataFromStatsId(questId);

    stats.attempts++;

    const firstCompletion = !stats.completed;

    stats.completed = true;

    if (firstCompletion) {
        player.stats.completedQuests++;
    }

    const newUniqueWords = firstCompletion
        ? addQuestWordsToUniqueCollection(questId)
        : 0;

    const newlyMasteredWords = addQuestWordsToWordStats(questId);
    addCompletedQuestWordsToTotal(questId);
    updateMasteredThaiWordCount();
    const newMasteredWords = newlyMasteredWords.length;

    stats.records.lastTime = zeit;
    stats.records.lastCPM = cpm;
    stats.records.lastAccuracy = accuracy;

let newBestTime = false;
let newBestCPM = false;
let newBestAccuracy = false;

const oldBestTime = stats.records.bestTime;
const oldBestCPM = stats.records.bestCPM;
const oldBestAccuracy = stats.records.bestAccuracy;

    if (
        stats.records.bestTime === null ||
        zeit < stats.records.bestTime
    ) {

        stats.records.bestTime = zeit;
        newBestTime = true;

    }

    if (
        stats.records.bestCPM === null ||
        cpm > stats.records.bestCPM
    ) {

        stats.records.bestCPM = cpm;
        newBestCPM = true;

    }

    if (
        stats.records.bestAccuracy === null ||
        accuracy > stats.records.bestAccuracy
    ) {

        stats.records.bestAccuracy = accuracy;
        newBestAccuracy = true;

    }

    if (accuracy >= 100) {
        player.stats.perfectQuests++;
    }

    if (newBestTime || newBestCPM) {
        player.stats.newRecordCount++;
    }

    updateRepetition(stats);

    console.log("Quest-ID:", questId);
console.log("Versuche:", stats.attempts);
console.log("Komplette questStats:", structuredClone(questStats));

    saveQuestStats();

    console.log(
    "Im LocalStorage:",
    JSON.parse(localStorage.getItem("questStats"))
);

    updatePlayerStats(

        zeit,
        cpm,
        accuracy,
        zeichen

    );

    const questXpResult = awardQuestCompletionXp(
        questId,
        stats,
        quest,
        cpm,
        accuracy
    );

  
return {

    firstCompletion,
    newBestTime,
    newBestCPM,
    newBestAccuracy,

    oldBestTime,
    oldBestCPM,
    oldBestAccuracy,

    newTime: zeit,
    newCPM: cpm,
    newAccuracy: accuracy,
    newUniqueWords,
    newMasteredWords,
    newlyMasteredWords,
    questXpAwarded: questXpResult.awardedXp,
    questXpBreakdown: questXpResult.breakdown
};

}

function getQuestStatus(questId, currentVersion) {

    const stats = getQuestStats(questId, currentVersion);

    // Alle Wiederholungen abgeschlossen
    if (
        stats.repetition.level >= repetitionIntervals.length - 1
    ) {

        return "mastered";

    }

    // Quest ist zur Wiederholung fällig
    if (isQuestDue(questId, currentVersion)) {

        return "due";

    }

    // Quest wurde bereits abgeschlossen
    if (stats.completed) {

        return "doneToday";

    }

    // Noch nie gespielt
    return "";

}