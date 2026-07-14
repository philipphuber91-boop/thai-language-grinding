const textAnzeige = document.getElementById("textAnzeige");
const eingabe = document.getElementById("eingabe");

const aktuelleQuest = localStorage.getItem("aktuelleQuest");

const text = quests[aktuelleQuest].thai;

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

    const gedrueckterBuchstabe = eingabe.value[position];

    const erwarteterBuchstabe = text[position];

    console.log(gedrueckterBuchstabe);  
    console.log(erwarteterBuchstabe);
    if (gedrueckterBuchstabe === erwarteterBuchstabe) {

    console.log("Richtig!");
    
    buchstaben[position].style.backgroundColor = "";
    
    position++;
    
    buchstaben[position].style.backgroundColor = "yellow";
}

});
