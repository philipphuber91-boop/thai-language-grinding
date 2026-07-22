const questListe = document.getElementById("questListe");

let contentMode = "campaign";

function ladeKarten() {

    questListe.innerHTML = "";

    const daten =
        contentMode === "campaign"
            ? quests
            : missions;

    for (const nummer in daten) {

        const quest = daten[nummer];


const status =
    contentMode === "campaign"
        ? getQuestStatus(nummer)
        : "due";

const statusIcons = {

    due: '<span class="status-review">↻</span>',

    doneToday: '<span class="status-complete">✔</span>',

    mastered: '<span class="status-mastered">★</span>'

};


const statusLabel = statusIcons[status] || "";

const stats =
    contentMode === "campaign"
        ? getQuestStats(nummer)
        : {

            completed: false,

            repetition: {

                level: 0

            }

        };

let progress = 0;

if (stats.completed) {

    progress = Math.round(

        ((stats.repetition.level + 1) /

        repetitionIntervals.length) * 100

    );

}

const karte = document.createElement("div");

karte.className = "quest-card";

        karte.id = "quest-" + nummer;

        karte.onclick = () => toggleQuest(nummer);

karte.innerHTML = `

<div class="quest-status ${status}">

    ${statusLabel || ""}

</div>


<div class="quest-header">

<div class="quest-avatar">

<div class="quest-badge">

    <img
        src="../assets/ui/quest-badge.png"
        class="quest-badge-image">
        
        

    <span class="quest-badge-number">
        ${nummer}
    </span>

</div>

<div class="quest-image">

    <img
        src="../assets/quest/${quest.bild}.png"
        alt="${quest.titel}"
        class="quest-image-content">

    <img
        src="../assets/ui/quest-frame.png"
        class="quest-frame"
        alt="">

</div>

</div>

    <div class="quest-main">

        <h2>${quest.titel}</h2>

        <p class="quest-meta">

            ${quest.kapitel}

            •

            <span class="difficulty">

                ${quest.schwierigkeit}

            </span>

        </p>

        <p class="quest-words">

            📖 ${quest.woerter} Wörter

        </p>

    </div>

    <div class="quest-progress">

<p class="progress-text">

    ${progress}%

</p>

<div class="progress-bar">

    <div
        class="progress"
        style="width:${progress}%">
    </div>

</div>


    </div>

    <div class="quest-actions">

<button class="quest-start-button"
        onclick="event.stopPropagation(); starteQuest(${nummer})">

    <img
        src="../assets/ui/button-start.png"
        alt="Start">

</button>


    </div>

</div>

<div class="quest-details">

    <div class="quest-detail-grid">

        <div>🏆 Bester Lauf</div>

        <div>📌 Letzter Lauf</div>

        <div>🔁 Wiederholung</div>

        <div>⭐ Belohnung</div>

    </div>

</div>


`;

        questListe.appendChild(karte);

    }

}

if (questListe) {

    ladeKarten();

}


// Quest starten
let ausgewaehlteQuest = null;

// Quest starten
function starteQuest(questNummer) {

    ausgewaehlteQuest = questNummer;

    document
        .getElementById("startQuestOverlay")
        .classList.add("active");

}

const cancelQuestButton =
    document.getElementById("cancelQuestButton");

if (cancelQuestButton) {

    cancelQuestButton.onclick = function () {

        document
            .getElementById("startQuestOverlay")
            .classList.remove("active");

    };

}


const campaignButton =
    document.getElementById("campaignButton");

if (campaignButton) {

    campaignButton.onclick = function () {

        localStorage.setItem("aktuelleQuest", ausgewaehlteQuest);

    localStorage.setItem("contentMode", contentMode);

    localStorage.setItem("questMode", "campaign");

        window.location.href = "typing.html";

    };

}

const challengeButton =
    document.getElementById("challengeButton");

if (challengeButton) {

    challengeButton.onclick = function () {

        localStorage.setItem("aktuelleQuest", ausgewaehlteQuest);

        localStorage.setItem("contentMode", contentMode);

        localStorage.setItem("questMode", "challenge");

        window.location.href = "typing.html";

    };

}

function openStats() {

    window.location.href = "stats.html";

}

function openQuest(questId){

    document
        .getElementById("questOverlay")
        .classList.add("active");

}

function closeQuest(){

    document
        .getElementById("questOverlay")
        .classList.remove("active");

}

function toggleQuest(questId) {

    const karte = document.getElementById("quest-" + questId);

    karte.classList.toggle("expanded");

}


const campaignMenuButton =
    document.getElementById("campaignMenuButton");

if (campaignMenuButton) {

    campaignMenuButton.onclick = function () {

        contentMode = "campaign";

        ladeKarten();

    };

}

const missionsMenuButton =
    document.getElementById("missionsMenuButton");

if (missionsMenuButton) {

    missionsMenuButton.onclick = function () {

        contentMode = "missions";

        ladeKarten();

    };

}

