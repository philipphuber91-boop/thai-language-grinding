const defaultPlayer = {

    

    stats: {

        completedQuests: 0,

        totalAttempts: 0,

        totalCharacters: 0,

        totalTime: 0,

        bestCPM: 0,

        bestAccuracy: 0

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
    bestCPM: 0,
    bestAccuracy: 0

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

    player.stats.completedQuests++;

    player.stats.totalAttempts++;

    player.stats.totalCharacters += zeichen;

    player.stats.totalTime += zeit;

    if (cpm > player.stats.bestCPM) {

        player.stats.bestCPM = cpm;

    }

    if (accuracy > player.stats.bestAccuracy) {

        player.stats.bestAccuracy = accuracy;

    }

    savePlayer();

}

    function getToday() {

    return new Date().toISOString().split("T")[0];

}

function addDays(dateString, days) {

    const date = new Date(dateString);

    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];

}

function updateRepetition(stats) {

    const today = getToday();

    // Heute bereits gezählt?
    if (stats.repetition.lastReview === today) {

        return;

    }

    // Erster Abschluss überhaupt
    if (stats.repetition.nextReview === null) {

        stats.repetition.level = 1;

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

    stats.completed = true;

    if (
        stats.records.bestTime === null ||
        zeit < stats.records.bestTime
    ) {

        stats.records.bestTime = zeit;

    }

    if (cpm > stats.records.bestCPM) {

        stats.records.bestCPM = cpm;

    }

    if (accuracy > stats.records.bestAccuracy) {

        stats.records.bestAccuracy = accuracy;

    }
    updateRepetition(stats);
    saveQuestStats();

    updatePlayerStats(

        zeit,
        cpm,
        accuracy,
        zeichen

    );

}

function getQuestStatus(questId) {

    const stats = getQuestStats(questId);

    if (
        stats.repetition.level >= repetitionIntervals.length - 1
    ) {

        return "mastered";

    }

    if (stats.repetition.lastReview === getToday()) {

        return "doneToday";

    }

    if (isQuestDue(questId)) {

        return "due";

    }

    return "";

}