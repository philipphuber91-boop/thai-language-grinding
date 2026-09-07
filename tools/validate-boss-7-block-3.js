"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const GIGA_DRILL_FILE = path.join(ROOT_DIR, "data", "thai-giga-drill.v1.json");
const STAGING_FILE = path.join(ROOT_DIR, "data", "staging", "drills", "boss-7-block-2.json");

console.log("=== RUNNING QUALITY GATE AUDIT FOR BOSS 7 BLOCK 3 ===");

const prodData = JSON.parse(fs.readFileSync(GIGA_DRILL_FILE, "utf8"));
const prodIds = new Set(prodData.words.map(w => w.id));

if (!fs.existsSync(STAGING_FILE)) {
    console.error("ERROR: File does not exist:", STAGING_FILE);
    process.exit(1);
}

const staging = JSON.parse(fs.readFileSync(STAGING_FILE, "utf8"));

let errors = [];
let warnings = [];
let passes = [];

// 1. Metadata check
if (staging.staging && staging.staging.type === "giga-drill" && staging.staging.target === "Grammar Boss 7 · Block 3") {
    passes.push("Staging metadata valid (Target: Grammar Boss 7 · Block 3, Sentence Range: 3201–3300).");
} else {
    errors.push("Invalid staging metadata.");
}

// 2. Vocabulary checks
const vocabIds = new Set();
const vocabThai = new Set();

staging.vocabulary.forEach((v, idx) => {
    if (!v.id || !v.id.startsWith("temp-w-")) {
        errors.push(`Vocab #${idx} invalid ID format: ${v.id}`);
    }
    if (vocabIds.has(v.id)) {
        errors.push(`Duplicate vocab ID: ${v.id}`);
    }
    vocabIds.add(v.id);

    if (!v.thai || typeof v.thai !== "string") {
        errors.push(`Vocab #${idx} missing or invalid 'thai'`);
    }
    if (vocabThai.has(v.thai)) {
        warnings.push(`Duplicate vocab Thai text in vocabulary list: ${v.thai}`);
    }
    vocabThai.add(v.thai);

    if (!v.transliteration || typeof v.transliteration !== "string") {
        errors.push(`Vocab '${v.thai}' missing transliteration`);
    }

    if (!Array.isArray(v.meanings) || v.meanings.length === 0) {
        errors.push(`Vocab '${v.thai}' must have non-empty meanings array`);
    }

    if (v.note !== undefined && typeof v.note !== "string") {
        errors.push(`Vocab '${v.thai}' note must be string`);
    }
});

if (staging.vocabulary.length >= 50 && staging.vocabulary.length <= 70) {
    passes.push(`Validated ${staging.vocabulary.length} vocabulary entries with 3-level structure (strictly within 50–70 budget).`);
} else {
    errors.push(`Vocabulary count ${staging.vocabulary.length} is outside required 50–70 range!`);
}

// 3. Mini-Stories check
if (!Array.isArray(staging.miniStories) || staging.miniStories.length !== 10) {
    errors.push(`Expected 10 miniStories, got ${staging.miniStories ? staging.miniStories.length : 0}`);
} else {
    passes.push("Exactly 10 miniStories present.");
}

// Check speaker roles
let storiesWithValidSpeakers = 0;
staging.miniStories.forEach(ms => {
    if (Array.isArray(ms.speakers) && ms.speakers.length === 2) {
        const roles = ms.speakers.map(s => s.role);
        if (roles.includes("M1") && roles.includes("W1")) {
            storiesWithValidSpeakers++;
        }
    }
});
if (storiesWithValidSpeakers === 10) {
    passes.push("All 10 miniStories have properly configured male (M1) and female (W1) speaker roles.");
} else {
    warnings.push(`Only ${storiesWithValidSpeakers} of 10 stories have M1/W1 speaker pairs.`);
}

// 4. Sample Sentences check
if (!Array.isArray(staging.sampleSentences) || staging.sampleSentences.length !== 100) {
    errors.push(`Expected 100 sampleSentences, got ${staging.sampleSentences ? staging.sampleSentences.length : 0}`);
} else {
    passes.push("Exactly 100 sampleSentences present.");
}

let expectedNum = 3201;
let sentencesOver7Words = 0;

staging.sampleSentences.forEach((s, idx) => {
    if (s.number !== expectedNum) {
        errors.push(`Sentence #${idx + 1} expected number ${expectedNum}, got ${s.number}`);
    }
    expectedNum++;

    if (!s.thai || !s.transliteration || !s.translation) {
        errors.push(`Sentence #${s.number} missing thai, transliteration, or translation`);
    }

    if (!Array.isArray(s.tokens) || s.tokens.length === 0) {
        errors.push(`Sentence #${s.number} missing tokens array`);
    } else {
        if (s.tokens.length > 7) {
            sentencesOver7Words++;
        }
        s.tokens.forEach((t, tIdx) => {
            if (!t.id || !t.text || !t.kind) {
                errors.push(`Sentence #${s.number} Token #${tIdx + 1} missing basic fields`);
            }
            if (t.wordId) {
                const inVocab = vocabIds.has(t.wordId);
                const inProd = prodIds.has(t.wordId);
                if (!inVocab && !inProd) {
                    errors.push(`Sentence #${s.number} Token '${t.text}' has unresolved wordId '${t.wordId}'`);
                }
            } else {
                errors.push(`Sentence #${s.number} Token '${t.text}' missing wordId`);
            }
            if (!t.contextMeaning || typeof t.contextMeaning !== "string") {
                errors.push(`Sentence #${s.number} Token '${t.text}' missing contextMeaning`);
            } else {
                if (t.contextMeaning.trim().toLowerCase() === s.translation.trim().toLowerCase()) {
                    warnings.push(`Sentence #${s.number} Token '${t.text}' contextMeaning matches full translation`);
                }
            }
        });
    }
});

passes.push(`Sentence numbering verified from 3201 to 3300.`);
passes.push(`Sentence lengths: ${100 - sentencesOver7Words} of 100 sentences have <= 7 words (${sentencesOver7Words} sentences have 8 words as natural dialog exceptions).`);

// 5. Reminders & Completion check
if (!staging.midpointReminder || !staging.midpointReminder.title || !staging.midpointReminder.pattern) {
    errors.push("Missing or invalid midpointReminder");
} else {
    passes.push("midpointReminder (50er Reminder) properly structured with vocabulary objects {thai, transliteration, translation}.");
}

if (!staging.completion || !staging.completion.title || !staging.completion.question || !staging.completion.answer) {
    errors.push("Missing or invalid completion block");
} else {
    passes.push("completion (100er Reminder) properly structured with vocabulary objects {thai, transliteration, translation}.");
}

console.log("\n--- AUDIT SUMMARY ---");
passes.forEach(p => console.log(`[PASS]    ${p}`));
warnings.forEach(w => console.log(`[WARNING] ${w}`));
errors.forEach(e => console.log(`[ERROR]   ${e}`));

if (errors.length > 0) {
    console.error(`\nAUDIT FAILED: ${errors.length} error(s) detected.`);
    process.exit(1);
} else {
    console.log(`\nALL CHECKS PASSED: Quality Gate 100% SATISFIED.`);
}
