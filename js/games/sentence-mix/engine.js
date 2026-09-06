(function () {
    "use strict";

    /**
     * Mischt ein Array nach Fisher-Yates.
     */
    function fisherYatesShuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    /**
     * Erzeugt eine zufällige Mischung von Tokens, die bei N >= 2
     * GARANTIERT von der Originalreihenfolge abweicht.
     */
    function createGuaranteedShuffle(tokens) {
        if (!Array.isArray(tokens) || tokens.length === 0) {
            return [];
        }

        if (tokens.length === 1) {
            return [{
                displayNumber: 1,
                tokenId: tokens[0].id,
                text: tokens[0].text,
                wordId: tokens[0].wordId,
                transliteration: tokens[0].transliteration,
                syllables: tokens[0].syllables
            }];
        }

        const originalIds = tokens.map(function (t) { return t.id; });
        let shuffled = [];
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            shuffled = fisherYatesShuffle(tokens);
            const isIdentical = shuffled.every(function (token, idx) {
                return token.id === originalIds[idx];
            });

            if (!isIdentical) {
                break;
            }
            attempts++;
        }

        // Deterministischer Fallback, falls alle Zufallsläufe identisch waren
        if (shuffled.length >= 2 && shuffled.every(function (t, i) { return t.id === originalIds[i]; })) {
            const temp = shuffled[0];
            shuffled[0] = shuffled[1];
            shuffled[1] = temp;
        }

        return shuffled.map(function (token, index) {
            return {
                displayNumber: index + 1,
                tokenId: token.id,
                text: token.text,
                wordId: token.wordId,
                transliteration: token.transliteration,
                syllables: token.syllables
            };
        });
    }

    const BASE_POINTS_FOR_THREE_WORDS = 30;
    const POINTS_PER_ADDITIONAL_WORD = 10;
    const POINTS_LOSS_PER_SECOND = 3;
    const POINTS_LOSS_PER_SECOND_LONG_SENTENCE = 1.5;
    const LONG_SENTENCE_WORD_THRESHOLD = 7;
    const MINIMUM_POINTS_RATIO = 0.2;

    function normalizeWordCount(value) {
        return Math.max(0, Math.floor(Number(value) || 0));
    }

    function calculateMaxPoints(wordCount) {
        const normalizedWordCount = normalizeWordCount(wordCount);
        return Math.max(
            0,
            BASE_POINTS_FOR_THREE_WORDS +
                (normalizedWordCount - 3) * POINTS_PER_ADDITIONAL_WORD
        );
    }

    function getPointsLossPerSecond(wordCount) {
        return normalizeWordCount(wordCount) > LONG_SENTENCE_WORD_THRESHOLD
            ? POINTS_LOSS_PER_SECOND_LONG_SENTENCE
            : POINTS_LOSS_PER_SECOND;
    }

    function calculatePoints(maxPoints, durationMs, wordCount) {
        const normalizedMaxPoints = Math.max(0, Number(maxPoints) || 0);
        const normalizedDurationMs = Math.max(0, Number(durationMs) || 0);
        const minimumPoints = normalizedMaxPoints * MINIMUM_POINTS_RATIO;
        return Math.max(
            minimumPoints,
            normalizedMaxPoints -
                (normalizedDurationMs / 1000) * getPointsLossPerSecond(wordCount)
        );
    }

    // Occurrence IDs remain unique for the display, while identical word texts share a match key.
    function getTokenMatchKey(text) {
        return String(text || "").normalize("NFC").trim();
    }

    /**
     * SentenceMixEngine
     */
    function SentenceMixEngine() {
        this.currentRound = null;
        this.startTime = null;
        this.endTime = null;
    }

    SentenceMixEngine.prototype.startRound = function (roundModel) {
        if (!roundModel || !Array.isArray(roundModel.words) || roundModel.words.length === 0) {
            throw new Error("Ungültiges RoundModel für Wortmix.");
        }

        const displayPills = createGuaranteedShuffle(roundModel.words);
        const numberToTokenIdMap = {};
        const tokenIdToNumberMap = {};
        const tokenIdToMatchKeyMap = {};

        displayPills.forEach(function (pill) {
            numberToTokenIdMap[pill.displayNumber] = pill.tokenId;
            tokenIdToNumberMap[pill.tokenId] = pill.displayNumber;
            tokenIdToMatchKeyMap[pill.tokenId] = getTokenMatchKey(pill.text);
        });

        const expectedNumbers = roundModel.expectedTokenIds.map(function (tokenId) {
            return tokenIdToNumberMap[tokenId];
        });
        const expectedTokenMatchKeys = roundModel.expectedTokenIds.map(function (tokenId) {
            return tokenIdToMatchKeyMap[tokenId];
        });

        this.currentRound = {
            sentenceId: roundModel.sentenceId,
            thai: roundModel.thai,
            translation: roundModel.translation,
            transliteration: roundModel.transliteration,
            expectedTokenIds: roundModel.expectedTokenIds.slice(),
            expectedNumbers: expectedNumbers,
            displayPills: displayPills,
            numberToTokenIdMap: numberToTokenIdMap,
            tokenIdToNumberMap: tokenIdToNumberMap,
            tokenIdToMatchKeyMap: tokenIdToMatchKeyMap,
            expectedTokenMatchKeys: expectedTokenMatchKeys,
            tokenCount: displayPills.length,
            maxPoints: calculateMaxPoints(displayPills.length),
            isCompleted: false
        };

        this.startTime = (typeof performance !== "undefined" && typeof performance.now === "function")
            ? performance.now()
            : Date.now();
        this.endTime = null;

        return this.currentRound;
    };

    SentenceMixEngine.prototype.getElapsedTimeMs = function () {
        if (this.startTime === null) {
            return 0;
        }
        const now = (typeof performance !== "undefined" && typeof performance.now === "function")
            ? performance.now()
            : Date.now();
        const end = this.endTime === null ? now : this.endTime;
        return Math.max(0, end - this.startTime);
    };

    SentenceMixEngine.prototype.formatDuration = function (ms) {
        const seconds = ms / 1000;
        return seconds.toFixed(2) + " s";
    };

    /**
     * Validiert eine eingegebene Ziffernfolge gegen die erwarteten Token-IDs.
     * @param {Array<number|string>} inputNumbers Array aus Ziffern 1..N
     */
    SentenceMixEngine.prototype.validate = function (inputNumbers) {
        if (!this.currentRound) {
            throw new Error("Keine aktive Runde zum Validieren vorhanden.");
        }

        const now = (typeof performance !== "undefined" && typeof performance.now === "function")
            ? performance.now()
            : Date.now();
        const durationMs = this.getElapsedTimeMs();

        const normalizedNumbers = (Array.isArray(inputNumbers) ? inputNumbers : [])
            .map(function (n) { return Number(n); })
            .filter(function (n) { return Number.isInteger(n) && n > 0; });

        const enteredTokenIds = normalizedNumbers.map(function (num) {
            return this.currentRound.numberToTokenIdMap[num] || null;
        }, this);
        const enteredTokenMatchKeys = enteredTokenIds.map(function (tokenId) {
            if (tokenId === null) {
                return null;
            }
            return this.currentRound.tokenIdToMatchKeyMap[tokenId];
        }, this);

        const expectedMatchKeys = this.currentRound.expectedTokenMatchKeys;
        let isCorrect = false;

        if (enteredTokenMatchKeys.length === expectedMatchKeys.length) {
            isCorrect = enteredTokenMatchKeys.every(function (matchKey, index) {
                return matchKey !== null &&
                    matchKey !== undefined &&
                    matchKey === expectedMatchKeys[index];
            });
        }

        if (isCorrect) {
            this.endTime = now;
            this.currentRound.isCompleted = true;
        }

        return {
            isCorrect: isCorrect,
            enteredNumbers: normalizedNumbers,
            enteredTokenIds: enteredTokenIds,
            enteredTokenMatchKeys: enteredTokenMatchKeys,
            expectedNumbers: this.currentRound.expectedNumbers,
            expectedTokenIds: this.currentRound.expectedTokenIds,
            expectedTokenMatchKeys: expectedMatchKeys,
            durationMs: durationMs,
            durationFormatted: this.formatDuration(durationMs),
            maxPoints: this.currentRound.maxPoints,
            pointsExact: calculatePoints(
                this.currentRound.maxPoints,
                durationMs,
                this.currentRound.tokenCount
            )
        };
    };

    SentenceMixEngine.prototype.getCurrentRound = function () {
        return this.currentRound;
    };

    SentenceMixEngine.prototype.reset = function () {
        this.currentRound = null;
        this.startTime = null;
        this.endTime = null;
    };

    const sentenceMixEngineInstance = new SentenceMixEngine();
    sentenceMixEngineInstance.SentenceMixEngine = SentenceMixEngine;
    sentenceMixEngineInstance.createGuaranteedShuffle = createGuaranteedShuffle;
    sentenceMixEngineInstance.calculateMaxPoints = calculateMaxPoints;
    sentenceMixEngineInstance.calculatePoints = calculatePoints;
    sentenceMixEngineInstance.getPointsLossPerSecond = getPointsLossPerSecond;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = sentenceMixEngineInstance;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixEngine = sentenceMixEngineInstance;
    }
})();
