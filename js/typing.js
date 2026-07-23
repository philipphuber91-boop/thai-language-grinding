let phase = "auftrag";

// Kampagne = Lernmodus
// Challenge = direkt zur Prüfung
let mode = "learning";
let startZeit = null;
let endZeit = null;
let fehler = 0;
const zeile1 = document.getElementById("zeile1");
const zeile2 = document.getElementById("zeile2");
const eingabe = document.getElementById("eingabe");
const aktuelleQuest = localStorage.getItem("aktuelleQuest");
const questMode = localStorage.getItem("questMode") || "campaign";

const contentMode =
    localStorage.getItem("contentMode") || "campaign";

const daten =
    contentMode === "campaign"
        ? quests
        : missions;

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

    setTimeout(function () {

        eingabe.focus();

    }, 0);

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
const deutschAktuell =
    document.getElementById("deutschAktuell");
const toggleGermanButton =
    document.getElementById("toggleGermanButton");

    const deutschTitel =
    document.getElementById("deutschTitel");

let germanVisible = true;

function aktualisiereGermanToggle() {

    toggleGermanButton.textContent =
        germanVisible ? "🇩🇪 EIN" : "🇩🇪 AUS";

    toggleGermanButton.disabled =
        startZeit !== null;

}
questTitel.textContent =
    daten[aktuelleQuest].titel;

storyText.textContent =
    daten[aktuelleQuest].story;

deutscherText.innerHTML =
    daten[aktuelleQuest].deutschZeilen.join("<br><br>");

thaiText.innerHTML =
    daten[aktuelleQuest].thaiZeilen.join("<br><br>");
const auftrag = document.getElementById("auftrag");
const deutsch = document.getElementById("deutsch");
const typingBereich =
    document.getElementById("typingBereich");

const startThaiButton =
    document.getElementById("startThai");

const startDeutschButton =
    document.getElementById("startDeutsch");
const thaiZeilen =
    daten[aktuelleQuest].thaiZeilen;

const deutschZeilen =
    daten[aktuelleQuest].deutschZeilen;
let text = thaiZeilen[0];

let position = 0;
let aktuelleZeile = 0;
let fehlerTimeout = null;
let gesamtZeichen = 0;

function aktualisiereDeutsch() {

    deutschTitel.style.display =
        germanVisible ? "block" : "none";

    deutschAktuell.textContent =
        germanVisible
            ? deutschZeilen[aktuelleZeile] || ""
            : "";

}

function zeigeZeilen() {

    aktualisiereDeutsch();

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

function verarbeiteRichtigenBuchstaben() {

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

            if (mode === "learning") {

                document
                    .getElementById("examOverlay")
                    .classList.add("active");

                return;

            }

            beendePruefung();

            return;

        }

        naechsteZeile();

    }

}

function beendePruefung() {

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
    daten[aktuelleQuest].titel +
    " erfolgreich abgeschlossen!";

    popupZeit.textContent = zeitAnzeige;
    popupCPM.textContent = cpm;
    popupAccuracy.textContent = accuracy + "%";

const newRecords = completeQuest(

    aktuelleQuest,
    sekunden,
    Number(cpm),
    Number(accuracy),
    gesamtZeichen

);

showRecordSummary(newRecords);

phase = "abschluss";

zeigePhase();

}

function startePruefung() {

    if (startZeit !== null) {

        return;

    }

    startZeit = Date.now();

    aktualisiereGermanToggle();

}

function bereitePruefungVor() {

    startZeit = null;
    endZeit = null;

    fehler = 0;
    gesamtZeichen = 0;

    position = 0;
    aktuelleZeile = 0;

    text = thaiZeilen[0];

    eingabe.value = "";

    zeigeZeilen();

    eingabe.focus();

    aktualisiereGermanToggle();
}


eingabe.addEventListener("input", function () {

    console.log("INPUT", eingabe.value);

    const eingegeben = eingabe.value;

    // Noch nichts eingegeben
    if (eingegeben.length === 0) {
        return;
    }

    // Erster Tastendruck startet die Zeit
    startePruefung();

    // Erwarteter Buchstabe
    const erwartet = text[position];

if (eingegeben === erwartet) {

    verarbeiteRichtigenBuchstaben();

}

else {

    if (mode === "exam") {

        fehler++;

    }

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

    setInterval(function () {

        eingabe.focus();

    }, 100);

});

weiterButton.addEventListener("click", function () {

    window.location.href = "index.html";

});

toggleGermanButton.addEventListener("mousedown", function (event) {

    event.preventDefault();

});

toggleGermanButton.addEventListener("click", function () {

    germanVisible = !germanVisible;

    aktualisiereGermanToggle();

    zeigeZeilen();

    eingabe.focus();

});


document
    .getElementById("startExamButton")
    ?.addEventListener("click", function () {

        mode = "exam";

        document
            .getElementById("examOverlay")
            .classList.remove("active");

        bereitePruefungVor();

    });

if (questMode === "challenge") {

    phase = "typing";

    mode = "exam";

    germanVisible = false;

}

aktualisiereGermanToggle();

zeigePhase();

zeigeZeilen();


function showRecordSummary(records){

    const container =
        document.getElementById("recordContainer");

    const list =
        document.getElementById("recordList");

    list.innerHTML = "";

    container.classList.remove("active");

    let improvements = 0;

    if(records.newBestTime){

        improvements++;

let oldTimeText = "—";

if(records.oldBestTime !== null){

    const oldMinutes =
        Math.floor(records.oldBestTime / 60);

    const oldSeconds =
        String(records.oldBestTime % 60)
        .padStart(2,"0");

    oldTimeText =
        `${oldMinutes}:${oldSeconds}`;

}

const newMinutes =
    Math.floor(records.newTime / 60);

const newSeconds =
    String(records.newTime % 60)
    .padStart(2,"0");

const newTimeText =
    `${newMinutes}:${newSeconds}`;

const improvement =

    records.oldBestTime === null

        ? null

        : records.oldBestTime - records.newTime;

        list.innerHTML += `
            <div class="record-item">

                <div class="record-name">

                    ⏱ Persönliche Bestzeit

                </div>

                <div class="record-values">

                ${oldTimeText}

↓

${newTimeText}

${
improvement !== null

? `<br><span class="record-improvement">

(-${improvement} Sek.)

</span>`

: ""

}

                </div>

            </div>
        `;

    }

    if(records.newBestAccuracy){

        improvements++;

        list.innerHTML += `
            <div class="record-item">

                <div class="record-name">

                    🎯 Höchste Genauigkeit

                </div>

                <div class="record-values">

                ${
records.oldBestAccuracy ?? "—"
} %

↓

${records.newAccuracy} %

${
records.oldBestAccuracy !== null

? `<br><span class="record-improvement">

(+${(
records.newAccuracy -
records.oldBestAccuracy
).toFixed(1)}%)

</span>`

: ""

}

                </div>

            </div>
        `;

    }

    if(improvements > 0){

        container.classList.add("active");

    }

}
