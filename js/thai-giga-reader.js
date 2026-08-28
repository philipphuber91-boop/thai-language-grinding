(function () {
    "use strict";

    const elements = {
        status: document.getElementById("thaiGigaStatus"),
        sidebar: document.getElementById("thaiGigaSidebar"),
        sidebarBackdrop: document.getElementById("thaiGigaSidebarBackdrop"),
        sidebarToggle: document.getElementById("thaiGigaSidebarToggle"),
        hierarchy: document.getElementById("thaiGigaHierarchy"),
        bossOverview: document.getElementById("thaiGigaBossOverview"),
        bossEyebrow: document.getElementById("thaiGigaBossEyebrow"),
        bossTitle: document.getElementById("thaiGigaBossTitle"),
        bossDescription: document.getElementById("thaiGigaBossDescription"),
        sentenceCount: document.getElementById("thaiGigaSentenceCount"),
        pattern: document.getElementById("thaiGigaPattern"),
        patternTranslation: document.getElementById("thaiGigaPatternTranslation"),
        blockList: document.getElementById("thaiGigaBlockList"),
        emptyState: document.getElementById("thaiGigaEmptyState"),
        story: document.getElementById("thaiGigaStory"),
        storyContext: document.getElementById("thaiGigaStoryContext"),
        storyTitle: document.getElementById("thaiGigaStoryTitle"),
        sentenceList: document.getElementById("thaiGigaSentenceList"),
        storyPlaylistButton: document.getElementById("thaiGigaStoryPlaylistButton"),
        storySelectedPlaylistButton: document.getElementById(
            "thaiGigaStorySelectedPlaylistButton"
        ),
        storyTypingButton: document.getElementById("thaiGigaStoryTypingButton"),
        dictionary: document.getElementById("thaiGigaDictionary")
    };

    let content = null;
    let indexes = null;
    let activeStory = null;
    let activeSentenceId = "";

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function setStatus(message, isError = false) {
        elements.status.textContent = message;
        elements.status.classList.toggle("is-error", isError);
    }

    function closeSidebar() {
        elements.sidebar?.classList.remove("is-open");
        elements.sidebarBackdrop?.classList.remove("is-visible");
        elements.sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    function openSidebar() {
        elements.sidebar?.classList.add("is-open");
        elements.sidebarBackdrop?.classList.add("is-visible");
        elements.sidebarToggle?.setAttribute("aria-expanded", "true");
    }

    function getStoryContext(story) {
        return [
            story.levelTitle,
            story.bossTitle,
            story.blockTitle,
            story.title
        ].filter(Boolean).join(" · ");
    }

    function renderHierarchy() {
        elements.hierarchy.innerHTML = "";

        content.levels.forEach(level => {
            const levelDetails = document.createElement("details");
            levelDetails.open = true;
            levelDetails.innerHTML = `<summary>${escapeHtml(level.title)}</summary>`;

            level.bosses.forEach(boss => {
                const bossDetails = document.createElement("details");
                bossDetails.open = true;
                bossDetails.innerHTML = `<summary>${escapeHtml(boss.title)}</summary>`;

                boss.blocks.forEach(block => {
                    const blockDetails = document.createElement("details");
                    blockDetails.open = false;
                    blockDetails.innerHTML = `<summary>${escapeHtml(block.title)}</summary>`;
                    const blockAudioButton = document.createElement("button");
                    blockAudioButton.type = "button";
                    blockAudioButton.dataset.thaiGigaPlaylistBlock = block.id;
                    blockAudioButton.textContent = "+ Block zur Playlist";
                    blockAudioButton.title = "Alle Sätze dieses Blocks zur Playlist hinzufügen";
                    blockAudioButton.addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        window.thaiGigaAudio.addBlock(block.id);
                    });
                    blockDetails.appendChild(blockAudioButton);

                    block.miniStories.forEach(story => {
                        const button = document.createElement("button");
                        button.type = "button";
                        button.textContent = story.title;
                        button.addEventListener("click", () => showStory(story.id));
                        blockDetails.appendChild(button);
                    });

                    bossDetails.appendChild(blockDetails);
                });

                levelDetails.appendChild(bossDetails);
            });

            elements.hierarchy.appendChild(levelDetails);
        });
    }

    function renderBossOverview(boss) {
        if (!boss) {
            elements.bossOverview.hidden = true;
            return;
        }

        const sentences = boss.blocks.flatMap(block =>
            block.miniStories.flatMap(story => story.sentences)
        );
        elements.bossOverview.hidden = false;
        elements.bossEyebrow.textContent = boss.title;
        elements.bossTitle.textContent = boss.grammarFocus;
        elements.bossDescription.textContent =
            "Offizieller Thai-Giga-Content mit stabilen Satzobjekten, kanonischen Wort-Token und wiederverwendbarer Audio-/Typing-Anbindung.";
        elements.sentenceCount.textContent = `${sentences.length} Beispielsätze`;
        elements.pattern.textContent = boss.grammarFocus;
        elements.patternTranslation.textContent =
            "Das aktive Grammatikmuster wird in den Situationen und Sätzen dieses Bosses wiederholt.";
    }

    function renderBlockList() {
        const blocks = content.levels.flatMap(level =>
            level.bosses.flatMap(boss => boss.blocks)
        );
        elements.blockList.innerHTML = blocks.map(block => `
            <details class="thai-giga-block">
                <summary class="thai-giga-block-summary">
                    <span>${escapeHtml(block.title)}</span>
                    <button
                        type="button"
                        data-thai-giga-block-playlist="${escapeHtml(block.id)}"
                        aria-label="Alle Sätze dieses Blocks zur Playlist hinzufügen">
                        + Block zur Playlist
                    </button>
                </summary>
                <div class="thai-giga-story-links">
                    ${block.miniStories.map(story => `
                        <button
                            class="thai-giga-story-link"
                            type="button"
                            data-thai-giga-story="${escapeHtml(story.id)}">
                            ${escapeHtml(story.title)}
                        </button>
                    `).join("")}
                </div>
            </details>
        `).join("");

        elements.blockList
            .querySelectorAll("[data-thai-giga-block-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.thaiGigaAudio.addBlock(button.dataset.thaiGigaBlockPlaylist);
                });
            });
        elements.blockList
            .querySelectorAll("[data-thai-giga-story]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    showStory(button.dataset.thaiGigaStory);
                });
            });
    }

    function renderSentence(sentence) {
        const tokenMarkup = sentence.tokens
            .map(token => token.wordId
                ? `
                    <button
                        class="thai-giga-word-button"
                        type="button"
                        data-word-id="${escapeHtml(token.wordId)}"
                        title="Wörterbuch öffnen">${escapeHtml(token.text)}</button>
                `
                : `<span>${escapeHtml(token.text)}</span>`)
            .join("");
        const audioMarkup = window.questAudio.renderSentenceAudioPlayer({
            audio: sentence.audio,
            text: sentence.thai,
            className: "thai-giga-inline-audio"
        });

        return `
            <article class="thai-giga-sentence${sentence.id === activeSentenceId ? " is-highlighted" : ""}"
                     id="thai-giga-sentence-${escapeHtml(sentence.id)}"
                     data-sentence-id="${escapeHtml(sentence.id)}">
                <div class="thai-giga-sentence-meta">
                    <span>Satz ${sentence.numberInStory} / 10</span>
                    <span>${escapeHtml(sentence.id)}</span>
                </div>
                <p class="thai-giga-thai" lang="th">${tokenMarkup}</p>
                <p class="thai-giga-transliteration">${escapeHtml(sentence.transliteration)}</p>
                <p class="thai-giga-translation">${escapeHtml(sentence.translation)}</p>
                <div class="thai-giga-sentence-actions">
                    <label class="thai-giga-sentence-select">
                        <input
                            type="checkbox"
                            data-thai-giga-select-sentence="${escapeHtml(sentence.id)}"
                            aria-label="Satz für die Playlist auswählen">
                        <span>Auswählen</span>
                    </label>
                    ${audioMarkup}
                    <button type="button" data-thai-giga-playlist-sentence="${escapeHtml(sentence.id)}">
                        + Playlist
                    </button>
                    <button type="button" data-typing-sentence="${escapeHtml(sentence.id)}">
                        Im Typing öffnen
                    </button>
                </div>
            </article>
        `;
    }

    function initializeSentenceActions() {
        window.questAudio.initializeSentenceAudioPlayers(elements.sentenceList);

        elements.sentenceList.querySelectorAll("[data-word-id]").forEach(button => {
            button.addEventListener("click", () => showDictionary(button.dataset.wordId));
        });

        elements.sentenceList.querySelectorAll("[data-typing-sentence]").forEach(button => {
            button.addEventListener("click", () => {
                const sentence = indexes.sentencesById.get(button.dataset.typingSentence);
                if (sentence) {
                    window.thaiGigaDrill.openSentenceInTyping(
                        sentence,
                        indexes.storiesById.get(sentence.storyId)
                    );
                }
            });
        });

        elements.sentenceList
            .querySelectorAll("[data-thai-giga-playlist-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentenceId = button.dataset.thaiGigaPlaylistSentence;
                    if (window.thaiGigaAudio.hasSentence(sentenceId)) {
                        window.thaiGigaAudio.removeSentence(sentenceId);
                    } else {
                        window.thaiGigaAudio.addSentence(sentenceId);
                    }
                    updatePlaylistButtons();
                });
            });

        updatePlaylistButtons();
    }

    function showStory(storyId, sentenceId = "") {
        const story = indexes.storiesById.get(storyId);
        if (!story) {
            return;
        }

        activeStory = story;
        activeSentenceId = sentenceId;
        const boss = content.levels
            .flatMap(level => level.bosses)
            .find(candidate => candidate.id === story.bossId);
        renderBossOverview(boss);
        window.thaiGigaDrill.saveProgress({
            levelId: story.levelId,
            bossId: story.bossId,
            blockId: story.blockId,
            storyId: story.id,
            sentenceId
        });

        elements.emptyState.hidden = true;
        elements.story.hidden = false;
        elements.storyContext.textContent = getStoryContext(story);
        elements.storyTitle.textContent = story.title;
        elements.storyPlaylistButton.dataset.thaiGigaPlaylistStory = story.id;
        elements.storyTypingButton.dataset.thaiGigaPlaylistStory = story.id;
        elements.sentenceList.innerHTML = story.sentences
            .map(sentence => renderSentence(indexes.sentencesById.get(sentence.id)))
            .join("");
        initializeSentenceActions();

        if (sentenceId) {
            requestAnimationFrame(() => {
                document
                    .getElementById(`thai-giga-sentence-${sentenceId}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    }

    function updatePlaylistButtons() {
        elements.sentenceList
            .querySelectorAll("[data-thai-giga-playlist-sentence]")
            .forEach(button => {
                const sentenceId = button.dataset.thaiGigaPlaylistSentence;
                const isAdded = window.thaiGigaAudio.hasSentence(sentenceId);
                button.textContent = isAdded ? "− Playlist" : "+ Playlist";
                button.setAttribute(
                    "aria-label",
                    isAdded
                        ? "Satz aus Playlist entfernen"
                        : "Satz zur Playlist hinzufügen"
                );
            });
    }

    function showDictionary(wordId) {
        const word = indexes.wordsById.get(wordId);
        if (!word) {
            return;
        }

        const sentenceIds = indexes.sentenceIdsByWordId.get(wordId) || [];
        elements.dictionary.innerHTML = `
            <p class="eyebrow">Wörterbuch</p>
            <div class="thai-giga-dictionary-word" lang="th">${escapeHtml(word.thai)}</div>
            <p>${escapeHtml(word.transliteration)}</p>
            <div class="thai-giga-dictionary-meaning">
                ${word.meanings.map(meaning => `<div>${escapeHtml(meaning)}</div>`).join("")}
            </div>
            <h3>Verwendet in ${sentenceIds.length} Sätzen</h3>
            <div class="thai-giga-dictionary-sentences">
                ${sentenceIds.map(sentenceId => {
                    const sentence = indexes.sentencesById.get(sentenceId);
                    const story = indexes.storiesById.get(sentence.storyId);
                    return `
                        <button class="thai-giga-dictionary-sentence"
                                type="button"
                                data-dictionary-sentence="${escapeHtml(sentenceId)}">
                            ${escapeHtml(story.title)} · Satz ${sentence.numberInStory}
                        </button>
                    `;
                }).join("")}
            </div>
        `;

        elements.dictionary
            .querySelectorAll("[data-dictionary-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentence = indexes.sentencesById.get(button.dataset.dictionarySentence);
                    showStory(sentence.storyId, sentence.id);
                    window.thaiGigaAudio.addSentence(sentence.id, true);
                });
            });
    }

    function showInitialStory() {
        const progress = window.thaiGigaDrill.getStoredProgress();
        const story = progress.storyId
            ? indexes.storiesById.get(progress.storyId)
            : indexes.storiesById.values().next().value;

        if (story) {
            showStory(story.id, progress.sentenceId);
        }
    }

    async function initialize() {
        try {
            content = await window.thaiGigaDrill.loadContent();
            indexes = window.thaiGigaDrill.buildIndexes(content);
            setStatus(
                content.contentStatus === "placeholder-only"
                    ? "Technische Vorschau · offizieller Content folgt"
                    : content.contentStatus === "draft"
                        ? `Entwurf · Content-Version ${content.contentVersion}`
                    : `Content-Version ${content.contentVersion}`
            );

            if (content.levels.length === 0) {
                return;
            }

            renderHierarchy();
            renderBlockList();
            showInitialStory();
            window.thaiGigaAudio.initialize(indexes);
        } catch (error) {
            console.error(error);
            setStatus("Content konnte nicht geladen werden.", true);
            elements.emptyState.hidden = false;
            elements.emptyState.innerHTML = `
                <h2>Content-Import fehlgeschlagen</h2>
                <p>${escapeHtml(error.message)}</p>
                <p>Der gesamte Datensatz bleibt deaktiviert, bis alle Fehler behoben sind.</p>
            `;
        }
    }

    elements.storyTypingButton.addEventListener("click", () => {
        if (!activeStory || !activeStory.sentences[0]) {
            return;
        }

        const sentence = indexes.sentencesById.get(activeStory.sentences[0].id);
        window.thaiGigaDrill.openSentenceInTyping(sentence, activeStory);
    });

    elements.storyPlaylistButton.addEventListener("click", () => {
        if (activeStory) {
            window.thaiGigaAudio.addStory(activeStory.id);
        }
    });

    elements.sidebarToggle?.addEventListener("click", () => {
        if (elements.sidebar?.classList.contains("is-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    elements.sidebarBackdrop?.addEventListener("click", closeSidebar);

    elements.storySelectedPlaylistButton.addEventListener("click", () => {
        const sentenceIds = Array.from(
            elements.sentenceList.querySelectorAll(
                "[data-thai-giga-select-sentence]:checked"
            ),
            checkbox => checkbox.dataset.thaiGigaSelectSentence
        );
        if (sentenceIds.length > 0) {
            window.thaiGigaAudio.addSentences(sentenceIds);
            elements.sentenceList
                .querySelectorAll("[data-thai-giga-select-sentence]")
                .forEach(checkbox => {
                    checkbox.checked = false;
                });
        }
    });

    window.addEventListener("thai-giga:audio-current", event => {
        const sentenceId = event.detail?.sentenceId;
        const sentence = indexes?.sentencesById.get(sentenceId);
        if (sentence && sentence.storyId !== activeStory?.id) {
            showStory(sentence.storyId, sentence.id);
        } else if (sentence) {
            activeSentenceId = sentence.id;
            elements.sentenceList.innerHTML = activeStory.sentences
                .map(storySentence => renderSentence(indexes.sentencesById.get(storySentence.id)))
                .join("");
            initializeSentenceActions();
        }
    });

    initialize();
})();
