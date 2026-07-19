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

    savePlayer();

}

function loadQuestStats() {

    const savedQuestStats = localStorage.getItem("questStats");

    if (savedQuestStats) {

        questStats = JSON.parse(savedQuestStats);

    }

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