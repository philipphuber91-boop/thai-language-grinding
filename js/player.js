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
    averageAccuracy: 0

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

function getQuestStats(questId) {

    if (!questStats[questId]) {

        questStats[questId] = {

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

        saveQuestStats();

    }


    if (!questStats[questId].repetition) {

    questStats[questId].repetition = {

        level: 0,

        lastReview: null,

        nextReview: null

    };

    saveQuestStats();

}

    return questStats[questId];

}

function updatePlayerStats(zeit, cpm, accuracy, zeichen) {

    player.stats.totalAttempts++;

    player.stats.totalCharacters += zeichen;

    player.stats.totalTime += zeit;

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

    savePlayer();

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

function isQuestDue(questId) {

    const stats = getQuestStats(questId);

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

            dueQuests.push(Number(questId));

        }

    }

    return dueQuests;

}

function completeQuest(questId, zeit, cpm, accuracy, zeichen) {

    const stats = getQuestStats(questId);

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

    saveQuestStats();

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

    newTime: stats.records.bestTime,
    newCPM: stats.records.bestCPM,
    newAccuracy: stats.records.bestAccuracy

};

}

function getQuestStatus(questId) {

    const stats = getQuestStats(questId);

    // Alle Wiederholungen abgeschlossen
    if (
        stats.repetition.level >= repetitionIntervals.length - 1
    ) {

        return "mastered";

    }

    // Quest ist zur Wiederholung fällig
    if (isQuestDue(questId)) {

        return "due";

    }

    // Quest wurde bereits abgeschlossen
    if (stats.completed) {

        return "doneToday";

    }

    // Noch nie gespielt
    return "";

}