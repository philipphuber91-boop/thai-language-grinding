#!/usr/bin/env node
/**
 * Staging Pipeline Tool for Thai Language Grinding
 *
 * Provides two strictly separated operations:
 * 1. npm run staging:validate (read-only validation, Quality Gate with PASS / WARNING / ERROR report)
 * 2. npm run staging:ingest (validate -> diff -> controlled final ID assignment -> technical integration -> post-validation -> archive)
 *
 * Rules:
 * - Goldstandard 3-level word card enforcement: meanings (lexical), contextMeaning (sentence-specific), note (optional explanation)
 * - contextMeaning vs sentence check is a heuristic WARNING (PASS/WARNING/ERROR structure). Only technical errors cause STOP.
 * - Staging supports temporary IDs (e.g. temp-w1, temp-s1). Final IDs and reference remapping are controlled exclusively during ingest.
 * - Strict ID security: Existing production IDs are NEVER overwritten or mutated. Collision = STOP.
 * - The integrator does ZERO creative work (no rewrites, no invented meanings).
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const STAGING_DIR = path.join(ROOT_DIR, "data", "staging");
const QUESTS_FILE = path.join(ROOT_DIR, "data", "quests.js");
const COMEDY_FILE = path.join(ROOT_DIR, "data", "comedy.js");
const COMEDY_GLOSSARY_FILE = path.join(ROOT_DIR, "data", "comedy-glossary.js");
const GIGA_DRILL_FILE = path.join(ROOT_DIR, "data", "thai-giga-drill.v1.json");
const PROCESSED_DIR = path.join(STAGING_DIR, "processed");

const isPreviewMode = process.argv.includes("--preview");
const isIngestMode = process.argv.includes("--ingest");
const isValidateOnly = (!isIngestMode && !isPreviewMode) || process.argv.includes("--validate-only") || process.argv.includes("--validate");

// Optional target file filter (e.g. node tools/ingest-staging.js --preview data/staging/quests/demo-quest.json)
const targetArg = process.argv.slice(2).find(arg => !arg.startsWith("--") && arg.endsWith(".json"));

function log(msg) {
    console.log(`[staging] ${msg}`);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getStagingFiles(subfolder) {
    const dir = path.join(STAGING_DIR, subfolder);
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith(".json") && !f.startsWith("template.") && !f.startsWith("."))
        .map(f => path.join(dir, f));

    if (targetArg) {
        const resolvedTarget = path.resolve(ROOT_DIR, targetArg);
        return files.filter(f => path.resolve(f) === resolvedTarget || path.basename(f) === path.basename(targetArg));
    }
    return files;
}

// ==========================================
// Existing Production IDs Indexer
// ==========================================
function loadExistingProductionState() {
    const state = {
        questIds: new Set(),
        comedyIds: new Set(),
        drillWordIds: new Set(),
        drillSentenceIds: new Set(),
        glossaryWords: new Set()
    };

    // 1. Quests
    if (fs.existsSync(QUESTS_FILE)) {
        const content = fs.readFileSync(QUESTS_FILE, "utf8");
        const matchRegex = /^\s*(\d+):\s*\{/gm;
        let match;
        while ((match = matchRegex.exec(content)) !== null) {
            state.questIds.add(parseInt(match[1], 10));
        }
    }

    // 2. Comedy
    if (fs.existsSync(COMEDY_FILE)) {
        const content = fs.readFileSync(COMEDY_FILE, "utf8");
        const matchRegex = /^\s*(\d+):\s*\{/gm;
        let match;
        while ((match = matchRegex.exec(content)) !== null) {
            state.comedyIds.add(parseInt(match[1], 10));
        }
    }

    // 3. Comedy Glossary
    if (fs.existsSync(COMEDY_GLOSSARY_FILE)) {
        const content = fs.readFileSync(COMEDY_GLOSSARY_FILE, "utf8");
        const wordRegex = /^\s*"([^"]+)"\s*:\s*\{/gm;
        let match;
        while ((match = wordRegex.exec(content)) !== null) {
            state.glossaryWords.add(match[1]);
        }
    }

    // 4. Thai Giga Drill
    if (fs.existsSync(GIGA_DRILL_FILE)) {
        try {
            const raw = fs.readFileSync(GIGA_DRILL_FILE, "utf8");
            const data = JSON.parse(raw);
            if (Array.isArray(data.words)) {
                for (const w of data.words) {
                    if (w.id) state.drillWordIds.add(w.id);
                }
            }
        } catch (e) {
            log(`Notice: Could not parse full Giga Drill file (${e.message}), continuing with regex index.`);
        }
    }

    return state;
}

// ==========================================
// Quality Gate Validators (PASS / WARNING / ERROR)
// ==========================================
function validateStagingMetadata(draft, filename, report) {
    if (!draft.staging || typeof draft.staging !== "object") {
        report.errors.push(`${filename}: Missing mandatory 'staging' metadata object.`);
        return false;
    }
    const meta = draft.staging;
    const requiredMeta = ["type", "source", "model", "createdAt", "target"];
    for (const field of requiredMeta) {
        if (!meta[field] || typeof meta[field] !== "string" || !meta[field].trim()) {
            report.errors.push(`${filename}: Invalid or missing staging metadata field '${field}'.`);
            return false;
        }
    }
    report.passes.push(`${filename}: Valid staging metadata (Type: ${meta.type}, Target: ${meta.target})`);
    return true;
}

function validateQuestDraft(draft, filename, prodState, batchIds, report) {
    if (!validateStagingMetadata(draft, filename, report)) return;

    const required = ["titel", "beschreibung", "kapitel", "schwierigkeit", "xp", "story", "deutschZeilen", "thaiZeilen"];
    for (const key of required) {
        if (draft[key] === undefined || draft[key] === null || draft[key] === "") {
            report.errors.push(`${filename}: Missing required field '${key}'.`);
            return;
        }
    }

    if (!Array.isArray(draft.deutschZeilen) || draft.deutschZeilen.length === 0) {
        report.errors.push(`${filename}: 'deutschZeilen' must be a non-empty array.`);
        return;
    }
    if (!Array.isArray(draft.thaiZeilen) || draft.thaiZeilen.length === 0) {
        report.errors.push(`${filename}: 'thaiZeilen' must be a non-empty array.`);
        return;
    }
    if (draft.deutschZeilen.length !== draft.thaiZeilen.length) {
        report.errors.push(`${filename}: Line count mismatch: 'deutschZeilen' has ${draft.deutschZeilen.length} lines, 'thaiZeilen' has ${draft.thaiZeilen.length} lines.`);
        return;
    }

    // Check ID collisions if explicit numeric ID provided
    if (draft.id !== undefined) {
        if (typeof draft.id === "number" || /^\d+$/.test(String(draft.id))) {
            const numId = parseInt(draft.id, 10);
            if (prodState.questIds.has(numId)) {
                report.errors.push(`${filename}: ID collision detected: Quest ID ${numId} already exists in production data/quests.js!`);
                return;
            }
            if (batchIds.has(`quest-${numId}`)) {
                report.errors.push(`${filename}: Duplicate ID detected: Quest ID ${numId} defined multiple times in staging batch!`);
                return;
            }
            batchIds.add(`quest-${numId}`);
        } else {
            // Temporary string ID (e.g. "temp-quest-1")
            report.passes.push(`${filename}: Uses temporary Quest ID '${draft.id}' (final ID will be assigned during ingest).`);
        }
    }

    report.passes.push(`${filename}: Quest structure & ${draft.thaiZeilen.length} lines validated successfully.`);
}

function validateComedyDraft(draft, filename, prodState, batchIds, report) {
    if (!validateStagingMetadata(draft, filename, report)) return;

    const required = ["titel", "beschreibung", "kapitel", "schwierigkeit", "xp", "story", "dialogue"];
    for (const key of required) {
        if (draft[key] === undefined || draft[key] === null || draft[key] === "") {
            report.errors.push(`${filename}: Missing required field '${key}'.`);
            return;
        }
    }

    if (!Array.isArray(draft.dialogue) || draft.dialogue.length === 0) {
        report.errors.push(`${filename}: 'dialogue' must be a non-empty array.`);
        return;
    }

    for (let i = 0; i < draft.dialogue.length; i++) {
        const item = draft.dialogue[i];
        if (!item.thai || typeof item.thai !== "string" || !item.thai.trim()) {
            report.errors.push(`${filename}: Dialogue entry #${i + 1} missing or empty 'thai'.`);
            return;
        }
        if (!item.deutsch || typeof item.deutsch !== "string" || !item.deutsch.trim()) {
            report.errors.push(`${filename}: Dialogue entry #${i + 1} missing or empty 'deutsch'.`);
            return;
        }
    }

    // Validate glossary if present
    if (draft.glossary && typeof draft.glossary === "object") {
        for (const [word, entry] of Object.entries(draft.glossary)) {
            if (!entry || typeof entry !== "object") {
                report.errors.push(`${filename}: Glossary entry for '${word}' must be an object.`);
                return;
            }
            if (!entry.de || typeof entry.de !== "string" || !entry.de.trim()) {
                report.errors.push(`${filename}: Glossary entry for '${word}' missing required 'de' definition.`);
                return;
            }
            if (entry.note !== undefined && typeof entry.note !== "string") {
                report.errors.push(`${filename}: Glossary entry for '${word}' has invalid 'note' (must be string).`);
                return;
            }
        }
        report.passes.push(`${filename}: Validated ${Object.keys(draft.glossary).length} glossary entries.`);
    }

    if (draft.id !== undefined) {
        if (typeof draft.id === "number" || /^\d+$/.test(String(draft.id))) {
            const numId = parseInt(draft.id, 10);
            if (prodState.comedyIds.has(numId)) {
                report.errors.push(`${filename}: ID collision detected: Comedy Episode ID ${numId} already exists in production data/comedy.js!`);
                return;
            }
            if (batchIds.has(`comedy-${numId}`)) {
                report.errors.push(`${filename}: Duplicate ID detected: Comedy Episode ID ${numId} defined multiple times in staging batch!`);
                return;
            }
            batchIds.add(`comedy-${numId}`);
        } else {
            report.passes.push(`${filename}: Uses temporary Episode ID '${draft.id}' (final ID will be assigned during ingest).`);
        }
    }

    report.passes.push(`${filename}: Comedy episode & ${draft.dialogue.length} dialogue lines validated successfully.`);
}

function validateDrillDraft(draft, filename, prodState, batchIds, report) {
    if (!validateStagingMetadata(draft, filename, report)) return;

    if (!draft.vocabulary || !Array.isArray(draft.vocabulary) || draft.vocabulary.length === 0) {
        report.errors.push(`${filename}: Drill draft must contain a non-empty 'vocabulary' array.`);
        return;
    }

    const batchWords = new Map();

    // Validate 3-level Goldstandard for vocabulary
    for (const w of draft.vocabulary) {
        if (!w.thai || typeof w.thai !== "string" || !w.thai.trim()) {
            report.errors.push(`${filename}: Vocabulary entry missing 'thai'.`);
            return;
        }
        if (!w.transliteration || typeof w.transliteration !== "string" || !w.transliteration.trim()) {
            report.errors.push(`${filename}: Vocabulary entry '${w.thai}' missing 'transliteration'.`);
            return;
        }
        if (!Array.isArray(w.meanings) || w.meanings.length === 0) {
            report.errors.push(`${filename}: Vocabulary entry '${w.thai}' must have a non-empty 'meanings' array.`);
            return;
        }
        if (w.note !== undefined && typeof w.note !== "string") {
            report.errors.push(`${filename}: Vocabulary entry '${w.thai}' note must be a string if present.`);
            return;
        }

        const wordId = w.id || `temp-w-${w.thai}`;
        if (w.id) {
            if (!w.id.startsWith("temp-")) {
                if (prodState.drillWordIds.has(w.id)) {
                    report.errors.push(`${filename}: ID collision detected: Word ID '${w.id}' already exists in production data!`);
                    return;
                }
                if (batchIds.has(`drill-word-${w.id}`)) {
                    report.errors.push(`${filename}: Duplicate ID detected: Word ID '${w.id}' defined multiple times in staging batch!`);
                    return;
                }
                batchIds.add(`drill-word-${w.id}`);
            } else {
                const fileScopedId = `${filename}::${w.id}`;
                if (batchIds.has(fileScopedId)) {
                    report.errors.push(`${filename}: Duplicate temporary ID '${w.id}' within the same file.`);
                    return;
                }
                batchIds.add(fileScopedId);
            }
        }
        batchWords.set(wordId, w);
    }

    report.passes.push(`${filename}: Validated ${draft.vocabulary.length} vocabulary words.`);

    // Validate sample sentences & tokens if present
    if (draft.sampleSentences && Array.isArray(draft.sampleSentences)) {
        for (let sIdx = 0; sIdx < draft.sampleSentences.length; sIdx++) {
            const sentence = draft.sampleSentences[sIdx];
            if (!sentence.thai || !sentence.translation) {
                report.errors.push(`${filename}: Sample sentence #${sIdx + 1} missing 'thai' or 'translation'.`);
                return;
            }
            if (!Array.isArray(sentence.tokens) || sentence.tokens.length === 0) {
                report.errors.push(`${filename}: Sample sentence #${sIdx + 1} missing 'tokens' array.`);
                return;
            }

            for (let tIdx = 0; tIdx < sentence.tokens.length; tIdx++) {
                const token = sentence.tokens[tIdx];
                if (!token.id || !token.text || !token.kind) {
                    report.errors.push(`${filename}: Token #${tIdx + 1} in sentence #${sIdx + 1} missing required fields.`);
                    return;
                }
                if (token.kind === "word" && token.wordId) {
                    const existsInProd = prodState.drillWordIds.has(token.wordId);
                    const existsInBatch = batchWords.has(token.wordId);
                    if (!existsInProd && !existsInBatch) {
                        report.errors.push(`${filename}: Broken reference: Token '${token.text}' references unknown wordId '${token.wordId}'.`);
                        return;
                    }

                    // Heuristic contextMeaning check (WARNING only, not ERROR)
                    if (token.contextMeaning !== undefined) {
                        if (typeof token.contextMeaning !== "string" || !token.contextMeaning.trim()) {
                            report.errors.push(`${filename}: Token '${token.text}' has empty contextMeaning.`);
                            return;
                        }
                        const cleanCtx = token.contextMeaning.trim().toLowerCase();
                        const cleanSent = sentence.translation.trim().toLowerCase();
                        if (cleanCtx === cleanSent || (cleanSent.length > 20 && cleanCtx.length > 30 && cleanSent.includes(cleanCtx))) {
                            report.warnings.push(`${filename}: Token '${token.text}' contextMeaning ("${token.contextMeaning}") matches full sentence translation. Verify this represents only the token's meaning in context.`);
                        }
                    }
                }
            }
        }
        report.passes.push(`${filename}: Validated ${draft.sampleSentences.length} sample sentences.`);
    }
}

// ==========================================
// Ingestion & ID Resolution Routines
// ==========================================
function getNextNumericId(content) {
    const idRegex = /^\s*(\d+):\s*\{/gm;
    let highest = 0;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        const id = parseInt(match[1], 10);
        if (id > highest) highest = id;
    }
    return highest + 1;
}

function printValidationReport(report) {
    console.log(`\n========================================`);
    console.log(`STAGING VALIDATION REPORT`);
    console.log(`========================================`);

    for (const p of report.passes) {
        console.log(`[PASS]    ${p}`);
    }
    for (const w of report.warnings) {
        console.log(`[WARNING] ${w}`);
    }
    for (const e of report.errors) {
        console.log(`[ERROR]   ${e}`);
    }

    console.log(`----------------------------------------`);
    console.log(`Summary: ${report.passes.length} passed, ${report.warnings.length} warning(s), ${report.errors.length} error(s).`);
    console.log(`========================================\n`);

    if (report.errors.length > 0) {
        console.error(`\n========================================`);
        console.error(`STOP — Validation failed with ${report.errors.length} error(s).`);
        console.error(`========================================\n`);
        process.exit(1);
    }
}

function generateDiffReport(items) {
    console.log(`\n========================================`);
    console.log(`STAGING INGEST DIFF`);
    console.log(`========================================`);
    for (const item of items) {
        console.log(`[+] ${item.type.toUpperCase()}: ${item.title}`);
        console.log(`    Target: ${item.target} (ID: ${item.id})`);
        console.log(`    File:   ${item.file}`);
        if (item.details) {
            console.log(`    Details: ${item.details}`);
        }
    }
    console.log(`========================================\n`);
}

function ingestQuests(files, prodState) {
    if (files.length === 0) return [];
    let questsContent = fs.readFileSync(QUESTS_FILE, "utf8");
    const originalContent = questsContent;
    let nextId = getNextNumericId(questsContent);
    const diffItems = [];

    for (const filePath of files) {
        const filename = path.basename(filePath);
        const draft = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const questId = (typeof draft.id === "number" || (draft.id && /^\d+$/.test(String(draft.id)))) ? parseInt(draft.id, 10) : nextId++;
        const bild = draft.bild || "alltag";

        const questSnippet = `    ${questId}: {
        version: ${draft.version || 1},
        titel: ${JSON.stringify(draft.titel)},
        bild: ${JSON.stringify(bild)},
        beschreibung: ${JSON.stringify(draft.beschreibung)},
        kapitel: ${JSON.stringify(draft.kapitel)},
        schwierigkeit: ${JSON.stringify(draft.schwierigkeit)},
        xp: ${draft.xp || 50},
        story: \`${draft.story.replace(/`/g, "\\`")}\`,
        deutschZeilen: ${JSON.stringify(draft.deutschZeilen, null, 12).replace(/\n\s*\]/g, "\n        ]")},
        thaiZeilen: ${JSON.stringify(draft.thaiZeilen, null, 12).replace(/\n\s*\]/g, "\n        ]")}
    },
};`;

        const closingIndex = questsContent.lastIndexOf("};");
        if (closingIndex === -1) {
            throw new Error("Could not find closing '};' in data/quests.js");
        }
        questsContent = questsContent.slice(0, closingIndex) + questSnippet + questsContent.slice(closingIndex + 2);

        diffItems.push({
            type: "Quest",
            id: questId,
            title: draft.titel,
            target: "data/quests.js",
            file: filename,
            details: `${draft.thaiZeilen.length} lines, Schwierigkeit: ${draft.schwierigkeit}`
        });
    }

    if (isIngestMode) {
        try {
            fs.writeFileSync(QUESTS_FILE, questsContent, "utf8");
            execSync(`node --check "${QUESTS_FILE}"`);
            log(`✓ Successfully integrated ${diffItems.length} quest(s) into data/quests.js`);
            archiveFiles(files, "quests");
        } catch (err) {
            fs.writeFileSync(QUESTS_FILE, originalContent, "utf8");
            console.error(`\n========================================\nSTOP — Integration rollback triggered for quests.js: ${err.message}\n========================================\n`);
            process.exit(1);
        }
    }

    return diffItems;
}

function ingestComedy(files, prodState) {
    if (files.length === 0) return [];
    let comedyContent = fs.readFileSync(COMEDY_FILE, "utf8");
    let glossaryContent = fs.readFileSync(COMEDY_GLOSSARY_FILE, "utf8");
    const origComedy = comedyContent;
    const origGlossary = glossaryContent;

    let nextEpisodeId = getNextNumericId(comedyContent);
    const diffItems = [];

    for (const filePath of files) {
        const filename = path.basename(filePath);
        const draft = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const episodeId = (typeof draft.id === "number" || (draft.id && /^\d+$/.test(String(draft.id)))) ? parseInt(draft.id, 10) : nextEpisodeId++;
        const bild = draft.bild || "friends";
        const formattedDialogue = JSON.stringify(draft.dialogue, null, 12)
            .replace(/\n\s*\]/g, "\n        ]");

        const episodeSnippet = `    ${episodeId}: {
        version: ${draft.version || 1},
        titel: ${JSON.stringify(draft.titel)},
        bild: ${JSON.stringify(bild)},
        beschreibung: ${JSON.stringify(draft.beschreibung)},
        kapitel: ${JSON.stringify(draft.kapitel || `Episode ${String(episodeId).padStart(2, "0")}`)},
        schwierigkeit: ${JSON.stringify(draft.schwierigkeit || "A1")},
        xp: ${draft.xp || 60},
        story: \`${draft.story.replace(/`/g, "\\`")}\`,
        dialogue: ${formattedDialogue}
    }
};`;

        const closingIndex = comedyContent.indexOf("};");
        if (closingIndex === -1) {
            throw new Error("Could not find closing '};' of comedyEpisodes in data/comedy.js");
        }
        comedyContent = comedyContent.slice(0, closingIndex) + episodeSnippet + comedyContent.slice(closingIndex + 2);

        let addedGlossaryWords = 0;
        if (draft.glossary && typeof draft.glossary === "object") {
            let glossaryAdditions = "";
            for (const [word, entry] of Object.entries(draft.glossary)) {
                if (!entry.de) continue;
                const wordEscaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const existsRegex = new RegExp(`"${wordEscaped}"\\s*:`, "g");
                if (!existsRegex.test(glossaryContent)) {
                    const entryJson = JSON.stringify(entry);
                    glossaryAdditions += `    ${JSON.stringify(word)}: ${entryJson},\n`;
                    addedGlossaryWords++;
                }
            }
            if (addedGlossaryWords > 0) {
                const glossClosingIndex = glossaryContent.indexOf("};");
                if (glossClosingIndex !== -1) {
                    glossaryContent = glossaryContent.slice(0, glossClosingIndex) + glossaryAdditions + glossaryContent.slice(glossClosingIndex);
                }
            }
        }

        diffItems.push({
            type: "Comedy Episode",
            id: episodeId,
            title: draft.titel,
            target: "data/comedy.js & data/comedy-glossary.js",
            file: filename,
            details: `${draft.dialogue.length} dialogue lines, ${addedGlossaryWords} new glossary terms`
        });
    }

    if (isIngestMode) {
        try {
            fs.writeFileSync(COMEDY_FILE, comedyContent, "utf8");
            fs.writeFileSync(COMEDY_GLOSSARY_FILE, glossaryContent, "utf8");
            execSync(`node --check "${COMEDY_FILE}"`);
            execSync(`node --check "${COMEDY_GLOSSARY_FILE}"`);
            log(`✓ Successfully integrated ${diffItems.length} comedy episode(s) and glossary items`);
            archiveFiles(files, "comedy");
        } catch (err) {
            fs.writeFileSync(COMEDY_FILE, origComedy, "utf8");
            fs.writeFileSync(COMEDY_GLOSSARY_FILE, origGlossary, "utf8");
            console.error(`\n========================================\nSTOP — Integration rollback triggered for comedy files: ${err.message}\n========================================\n`);
            process.exit(1);
        }
    }

    return diffItems;
}

function ingestDrills(files, prodState) {
    if (files.length === 0) return [];
    const diffItems = [];

    let drillData = null;
    let originalRaw = null;
    if (fs.existsSync(GIGA_DRILL_FILE)) {
        originalRaw = fs.readFileSync(GIGA_DRILL_FILE, "utf8");
        try {
            drillData = JSON.parse(originalRaw);
        } catch (e) {
            log(`Notice: Giga drill parse notice: ${e.message}`);
        }
    }

    const wordIdMap = new Map();

    for (const filePath of files) {
        const filename = path.basename(filePath);
        const draft = JSON.parse(fs.readFileSync(filePath, "utf8"));
        let addedWordsCount = 0;
        let addedSentencesCount = 0;

        if (drillData && Array.isArray(drillData.words) && Array.isArray(draft.vocabulary)) {
            for (const w of draft.vocabulary) {
                // Find existing word in drillData by ID or thai
                let existing = drillData.words.find(ew => ew.id === w.id || ew.thai === w.thai);
                if (existing) {
                    if (w.id) wordIdMap.set(w.id, existing.id);
                    if (
                        w.note &&
                        (
                            !existing.infoSentence ||
                            existing.infoSentence === "Keine erforderlich."
                        )
                    ) {
                        existing.infoSentence = w.note;
                    }
                    if (
                        Array.isArray(w.syllables) &&
                        w.syllables.length > 1 &&
                        (!Array.isArray(existing.syllables) || existing.syllables.length < 2)
                    ) {
                        existing.syllables = w.syllables;
                    }
                } else {
                    const canonicalId = (w.id && !w.id.startsWith("temp-"))
                        ? w.id
                        : `word-staging-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

                    const newWordEntry = {
                        id: canonicalId,
                        thai: w.thai,
                        transliteration: w.transliteration,
                        meanings: w.meanings,
                        ...(w.syllables ? { syllables: w.syllables } : {}),
                        ...(w.note ? { infoSentence: w.note } : {})
                    };
                    drillData.words.push(newWordEntry);
                    prodState.drillWordIds.add(canonicalId);
                    if (w.id) wordIdMap.set(w.id, canonicalId);
                    addedWordsCount++;
                }
            }
        }

        // Merge sentences into target Boss/Block if specified
        if (drillData && Array.isArray(drillData.levels) && Array.isArray(draft.sampleSentences)) {
            const targetStr = (draft.staging?.target || "").toLowerCase();
            const bossMatch = targetStr.match(/boss\s*(\d+)/i);
            const bossNum = bossMatch ? parseInt(bossMatch[1], 10) : null;
            const blockMatch = targetStr.match(/block\s*(\d+)/i);
            const blockNum = blockMatch ? parseInt(blockMatch[1], 10) : 1;

            let targetBoss = null;
            for (const level of drillData.levels) {
                if (Array.isArray(level.bosses)) {
                    for (const boss of level.bosses) {
                        if ((bossNum && boss.id === `level-1-grammar-boss-${bossNum}`) ||
                            boss.id.toLowerCase().includes(targetStr)) {
                            targetBoss = boss;
                            break;
                        }
                    }
                }
                if (targetBoss) break;
            }

            if (!targetBoss && bossNum) {
                targetBoss = {
                    id: `level-1-grammar-boss-${bossNum}`,
                    title: `GRAMMATIKBOSS ${bossNum}`,
                    topic: draft.topic || "",
                    introduction: draft.introduction || null,
                    blocks: []
                };
                drillData.levels[0].bosses.push(targetBoss);
            }

            let targetBlock = null;
            if (targetBoss) {
                targetBoss.grammarFocus = draft.grammarFocus || draft.topic || targetBoss.grammarFocus || "";
                if (!Array.isArray(targetBoss.blocks)) targetBoss.blocks = [];
                targetBlock = targetBoss.blocks.find(b => b.id === `level-1-boss-${bossNum}-foundation-block-${blockNum}`);
                if (!targetBlock) {
                    targetBlock = {
                        id: `level-1-boss-${bossNum}-foundation-block-${blockNum}`,
                        title: `Foundation Block ${blockNum} — Sätze ${draft.staging?.sentenceRange || ""}`,
                        midpointReminder: draft.midpointReminder || draft.reminder50 || null,
                        completion: draft.completion || draft.reminder100 || null,
                        miniStories: []
                    };
                    targetBoss.blocks.push(targetBlock);
                } else {
                    if (draft.midpointReminder || draft.reminder50) {
                        targetBlock.midpointReminder = draft.midpointReminder || draft.reminder50;
                    }
                    if (draft.completion || draft.reminder100) {
                        targetBlock.completion = draft.completion || draft.reminder100;
                    }
                }
            }

            if (targetBlock) {
                if (Array.isArray(draft.miniStories) && draft.miniStories.length > 0) {
                    const existingStoriesById = new Map(
                        (targetBlock.miniStories || []).map(story => [story.id, story])
                    );
                    targetBlock.miniStories = draft.miniStories.map(ms => ({
                        id: ms.id,
                        title: ms.title,
                        ...(
                            Array.isArray(ms.speakers)
                                ? { speakers: ms.speakers }
                                : existingStoriesById.get(ms.id)?.speakers
                                    ? { speakers: existingStoriesById.get(ms.id).speakers }
                                    : {}
                        ),
                        sentences: ms.sentences.map(sent => {
                            const existingSentence = existingStoriesById
                                .get(ms.id)
                                ?.sentences
                                ?.find(sentence => sentence.number === sent.number);
                            const rawTokens = sent.tokens || [];
                            const finalTokens = [];
                            let currentThai = sent.thai;
                            let tIdx = 0;

                            for (const tok of rawTokens) {
                                while (currentThai.startsWith(" ")) {
                                    tIdx++;
                                    finalTokens.push({
                                        id: `l1-b${bossNum || 7}-s${sent.number || 9000}-t${tIdx}`,
                                        text: " ",
                                        kind: "space"
                                    });
                                    currentThai = currentThai.slice(1);
                                }

                                tIdx++;
                                finalTokens.push({
                                    id: `l1-b${bossNum || 7}-s${sent.number || 9000}-t${tIdx}`,
                                    text: tok.text,
                                    kind: tok.kind || "word",
                                    ...(tok.wordId ? { wordId: wordIdMap.get(tok.wordId) || tok.wordId } : {}),
                                    ...(tok.contextMeaning ? { contextMeaning: tok.contextMeaning } : {})
                                });
                                currentThai = currentThai.slice(tok.text.length);
                            }

                            while (currentThai.startsWith(" ")) {
                                tIdx++;
                                finalTokens.push({
                                    id: `l1-b${bossNum || 7}-s${sent.number || 9000}-t${tIdx}`,
                                    text: " ",
                                    kind: "space"
                                });
                                currentThai = currentThai.slice(1);
                            }

                            return {
                                id: `l1-b${bossNum || 7}-s${sent.number || 9000}`,
                                number: sent.number || 9000,
                                numberInStory: sent.numberInStory || 1,
                                thai: sent.thai,
                                transliteration: sent.transliteration || "",
                                translation: sent.translation,
                                audio: sent.audio || { type: "speechSynthesis" },
                                ...(
                                    sent.speakerId || existingSentence?.speakerId
                                        ? { speakerId: sent.speakerId || existingSentence.speakerId }
                                        : {}
                                ),
                                tokens: finalTokens
                            };
                        })
                    }));
                    addedSentencesCount += draft.sampleSentences.length;
                }
            }
        }

        diffItems.push({
            type: "Giga-Drill Block",
            id: draft.staging?.target || "Drill Unit",
            title: draft.topic || filename,
            target: "data/thai-giga-drill.v1.json",
            file: filename,
            details: `${draft.vocabulary?.length || 0} words (${addedWordsCount} new), ${draft.sampleSentences?.length || 0} sentences processed`
        });
    }

    if (isIngestMode && drillData) {
        try {
            // Compute firstSentenceId for all words
            const firstSentByWord = new Map();
            drillData.levels.forEach(lvl => {
                lvl.bosses.forEach(boss => {
                    boss.blocks.forEach(blk => {
                        blk.miniStories.forEach(ms => {
                            ms.sentences.forEach(sent => {
                                sent.tokens.forEach(tok => {
                                    if (tok.kind === "word" && tok.wordId && !firstSentByWord.has(tok.wordId)) {
                                        firstSentByWord.set(tok.wordId, sent.id);
                                    }
                                });
                            });
                        });
                    });
                });
            });

            drillData.words.forEach(w => {
                if (firstSentByWord.has(w.id)) {
                    w.firstSentenceId = firstSentByWord.get(w.id);
                }
            });

            const updatedJson = JSON.stringify(drillData, null, 2);
            JSON.parse(updatedJson);
            fs.writeFileSync(GIGA_DRILL_FILE, updatedJson, "utf8");
            log(`✓ Successfully integrated Giga Drill content into data/thai-giga-drill.v1.json`);

            // Automatically update vocabulary indexes
            try {
                const vocabSummary = drillData.words.map(w => ({
                    thai: w.thai,
                    tr: w.transliteration,
                    de: Array.isArray(w.meanings) ? w.meanings[0] : w.meanings,
                    first: w.firstSentenceId ? w.firstSentenceId.slice(0, 5) : "b1"
                }));
                fs.writeFileSync(path.join(ROOT_DIR, "data", "vocabulary-index.json"), JSON.stringify(vocabSummary), "utf8");

                let md = "# 📚 Bekannter Wortschatz · Thai Giga Drill\n\n";
                drillData.levels[0].bosses.forEach((boss, idx) => {
                    md += `## ${boss.title} — ${boss.grammarFocus || boss.topic}\n`;
                    const bossWords = drillData.words.filter(w => w.firstSentenceId && w.firstSentenceId.startsWith(`l1-b${idx + 1}`));
                    if (bossWords.length > 0) {
                        md += "| Thai | Lautschrift | Bedeutung |\n| :--- | :--- | :--- |\n";
                        bossWords.forEach(w => {
                            const m = Array.isArray(w.meanings) ? w.meanings.join(" / ") : w.meanings;
                            md += `| ${w.thai} | ${w.transliteration || ""} | ${m} |\n`;
                        });
                    }
                    md += "\n";
                });
                fs.writeFileSync(path.join(ROOT_DIR, "docs", "known-words-by-boss.md"), md, "utf8");
                log(`✓ Automatically updated vocabulary indexes (data/vocabulary-index.json & docs/known-words-by-boss.md)`);
            } catch (e) {
                log(`Notice: Could not regenerate vocab index: ${e.message}`);
            }

            archiveFiles(files, "drills");
        } catch (err) {
            if (originalRaw) {
                fs.writeFileSync(GIGA_DRILL_FILE, originalRaw, "utf8");
            }
            console.error(`\n========================================\nSTOP — Integration rollback triggered for thai-giga-drill.v1.json: ${err.message}\n========================================\n`);
            process.exit(1);
        }
    }

    return diffItems;
}

function archiveFiles(files, category) {
    ensureDir(PROCESSED_DIR);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    for (const file of files) {
        const base = path.basename(file);
        const target = path.join(PROCESSED_DIR, `${category}_${timestamp}_${base}`);
        fs.renameSync(file, target);
        log(`  -> Archived ${base} to ${path.relative(ROOT_DIR, target)}`);
    }
}

// ==========================================
// Human-Readable Preview Renderer
// ==========================================
function renderHumanReadablePreview(draft, filename) {
    const meta = draft.staging || {};
    const type = (meta.type || draft.type || "unknown").toLowerCase();
    const target = meta.target || draft.kapitel || "Unbekannt";
    const status = meta.status || "AWAITING HUMAN APPROVAL 👤";
    const model = meta.model || "Gemini 3.7 Flash";

    console.log(`\n` + "=".repeat(80));
    console.log(`CONTENT-VORSCHAU: ${target.toUpperCase()}`);
    console.log(`STATUS:          ${status}`);
    console.log(`Datei:           ${path.relative(ROOT_DIR, filename)}`);
    console.log(`Ersteller/Modell: ${model} (${meta.source || "Gemini"})`);
    console.log("=".repeat(80));

    if (type === "giga-drill" || type === "drill-vocabulary" || draft.sampleSentences || draft.vocabulary) {
        const vocabMap = new Map();
        if (Array.isArray(draft.vocabulary)) {
            for (const w of draft.vocabulary) {
                vocabMap.set(w.id || w.thai, w);
            }
        }

        // Production dictionary fallback for full card details
        let prodWordMap = new Map();
        if (fs.existsSync(GIGA_DRILL_FILE)) {
            try {
                const prodData = JSON.parse(fs.readFileSync(GIGA_DRILL_FILE, "utf8"));
                if (Array.isArray(prodData.words)) {
                    for (const pw of prodData.words) {
                        if (pw.id) prodWordMap.set(pw.id, pw);
                        if (pw.thai) prodWordMap.set(pw.thai, pw);
                    }
                }
            } catch (e) {}
        }

        if (Array.isArray(draft.sampleSentences)) {
            draft.sampleSentences.forEach((sent, idx) => {
                const sNum = sent.number || sent.id || (idx + 1);
                console.log(`\n──────────────────────────────────────────────────`);
                console.log(`Satz #${sNum}`);
                console.log(`🇹🇭 ${sent.thai}`);
                if (sent.transliteration) {
                    console.log(`🗣️  ${sent.transliteration}`);
                }
                console.log(`🇩🇪 ${sent.translation}`);

                if (Array.isArray(sent.tokens) && sent.tokens.some(t => t.kind === "word")) {
                    console.log(`\nWortkarten:`);
                    sent.tokens.filter(t => t.kind === "word").forEach(tok => {
                        const wordInfo = vocabMap.get(tok.wordId) || vocabMap.get(tok.text) || prodWordMap.get(tok.wordId) || prodWordMap.get(tok.text);
                        const trans = wordInfo?.transliteration ? ` (${wordInfo.transliteration})` : "";
                        console.log(`  • ${tok.text}${trans}`);
                        if (wordInfo?.meanings) {
                            console.log(`    → ${wordInfo.meanings.join(" / ")}`);
                        }
                        if (tok.contextMeaning) {
                            console.log(`    → Kontext: ${tok.contextMeaning}`);
                        }
                        const noteText = wordInfo?.note || wordInfo?.infoSentence;
                        if (noteText) {
                            console.log(`    → Hinweis: ${noteText}`);
                        }
                    });
                }
            });
        }
    } else if (type === "quest" || draft.deutschZeilen) {
        console.log(`Titel:         ${draft.titel}`);
        console.log(`Schwierigkeit: ${draft.schwierigkeit} | XP: ${draft.xp}`);
        console.log(`\nEinleitung / Story:\n${draft.story}`);
        console.log(`\nZeilen (${draft.thaiZeilen.length} Zeilen):`);
        draft.thaiZeilen.forEach((th, i) => {
            const de = draft.deutschZeilen[i] || "";
            console.log(`  [${i + 1}] 🇹🇭 ${th}`);
            console.log(`      🇩🇪 ${de}`);
        });
    } else if (type === "comedy" || draft.dialogue) {
        console.log(`Titel:         ${draft.titel}`);
        console.log(`Schwierigkeit: ${draft.schwierigkeit} | XP: ${draft.xp}`);
        console.log(`\nEinleitung / Story:\n${draft.story}`);
        console.log(`\nDialog:`);
        draft.dialogue.forEach((line) => {
            if (line.sceneIntro) {
                console.log(`\n  [Szene ${line.scene || ""}]`);
                console.log(`  📖 🇹🇭 ${line.thai}`);
                console.log(`     🇩🇪 ${line.deutsch}`);
            } else {
                const spk = line.speaker ? `${line.speaker.toUpperCase()}` : "Sprecher";
                console.log(`  👤 ${spk}:`);
                console.log(`     🇹🇭 ${line.thai}`);
                console.log(`     🇩🇪 ${line.deutsch}`);
            }
        });

        if (draft.glossary && Object.keys(draft.glossary).length > 0) {
            console.log(`\nGlossar & Wortkarten:`);
            for (const [w, entry] of Object.entries(draft.glossary)) {
                console.log(`  • ${w}: ${entry.de}`);
                if (entry.note) {
                    console.log(`    → Hinweis: ${entry.note}`);
                }
            }
        }
    }

    console.log(`\n` + "=".repeat(80));
    console.log(`👤 FREIGABE-ENTSCHEIDUNG (PHILIPP):`);
    console.log(`   JA   → Freigeben mit: npm run staging:ingest -- "${path.relative(ROOT_DIR, filename)}"`);
    console.log(`   NEIN → Entwurf in Staging anpassen oder von Gemini neu erstellen lassen.`);
    console.log("=".repeat(80) + `\n`);
}

// ==========================================
// Main Execution Flow
// ==========================================
function main() {
    ensureDir(STAGING_DIR);
    ensureDir(PROCESSED_DIR);

    const questFiles = getStagingFiles("quests");
    const comedyFiles = getStagingFiles("comedy");
    const drillFiles = getStagingFiles("drills");

    const totalFiles = questFiles.length + comedyFiles.length + drillFiles.length;
    if (totalFiles === 0) {
        log("No staging drafts found in data/staging/{quests,comedy,drills}. Nothing to do.");
        return;
    }

    // 1. Preview Mode
    if (isPreviewMode) {
        for (const f of [...questFiles, ...comedyFiles, ...drillFiles]) {
            const raw = fs.readFileSync(f, "utf8");
            const draft = JSON.parse(raw);
            renderHumanReadablePreview(draft, f);
        }
        return;
    }

    log(`Running Staging Pipeline in mode: ${isIngestMode ? "INGEST" : "VALIDATE ONLY"}`);
    log(`Found ${totalFiles} staging draft(s) across categories.`);

    // 2. Index production state for hard ID collision prevention
    const prodState = loadExistingProductionState();
    const batchIds = new Set();
    const report = { passes: [], warnings: [], errors: [] };

    // 3. Run Quality Gate Validation
    for (const f of questFiles) {
        try {
            const raw = fs.readFileSync(f, "utf8");
            const draft = JSON.parse(raw);
            validateQuestDraft(draft, path.basename(f), prodState, batchIds, report);
        } catch (err) {
            report.errors.push(`${path.basename(f)}: JSON parse / read error: ${err.message}`);
        }
    }
    for (const f of comedyFiles) {
        try {
            const raw = fs.readFileSync(f, "utf8");
            const draft = JSON.parse(raw);
            validateComedyDraft(draft, path.basename(f), prodState, batchIds, report);
        } catch (err) {
            report.errors.push(`${path.basename(f)}: JSON parse / read error: ${err.message}`);
        }
    }
    for (const f of drillFiles) {
        try {
            const raw = fs.readFileSync(f, "utf8");
            const draft = JSON.parse(raw);
            validateDrillDraft(draft, path.basename(f), prodState, batchIds, report);
        } catch (err) {
            report.errors.push(`${path.basename(f)}: JSON parse / read error: ${err.message}`);
        }
    }

    printValidationReport(report);

    // 4. Generate Diff
    const diffs = [];
    const questDiffs = ingestQuests(questFiles, prodState);
    const comedyDiffs = ingestComedy(comedyFiles, prodState);
    const drillDiffs = ingestDrills(drillFiles, prodState);
    diffs.push(...questDiffs, ...comedyDiffs, ...drillDiffs);

    generateDiffReport(diffs);

    if (isValidateOnly) {
        log(`Validation successful. To view formatted content preview: npm run staging:preview`);
        log(`To integrate these drafts into production: npm run staging:ingest`);
    } else {
        log(`Ingest complete. All ${diffs.length} item(s) integrated and archived.`);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    validateStagingMetadata,
    validateQuestDraft,
    validateComedyDraft,
    validateDrillDraft,
    loadExistingProductionState,
    renderHumanReadablePreview
};
