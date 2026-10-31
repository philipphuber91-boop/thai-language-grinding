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

    function createWordTransliterationMap(content) {
        const transliterations = new Map();
        if (!content || !Array.isArray(content.words)) {
            return transliterations;
        }

        content.words.forEach(function (word) {
            if (
                word &&
                typeof word.id === "string" &&
                word.id.trim() !== "" &&
                typeof word.transliteration === "string" &&
                word.transliteration.trim() !== ""
            ) {
                transliterations.set(word.id, word.transliteration.trim());
            }
        });

        return transliterations;
    }

    function createWordDetailsMap(content) {
        const details = new Map();
        if (!content || !Array.isArray(content.words)) {
            return details;
        }

        content.words.forEach(function (word) {
            if (!word || typeof word.id !== "string" || word.id.trim() === "") {
                return;
            }

            details.set(word.id, {
                transliteration:
                    typeof word.transliteration === "string"
                        ? word.transliteration.trim()
                        : "",
                syllables: Array.isArray(word.syllables)
                    ? word.syllables.map(syllable => ({
                        thai: typeof syllable?.thai === "string" ? syllable.thai : "",
                        transliteration:
                            typeof syllable?.transliteration === "string"
                                ? syllable.transliteration
                                : ""
                    }))
                    : []
            });
        });

        return details;
    }

    /**
     * Konvertiert einen Giga-Drill-Satz in das standardisierte Wortmix-Runden-Format.
     */
    function createRoundModelFromSentence(sentence, storyMeta, wordTransliterations) {
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
            const wordDetails = wordTransliterations instanceof Map
                ? wordTransliterations.get(token.wordId)
                : null;
            const fallbackTransliteration = typeof wordDetails === "string"
                ? wordDetails
                : wordDetails?.transliteration || "";
            return {
                id: token.id,
                text: token.text,
                wordId: token.wordId || "",
                transliteration:
                    (typeof token.transliteration === "string" && token.transliteration.trim() !== ""
                        ? token.transliteration.trim()
                        : fallbackTransliteration),
                syllables: Array.isArray(token.syllables) && token.syllables.length > 0
                    ? token.syllables
                    : wordDetails && Array.isArray(wordDetails.syllables)
                        ? wordDetails.syllables
                        : []
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
                contentSource: "giga",
                levelId: storyMeta?.levelId || sentence.levelId || "",
                levelTitle: storyMeta?.levelTitle || "",
                bossId: storyMeta?.bossId || sentence.bossId || "",
                bossTitle: storyMeta?.bossTitle || "",
                grammarFocus: storyMeta?.grammarFocus || "",
                storyId: storyMeta?.id || sentence.storyId || "",
                storyTitle: storyMeta?.title || ""
            }
        };
    }

    function createRoundModelFromQuestLine(
        questId,
        quest,
        thai,
        translation,
        lineNumber,
        segmenter
    ) {
        if (typeof thai !== "string" || thai.trim() === "") {
            return null;
        }

        const wordSegments = [];
        Array.from(segmenter.segment(thai)).forEach(segment => {
            if (!segment.isWordLike || segment.segment.trim() === "") {
                return;
            }

            const previousSegment = wordSegments[wordSegments.length - 1];
            if (segment.segment === "ะ" && previousSegment) {
                // Thai's short vowel is part of the preceding word, not a word by itself.
                previousSegment.segment += segment.segment;
                return;
            }
            wordSegments.push({ segment: segment.segment });
        });

        const words = wordSegments.map((segment, index) => ({
                id: `quest-${questId}-line-${lineNumber}-word-${index + 1}`,
                text: segment.segment,
                wordId: "",
                transliteration: "",
                syllables: []
            }));

        if (words.length < 2) {
            return null;
        }

        const sentenceId = `quest-${questId}-line-${lineNumber}`;
        return {
            sentenceId,
            thai,
            translation: typeof translation === "string" ? translation : "",
            transliteration: "",
            expectedTokenIds: words.map(word => word.id),
            words,
            tokenCount: words.length,
            meta: {
                contentSource: "quests",
                questId: String(questId),
                questTitle: quest?.titel || quest?.title || `Quest ${questId}`,
                questChapter: quest?.kapitel || "",
                lineNumber
            }
        };
    }

    function getCampaignQuestOptions(questCollection) {
        if (!questCollection || typeof questCollection !== "object") {
            throw new TypeError("Die Kampagnen-Quests sind nicht verfügbar.");
        }

        return Object.entries(questCollection)
            .filter(([, quest]) =>
                quest &&
                Array.isArray(quest.thaiZeilen) &&
                quest.thaiZeilen.some(line =>
                    typeof line === "string" && line.trim() !== ""
                )
            )
            .map(([id, quest]) => ({
                id: String(id),
                title: quest.titel || quest.title || `Quest ${id}`,
                chapter: quest.kapitel || ""
            }));
    }

    function extractCampaignQuestSentences(questCollection) {
        if (!questCollection || typeof questCollection !== "object") {
            throw new TypeError("Die Kampagnen-Quests sind nicht verfügbar.");
        }
        if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
            throw new Error("Quest-Wordmix benötigt Thai-Wortsegmentierung in diesem Browser.");
        }

        const segmenter = new Intl.Segmenter("th", { granularity: "word" });
        const playable = [];
        Object.entries(questCollection).forEach(([questId, quest]) => {
            if (!quest || !Array.isArray(quest.thaiZeilen)) {
                return;
            }
            quest.thaiZeilen.forEach((thai, index) => {
                const round = createRoundModelFromQuestLine(
                    questId,
                    quest,
                    thai,
                    quest.deutschZeilen?.[index],
                    index + 1,
                    segmenter
                );
                if (round) {
                    playable.push(round);
                }
            });
        });
        return playable;
    }

    /**
     * Sammelt alle spielbaren Sätze aus den geladenen Giga-Drill-Daten.
     */
    function extractAllPlayableSentences(content) {
        const playable = [];
        if (!content || !Array.isArray(content.levels)) {
            return playable;
        }
        const wordTransliterations = createWordDetailsMap(content);

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
                                levelTitle: level.title,
                                bossId: boss.id,
                                bossTitle: boss.title,
                                grammarFocus: boss.grammarFocus,
                                blockId: block.id
                            }, wordTransliterations);
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
        createWordTransliterationMap: createWordTransliterationMap,
        createWordDetailsMap: createWordDetailsMap,
        createRoundModelFromSentence: createRoundModelFromSentence,
        extractAllPlayableSentences: extractAllPlayableSentences,
        createRoundModelFromQuestLine: createRoundModelFromQuestLine,
        getCampaignQuestOptions: getCampaignQuestOptions,
        extractCampaignQuestSentences: extractCampaignQuestSentences,

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
        },

        async loadPlaylist(url) {
            let raw = "";
            try {
                raw = localStorage.getItem("thaiGigaDrill:v1:audio-playlist") || "";
            } catch (error) {
                throw new Error("Die Audio-Playlist konnte nicht gelesen werden.", { cause: error });
            }

            if (!raw) {
                return [];
            }

            let stored;
            try {
                stored = JSON.parse(raw);
            } catch (error) {
                throw new Error("Die gespeicherte Audio-Playlist ist ungültig.", { cause: error });
            }

            const sentenceIds = Array.isArray(stored?.playlist)
                ? stored.playlist.filter(id => typeof id === "string" && id.trim() !== "")
                : [];
            if (sentenceIds.length === 0) {
                return [];
            }

            const sentences = await this.loadContent(url);
            const sentencesById = new Map(sentences.map(sentence => [sentence.sentenceId, sentence]));
            return sentenceIds
                .map(sentenceId => sentencesById.get(sentenceId))
                .filter(Boolean);
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = SentenceMixAdapter;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixAdapter = SentenceMixAdapter;
    }
})();
