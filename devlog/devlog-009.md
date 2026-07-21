📜 Devlog #009 – Das Spiel nimmt Gestalt an

Datum: 18.07.2026

Heute war einer der wichtigsten Entwicklungstage seit Beginn von Thai Language Grinding. Zum ersten Mal fühlt sich das Projekt nicht mehr wie eine Sammlung einzelner Funktionen an, sondern wie ein richtiges Spiel mit unterschiedlichen Spielweisen und einem klaren Gameplay-Loop.

🎮 Zwei Spielmodi eingeführt

Der größte Meilenstein des Tages war die Einführung von zwei vollständig getrennten Spielmodi.

🏝 Kampagne

Der Kampagnenmodus bildet ab sofort das Herzstück des Spiels.

Der Spieler erlebt jede Quest in mehreren Schritten:

Auftrag → Geschichte lesen → Lernphase → Prüfung → Quest abgeschlossen

Während der Lernphase darf der deutsche Text zur Unterstützung angezeigt werden. Anschließend startet automatisch die Prüfung, in der nur noch der thailändische Text sichtbar ist. Erst diese Prüfung zählt für den eigentlichen Fortschritt.

Dadurch entsteht erstmals ein richtiger Lernprozess statt bloßem Abschreiben.

⚔ Challenge-Modus

Zusätzlich wurde heute der Challenge-Modus eingebaut.

Hier entfällt die komplette Lernphase.

Der Spieler springt sofort in die Prüfung und kann bereits gelernte Quests erneut spielen, um Rekorde zu verbessern oder seinen Lernstand zu testen.

Damit besitzt Thai Language Grinding nun zwei völlig unterschiedliche Arten zu spielen:

📖 Lernen neuer Inhalte in der Kampagne
🏆 Wiederholen und Perfektionieren im Challenge-Modus

Genau diese Trennung war schon lange geplant und macht das Spielgefühl deutlich motivierender.

⚙ Fundament für beide Modi geschaffen

Damit beide Spielmodi sauber funktionieren, musste ein großer Teil der internen Logik angepasst werden.

Unter anderem wurden:

Lern- und Prüfungsmodus klar voneinander getrennt
der komplette Questablauf neu strukturiert
die Steuerung der Spielphasen vereinfacht
die Anzeige des deutschen Hilfstests an den jeweiligen Modus angepasst
das Fundament geschaffen, auf dem zukünftige Achievements, Highscores und Statistiken aufbauen können

Obwohl vieles davon für den Spieler unsichtbar bleibt, war genau diese Arbeit notwendig, damit zukünftige Features deutlich einfacher umgesetzt werden können.

🎯 Gameplay-Motivation steigt enorm

Heute war vermutlich der erste Tag, an dem sich das Projekt wirklich wie ein Spiel angefühlt hat.

Statt einfach nur Texte abzuschreiben, entsteht jetzt ein klarer Ablauf:

Quest auswählen → Geschichte lesen → trainieren → Prüfung bestehen → Quest abschließen → nächste Quest freischalten.

Genau diese Progression war von Anfang an die Vision des Projekts.

🐛 Der Endgegner des Tages

Eigentlich war der Arbeitstag damit bereits erfolgreich beendet.

...eigentlich.

Dann fiel plötzlich auf, dass nach jedem Mausklick das Tippen nicht mehr funktionierte.

Es folgte eine kleine Debugging-Odyssee:

HTML überprüft
CSS untersucht
Event-Listener analysiert
Fokuszustände protokolliert
Eingabelogik zerlegt
mehrere Refactorings ausprobiert
zwischendurch versehentlich die HTML-Datei beschädigt
alte Versionen aus der Timeline wiederhergestellt
erneut getestet
wieder verworfen

Am Ende stellte sich heraus:

Nicht die Eingabelogik war fehlerhaft.

Nicht die Event-Listener.

Nicht das Rendering.

Der Browser verlor schlicht den Fokus auf das versteckte Eingabefeld.

Nachdem diese Ursache eindeutig nachgewiesen werden konnte, funktionierte das gesamte Typing-System wieder wie vorgesehen.

📊 Projektstatus

Nach dem heutigen Tag verfügt Thai Language Grinding nun über:

✅ Kampagnenmodus
✅ Challenge-Modus
✅ Lernphase
✅ Prüfungsphase
✅ Quest-Abschluss
✅ Deutsche Lernhilfe
✅ Umschaltung zwischen Lernen und Prüfung
✅ stabiles Typing-System
✅ Fundament für zukünftige Achievements und Rekorde
🚀 Ausblick

Mit dem heutigen Fundament können sich die nächsten Entwicklungsschritte endlich wieder auf neue Inhalte konzentrieren.

Die technische Basis für den eigentlichen Gameplay-Loop steht.

Von hier aus können nun Features wie Achievements, Rangsysteme, Belohnungen und weitere Spielmechaniken deutlich einfacher ergänzt werden.

"Heute wurde aus einem Lernprogramm ein Spiel." 🎮🏝️