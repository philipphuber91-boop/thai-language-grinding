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

// Separate IDs prevent a campaign quest and a mission with the same number
// from sharing progress, records, and review dates.
const questStatsId = `${contentMode}:${aktuelleQuest}`;
const stats = getQuestStats(questStatsId);
function zeigePhase() {

    // Alles ausblenden
    auftrag.style.display = "none";
    deutsch.style.display = "none";
    typingBereich.style.display = "none";
    popup.classList.remove("active");

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

    break;
    }

}


const zeitAnzeigeElement = document.getElementById("zeitAnzeige");
const wpmAnzeigeElement = document.getElementById("wpmAnzeige");
const accuracyAnzeigeElement = document.getElementById("accuracyAnzeige");

const popup =
document.getElementById("questCompleteOverlay");
const popupZeit = document.getElementById("popupZeit");

const popupCPM = document.getElementById("popupCPM");

const popupKapitel =
    document.getElementById("popupKapitel");

const popupAccuracy = document.getElementById("popupAccuracy");
const popupWords = document.getElementById("popupWords");
const popupDuration = document.getElementById("popupDuration");
const popupDifficulty = document.getElementById("popupDifficulty");

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

    popupKapitel.textContent = daten[aktuelleQuest].titel;
    popupWords.textContent = daten[aktuelleQuest].woerter;
    popupDuration.textContent = zeitAnzeige;
    popupDifficulty.textContent = daten[aktuelleQuest].schwierigkeit;

    const completeQuestImage =
    document.getElementById("completeQuestImage");

if(daten[aktuelleQuest].bild){

    completeQuestImage.src =
        "../assets/quest/" +
        daten[aktuelleQuest].bild +
        ".png";

}

    popupZeit.textContent = zeitAnzeige;
    popupCPM.textContent = cpm;
    popupAccuracy.textContent = accuracy + "%";

const newRecords = completeQuest(

    questStatsId,
    sekunden,
    Number(cpm),
    Number(accuracy),
    gesamtZeichen

);

showRecordSummary(newRecords);

popup.classList.add("active");

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

eingabe.focus();

});

weiterButton.addEventListener("click", function () {

    popup.classList.remove("active");

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

    eingabe.focus();

}

aktualisiereGermanToggle();

zeigePhase();

zeigeZeilen();


function showRecordSummary(records){

    const container =
        document.getElementById("recordContainer");

    container.classList.add("active");

    const bestTime =
        records.oldBestTime === null
            ? records.newTime
            : records.oldBestTime;

    const bestAccuracy =
        records.oldBestAccuracy === null
            ? records.newAccuracy
            : records.oldBestAccuracy;

    const bestMinutes =
        Math.floor(bestTime / 60);

    const bestSeconds =
        String(bestTime % 60).padStart(2,"0");

    const currentMinutes =
        Math.floor(records.newTime / 60);

    const currentSeconds =
        String(records.newTime % 60).padStart(2,"0");

const timeDiff =
    records.newTime - bestTime;

const accuracyDiff =
    Number(
        (
            records.newAccuracy -
            bestAccuracy
        ).toFixed(1)
    );

const timeColor =
    timeDiff < 0
        ? "#2aa84a"
        : timeDiff > 0
            ? "#cc4040"
            : "#777";

const accuracyColor =
    accuracyDiff > 0
        ? "#2aa84a"
        : accuracyDiff < 0
            ? "#cc4040"
            : "#777";


container.innerHTML = `

<div class="compare-table">

    <div class="compare-header compare-empty"></div>
    <div class="compare-header">🏆 Persönlicher Rekord</div>
    <div class="compare-header">⚔ Aktueller Lauf</div>
    <div class="compare-header">⭐ Ergebnis</div>

    <div class="compare-icon">

        ⏱ ZEIT

    </div>

    <div class="compare-value">

        ${bestMinutes}:${bestSeconds}

    </div>

    <div class="compare-value">

        ${currentMinutes}:${currentSeconds}

    </div>

    <div
        class="compare-result"
        style="color:${timeColor}">

        ${
            timeDiff < 0

                ? `🟢 Neuer Rekord! (${Math.abs(timeDiff)} Sek.)`

                : timeDiff > 0

                    ? `+${timeDiff} Sek.`

                    : "Gleich schnell"

        }

    </div>

    <div class="compare-icon">

        🎯 GENAUIGKEIT

    </div>

    <div class="compare-value">

        ${bestAccuracy} %

    </div>

    <div class="compare-value">

        ${records.newAccuracy} %

    </div>

    <div
        class="compare-result"
        style="color:${accuracyColor}">

        ${
            accuracyDiff > 0

                ? "⭐ Neuer Rekord!"

                : accuracyDiff < 0

                    ? `${accuracyDiff}%`

                    : "Unverändert"

        }

    </div>

</div>

`;

    // Zwei separate Vergleichszeilen sind auf einen Blick lesbarer als
    // eine gemeinsame Tabelle. Die Berechnungen oberhalb werden weiterverwendet.
    container.innerHTML = `

        <div class="record-row">
            <div class="record-label">&#9201; ZEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong>${bestMinutes}:${bestSeconds}</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong>${currentMinutes}:${currentSeconds}</strong>
            </div>
            <div class="record-cell record-result" style="color:${timeColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong>${
                    timeDiff < 0
                        ? `Neuer Rekord! (-${Math.abs(timeDiff)} Sek.)`
                        : timeDiff > 0
                            ? `+${timeDiff} Sek.`
                            : "Gleich schnell"
                }</strong>
            </div>
        </div>

        <div class="record-row">
            <div class="record-label">&#127919; GENAUIGKEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong>${bestAccuracy} %</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong>${records.newAccuracy} %</strong>
            </div>
            <div class="record-cell record-result" style="color:${accuracyColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong>${
                    accuracyDiff > 0
                        ? "Neuer Rekord!"
                        : accuracyDiff < 0
                            ? `${accuracyDiff}%`
                            : "Unver&auml;ndert"
                }</strong>
            </div>
        </div>

    `;

}

document.addEventListener("pointerdown", function () {

    if (phase === "typing") {

        setTimeout(function () {

            eingabe.focus();

        }, 0);

    }

});
