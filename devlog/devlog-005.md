Development Log #005
Version 0.0.5 - Unified Quest Engine
Heute entwickelt
Alle Quests auf die neue Engine umgestellt
quest1.html bis quest4.html vollständig ersetzt
script1.js bis script4.js entfernt
Alle Questdaten zentral in quests.js gespeichert
Eine einzige Typing-Engine für alle Quests
Navigation über engine.js
Quest Complete Screen überarbeitet
Statistikspeicherung funktioniert für alle Quests
Rückkehr zur Weltkarte integriert
Aufräumarbeiten
Alte Quest-HTML-Dateien gelöscht
Alte Script-Dateien gelöscht
Projektstruktur deutlich vereinfacht
Keine doppelte Questlogik mehr vorhanden
Neue Projektstruktur
Language Grinding

index.html
typing.html

engine.js
typing.js
quests.js

style.css
Meilenstein

Heute wurde aus vier einzelnen Webseiten eine einzige Quest Engine.

Neue Quests benötigen ab sofort keine eigene HTML-Datei und kein eigenes JavaScript mehr.

Eine neue Quest besteht jetzt nur noch aus einem neuen Eintrag in quests.js.

Wichtige Erkenntnis des Tages

Während des Umbaus wurde deutlich, dass zu viele gleichzeitige Architekturänderungen schnell unnötige Komplexität erzeugen.

Ab heute gilt deshalb:

Erst die Engine fertigstellen, danach optimieren.

Neue Features werden erst entwickelt, wenn das Fundament stabil ist.

Nächstes Ziel
WoW-inspiriertes Questlog
XP- und Levelsystem
Quest-Freischaltungen
Statistik auf der Weltkarte
Erste RPG-Elemente
Meilenstein

Version 0.0.5

🏆 Unified Quest Engine abgeschlossen

Language Grinding besitzt jetzt eine einzige Engine für sämtliche Quests.