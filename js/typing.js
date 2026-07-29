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

// Der Keyboard Tutor unterstützt seit seiner Einführung alle
// Tastaturlayouts (Deutsch, Englisch, ...) korrekt - ein Abschalten
// ist daher nicht mehr sinnvoll/nötig. Der frühere Umschalt-Button
// und seine localStorage-Einstellung ("keyboardTutorMode") entfallen.
const keyboardTutorModeEnabled = true;

const contentMode =
    localStorage.getItem("contentMode") || "campaign";

const daten =
    contentMode === "campaign"
        ? quests
        : missions;

// Separate IDs prevent a campaign quest and a mission with the same number
// from sharing progress, records, and review dates.
const questStatsId = `${contentMode}:${aktuelleQuest}`;
const stats = getQuestStats(questStatsId, daten[aktuelleQuest].version ?? 1);

const keyboardElement = document.getElementById("thaiKeyboard");
let highlightedKeyElements = [];
let tastenhilfeTimer = null;
let tastenhilfeRequestId = 0;
let pendingTutorInput = null;

// Tastenhilfe (Lernhilfen-Einstellung): steuert, ob und nach welcher
// Verzögerung die Taste des als nächstes erwarteten Zeichens auf der
// virtuellen Tastatur hervorgehoben wird. Gilt einheitlich für Lern-
// und Prüfungsphase, siehe syncKeyboardHighlight().
const TASTENHILFE_MIN_SEKUNDEN = 1;
const TASTENHILFE_MAX_SEKUNDEN = 5;
const TASTENHILFE_STANDARD_SEKUNDEN = 2;

function clampTastenhilfeSekunden(value) {
    const zahl = Number(value);
    if (!Number.isFinite(zahl)) {
        return TASTENHILFE_STANDARD_SEKUNDEN;
    }
    return Math.min(TASTENHILFE_MAX_SEKUNDEN, Math.max(TASTENHILFE_MIN_SEKUNDEN, Math.round(zahl)));
}

let tastenhilfeEnabled =
    localStorage.getItem("tastenhilfeAktiviert") !== "false";

let tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(
    localStorage.getItem("tastenhilfeVerzoegerung") ?? TASTENHILFE_STANDARD_SEKUNDEN
);

const keyPressAnimationDurationMs = 130;

// keyboard.js liefert: thaiKeyboardMap, latinToThaiMap, physicalKeyLayout,
// resolvePhysicalLayoutKeyFromCode, translatePhysicalCode, translatePhysicalKey

function getKeyElements(character) {
    if (!keyboardElement || character === null || character === undefined) {
        return [];
    }

    const str = String(character);
    return Array.from(keyboardElement.querySelectorAll(".key")).filter(
        el => el.getAttribute("data-key") === str
    );
}

function clearHighlight() {
    highlightedKeyElements.forEach(el => el.classList.remove("active"));
    highlightedKeyElements = [];
}

function highlightKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.add("active");

        if (!highlightedKeyElements.includes(el)) {
            highlightedKeyElements.push(el);
        }
    });
}

function applyKeyboardHighlight(character) {
    const mapping = thaiKeyboardMap[character];

    if (!mapping) {
        return;
    }

    highlightKey(mapping.key);

    if (mapping.shift) {
        highlightKey("Shift");
    }
}

function clearTastenhilfeTimer() {
    if (tastenhilfeTimer !== null) {
        clearTimeout(tastenhilfeTimer);
        tastenhilfeTimer = null;
    }
}

function getCurrentExpectedCharacter() {
    if (!text || typeof text !== "string") {
        return null;
    }

    return text[position] || null;
}

function syncKeyboardHighlight() {
    clearHighlight();
    clearTastenhilfeTimer();

    if (phase !== "typing") {
        return;
    }

    // Lernhilfen-Einstellung "Tastenhilfe": komplett aus = keine
    // Hervorhebung, weder in der Lern- noch in der Prüfungsphase.
    if (!tastenhilfeEnabled) {
        return;
    }

    const expectedCharacter = getCurrentExpectedCharacter();

    if (!expectedCharacter) {
        return;
    }

    const currentRequestId = ++tastenhilfeRequestId;
    const verzoegerungMs = tastenhilfeVerzoegerungSekunden * 1000;

    tastenhilfeTimer = setTimeout(() => {
        if (currentRequestId !== tastenhilfeRequestId) {
            return;
        }

        if (phase !== "typing") {
            return;
        }

        const currentCharacter = getCurrentExpectedCharacter();

        if (currentCharacter) {
            applyKeyboardHighlight(currentCharacter);
        }

        tastenhilfeTimer = null;
    }, verzoegerungMs);
}

function pressKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.remove("pressed");
        void el.offsetWidth;
        el.classList.add("pressed");

        if (el.__pressTimeoutId) {
            clearTimeout(el.__pressTimeoutId);
        }

        el.__pressTimeoutId = setTimeout(() => {
            el.classList.remove("pressed");
            el.__pressTimeoutId = null;
        }, keyPressAnimationDurationMs);
    });
}

function releaseKey(character) {
    getKeyElements(character).forEach(el => {
        el.classList.remove("pressed");

        if (el.__pressTimeoutId) {
            clearTimeout(el.__pressTimeoutId);
            el.__pressTimeoutId = null;
        }
    });
}

function resolvePressedVirtualKeys(event) {
    if (!event || event.defaultPrevented || event.isComposing) {
        return [];
    }

    const translatedCharacter = translatePhysicalKey(event);

    if (translatedCharacter) {
        const mapping = thaiKeyboardMap[translatedCharacter];
        if (mapping) {
            const pressedKeys = [mapping.key];
            if (mapping.shift) {
                pressedKeys.push("Shift");
            }
            return pressedKeys;
        }
    }

    // Nicht-Text-Sondertasten bleiben direkt abgebildet.
    if (event.key === "Shift") return ["Shift"];
    if (event.key === "Backspace") return ["Backspace"];
    if (event.key === "Enter") return ["Enter"];

    return [];
}


function zeigePhase() {
    clearHighlight();
    clearTastenhilfeTimer();

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
 
    syncKeyboardHighlight();
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

const weiterButton = document.getElementById("weiterButton");

const activityStatusElement = document.getElementById("activityStatus");
const afkOverlay = document.getElementById("afkOverlay");
const afkCountdown = document.getElementById("afkCountdown");
const resumeAfkButton = document.getElementById("resumeAfkButton");

const completeInfo = document.querySelector(".complete-info");
const completeStats = document.querySelector(".complete-stats");
const comparisonSection = document.querySelector(".comparison-section");

ActivityManager.onStatusChange = updateActivityStatus;
ActivityManager.onAfkDialogOpen = showAfkOverlay;
ActivityManager.onAfkDialogClose = hideAfkOverlay;
ActivityManager.onAutoAbort = handleAutoAbort;

updateActivityStatus();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
}

function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateActivityStatus() {
    if (!activityStatusElement) {
        return;
    }

    activityStatusElement.textContent = ActivityManager.getCurrentStatusLabel();
    activityStatusElement.classList.toggle("afk", ActivityManager.isAFK);
}

let afkCountdownInterval = null;

function updateAfkCountdown() {
    if (!afkCountdown) {
        return;
    }

    afkCountdown.textContent = formatCountdown(
        ActivityManager.getAfkRemainingMs()
    );
}

function showAfkOverlay() {
    if (!afkOverlay) {
        return;
    }

    updateAfkCountdown();
    afkOverlay.classList.add("active");

    clearInterval(afkCountdownInterval);
    afkCountdownInterval = setInterval(updateAfkCountdown, 1000);
}

function hideAfkOverlay() {
    if (!afkOverlay) {
        return;
    }

    afkOverlay.classList.remove("active");
    clearInterval(afkCountdownInterval);
    afkCountdownInterval = null;
}

function handleAutoAbort() {
    hideAfkOverlay();
    ActivityManager.stopPlaying();
    popup.classList.remove("active");
    window.location.href = "index.html";
}

function animateNumber(element, start, end, duration = 1200, formatter = value => String(Math.round(value))) {
    return new Promise(resolve => {
        const startTime = performance.now();

        const step = currentTime => {
            const progress = Math.min(1, (currentTime - startTime) / duration);
            const value = start + (end - start) * progress;
            element.textContent = formatter(value);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(step);
    });
}

function animateTimeValue(element, startSeconds, endSeconds, duration = 1200) {
    return animateNumber(element, startSeconds, endSeconds, duration, value => formatTime(Math.round(value)));
}

function waitForTransition(element, propertyName = "opacity", timeout = 600) {
    return new Promise(resolve => {
        let finished = false;

        const cleanup = () => {
            if (finished) {
                return;
            }
            finished = true;
            element.removeEventListener("transitionend", onTransitionEnd);
            clearTimeout(timeoutId);
            resolve();
        };

        const onTransitionEnd = event => {
            if (event.target === element && event.propertyName === propertyName) {
                cleanup();
            }
        };

        const timeoutId = setTimeout(cleanup, timeout);
        element.addEventListener("transitionend", onTransitionEnd);
    });
}

function hideCompletionSections() {
    [completeInfo, completeStats, comparisonSection].forEach(el => {
        if (!el) return;
        el.classList.remove("animated-visible");
    });
}

function revealElement(element) {
    if (!element) {
        return Promise.resolve();
    }

    return new Promise(resolve => {
        requestAnimationFrame(() => {
            element.classList.add("animated-visible");
            waitForTransition(element).then(resolve);
        });
    });
}


const questTitel = document.getElementById("questTitel");
const deutscherText = document.getElementById("deutscherText");
const thaiText = document.getElementById("thaiText");
const storyText = document.getElementById("storyText");
const deutschAktuell =
    document.getElementById("deutschAktuell");
const settingsGermanToggle =
    document.getElementById("settingsGermanToggle");

    const deutschTitel =
    document.getElementById("deutschTitel");

let germanVisible = true;

function aktualisiereGermanToggle() {

    if (!settingsGermanToggle) {
        return;
    }

    settingsGermanToggle.checked = germanVisible;

    settingsGermanToggle.disabled =
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
        syncKeyboardHighlight();
 
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
        syncKeyboardHighlight();
 
    }
 
    // Zeile fertig?
    if (position >= text.length) {
 
        aktuelleZeile++;
 
        // Quest fertig?
        if (aktuelleZeile >= thaiZeilen.length) {
 
            endZeit = Date.now();
 
            if (mode === "learning") {
 
                ActivityManager.stopPlaying();
                document
                    .getElementById("examOverlay")
                    .classList.add("active");
 
                syncKeyboardHighlight();
                return;
 
            }
 
            beendePruefung();
 
            return;
 
        }
 
        naechsteZeile();
  
    }
 
}

function beendePruefung() {

    const zeit = ActivityManager.getActiveTimeMs();
    const sekunden = Math.floor(zeit / 1000);

    const minuten = Math.floor(sekunden / 60);
    const restSekunden = sekunden % 60;

    const minutenGesamt = zeit / 60000;

    const cpm = (gesamtZeichen / minutenGesamt).toFixed(1);

    const accuracy =
        (
            (gesamtZeichen / (gesamtZeichen + fehler)) * 100
        ).toFixed(1);

    ActivityManager.stopPlaying();

    const zeitAnzeige =
        String(minuten).padStart(2, "0") +
        ":" +
        String(restSekunden).padStart(2, "0");

    zeitAnzeigeElement.textContent = zeitAnzeige;
    wpmAnzeigeElement.textContent = cpm;
    accuracyAnzeigeElement.textContent = accuracy + "%";

    popupKapitel.textContent = daten[aktuelleQuest].titel;

    const completeQuestImage =
        document.getElementById("completeQuestImage");

    if (daten[aktuelleQuest].bild) {
        completeQuestImage.src =
            "../assets/quest/" +
            daten[aktuelleQuest].bild +
            ".png";
    }

    popupZeit.textContent = "00:00";
    popupCPM.textContent = "0";
    popupAccuracy.textContent = "0%";

    const newRecords = completeQuest(
        questStatsId,
        sekunden,
        Number(cpm),
        Number(accuracy),
        gesamtZeichen,
        daten[aktuelleQuest].version ?? 1
    );

    showRecordSummary(newRecords);
    hideCompletionSections();
    popup.classList.add("active");

    const completionAnimation = async () => {
        await revealElement(completeInfo);
        await revealElement(completeStats);

        await Promise.all([
            animateTimeValue(popupZeit, 0, sekunden, 1300),
            animateNumber(popupCPM, 0, Number(cpm), 1300, value => value.toFixed(1)),
            animateNumber(popupAccuracy, 0, Number(accuracy), 1300, value => `${value.toFixed(1)}%`),
        ]);

        await revealElement(comparisonSection);
        await animateRecordSummary(newRecords);
    };

    completionAnimation();

}

function startePruefung() {
 
    if (startZeit !== null) {
 
        return;
 
    }
 
    startZeit = Date.now();
 
    ActivityManager.startPlaying();
 
    aktualisiereGermanToggle();
 
}

function bereitePruefungVor() {

    ActivityManager.stopPlaying();

    startZeit = null;
    endZeit = null;

    fehler = 0;
    gesamtZeichen = 0;

    position = 0;
    aktuelleZeile = 0;

    germanVisible = false;

    text = thaiZeilen[0];

    eingabe.value = "";

    zeigeZeilen();
   syncKeyboardHighlight();
 
    eingabe.focus();
 
    aktualisiereGermanToggle();
}


eingabe.addEventListener("input", function () {

    console.log("INPUT", eingabe.value);

    const eingegeben = keyboardTutorModeEnabled
        ? pendingTutorInput
        : eingabe.value;
    pendingTutorInput = null;

    // Noch nichts eingegeben
    if (!eingegeben || eingegeben.length === 0) {
        return;
    }

    // Gesamtspielzeit erfassen in beiden Modi
    if (ActivityManager.status !== "PLAYING") {
        ActivityManager.startPlaying();
    }

    ActivityManager.registerActivity();

    if (mode === "exam") {
        // Erster Tastendruck startet nur den Questmodus
        startePruefung();
    }

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

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const settingsTastenhilfeToggle = document.getElementById("settingsTastenhilfeToggle");
const settingsDelaySlider = document.getElementById("settingsDelaySlider");
const settingsDelayValue = document.getElementById("settingsDelayValue");
const leaveQuestButton = document.getElementById("leaveQuestButton");
const leaveQuestOverlay = document.getElementById("leaveQuestOverlay");
const cancelLeaveQuestButton = document.getElementById("cancelLeaveQuestButton");
const confirmLeaveQuestButton = document.getElementById("confirmLeaveQuestButton");

// Verhindert, dass Tastatureingaben/Klicks im geöffneten Einstellungsmenü
// (z.B. Leertaste zum Umschalten eines Toggles) versehentlich als
// Spieleingabe in #eingabe landen oder ihr den Fokus entziehen.
let settingsPanelOpen = false;

// Gibt true zurück, solange irgendein Overlay (Einstellungsmenü oder
// Quest-verlassen-Bestätigung) sichtbar ist. Wird verwendet, um
// Tastatur-/Zeigereingaben währenddessen vom Spiel fernzuhalten.
function isEingabeGesperrt() {
    return (
        settingsPanelOpen ||
        Boolean(leaveQuestOverlay?.classList.contains("active"))
    );
}

function formatiereTastenhilfeSekunden(sekunden) {
    return sekunden === 1 ? "1 Sekunde" : `${sekunden} Sekunden`;
}

function aktualisiereTastenhilfeUI() {

    if (settingsTastenhilfeToggle) {
        settingsTastenhilfeToggle.checked = tastenhilfeEnabled;
    }

    if (settingsDelaySlider) {
        settingsDelaySlider.value = String(tastenhilfeVerzoegerungSekunden);
        settingsDelaySlider.disabled = !tastenhilfeEnabled;
    }

    if (settingsDelayValue) {
        settingsDelayValue.textContent =
            formatiereTastenhilfeSekunden(tastenhilfeVerzoegerungSekunden);
    }

}

function openSettingsPanel() {

    if (!settingsPanel) {
        return;
    }

    settingsPanelOpen = true;
    settingsPanel.classList.add("open");
    settingsBackdrop?.classList.add("active");
    settingsButton?.setAttribute("aria-expanded", "true");

    // Fokus vom Eingabefeld nehmen, damit Tastatureingaben nicht
    // ungefiltert (ohne Tutor-Übersetzung) im Spiel landen.
    eingabe.blur();

}

function closeSettingsPanel() {

    if (!settingsPanel) {
        return;
    }

    settingsPanelOpen = false;
    settingsPanel.classList.remove("open");
    settingsBackdrop?.classList.remove("active");
    settingsButton?.setAttribute("aria-expanded", "false");

    if (phase === "typing") {
        eingabe.focus();
    }

}

settingsButton?.addEventListener("mousedown", function (event) {
    event.preventDefault();
});

settingsButton?.addEventListener("click", function () {
    if (settingsPanelOpen) {
        closeSettingsPanel();
    } else {
        openSettingsPanel();
    }
});

settingsCloseButton?.addEventListener("click", closeSettingsPanel);
settingsBackdrop?.addEventListener("click", closeSettingsPanel);

settingsGermanToggle?.addEventListener("change", function () {

    germanVisible = settingsGermanToggle.checked;

    aktualisiereGermanToggle();

    zeigeZeilen();

});

settingsTastenhilfeToggle?.addEventListener("change", function () {

    tastenhilfeEnabled = settingsTastenhilfeToggle.checked;

    localStorage.setItem("tastenhilfeAktiviert", String(tastenhilfeEnabled));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

settingsDelaySlider?.addEventListener("input", function () {

    tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(settingsDelaySlider.value);

    localStorage.setItem("tastenhilfeVerzoegerung", String(tastenhilfeVerzoegerungSekunden));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

leaveQuestButton?.addEventListener("click", function () {
    closeSettingsPanel();
    leaveQuestOverlay?.classList.add("active");
    eingabe.blur();
});

cancelLeaveQuestButton?.addEventListener("click", function () {

    leaveQuestOverlay?.classList.remove("active");

    if (phase === "typing") {
        eingabe.focus();
    }

});

confirmLeaveQuestButton?.addEventListener("click", function () {

    ActivityManager.stopPlaying();

    leaveQuestOverlay?.classList.remove("active");

    window.location.href = "index.html";

});

weiterButton.addEventListener("click", function () {
 
    ActivityManager.stopPlaying();
 
    popup.classList.remove("active");
 
    window.location.href = "index.html";
 
});

resumeAfkButton?.addEventListener("click", function () {
    ActivityManager.registerActivity();
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
aktualisiereTastenhilfeUI();

zeigePhase();

zeigeZeilen();
syncKeyboardHighlight();


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

const timeDiff = records.newTime - bestTime;
const accuracyDiff = Number((records.newAccuracy - bestAccuracy).toFixed(1));

const timeColor = timeDiff < 0 ? "#2aa84a" : timeDiff > 0 ? "#cc4040" : "#f1e0a1";
const accuracyColor = accuracyDiff > 0 ? "#2aa84a" : accuracyDiff < 0 ? "#cc4040" : "#f1e0a1";


    // eine gemeinsame Tabelle. Die Berechnungen oberhalb werden weiterverwendet.
    container.innerHTML = `
        <div class="record-row">
            <div class="record-label">&#9201; ZEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong id="bestTimeValue">${formatTime(0)}</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong id="currentTimeValue">${formatTime(0)}</strong>
            </div>
            <div class="record-cell record-result" style="color:${timeColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong id="timeResultText" class="result-hidden"></strong>
            </div>
        </div>

        <div class="record-row">
            <div class="record-label">&#127919; GENAUIGKEIT</div>
            <div class="record-cell">
                <span class="record-heading">&#127942; Pers&ouml;nlicher Rekord</span>
                <strong id="bestAccuracyValue">0 %</strong>
            </div>
            <div class="record-cell">
                <span class="record-heading">&#9876; Aktueller Lauf</span>
                <strong id="currentAccuracyValue">0 %</strong>
            </div>
            <div class="record-cell record-result" style="color:${accuracyColor}">
                <span class="record-heading">&#10024; Ergebnis</span>
                <strong id="accuracyResultText" class="result-hidden"></strong>
            </div>
        </div>
    `;

    return {
        bestTime,
        bestAccuracy,
        timeDiff,
        accuracyDiff,
        timeColor,
        accuracyColor,
        records,
    };

}

function animateRecordSummary(records) {
    const bestTimeValue = document.getElementById("bestTimeValue");
    const currentTimeValue = document.getElementById("currentTimeValue");
    const bestAccuracyValue = document.getElementById("bestAccuracyValue");
    const currentAccuracyValue = document.getElementById("currentAccuracyValue");
    const timeResultText = document.getElementById("timeResultText");
    const accuracyResultText = document.getElementById("accuracyResultText");

    const bestTime = records.oldBestTime === null ? records.newTime : records.oldBestTime;
    const bestAccuracy = records.oldBestAccuracy === null ? records.newAccuracy : records.oldBestAccuracy;
    const timeDiff = records.newTime - bestTime;
    const accuracyDiff = Number((records.newAccuracy - bestAccuracy).toFixed(1));

    const animatePromises = [
        bestTimeValue ? animateTimeValue(bestTimeValue, 0, bestTime, 1200) : Promise.resolve(),
        currentTimeValue ? animateTimeValue(currentTimeValue, 0, records.newTime, 1200) : Promise.resolve(),
        bestAccuracyValue ? animateNumber(bestAccuracyValue, 0, bestAccuracy, 1200, value => `${value.toFixed(1)}%`) : Promise.resolve(),
        currentAccuracyValue ? animateNumber(currentAccuracyValue, 0, records.newAccuracy, 1200, value => `${value.toFixed(1)}%`) : Promise.resolve(),
    ];

    return Promise.all(animatePromises).then(() => {
        if (timeResultText) {
            timeResultText.textContent = timeDiff < 0
                ? `Neuer Rekord! (-${Math.abs(timeDiff)} Sek.)`
                : timeDiff > 0
                    ? `+${timeDiff} Sek.`
                    : "Gleich schnell";
            timeResultText.classList.remove("result-hidden");
            timeResultText.classList.add("result-visible");
        }

        if (accuracyResultText) {
            accuracyResultText.textContent = accuracyDiff > 0
                ? "Neuer Rekord!"
                : accuracyDiff < 0
                    ? `${accuracyDiff}%`
                    : "Unverändert";
            accuracyResultText.classList.remove("result-hidden");
            accuracyResultText.classList.add("result-visible");
        }
    });
}

document.addEventListener("keydown", function (event) {

   if (phase !== "typing") {
       return;
   }

   // Solange das Einstellungsmenü oder der Quest-verlassen-Dialog
   // offen ist, sollen Tastendrücke nicht als Spieleingabe in
   // #eingabe interpretiert werden.
   if (isEingabeGesperrt()) {
       return;
   }

      resolvePressedVirtualKeys(event).forEach(pressKey);


   if (!keyboardTutorModeEnabled) {
       return;
   }

   const translatedCharacter = translatePhysicalKey(event);

   if (!translatedCharacter) {
       return;
   }

   event.preventDefault();
   pendingTutorInput = translatedCharacter;
   eingabe.value = translatedCharacter;
   eingabe.dispatchEvent(new Event("input", { bubbles: true }));

});

document.addEventListener("pointerdown", function () {
 
    if (phase === "typing" && !isEingabeGesperrt()) {
 
        setTimeout(function () {
 
            eingabe.focus();
 
        }, 0);
 
    }
 
});

/* =========================================================
   MOBILE: Tap-to-Type für die virtuelle Thai-Tastatur
   ---------------------------------------------------------
   Auf Smartphones gibt es keine physische Tastatur - die
   virtuelle Tastatur war bisher rein visuell (Tutor-Highlight
   bei physischen Tastendrücken, siehe weiter oben). Diese
   Erweiterung macht die Tasten zusätzlich antippbar, ohne
   etwas an der physischen Tastatureingabe zu verändern.

   Die Zeichen werden über denselben Weg eingespeist wie im
   bestehenden Keyboard-Tutor-Modus (eingabe.value + "input"
   Event) - es entsteht also KEINE zweite/parallele Spiellogik.

   Aktiv nur auf Touch-Geräten (grobes Zeigegerät / kein Hover):
   Auf Desktop mit Maus bleibt ein Klick auf die Tastatur exakt
   folgenlos, wie es bisher schon der Fall war.
========================================================= */

const isTouchDevice =
    (typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: none), (pointer: coarse)").matches) ||
    navigator.maxTouchPoints > 0;

// Mobile Geräte haben keine physische Shift-Taste: ein Tap auf
// "Shift" aktiviert den Shift-Zustand für genau das nächste
// Zeichen (klassisches Mobile-Keyboard-Verhalten).
let virtualShiftActive = false;

function updateVirtualShiftVisual() {
    getKeyElements("Shift").forEach(el => {
        el.classList.toggle("virtual-shift-active", virtualShiftActive);
    });
}

function typeCharacterFromVirtualKey(character) {
    if (phase !== "typing" || !character) {
        return;
    }

    // Gleicher Einspeisungsweg wie der bestehende Tutor-Modus
    // (siehe keydown-Listener oben): funktioniert unabhängig
    // davon, ob der Tutor-Modus aktuell an- oder ausgeschaltet ist.
    pendingTutorInput = character;
    eingabe.value = character;
    eingabe.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleVirtualKeyTap(keyElement) {
    if (!keyElement || phase !== "typing") {
        return;
    }

    if (keyElement.classList.contains("key-shift")) {
        pressKey("Shift");
        virtualShiftActive = !virtualShiftActive;
        updateVirtualShiftVisual();
        return;
    }

    // Backspace/Enter haben in der bestehenden Eingabelogik keine
    // Funktion (Prüfung erfolgt Zeichen für Zeichen, siehe der
    // "input"-Listener von #eingabe weiter oben) - nur visuelles
    // Feedback, kein Verhalten wird hinzuerfunden.
    if (keyElement.classList.contains("key-action")) {
        pressKey(keyElement.getAttribute("data-key"));
        return;
    }

    const shiftCharacter = keyElement.getAttribute("data-shift-key");
    const character = virtualShiftActive && shiftCharacter
        ? shiftCharacter
        : keyElement.getAttribute("data-key");

    pressKey(character);
    typeCharacterFromVirtualKey(character);

    if (virtualShiftActive) {
        virtualShiftActive = false;
        updateVirtualShiftVisual();
    }
}

if (isTouchDevice && keyboardElement) {
    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        keyElement.addEventListener("click", function () {
            handleVirtualKeyTap(keyElement);
        });
    });
}
