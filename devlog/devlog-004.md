Development Log #004
Version 0.0.4 - First Playable Quest
Heute entwickelt
Timer integriert
Buchstaben pro Minute (CPM) integriert
Genauigkeit (%) integriert
Quest endet automatisch nach dem letzten Zeichen
Eigenes Quest Complete-Fenster entwickelt
Anzeige von:
Questtitel
Zeit
CPM
Genauigkeit
Rückkehr zur Weltkarte über den Weiter-Button
Automatisches Speichern von:
Bestzeit
Bester Genauigkeit
Anzahl der Versuche
Questbezogenes Speichersystem vorbereitet (quest1_bestZeit, quest1_besteAccuracy, ...)
Wichtige Erkenntnis des Tages

Heute wurde klar, dass Language Grinding keine Sammlung einzelner HTML-Seiten werden soll.

Die ursprüngliche Struktur

quest1.html
quest2.html
quest3.html
quest4.html

wird Schritt für Schritt durch eine zentrale Quest-Engine ersetzt.

Alle Quests sollen künftig über dieselbe Spielseite geladen werden.

Beginn der Engine-Migration

Die erste Version von typing.html übernimmt nun bereits Teile von quest1.html.

Der neue Questablauf entsteht:

📜 Auftrag

↓

📖 Deutscher Text

↓

⌨️ Thai Typing

↓

🏆 Quest Complete

↓

🌍 Weltkarte

Damit wurde der Grundstein gelegt, künftig alle Quests über eine einzige Engine abzuspielen.

Die Philipp-Regel bestätigt sich erneut

Auch heute wurde deutlich, dass kleine, abgeschlossene Schritte deutlich effektiver sind als große Umbauten.

Anstatt sofort die komplette Engine umzubauen, wurde zuerst eine vollständig spielbare Quest entwickelt.

Erst danach beginnt die Migration der alten Quests.

Neue Entwicklungsphilosophie

Quests sollen künftig keine eigenen HTML-Seiten mehr sein.

Neue Quests bestehen später nur noch aus einem neuen Eintrag in quests.js.

Die Engine übernimmt automatisch:

Auftrag
Deutschen Text
Thai-Text
Typing Mode
Quest Complete
Statistiken

Dadurch wird das Hinzufügen neuer Quests auf wenige Zeilen reduziert.

Erste vollständige Quest

Zum ersten Mal existiert ein kompletter Gameplay-Loop.

Der Spieler erlebt nun den gesamten Ablauf:

Auftrag lesen
Deutschen Text lesen
Thai schreiben
Quest abschließen
Statistik ansehen
Zur Weltkarte zurückkehren

Language Grinding fühlt sich damit erstmals wie ein vollständiges Lernspiel an.

Bekannte Probleme
index.html verwendet aktuell noch die alten quest1.html–quest4.html.
Die Engine-Migration ist begonnen, aber noch nicht abgeschlossen.
quest1.html und script1.js werden erst entfernt, sobald die neue Engine Quest 1 vollständig ersetzt.
Nächstes Ziel

Die Engine-Migration abschließen.

Dabei stehen folgende Punkte im Mittelpunkt:

Quest 1 vollständig in typing.html integrieren
index.html auf die neue Engine umstellen
quest1.html und script1.js entfernen
Anschließend Quest 2–4 auf die neue Engine migrieren