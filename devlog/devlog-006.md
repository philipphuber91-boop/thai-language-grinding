# Devlog #006 - Das Fundament wird zum Spiel

**Datum:** 19.07.2026

---

## 🎯 Ziel des Tages

Heute stand nicht das Hinzufügen neuer Inhalte im Mittelpunkt, sondern die Weiterentwicklung der eigentlichen Spiel-Engine. Ziel war es, das Spaced-Repetition-System sauber abzuschließen und den Fortschritt des Spielers sinnvoll darzustellen.

---

## ✅ Spaced Repetition abgeschlossen

Das Wiederholungssystem ist jetzt nahezu vollständig implementiert.

### Funktionen

- Questfortschritt wird dauerhaft gespeichert.
- Wiederholungen erhöhen den Repetitionslevel nur, wenn die Quest tatsächlich fällig war.
- Mehrfaches Spielen derselben Quest am selben Tag bringt keinen zusätzlichen Fortschritt.
- Jede Quest besitzt nun:
  - Repetition Level
  - Last Review
  - Next Review
- Fällige Quests werden automatisch erkannt.

Damit besitzt jede Quest ihren eigenen Lernzyklus.

---

## ✅ Queststatus vereinfacht

Das ursprüngliche System war unnötig kompliziert.

Stattdessen gibt es jetzt nur noch drei sichtbare Zustände:

- ↻ Fällig
- ✓ Heute erledigt
- ⭐ Gemeistert

Normale Quests besitzen keinen Marker mehr.

Dadurch wirkt die Weltkarte deutlich ruhiger und übersichtlicher.

---

## ✅ Save-System weiter verbessert

Alte Spielstände werden automatisch erweitert.

Fehlende Daten (z. B. das Repetition-Objekt) werden beim Laden ergänzt und direkt wieder gespeichert.

Dadurch bleiben zukünftige Änderungen wesentlich einfacher.

---

## 💡 Entscheidung getroffen

Während der Entwicklung werden Spielstände bewusst als Testdaten behandelt.

Anstatt komplizierte Migrationen zu schreiben, wird es einfache Reset-Funktionen geben.

Beispielsweise:

- resetPlayer()
- resetQuestStats()
- resetAll()

Vor Version 1.0 dürfen Spielstände jederzeit gelöscht werden.

Die Architektur hat Priorität.

---

## 🎮 Neue Gameplay-Ideen

Heute entstand außerdem eine spannende Diskussion über das Spielgefühl.

Statt XP ausschließlich nach Abschluss einer Quest zu vergeben, soll der Spieler bereits während des Tippens ständig kleine Belohnungen erhalten.

Beispiele:

- +1 XP
- Combo x10
- Perfect Line
- New Speed Record
- New Accuracy Record
- Achievement Unlocked
- Level Up

Diese kleinen Retro-Popups sollen nach oben schweben und dem Spieler kontinuierlich Feedback geben.

Die Idee dahinter:

Nicht nur lernen.

Sondern das Gefühl erzeugen, tatsächlich ein Spiel zu spielen.

---

## 📈 Projektstatus

Das Fundament steht inzwischen erstaunlich stabil.

Bereits vorhanden:

- Player-System
- Save-System
- Quest-System
- Typing-System
- Spaced Repetition
- Queststatus
- Weltkarte

Der Fokus verschiebt sich langsam von der Engine hin zu sichtbaren Gameplay-Features.

---

## 🔜 Nächste Aufgabe

Morgen beginnt wahrscheinlich einer der spannendsten Entwicklungsschritte:

- XP-System
- Levelsystem
- Erste Achievements

Damit erhält Language Grinding zum ersten Mal eine echte RPG-Progression.

---

## 💬 Persönliche Notiz

Heute wurde klar, dass Language Grinding nicht einfach eine Sprachlern-App werden soll.

Die Vision entwickelt sich immer stärker in Richtung:

> **Ein RPG, in dem Sprache die eigentliche Spielmechanik ist.**

Je mehr Systeme entstehen, desto deutlicher wird, dass Motivation nicht durch Zwang entsteht, sondern durch gutes Game Design.

Das Fundament ist gelegt.

Jetzt beginnt der spaßige Teil.