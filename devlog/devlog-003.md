# Development Log #003

## Version 0.0.3 - Typing Engine Begins

### Heute entwickelt

- Typing Mode (`typing.html`) erstellt
- `typing.js` erstellt
- `quests.js` eingeführt
- Questdaten erfolgreich von der Engine getrennt
- Text wird automatisch aus `quests.js` geladen
- Thai-Text wird in einzelne Buchstaben zerlegt (`<span>`)
- Erster Buchstabe wird markiert
- Gelber Cursor springt bei richtiger Eingabe zum nächsten Buchstaben
- Erster funktionierender Buchstabenvergleich implementiert

## Bekannte Bugs

- Gespeicherte Questwerte wurden nach einem Umbau teilweise zurückgesetzt.
- Ursache noch unbekannt.
- Wird untersucht.
---

## Wichtige Erkenntnis des Tages

Heute wollten wir die Architektur von Language Grinding möglichst professionell gestalten.

Dabei haben wir begonnen, die komplette Engine für zukünftige Versionen zu planen.

Nach kurzer Zeit haben wir jedoch festgestellt, dass wir uns zu weit von unserem eigentlichen Ziel entfernt hatten.

Wir dachten bereits an:

- perfekte Architektur
- beliebig viele Quests
- Wiederverwendbarkeit
- Engine-Systeme

Obwohl die wichtigste Funktion der App noch gar nicht existierte:

**Thai schreiben.**

---

## Die Philipp-Regel

Aus dieser Erkenntnis entstand eine neue Grundregel für das gesamte Projekt.

> **Jedes neue Feature muss das echte Lernen sofort verbessern.**

Nicht:

"Brauchen wir das irgendwann?"

Sondern:

"Kann Philipp heute Abend dadurch besser Thai lernen?"

Falls die Antwort **Nein** lautet, wird das Feature verschoben.

Diese Regel wird ab heute die wichtigste Designentscheidung von Language Grinding.

---

## Neue Entwicklungsphilosophie

Language Grinding wird nicht um möglichst sauberen Code gebaut.

Language Grinding wird nicht um möglichst viele Features gebaut.

Language Grinding wird um echtes Lernen gebaut.

Der Mittelpunkt des Projekts ist immer der Lernende.

Alles andere dient nur diesem Ziel.

---

## Erste spielbare Mechanik

Heute entstand zum ersten Mal das Gefühl eines richtigen Spiels.

Die Engine erkennt bereits:

- den aktuellen Buchstaben
- die aktuelle Position
- richtige Eingaben

Der gelbe Cursor bewegt sich automatisch durch den Text.

Zum ersten Mal fühlt sich Language Grinding nicht mehr wie eine Website, sondern wie ein Lernspiel an.

---

## Bekannte Probleme

- Leerzeichen werden noch nicht korrekt behandelt.
- Thai-Tonzeichen bestehen aus mehreren Unicode-Zeichen und werden momentan noch nicht korrekt erkannt.
- Fehler werden noch nicht rot markiert.
- Timer, WPM und Accuracy folgen erst nach einer stabilen Eingabelogik.

---

## Nächstes Ziel

Den kompletten Schreibmodus fertigstellen.

Dabei stehen folgende Punkte im Mittelpunkt:

- Fehlererkennung
- Rote Markierung falscher Zeichen
- Unterstützung für Thai-Grapheme
- Timer
- Accuracy
- WPM

Erst wenn diese Mechanik vollständig funktioniert, werden weitere Features entwickelt.

## Meilenstein

Heute wurde die Thai-Eingabe verbessert.

Anstatt kombinierte Zeichen als einen Buchstaben zu behandeln, verarbeitet Language Grinding jeden Tastendruck einzeln.

Dadurch bleibt die Eingabelogik natürlich und entspricht dem echten Schreiben auf einer Thai-Tastatur.

Die Darstellung markiert dennoch den gesamten Buchstaben.

Dadurch fühlt sich das Schreiben natürlicher an als bei keybr.

**Erstes Feature, das sich beim Lernen besser anfühlt als keybr.**