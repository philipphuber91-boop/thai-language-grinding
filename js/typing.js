let phase = "auftrag";
let startZeit = null;
let endZeit = null;
let fehler = 0;
const zeile1 = document.getElementById("zeile1");
const zeile2 = document.getElementById("zeile2");
const eingabe = document.getElementById("eingabe");
const aktuelleQuest = localStorage.getItem("aktuelleQuest");
const stats = getQuestStats(aktuelleQuest);
function zeigePhase() {

    // Alles ausblenden
    auftrag.style.display = "none";
    deutsch.style.display = "none";
    typingBereich.style.display = "none";
    popup.style.display = "none";

    switch (phase) {

        case "auftrag":
            auftrag.style.display = "block";
            break;

        case "deutsch":
            deutsch.style.display = "block";
            break;

        case "typing":
            typingBereich.style.display = "block";
            break;

        case "abschluss":
            popup.style.display = "flex";
            break;

    }

}


const zeitAnzeigeElement = document.getElementById("zeitAnzeige");
const wpmAnzeigeElement = document.getElementById("wpmAnzeige");
const accuracyAnzeigeElement = document.getElementById("accuracyAnzeige");

const popup =
document.getElementById("questCompleteScreen");
const popupZeit = document.getElementById("popupZeit");

const popupCPM = document.getElementById("popupCPM");

const popupKapitel =
    document.getElementById("popupKapitel");

const popupAccuracy = document.getElementById("popupAccuracy");

const weiterButton = document.getElementById("weiterButton");


const questTitel = document.getElementById("questTitel");
const deutscherText = document.getElementById("deutscherText");
const thaiText = document.getElementById("thaiText");
const storyText = document.getElementById("storyText");
questTitel.textContent =
    quests[aktuelleQuest].titel;

storyText.textContent =
    quests[aktuelleQuest].story;

deutscherText.innerHTML =
    quests[aktuelleQuest].deutschZeilen.join("<br><br>");

thaiText.innerHTML =
    quests[aktuelleQuest].thaiZeilen.join("<br><br>");
const auftrag = document.getElementById("auftrag");
const deutsch = document.getElementById("deutsch");
const typingBereich =
    document.getElementById("typingBereich");

const startThaiButton =
    document.getElementById("startThai");

const startDeutschButton =
    document.getElementById("startDeutsch");
const thaiZeilen =
    quests[aktuelleQuest].thaiZeilen;

let text = thaiZeilen[0];

let position = 0;
let aktuelleZeile = 0;
let fehlerTimeout = null;
let gesamtZeichen = 0;

function zeigeZeilen() {

    let geschrieben =
        text.substring(0, position);

    let aktuell =
        text[position] || "";

    let rest =
        text.substring(position + 1);

    zeile1.innerHTML =
        "<span class='geschrieben'>" +
        geschrieben +
        "</span>" +

        "<span class='aktuell'>" +
        aktuell +
        "</span>" +

        "<span class='rest'>" +
        rest +
        "</span>";

    zeile2.textContent =
        thaiZeilen[aktuelleZeile + 1] || "";

}



function aktualisiereNaechsteZeile() {

    zeile2.textContent =
        thaiZeilen[aktuelleZeile + 1] || "";

}

function naechsteZeile() {

    zeile1.classList.add("nach-oben");

    setTimeout(function(){

        text = thaiZeilen[aktuelleZeile];
        position = 0;

        zeigeZeilen();

        zeile1.classList.remove("nach-oben");

    },250);

}

function zeigeFehler() {

    clearTimeout(fehlerTimeout);

    let geschrieben =
        text.substring(0, position);

    let aktuell =
        text[position] || "";

    let rest =
        text.substring(position + 1);

    zeile1.innerHTML =

        "<span class='geschrieben'>" +
        geschrieben +
        "</span>" +

        "<span class='fehler'>" +
        aktuell +
        "</span>" +

        "<span class='rest'>" +
        rest +
        "</span>";

    fehlerTimeout = setTimeout(function(){

        zeigeZeilen();

    },150);

}


eingabe.addEventListener("input", function () {


    const eingegeben = eingabe.value;

    // Noch nichts eingegeben
    if (eingegeben.length === 0) {
        return;
    }

    // Erster Tastendruck startet die Zeit
    if (startZeit === null) {
        startZeit = Date.now();
    }

    // Erwarteter Buchstabe
    const erwartet = text[position];

    if (eingegeben === erwartet) {

        position++;
        gesamtZeichen++;
        
        eingabe.value = "";

        if (position < text.length) {

        zeigeZeilen();

        

    }
        // Zeile fertig?
        if (position >= text.length) {

            aktuelleZeile++;

            // Quest fertig?
            if (aktuelleZeile >= thaiZeilen.length) {

                endZeit = Date.now();

                const zeit = endZeit - startZeit;
                const sekunden = Math.floor(zeit / 1000);

                const minuten = Math.floor(sekunden / 60);
                const restSekunden = sekunden % 60;

                const minutenGesamt = zeit / 60000;

                const cpm = (gesamtZeichen / minutenGesamt).toFixed(1);

                const accuracy =
                (
                    (gesamtZeichen / (gesamtZeichen + fehler)) * 100
                ).toFixed(1);

                const zeitAnzeige =
                    String(minuten).padStart(2, "0") +
                    ":" +
                    String(restSekunden).padStart(2, "0");

                zeitAnzeigeElement.textContent = zeitAnzeige;
                wpmAnzeigeElement.textContent = cpm;
                accuracyAnzeigeElement.textContent = accuracy + "%";

popupKapitel.textContent =
    quests[aktuelleQuest].titel + " erfolgreich abgeschlossen!";

                popupKapitel.textContent =
                quests[aktuelleQuest].titel + " erfolgreich abgeschlossen!";

                popupZeit.textContent = zeitAnzeige;
                popupCPM.textContent = cpm;
                popupAccuracy.textContent = accuracy + "%";

                
phase = "abschluss";
zeigePhase();
                
console.log("completeQuest wird aufgerufen");

completeQuest(

    aktuelleQuest,

    zeit,

    Number(cpm),

    Number(accuracy),

    gesamtZeichen

);


                return;

            }

           naechsteZeile();

        }

    }

    else {

        fehler++;
        zeigeFehler();
        eingabe.value = "";

    }

});



startDeutschButton.addEventListener("click", function () {

    phase = "deutsch";

    zeigePhase();

});

startThaiButton.addEventListener("click", function () {

    phase = "typing";

    zeigePhase();

    eingabe.focus();

});

weiterButton.addEventListener("click", function () {

    window.location.href = "index.html";

});

storyText.textContent =
    quests[aktuelleQuest].story;

    zeigePhase();
    zeigeZeilen();

