const defaultPlayer = {

    

stats: {

    // Allgemein
    xp: 0,
    level: 1,

    // Quests
    completedQuests: 0,
    totalAttempts: 0,

    // Schreiben
    totalCharacters: 0,
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

    return questStats[questId];

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

    stats.attempts++;

    const firstCompletion = !stats.completed;

    stats.completed = true;

    if (firstCompletion) {

        player.stats.completedQuests++;

    }

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

  
return {

    newBestTime,
    newBestCPM,
    newBestAccuracy,

    oldBestTime,
    oldBestCPM,
    oldBestAccuracy,

    newTime: zeit,
    newCPM: cpm,
    newAccuracy: accuracy

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