const questListe = document.getElementById("questListe");

// Nur auf der Weltkarte ausführen
if (questListe) {

    for (const nummer in quests) {

        const quest = quests[nummer];

const status = getQuestStatus(nummer);

const statusIcons = {

    due: "↻",

    doneToday: "✓",

    mastered: "⭐"

};

const statusLabel = statusIcons[status] || "";

        const karte = document.createElement("div");

        karte.className = "quest-card";

        karte.innerHTML = `

${statusLabel ? `
<div class="quest-status ${status}">
    ${statusLabel}
</div>
` : ""}

<div class="quest-top">

<div class="quest-badge">

    <img src="../assets/ui/shield.png">

    <span>${nummer}</span>

</div>

<div class="quest-image">

    <img src="../assets/quests/default.png">

</div>

<div class="quest-info">

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

</div>

<hr class="quest-line">

<div class="quest-footer">

    <div class="quest-progress">

        <p class="progress-text">

            0 / ${quest.woerter} Wörter

        </p>

        <div class="progress-bar">

            <div class="progress"></div>

        </div>

    </div>

    <div class="quest-actions">

        <button onclick="starteQuest(${nummer})">

            ▶ START QUEST

        </button>

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