const questListe = document.getElementById("questListe");

// Nur auf der Weltkarte ausführen
if (questListe) {

    for (const nummer in quests) {

        const quest = quests[nummer];

const status = getQuestStatus(nummer);

const statusIcons = {

    due: '<span class="status-review">↻</span>',

    doneToday: '<span class="status-complete">✔</span>',

    mastered: '<span class="status-mastered">★</span>'

};


const statusLabel = statusIcons[status] || "";

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
        alt="${quest.titel}">

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

            0 / ${quest.woerter} Wörter

        </p>

        <div class="progress-bar">

            <div class="progress"></div>

        </div>

    </div>

    <div class="quest-actions">

<button class="quest-start-button"
        onclick="event.stopPropagation(); starteQuest(${nummer})">

    <span class="corner tl"></span>
    <span class="corner tr"></span>
    <span class="corner bl"></span>
    <span class="corner br"></span>

    <span class="start-icon">▶</span>
    <span>START</span>

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


// Quest starten
function starteQuest(questNummer) {

    localStorage.setItem("aktuelleQuest", questNummer);

    window.location.href = "typing.html";

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