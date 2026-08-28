(function () {
    "use strict";

    const CONTENT_STORAGE_KEY = "thaiGigaDrill:v1:content";
    const PROGRESS_STORAGE_KEY = "thaiGigaDrill:v1:progress";
    const TYPING_SENTENCE_STORAGE_KEY = "thaiGigaDrill:v1:typing-sentence";
    const TYPING_SENTENCES_STORAGE_KEY = "thaiGigaDrill:v1:typing-sentences";
    const REQUIRED_BLOCK_COUNT = 5;
    const REQUIRED_STORY_COUNT = 10;
    const REQUIRED_SENTENCE_COUNT = 10;

    function createValidationError(path, message) {
        return { path, message };
    }

    function isRecord(value) {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    function requireString(value, path, errors) {
        if (typeof value !== "string" || value.trim() === "") {
            errors.push(createValidationError(path, "Muss ein nichtleerer String sein."));
            return false;
        }

        return true;
    }

    function validateUniqueId(id, path, ids, errors) {
        if (!requireString(id, path, errors)) {
            return;
        }

        if (ids.has(id)) {
            errors.push(createValidationError(path, `ID "${id}" wurde bereits verwendet.`));
            return;
        }

        ids.add(id);
    }

    function validateAudio(audio, path, errors) {
        if (audio === null || audio === undefined) {
            return;
        }

        if (!isRecord(audio)) {
            errors.push(createValidationError(path, "Audio muss ein Objekt oder null sein."));
            return;
        }

        requireString(audio.type, `${path}.type`, errors);

        if (
            audio.type !== "speechSynthesis" &&
            audio.type !== "url" &&
            audio.type !== "none"
        ) {
            errors.push(
                createValidationError(
                    `${path}.type`,
                    "Erlaubt sind speechSynthesis, url oder none."
                )
            );
        }

        if (audio.type === "url") {
            requireString(audio.src, `${path}.src`, errors);
        }

        if (audio.type === "speechSynthesis" && audio.text !== undefined) {
            requireString(audio.text, `${path}.text`, errors);
        }
    }

    function validateSupplementalContent(value, path, errors) {
        if (value === undefined || value === null) {
            return;
        }

        if (!isRecord(value) && !Array.isArray(value)) {
            errors.push(createValidationError(path, "Muss ein Objekt oder Array sein."));
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((entry, index) => {
                validateSupplementalContent(entry, `${path}[${index}]`, errors);
            });
            return;
        }

        ["title", "heading", "message", "lead", "progress"].forEach(field => {
            if (value[field] !== undefined) {
                requireString(value[field], `${path}.${field}`, errors);
            }
        });

        ["wordIds", "sentenceIds"].forEach(field => {
            if (value[field] === undefined) {
                return;
            }

            if (!Array.isArray(value[field])) {
                errors.push(
                    createValidationError(`${path}.${field}`, "Muss ein Array sein.")
                );
                return;
            }

            value[field].forEach((id, index) => {
                requireString(id, `${path}.${field}[${index}]`, errors);
            });
        });
    }

    function validateToken(token, path, wordIds, errors) {
        if (!isRecord(token)) {
            errors.push(createValidationError(path, "Token muss ein Objekt sein."));
            return;
        }

        requireString(token.id, `${path}.id`, errors);
        requireString(token.text, `${path}.text`, errors);
        requireString(token.kind, `${path}.kind`, errors);
        const kind = token.kind;

        if (!["word", "punctuation", "space"].includes(kind)) {
            errors.push(
                createValidationError(
                    `${path}.kind`,
                    "Token-kind muss word, punctuation oder space sein."
                )
            );
        }

        if (kind === "word") {
            requireString(token.wordId, `${path}.wordId`, errors);
        }

        if (
            typeof token.wordId === "string" &&
            token.wordId.trim() !== "" &&
            !wordIds.has(token.wordId)
        ) {
            errors.push(
                createValidationError(
                    `${path}.wordId`,
                    `Unbekannte Wort-ID "${token.wordId}".`
                )
            );
        }
    }

    function validateSentence(sentence, path, ids, wordIds, errors) {
        if (!isRecord(sentence)) {
            errors.push(createValidationError(path, "Satz muss ein Objekt sein."));
            return;
        }

        validateUniqueId(sentence.id, `${path}.id`, ids, errors);
        requireString(sentence.thai, `${path}.thai`, errors);
        requireString(sentence.transliteration, `${path}.transliteration`, errors);
        requireString(sentence.translation, `${path}.translation`, errors);

        if (!Array.isArray(sentence.tokens) || sentence.tokens.length === 0) {
            errors.push(
                createValidationError(
                    `${path}.tokens`,
                    "Jeder Satz braucht mindestens ein kanonisches Token."
                )
            );
        } else {
            sentence.tokens.forEach((token, index) => {
                validateToken(token, `${path}.tokens[${index}]`, wordIds, errors);
            });
        }

        validateAudio(sentence.audio, `${path}.audio`, errors);
    }

    function validateWord(word, path, wordIds, errors) {
        if (!isRecord(word)) {
            errors.push(createValidationError(path, "Wort muss ein Objekt sein."));
            return;
        }

        requireString(word.id, `${path}.id`, errors);
        requireString(word.thai, `${path}.thai`, errors);
        requireString(word.transliteration, `${path}.transliteration`, errors);

        if (!Array.isArray(word.meanings) || word.meanings.length === 0) {
            errors.push(
                createValidationError(
                    `${path}.meanings`,
                    "Jedes Wort braucht mindestens eine Bedeutung."
                )
            );
        } else {
            word.meanings.forEach((meaning, index) => {
                requireString(meaning, `${path}.meanings[${index}]`, errors);
            });
        }
    }

    function validateContent(content) {
        const errors = [];
        const ids = new Set();
        const wordIds = new Set();

        if (!isRecord(content)) {
            return {
                valid: false,
                errors: [createValidationError("$", "Content muss ein Objekt sein.")]
            };
        }

        if (content.schemaVersion !== 1) {
            errors.push(
                createValidationError("$.schemaVersion", "Nur Schema-Version 1 wird unterstützt.")
            );
        }

        requireString(content.contentVersion, "$.contentVersion", errors);
        requireString(content.contentStatus, "$.contentStatus", errors);
        const isDraftContent =
            content.contentStatus === "draft" ||
            content.contentStatus === "placeholder-only";

        if (content.language !== "th") {
            errors.push(createValidationError("$.language", "Die Sprache muss th sein."));
        }

        if (!Array.isArray(content.archivedIds)) {
            errors.push(
                createValidationError("$.archivedIds", "ArchivedIds muss ein Array sein.")
            );
        } else {
            const archivedIds = new Set();
            content.archivedIds.forEach((id, index) => {
                const path = `$.archivedIds[${index}]`;
                if (!requireString(id, path, errors)) {
                    return;
                }

                if (archivedIds.has(id)) {
                    errors.push(createValidationError(path, `Archivierte ID "${id}" ist doppelt.`));
                }
                if (ids.has(id)) {
                    errors.push(
                        createValidationError(
                            path,
                            `Archivierte ID "${id}" wird im aktiven Content wiederverwendet.`
                        )
                    );
                }
                archivedIds.add(id);
            });
        }

        if (Array.isArray(content.words)) {
            content.words.forEach((word, wordIndex) => {
                if (isRecord(word) && typeof word.id === "string" && word.id.trim() !== "") {
                    const path = `$.words[${wordIndex}].id`;
                    if (ids.has(word.id)) {
                        errors.push(
                            createValidationError(path, `ID "${word.id}" wurde bereits verwendet.`)
                        );
                    } else {
                        ids.add(word.id);
                    }
                    wordIds.add(word.id);
                }
            });
        }

        if (!Array.isArray(content.levels)) {
            errors.push(createValidationError("$.levels", "Levels muss ein Array sein."));
        } else {
            content.levels.forEach((level, levelIndex) => {
                const levelPath = `$.levels[${levelIndex}]`;

                if (!isRecord(level)) {
                    errors.push(createValidationError(levelPath, "Level muss ein Objekt sein."));
                    return;
                }

                validateUniqueId(level.id, `${levelPath}.id`, ids, errors);
                requireString(level.title, `${levelPath}.title`, errors);

                if (!Array.isArray(level.bosses)) {
                    errors.push(
                        createValidationError(`${levelPath}.bosses`, "Bosses muss ein Array sein.")
                    );
                    return;
                }

                level.bosses.forEach((boss, bossIndex) => {
                    const bossPath = `${levelPath}.bosses[${bossIndex}]`;

                    if (!isRecord(boss)) {
                        errors.push(createValidationError(bossPath, "Boss muss ein Objekt sein."));
                        return;
                    }

                    validateUniqueId(boss.id, `${bossPath}.id`, ids, errors);
                    requireString(boss.title, `${bossPath}.title`, errors);
                    requireString(boss.grammarFocus, `${bossPath}.grammarFocus`, errors);
                    validateSupplementalContent(
                        boss.reminders,
                        `${bossPath}.reminders`,
                        errors
                    );
                    validateSupplementalContent(
                        boss.completion,
                        `${bossPath}.completion`,
                        errors
                    );

                    if (
                        !Array.isArray(boss.blocks) ||
                        (
                            isDraftContent
                                ? boss.blocks.length < 1 ||
                                    boss.blocks.length > REQUIRED_BLOCK_COUNT
                                : boss.blocks.length !== REQUIRED_BLOCK_COUNT
                        )
                    ) {
                        errors.push(
                            createValidationError(
                                `${bossPath}.blocks`,
                                isDraftContent
                                    ? `Ein Entwurfs-Boss muss zwischen 1 und ${REQUIRED_BLOCK_COUNT} Foundation-Blöcke enthalten.`
                                    : `Ein Boss muss genau ${REQUIRED_BLOCK_COUNT} Foundation-Blöcke enthalten.`
                            )
                        );
                        return;
                    }

                    boss.blocks.forEach((block, blockIndex) => {
                        const blockPath = `${bossPath}.blocks[${blockIndex}]`;

                        if (!isRecord(block)) {
                            errors.push(createValidationError(blockPath, "Block muss ein Objekt sein."));
                            return;
                        }

                        validateUniqueId(block.id, `${blockPath}.id`, ids, errors);
                        requireString(block.title, `${blockPath}.title`, errors);
                        validateSupplementalContent(
                            block.reminder,
                            `${blockPath}.reminder`,
                            errors
                        );
                        validateSupplementalContent(
                            block.completion,
                            `${blockPath}.completion`,
                            errors
                        );

                        if (
                            !Array.isArray(block.miniStories) ||
                            block.miniStories.length !== REQUIRED_STORY_COUNT
                        ) {
                            errors.push(
                                createValidationError(
                                    `${blockPath}.miniStories`,
                                    `Ein Foundation-Block muss genau ${REQUIRED_STORY_COUNT} Mini-Storys enthalten.`
                                )
                            );
                            return;
                        }

                        block.miniStories.forEach((story, storyIndex) => {
                            const storyPath = `${blockPath}.miniStories[${storyIndex}]`;

                            if (!isRecord(story)) {
                                errors.push(
                                    createValidationError(storyPath, "Mini-Story muss ein Objekt sein.")
                                );
                                return;
                            }

                            validateUniqueId(story.id, `${storyPath}.id`, ids, errors);
                            requireString(story.title, `${storyPath}.title`, errors);
                            if (story.context !== undefined) {
                                requireString(story.context, `${storyPath}.context`, errors);
                            }

                            if (
                                !Array.isArray(story.sentences) ||
                                story.sentences.length !== REQUIRED_SENTENCE_COUNT
                            ) {
                                errors.push(
                                    createValidationError(
                                        `${storyPath}.sentences`,
                                        `Eine Mini-Story muss genau ${REQUIRED_SENTENCE_COUNT} Sätze enthalten.`
                                    )
                                );
                                return;
                            }

                            story.sentences.forEach((sentence, sentenceIndex) => {
                                validateSentence(
                                    sentence,
                                    `${storyPath}.sentences[${sentenceIndex}]`,
                                    ids,
                                    wordIds,
                                    errors
                                );
                            });
                        });
                    });
                });
            });
        }

        if (!Array.isArray(content.words)) {
            errors.push(createValidationError("$.words", "Words muss ein Array sein."));
        } else {
            content.words.forEach((word, wordIndex) => {
                validateWord(word, `$.words[${wordIndex}]`, wordIds, errors);
            });
        }

        if (Array.isArray(content.archivedIds)) {
            content.archivedIds.forEach((id, index) => {
                if (typeof id === "string" && ids.has(id)) {
                    errors.push(
                        createValidationError(
                            `$.archivedIds[${index}]`,
                            `Archivierte ID "${id}" wird im aktiven Content wiederverwendet.`
                        )
                    );
                }
            });
        }

        return { valid: errors.length === 0, errors };
    }

    function buildIndexes(content) {
        const sentencesById = new Map();
        const storiesById = new Map();
        const wordsById = new Map();
        const sentenceIdsByWordId = new Map();

        (content.words || []).forEach(word => {
            wordsById.set(word.id, word);
            sentenceIdsByWordId.set(word.id, []);
        });

        (content.levels || []).forEach(level => {
            level.bosses.forEach(boss => {
                let bossSentenceNumber = 0;
                boss.blocks.forEach(block => {
                    block.miniStories.forEach(story => {
                        storiesById.set(story.id, {
                            ...story,
                            levelId: level.id,
                            levelTitle: level.title,
                            bossId: boss.id,
                            bossTitle: boss.title,
                            blockId: block.id,
                            blockTitle: block.title
                        });

                        story.sentences.forEach((sentence, index) => {
                            const indexedSentence = {
                                ...sentence,
                                numberInStory: index + 1,
                                numberInBoss: ++bossSentenceNumber,
                                levelId: level.id,
                                bossId: boss.id,
                                blockId: block.id,
                                storyId: story.id
                            };

                            sentencesById.set(sentence.id, indexedSentence);

                            sentence.tokens.forEach(token => {
                                if (typeof token.wordId !== "string" || token.wordId.trim() === "") {
                                    return;
                                }

                                const sentenceIds = sentenceIdsByWordId.get(token.wordId);
                                if (sentenceIds && !sentenceIds.includes(sentence.id)) {
                                    sentenceIds.push(sentence.id);
                                }
                            });
                        });
                    });
                });
            });
        });

        return { sentencesById, storiesById, wordsById, sentenceIdsByWordId };
    }

    function getStoredProgress() {
        try {
            const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
            const progress = raw ? JSON.parse(raw) : {};

            return {
                levelId: typeof progress.levelId === "string" ? progress.levelId : "",
                bossId: typeof progress.bossId === "string" ? progress.bossId : "",
                blockId: typeof progress.blockId === "string" ? progress.blockId : "",
                storyId: typeof progress.storyId === "string" ? progress.storyId : "",
                sentenceId: typeof progress.sentenceId === "string" ? progress.sentenceId : "",
                completedSentenceIds: Array.isArray(progress.completedSentenceIds)
                    ? progress.completedSentenceIds.filter(id => typeof id === "string")
                    : []
            };
        } catch (error) {
            console.warn("Thai-Giga-Fortschritt konnte nicht gelesen werden.", error);
            return {
                levelId: "",
                bossId: "",
                blockId: "",
                storyId: "",
                sentenceId: "",
                completedSentenceIds: []
            };
        }
    }

    function saveProgress(update) {
        const progress = { ...getStoredProgress(), ...update };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
        return progress;
    }

    function getTypingAudio(sentence) {
        return {
            type: "speechSynthesis",
            lang: "th-TH",
            voiceId: ""
        };
    }

    function getTypingSentence(sentence, story) {
        return {
            id: sentence.id,
            version: 1,
            titel: story.title,
            thaiZeilen: [sentence.thai],
            deutschZeilen: [sentence.translation],
            transliterationZeilen: [sentence.transliteration],
            gigaDrill: true,
            gigaDrillSentenceId: sentence.id,
            gigaDrillStoryId: story.id,
            gigaDrillTokens: sentence.tokens,
            gigaDrillTokensByLine: [sentence.tokens],
            audio: getTypingAudio(sentence)
        };
    }

    function cacheTypingSentences(content) {
        const snapshots = {};
        content.levels.forEach(level => {
            level.bosses.forEach(boss => {
                boss.blocks.forEach(block => {
                    block.miniStories.forEach(story => {
                        story.sentences.forEach(sentence => {
                            snapshots[sentence.id] = getTypingSentence(sentence, {
                                title: story.title,
                                id: story.id
                            });
                        });
                    });
                });
            });
        });
        localStorage.setItem(TYPING_SENTENCES_STORAGE_KEY, JSON.stringify(snapshots));
    }

    function getSharedPlaylistEntry(sentence, story) {
        return {
            contentMode: "thai-giga",
            sentenceId: sentence.id,
            storyId: story.id,
            sentence: getTypingSentence(sentence, story)
        };
    }

    function getTypingPlaylistSentence(sentenceIds) {
        if (!Array.isArray(sentenceIds)) {
            return null;
        }

        const content = getContentFromStorage();
        if (!content) {
            return null;
        }

        const indexes = buildIndexes(content);
        const typingSentences = sentenceIds
            .map(sentenceId => {
                const sentence = indexes.sentencesById.get(sentenceId);
                const story = sentence
                    ? indexes.storiesById.get(sentence.storyId)
                    : null;
                return sentence && story ? getTypingSentence(sentence, story) : null;
            })
            .filter(Boolean);

        if (typingSentences.length === 0) {
            return null;
        }

        return {
            id: "thai-giga-playlist",
            version: 1,
            titel: "Thai-Giga Typing-Playlist",
            thaiZeilen: typingSentences.flatMap(sentence => sentence.thaiZeilen),
            deutschZeilen: typingSentences.flatMap(sentence => sentence.deutschZeilen),
            transliterationZeilen: typingSentences.flatMap(
                sentence => sentence.transliterationZeilen
            ),
            gigaDrill: true,
            gigaDrillPlaylist: true,
            gigaDrillSentenceIds: typingSentences.map(
                sentence => sentence.gigaDrillSentenceId
            ),
            gigaDrillTokensByLine: typingSentences.flatMap(
                sentence => sentence.gigaDrillTokensByLine
            ),
            audio: { type: "none" }
        };
    }

    function openSentenceInTyping(sentence, story) {
        const typingSentence = getTypingSentence(sentence, story);
        localStorage.setItem(TYPING_SENTENCE_STORAGE_KEY, JSON.stringify(typingSentence));
        localStorage.setItem("contentMode", "thai-giga");
        localStorage.setItem("aktuelleQuest", sentence.id);
        localStorage.setItem("questMode", "learning");
        window.location.href = "typing.html";
    }

    function openTypingPlaylistInTyping(sentenceIds) {
        const typingPlaylist = getTypingPlaylistSentence(sentenceIds);
        if (!typingPlaylist) {
            return false;
        }

        localStorage.setItem(
            TYPING_SENTENCE_STORAGE_KEY,
            JSON.stringify(typingPlaylist)
        );
        localStorage.setItem("contentMode", "thai-giga");
        localStorage.setItem("aktuelleQuest", typingPlaylist.id);
        localStorage.setItem("questMode", "learning");
        window.location.href = "typing.html";
        return true;
    }

    function getContentFromStorage() {
        try {
            const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn("Gespeicherter Thai-Giga-Content ist ungültig.", error);
            return null;
        }
    }

    async function loadContent(url = "../data/thai-giga-drill.v1.json") {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Thai-Giga-Content konnte nicht geladen werden (${response.status}).`);
        }

        const content = await response.json();
        const validation = validateContent(content);

        if (!validation.valid) {
            const details = validation.errors
                .map(error => `${error.path}: ${error.message}`)
                .join("\n");
            throw new Error(`Thai-Giga-Content ist ungültig:\n${details}`);
        }

        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
        cacheTypingSentences(content);
        return content;
    }

    window.thaiGigaDrill = {
        constants: {
            contentStorageKey: CONTENT_STORAGE_KEY,
            progressStorageKey: PROGRESS_STORAGE_KEY,
            requiredBlockCount: REQUIRED_BLOCK_COUNT,
            requiredStoryCount: REQUIRED_STORY_COUNT,
            requiredSentenceCount: REQUIRED_SENTENCE_COUNT
        },
        validateContent,
        buildIndexes,
        loadContent,
        getContentFromStorage,
        getStoredProgress,
        saveProgress,
        getTypingSentence,
        getSharedPlaylistEntry,
        getTypingPlaylistSentence,
        openSentenceInTyping,
        openTypingPlaylistInTyping
    };
})();
