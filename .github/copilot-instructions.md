# Thai Language Grinding — Copilot Instructions

## Operating Modes

Detect the mode from prompt prefixes or intent. Keep tool calls minimal and surgical.

### 1. FAST MODE (Default for UI, styling, HTML, CSS, text, simple navigation)
* **Trigger:** Prompt starts with `FAST:` or involves HTML/CSS/UI layout, styling, text, or simple links.
* **Process:** Read only the targeted file(s) once → Apply surgical edits (`edit`) → Finish immediately.
* **Prohibited:**
  * Do NOT use browser tools (`screenshotPage`, `runPlaywrightCode`, `openBrowserPage`, `navigatePage`) unless the user explicitly requested a browser/visual check.
  * Do NOT run unit tests (`npm test`), full linters, or content staging validators.
  * Do NOT re-read already inspected files without a concrete new hypothesis.
* **Loop Breaker:** If a UI problem or discrepancy is not resolved after 2 targeted attempts, STOP and explain the issue to the user instead of starting iterative loops.

### 2. STANDARD MODE (Game logic, features, audio player, state)
* **Trigger:** Prompt starts with `STANDARD:` or involves JS feature logic (e.g. `drill-audio-player.js`, Satzmix, quests, storage).
* **Process:** Inspect only the specific JS module and its immediate imports. Apply minimal, surgical edits.
* **Testing:** Run only the single targeted test file covering the change (e.g. `node --test tests/sentence-mix-xp.test.js`), NEVER the entire suite. No blind whole-project scans.

### 3. STRICT MODE (Thai content, vocabulary, grammar bosses, staging & ingest)
* **Trigger:** Prompt starts with `STRICT:` or touches `data/*.json`, new stories, words, syllables, tones, or staging files.
* **Quality Gate (Non-Negotiable):**
  * Strictly enforce the 3-tier word card rule from `docs/content-creation-guide.md`: `meanings` (lexical array), `contextMeaning` (word role in sentence, never full sentence translation), `note` (grammar/particle hint only when needed).
  * Existing production word and sentence IDs are IMMUTABLE. Never change, overwrite, or delete them.
  * Tone color classes and syllable breakdowns must be preserved and verified.
  * Mandatory verification: Run `npm run staging:validate` or `npm run ingest:check` before completing.
* **Context Isolation:** Load `docs/content-creation-guide.md` ONLY in STRICT MODE. Never load it for UI or logic tasks.

### 4. ARCHITECT MODE (Structural overhauls, migrations, new subsystems)
* **Trigger:** Prompt starts with `ARCHITECT:` or involves multi-module refactoring or database schema migrations.
* **Process:** Plan first. Analyze affected dependencies, propose a concise plan, and await explicit user confirmation before mutating any code.

---

## General Efficiency Rules
* **Tool Economy:** Do not invoke GitHub MCP tools for local file operations. Do not launch browser or background processes autonomously.
* **Worktree Hygiene:** Always work strictly inside the current working directory. Never manually copy files between worktrees with shell commands; use git merge.
* **Early Stop:** Once the user's explicit request is addressed, stop immediately. Do not hunt for unrelated improvements.
