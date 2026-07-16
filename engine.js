const aktuelleQuest = 1;

function starteQuest(questNummer) {

    localStorage.setItem("aktuelleQuest", questNummer);

    window.location.href = "typing.html";

}

const quest1Titel =
    document.getElementById("quest1Titel");

const quest1Beschreibung =
    document.getElementById("quest1Beschreibung");

const quest1Woerter =
    document.getElementById("quest1Woerter");

quest1Titel.textContent =
    "🏝 " + quests[aktuelleQuest].titel;

quest1Beschreibung.textContent =
    quests[aktuelleQuest].kapitel;

quest1Woerter.textContent =
    "📖 " + quests[aktuelleQuest].woerter + " Wörter";