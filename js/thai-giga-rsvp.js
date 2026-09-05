(function () {
    "use strict";

    const MIN_WPM = 25;
    const MAX_WORD_WPM = 800;
    const MAX_CHUNK_WPM = 500;
    const WPM_STEP = 25;
    const DEFAULT_WPM = 300;
    const SENTENCE_GAP_MS = 300;
    const SETTINGS_STORAGE_KEY = "thaiGigaRsvpSettings";
    const MIN_FONT_SIZE = 20;
    const MAX_FONT_SIZES = {
        thai: 48,
        transliteration: 36,
        german: 36
    };
    const elements = {
        overlay: document.getElementById("thaiGigaSpeedreading"),
        scope: document.getElementById("thaiGigaSpeedreadingScope"),
        list: document.getElementById("thaiGigaSpeedreadingList"),
        close: document.getElementById("thaiGigaSpeedreadingClose"),
        thai: document.getElementById("thaiGigaSpeedreadingThai"),
        transliteration: document.getElementById("thaiGigaSpeedreadingTransliteration"),
        translation: document.getElementById("thaiGigaSpeedreadingTranslation"),
        wordSeparation: document.getElementById("thaiGigaSpeedreadingWordSeparation"),
        toneColors: document.getElementById("thaiGigaSpeedreadingToneColors"),
        progress: document.getElementById("thaiGigaRsvpProgress"),
        wpm: document.getElementById("thaiGigaRsvpWpm"),
        wpmSlider: document.getElementById("thaiGigaRsvpWpmSlider"),
        repetitions: document.getElementById("thaiGigaRsvpRepetitions"),
        thaiFontSize: document.getElementById("thaiGigaRsvpThaiFontSize"),
        thaiFontSizeValue: document.getElementById("thaiGigaRsvpThaiFontSizeValue"),
        transliterationFontSize: document.getElementById("thaiGigaRsvpTransliterationFontSize"),
        transliterationFontSizeValue: document.getElementById("thaiGigaRsvpTransliterationFontSizeValue"),
        germanFontSize: document.getElementById("thaiGigaRsvpGermanFontSize"),
        germanFontSizeValue: document.getElementById("thaiGigaRsvpGermanFontSizeValue")
    };

    let indexes = null;
    let sentences = [];
    let units = [];
    let mode = "word";
    let wpm = DEFAULT_WPM;
    let repetitionSetting = 1;
    let repetition = 1;
    let unitIndex = 0;
    let playing = false;
    let timer = null;
    let startedAt = 0;
    let completedUnits = 0;
    let completedWords = 0;
    let completedSentences = 0;
    let completedRepetitions = 0;
    let sessionComplete = false;
    let returnFocus = null;
    const fontSizes = {
        thai: 28,
        transliteration: 22,
        german: 22
    };
    let storedSettings = readStoredSettings();

    function getMaxWpm(targetMode = mode) {
        return targetMode === "word" ? MAX_WORD_WPM : MAX_CHUNK_WPM;
    }

    function normalizeWpm(value, targetMode = mode) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return DEFAULT_WPM;
        return Math.min(
            getMaxWpm(targetMode),
            Math.max(MIN_WPM, Math.round(numericValue / WPM_STEP) * WPM_STEP)
        );
    }

    function normalizeRepetitionSetting(value) {
        if (value === "infinite" || value === Infinity) return Infinity;
        return [1, 2, 3].includes(Number(value)) ? Number(value) : 1;
    }

    function normalizeFontSize(key, value) {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return fontSizes[key];
        return Math.min(
            MAX_FONT_SIZES[key],
            Math.max(MIN_FONT_SIZE, Math.round(numericValue))
        );
    }

    function readStoredSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== "object") return null;
            const display = parsed.display && typeof parsed.display === "object"
                ? parsed.display
                : {};
            const storedFontSizes = parsed.fontSizes && typeof parsed.fontSizes === "object"
                ? parsed.fontSizes
                : {};

            const storedMode = parsed.mode === "chunk" ? "chunk" : "word";
            return {
                mode: storedMode,
                wpm: normalizeWpm(parsed.wpm, storedMode),
                repetitionSetting: normalizeRepetitionSetting(parsed.repetitionSetting),
                display: {
                    thai: typeof display.thai === "boolean" ? display.thai : null,
                    transliteration: typeof display.transliteration === "boolean"
                        ? display.transliteration
                        : null,
                    translation: typeof display.translation === "boolean"
                        ? display.translation
                        : null,
                    wordTranslation: typeof display.wordTranslation === "boolean"
                        ? display.wordTranslation
                        : null,
                    wordSeparation: typeof display.wordSeparation === "boolean"
                        ? display.wordSeparation
                        : null,
                    toneColors: typeof display.toneColors === "boolean"
                        ? display.toneColors
                        : null
                },
                fontSizes: {
                    thai: normalizeFontSize("thai", storedFontSizes.thai),
                    transliteration: normalizeFontSize(
                        "transliteration",
                        storedFontSizes.transliteration
                    ),
                    german: normalizeFontSize("german", storedFontSizes.german)
                }
            };
        } catch (error) {
            console.warn("RSVP-Einstellungen konnten nicht gelesen werden.", error);
            return null;
        }
    }

    function saveSettings() {
        const settings = {
            version: 1,
            mode,
            wpm,
            repetitionSetting: repetitionSetting === Infinity ? "infinite" : repetitionSetting,
            display: {
                thai: elements.thai?.checked !== false,
                transliteration: elements.transliteration?.checked !== false,
                translation: elements.translation?.checked !== false,
                wordTranslation: elements.translation?.checked !== false,
                wordSeparation: elements.wordSeparation?.checked !== false,
                toneColors: elements.toneColors?.checked !== false
            },
            fontSizes: { ...fontSizes }
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        storedSettings = settings;
    }

    function syncModeSettings() {
        document.querySelectorAll("[data-thai-giga-rsvp-mode]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.thaiGigaRsvpMode === mode));
        });
    }

    function syncRepetitionSettings() {
        if (elements.repetitions) {
            elements.repetitions.value = repetitionSetting === Infinity
                ? "infinite"
                : String(repetitionSetting);
        }
    }

    if (storedSettings) {
        mode = storedSettings.mode;
        wpm = storedSettings.wpm;
        repetitionSetting = storedSettings.repetitionSetting;
        Object.assign(fontSizes, storedSettings.fontSizes);
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function graphemes(text) {
        if (window.Intl?.Segmenter) {
            return Array.from(new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text))
                .map(segment => segment.segment);
        }
        const result = [];
        for (const character of Array.from(String(text))) {
            if (result.length && /^\p{M}/u.test(character)) {
                result[result.length - 1] += character;
            } else {
                result.push(character);
            }
        }
        return result;
    }

    function toneClass(word) {
        if (elements.toneColors?.checked === false) {
            return "thai-tone-rsvp-neutral";
        }
        const marks = new Set();
        for (const character of [...String(word?.transliteration || "").normalize("NFD")]) {
            if (character === "\u0300") marks.add("low");
            if (character === "\u0301") marks.add("high");
            if (character === "\u0302") marks.add("falling");
            if (character === "\u030c") marks.add("rising");
        }
        return marks.size === 1 ? `thai-tone-${Array.from(marks)[0]}` : "thai-tone-mid";
    }

    function getWordTranslation(item) {
        if (!item) {
            return "";
        }
        return item.token?.contextMeaning ||
            (Array.isArray(item.word?.meanings) ? item.word.meanings[0] : "") ||
            "";
    }

    function makeUnits(sentence) {
        const words = (sentence.tokens || [])
            .filter(token => token.kind === "word")
            .map(token => ({ token, word: indexes.wordsById.get(token.wordId) || {} }));
        if (mode === "chunk") {
            return [{
                sentence,
                words,
                text: sentence.thai,
                wordCount: words.length,
                wholeSentence: true
            }];
        }

        const result = [];
        for (let index = 0; index < words.length; index += 1) {
            const group = words.slice(index, index + 1);
            const endToken = sentence.tokens
                .slice(sentence.tokens.indexOf(group[group.length - 1].token) + 1)
                .find(token => token.kind === "punctuation");
            if (endToken) {
                group[group.length - 1] = {
                    ...group[group.length - 1],
                    token: { ...group[group.length - 1].token, text: group[group.length - 1].token.text + endToken.text }
                };
            }
            result.push({
                sentence,
                words: group,
                text: group.map(item => item.token.text).join(""),
                wordCount: group.length
            });
        }
        return result;
    }

    function rebuildUnits() {
        units = [];
        sentences.forEach((sentence, sentenceIndex) => {
            units.push(...makeUnits(sentence));
            if (mode === "word" && sentenceIndex < sentences.length - 1) {
                units.push({
                    sentence,
                    words: [],
                    text: "",
                    wordCount: 0,
                    sentenceGap: true
                });
            }
        });
        unitIndex = Math.min(unitIndex, Math.max(0, units.length - 1));
        render();
    }

    function currentUnit() {
        return units[unitIndex] || null;
    }

    function renderUnit(unit) {
        if (!unit || unit.sentenceGap) return "";
        const allGraphemes = graphemes(unit.text);
        const orpIndex = Math.floor(Math.max(0, allGraphemes.length - 1) / 2);
        let offset = 0;
        const renderToken = (item, includeSpacing = false) => {
            const parts = graphemes(item.token.text);
            const markup = parts.map(part => {
                const isOrp = offset === orpIndex;
                offset += 1;
                return `<span class="${isOrp ? "thai-giga-rsvp-orp " : ""}${toneClass(item.word)}">${escapeHtml(part)}</span>`;
            }).join("");
            return `<span class="thai-giga-rsvp-word">${markup}</span>${includeSpacing ? " " : ""}`;
        };

        if (unit.wholeSentence) {
            return (unit.sentence.tokens || []).map(token => {
                if (token.kind === "word") {
                    const item = unit.words.find(candidate => candidate.token === token) || {
                        token,
                        word: indexes.wordsById.get(token.wordId) || {}
                    };
                    return renderToken(item);
                }
                const markup = graphemes(token.text).map(part => {
                    const isOrp = offset === orpIndex;
                    offset += 1;
                    return `<span class="${isOrp ? "thai-giga-rsvp-orp " : ""}thai-giga-rsvp-neutral">${escapeHtml(part)}</span>`;
                }).join("");
                return markup;
            }).join("");
        }

        return unit.words.map(item => renderToken(item, true)).join("");
    }

    function syncDisplaySettings(fromBody = false) {
        if (fromBody) {
            const storedDisplay = storedSettings?.display || {};
            const thaiVisible = typeof storedDisplay.thai === "boolean"
                ? storedDisplay.thai
                : true;
            const transliterationVisible = typeof storedDisplay.transliteration === "boolean"
                ? storedDisplay.transliteration
                : document.body.dataset.thaiTransliterationVisible !== "false";
            const storedTranslationVisible = typeof storedDisplay.translation === "boolean"
                ? storedDisplay.translation
                : storedDisplay.wordTranslation;
            const translationVisible = typeof storedTranslationVisible === "boolean"
                ? storedTranslationVisible
                : document.body.dataset.thaiTranslationVisible !== "false";
            if (elements.thai) elements.thai.checked = thaiVisible;
            if (elements.transliteration) elements.transliteration.checked = transliterationVisible;
            if (elements.translation) elements.translation.checked = translationVisible;
            if (elements.wordSeparation) {
                elements.wordSeparation.checked = typeof storedDisplay.wordSeparation === "boolean"
                    ? storedDisplay.wordSeparation
                    : document.body.dataset.thaiWordSeparation !== "false";
            }
            if (elements.toneColors) {
                elements.toneColors.checked = typeof storedDisplay.toneColors === "boolean"
                    ? storedDisplay.toneColors
                    : document.body.dataset.thaiToneColors !== "false";
            }
        }
        if (elements.overlay) {
            elements.overlay.dataset.speedreadingTransliteration = String(
                elements.transliteration?.checked !== false
            );
            elements.overlay.dataset.speedreadingThai = String(elements.thai?.checked !== false);
            elements.overlay.dataset.speedreadingTranslation = String(
                elements.translation?.checked !== false
            );
            elements.overlay.dataset.speedreadingWordTranslation = String(
                elements.translation?.checked !== false
            );
            elements.overlay.dataset.speedreadingWordSeparation = String(
                elements.wordSeparation?.checked !== false
            );
            elements.overlay.dataset.speedreadingToneColors = String(
                elements.toneColors?.checked !== false
            );
        }
    }

    function syncFontSizeSettings() {
        const settings = [
            ["thai", elements.thaiFontSize, elements.thaiFontSizeValue, "--thai-giga-rsvp-thai-size"],
            [
                "transliteration",
                elements.transliterationFontSize,
                elements.transliterationFontSizeValue,
                "--thai-giga-rsvp-transliteration-size"
            ],
            ["german", elements.germanFontSize, elements.germanFontSizeValue, "--thai-giga-rsvp-german-size"]
        ];
        settings.forEach(([key, input, output, cssProperty]) => {
            if (input) input.value = String(fontSizes[key]);
            if (output) output.textContent = `${fontSizes[key]} px`;
            if (elements.overlay) elements.overlay.style.setProperty(cssProperty, `${fontSizes[key]}px`);
        });
        syncRepetitionSettings();
        syncModeSettings();
    }

    function setFontSize(key, value) {
        if (!(key in fontSizes)) return;
        fontSizes[key] = normalizeFontSize(key, value);
        syncFontSizeSettings();
        saveSettings();
    }

    function formatMetrics() {
        const elapsed = startedAt ? Math.max(0, (Date.now() - startedAt) / 1000) : 0;
        const effectiveWpm = elapsed > 0 ? Math.round(completedWords / (elapsed / 60)) : 0;
        return `${completedSentences} Sätze · ${completedUnits} Einheiten · ${completedWords} Wörter · ${effectiveWpm} WPM · ${Math.round(elapsed)} s · ${completedRepetitions} Wdh.`;
    }

    function formatProgress() {
        const currentSentence = currentUnit()?.sentence;
        const sentenceIndex = currentSentence
            ? sentences.findIndex(sentence => sentence.id === currentSentence.id)
            : -1;
        return `${sentenceIndex >= 0 ? sentenceIndex + 1 : 0}/${sentences.length}`;
    }

    function render() {
        const unit = currentUnit();
        syncDisplaySettings();
        syncFontSizeSettings();
        if (!elements.list) return;
        if (elements.overlay) {
            elements.overlay.dataset.speedreadingMode = mode;
        }
        elements.list.dataset.wordSeparation = elements.wordSeparation?.checked !== false;
        elements.list.dataset.toneColors = elements.toneColors?.checked !== false;
        elements.list.dataset.thaiVisible = elements.thai?.checked !== false;
        const wordTranslation = mode === "word"
            ? getWordTranslation(unit?.words?.[0])
            : "";
        const transliteration = mode === "word"
            ? unit?.words?.[0]?.word?.transliteration || ""
            : unit?.sentence?.transliteration || "";
        elements.list.innerHTML = unit
            ? unit.sentenceGap
            ? `<div class="thai-giga-rsvp-stage thai-giga-rsvp-stage-gap" aria-label="Satztrennung"></div>`
            : `<div class="thai-giga-rsvp-stage" data-word-separation="${elements.wordSeparation?.checked !== false}">
                <div class="thai-giga-rsvp-unit" lang="th">${renderUnit(unit)}</div>
                <p class="thai-giga-rsvp-word-translation">${escapeHtml(wordTranslation)}</p>
                <p class="thai-giga-rsvp-transliteration">${escapeHtml(transliteration)}</p>
                <p class="thai-giga-rsvp-translation">${escapeHtml(unit.sentence.translation)}</p>
            </div>`
            : `<div class="thai-giga-rsvp-empty">Keine Sätze für RSVP ausgewählt.</div>`;
        if (elements.wpm) elements.wpm.textContent = `${wpm} WPM`;
        if (elements.progress) elements.progress.textContent = formatProgress();
        if (elements.wpmSlider) {
            elements.wpmSlider.max = String(getMaxWpm());
            elements.wpmSlider.value = String(wpm);
        }
        document.querySelectorAll("[data-thai-giga-rsvp-action='play']").forEach(button => {
            button.textContent = playing ? "⏸" : "▶";
            button.setAttribute("aria-label", playing ? "Pausieren" : "Abspielen");
        });
    }

    function pause() {
        playing = false;
        if (timer) window.clearTimeout(timer);
        timer = null;
        render();
    }

    function completeUnit() {
        const unit = currentUnit();
        if (!unit) return;
        if (!unit.sentenceGap) {
            completedUnits += 1;
            completedWords += unit.wordCount;
        }
        if (unitIndex === units.length - 1) {
            completedSentences += new Set(sentences.map(sentence => sentence.id)).size;
            completedRepetitions += 1;
            if (repetitionSetting !== Infinity && repetition >= repetitionSetting) {
                sessionComplete = true;
                pause();
                render();
                return;
            }
            repetition += 1;
            unitIndex = 0;
        } else {
            unitIndex += 1;
        }
        render();
        if (playing) schedule();
    }

    function schedule() {
        const unit = currentUnit();
        if (!unit || !playing) return;
        const delay = unit.sentenceGap
            ? SENTENCE_GAP_MS
            : Math.max(30, unit.wordCount * 60000 / wpm);
        timer = window.setTimeout(completeUnit, delay);
    }

    function togglePlayback() {
        if (!units.length) return;
        if (playing) {
            pause();
            return;
        }
        if (sessionComplete) {
            unitIndex = 0;
            repetition = 1;
            completedUnits = 0;
            completedWords = 0;
            completedSentences = 0;
            completedRepetitions = 0;
            startedAt = 0;
            sessionComplete = false;
        }
        if (!startedAt) startedAt = Date.now();
        playing = true;
        render();
        schedule();
    }

    function move(delta) {
        if (!units.length) return;
        pause();
        unitIndex = Math.min(Math.max(0, unitIndex + delta), units.length - 1);
        render();
    }

    function setMode(nextMode) {
        if (nextMode !== "word" && nextMode !== "chunk") return;
        mode = nextMode;
        wpm = normalizeWpm(wpm);
        syncModeSettings();
        rebuildUnits();
        saveSettings();
    }

    function setWpm(value) {
        wpm = normalizeWpm(value);
        render();
        saveSettings();
    }

    function open(nextSentences, title, context, trigger) {
        sentences = Array.from(new Map(
            (Array.isArray(nextSentences) ? nextSentences : []).map(sentence => [sentence.id, sentence])
        ).values());
        if (!sentences.length || !elements.overlay) return false;
        pause();
        returnFocus = trigger || document.activeElement;
        unitIndex = 0;
        repetition = 1;
        completedUnits = 0;
        completedWords = 0;
        completedSentences = 0;
        completedRepetitions = 0;
        sessionComplete = false;
        startedAt = 0;
        elements.overlay.hidden = false;
        document.body.classList.add("thai-giga-speedreading-open");
        syncDisplaySettings(true);
        syncFontSizeSettings();
        syncRepetitionSettings();
        syncModeSettings();
        rebuildUnits();
        elements.close?.focus();
        return true;
    }

    function openSentence(sentenceId, trigger) {
        const sentence = indexes?.sentencesById.get(sentenceId);
        return sentence ? open([sentence], "RSVP · Satz", sentence.translation, trigger) : false;
    }

    function openPlaylist(trigger) {
        const entries = window.thaiGigaAudio?.getState()?.playlist || [];
        const playlistSentences = entries
            .map(entry => indexes?.sentencesById.get(entry.id))
            .filter(Boolean);
        return open(playlistSentences, "RSVP · Audio-Playlist", `${playlistSentences.length} Sätze`, trigger);
    }

    function close() {
        pause();
        sentences = [];
        units = [];
        startedAt = 0;
        if (elements.overlay) {
            elements.overlay.hidden = true;
        }
        document.body.classList.remove("thai-giga-speedreading-open");
        if (returnFocus && typeof returnFocus.focus === "function") {
            returnFocus.focus();
        }
        returnFocus = null;
    }

    function initialize(nextIndexes) {
        indexes = nextIndexes;
        syncDisplaySettings(true);
        syncFontSizeSettings();
    }

    document.addEventListener("click", event => {
        const modeButton = event.target.closest("[data-thai-giga-rsvp-mode]");
        const wpmButton = event.target.closest("[data-thai-giga-rsvp-wpm]");
        const actionButton = event.target.closest("[data-thai-giga-rsvp-action]");
        if (modeButton) setMode(modeButton.dataset.thaiGigaRsvpMode);
        if (wpmButton) setWpm(wpm + Number(wpmButton.dataset.thaiGigaRsvpWpm));
        if (actionButton) {
            if (actionButton.dataset.thaiGigaRsvpAction === "play") togglePlayback();
            if (actionButton.dataset.thaiGigaRsvpAction === "previous") move(-1);
            if (actionButton.dataset.thaiGigaRsvpAction === "next") move(1);
        }
    });
    elements.repetitions?.addEventListener("change", event => {
        repetitionSetting = normalizeRepetitionSetting(event.target.value);
        saveSettings();
    });
    elements.wpmSlider?.addEventListener("input", event => setWpm(event.target.value));
    elements.thaiFontSize?.addEventListener("input", event => setFontSize("thai", event.target.value));
    elements.transliterationFontSize?.addEventListener(
        "input",
        event => setFontSize("transliteration", event.target.value)
    );
    elements.germanFontSize?.addEventListener("input", event => setFontSize("german", event.target.value));
    elements.transliteration?.addEventListener("change", () => {
        syncDisplaySettings();
        saveSettings();
    });
    elements.thai?.addEventListener("change", () => {
        syncDisplaySettings();
        render();
        saveSettings();
    });
    elements.translation?.addEventListener("change", () => {
        syncDisplaySettings();
        saveSettings();
    });
    elements.wordSeparation?.addEventListener("change", () => {
        render();
        saveSettings();
    });
    elements.toneColors?.addEventListener("change", () => {
        render();
        saveSettings();
    });
    document.addEventListener("change", event => {
        if (
            event.target.id === "thaiGigaTransliterationToggle" ||
            event.target.id === "thaiGigaTranslationToggle"
        ) {
            syncDisplaySettings(true);
        } else if (
            event.target.id === "thaiGigaWordSeparationToggle" ||
            event.target.id === "thaiGigaToneColorsToggle"
        ) {
            syncDisplaySettings(true);
            render();
        }
    });

    window.thaiGigaRsvp = {
        initialize,
        open,
        openSentence,
        openPlaylist,
        close,
        getState: () => ({ mode, wpm, repetitionSetting, playing, metrics: formatMetrics() })
    };
})();
