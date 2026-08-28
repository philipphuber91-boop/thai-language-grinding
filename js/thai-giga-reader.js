(function () {
    "use strict";

    const elements = {
        sidebar: document.getElementById("thaiGigaSidebar"),
        sidebarBackdrop: document.getElementById("thaiGigaSidebarBackdrop"),
        sidebarToggle: document.getElementById("thaiGigaSidebarToggle"),
        hierarchy: document.getElementById("thaiGigaHierarchy"),
        foreword: document.getElementById("thaiGigaForeword"),
        forewordButton: document.getElementById("thaiGigaForewordButton"),
        audioPlayer: document.getElementById("thaiGigaAudioPlayer"),
        bossOverview: document.getElementById("thaiGigaBossOverview"),
        bossEyebrow: document.getElementById("thaiGigaBossEyebrow"),
        bossTitle: document.getElementById("thaiGigaBossTitle"),
        sentenceCount: document.getElementById("thaiGigaSentenceCount"),
        pattern: document.getElementById("thaiGigaPattern"),
        patternTranslation: document.getElementById("thaiGigaPatternTranslation"),
        blockList: document.getElementById("thaiGigaBlockList"),
        readerContent: document.getElementById("thaiGigaReaderContent"),
        emptyState: document.getElementById("thaiGigaEmptyState"),
        sentenceList: document.getElementById("thaiGigaBlockList"),
        dictionary: document.getElementById("thaiGigaDictionary")
    };

    let content = null;
    let indexes = null;
    let activeStory = null;
    let activeSentenceId = "";
    let dictionaryAnchor = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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

    function setThaiView(view, shouldScroll = false) {
        const isForeword = view === "foreword";
        elements.foreword.hidden = !isForeword;
        elements.audioPlayer.hidden = isForeword;
        elements.bossOverview.hidden = isForeword;
        elements.readerContent.hidden = isForeword;
        elements.forewordButton.classList.toggle("is-active", isForeword);
        elements.forewordButton.setAttribute("aria-pressed", String(isForeword));

        if (shouldScroll) {
            (isForeword ? elements.foreword : elements.bossOverview)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function showForeword() {
        setThaiView("foreword", true);
        closeSidebar();
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
        const bosses = content.levels.flatMap(level => level.bosses);
        elements.hierarchy.innerHTML = `
            <div class="thai-giga-chapter-group">
                <p class="thai-giga-chapter-group-title">Grammatikbosse</p>
                ${bosses.map(boss => `
                    <button
                        class="thai-giga-chapter-button"
                        type="button"
                        data-boss-id="${escapeHtml(boss.id)}">
                        <strong>${escapeHtml(boss.title)}</strong>
                        <small>${escapeHtml(boss.grammarFocus)}</small>
                    </button>
                `).join("")}
            </div>
        `;

        elements.hierarchy.querySelectorAll("[data-boss-id]").forEach(button => {
            button.addEventListener("click", () => {
                const boss = bosses.find(candidate => candidate.id === button.dataset.bossId);
                if (boss) {
                    renderBossOverview(boss);
                    setThaiView("reader");
                    closeSidebar();
                }
            });
        });
    }

    function renderThaiReminderWord(word) {
        return `
            <div class="thai-giga-reminder-word">
                <strong lang="th">${escapeHtml(word.thai)}</strong>
                <em>${escapeHtml(word.transliteration)}</em>
                <span>${escapeHtml(word.translation)}</span>
            </div>
        `;
    }

    function renderThaiReminderExample(example) {
        return `
            <div class="thai-giga-reminder-example">
                <strong lang="th">${escapeHtml(example.thai)}</strong>
                <em>${escapeHtml(example.transliteration)}</em>
                <span>${escapeHtml(example.translation)}</span>
            </div>
        `;
    }

    function renderThaiMidpointReminder(reminder) {
        if (!reminder) {
            return "";
        }

        return `
            <details class="thai-giga-midpoint-reminder">
                <summary>${escapeHtml(reminder.title)}</summary>
                <div class="thai-giga-midpoint-content">
                    <p>${escapeHtml(reminder.message)}</p>
                    <p>${escapeHtml(reminder.lead)}</p>
                    ${reminder.sections.map(section => `
                        <section class="thai-giga-reminder-section">
                            <h4>${escapeHtml(section.title)}</h4>
                            <div class="thai-giga-reminder-words">
                                ${section.words.map(renderThaiReminderWord).join("")}
                            </div>
                        </section>
                    `).join("")}
                    <p class="thai-giga-reminder-pattern-lead">
                        ${escapeHtml(reminder.patternLead)}
                    </p>
                    ${renderThaiReminderExample(reminder.pattern)}
                    <div class="thai-giga-reminder-discoveries">
                        ${reminder.discoveries.map(renderThaiReminderExample).join("")}
                    </div>
                    <p class="thai-giga-reminder-closing">
                        ${escapeHtml(reminder.closing)}
                    </p>
                </div>
            </details>
        `;
    }

    function renderThaiBlockCompletion(completion) {
        if (!completion) {
            return "";
        }

        return `
            <details class="thai-giga-block-completion">
                <summary>${escapeHtml(completion.title)}</summary>
                <div class="thai-giga-completion-content">
                    <h3>${escapeHtml(completion.heading)}</h3>
                    <p>${escapeHtml(completion.message)}</p>
                    <p>${escapeHtml(completion.lead)}</p>
                    <h4>${escapeHtml(completion.wordSectionTitle)}</h4>
                    <div class="thai-giga-reminder-words">
                        ${completion.words.map(renderThaiReminderWord).join("")}
                    </div>
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.questionLead)}</p>
                    ${renderThaiReminderExample(completion.question)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.answerLead)}</p>
                    ${renderThaiReminderExample(completion.answer)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.alternativeLead)}</p>
                    ${renderThaiReminderExample(completion.alternative)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.possessionLead)}</p>
                    ${renderThaiReminderExample(completion.possession)}
                    <h3 class="thai-giga-completion-progress-title">
                        ${escapeHtml(completion.progressTitle)}
                    </h3>
                    <p class="thai-giga-completion-progress">${escapeHtml(completion.progress)}</p>
                    <p class="thai-giga-reminder-summary">${escapeHtml(completion.progressSummary)}</p>
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.systemLead)}</p>
                    <div class="thai-giga-reminder-examples">
                        ${completion.systemExamples.map(renderThaiReminderExample).join("")}
                    </div>
                    <p class="thai-giga-completion-final">${escapeHtml(completion.final)}</p>
                    <p class="thai-giga-completion-progress">
                        ${escapeHtml(completion.finalProgress)}
                    </p>
                </div>
            </details>
        `;
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
                ${block.miniStories.map((story, index) => `
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
                    ${index === 4 ? renderThaiMidpointReminder(block.midpointReminder) : ""}
                `).join("")}
                ${renderThaiBlockCompletion(block.completion)}
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
            audio: window.thaiGigaAudio.getAudioForSentence(sentence.id) || sentence.audio,
            text: sentence.thai,
            className: "thai-giga-inline-audio",
            playbackRate: 1
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
            button.addEventListener("click", () =>
                showDictionary(button.dataset.wordId, button)
            );
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
        setThaiView("reader");
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

    function closeDictionary() {
        dictionaryAnchor = null;
        elements.dictionary.hidden = true;
        elements.dictionary.removeAttribute("aria-labelledby");
        elements.dictionary.style.removeProperty("left");
        elements.dictionary.style.removeProperty("top");
    }

    function positionDictionary() {
        if (!dictionaryAnchor || elements.dictionary.hidden) {
            return;
        }

        const anchorRect = dictionaryAnchor.getBoundingClientRect();
        const dictionaryRect = elements.dictionary.getBoundingClientRect();
        const margin = 12;
        const edge = 16;
        let left = anchorRect.right + margin;
        if (left + dictionaryRect.width > window.innerWidth - edge) {
            left = anchorRect.left - dictionaryRect.width - margin;
        }
        left = Math.max(edge, Math.min(left, window.innerWidth - dictionaryRect.width - edge));

        let top = anchorRect.top;
        if (top + dictionaryRect.height > window.innerHeight - edge) {
            top = window.innerHeight - dictionaryRect.height - edge;
        }
        top = Math.max(edge, top);

        elements.dictionary.style.left = `${left}px`;
        elements.dictionary.style.top = `${top}px`;
    }

    function showDictionary(wordId, anchor) {
        const word = indexes.wordsById.get(wordId);
        if (!word) {
            return;
        }

        dictionaryAnchor = anchor;
        const sentenceIds = indexes.sentenceIdsByWordId.get(wordId) || [];
        elements.dictionary.innerHTML = `
            <div class="thai-giga-dictionary-header">
                <p class="thai-giga-eyebrow">Wörterbuch</p>
                <button
                    class="thai-giga-dictionary-close"
                    type="button"
                    aria-label="Wörterbuch schließen">×</button>
            </div>
            <div class="thai-giga-dictionary-word" lang="th">${escapeHtml(word.thai)}</div>
            <p class="thai-giga-dictionary-transliteration">${escapeHtml(word.transliteration)}</p>
            <div class="thai-giga-dictionary-meaning">
                ${word.meanings.map(meaning => `<div>${escapeHtml(meaning)}</div>`).join("")}
            </div>
            <details class="thai-giga-dictionary-examples">
                <summary>Beispiele in ${sentenceIds.length} Sätzen</summary>
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
            </details>
        `;
        elements.dictionary.hidden = false;
        positionDictionary();

        elements.dictionary
            .querySelectorAll("[data-dictionary-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentence = indexes.sentencesById.get(button.dataset.dictionarySentence);
                    closeDictionary();
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
            if (content.levels.length === 0) {
                elements.emptyState.hidden = false;
                return;
            }

            window.thaiGigaAudio.initialize(indexes);
            renderHierarchy();
            renderBlockList();
            const firstBoss = content.levels[0].bosses[0];
            renderBossOverview(firstBoss);
            showInitialStory();
            initializeSentenceActions();
        } catch (error) {
            console.error(error);
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
    elements.forewordButton?.addEventListener("click", showForeword);
    elements.dictionary.addEventListener("click", event => {
        if (event.target.closest(".thai-giga-dictionary-close")) {
            closeDictionary();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.dictionary.hidden) {
            closeDictionary();
        }
    });
    window.addEventListener("resize", positionDictionary);

    window.addEventListener("thai-giga:audio-current", event => {
        const sentenceId = event.detail?.sentenceId;
        if (!sentenceId) {
            return;
        }

        activeSentenceId = sentenceId;
        elements.blockList
            .querySelectorAll(".thai-giga-sentence")
            .forEach(sentenceElement => {
                sentenceElement.classList.toggle(
                    "is-highlighted",
                    sentenceElement.dataset.sentenceId === sentenceId
                );
            });
    });

    initialize();
})();
