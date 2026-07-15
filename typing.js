let startZeit = null;
let endZeit = null;
let fehler = 0;
const textAnzeige = document.getElementById("textAnzeige");
const eingabe = document.getElementById("eingabe");
const aktuelleQuest = localStorage.getItem("aktuelleQuest");
let versuche =
    Number(localStorage.getItem("quest" + aktuelleQuest + "_versuche")) || 0;

let bestZeit =
    localStorage.getItem("quest" + aktuelleQuest + "_bestZeit");

let besteAccuracy =
    Number(localStorage.getItem("quest" + aktuelleQuest + "_besteAccuracy")) || 0;

function istKombinationszeichen(zeichen) {

    return "่้๊๋ิีึืุูั็์ํ".includes(zeichen);

}


const zeitAnzeigeElement = document.getElementById("zeitAnzeige");
const wpmAnzeigeElement = document.getElementById("wpmAnzeige");
const accuracyAnzeigeElement = document.getElementById("accuracyAnzeige");
const popup = document.getElementById("questComplete");

const popupZeit = document.getElementById("popupZeit");

const popupCPM = document.getElementById("popupCPM");

const popupAccuracy = document.getElementById("popupAccuracy");

const popupTitel = document.getElementById("popupTitel");

const weiterButton = document.getElementById("weiterButton");


const questTitel = document.getElementById("questTitel");
const deutscherText = document.getElementById("deutscherText");
const storyText = document.getElementById("storyText");
const auftrag = document.getElementById("auftrag");
const deutsch = document.getElementById("deutsch");
const typingBereich =
    document.getElementById("typingBereich");

const startThaiButton =
    document.getElementById("startThai");

const startDeutschButton =
    document.getElementById("startDeutsch");
const text = quests[aktuelleQuest].thai;
questTitel.textContent = quests[aktuelleQuest].titel;

deutscherText.textContent = quests[aktuelleQuest].deutsch;

storyText.textContent =
"Lies zuerst den deutschen Text. Erst danach wird der Thai-Text freigeschaltet.";
console.log(quests[aktuelleQuest]);
console.log(quests[aktuelleQuest].deutsch);
console.log(deutscherText);

textAnzeige.innerHTML = "";

for (let i = 0; i < text.length; i++) {

    const span = document.createElement("span");

    span.textContent = text[i];

    textAnzeige.appendChild(span);

}


const buchstaben = textAnzeige.querySelectorAll("span");

buchstaben[0].style.backgroundColor = "yellow";

let position = 0;

eingabe.addEventListener("input", function () {


    
const gedrueckterBuchstabe = eingabe.value;
const erwarteterBuchstabe = text[position];

console.log(gedrueckterBuchstabe);
console.log(erwarteterBuchstabe);
    
if (gedrueckterBuchstabe === erwarteterBuchstabe) {

    if (startZeit === null) {

        startZeit = Date.now();

    }
    
  
    console.log("Richtig!");
    
    buchstaben[position].style.backgroundColor = "";
    

if (istKombinationszeichen(text[position])) {

    buchstaben[position - 1].style.backgroundColor = "";

}

position++;

if (position === text.length) {

    console.log("Quest geschafft!");

    endZeit = Date.now();

    const zeit = endZeit - startZeit;
    const sekunden = Math.floor(zeit / 1000);
    const minutenGesamt = zeit / 60000;
    const minuten = Math.floor(sekunden / 60);
    const restSekunden = sekunden % 60;
    const wpm = (position / minutenGesamt).toFixed(1);
    const accuracy =
(
    (position / (position + fehler)) * 100
).toFixed(1);

    const zeitAnzeige =
        String(minuten).padStart(2, "0") +
        ":" +
        String(restSekunden).padStart(2, "0");

    zeitAnzeigeElement.textContent = zeitAnzeige;

    wpmAnzeigeElement.textContent = wpm;

    accuracyAnzeigeElement.textContent = accuracy + "%";

    popupTitel.textContent = quests[aktuelleQuest].titel;

    popupZeit.textContent = zeitAnzeige;

    popupCPM.textContent = wpm;

    popupAccuracy.textContent = accuracy + "%";

    popup.style.display = "flex";

    versuche++;

    localStorage.setItem(
    "quest" + aktuelleQuest + "_versuche",
    versuche
);

    if (bestZeit === null || zeit < Number(bestZeit)) {

    bestZeit = zeit;

    localStorage.setItem(
    "quest" + aktuelleQuest + "_bestZeit",
    zeit
);

}
    if (accuracy > besteAccuracy) {

    besteAccuracy = accuracy;

    localStorage.setItem(
    "quest" + aktuelleQuest + "_besteAccuracy",
    accuracy
);

}

    return;


}

if (position < text.length) {

    buchstaben[position].style.backgroundColor = "yellow";

    if (istKombinationszeichen(text[position])) {

        buchstaben[position - 1].style.backgroundColor = "yellow";
        }

    }   

}
else {

    buchstaben[position].style.backgroundColor = "red";
    fehler++;

}

eingabe.value = "";

});

startDeutschButton.addEventListener("click", function () {

    auftrag.style.display = "none";

    deutsch.style.display = "block";

});

startThaiButton.addEventListener("click", function () {

    deutsch.style.display = "none";

    typingBereich.style.display = "block";

    eingabe.focus();

});

weiterButton.addEventListener("click", function () {

    window.location.href = "index.html";

});

storyText.textContent =
    quests[aktuelleQuest].story;