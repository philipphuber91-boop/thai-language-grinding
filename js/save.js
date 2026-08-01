function loadPlayer() {

    const savedPlayer = localStorage.getItem("player");

    if (!savedPlayer) {

        return;

    }

    player = JSON.parse(savedPlayer);

    player.stats = {

        ...defaultPlayer.stats,

        ...player.stats

    };

    if (!player.stats.history || Array.isArray(player.stats.history)) {

        player.stats.history = { daily: Array.isArray(player.stats.history) ? player.stats.history : [] };

    } else if (!Array.isArray(player.stats.history.daily)) {

        player.stats.history.daily = [];

    }
    
    savePlayer();

    

}

function loadQuestStats() {

    const savedQuestStats = localStorage.getItem("questStats");

    if (savedQuestStats) {

        questStats = JSON.parse(savedQuestStats);

        // Savegames before the separation used only numeric IDs. Those
        // entries belong to the campaign and are migrated once on load.
        let migrated = false;

        for (const questId in questStats) {

            if (/^\d+$/.test(questId)) {

                questStats[`campaign:${questId}`] = questStats[questId];
                delete questStats[questId];
                migrated = true;

            }

        }

        if (migrated) {

            saveQuestStats();

        }

    }

    migrateUniqueThaiWordsFromCompletedQuests();
    migrateTotalThaiWordsFromCompletedQuests();
    migrateThaiWordStatsFromCompletedQuests();

}

function saveQuestStats() {

    localStorage.setItem(

        "questStats",

        JSON.stringify(questStats)

    );

}

function savePlayer() {

    localStorage.setItem(

        "player",

        JSON.stringify(player)

    );

}
