function loadPlayer() {

    const savedPlayer = localStorage.getItem("player");

    if (savedPlayer) {

        player = JSON.parse(savedPlayer);

    }

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