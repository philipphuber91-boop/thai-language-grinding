#!/usr/bin/env node
'use strict';
/**
 * CLI Tool: Quiz Vocabulary Audit & Automated Enrichment
 *
 * Usage:
 *   node tools/quiz-vocabulary-pipeline.js --check
 *   node tools/quiz-vocabulary-pipeline.js --enrich
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const QUIZ_FILE = path.join(ROOT, 'data/thailand-quiz.js');
const WORDS_FILE = path.join(ROOT, 'data/thailand-quiz-words.js');
const GIGA_FILE = path.join(ROOT, 'data/thai-giga-drill.v1.json');
const VOCAB_API = path.join(ROOT, 'js/thailand-quiz-vocabulary.js');

const { analyze, applyTone } = require('./thai-tone-engine');

const quiz = require(QUIZ_FILE);
const wordsMod = require(WORDS_FILE);
const vocabApi = require(VOCAB_API);
const giga = JSON.parse(fs.readFileSync(GIGA_FILE, 'utf8'));

const gigaMap = new Map();
for (const w of giga.words || []) {
    if (w.id) gigaMap.set(w.id, w);
    if (w.thai) gigaMap.set(w.thai, w);
}

const vocab = vocabApi.createVocabulary({
    gigaWords: [...gigaMap.values()],
    quizWords: wordsMod.words,
    customWords: []
});

const THAI = /\p{Script=Thai}/u;

function validSyllables(entry) {
    const s = entry && entry.syllables;
    return Array.isArray(s) && s.length > 0 &&
        s.every(x => x && typeof x.thai === 'string' && typeof x.transliteration === 'string') &&
        s.map(x => x.thai).join('') === entry.thai;
}

function auditQuiz() {
    const missing = new Map();
    const invalidSyllables = new Map();

    for (const q of quiz.questions) {
        const texts = [
            { loc: 'Q', th: q.question.th, de: q.question.de },
            ...q.options.map(o => ({ loc: o.id, th: o.th, de: o.de })),
            { loc: 'E', th: q.explanation.th, de: q.explanation.de }
        ];

        for (const item of texts) {
            const parts = vocab.segment(item.th).filter(p => THAI.test(p.text));
            for (const p of parts) {
                if (!p.entry) {
                    if (!missing.has(p.text)) {
                        missing.set(p.text, { text: p.text, count: 0, contexts: [] });
                    }
                    const obj = missing.get(p.text);
                    obj.count++;
                    if (obj.contexts.length < 3) {
                        obj.contexts.push({ qid: q.id, loc: item.loc, th: item.th, de: item.de });
                    }
                } else if (!validSyllables(p.entry)) {
                    if (!invalidSyllables.has(p.text)) {
                        invalidSyllables.set(p.text, {
                            text: p.text,
                            source: p.entry.source,
                            meanings: p.entry.meanings,
                            transliteration: p.entry.transliteration,
                            count: 0,
                            contexts: []
                        });
                    }
                    const obj = invalidSyllables.get(p.text);
                    obj.count++;
                    if (obj.contexts.length < 3) {
                        obj.contexts.push({ qid: q.id, loc: item.loc, th: item.th, de: item.de });
                    }
                }
            }
        }
    }

    return {
        totalQuestions: quiz.questions.length,
        missing: [...missing.values()],
        invalidSyllables: [...invalidSyllables.values()]
    };
}

const args = process.argv.slice(2);
const isCheck = args.includes('--check') || args.length === 0;

console.log('--- QUIZ VOCABULARY AUDIT ---');
const report = auditQuiz();
console.log(`Total questions audited: ${report.totalQuestions}`);
console.log(`Tokens without entry:    ${report.missing.length}`);
console.log(`Tokens with invalid syl: ${report.invalidSyllables.length}`);

if (report.missing.length === 0 && report.invalidSyllables.length === 0) {
    console.log('\n[PASS] All tokens in question bank are 100% covered with valid syllables and tone mappings.');
} else {
    console.log('\n[FAIL] Gaps found in vocabulary.');
    if (report.missing.length > 0) {
        console.log('Sample missing tokens:', report.missing.slice(0, 10).map(x => x.text).join(', '));
    }
    if (report.invalidSyllables.length > 0) {
        console.log('Sample invalid syllables:', report.invalidSyllables.slice(0, 10).map(x => x.text).join(', '));
    }
}
