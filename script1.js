//Bereiche
const auftrag = document.getElementById("auftrag");
const deutsch = document.getElementById("deutsch");
const thai = document.getElementById("thai");
const quest = document.getElementById("quest")
//Buttons
const startDeutsch = document.getElementById("startDeutsch");
const startThai = document.getElementById("startThai");
const questFertig = document.getElementById("questFertig");
const speichern = document.getElementById("speichern");
//Value
const zeit = document.getElementById("zeit");
const wpm = document.getElementById("wpm");
const genauigkeit = document.getElementById("genauigkeit");
//Auftrag - Deutsch
startDeutsch.addEventListener("click", function () {
    quest.style.display = "none";
    auftrag.style.display = "none";
    deutsch.style.display = "block";
});

//Auftrag - Thai
startThai.addEventListener("click", function () {
    quest.style.display = "none";
    deutsch.style.display = "none";
    thai.style.display = "block";

});

//Quest fertig
questFertig.addEventListener("click", function () {

    thai.style.display = "none";
    quest.style.display = "block";

});

speichern.addEventListener("click", function () {

    localStorage.setItem("quest1_zeit", zeit.value);
    localStorage.setItem("quest1_wpm", wpm.value);
    localStorage.setItem("quest1_genauigkeit", genauigkeit.value);

});

zeit.value = localStorage.getItem("quest1_zeit");
wpm.value = localStorage.getItem("quest1_wpm");
genauigkeit.value = localStorage.getItem("quest1_genauigkeit");

