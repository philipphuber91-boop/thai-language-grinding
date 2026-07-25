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




const statusIcons = {

    due: '<span class="status-review">↻</span>',

    doneToday: '<span class="status-complete">✔</span>',

    mastered: '<span class="status-mastered">★</span>'

};
const status = getQuestStatus(`${contentMode}:${nummer}`);

const stats = getQuestStats(`${contentMode}:${nummer}`);

const statusLabel = statusIcons[status] || "";



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

    const daten =
        contentMode === "campaign"
            ? quests
            : missions;

    const quest = daten[questNummer];

    // Titel des Fensters
    document.getElementById("startOverlayTitle").textContent =
        contentMode === "campaign"
            ? "📖 Kampagne starten"
            : "🎯 Mission starten";

    // Questdaten
    document.getElementById("startQuestName").textContent =
        quest.titel;

    document.getElementById("startQuestDifficulty").textContent =
        "🏅 " + quest.schwierigkeit;

    document.getElementById("startQuestWords").textContent =
        "📖 " + quest.woerter + " Wörter";

    // Questbild
    document.getElementById("startQuestImage").src =
        "../assets/quest/" + quest.bild + ".png";

    // Zeit berechnen
    const cpm = 20;

    const gesamtSekunden =
        Math.ceil((quest.woerter / cpm) * 60);

    const minuten =
        Math.floor(gesamtSekunden / 60);

    const sekunden =
        String(gesamtSekunden % 60).padStart(2, "0");

    document.getElementById("startQuestTime").textContent =
        `⏱ ${minuten}:${sekunden}`;

        // Platzhalter für spätere Statistik

const questStats = getQuestStats(`${contentMode}:${questNummer}`);

if (questStats.records.bestTime !== null) {

    const minuten = Math.floor(questStats.records.bestTime / 60);
    const sekunden = String(
        Math.floor(questStats.records.bestTime % 60)
    ).padStart(2, "0");

    document.getElementById("startQuestBestTime").textContent =
        `${minuten}:${sekunden}`;

} else {

    document.getElementById("startQuestBestTime").textContent =
        "--:--";

}

if (questStats.records.bestAccuracy !== null) {

    document.getElementById("startQuestAccuracy").textContent =
        `${questStats.records.bestAccuracy.toFixed(1)} %`;

} else {

    document.getElementById("startQuestAccuracy").textContent =
        "-- %";

}

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

    localStorage.setItem("questMode", "learning");

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

function openChronik(){

    renderChronik();

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

function switchContent(mode) {

    console.log("switchContent:", mode);

    contentMode = mode;

    switch (mode) {


        case "campaign":

            document.getElementById("questListe").style.display = "block";

            document.getElementById("chronikContainer").style.display = "none";

            ladeKarten();

            break;



        case "missions":

            document.getElementById("questListe").style.display = "block";

            document.getElementById("chronikContainer").style.display = "none";

            ladeKarten();

            break;


case "achievements":

    document.getElementById("questListe").style.display = "none";

    document.getElementById("chronikContainer").style.display = "none";

    document.getElementById("achievementContainer").style.display = "block";


    console.log("Achievements werden gerendert");

    renderAchievements();

    break;       



case "chronik":

    document.getElementById("questListe").style.display = "none";

    document.getElementById("achievementContainer").style.display = "none";

    document.getElementById("chronikContainer").style.display = "block";

    renderChronik();

    break;

    }

}


const campaignMenuButton =
    document.getElementById("campaignMenuButton");

if (campaignMenuButton) {

campaignMenuButton.onclick = function () {

    switchContent("campaign");

};

}

const missionsMenuButton =
    document.getElementById("missionsMenuButton");

if (missionsMenuButton) {

missionsMenuButton.onclick = function () {

    switchContent("missions");

};

}

const achievementButton =
    document.getElementById("achievementButton");

if (achievementButton) {

    achievementButton.onclick = function () {

        switchContent("achievements");

    };

}

const chronikButton =
    document.getElementById("chronikButton");


if (chronikButton) {

    chronikButton.onclick = function () {

        switchContent("chronik");

    };

}


