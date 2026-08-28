(function () {
    "use strict";

    const elements = {
        overlay: document.getElementById("comedyReadingOverlay"),
        title: document.getElementById("comedyReadingTitle"),
        lines: document.getElementById("comedyReadingLines"),
        dictionary: document.getElementById("comedyReadingDictionary"),
        close: document.getElementById("comedyReadingClose"),
        readingButton: document.getElementById("readingButton")
    };

    let activeWord = "";
    let activeDictionary = new Map();

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeWord(value) {
        return String(value ?? "").normalize("NFC");
    }

    function getGlossaryEntry(word) {
        const glossary = typeof comedyGlossary !== "undefined"
            ? comedyGlossary
            : (typeof window !== "undefined" ? window.comedyGlossary : null);
        if (!glossary) {
            return null;
        }
        return glossary[normalizeWord(word)] || null;
    }

    function applyTokenBoundaryOverrides(segments) {
        const overrides = typeof comedyTokenBoundaryOverrides !== "undefined"
            ? comedyTokenBoundaryOverrides
            : (typeof window !== "undefined"
                ? window.comedyTokenBoundaryOverrides
                : []);
        const result = [];

        for (let index = 0; index < segments.length;) {
            const override = overrides.find(candidate => {
                if (candidate.segmented.length > segments.length - index) {
                    return false;
                }

                const matchedSegments = segments.slice(
                    index,
                    index + candidate.segmented.length
                );
                const contiguous = matchedSegments.every((segment, offset) => {
                    if (offset === 0) {
                        return true;
                    }

                    const previous = matchedSegments[offset - 1];
                    return previous.index + previous.segment.length === segment.index;
                });

                return contiguous && matchedSegments.every((segment, offset) =>
                    segment.isWordLike &&
                    segment.segment === candidate.segmented[offset]
                );
            });

            if (!override) {
                result.push(segments[index]);
                index += 1;
                continue;
            }

            const firstSegment = segments[index];
            override.words.forEach(word => {
                result.push({
                    index: firstSegment.index,
                    segment: word,
                    isWordLike: true
                });
            });
            index += override.segmented.length;
        }

        return result;
    }

    function tokenizeThai(text) {
        const segmenter = typeof Intl !== "undefined" &&
            typeof Intl.Segmenter === "function"
            ? new Intl.Segmenter("th", { granularity: "word" })
            : null;

        if (!segmenter) {
            console.warn("Thai-Wortsegmentierung ist in diesem Browser nicht verfügbar.");
            return [{ text: String(text ?? ""), isWordLike: false }];
        }

        const segments = Array.from(segmenter.segment(String(text ?? "")));
        return applyTokenBoundaryOverrides(segments).map(segment => ({
            text: segment.segment,
            isWordLike: segment.isWordLike
        }));
    }

    function getSpeakerLabel(line) {
        if (line.sceneIntro) {
            return "Szene";
        }

        return line.speaker
            ? String(line.speaker).replace(/^./, character => character.toUpperCase())
            : "Dialog";
    }

    function buildReadingData(episode) {
        const dictionary = new Map();
        const lines = Array.isArray(episode?.dialogue) ? episode.dialogue : [];

        const renderedLines = lines.map((line, index) => {
            const tokens = tokenizeThai(line.thai);
            const tokenMarkup = tokens.map(token => {
                if (!token.isWordLike || !token.text.trim()) {
                    return `<span>${escapeHtml(token.text)}</span>`;
                }

                const word = normalizeWord(token.text);
                const entry = dictionary.get(word) || {
                    word,
                    occurrences: []
                };
                entry.occurrences.push({
                    lineNumber: index + 1,
                    thai: line.thai,
                    deutsch: line.deutsch,
                    speaker: getSpeakerLabel(line)
                });
                dictionary.set(word, entry);

                const hasTranslation = Boolean(getGlossaryEntry(word));
                const missingAttrs = hasTranslation
                    ? ""
                    : ` data-comedy-missing="true"`;
                const wordClass = hasTranslation
                    ? "comedy-reading-word"
                    : "comedy-reading-word is-missing";
                const wordTitle = hasTranslation
                    ? "Wort im Wörterbuch öffnen"
                    : "Noch keine Übersetzung hinterlegt";

                return `
                    <button
                        class="${wordClass}"
                        type="button"
                        data-comedy-word="${escapeHtml(word)}"${missingAttrs}
                        title="${wordTitle}">${escapeHtml(token.text)}</button>
                `;
            }).join("");

            return {
                index,
                sceneIntro: Boolean(line.sceneIntro),
                speaker: getSpeakerLabel(line),
                thai: line.thai,
                deutsch: line.deutsch,
                tokenMarkup
            };
        });

        return {
            dictionary,
            renderedLines
        };
    }

    function renderLines(lines) {
        elements.lines.innerHTML = lines.map(line => `
            <article class="comedy-reading-line${line.sceneIntro ? " is-scene-intro" : ""}">
                <div class="comedy-reading-line-meta">
                    <span>Satz ${line.index + 1}</span>
                    <strong>${escapeHtml(line.speaker)}</strong>
                </div>
                <p class="comedy-reading-thai" lang="th">${line.tokenMarkup}</p>
                <p class="comedy-reading-german">${escapeHtml(line.deutsch)}</p>
            </article>
        `).join("");

        elements.lines.querySelectorAll("[data-comedy-word]").forEach(button => {
            button.addEventListener("click", () => {
                showDictionary(button.dataset.comedyWord, button);
            });
        });
    }

    function renderDictionaryEntry(word, anchor) {
        const entry = activeDictionary.get(normalizeWord(word));
        if (!entry) {
            elements.dictionary.hidden = true;
            return;
        }

        const occurrences = entry.occurrences.map(occurrence => `
            <li>
                <strong>Satz ${occurrence.lineNumber} · ${escapeHtml(occurrence.speaker)}</strong>
                <span class="comedy-reading-dictionary-thai" lang="th">
                    ${escapeHtml(occurrence.thai)}
                </span>
                <span>${escapeHtml(occurrence.deutsch)}</span>
            </li>
        `).join("");

        const glossaryEntry = getGlossaryEntry(entry.word);
        const meaningMarkup = glossaryEntry && glossaryEntry.de
            ? `
                <div class="comedy-reading-dictionary-meaning">
                    <p class="eyebrow">Deutsche Bedeutung</p>
                    <p class="comedy-reading-dictionary-translation">
                        ${escapeHtml(glossaryEntry.de)}
                    </p>
                    ${glossaryEntry.note ? `
                        <p class="comedy-reading-dictionary-explanation">
                            ${escapeHtml(glossaryEntry.note)}
                        </p>
                    ` : ""}
                </div>
            `
            : `
                <div class="comedy-reading-dictionary-meaning is-missing" role="status">
                    <p class="eyebrow">Deutsche Bedeutung</p>
                    <p class="comedy-reading-dictionary-translation is-missing">
                        ⚠️ Für dieses Wort ist noch keine Übersetzung hinterlegt.
                    </p>
                    <p class="comedy-reading-dictionary-explanation">
                        Bitte im Glossar (data/comedy-glossary.js) ergänzen.
                    </p>
                </div>
            `;

        elements.dictionary.innerHTML = `
            <div class="comedy-reading-dictionary-header">
                <div>
                    <p class="eyebrow">Wörterbuch</p>
                    <h3 lang="th">${escapeHtml(entry.word)}</h3>
                </div>
                <button
                    class="comedy-reading-dictionary-close"
                    type="button"
                    aria-label="Wörterbuch schließen">✕</button>
            </div>
            ${meaningMarkup}
            <p class="comedy-reading-dictionary-note">
                ${entry.occurrences.length} Vorkommen in dieser Episode.
                Die Beispiele zeigen, wie das Wort in der Episode verwendet wird.
            </p>
            <ul class="comedy-reading-dictionary-occurrences">${occurrences}</ul>
        `;
        elements.dictionary.hidden = false;
        activeWord = entry.word;

        elements.lines.querySelectorAll("[data-comedy-word]").forEach(button => {
            button.classList.toggle(
                "is-selected",
                normalizeWord(button.dataset.comedyWord) === activeWord
            );
        });

        elements.dictionary
            .querySelector(".comedy-reading-dictionary-close")
            .addEventListener("click", closeDictionary);
        anchor?.scrollIntoView({ block: "nearest" });
    }

    function showDictionary(word, anchor) {
        renderDictionaryEntry(word, anchor);
    }

    function closeDictionary() {
        elements.dictionary.hidden = true;
        elements.dictionary.replaceChildren();
        activeWord = "";
        elements.lines.querySelectorAll("[data-comedy-word]").forEach(button => {
            button.classList.remove("is-selected");
        });
    }

    function open(episodeNumber) {
        const episodes = typeof comedyEpisodes !== "undefined"
            ? comedyEpisodes
            : null;
        const episode = episodes?.[episodeNumber];
        if (!episode || !Array.isArray(episode.dialogue)) {
            console.error("Komödien-Episode konnte nicht zum Lesen geöffnet werden.");
            return;
        }

        const readingData = buildReadingData(episode);
        activeDictionary = readingData.dictionary;
        elements.title.textContent = `${episode.titel} · ${episode.kapitel}`;
        closeDictionary();
        renderLines(readingData.renderedLines);
        elements.overlay.hidden = false;
        elements.overlay.classList.add("is-open");
        elements.close.focus();
    }

    function close() {
        elements.overlay.classList.remove("is-open");
        elements.overlay.hidden = true;
        closeDictionary();
        elements.readingButton?.focus();
    }

    elements.close.addEventListener("click", close);
    elements.overlay.addEventListener("click", event => {
        if (event.target === elements.overlay) {
            close();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.overlay.hidden) {
            if (!elements.dictionary.hidden) {
                closeDictionary();
            } else {
                close();
            }
        }
    });

    window.comedyReader = {
        open,
        close
    };
})();
