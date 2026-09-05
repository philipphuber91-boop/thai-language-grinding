(function () {
    "use strict";

    /**
     * Extrahiert nur spielbare Wort-Tokens (kind === "word") und bewahrt
     * die strikte Token-ID-Reihenfolge des Originals auf.
     */
    function extractPlayableTokens(sentence) {
        if (!sentence || !Array.isArray(sentence.tokens)) {
            return [];
        }

        return sentence.tokens.filter(function (token) {
            return token && token.kind === "word" && typeof token.id === "string" && token.id.trim() !== "";
        });
    }

    /**
     * Konvertiert einen Giga-Drill-Satz in das standardisierte Satzmix-Runden-Format.
     */
    function createRoundModelFromSentence(sentence, storyMeta) {
        if (!sentence) {
            return null;
        }

        const wordTokens = extractPlayableTokens(sentence);
        if (wordTokens.length === 0) {
            return null;
        }

        const expectedTokenIds = wordTokens.map(function (token) {
            return token.id;
        });

        const words = wordTokens.map(function (token) {
            return {
                id: token.id,
                text: token.text,
                wordId: token.wordId || ""
            };
        });

        return {
            sentenceId: sentence.id,
            thai: sentence.thai,
            translation: sentence.translation,
            transliteration: sentence.transliteration,
            expectedTokenIds: expectedTokenIds,
            words: words,
            tokenCount: words.length,
            meta: {
                levelId: storyMeta?.levelId || sentence.levelId || "",
                bossId: storyMeta?.bossId || sentence.bossId || "",
                storyId: storyMeta?.id || sentence.storyId || "",
                storyTitle: storyMeta?.title || ""
            }
        };
    }

    /**
     * Sammelt alle spielbaren Sätze aus den geladenen Giga-Drill-Daten.
     */
    function extractAllPlayableSentences(content) {
        const playable = [];
        if (!content || !Array.isArray(content.levels)) {
            return playable;
        }

        content.levels.forEach(function (level) {
            if (!Array.isArray(level.bosses)) return;
            level.bosses.forEach(function (boss) {
                if (!Array.isArray(boss.blocks)) return;
                boss.blocks.forEach(function (block) {
                    if (!Array.isArray(block.miniStories)) return;
                    block.miniStories.forEach(function (story) {
                        if (!Array.isArray(story.sentences)) return;
                        story.sentences.forEach(function (sentence) {
                            const roundModel = createRoundModelFromSentence(sentence, {
                                id: story.id,
                                title: story.title,
                                levelId: level.id,
                                bossId: boss.id,
                                blockId: block.id
                            });
                            if (roundModel && roundModel.tokenCount >= 2) {
                                playable.push(roundModel);
                            }
                        });
                    });
                });
            });
        });

        return playable;
    }

    /**
     * SentenceMixAdapter API
     */
    const SentenceMixAdapter = {
        extractPlayableTokens: extractPlayableTokens,
        createRoundModelFromSentence: createRoundModelFromSentence,
        extractAllPlayableSentences: extractAllPlayableSentences,

        async loadContent(url) {
            let content = null;
            if (typeof window !== "undefined" && window.thaiGigaDrill && typeof window.thaiGigaDrill.loadContent === "function") {
                content = await window.thaiGigaDrill.loadContent(url);
            } else if (typeof window !== "undefined" && window.thaiGigaDrill && typeof window.thaiGigaDrill.getContentFromStorage === "function") {
                content = window.thaiGigaDrill.getContentFromStorage();
            }

            if (!content) {
                const fetchUrl = url || "../data/thai-giga-drill.v1.json";
                const res = await fetch(fetchUrl);
                if (!res.ok) {
                    throw new Error("Giga-Drill Content konnte nicht geladen werden: " + res.status);
                }
                content = await res.json();
            }

            return extractAllPlayableSentences(content);
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = SentenceMixAdapter;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixAdapter = SentenceMixAdapter;
    }
})();
