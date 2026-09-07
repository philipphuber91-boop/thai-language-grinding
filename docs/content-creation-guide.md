# Content Creation & Staging Pipeline Guide (Gemini 3.7 Flash + GPT Luna)

Dieses Handbuch beschreibt den hocheffizienten Zwei-Stufen-Workflow zur Erstellung neuer Spielinhalte (Quests, Komödien, Wortkarten/Drills) für **Thai Language Grinding**.

---

## 1. Das 2-Stufen-Prinzip (Effizienz & Qualität)

```
┌──────────────────────────────────────────────┐
│             Gemini 3.7 Flash                 │
│         (Kreativer Sprachexperte)            │
│  - Hohe Sprachkompetenz (Thai)               │
│  - Schreibt Story & Dialoge                  │
│  - Liefert Goldstandard-Wortkarten           │
│  - Nutzt temporäre IDs (z. B. temp-w1)       │
└──────────────────────┬───────────────────────┘
                       │ speichert Entwurf in
                       ▼
┌──────────────────────────────────────────────┐
│           data/staging/{category}/           │
│  - Modulare JSON-Dateien mit staging-Block   │
└──────────────────────┬───────────────────────┘
                       │ validiert & integriert
                       ▼
┌──────────────────────────────────────────────┐
│        GPT Luna / Ingest-Tool                │
│             (System Integrator)              │
│  - Quality Gate: PASS / WARNING / ERROR      │
│  - Harte ID-Sicherheit: STOP bei Kollisionen │
│  - Kontrollierte finale ID-Vergabe           │
│  - Keine inhaltlichen Eingriffe              │
│  - Archivierung in data/staging/processed/   │
└──────────────────────────────────────────────┘
```

**Kernregeln:**
1. **Der Integrator macht keine kreative Arbeit:** Er schreibt keine Texte um, erfindet keine Bedeutungen und ändert keine Thaisätze.
2. **Harte ID-Sicherheitsregel:** Bestehende Produktiv-IDs werden **niemals** verändert, ersetzt oder überschrieben. Neue IDs werden erst kontrolliert beim Ingest vergeben.
3. **Klare Trennung:** `npm run staging:validate` prüft nur und erzeugt einen Report. `npm run staging:ingest` integriert nach fehlerfreiem Check.

---

## 2. Der Goldstandard für Wortkarten (Strikte 3-Ebenen-Trennung)

Bei jeder Wortkarte müssen diese drei Ebenen **klar getrennt** sein:

1. `meanings` = allgemeine lexikalische Bedeutung(en) des Wortes (Array von Strings).
2. `contextMeaning` = konkrete Bedeutung/Funktion dieses Wortes **in genau diesem Satz** (am Token).
   - **Wichtig:** `contextMeaning` darf **niemals die Übersetzung des gesamten Satzes** sein!
3. `note` = zusätzliche Erklärung für den Lernenden, **nur wenn tatsächlich etwas erklärt werden muss** (Partikel, Tonregeln, Grammatik).

### Beispiele:

**Mit Erklärungsbedarf (Partikel / Grammatik):**
```json
{
  "thai": "อยู่",
  "meanings": ["sich befinden", "da sein", "bleiben"],
  "contextMeaning": "gerade",
  "note": "Nach einem Verb kann อยู่ anzeigen, dass eine Handlung gerade im Gange ist."
}
```

**Einfaches Nomen (ohne künstlich lange Notiz):**
```json
{
  "thai": "เงิน",
  "meanings": ["Geld"],
  "contextMeaning": "Geld"
}
```

---

## 3. Gemini 3.7 Flash Prompt-Vorlagen

Kopiere die passende Vorlage in Gemini 3.7 Flash:

### A. Kampagnen-Quest erstellen
> **Prompt für Gemini:**
> ```text
> Erstelle eine neue Thai-Lernquest für "Thai Language Grinding" im JSON-Format.
> 
> Thema: [z. B. "Auf dem Nachtmarkt in Chiang Mai"]
> Niveau: [A1 / A2 / B1]
> Zielwörter/Grammatik: [z. B. Preise verhandeln, Essensbestellung]
> 
> Anforderungen:
> - Zeilenanzahl von "deutschZeilen" und "thaiZeilen" MUSS exakt gleich sein (1:1 Übersetzung pro Zeile).
> - Natürliches, modernes Thai mit passenden Höflichkeitspartikeln (ครับ/ค่ะ).
> - Die Story soll als Einleitungstext dienen.
> - Enthält den "staging"-Metadatenblock.
> 
> Antworte NUR mit validem JSON in dieser Struktur:
> {
>   "staging": {
>     "type": "quest",
>     "source": "Gemini",
>     "model": "Gemini 3.7 Flash",
>     "createdAt": "2026-09-07T18:00:00Z",
>     "target": "Kapitel 1"
>   },
>   "titel": "Deutsche Überschrift - Thai Überschrift",
>   "bild": "alltag",
>   "beschreibung": "Kurze deutsche Beschreibung",
>   "kapitel": "Kapitel 1",
>   "schwierigkeit": "A1",
>   "xp": 50,
>   "story": "Einleitungstext mit Zeilenumbrüchen...\n\nLies zuerst den Text.\n\nErst danach wird das Thai-Typing freigeschaltet.",
>   "deutschZeilen": [
>     "Zeile 1 Deutsch",
>     "Zeile 2 Deutsch"
>   ],
>   "thaiZeilen": [
>     "Zeile 1 Thai",
>     "Zeile 2 Thai"
>   ]
> }
> ```

---

### B. Komödien-Episode erstellen (inkl. Goldstandard-Wortkarten)
> **Prompt für Gemini:**
> ```text
> Erstelle eine neue Comedy-Episode für "Thai Language Grinding" mit Khig, Luukdaan, Soda, Ton und Bong.
> 
> Thema / Plot: [z. B. "Die drei bestellen versehentlich super scharfes Som Tam"]
> Niveau: A1/A2
> 
> Anforderungen:
> 1. Dialoge mit Sprechern ("king", "looktarn", "soda", "ton", "bong") und Porträts ("King", "Luukdaan", "Soda", "Ton", "Bong").
> 2. Jede Dialogzeile hat "thai" und "deutsch".
> 3. Goldstandard-Glossar: Definiere alle neuen thailändischen Wörter mit deutscher Übersetzung ("de") und bei Bedarf didaktischen Hinweisen ("note") zu Grammatik, Partikeln oder Tonverlauf.
> 
> Antworte NUR mit validem JSON in dieser Struktur:
> {
>   "staging": {
>     "type": "comedy",
>     "source": "Gemini",
>     "model": "Gemini 3.7 Flash",
>     "createdAt": "2026-09-07T18:00:00Z",
>     "target": "Episode 11"
>   },
>   "titel": "Thai Titel",
>   "bild": "friends",
>   "beschreibung": "Deutsche Zusammenfassung",
>   "kapitel": "Episode 11",
>   "schwierigkeit": "A1",
>   "xp": 60,
>   "story": "Einleitungstext auf Deutsch mit thailändischen Namen...",
>   "dialogue": [
>     {
>       "scene": 1,
>       "sceneIntro": true,
>       "deutsch": "Szene 1 Einleitung...",
>       "thai": "ภาษาไทย..."
>     },
>     {
>       "speaker": "soda",
>       "portrait": "Soda",
>       "deutsch": "Deutscher Satz...",
>       "thai": "ประโยคภาษาไทย..."
>     }
>   ],
>   "glossary": {
>     "เผ็ด": {
>       "de": "scharf (Geschmack)",
>       "note": "Adjektiv mit tiefem Ton (สระ แอ + ผ + ด)."
>     },
>     "เงิน": {
>       "de": "Geld"
>     }
>   }
> }
> ```

---

### C. Thai Giga Drill / Wortkarten (Goldstandard mit temporären IDs)
> **Prompt für Gemini:**
> ```text
> Erstelle einen Vokabel- und Beispielsatz-Block für Thai Giga Drill nach dem Goldstandard.
> Verwende temporäre IDs (z. B. temp-w1, temp-w2), die beim Ingest automatisch aufgelöst werden.
> 
> Thema: [z. B. "Wegbeschreibung & Richtungen"]
> 
> Struktur:
> {
>   "staging": {
>     "type": "giga-drill",
>     "source": "Gemini",
>     "model": "Gemini 3.7 Flash",
>     "createdAt": "2026-09-07T18:00:00Z",
>     "target": "Boss 6"
>   },
>   "topic": "Wegbeschreibung",
>   "vocabulary": [
>     {
>       "id": "temp-w1",
>       "thai": "เลี้ยวซ้าย",
>       "transliteration": "líao-sáai",
>       "meanings": ["nach links abbiegen"],
>       "note": "Zusammengesetzt aus เลี้ยว (abbiegen) + ซ้าย (links). Tonverlauf: Hoher Ton auf beiden Silben."
>     },
>     {
>       "id": "temp-w2",
>       "thai": "ตรงไป",
>       "transliteration": "dtrong-bpai",
>       "meanings": ["geradeaus gehen / fahren"]
>     }
>   ],
>   "sampleSentences": [
>     {
>       "thai": "เดินตรงไปแล้วเลี้ยวซ้ายครับ",
>       "transliteration": "dəən dtrong-bpai lɛ́ɛo líao-sáai khráp",
>       "translation": "Gehen Sie geradeaus und biegen Sie dann links ab.",
>       "tokens": [
>         { "id": "t1", "text": "เดิน", "kind": "word" },
>         { "id": "t2", "text": "ตรงไป", "kind": "word", "wordId": "temp-w2", "contextMeaning": "geradeaus" },
>         { "id": "t3", "text": "แล้ว", "kind": "word" },
>         { "id": "t4", "text": "เลี้ยวซ้าย", "kind": "word", "wordId": "temp-w1", "contextMeaning": "links abbiegen" },
>         { "id": "t5", "text": "ครับ", "kind": "word" }
>       ]
>     }
>   ]
> }
> ```

---

## 4. Content-Regeln für Grammatikbosse (z. B. Boss 7)

Für die 500 Sätze eines Bosses (5 × 100 Sätze Foundation Blocks) gelten folgende verbindliche didaktische Regeln:

### A. Struktur & Story-Aufbau
- Die 500 Sätze müssen **keine** einzige lange zusammenhängende Geschichte bilden.
- Die 5 × 100 Sätze sind technische Foundation Blocks. Innerhalb der Blöcke soll eine lebendige und abwechslungsreiche Mischung entstehen:
  - Mehrere kleine Mini-Stories
  - Kurze eigenständige Alltagsszenen
  - Kurze, lebendige Dialoge
  - 2–3 zusammenhängende Szenen
  - Gelegentlich eine längere zusammenhängende Handlung
  - Wiederkehrende Personen / Situationen, wenn es natürlich passt
- **Ausbalanciert und abwechslungsreich:** Nicht jede Szene muss dramatisch sein und nicht jede Szene muss ein neues Setting erzwingen.

### B. Satzlänge & Natürlichkeit
- Die Sätze sollen **überwiegend maximal 7 Wörter** enthalten.
- Erlaubt und erwünscht sind:
  - Sehr kurze Sätze (2–5 Wörter)
  - Kurze Frage-Antwort-Wechsel
  - Natürliche Ein-Wort-Antworten (z. B. ครับ, ใช่, ไม่)
  - Gelegentlich längere Sätze (nur wenn natürlich und inhaltlich sinnvoll, als Ausnahme)
- **Nicht künstlich strecken:** Nicht versuchen, jeden Satz künstlich auf exakt 7 Wörter zu bringen.

### C. Prioritäten-Hierarchie
> **Natürliches gesprochenes Thai > Satzlänge > neue Wörter > künstliches Erzwingen der Grammatik.**
- Die Grammatik entsteht organisch durch echte Alltagssituationen und nicht dadurch, dass dasselbe starre Muster hundertmal künstlich wiederholt wird.

### D. Vokabel-Recycling & Begrenzung neuer Wörter
- Neue Wörter sollen sich **aus dem tatsächlichen Content ergeben**.
- **Maximal 140 neue Wörter pro Boss:** Lieber weniger neue Wörter einführen und diese dafür mehrfach in wechselnden Kontexten festigen.
- **Wortschatz der vorherigen Bosse aktiv recyclen!**
- **Schlanke Vokabel-Referenzdateien für Gemini (sehr wenige Tokens):**
  - `data/vocabulary-index.json`: Kompaktes JSON aller 884 bisherigen Wörter mit Lautschrift, deutscher Bedeutung und Erstvorkommen (~35 KB).
  - `docs/known-words-by-boss.md`: Tabellarische Übersicht aller bekannten Wörter nach Boss 1–7 sortiert (~48 KB).
  - *Gemini kann diese Dateien zur gezielten Wortauswahl lesen, ohne die 10 MB große Hauptdatei laden zu müssen!*

---

## 5. Validierung, Vorschau & Ingest-Befehle

1. **Content-Vorschau anzeigen (Human Review für Philipp):**
   ```powershell
   npm run staging:preview
   ```
   * Für gezielte Einzelblöcke:
   ```powershell
   npm run staging:preview -- data/staging/drills/boss-7-block-1.json
   ```
   * Zeigt pro Satz: Nummer, Thai, Lautschrift, deutsche Übersetzung und alle anklickbaren Wortkarten (Bedeutungen, Kontextbedeutung, Notes).

2. **Entwurf validieren (Quality Gate):**
   ```powershell
   npm run staging:validate
   ```
   * Prüft Pflichtfelder, Zeilensynchronität, Token-Referenzen, Schema und ID-Sicherheit.
   * Gibt tabellarischen `[PASS]`, `[WARNING]` und `[ERROR]` Report aus.
   * Nur echte technische Fehler führen zum Abbruch (`STOP — Validation failed`).

3. **In die Produktivdaten übernehmen (nur nach Freigabe):**
   ```powershell
   npm run staging:ingest
   ```
   * Für gezielte Freigabe eines einzelnen Blocks:
   ```powershell
   npm run staging:ingest -- data/staging/drills/boss-7-block-1.json
   ```
   * Weist kontrolliert finale IDs zu, aktualisiert `data/thai-giga-drill.v1.json` / `data/quests.js` / `data/comedy.js`, führt automatischen Post-Validierungscheck durch und archiviert den Entwurf nach `data/staging/processed/`.
