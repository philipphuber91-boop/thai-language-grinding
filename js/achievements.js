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

    for (const achievement of achievementDefinitions) {

        if (!achievements[achievement.id]) {

            achievements[achievement.id] = {

                unlocked: false,

                unlockedAt: null

            };

        }

    }

    saveAchievements();

    renderAchievements();

}

loadAchievements();

initializeAchievements();

function getAchievementProgress(definition) {

if (!player) {

    return 0;

}


return Math.min(
    player.stats[definition.stat] || 0,
    definition.goal
);

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

function updateAchievements() {

    for (const definition of achievementDefinitions) {

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

    return achievementDefinitions.find(

        achievement => achievement.id === id

    );

}

function getAchievementState(id) {

    return achievements[id];

}

function getAllAchievements() {

    return achievementDefinitions.map(definition => {

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

    const total = achievementDefinitions.length;

    let unlocked = 0;

    for (const achievement of achievementDefinitions) {

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

    for (const achievement of achievementDefinitions) {

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

