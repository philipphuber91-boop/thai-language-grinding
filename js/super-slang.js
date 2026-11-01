(function () {
    "use strict";

    const sidebar = document.getElementById("superSlangSidebar");
    const backdrop = document.getElementById("superSlangSidebarBackdrop");
    const toggle = document.getElementById("superSlangSidebarToggle");
    const storiesSection = document.getElementById("superSlangStoriesSection");
    const dictSection = document.getElementById("superSlangDictionarySection");
    const audioPlayer = document.getElementById("superSlangAudioPlayer");
    const storiesContainer = document.getElementById("superSlangStoriesContainer");
    const dictGrid = document.getElementById("superSlangDictGrid");
    const dictSearch = document.getElementById("superSlangDictSearch");
    const dictCount = document.getElementById("superSlangDictCount");
    const dictPopup = document.getElementById("superSlangDictionary");
    const wordmixButton = document.getElementById("superSlangPlayInWordmix");

    let content = null;
    const wordsById = new Map();
    const sentencesById = new Map();
    const storiesById = new Map();
    const sentenceIdsByWordId = new Map();
    let dictionaryAnchor = null;

    const TONE_MARKS = new Map([
        ["\u0300", "low"],
        ["\u0301", "high"],
        ["\u0302", "falling"],
        ["\u030c", "rising"]
    ]);

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getToneClass(transliteration) {
        const tones = [...String(transliteration ?? "").normalize("NFD")]
            .map(character => TONE_MARKS.get(character))
            .filter(Boolean);
        const uniqueTones = [...new Set(tones)];

        if (uniqueTones.length === 0) {
            return "thai-tone-mid";
        }
        if (uniqueTones.length === 1) {
            return `thai-tone-${uniqueTones[0]}`;
        }
        return "thai-tone-mixed";
    }

    function renderToneMarkup(thai, transliteration, syllables) {
        const validSyllables = Array.isArray(syllables) &&
            syllables.length > 0 &&
            syllables.every(syllable =>
                syllable &&
                typeof syllable.thai === "string" &&
                typeof syllable.transliteration === "string"
            ) &&
            syllables.map(syllable => syllable.thai).join("") === thai;

        if (validSyllables) {
            return syllables.map(syllable =>
                `<span class="${getToneClass(syllable.transliteration)}">${escapeHtml(
                    syllable.thai
                )}</span>`
            ).join("");
        }

        return `<span class="${getToneClass(transliteration)}">${escapeHtml(thai)}</span>`;
    }

    function getSpeakerClass(speakerId) {
        if (!speakerId) return "";
        const lower = String(speakerId).toLowerCase();
        if (lower.includes("ploy")) return "super-slang-speaker-ploy";
        if (lower.includes("non")) return "super-slang-speaker-non";
        if (lower.includes("ohm")) return "super-slang-speaker-ohm";
        if (lower.includes("fah")) return "super-slang-speaker-fah";
        if (lower.includes("nan")) return "super-slang-speaker-nan";
        if (lower.includes("art")) return "super-slang-speaker-art";
        return "";
    }

    function renderSentenceTokenMarkup(sentence, interactive = true) {
        const tokenMarkup = [];
        let previousToken = null;

        (sentence.tokens || []).forEach(token => {
            if (previousToken?.kind === "word" && token.kind === "word") {
                tokenMarkup.push(
                    '<span class="thai-giga-space-token thai-giga-generated-space" aria-hidden="true"> </span>'
                );
            }

            if (token.kind === "space") {
                tokenMarkup.push(
                    `<span class="thai-giga-space-token thai-giga-space-token-is-required">${escapeHtml(token.text)}</span>`
                );
                previousToken = token;
                return;
            }

            if (!token.wordId) {
                tokenMarkup.push(`<span>${escapeHtml(token.text)}</span>`);
                previousToken = token;
                return;
            }

            const word = wordsById.get(token.wordId);
            const toneMarkup = renderToneMarkup(
                token.text,
                word?.transliteration || token.transliteration,
                word?.syllables || token.syllables
            );

            if (interactive) {
                const contextMeaning = token.contextMeaning || "";
                tokenMarkup.push(
                    `<button class="thai-giga-word-button" type="button" ` +
                    `data-word-id="${escapeHtml(token.wordId)}" ` +
                    `data-sentence-id="${escapeHtml(sentence.id)}" ` +
                    `data-context-meaning="${escapeHtml(contextMeaning)}" ` +
                    `title="Wörterbuch öffnen – Bedeutung anzeigen">${toneMarkup}</button>`
                );
            } else {
                tokenMarkup.push(`<span>${toneMarkup}</span>`);
            }

            previousToken = token;
        });

        return tokenMarkup.join("");
    }

    function renderSentence(sentence, index, story) {
        const speaker = (story.speakers || []).find(s => s.id === sentence.speakerId) ||
            (sentence.speaker ? { id: sentence.speaker.toLowerCase(), name: sentence.speaker } : null);
        const speakerTag = speaker
            ? `<span class="super-slang-speaker-tag ${getSpeakerClass(speaker.id)}">${escapeHtml(speaker.name)}</span>`
            : "";

        const audioMarkup = window.questAudio?.renderSentenceAudioPlayer
            ? window.questAudio.renderSentenceAudioPlayer({
                audio: window.superSlangAudio?.getAudioForSentence(sentence.id) || sentence.audio || {
                    type: "speechSynthesis",
                    lang: "th-TH"
                },
                text: sentence.thai,
                className: "thai-giga-inline-audio",
                ariaLabel: "Satz vorlesen",
                playbackRate: 1
            })
            : "";

        return `
            <article
                class="thai-giga-sentence"
                id="sentence-${escapeHtml(sentence.id)}"
                data-sentence-id="${escapeHtml(sentence.id)}"
                tabindex="0"
                title="Tippen, um die Übersetzung ein- oder auszublenden">
                <span class="thai-giga-sentence-number">${index + 1}.</span>
                <div>
                    <p class="thai-giga-thai" lang="th">${speakerTag}${renderSentenceTokenMarkup(sentence)}</p>
                    <p class="thai-giga-transliteration">${escapeHtml(sentence.transliteration)}</p>
                    <p class="thai-giga-translation" data-thai-giga-translation-state="default">
                        ${escapeHtml(sentence.translation)}
                    </p>
                </div>
                <div class="thai-giga-sentence-tools">
                    <button
                        class="thai-giga-playlist-button"
                        type="button"
                        data-slang-playlist-sentence="${escapeHtml(sentence.id)}"
                        aria-label="Satz zur Playlist hinzufügen"
                        title="Satz zur Playlist hinzufügen">
                        + Playlist
                    </button>
                    ${audioMarkup}
                </div>
            </article>
        `;
    }

    function renderStory(story, storyIndex) {
        const sentencesMarkup = (story.sentences || [])
            .map((sentence, idx) => renderSentence(sentence, idx, story))
            .join("");

        return `
            <article id="story-${escapeHtml(story.id)}" class="super-slang-story-card is-collapsed" data-story-id="${escapeHtml(story.id)}">
                <header class="super-slang-story-header">
                    <div class="super-slang-story-meta">
                        <span class="super-slang-story-badge">Mini-Story ${storyIndex + 1}</span>
                        <button
                            class="thai-giga-playlist-button"
                            type="button"
                            data-slang-story-playlist="${escapeHtml(story.id)}"
                            aria-label="Ganze Story zur Audio-Playlist hinzufügen"
                            title="Ganze Story zur Audio-Playlist hinzufügen">
                        </button>
                    </div>
                    <button
                        class="super-slang-story-summary"
                        type="button"
                        aria-expanded="false"
                        title="Mini-Story aufklappen"
                        aria-controls="story-content-${escapeHtml(story.id)}">
                        <span class="super-slang-story-title" role="heading" aria-level="3">${escapeHtml(story.title)}</span>
                        <span class="super-slang-story-desc">${escapeHtml(story.description || story.context || "")}</span>
                    </button>
                </header>
                <div id="story-content-${escapeHtml(story.id)}" class="thai-giga-sentences">
                    ${sentencesMarkup}
                </div>
            </article>
        `;
    }

    function setStoryCollapsed(storyCard, collapsed) {
        if (!storyCard) return;
        storyCard.classList.toggle("is-collapsed", collapsed);
        const summary = storyCard.querySelector(".super-slang-story-summary");
        if (summary) {
            summary.setAttribute("aria-expanded", String(!collapsed));
            summary.setAttribute("aria-label", collapsed ? "Mini-Story aufklappen" : "Mini-Story zuklappen");
        }
    }

    function toggleStoryCollapsed(storyCard) {
        if (!storyCard) return;
        const isCollapsed = storyCard.classList.contains("is-collapsed");
        setStoryCollapsed(storyCard, !isCollapsed);
    }

    function positionDictionary(anchor) {
        if (!dictPopup || !anchor) return;
        const anchorRect = anchor.getBoundingClientRect();
        const popupRect = dictPopup.getBoundingClientRect();
        const margin = 10;
        const edge = 12;

        let left = anchorRect.left;
        if (left + popupRect.width > window.innerWidth - edge) {
            left = window.innerWidth - popupRect.width - edge;
        }
        left = Math.max(edge, left);

        let top = anchorRect.bottom + margin;
        if (top + popupRect.height > window.innerHeight - edge) {
            top = anchorRect.top - popupRect.height - margin;
        }
        top = Math.max(edge, top);

        dictPopup.style.left = `${left}px`;
        dictPopup.style.top = `${top}px`;
    }

    function showDictionary(wordId, anchor, contextMeaning = "", sentenceId = "") {
        const word = wordsById.get(wordId);
        if (!word || !dictPopup) return;

        dictionaryAnchor = anchor;
        const exampleIds = sentenceIdsByWordId.get(wordId) || [];
        const examples = exampleIds
            .map(id => sentencesById.get(id))
            .filter(Boolean);

        dictPopup.innerHTML = `
            <div class="thai-giga-dictionary-header">
                <p class="thai-giga-eyebrow">Slang-Glossar</p>
                <button
                    class="thai-giga-dictionary-close"
                    type="button"
                    aria-label="Wörterbuch schließen">✕</button>
            </div>
            <div class="thai-giga-dictionary-word" lang="th">${renderToneMarkup(
                word.thai,
                word.transliteration,
                word.syllables
            )}</div>
            <p class="thai-giga-dictionary-transliteration">${escapeHtml(word.transliteration)}</p>
            ${contextMeaning ? `
                <div class="thai-giga-dictionary-context">
                    <strong>In diesem Satz gemeint als:</strong>
                    <span>${escapeHtml(contextMeaning)}</span>
                </div>
            ` : ""}
            <div class="thai-giga-dictionary-meaning">
                <div class="thai-giga-dictionary-meaning-header">DEUTSCHE BEDEUTUNG</div>
                <div class="thai-giga-dictionary-meaning-body">
                    <p class="thai-giga-dictionary-meaning-text">${escapeHtml((word.meanings || []).join(" / "))}</p>
                    ${word.infoSentence && word.infoSentence !== "Keine erforderlich." ? `
                        <div class="thai-giga-dictionary-meaning-info-label">Slang-Hinweis</div>
                        <p class="thai-giga-dictionary-meaning-info">${escapeHtml(word.infoSentence)}</p>
                    ` : ""}
                </div>
            </div>
            ${examples.length > 0 ? `
                <details class="thai-giga-dictionary-examples" open>
                    <summary>Beispiele in den Mini-Stories (${examples.length})</summary>
                    <div class="thai-giga-dictionary-sentences">
                        ${examples.map(ex => `
                            <button type="button" class="thai-giga-dictionary-example" data-example-sentence-id="${escapeHtml(ex.id)}" title="Zu diesem Satz in der Story springen">
                                <span class="thai-giga-dictionary-example-thai" lang="th">
                                    ${renderSentenceTokenMarkup(ex, false)}
                                </span>
                                <span class="thai-giga-dictionary-example-translation">
                                    ${escapeHtml(ex.translation)}
                                </span>
                            </button>
                        `).join("")}
                    </div>
                </details>
            ` : ""}
        `;

        dictPopup.hidden = false;
        positionDictionary(anchor);

        dictPopup.querySelector(".thai-giga-dictionary-close")?.addEventListener("click", () => {
            closeDictionary();
        });

        dictPopup.querySelectorAll("[data-example-sentence-id]").forEach(btn => {
            btn.addEventListener("click", () => {
                const sId = btn.dataset.exampleSentenceId;
                closeDictionary();
                switchView("stories", `sentence-${sId}`);
            });
        });
    }

    function closeDictionary() {
        if (!dictPopup) return;
        dictPopup.hidden = true;
        dictionaryAnchor = null;
    }

    function renderWordGrid(searchTerm = "") {
        if (!dictGrid || !content) return;
        const term = searchTerm.trim().toLowerCase();
        const words = content.words || [];

        const filtered = words.filter(word => {
            if (!term) return true;
            return (
                word.thai.toLowerCase().includes(term) ||
                word.transliteration.toLowerCase().includes(term) ||
                (word.meanings || []).some(m => m.toLowerCase().includes(term)) ||
                (word.infoSentence || "").toLowerCase().includes(term)
            );
        });

        if (dictCount) {
            dictCount.textContent = `${filtered.length} Wörter`;
        }

        dictGrid.innerHTML = filtered.map(word => {
            const audioMarkup = window.questAudio?.renderSentenceAudioPlayer
                ? window.questAudio.renderSentenceAudioPlayer({
                    audio: window.superSlangAudio?.getAudioForText(word.thai) || {
                        type: "speechSynthesis",
                        lang: "th-TH"
                    },
                    text: word.thai,
                    className: "thai-giga-word-audio",
                    ariaLabel: "Wort vorlesen"
                })
                : "";

            return `
                <article class="thai-giga-word-card">
                    <div class="thai-giga-word-card-main">
                        <div class="thai-giga-word-card-thai-line">
                            <strong lang="th">${renderToneMarkup(
                                word.thai,
                                word.transliteration,
                                word.syllables
                            )}</strong>
                        </div>
                        <em>${escapeHtml(word.transliteration)}</em>
                        <span>${escapeHtml((word.meanings || []).join(" / "))}</span>
                        ${word.infoSentence && word.infoSentence !== "Keine erforderlich." ? `
                            <small style="color: var(--super-slang-muted); font-size: 0.78rem; margin-top: 4px;">${escapeHtml(word.infoSentence)}</small>
                        ` : ""}
                    </div>
                    ${audioMarkup}
                </article>
            `;
        }).join("");

        if (window.questAudio?.initializeSentenceAudioPlayers) {
            window.questAudio.initializeSentenceAudioPlayers(dictGrid);
        }
    }

    function updatePlaylistButtons() {
        const playerState = window.superSlangAudio?.getState();
        const playlist = playerState?.playlist || [];
        const playlistIds = new Set(playlist.map(item => item.id));

        document.querySelectorAll("[data-slang-playlist-sentence]").forEach(button => {
            const sentenceId = button.dataset.slangPlaylistSentence;
            const isAdded = playlistIds.has(sentenceId);
            button.classList.toggle("is-added", isAdded);
            button.textContent = isAdded ? "✓ In Playlist" : "+ Playlist";
        });

        document.querySelectorAll("[data-slang-story-playlist]").forEach(button => {
            const storyId = button.dataset.slangStoryPlaylist;
            const story = storiesById.get(storyId);
            const sentenceIds = story ? story.sentences.map(s => s.id) : [];
            const allAdded = sentenceIds.length > 0 && sentenceIds.every(id => playlistIds.has(id));
            button.classList.toggle("is-added", allAdded);
            button.setAttribute(
                "aria-label",
                allAdded ? "Ganze Story aus der Audio-Playlist entfernen" : "Ganze Story zur Audio-Playlist hinzufügen"
            );
            button.title = allAdded ? "Ganze Story aus der Audio-Playlist entfernen" : "Ganze Story zur Audio-Playlist hinzufügen";
        });
    }

    function initializeSentenceEvents() {
        if (window.questAudio?.initializeSentenceAudioPlayers) {
            window.questAudio.initializeSentenceAudioPlayers(storiesContainer);
        }

        storiesContainer.querySelectorAll("[data-word-id]").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                showDictionary(
                    button.dataset.wordId,
                    button,
                    button.dataset.contextMeaning || "",
                    button.dataset.sentenceId || ""
                );
            });
        });

        storiesContainer.querySelectorAll(".thai-giga-sentence").forEach(sentenceElement => {
            const translation = sentenceElement.querySelector(".thai-giga-translation");
            if (!translation) return;

            sentenceElement.addEventListener("click", event => {
                if (event.target.closest("button, a, input, select, textarea")) return;
                const globallyVisible = document.body.dataset.thaiTranslationVisible !== "false";
                const currentState = translation.dataset.thaiGigaTranslationState || "default";
                const isCurrentlyVisible = currentState === "visible" || (currentState === "default" && globallyVisible);
                const nextState = isCurrentlyVisible ? "hidden" : "visible";
                translation.dataset.thaiGigaTranslationState = nextState;
            });
        });

        storiesContainer.querySelectorAll("[data-slang-playlist-sentence]").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                const sentenceId = button.dataset.slangPlaylistSentence;
                window.superSlangAudio?.toggleSentence(sentenceId);
                updatePlaylistButtons();
            });
        });

        storiesContainer.querySelectorAll("[data-slang-story-playlist]").forEach(button => {
            button.addEventListener("click", () => {
                const storyId = button.dataset.slangStoryPlaylist;
                const story = storiesById.get(storyId);
                if (!story) return;
                const sentenceIds = story.sentences.map(s => s.id);
                const playerState = window.superSlangAudio?.getState();
                const playlistIds = new Set((playerState?.playlist || []).map(item => item.id));
                const allAdded = sentenceIds.every(id => playlistIds.has(id));

                if (allAdded) {
                    window.superSlangAudio?.removeStory(sentenceIds);
                } else {
                    window.superSlangAudio?.addStory(sentenceIds);
                }
                updatePlaylistButtons();
            });
        });

        storiesContainer.querySelectorAll("[data-slang-story-play]").forEach(button => {
            button.addEventListener("click", () => {
                const storyId = button.dataset.slangStoryPlay;
                const story = storiesById.get(storyId);
                if (!story || story.sentences.length === 0) return;
                const sentenceIds = story.sentences.map(s => s.id);
                window.superSlangAudio?.addStory(sentenceIds);
                window.superSlangAudio?.addSentence(story.sentences[0].id, true);
                updatePlaylistButtons();
            });
        });

        storiesContainer.querySelectorAll(".super-slang-story-header").forEach(header => {
            header.addEventListener("click", event => {
                // Ignore clicks on buttons inside header (e.g. playlist button)
                if (event.target.closest("button")) return;
                const card = header.closest(".super-slang-story-card");
                if (card) {
                    toggleStoryCollapsed(card);
                }
            });
        });

        storiesContainer.querySelectorAll(".super-slang-story-summary").forEach(summary => {
            summary.addEventListener("click", event => {
                event.stopPropagation();
                const card = summary.closest(".super-slang-story-card");
                if (card) {
                    toggleStoryCollapsed(card);
                }
            });
        });

        storiesContainer.querySelectorAll("[data-slang-story-rsvp]").forEach(button => {
            button.addEventListener("click", () => {
                const storyId = button.dataset.slangStoryRsvp;
                const story = storiesById.get(storyId);
                if (!story || !window.thaiGigaRsvp?.open) return;
                window.thaiGigaRsvp.open(
                    story.sentences,
                    `RSVP · ${story.title}`,
                    `${story.sentences.length} Sätze · Super Slang`,
                    button
                );
            });
        });
    }

    function init() {
        content = window.superSlangContent || null;
        if (!content) {
            console.warn("Super Slang Daten wurden noch nicht geladen.");
            return;
        }

        (content.words || []).forEach(word => {
            wordsById.set(word.id, word);
            sentenceIdsByWordId.set(word.id, []);
        });

        const allStories = [];
        (content.levels || []).forEach(level => {
            (level.bosses || []).forEach(boss => {
                (boss.blocks || []).forEach(block => {
                    (block.miniStories || []).forEach(story => {
                        storiesById.set(story.id, story);
                        allStories.push(story);
                        (story.sentences || []).forEach(sentence => {
                            sentencesById.set(sentence.id, sentence);
                            (sentence.tokens || []).forEach(token => {
                                if (token.kind === "word" && token.wordId) {
                                    const list = sentenceIdsByWordId.get(token.wordId);
                                    if (list && !list.includes(sentence.id)) {
                                        list.push(sentence.id);
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });

        if (window.thaiGigaRsvp?.initialize) {
            window.thaiGigaRsvp.initialize({ sentencesById, storiesById, wordsById });
        }

        if (storiesContainer) {
            storiesContainer.innerHTML = allStories.map((story, idx) => renderStory(story, idx)).join("");
            initializeSentenceEvents();
            updatePlaylistButtons();
        }

        renderWordGrid();

        if (dictSearch) {
            dictSearch.addEventListener("input", () => {
                renderWordGrid(dictSearch.value);
            });
        }

        if (wordmixButton) {
            wordmixButton.addEventListener("click", () => {
                const playerState = window.superSlangAudio?.getState();
                if (!playerState || playerState.playlist.length === 0) {
                    const allSentenceIds = Array.from(sentencesById.keys());
                    window.superSlangAudio?.addStory(allSentenceIds);
                }
                window.location.href = "satzmix.html?source=playlist&key=superSlang%3Av1%3Aaudio-playlist";
            });
        }

        function resolveTargetElement(targetId, isGlossary) {
            if (!targetId) {
                return isGlossary ? dictSection : storiesSection;
            }
            if (targetId === "glossar" || targetId === "glossary" || targetId === "superSlangDictionarySection") {
                return dictSection;
            }
            if (targetId === "stories" || targetId === "superSlangStoriesSection") {
                return storiesSection;
            }
            if (targetId === "story-slang-s1" || targetId === "story-1") {
                return document.getElementById("story-slang-story-01") || storiesSection;
            }
            if (targetId === "story-slang-s2" || targetId === "story-2") {
                return document.getElementById("story-slang-story-02") || storiesSection;
            }
            if (targetId === "story-slang-s3" || targetId === "story-3") {
                return document.getElementById("story-slang-story-03") || storiesSection;
            }
            return document.getElementById(targetId) || (isGlossary ? dictSection : storiesSection);
        }

        function scrollToTarget(targetEl) {
            if (!targetEl) return;
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // View switching: Mini-Stories vs. Token-Glossar & direct jumping
        function switchView(viewName, targetId) {
            const isGlossary = viewName === "glossary";
            if (storiesSection) storiesSection.hidden = isGlossary;
            if (dictSection) dictSection.hidden = !isGlossary;
            if (audioPlayer) audioPlayer.hidden = isGlossary;

            document.querySelectorAll(".super-slang-chapter-nav a").forEach(link => {
                const href = link.getAttribute("href") || "";
                const linkId = href.startsWith("#") ? href.slice(1) : "";
                const linkView = link.dataset.viewTarget;

                let isItemActive = false;
                if (targetId) {
                    isItemActive = (linkId === targetId);
                } else {
                    isItemActive = (!isGlossary && linkView === "stories" && !link.classList.contains("super-slang-nav-sublink")) ||
                                   (isGlossary && linkView === "glossary");
                }
                link.classList.toggle("is-active", isItemActive);
            });

            const targetEl = resolveTargetElement(targetId, isGlossary);
            if (targetEl) {
                const storyCard = targetEl.classList.contains("super-slang-story-card")
                    ? targetEl
                    : targetEl.closest(".super-slang-story-card");
                if (storyCard) {
                    setStoryCollapsed(storyCard, false);
                }

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        scrollToTarget(targetEl);
                        if (isGlossary && dictSearch && (!targetId || targetId === "glossar" || targetId === "glossary")) {
                            dictSearch.focus();
                        }
                    }, 40);
                });
            }
        }

        document.querySelectorAll(".super-slang-chapter-nav a[href]").forEach(link => {
            link.addEventListener("click", event => {
                const href = link.getAttribute("href") || "";
                if (!href.startsWith("#")) return;
                event.preventDefault();

                const targetId = href.slice(1);
                const isGlossary = targetId === "glossar" || targetId === "glossary" || link.dataset.viewTarget === "glossary";
                const view = isGlossary ? "glossary" : "stories";

                switchView(view, targetId);
                closeSidebar();

                if (window.location.hash !== href) {
                    history.pushState(null, "", href);
                }
            });
        });

        function handleHash() {
            const hash = window.location.hash;
            if (hash === "#glossar" || hash === "#glossary" || hash === "#superSlangDictionarySection") {
                switchView("glossary", "glossar");
            } else if (hash.startsWith("#story-") || hash.startsWith("#sentence-")) {
                switchView("stories", hash.slice(1));
            } else if (hash === "#stories") {
                switchView("stories", "stories");
            } else {
                switchView("stories");
            }
        }

        window.addEventListener("hashchange", handleHash);
        handleHash();

        window.addEventListener("superSlang:playlist-updated", updatePlaylistButtons);
        setTimeout(updatePlaylistButtons, 200);

        window.addEventListener("resize", () => {
            if (dictionaryAnchor && dictPopup && !dictPopup.hidden) {
                positionDictionary(dictionaryAnchor);
            }
        });

        document.addEventListener("click", event => {
            if (dictPopup && !dictPopup.hidden) {
                if (!dictPopup.contains(event.target) && !event.target.closest("[data-word-id]")) {
                    closeDictionary();
                }
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                if (dictPopup && !dictPopup.hidden) {
                    closeDictionary();
                    dictionaryAnchor?.focus();
                }
            }
        });
    }

    // Sidebar navigation
    function closeSidebar() {
        sidebar?.classList.remove("is-open");
        backdrop?.classList.remove("is-visible");
        toggle?.setAttribute("aria-expanded", "false");
    }

    function openSidebar() {
        sidebar?.classList.add("is-open");
        backdrop?.classList.add("is-visible");
        toggle?.setAttribute("aria-expanded", "true");
        sidebar?.querySelector("a")?.focus();
    }

    toggle?.addEventListener("click", () => {
        if (sidebar?.classList.contains("is-open")) {
            closeSidebar();
            toggle?.focus();
            return;
        }
        openSidebar();
    });

    backdrop?.addEventListener("click", closeSidebar);

    sidebar?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
            closeSidebar();
            toggle?.focus();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
