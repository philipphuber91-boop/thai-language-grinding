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
                wordId: tokens[0].wordId
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
                wordId: token.wordId
            };
        });
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
            throw new Error("Ungültiges RoundModel für Satzmix.");
        }

        const displayPills = createGuaranteedShuffle(roundModel.words);
        const numberToTokenIdMap = {};
        const tokenIdToNumberMap = {};

        displayPills.forEach(function (pill) {
            numberToTokenIdMap[pill.displayNumber] = pill.tokenId;
            tokenIdToNumberMap[pill.tokenId] = pill.displayNumber;
        });

        const expectedNumbers = roundModel.expectedTokenIds.map(function (tokenId) {
            return tokenIdToNumberMap[tokenId];
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
            tokenCount: displayPills.length,
            isCompleted: false
        };

        this.startTime = (typeof performance !== "undefined" && typeof performance.now === "function")
            ? performance.now()
            : Date.now();
        this.endTime = null;

        return this.currentRound;
    };

    SentenceMixEngine.prototype.getElapsedTimeMs = function () {
        if (!this.startTime) {
            return 0;
        }
        const now = (typeof performance !== "undefined" && typeof performance.now === "function")
            ? performance.now()
            : Date.now();
        return Math.max(0, now - this.startTime);
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
        const durationMs = Math.max(0, (this.endTime || now) - this.startTime);

        const normalizedNumbers = (Array.isArray(inputNumbers) ? inputNumbers : [])
            .map(function (n) { return Number(n); })
            .filter(function (n) { return Number.isInteger(n) && n > 0; });

        const enteredTokenIds = normalizedNumbers.map(function (num) {
            return this.currentRound.numberToTokenIdMap[num] || null;
        }, this);

        const expectedIds = this.currentRound.expectedTokenIds;
        let isCorrect = false;

        if (enteredTokenIds.length === expectedIds.length) {
            isCorrect = enteredTokenIds.every(function (tokenId, index) {
                return tokenId !== null && tokenId === expectedIds[index];
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
            expectedNumbers: this.currentRound.expectedNumbers,
            expectedTokenIds: expectedIds,
            durationMs: durationMs,
            durationFormatted: this.formatDuration(durationMs)
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

    if (typeof module !== "undefined" && module.exports) {
        module.exports = sentenceMixEngineInstance;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixEngine = sentenceMixEngineInstance;
    }
})();
