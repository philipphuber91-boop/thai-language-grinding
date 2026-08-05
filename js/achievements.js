const achievementCategories = {

    general: "Allgemein",

    typing: "Typing",

    campaign: "Kampagne",

    mission: "Missionen",

    level: "Level",

    collection: "Sammlung",

    challenge: "Challenge"

};

const rarityColors = {

    common: "#9d9d9d",

    rare: "#0070dd",

    epic: "#a335ee",

    legendary: "#ff8000"

};

const achievementIcons = {

    book: "📖",

    keyboard: "⌨️",

    heart: "❤️",

    hourglass: "⏳"

};

const achievementDefinitions = [

{
    id: "firstQuest",

    title: "Erste Schritte",

    description: "Schließe deine erste Quest ab.",

    icon: "book",

    rarity: "common",

    category: "general",

    stat: "completedQuests",

    goal: 1

},

{
    id: "student",

    title: "Sprachschüler",

    description: "Schließe 10 Quests ab.",

    icon: "schriftrolle",

    rarity: "rare",

    category: "general",

    stat: "completedQuests",

    goal: 10

},

{
    id: "languageLover",

    title: "Sprachliebhaber",

    description: "Schließe 50 Quests ab.",

    icon: "heart",

    rarity: "epic",

    category: "general",

    stat: "completedQuests",

    goal: 50

},

{
    id: "languageMaster",

    title: "Sprachmeister",

    description: "Schließe 100 Quests ab.",

    icon: "brain",

    rarity: "legendary",

    category: "general",

    stat: "completedQuests",

    goal: 100

},

{
    id: "typing1000",

    title: "Tausend Tasten",

    description: "Tippe insgesamt 1000 Zeichen.",

    icon: "keyboard",

    rarity: "common",

    category: "typing",

    stat: "totalCharacters",

    goal: 1000

},

{
    id: "typing5000",

    title: "Fünftausend Tasten",

    description: "Tippe insgesamt 5000 Zeichen.",

    icon: "keyboard",

    rarity: "rare",

    category: "typing",

    stat: "totalCharacters",

    goal: 5000
},

{
    id: "typing20000",

    title: "Tastenmaschine",

    description: "Tippe insgesamt 20000 Zeichen.",

    icon: "schriftrolle",

    rarity: "epic",

    category: "typing",

    stat: "totalCharacters",

    goal: 20000
},

{
    id: "typing50000",

    title: "Tastenmeister",

    description: "Tippe insgesamt 50000 Zeichen.",

    icon: "sanduhr",

    rarity: "legendary",

    category: "typing",

    stat: "totalCharacters",

    goal: 50000
},

{
    id: "typing100000",

    title: "Legende der Tasten",

    description: "Tippe insgesamt 100000 Zeichen.",

    icon: "diamond",

    rarity: "legendary",

    category: "typing",

    stat: "totalCharacters",

    goal: 100000
},

{
    id: "cpm80",

    title: "Schnelle Finger",

    description: "Erreiche 80 CPM.",

    icon: "keyboard",

    rarity: "common",

    category: "typing",

    stat: "bestCPM",

    goal: 80
},

{
    id: "cpm130",

    title: "Flotte Finger",

    description: "Erreiche 130 CPM.",

    icon: "keyboard",

    rarity: "rare",

    category: "typing",

    stat: "bestCPM",

    goal: 130
},

{
    id: "cpm180",

    title: "Tastenkünstler",

    description: "Erreiche 180 CPM.",

    icon: "scharfschütze",

    rarity: "epic",

    category: "typing",

    stat: "bestCPM",

    goal: 180
},

{
    id: "cpm250",

    title: "Geschwindigkeitsprofi",

    description: "Erreiche 250 CPM.",

    icon: "blitz",

    rarity: "legendary",

    category: "typing",

    stat: "bestCPM",

    goal: 250
},

{
    id: "cpm400",

    title: "Tastenlegende",

    description: "Erreiche 400 CPM.",

    icon: "krone",

    rarity: "legendary",

    category: "typing",

    stat: "bestCPM",

    goal: 400
},

{
    id: "attempts50",

    title: "Erster Grinder",

    description: "Absolviere 50 Versuche.",

    icon: "schriftrolle",

    rarity: "common",

    category: "typing",

    stat: "totalAttempts",

    goal: 50
},

{
    id: "attempts200",

    title: "Ausdauernder Schüler",

    description: "Absolviere 200 Versuche.",

    icon: "puzzle",

    rarity: "rare",

    category: "typing",

    stat: "totalAttempts",

    goal: 200
},

{
    id: "attempts500",

    title: "Beharrlicher Lerner",

    description: "Absolviere 500 Versuche.",

    icon: "epic",

    rarity: "epic",

    category: "typing",

    stat: "totalAttempts",

    goal: 500
},

{
    id: "attempts1000",

    title: "Unermüdlicher Grinder",

    description: "Absolviere 1000 Versuche.",

    icon: "legendary",

    rarity: "legendary",

    category: "typing",

    stat: "totalAttempts",

    goal: 1000
},

{
    id: "attempts5000",

    title: "Sprachmaschine",

    description: "Absolviere 5000 Versuche.",

    icon: "krone",

    rarity: "legendary",

    category: "typing",

    stat: "totalAttempts",

    goal: 5000
},

{
    id: "playtime1h",

    title: "Erste Stunde",

    description: "Verbringe insgesamt 1 Stunde mit Lernen.",

    icon: "sanduhr",

    rarity: "common",

    category: "typing",

    stat: "totalTime",

    goal: 3600
},

{
    id: "playtime10h",

    title: "Die Reise beginnt",

    description: "Verbringe insgesamt 10 Stunden mit Lernen.",

    icon: "brain",

    rarity: "rare",

    category: "typing",

    stat: "totalTime",

    goal: 36000
},

{
    id: "playtime100h",

    title: "Sprachgrinder",

    description: "Verbringe insgesamt 100 Stunden mit Lernen.",

    icon: "pokal",

    rarity: "epic",

    category: "typing",

    stat: "totalTime",

    goal: 360000
},

{

    id: "playtime250h",

    title: "Sprachmeister",

    description: "Verbringe insgesamt 250 Stunden mit Lernen.",

    icon: "legendary",

    rarity: "legendary",

    category: "typing",

    stat: "totalTime",

    goal: 900000
},

{
    id: "mobileSpeedHunter80",
    title: "Tempojäger",
    description: "Erreiche 80 CPM in einer Runde.",
    icon: "blitz",
    rarity: "common",
    category: "typing",
    questScoped: true,
    mobileOnly: true,
    stat: "bestCPM",
    goal: 80,
    runType: "cpm",
    runGoal: 80,
    bonusXp: 5
},

{
    id: "mobileLightningFingers100",
    title: "Blitzfinger",
    description: "Erreiche 100 CPM in einer Runde.",
    icon: "blitz",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    mobileOnly: true,
    stat: "bestCPM",
    goal: 100,
    runType: "cpm",
    runGoal: 100,
    bonusXp: 10
},

{
    id: "mobileLightSpeed120",
    title: "Lichtgeschwindigkeit",
    description: "Erreiche 120 CPM in einer Runde.",
    icon: "blitz",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    mobileOnly: true,
    stat: "bestCPM",
    goal: 120,
    runType: "cpm",
    runGoal: 120,
    bonusXp: 15
},

{
    id: "speedHunter120",
    title: "Tempojäger",
    description: "Erreiche 120 CPM in einer Runde.",
    icon: "blitz",
    rarity: "common",
    category: "typing",
    questScoped: true,
    desktopOnly: true,
    stat: "bestCPM",
    goal: 120,
    runType: "cpm",
    runGoal: 120,
    bonusXp: 5
},

{
    id: "lightningFingers150",
    title: "Blitzfinger",
    description: "Erreiche 150 CPM in einer Runde.",
    icon: "blitz",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    desktopOnly: true,
    stat: "bestCPM",
    goal: 150,
    runType: "cpm",
    runGoal: 150,
    bonusXp: 10
},

{
    id: "precisionWords20",
    title: "Präzision",
    description: "Tippe 20 Wörter fehlerfrei.",
    icon: "scharfschütze",
    rarity: "common",
    category: "typing",
    questScoped: true,
    stat: "totalCleanWords",
    goal: 20,
    runType: "cleanWords",
    runGoal: 20,
    bonusXp: 5
},

{
    id: "perfectionist98",
    title: "Perfektionist",
    description: "Erreiche 98% Genauigkeit.",
    icon: "scharfschütze",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    stat: "bestAccuracy",
    goal: 98,
    runType: "accuracy",
    runGoal: 98,
    bonusXp: 10
},

{
    id: "precisionNoHelp98",
    title: "Präzisionsmodus",
    description: "Erreiche 98% Genauigkeit ohne Tastenhilfe.",
    icon: "scharfschütze",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    requiresNoTastenhilfe: true,
    stat: "bestAccuracy",
    goal: 98,
    runType: "accuracy",
    runGoal: 98,
    bonusXp: 15
},

{
    id: "masterWriterQuest",
    title: "Meisterschreiber",
    description: "Schließe eine Quest ohne Fehler ab.",
    icon: "krone",
    rarity: "legendary",
    category: "typing",
    questScoped: true,
    stat: "perfectQuests",
    goal: 1,
    runType: "perfectQuest",
    runGoal: 1,
    bonusXp: 15
},

{
    id: "masteredUniqueWords2",
    title: "Wortmeister",
    description: "Meistere 2 einzigartige Wörter in dieser Quest.",
    icon: "book",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    stat: "masteredThaiWords",
    goal: 2,
    runType: "masteredWords",
    runGoal: 2,
    bonusXp: 15
},

{
    id: "explorerMasteredWord",
    title: "Entdecker",
    description: "Meistere ein einzigartiges Wort.",
    icon: "book",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    stat: "masteredThaiWords",
    goal: 1,
    runType: "masteredWords",
    runGoal: 1,
    bonusXp: 10
},

{
    id: "masterWriterNoHelp",
    title: "Freihand-Meister",
    description: "Schließe eine Quest fehlerfrei ohne Tastenhilfe ab.",
    icon: "krone",
    rarity: "legendary",
    category: "typing",
    questScoped: true,
    requiresNoTastenhilfe: true,
    stat: "perfectQuests",
    goal: 1,
    runType: "perfectQuest",
    runGoal: 1,
    bonusXp: 20
},

{
    id: "cpm100NoHelp",
    title: "Freihandtempo",
    description: "Erreiche 100 CPM ohne Tastenhilfe.",
    icon: "blitz",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    requiresNoTastenhilfe: true,
    stat: "bestCPM",
    goal: 100,
    runType: "cpm",
    runGoal: 100,
    bonusXp: 10
},

{
    id: "cpm120NoHelp",
    title: "Freihand-Blitz",
    description: "Erreiche 120 CPM ohne Tastenhilfe.",
    icon: "blitz",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    requiresNoTastenhilfe: true,
    stat: "bestCPM",
    goal: 120,
    runType: "cpm",
    runGoal: 120,
    bonusXp: 15
},

{
    id: "personalTypingRecord",
    title: "Neuer Rekord",
    description: "Stelle eine persönliche Bestleistung auf.",
    icon: "krone",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    stat: "newRecordCount",
    goal: 1,
    runType: "newRecord",
    runGoal: 1,
    bonusXp: 15
},

{
    id: "cleanSentenceStreak10",
    title: "Feuerstreak",
    description: "Tippe 10 Sätze fehlerfrei hintereinander.",
    icon: "blitz",
    rarity: "common",
    category: "typing",
    questScoped: true,
    stat: "bestCleanSentenceStreak",
    goal: 10,
    runType: "cleanStreak",
    runGoal: 10,
    bonusXp: 5
},

{
    id: "cleanSentenceStreak25",
    title: "Flammenstreak",
    description: "Tippe 25 Sätze fehlerfrei hintereinander.",
    icon: "blitz",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    stat: "bestCleanSentenceStreak",
    goal: 25,
    runType: "cleanStreak",
    runGoal: 25,
    bonusXp: 10
},

{
    id: "cleanSentenceStreak50",
    title: "Unaufhaltsamer Flow",
    description: "Tippe 50 Sätze fehlerfrei hintereinander.",
    icon: "blitz",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    stat: "bestCleanSentenceStreak",
    goal: 50,
    runType: "cleanStreak",
    runGoal: 50,
    bonusXp: 15
},

{
    id: "audioListened1",
    title: "Audio-Einstieg",
    description: "Höre das Questaudio 1-mal vollständig.",
    icon: "book",
    rarity: "common",
    category: "typing",
    questScoped: true,
    campaignOnly: true,
    runType: "audioListens",
    runGoal: 1,
    bonusXp: 5
},

{
    id: "audioListened3",
    title: "Audio-Lerner",
    description: "Höre das Questaudio 3-mal vollständig.",
    icon: "book",
    rarity: "rare",
    category: "typing",
    questScoped: true,
    campaignOnly: true,
    runType: "audioListens",
    runGoal: 3,
    bonusXp: 10
},

{
    id: "audioListened5",
    title: "Audio-Meister",
    description: "Höre das Questaudio 5-mal vollständig.",
    icon: "book",
    rarity: "epic",
    category: "typing",
    questScoped: true,
    campaignOnly: true,
    runType: "audioListens",
    runGoal: 5,
    bonusXp: 15
},

];

let achievements = {};

let achievementQueue = [];

let showingAchievement = false;

function loadAchievements() {

    achievements =

        JSON.parse(

            localStorage.getItem("achievements")

        ) || {};

}

function saveAchievements() {

    localStorage.setItem(

        "achievements",

        JSON.stringify(achievements)

    );

}

function initializeAchievements() {

    for (const achievement of getGlobalAchievementDefinitions()) {

        if (!achievements[achievement.id]) {

            achievements[achievement.id] = {

                unlocked: false,

                unlockedAt: null

            };

        }

    }

    for (const definition of achievementDefinitions) {
        if (definition.questScoped) {
            delete achievements[definition.id];
        }
    }

    saveAchievements();

    renderAchievements();

}

loadAchievements();

initializeAchievements();

function getGlobalAchievementDefinitions() {
    return achievementDefinitions.filter(
        definition => !definition.questScoped
    );
}

function getAchievementProgress(definition) {

    if (!player) {
        return 0;
    }

    const rawProgress = definition.progressType === "uniqueWords"
        ? player.stats.uniqueThaiWords.length
        : player.stats[definition.stat] || 0;

    return Math.min(rawProgress, definition.goal);

}

function getAchievementPercent(definition) {

    return Math.floor(

        (getAchievementProgress(definition)

        /

        definition.goal)

        * 100

    );

}

function isAchievementUnlocked(definition) {

    return (

        getAchievementProgress(definition)

        >=

        definition.goal

    );

}

function unlockAchievement(definition) {

    const achievement = achievements[definition.id];

    if (achievement.unlocked) {

        return false;

    }

    achievement.unlocked = true;

    achievement.unlockedAt = Date.now();

saveAchievements();

renderAchievements();

achievementQueue.push(definition);

showNextAchievement();

return true;
}

function isMobileTypingAwardContext() {
    if (typeof isMobileViewport === "function") {
        return isMobileViewport();
    }

    return typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 900px)").matches;
}

function isTypingAwardAvailable(definition) {
    if (
        definition.campaignOnly &&
        localStorage.getItem("contentMode") !== "campaign"
    ) {
        return false;
    }

    if (definition.mobileOnly) {
        return isMobileTypingAwardContext();
    }

    if (definition.desktopOnly) {
        return !isMobileTypingAwardContext();
    }

    return true;
}

function getTypingAwardDefinitions() {
    return achievementDefinitions.filter(
        definition =>
            definition.questScoped &&
            definition.runType &&
            isTypingAwardAvailable(definition)
    );
}

function getQuestAchievementGoal(definition, questId) {
    const quest = typeof getQuestDataFromStatsId === "function"
        ? getQuestDataFromStatsId(questId)
        : null;

    if (!quest) {
        return definition.runGoal;
    }

    const lineCount = Array.isArray(quest.thaiZeilen)
        ? quest.thaiZeilen.length
        : 0;
    const wordCount = typeof getThaiWordList === "function"
        ? getThaiWordList(quest.thaiZeilen).words.length
        : 0;

    if (definition.runType === "cleanWords") {
        return Math.max(
            5,
            Math.min(definition.runGoal, Math.ceil(wordCount * 0.2))
        );
    }

    if (definition.runType === "newWords") {
        return Math.max(
            3,
            Math.min(definition.runGoal, Math.ceil(wordCount * 0.1))
        );
    }

    if (definition.runType === "cleanStreak") {
        const ratio = definition.runGoal === 10
            ? 0.25
            : definition.runGoal === 25
                ? 0.5
                : 1;

        return Math.max(
            definition.runGoal === 10 ? 3 : 5,
            Math.min(definition.runGoal, Math.ceil(lineCount * ratio))
        );
    }

    return definition.runGoal;
}

function createQuestAchievementState() {
    return {
        unlocked: false,
        unlockedAt: null,
        totalValue: 0,
        bestValue: 0,
        repeatCount: 0
    };
}

function getQuestAchievementState(questId, definitionId) {
    if (
        typeof getQuestStats !== "function" ||
        !questId
    ) {
        return createQuestAchievementState();
    }

    const stats = getQuestStats(questId);

    if (
        !stats.questAchievements ||
        typeof stats.questAchievements !== "object" ||
        Array.isArray(stats.questAchievements)
    ) {
        stats.questAchievements = {};
    }

    if (!stats.questAchievements[definitionId]) {
        stats.questAchievements[definitionId] =
            createQuestAchievementState();
    }

    return stats.questAchievements[definitionId];
}

function getQuestAchievementRunValue(definition, run) {
    return Number(
        definition.runType === "cpm"
            ? run.cpm
            : definition.runType === "accuracy"
                ? run.accuracy
                : definition.runType === "cleanWords"
                    ? run.cleanWords
                    : definition.runType === "newWords"
                        ? run.newWords
                        : definition.runType === "masteredWords"
                            ? run.masteredWords
                            : definition.runType === "cleanStreak"
                                ? run.cleanSentenceStreak
                                : definition.runType === "perfectQuest"
                                    ? run.perfectQuest
                                    : definition.runType === "newRecord"
                                        ? run.newRecord
                                        : definition.runType === "audioListens"
                                            ? run.audioListens
                                        : 0
    ) || 0;
}

function isTypingAwardEligible(definition, run) {
    return !definition.requiresNoTastenhilfe ||
        run?.tastenhilfeEnabled === false;
}

function isQuestAchievementCumulative(definition) {
    return [
        "cleanWords",
        "newWords",
        "masteredWords",
        "audioListens"
    ].includes(definition.runType);
}

function getQuestAchievementProgress(definition, questId, run = null) {
    const state = getQuestAchievementState(questId, definition.id);
    const baseValue = isQuestAchievementCumulative(definition)
        ? state.totalValue
        : state.bestValue;

    if (!run) {
        return Math.min(
            getQuestAchievementGoal(definition, questId),
            baseValue
        );
    }

    if (!isTypingAwardEligible(definition, run)) {
        return Math.min(
            getQuestAchievementGoal(definition, questId),
            baseValue
        );
    }

    const runValue = getQuestAchievementRunValue(definition, run);
    const candidate = isQuestAchievementCumulative(definition)
        ? baseValue + Math.max(0, runValue)
        : Math.max(baseValue, runValue);

    return Math.min(
        getQuestAchievementGoal(definition, questId),
        candidate
    );
}

function meetsTypingAwardCondition(definition, run) {
    if (!isTypingAwardEligible(definition, run)) {
        return false;
    }

    const goal = getQuestAchievementGoal(definition, run.questId);
    const value = getQuestAchievementRunValue(definition, run);
    const state = getQuestAchievementState(run.questId, definition.id);
    const progress = getQuestAchievementProgress(
        definition,
        run.questId,
        run
    );

    if (isQuestAchievementCumulative(definition)) {
        return progress >= goal && (
            !state.unlocked ||
            value >= goal
        );
    }

    return value >= goal;
}

function evaluateTypingRunAwards(run) {
    const awarded = [];
    const awardIds = run.awardIds instanceof Set
        ? run.awardIds
        : new Set();

    run.awardIds = awardIds;

    for (const definition of getTypingAwardDefinitions()) {
        if (
            awardIds.has(definition.id) ||
            !meetsTypingAwardCondition(definition, run)
        ) {
            continue;
        }

        awardIds.add(definition.id);

        const state = getQuestAchievementState(
            run.questId,
            definition.id
        );
        const firstUnlock = !state.unlocked;
        const baseXp = Number(definition.bonusXp) || 0;
        const xpAmount = firstUnlock
            ? baseXp
            : Math.max(1, Math.floor(baseXp * 0.2));

        if (firstUnlock) {
            state.unlocked = true;
            state.unlockedAt = Date.now();
        } else {
            state.repeatCount++;
        }

        const xpResult = awardPlayerXp(xpAmount);

        awarded.push({
            ...definition,
            goal: getQuestAchievementGoal(definition, run.questId),
            progress: getQuestAchievementProgress(
                definition,
                run.questId,
                run
            ),
            xpAwarded: xpResult.awardedXp,
            firstUnlock,
            repeatBonus: !firstUnlock,
            leveledUp: xpResult.leveledUp
        });
    }

    if (awarded.length > 0 && typeof saveQuestStats === "function") {
        saveQuestStats();
    }

    return awarded;
}

function registerQuestAudioListen(questId) {
    if (
        !questId ||
        typeof getQuestStats !== "function"
    ) {
        return [];
    }

    const audioDefinitions = getTypingAwardDefinitions().filter(
        definition => definition.runType === "audioListens"
    );
    const awarded = [];

    for (const definition of audioDefinitions) {
        const state = getQuestAchievementState(
            questId,
            definition.id
        );
        const goal = getQuestAchievementGoal(definition, questId);
        const previousValue = state.totalValue;

        state.totalValue += 1;

        if (
            state.unlocked ||
            previousValue >= goal ||
            state.totalValue < goal
        ) {
            continue;
        }

        state.unlocked = true;
        state.unlockedAt = Date.now();

        const xpResult = awardPlayerXp(
            Number(definition.bonusXp) || 0
        );

        awarded.push({
            ...definition,
            goal,
            progress: getQuestAchievementProgress(
                definition,
                questId
            ),
            xpAwarded: xpResult.awardedXp,
            firstUnlock: true,
            repeatBonus: false,
            leveledUp: xpResult.leveledUp
        });
    }

    saveQuestStats();
    return awarded;
}

function finalizeQuestAchievementProgress(questId, run) {
    if (
        !questId ||
        typeof getQuestStats !== "function"
    ) {
        return;
    }

    const stats = getQuestStats(questId);

    for (const definition of getTypingAwardDefinitions()) {
        if (!isTypingAwardEligible(definition, run)) {
            continue;
        }

        const state = getQuestAchievementState(
            questId,
            definition.id
        );
        const value = Math.max(
            0,
            getQuestAchievementRunValue(definition, run)
        );

        if (isQuestAchievementCumulative(definition)) {
            state.totalValue += value;
        } else {
            state.bestValue = Math.max(state.bestValue, value);
        }
    }

    saveQuestStats();
    return stats.questAchievements;
}

function getQuestAchievementCards(questId, run = null) {
    return getTypingAwardDefinitions().map(definition => {
        const state = getQuestAchievementState(
            questId,
            definition.id
        );
        const goal = getQuestAchievementGoal(definition, questId);
        const progress = getQuestAchievementProgress(
            definition,
            questId,
            run
        );

        return {
            ...definition,
            goal,
            progress,
            percent: goal > 0
                ? Math.min(100, Math.round((progress / goal) * 100))
                : 0,
            unlocked: state.unlocked,
            repeatCount: state.repeatCount
        };
    });
}

function updateAchievements() {

    for (const definition of getGlobalAchievementDefinitions()) {

        const state = achievements[definition.id];

        if (state.unlocked) {

            continue;

        }

        if (isAchievementUnlocked(definition)) {

            unlockAchievement(definition);

        }

    }

}

function showNextAchievement() {

    if (showingAchievement) {

        return;

    }

    if (achievementQueue.length === 0) {

        return;

    }

    showingAchievement = true;

    const achievement = achievementQueue.shift();

    console.log(

        "🏆 Achievement:",

        achievement.title

    );

    setTimeout(() => {

        showingAchievement = false;

        showNextAchievement();

    }, 3000);

}


function getAchievement(id) {

    return getGlobalAchievementDefinitions().find(

        achievement => achievement.id === id

    );

}

function getAchievementState(id) {

    return achievements[id];

}

function getAllAchievements() {

    return getGlobalAchievementDefinitions().map(definition => {

        return {

            ...definition,

            state: achievements[definition.id],

            progress: getAchievementProgress(definition),

            percent: getAchievementPercent(definition),

            completed: isAchievementUnlocked(definition)

        };

    });

}

function getAchievementSummary() {

    const definitions = getGlobalAchievementDefinitions();
    const total = definitions.length;

    let unlocked = 0;

    for (const achievement of definitions) {

        if (isAchievementUnlocked(achievement)) {

            unlocked++;

        }

    }

    return {

        total,

        unlocked,

        percent: Math.round(

            unlocked / total * 100

        )

    };

}

function getAchievementRarityCounts() {

    const counts = {

        common: 0,

        rare: 0,

        epic: 0,

        legendary: 0

    };

    for (const achievement of getGlobalAchievementDefinitions()) {

        counts[achievement.rarity]++;

    }

    return counts;

}

function createRarityOverview() {

    const rarity = getAchievementRarityCounts();

    return `

        <div>⚪ ${rarity.common}</div>

        <div>🔵 ${rarity.rare}</div>

        <div>🟣 ${rarity.epic}</div>

        <div>🟠 ${rarity.legendary}</div>

    `;

}

function renderAchievements() {

    const container = document.getElementById("achievementContainer");

    if (!container) {

        return;

    }

    container.innerHTML = "";

    const achievements = getAllAchievements();

    for (const achievement of achievements) {

        const card = createAchievementCard(achievement);

        container.appendChild(card);

    }

}

function createAchievementCard(achievement) {

    const card = document.createElement("div");

    card.className = "achievementCard";

    card.innerHTML = `

        <h2>${achievement.title}</h2>

        <p>${achievement.description}</p>

        <p>${achievement.progress} / ${achievement.goal}</p>

        <p>${achievement.percent}%</p>

    `;

    return card;

}

document.addEventListener("DOMContentLoaded", () => {

    renderAchievements();

});

function getRarityCount(rarity){

    return achievementDefinitions.filter(

        achievement => achievement.rarity === rarity

    ).length;

}
