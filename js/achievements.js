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

}

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
