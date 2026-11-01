(function () {
    "use strict";

    const elements = {
        sidebar: document.getElementById("comedySidebar"),
        sidebarBackdrop: document.getElementById("comedySidebarBackdrop"),
        sidebarToggle: document.getElementById("comedySidebarToggle"),
        settingsToggle: document.getElementById("comedySettingsToggle"),
        settingsBackdrop: document.getElementById("comedySettingsBackdrop"),
        settingsPanel: document.getElementById("comedySettingsPanel"),
        settingsClose: document.getElementById("comedySettingsClose"),
        fontSelect: document.getElementById("comedyFontSelect"),
        translationToggle: document.getElementById("comedyTranslationToggle"),
        episodeNavigation: document.getElementById("comedyEpisodeNavigation"),
        emptyState: document.getElementById("comedyEmptyState"),
        content: document.getElementById("comedyDrillContent"),
        eyebrow: document.getElementById("comedyEpisodeEyebrow"),
        title: document.getElementById("comedyEpisodeTitle"),
        description: document.getElementById("comedyEpisodeDescription"),
        story: document.getElementById("comedyEpisodeStory"),
        sentenceCount: document.getElementById("comedyEpisodeSentenceCount"),
        readButton: document.getElementById("readingButton"),
        typingButton: document.getElementById("comedyTypingButton"),
        sentences: document.getElementById("comedyEpisodeSentences")
    };

    const episodes = typeof comedyEpisodes !== "undefined" ? comedyEpisodes : {};
    const episodeNumbers = Object.keys(episodes)
        .map(Number)
        .filter(Number.isInteger)
        .sort((left, right) => left - right);
    const audioEntriesById = new Map();
    const fontFamilies = {
        standard: '"Noto Serif Thai", "Times New Roman", Times, serif',
        "noto-sans-thai": '"Noto Sans Thai", sans-serif',
        sarabun: '"Sarabun", sans-serif',
        prompt: '"Prompt", sans-serif',
        kanit: '"Kanit", sans-serif'
    };
    const fontStorageKey = "thaiFontFamily";
    const translationStorageKey = "thaiGigaTranslationVisible";
    let activeEpisodeNumber = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getEpisodeLabel(number) {
        const episode = episodes[number];
        return episode?.kapitel || `Episode ${String(number).padStart(2, "0")}`;
    }

    function getSpeakerLabel(line) {
        if (line.sceneIntro) {
            return "Szene";
        }
        return line.portrait || line.speaker || "Dialog";
    }

    function getAudioEntryId(episodeNumber, lineNumber) {
        return `comedy:${episodeNumber}:${lineNumber}`;
    }

    function isSentenceTranslationVisible(sentence) {
        const translation = sentence.querySelector("[data-thai-giga-translation-state]");
        const state = translation?.dataset.thaiGigaTranslationState || "default";
        const globallyVisible = document.body.dataset.thaiTranslationVisible !== "false";
        return state === "visible" || (state === "default" && globallyVisible);
    }

    function updateSentenceExpandedState() {
        elements.sentences
            .querySelectorAll(".comedy-drill-sentence")
            .forEach(sentence => {
                sentence.setAttribute(
                    "aria-expanded",
                    String(isSentenceTranslationVisible(sentence))
                );
            });
    }

    function toggleSentenceTranslation(sentence) {
        const translation = sentence.querySelector("[data-thai-giga-translation-state]");
        if (!translation) {
            return;
        }

        const nextState = isSentenceTranslationVisible(sentence) ? "hidden" : "visible";
        translation.dataset.thaiGigaTranslationState = nextState;
        sentence.setAttribute("aria-expanded", String(nextState === "visible"));
    }

    function applyFont(value) {
        const selection = Object.prototype.hasOwnProperty.call(fontFamilies, value)
            ? value
            : "sarabun";
        document.body.style.setProperty("--thai-font-family", fontFamilies[selection]);
        elements.fontSelect.value = selection;
        return selection;
    }

    function applyTranslationVisibility(visible) {
        const isVisible = Boolean(visible);
        document.body.dataset.thaiTranslationVisible = String(isVisible);
        elements.translationToggle.checked = isVisible;
        updateSentenceExpandedState();
        return isVisible;
    }

    function closeSettings(returnFocus = false) {
        elements.settingsPanel.hidden = true;
        elements.settingsBackdrop.hidden = true;
        elements.settingsToggle.setAttribute("aria-expanded", "false");
        elements.settingsToggle.setAttribute(
            "aria-label",
            "Komödien-Einstellungen öffnen"
        );
        if (returnFocus) {
            elements.settingsToggle.focus();
        }
    }

    function openSettings() {
        elements.settingsPanel.hidden = false;
        elements.settingsBackdrop.hidden = false;
        elements.settingsToggle.setAttribute("aria-expanded", "true");
        elements.settingsToggle.setAttribute(
            "aria-label",
            "Komödien-Einstellungen schließen"
        );
        elements.settingsClose.focus();
    }

    function initializeSettings() {
        const storedFont = localStorage.getItem(fontStorageKey);
        const selectedFont = Object.prototype.hasOwnProperty.call(
            fontFamilies,
            storedFont
        )
            ? storedFont
            : "sarabun";
        const storedTranslation = localStorage.getItem(translationStorageKey);
        const translationVisible =
            storedTranslation === null || storedTranslation === "true";

        applyFont(selectedFont);
        applyTranslationVisibility(translationVisible);
        localStorage.setItem(fontStorageKey, selectedFont);
        localStorage.setItem(translationStorageKey, String(translationVisible));

        elements.settingsToggle.addEventListener("click", () => {
            if (elements.settingsPanel.hidden) {
                openSettings();
            } else {
                closeSettings();
            }
        });
        elements.settingsClose.addEventListener("click", () => closeSettings(true));
        elements.settingsBackdrop.addEventListener("click", () => closeSettings(true));
        elements.fontSelect.addEventListener("change", event => {
            const selection = applyFont(event.target.value);
            localStorage.setItem(fontStorageKey, selection);
        });
        elements.translationToggle.addEventListener("change", event => {
            const visible = applyTranslationVisibility(event.target.checked);
            localStorage.setItem(translationStorageKey, String(visible));
        });
    }

    function getAllAudioEntries() {
        const entries = [];
        episodeNumbers.forEach(episodeNumber => {
            const episode = episodes[episodeNumber];
            const dialogue = Array.isArray(episode.dialogue) ? episode.dialogue : [];
            dialogue.forEach((line, index) => {
                const id = getAudioEntryId(episodeNumber, index + 1);
                const entry = {
                    id,
                    storyTitle: getEpisodeLabel(episodeNumber),
                    sentenceNumber: index + 1,
                    thai: line.thai,
                    transliteration: line.transliteration || "",
                    translation: line.deutsch || "",
                    audio: window.comedyAudio.getAudioForText(line.thai)
                };
                audioEntriesById.set(id, entry);
                entries.push(entry);
            });
        });
        return entries;
    }

    function renderEpisodeNavigation() {
        elements.episodeNavigation.innerHTML = episodeNumbers.map(number => `
            <button
                type="button"
                class="thai-giga-chapter-button comedy-drill-episode-button"
                data-comedy-episode="${number}"
                aria-pressed="false">
                <span>${escapeHtml(getEpisodeLabel(number))}</span>
                <strong lang="th">${escapeHtml(episodes[number].titel)}</strong>
            </button>
        `).join("");

        elements.episodeNavigation
            .querySelectorAll("[data-comedy-episode]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    selectEpisode(Number(button.dataset.comedyEpisode));
                });
            });
    }

    function renderSentence(line, episodeNumber, lineNumber) {
        const sentenceId = getAudioEntryId(episodeNumber, lineNumber);
        const audio = window.comedyAudio.getAudioForText(line.thai);
        const playButton = window.questAudio.renderSentenceAudioPlayer({
            audio,
            text: line.thai,
            className: "comedy-drill-audio-button",
            playbackRate: 1,
            contentMode: "comedy",
            sentenceId
        });
        const speakerLabel = getSpeakerLabel(line);
        const sceneLabel = line.scene
            ? `Szene ${line.scene}`
            : line.sceneIntro
                ? "Szenenbeschreibung"
                : `Satz ${lineNumber}`;

        const translationVisible =
            document.body.dataset.thaiTranslationVisible !== "false";
        return `
            <article
                class="comedy-drill-sentence${line.sceneIntro ? " is-scene-intro" : ""}"
                data-comedy-sentence
                tabindex="0"
                aria-expanded="${translationVisible}"
                title="Tippen, um die deutsche Übersetzung ein- oder auszublenden">
                <div class="comedy-drill-sentence-meta">
                    <span>${escapeHtml(sceneLabel)}</span>
                    <strong class="comedy-drill-speaker">${escapeHtml(speakerLabel)}</strong>
                </div>
                <p class="comedy-drill-thai" lang="th">${escapeHtml(line.thai)}</p>
                <p
                    class="comedy-drill-german thai-giga-translation"
                    data-thai-giga-translation-state="default">${escapeHtml(line.deutsch)}</p>
                <div class="comedy-drill-sentence-actions">
                    ${playButton}
                    <button
                        type="button"
                        class="comedy-drill-add-audio"
                        data-comedy-audio-entry="${escapeHtml(sentenceId)}"
                        aria-label="Satz zur Audio-Playlist hinzufügen">＋ Playlist</button>
                </div>
            </article>
        `;
    }

    function renderEpisode(number) {
        const episode = episodes[number];
        const dialogue = Array.isArray(episode.dialogue) ? episode.dialogue : [];
        elements.eyebrow.textContent = getEpisodeLabel(number);
        elements.title.textContent = episode.titel || getEpisodeLabel(number);
        elements.description.textContent = episode.beschreibung || "";
        elements.description.hidden = !episode.beschreibung;
        elements.story.textContent = episode.story || "";
        elements.story.hidden = !episode.story;
        elements.sentenceCount.textContent = `${dialogue.length} Sätze`;
        elements.readButton.disabled = dialogue.length === 0;
        elements.typingButton.disabled = dialogue.length === 0;
        elements.sentences.innerHTML = dialogue.length === 0
            ? `<div class="comedy-drill-empty"><p>Diese Episode enthält noch keine Sätze.</p></div>`
            : dialogue
                .map((line, index) => renderSentence(line, number, index + 1))
                .join("");

        elements.sentences
            .querySelectorAll("[data-comedy-audio-entry]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const entry = audioEntriesById.get(button.dataset.comedyAudioEntry);
                    if (!entry) {
                        console.error("Komödien-Satz konnte nicht zur Audio-Playlist hinzugefügt werden.");
                        return;
                    }

                    window.comedyAudio.addSentences([entry]).catch(error => {
                        console.error("Komödien-Satz konnte nicht zur Audio-Playlist hinzugefügt werden.", error);
                        document.getElementById("comedyAudioStatus").textContent =
                            "Der Satz konnte nicht zur Audio-Playlist hinzugefügt werden.";
                    });
                });
            });
        window.questAudio.initializeSentenceAudioPlayers(elements.sentences);
    }

    function closeSidebar() {
        elements.sidebar.classList.remove("is-open");
        elements.sidebarBackdrop.classList.remove("is-visible");
        elements.sidebarToggle.setAttribute("aria-expanded", "false");
    }

    function selectEpisode(number, updateLocation = true) {
        if (!episodeNumbers.includes(number)) {
            console.error(`Komödien-Episode "${number}" ist nicht vorhanden.`);
            return false;
        }

        activeEpisodeNumber = number;
        elements.episodeNavigation
            .querySelectorAll("[data-comedy-episode]")
            .forEach(button => {
                const selected = Number(button.dataset.comedyEpisode) === number;
                button.classList.toggle("is-active", selected);
                button.setAttribute("aria-pressed", String(selected));
            });
        renderEpisode(number);
        closeSidebar();

        if (updateLocation) {
            window.history.replaceState(null, "", `#episode-${number}`);
        }
        return true;
    }

    function startTyping() {
        if (!activeEpisodeNumber) {
            return;
        }

        localStorage.setItem("contentMode", "comedy");
        localStorage.setItem("aktuelleQuest", String(activeEpisodeNumber));
        localStorage.setItem("questMode", "learning");
        window.location.href = "typing.html";
    }

    function openReadingMode() {
        if (activeEpisodeNumber) {
            window.comedyReader.open(activeEpisodeNumber);
        }
    }

    async function initialize() {
        if (episodeNumbers.length === 0) {
            elements.emptyState.hidden = false;
            elements.content.hidden = true;
            return;
        }
        if (!window.comedyAudio?.ready || !window.questAudio?.renderSentenceAudioPlayer) {
            throw new Error("Komödien-Audio konnte nicht initialisiert werden.");
        }

        await window.comedyAudio.ready;
        await window.comedyAudio.setContent(getAllAudioEntries());
        renderEpisodeNavigation();

        const requestedEpisode = Number(
            window.location.hash.match(/^#episode-(\d+)$/)?.[1]
        );
        const firstEpisode = episodeNumbers.includes(requestedEpisode)
            ? requestedEpisode
            : episodeNumbers[0];
        initializeSettings();
        selectEpisode(firstEpisode, false);

        elements.sentences.addEventListener("click", event => {
            const sentence = event.target.closest(".comedy-drill-sentence");
            if (
                !sentence ||
                event.target.closest("button, a, input, select, textarea")
            ) {
                return;
            }
            toggleSentenceTranslation(sentence);
        });
        elements.sentences.addEventListener("keydown", event => {
            const sentence = event.target;
            if (
                !sentence.matches(".comedy-drill-sentence") ||
                (event.key !== "Enter" && event.key !== " ")
            ) {
                return;
            }
            event.preventDefault();
            toggleSentenceTranslation(sentence);
        });
        elements.sidebarToggle.addEventListener("click", () => {
            const isOpen = elements.sidebar.classList.toggle("is-open");
            elements.sidebarBackdrop.classList.toggle("is-visible", isOpen);
            elements.sidebarToggle.setAttribute("aria-expanded", String(isOpen));
        });
        elements.sidebarBackdrop.addEventListener("click", closeSidebar);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                if (!elements.settingsPanel.hidden) {
                    closeSettings(true);
                } else {
                    closeSidebar();
                }
            }
        });
        elements.readButton.addEventListener("click", openReadingMode);
        elements.typingButton.addEventListener("click", startTyping);
    }

    window.comedyDrill = {
        selectEpisode
    };

    initialize().catch(error => {
        console.error("Komödien-Seite konnte nicht initialisiert werden.", error);
        elements.emptyState.hidden = false;
        elements.emptyState.querySelector("h2").textContent = "Komödie konnte nicht geladen werden";
        elements.emptyState.querySelector("p").textContent =
            "Die Episoden konnten nicht dargestellt werden. Details stehen in der Browser-Konsole.";
        elements.content.hidden = true;
    });
})();
