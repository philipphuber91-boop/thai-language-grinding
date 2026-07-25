let selectedAchievement = null;

function renderAchievements() {

    const content = document.getElementById("questListe");

    if (!selectedAchievement) {

    selectedAchievement = getAllAchievements()[0];

}

if (!content) {

    return;

}

content.innerHTML = `

<div id="achievementPage">

    <div id="achievementSummary"></div>

    <div id="achievementBody">

        <div id="achievementLeft">

            <div id="achievementList"></div>

        </div>

        <div id="achievementDetail"></div>

    </div>

</div>

`;


    renderAchievementSummary();

    renderAchievementList();

    renderAchievementDetail();



}

function renderAchievementList() {

    const container = document.getElementById("achievementList");

    container.innerHTML = "";

    const achievements = getAllAchievements();

    for (const achievement of achievements) {

        container.appendChild(

            createAchievementCard(achievement)

        );

    }

}

function createAchievementCard(achievement) {

    const card = document.createElement("div");

    card.className = "achievementCard";

    if (achievement.completed) {

        card.classList.add("completed");

    }

    card.innerHTML = `

        <div class="achievementCardIcon">

            <img
    class="achievementIcon"
    src="../assets/icons/achievements/${achievement.icon}.png"
    alt="${achievement.title}">

        </div>

        <div class="achievementCardInfo">

            <div class="achievementCardTitle">

                ${achievement.title}

            </div>

            <div class="achievementCardDescription">

                ${achievement.description}

            </div>

        </div>

        <div class="achievementCardRight">

            <div class="achievementCardProgress">

                ${achievement.progress} / ${achievement.goal}

            </div>

            <div class="achievementCardStatus">

                ${achievement.completed ? "✔" : "›"}

            </div>

        </div>

    `;

    card.onclick = function () {

        selectedAchievement = achievement;

        renderAchievementDetail();

    };

    return card;

}

function renderAchievementDetail() {

    const container = document.getElementById("achievementDetail");

    if (!selectedAchievement) {

        container.innerHTML = "";

        return;

    }

    const unlocked = selectedAchievement.completed;

    container.innerHTML = `

        <div class="achievementDetailIcon">

            <img
    class="achievementDetailIconImage"
    src="../assets/icons/achievements/${selectedAchievement.icon}.png"
    alt="${selectedAchievement.title}">

        </div>

        <h2 class="achievementDetailTitle">

            ${selectedAchievement.title}

        </h2>


        <p class="achievementDetailDescription">

            ${selectedAchievement.description}

        </p>

        <div class="progressBar large">

            <div
                class="progressFill"
                style="width:${selectedAchievement.percent}%">
            </div>

        </div>

        <div class="achievementDetailNumbers">

            ${selectedAchievement.progress}
            /
            ${selectedAchievement.goal}

        </div>

        <div class="achievementDetailPercent">

            ${selectedAchievement.percent} %

        </div>

        <div class="achievementUnlockState">

            ${unlocked ? "✔ FREIGESCHALTET" : "🔒 GESPERRT"}

        </div>

    `;

}

function renderAchievementHeader() {

    const header = document.getElementById("achievementHeader");

    header.innerHTML = `

        <div class="achievementTitle">

            <span class="achievementTitleIcon">🏆</span>

            <div>

                <h1>ERRUNGENSCHAFTEN</h1>

                <p>Dein dauerhafter Fortschritt im Spiel</p>

            </div>

        </div>

    `;

}

function renderAchievementSummary() {

    const summary = getAchievementSummary();

document.getElementById("achievementSummary").innerHTML = `

<div class="achievementSummaryLeft">

    <img
        src="../assets/icons/achievements/pokal.png"
        class="summaryTrophyImage">

    <div>

        <div class="summaryNumbers">

            ${summary.unlocked} / ${summary.total}

        </div>

        <div class="summaryText">

            freigeschaltet

        </div>

    </div>

</div>


<div class="achievementSummaryCenter">

    <div class="summaryLabel">

        Gesamtfortschritt

    </div>


    <div class="progressBar">

        <div
            class="progressFill"
            style="width:${summary.percent}%">
        </div>

    </div>


    <div class="summaryPercent">

        ${summary.percent}%

    </div>

</div>


<div class="achievementSummaryRight">


<div class="rarityBox">

    <img src="../assets/icons/achievements/common.png">

    <span>Gewöhnlich</span>

    <strong>${getRarityCount("common")}</strong>

</div>


<div class="rarityBox">

    <img src="../assets/icons/achievements/rare.png">

    <span>Selten</span>

    <strong>${getRarityCount("rare")}</strong>

</div>


<div class="rarityBox">

    <img src="../assets/icons/achievements/epic.png">

    <span>Episch</span>

    <strong>${getRarityCount("epic")}</strong>

</div>


<div class="rarityBox">

    <img src="../assets/icons/achievements/legendary.png">

    <span>Legendär</span>

    <strong>${getRarityCount("legendary")}</strong>

</div>


</div>

`;

}
