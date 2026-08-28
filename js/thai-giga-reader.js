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
        sentenceList: document.getElementById("thaiGigaBlockList"),
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
                <summary class="thai-giga-block-summary" id="${escapeHtml(block.id)}-title">
                    <span class="thai-giga-block-summary-title">${escapeHtml(block.title)}</span>
                    <button
                        class="thai-giga-block-playlist-button"
                        type="button"
                        data-thai-giga-block-playlist="${escapeHtml(block.id)}"
                        aria-label="Alle Sätze dieses Blocks zur Playlist hinzufügen"
                        title="Alle Sätze dieses Blocks zur Playlist hinzufügen">
                        + Block zur Playlist
                    </button>
                </summary>
                ${block.description
                    ? `<p class="thai-giga-block-description">${escapeHtml(block.description)}</p>`
                    : ""}
                ${block.miniStories.map(story => `
                    <div class="thai-giga-level-shell">
                        <details class="thai-giga-level">
                            <summary class="thai-giga-level-summary">${escapeHtml(story.title)}</summary>
                            <div class="thai-giga-sentence-list">
                                ${story.sentences
                                    .map(sentence => renderSentence(indexes.sentencesById.get(sentence.id)))
                                    .join("")}
                            </div>
                        </details>
                        <button
                            class="thai-giga-level-playlist-button"
                            type="button"
                            data-thai-giga-story-playlist="${escapeHtml(story.id)}"
                            aria-label="Alle Sätze dieser Situation zur Playlist hinzufügen"
                            title="Alle Sätze dieser Situation zur Playlist hinzufügen">
                            + Situation zur Playlist
                        </button>
                    </div>
                `).join("")}
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
            .querySelectorAll("[data-thai-giga-story-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.thaiGigaAudio.addStory(button.dataset.thaiGigaStoryPlaylist);
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
            <article
                class="thai-giga-sentence${sentence.id === activeSentenceId ? " is-highlighted" : ""}"
                id="thai-giga-sentence-${escapeHtml(sentence.id)}"
                data-sentence-id="${escapeHtml(sentence.id)}"
                data-sentence-number="${sentence.numberInStory}">
                <span class="thai-giga-sentence-number">${sentence.numberInStory}.</span>
                <div>
                    <p class="thai-giga-thai" lang="th">${tokenMarkup}</p>
                    <p class="thai-giga-transliteration">${escapeHtml(sentence.transliteration)}</p>
                    <p class="thai-giga-translation">${escapeHtml(sentence.translation)}</p>
                </div>
                ${audioMarkup}
                <button
                    class="thai-giga-playlist-button"
                    type="button"
                    data-thai-giga-playlist-sentence="${escapeHtml(sentence.id)}"
                    aria-label="Satz zur Playlist hinzufügen"
                    title="Satz zur Playlist hinzufügen">
                    + Playlist
                </button>
            </article>
        `;
    }

    function initializeSentenceActions() {
        window.questAudio.initializeSentenceAudioPlayers(elements.sentenceList);

        elements.sentenceList.querySelectorAll("[data-word-id]").forEach(button => {
            button.addEventListener("click", () => showDictionary(button.dataset.wordId));
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

        elements.blockList
            .querySelectorAll(".thai-giga-level, .thai-giga-block")
            .forEach(details => {
                const containsStory = Array.from(
                    details.querySelectorAll("[data-sentence-id]")
                ).some(sentenceElement =>
                    indexes.sentencesById.get(sentenceElement.dataset.sentenceId)?.storyId === story.id
                );
                if (containsStory) {
                    details.open = true;
                }
            });
        elements.blockList
            .querySelectorAll(".thai-giga-sentence")
            .forEach(sentenceElement => {
                sentenceElement.classList.toggle(
                    "is-highlighted",
                    sentenceElement.dataset.sentenceId === sentenceId
                );
            });

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

        if (story && progress.sentenceId) {
            showStory(story.id, progress.sentenceId);
        } else if (story) {
            activeStory = story;
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
                elements.emptyState.hidden = false;
                return;
            }

            renderHierarchy();
            renderBlockList();
            const firstBoss = content.levels[0].bosses[0];
            renderBossOverview(firstBoss);
            showInitialStory();
            window.thaiGigaAudio.initialize(indexes);
            initializeSentenceActions();
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

    elements.sidebarToggle?.addEventListener("click", () => {
        if (elements.sidebar?.classList.contains("is-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    elements.sidebarBackdrop?.addEventListener("click", closeSidebar);

    window.addEventListener("thai-giga:audio-current", event => {
        const sentenceId = event.detail?.sentenceId;
        const sentence = indexes?.sentencesById.get(sentenceId);
        if (sentence) {
            showStory(sentence.storyId, sentence.id);
        }
    });

    initialize();
})();
