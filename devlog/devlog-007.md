# Devlog 007 – Quest-System abgeschlossen & Content-Pipeline

**Datum:** 19.07.2026

---

## 🎉 Meilenstein erreicht

Heute wurde der wichtigste Meilenstein des Projekts erreicht:

> **Die Engine ist im Grunde fertig – ab jetzt besteht die Arbeit hauptsächlich aus Content.**

Nach mehreren Tagen Architekturarbeit können neue Quests jetzt in wenigen Minuten hinzugefügt werden.

---

## ✅ Quest-System

Das komplette Quest-System funktioniert inzwischen zuverlässig.

Vorhandene Features:

- Quest-Auswahl
- Freischaltungssystem
- XP-System
- Kapitel
- Schwierigkeitsstufen
- Statistik
- Storymodus
- Deutsch-Lesemodus
- Thai-Typing
- Fortschrittsspeicherung
- LocalStorage
- Wiederholungssystem (Spaced Repetition)

---

## 🔁 Spaced Repetition

Mehrere Fehler wurden behoben:

- falscher Start-Level
- falscher erster Wiederholungsabstand
- UTC-Datumsproblem
- lokale Datumsberechnung

Die Wiederholungen funktionieren jetzt wie geplant.

---

## 📖 Neue Quest-Pipeline

Es wurde eine neue Datenstruktur für `quests.js` entwickelt.

Jede Quest besteht nun aus:

- Titel
- Kapitel
- Schwierigkeit
- XP
- Wortanzahl
- Story
- deutsche Zeilen
- Thai-Zeilen

Neue Quests können dadurch innerhalb weniger Minuten integriert werden.

---

## 🏨 Neue Quests

Quest 2 wurde integriert.

**Im Hotel**

Der gesamte Dialog wurde:

- aus dem Lehrbuch übernommen
- PDF-Fehler korrigiert
- sauber formatiert
- direkt in die Queststruktur eingefügt

---

## 🎨 Neue Grafikstrategie

Nach mehreren Experimenten wurde entschieden, die Questbilder anders aufzubauen.

Statt komplette Bilder inklusive Rahmen generieren zu lassen, wird künftig getrennt:

### UI

- ein fester goldener Ring
- für alle Quests identisch

### Artwork

- nur das Motiv
- transparenter Hintergrund
- kein Ring
- keine Schilder
- keine Schrift

Dadurch entsteht ein deutlich einheitlicherer Stil und zukünftige Bilder lassen sich wesentlich einfacher erzeugen.

---

## 💡 Erkenntnis des Tages

Der größte Teil der Entwicklungsarbeit steckt inzwischen hinter dem Projekt.

Früher musste für jede neue Funktion programmiert werden.

Jetzt genügt meistens:

- Quest schreiben
- Bild erzeugen
- Datei hinzufügen

Die Engine erledigt den Rest automatisch.

---

## 🚀 Nächste Schritte

- Goldenen Quest-Ring finalisieren
- Workflow für transparente Quest-Artworks etablieren
- Weitere Kapitel integrieren
- WordMix-System entwickeln
- Zusätzliche Minispiele hinzufügen

---

## Projektstatus

**Engine:** ██████████ 95%

**Content:** █░░░░░░░░░ 5%

Das Projekt befindet sich nun in der Phase, in der hauptsächlich Inhalte produziert werden können.