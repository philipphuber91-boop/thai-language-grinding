const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "thai-giga-drill.v1.json");
const BOSS_ID = "level-1-grammar-boss-2";
const FIRST_SENTENCE = 791;
const LAST_SENTENCE = 910;

const content = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const sentences = [];

for (const level of content.levels || []) {
    for (const boss of level.bosses || []) {
        for (const block of boss.blocks || []) {
            for (const story of block.miniStories || []) {
                for (const sentence of story.sentences || []) {
                    sentences.push({ ...sentence, bossId: boss.id });
                }
            }
        }
    }
}

const sentencesById = new Map(sentences.map(sentence => [sentence.id, sentence]));
const scopedSentences = sentences.filter(sentence =>
    sentence.bossId === BOSS_ID &&
    sentence.number >= FIRST_SENTENCE &&
    sentence.number <= LAST_SENTENCE
);
const scopedSentenceIds = new Set(scopedSentences.map(sentence => sentence.id));

function findTokenCandidates(sentence, word, example) {
    if (Array.isArray(word.phraseParts) && word.phraseParts.length > 1) {
        const candidates = [];
        for (let index = 0; index < sentence.tokens.length; index += 1) {
            const matchesPhrase = word.phraseParts.every((part, offset) => {
                const token = sentence.tokens[index + offset];
                return token?.kind === "word" &&
                    token.text === part.thai &&
                    token.wordId === part.wordId;
            });
            const phraseThai = word.phraseParts
                .map(part => part.thai)
                .join("");
            if (
                matchesPhrase &&
                (!example.matchedToken || example.matchedToken === phraseThai)
            ) {
                candidates.push(sentence.tokens[index]);
            }
        }
        return candidates;
    }

    return (sentence.tokens || []).filter(token =>
        token.kind === "word" &&
        token.wordId === word.id &&
        (!example.matchedToken || example.matchedToken === token.text)
    );
}

function resolveByTokenId(sentence, word, example) {
    return findTokenCandidates(sentence, word, {
        ...example,
        matchedTokenId: undefined
    }).filter(token => token.id === example.matchedTokenId);
}

const audit = {
    scope: {
        bossId: BOSS_ID,
        firstSentence: FIRST_SENTENCE,
        lastSentence: LAST_SENTENCE,
        sentenceCount: scopedSentences.length
    },
    contextExamples: 0,
    missingTokenIds: 0,
    ambiguousLegacyReferences: [],
    unresolvedTokenIds: [],
    sampleSentences: []
};

for (const word of content.words || []) {
    const bossContext = word.bossContexts?.[BOSS_ID];
    for (const example of bossContext?.contextExamples || []) {
        if (!scopedSentenceIds.has(example.sentenceId)) {
            continue;
        }

        audit.contextExamples += 1;
        const sentence = sentencesById.get(example.sentenceId);
        const legacyCandidates = findTokenCandidates(sentence, word, example);

        if (!example.matchedTokenId) {
            audit.missingTokenIds += 1;
            if (legacyCandidates.length !== 1) {
                audit.ambiguousLegacyReferences.push({
                    wordId: word.id,
                    thai: word.thai,
                    sentenceId: sentence.id,
                    sentenceThai: sentence.thai,
                    matchedToken: example.matchedToken || "",
                    candidateTokenIds: legacyCandidates.map(token => token.id),
                    candidateMeanings: legacyCandidates.map(token => token.contextMeaning || "")
                });
            }
        } else if (resolveByTokenId(sentence, word, example).length !== 1) {
            audit.unresolvedTokenIds.push({
                wordId: word.id,
                sentenceId: sentence.id,
                matchedTokenId: example.matchedTokenId
            });
        }
    }
}

for (const sentenceId of [
    "l1-b2-s797",
    "l1-b2-s794",
    "l1-b2-s823",
    "l1-b2-s843",
    "l1-b2-s910"
]) {
    const sentence = sentencesById.get(sentenceId);
    if (!sentence || sentence.bossId !== BOSS_ID) {
        continue;
    }

    audit.sampleSentences.push({
        sentenceId,
        thai: sentence.thai,
        translation: sentence.translation,
        tokens: sentence.tokens
            .filter(token => token.kind === "word")
            .map(token => ({
                tokenId: token.id,
                thai: token.text,
                wordId: token.wordId,
                contextMeaning: token.contextMeaning || ""
            }))
    });
}

const duplicateReference = audit.ambiguousLegacyReferences.find(
    reference => reference.sentenceId === "l1-b2-s910" &&
        reference.wordId === "word-lo"
);
if (!duplicateReference || duplicateReference.candidateTokenIds.length !== 2) {
    throw new Error("Pilot-Erwartung nicht erfüllt: die doppelte แล้ว-Referenz wurde nicht erkannt.");
}

const simulatedTokenId = duplicateReference.candidateTokenIds[1];
const simulatedSentence = sentencesById.get(duplicateReference.sentenceId);
const simulatedResolution = resolveByTokenId(
    simulatedSentence,
    content.words.find(word => word.id === "word-lo"),
    {
    matchedTokenId: simulatedTokenId
    }
);
if (simulatedResolution.length !== 1) {
    throw new Error("Pilot-Erwartung nicht erfüllt: Token-ID löst die Referenz nicht eindeutig auf.");
}

console.log(`Context-Token-Audit-Pilot: Boss 2, Sätze ${FIRST_SENTENCE}-${LAST_SENTENCE}`);
console.log(`Geprüfte Sätze: ${audit.scope.sentenceCount}`);
console.log(`Kontextbeispiele: ${audit.contextExamples}`);
console.log(`Beispiele ohne matchedTokenId: ${audit.missingTokenIds}`);
console.log(`Mehrdeutige Legacy-Referenzen: ${audit.ambiguousLegacyReferences.length}`);
console.log(`Nicht auflösbare Token-IDs: ${audit.unresolvedTokenIds.length}`);
console.log("");
console.log(JSON.stringify({
    ...audit,
    tokenIdSimulation: {
        sentenceId: duplicateReference.sentenceId,
        candidateTokenIds: duplicateReference.candidateTokenIds,
        selectedTokenId: simulatedTokenId,
        resolvedTokenIds: simulatedResolution.map(token => token.id)
    }
}, null, 2));
