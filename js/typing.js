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

// Die Übersetzung physischer Tasten bleibt für Desktop und die
// mobile Spiel-Tastatur aktiv. Der mobile Systemtastatur-Modus
// verarbeitet stattdessen die nativen input-Events direkt.
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
const TASTENHILFE_MIN_SEKUNDEN = 0;
const TASTENHILFE_MAX_SEKUNDEN = 5;
const TASTENHILFE_STANDARD_SEKUNDEN = 2;

function clampTastenhilfeSekunden(value, minSekunden = TASTENHILFE_MIN_SEKUNDEN) {
    const zahl = Number(value);
    if (!Number.isFinite(zahl)) {
        return TASTENHILFE_STANDARD_SEKUNDEN;
    }
    return Math.min(
        TASTENHILFE_MAX_SEKUNDEN,
        Math.max(minSekunden, Math.round(zahl))
    );
}

let gameTastenhilfeEnabled =
    localStorage.getItem("tastenhilfeAktiviert") !== "false";
let tastenhilfeEnabled = gameTastenhilfeEnabled;

const MOBILE_INPUT_METHOD_KEY = "mobileInputMethod";
let mobileInputMethod =
    localStorage.getItem(MOBILE_INPUT_METHOD_KEY) === "system"
        ? "system"
        : "game";

let tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(
    localStorage.getItem("tastenhilfeVerzoegerung") ?? TASTENHILFE_STANDARD_SEKUNDEN,
    TASTENHILFE_MIN_SEKUNDEN
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

    if (verzoegerungMs <= 0) {
        applyKeyboardHighlight(expectedCharacter);
        return;
    }

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
 
        focusEingabeWithoutScroll();
 
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
const learningContainer =
    document.getElementById("learningContainer");
const typingFenster =
    document.getElementById("typingFenster");

    const deutschTitel =
    document.getElementById("deutschTitel");

let germanVisible = true;

function aktualisiereGermanToggle() {

    if (!settingsGermanToggle) {
        return;
    }

    settingsGermanToggle.checked = germanVisible;

    settingsGermanToggle.disabled =
        startZeit !== null && !isMobileViewport();

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

// --- Quest-Infoleiste (rein optische Anzeige, siehe html/typing.html) ---
// Diese Elemente spiegeln nur den bereits vorhandenen Spielzustand
// (gesamtZeichen, thaiZeilen) und greifen an keiner Stelle in die
// Eingabelogik oder Wertung ein.
const typingQuestBadgeImage = document.getElementById("typingQuestBadgeImage");
const typingQuestTitel = document.getElementById("typingQuestTitel");
const typingQuestKapitel = document.getElementById("typingQuestKapitel");
const typingQuestSchwierigkeit = document.getElementById("typingQuestSchwierigkeit");
const typingProgressFill = document.getElementById("typingProgressFill");
const typingProgressText = document.getElementById("typingProgressText");

const gesamtZeichenQuest = thaiZeilen.reduce(
    (summe, zeile) => summe + zeile.length,
    0
);

function aktualisiereQuestInfoleiste() {

    if (typingQuestTitel) {
        typingQuestTitel.textContent = daten[aktuelleQuest].titel;
    }

    if (typingQuestKapitel) {
        typingQuestKapitel.textContent = daten[aktuelleQuest].kapitel || "";
    }

    if (typingQuestSchwierigkeit) {
        typingQuestSchwierigkeit.textContent = daten[aktuelleQuest].schwierigkeit || "";
    }

    if (typingQuestBadgeImage && daten[aktuelleQuest].bild) {
        typingQuestBadgeImage.src = "../assets/quest/" + daten[aktuelleQuest].bild + ".png";
        typingQuestBadgeImage.alt = daten[aktuelleQuest].titel || "";
    }

}

function aktualisiereQuestFortschrittUI() {

    const prozent = gesamtZeichenQuest > 0
        ? Math.min(100, Math.round((gesamtZeichen / gesamtZeichenQuest) * 100))
        : 0;

    if (typingProgressFill) {
        typingProgressFill.style.width = prozent + "%";
    }

    if (typingProgressText) {
        typingProgressText.textContent =
            gesamtZeichen + " / " + gesamtZeichenQuest + " Zeichen (" + prozent + "%)";
        typingProgressText.dataset.mobileText =
            gesamtZeichen + " / " + gesamtZeichenQuest;
    }

}

aktualisiereQuestInfoleiste();
aktualisiereQuestFortschrittUI();

function aktualisiereDeutsch() {

    deutschTitel.style.display =
        germanVisible ? "block" : "none";
    learningContainer?.classList.toggle("is-hidden", !germanVisible);
    typingFenster?.classList.toggle("german-hidden", !germanVisible);

    deutschAktuell.textContent =
        germanVisible
            ? deutschZeilen[aktuelleZeile] || ""
            : "";

}

// Thailändische Ton- und Vokalzeichen (nicht abstandshaltende
// Kombinationszeichen) verbinden sich optisch mit dem vorherigen Zeichen.
// Landet die aktuelle Tippposition genau auf so einem Zeichen, darf es nicht
// allein in der farbig hervorgehobenen "aktuell"-Box stehen: ohne sein
// Basiszeichen im selben Textlauf kann der Browser es nicht korrekt
// platzieren und zeigt stattdessen ein abgetrenntes, kaputt wirkendes
// Kästchen an. Siehe zeigeZeilen().
const THAI_COMBINING_MARKS = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;

function istThailaendischesKombinationszeichen(zeichen) {
    return !!zeichen && THAI_COMBINING_MARKS.test(zeichen);
}

function zeigeZeilen() {

    aktualisiereDeutsch();

    let geschrieben, aktuell, rest;

    if (isMobileViewport()) {
        // Auf Mobilgeräten: ursprüngliche pro-Zeichen-Placeholder-Mechanik
        geschrieben = text.substring(0, position);
        aktuell = text[position] || "";
        rest = text.substring(position + 1);
    } else {
        // Basiszeichen mit in die Hervorhebung aufnehmen, falls das aktuelle
        // Zeichen selbst ein Kombinationszeichen ist.
        let hervorhebungStart = position;
        while (
            hervorhebungStart > 0 &&
            istThailaendischesKombinationszeichen(text[hervorhebungStart])
        ) {
            hervorhebungStart--;
        }

        geschrieben =
            text.substring(0, hervorhebungStart);

        aktuell =
            text.substring(hervorhebungStart, position + 1);

        rest =
            text.substring(position + 1);
    }

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

    zeile2.textContent = isMobileViewport()
        ? ""
        : (thaiZeilen[aktuelleZeile + 1] || "");

}


function naechsteZeile() {
    if (isMobileViewport()) {
        zeile1.classList.add("mobile-sentence-exit");

        setTimeout(function () {
            text = thaiZeilen[aktuelleZeile];
            position = 0;

            zeigeZeilen();
            syncKeyboardHighlight();

            zeile1.classList.remove("mobile-sentence-exit");
            zeile1.classList.add("mobile-sentence-enter");

            requestAnimationFrame(function () {
                zeile1.classList.add("mobile-sentence-enter-active");
            });

            setTimeout(function () {
                zeile1.classList.remove("mobile-sentence-enter");
                zeile1.classList.remove("mobile-sentence-enter-active");
            }, 180);
        }, 150);
        return;
    }

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

    let geschrieben, aktuell, rest;

    if (isMobileViewport()) {
        // Auf Mobilgeräten: ursprüngliche pro-Zeichen-Placeholder-Mechanik
        geschrieben = text.substring(0, position);
        aktuell = text[position] || "";
        rest = text.substring(position + 1);
    } else {
        // Ensure combining marks are grouped with their base character when
        // showing the 'fehler' highlight - otherwise a detached combining mark
        // can render as a broken glyph.
        let hervorhebungStart = position;
        while (
            hervorhebungStart > 0 &&
            istThailaendischesKombinationszeichen(text[hervorhebungStart])
        ) {
            hervorhebungStart--;
        }

        geschrieben =
            text.substring(0, hervorhebungStart);

        aktuell =
            text.substring(hervorhebungStart, position + 1) || "";

        rest =
            text.substring(position + 1);
    }

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

    aktualisiereQuestFortschrittUI();
 
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

    aktualisiereQuestFortschrittUI();

    position = 0;
    aktuelleZeile = 0;

    germanVisible = false;

    text = thaiZeilen[0];

    eingabe.value = "";

    zeigeZeilen();
   syncKeyboardHighlight();
 
    focusEingabeWithoutScroll();
 
    aktualisiereGermanToggle();
}


eingabe.addEventListener("input", function () {

    console.log("INPUT", eingabe.value);

    const eingegeben = keyboardTutorModeEnabled && !isSystemKeyboardMode()
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

focusEingabeWithoutScroll();

});

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const settingsTastenhilfeToggle = document.getElementById("settingsTastenhilfeToggle");
const settingsDelaySlider = document.getElementById("settingsDelaySlider");
const settingsDelayValue = document.getElementById("settingsDelayValue");
const mobileBackButton = document.getElementById("mobileBackButton");
const mobileInputGame = document.getElementById("mobileInputGame");
const mobileInputSystem = document.getElementById("mobileInputSystem");
const settingsTutorRow = document.getElementById("settingsTutorRow");
const settingsDelayRow = settingsDelaySlider?.closest(".settings-row");
const systemKeyboardTutorHint = document.getElementById("systemKeyboardTutorHint");
const leaveQuestButton = document.getElementById("leaveQuestButton");
const questBarLeaveButton = document.getElementById("questBarLeaveButton");
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
    if (sekunden === 0) {
        return "0 Sekunden (dauerhaft)";
    }
    return sekunden === 1 ? "1 Sekunde" : `${sekunden} Sekunden`;
}

function isMobileViewport() {
    return typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 900px)").matches;
}

function isSystemKeyboardMode() {
    return isMobileViewport() && mobileInputMethod === "system";
}

function focusEingabeWithoutScroll() {
    if (!eingabe) {
        return;
    }

    try {
        eingabe.focus({ preventScroll: true });
    } catch (_error) {
        eingabe.focus();
    }

    if (isMobileViewport()) {
        window.scrollTo(0, 0);
    }
}

function updateMobileViewportHeightVar() {
    if (!isMobileViewport()) {
        return;
    }

    // Nur im System-Tastatur-Modus wird wirklich eine per JS berechnete Höhe
    // gebraucht (damit Platz für die native Tastatur bleibt). Im normalen
    // Spiel-Modus (eigene virtuelle Tastatur) sorgt das Fixieren auf einen
    // px-Wert dafür, dass die Seite kurz nach Tippbeginn "springt", sobald
    // der Browser seine Adressleiste einklappt und visualViewport.height
    // dadurch wächst. Dort reicht das native, sich weich anpassende 100dvh
    // (Fallback unten in der CSS-Variable) völlig aus.
    if (!isSystemKeyboardMode()) {
        document.documentElement.style.removeProperty("--mobile-vh");
        return;
    }

    const viewportHeight = window.visualViewport
        ? Math.round(window.visualViewport.height)
        : window.innerHeight;

    document.documentElement.style.setProperty(
        "--mobile-vh",
        `${viewportHeight}px`
    );
}

function enforceSystemKeyboardNoScroll() {
    if (!isSystemKeyboardMode()) {
        return;
    }

    window.scrollTo(0, 0);
}

function applyMobileKeyboardStructure() {
    if (!keyboardElement) {
        return;
    }

    const row1 = keyboardElement.querySelector(".row-1");
    const row3 = keyboardElement.querySelector(".row-3");
    const row4 = keyboardElement.querySelector(".row-4");
    const row5 = keyboardElement.querySelector(".row-5");

    if (!row1 || !row3 || !row4 || !row5) {
        return;
    }

    const backspaceKey = keyboardElement.querySelector(".key-backspace");
    const enterKey = keyboardElement.querySelector(".key-enter");
    const shiftKeys = keyboardElement.querySelectorAll(".key-shift");
    const rightShiftKey = shiftKeys.length > 1 ? shiftKeys[1] : null;

    if (isMobileViewport()) {
        if (rightShiftKey) {
            rightShiftKey.classList.add("mobile-secondary-shift");
        }

        if (backspaceKey && backspaceKey.parentElement !== row4) {
            row4.appendChild(backspaceKey);
        }

        if (enterKey && enterKey.parentElement !== row5) {
            row5.appendChild(enterKey);
        }

        return;
    }

    if (rightShiftKey) {
        rightShiftKey.classList.remove("mobile-secondary-shift");
    }

    if (backspaceKey && backspaceKey.parentElement !== row1) {
        row1.appendChild(backspaceKey);
    }

    if (enterKey && enterKey.parentElement !== row3) {
        row3.appendChild(enterKey);
    }
}

function aktualisiereTastenhilfeUI() {

    const systemKeyboardActive = isSystemKeyboardMode();

    if (settingsTastenhilfeToggle) {
        settingsTastenhilfeToggle.checked = tastenhilfeEnabled;
        settingsTastenhilfeToggle.disabled = systemKeyboardActive;
    }

    if (settingsDelaySlider) {
        const minSekunden = TASTENHILFE_MIN_SEKUNDEN;
        if (tastenhilfeVerzoegerungSekunden < minSekunden) {
            tastenhilfeVerzoegerungSekunden = minSekunden;
            localStorage.setItem(
                "tastenhilfeVerzoegerung",
                String(tastenhilfeVerzoegerungSekunden)
            );
        }

        settingsDelaySlider.min = String(minSekunden);
        settingsDelaySlider.value = String(tastenhilfeVerzoegerungSekunden);
        settingsDelaySlider.disabled = !tastenhilfeEnabled || systemKeyboardActive;
    }

    if (settingsDelayValue) {
        settingsDelayValue.textContent =
            formatiereTastenhilfeSekunden(tastenhilfeVerzoegerungSekunden);
    }

    settingsTutorRow?.classList.toggle("disabled", systemKeyboardActive);
    settingsDelayRow?.classList.toggle("disabled", systemKeyboardActive);
    systemKeyboardTutorHint?.classList.toggle("visible", systemKeyboardActive);

}

function applyMobileInputMethod() {
    const systemKeyboardActive = isSystemKeyboardMode();

    document.body.classList.toggle("system-keyboard-mode", systemKeyboardActive);
    eingabe.readOnly = isMobileViewport() && !systemKeyboardActive;

    if (mobileInputGame) {
        mobileInputGame.checked = mobileInputMethod === "game";
    }

    if (mobileInputSystem) {
        mobileInputSystem.checked = mobileInputMethod === "system";
    }

    tastenhilfeEnabled = systemKeyboardActive
        ? false
        : gameTastenhilfeEnabled;

    applyMobileKeyboardStructure();
    updateMobileViewportHeightVar();
    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();
    renderVirtualKeyboardLabels();
}

function setMobileInputMethod(method) {
    mobileInputMethod = method === "system" ? "system" : "game";
    localStorage.setItem(MOBILE_INPUT_METHOD_KEY, mobileInputMethod);
    eingabe.blur();
    applyMobileInputMethod();
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
        focusEingabeWithoutScroll();
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
    gameTastenhilfeEnabled = tastenhilfeEnabled;

    localStorage.setItem("tastenhilfeAktiviert", String(tastenhilfeEnabled));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

mobileInputGame?.addEventListener("change", function () {
    if (mobileInputGame.checked) {
        setMobileInputMethod("game");
    }
});

mobileInputSystem?.addEventListener("change", function () {
    if (mobileInputSystem.checked) {
        setMobileInputMethod("system");
    }
});

settingsDelaySlider?.addEventListener("input", function () {

    tastenhilfeVerzoegerungSekunden = clampTastenhilfeSekunden(
        settingsDelaySlider.value,
        TASTENHILFE_MIN_SEKUNDEN
    );

    localStorage.setItem("tastenhilfeVerzoegerung", String(tastenhilfeVerzoegerungSekunden));

    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();

});

// Gemeinsame Logik für beide "Quest verlassen"-Einstiegspunkte
// (Einstellungsmenü und Quest-Infoleiste) - öffnet denselben
// Bestätigungsdialog, keine zweite Logik.
function oeffneLeaveQuestBestaetigung() {
    closeSettingsPanel();
    leaveQuestOverlay?.classList.add("active");
    eingabe.blur();
}

leaveQuestButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);
questBarLeaveButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);
mobileBackButton?.addEventListener("click", oeffneLeaveQuestBestaetigung);

cancelLeaveQuestButton?.addEventListener("click", function () {

    leaveQuestOverlay?.classList.remove("active");

    if (phase === "typing") {
        focusEingabeWithoutScroll();
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
    if (ActivityManager.isAFK) {
        ActivityManager.resumeFromAfk();
    } else {
        ActivityManager.registerActivity();
    }
    focusEingabeWithoutScroll();
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

applyMobileInputMethod();

if (questMode === "challenge") {

    phase = "typing";
    mode = "exam";
    germanVisible = false;

    focusEingabeWithoutScroll();

}
aktualisiereGermanToggle();

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

   if (isSystemKeyboardMode()) {
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
 
            focusEingabeWithoutScroll();
 
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
var virtualShiftActive = false;
var virtualKeyLabelsInitialized = false;

function initializeVirtualKeyboardLabels() {
    if (virtualKeyLabelsInitialized || !keyboardElement) {
        return;
    }

    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        if (keyElement.classList.contains("key-action")) {
            return;
        }

        keyElement.dataset.baseLabel = keyElement.textContent.trim();

        const shiftLabel = keyElement.getAttribute("data-shift-key");
        if (shiftLabel) {
            keyElement.dataset.shiftLabel = shiftLabel;
        }
    });

    virtualKeyLabelsInitialized = true;
}

function renderVirtualKeyboardLabels() {
    if (!keyboardElement || !isMobileViewport()) {
        return;
    }

    initializeVirtualKeyboardLabels();

    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        if (keyElement.classList.contains("key-action")) {
            return;
        }

        const shiftLabel =
            keyElement.dataset.shiftLabel ||
            keyElement.getAttribute("data-shift-key");

        const baseLabel =
            keyElement.dataset.baseLabel ||
            keyElement.getAttribute("data-key") ||
            "";

        keyElement.textContent =
            virtualShiftActive && shiftLabel
                ? shiftLabel
                : baseLabel;
    });
}

function updateVirtualShiftVisual() {
    getKeyElements("Shift").forEach(el => {
        el.classList.toggle("virtual-shift-active", virtualShiftActive);
    });
    renderVirtualKeyboardLabels();
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
    initializeVirtualKeyboardLabels();
    renderVirtualKeyboardLabels();
    // Use pointerdown instead of click for faster response on touch devices
    // and prevent the subsequent click event (no double-firing). Passive is
    // false so preventDefault can be used if needed by the platform.
    // Zoom on rapid double-taps is prevented at the browser level via the
    // viewport meta tag (maximum-scale=1, user-scalable=no, see typing.html)
    // and touch-action: manipulation (see mobile.css) - no artificial delay
    // or tap-suppression is needed here, so fast repeated taps of the same
    // key register immediately.
    keyboardElement.querySelectorAll(".key").forEach(keyElement => {
        keyElement.addEventListener("pointerdown", function (ev) {
            // Prevent default to avoid delayed click or focus-scroll behavior
            // on some mobile browsers. This only runs on touch-capable devices
            // because of the outer isTouchDevice check.
            if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
            handleVirtualKeyTap(keyElement);
        }, { passive: false });
    });
}

updateMobileViewportHeightVar();

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
        updateMobileViewportHeightVar();
        enforceSystemKeyboardNoScroll();
    });
    window.visualViewport.addEventListener("scroll", enforceSystemKeyboardNoScroll);
}

window.addEventListener("resize", function () {
    applyMobileKeyboardStructure();
    updateMobileViewportHeightVar();
    aktualisiereTastenhilfeUI();
    syncKeyboardHighlight();
});
eingabe.addEventListener("focus", function () {
    updateMobileViewportHeightVar();
    enforceSystemKeyboardNoScroll();
});
