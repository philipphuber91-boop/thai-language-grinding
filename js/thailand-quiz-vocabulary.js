(function (root) {
    "use strict";

    const TONE_MARKS = new Map([
        ["\u0300", "low"],
        ["\u0301", "high"],
        ["\u0302", "falling"],
        ["\u030c", "rising"]
    ]);

    function normalizeWord(word, source) {
        if (!word || typeof word.thai !== "string" || !word.thai) {
            return null;
        }
        return {
            ...word,
            meanings: Array.isArray(word.meanings)
                ? word.meanings.filter(meaning => typeof meaning === "string" && meaning)
                : word.meaning
                    ? [word.meaning]
                    : [],
            syllables: Array.isArray(word.syllables) ? word.syllables : [],
            source
        };
    }

    function getToneClass(transliteration) {
        const tones = [...String(transliteration || "").normalize("NFD")]
            .map(character => TONE_MARKS.get(character))
            .filter(Boolean);
        const uniqueTones = [...new Set(tones)];
        if (uniqueTones.length === 0) {
            return "thai-tone-mid";
        }
        return uniqueTones.length === 1
            ? `thai-tone-${uniqueTones[0]}`
            : "thai-tone-mixed";
    }

    function createVocabulary({ gigaWords = [], quizWords = [], customWords = [] } = {}) {
        const wordsByThai = new Map();
        for (const sourceWord of gigaWords) {
            const word = normalizeWord(sourceWord, "giga");
            if (word && !wordsByThai.has(word.thai)) {
                wordsByThai.set(word.thai, word);
            }
        }
        for (const sourceWord of quizWords) {
            const word = normalizeWord(sourceWord, "quiz");
            if (!word) {
                continue;
            }
            const existing = wordsByThai.get(word.thai);
            wordsByThai.set(word.thai, existing
                ? {
                    ...word,
                    ...existing,
                    meanings: [...new Set([...existing.meanings, ...word.meanings])],
                    syllables: word.syllables.length > 0
                        ? word.syllables
                        : existing.syllables
                }
                : word);
        }
        for (const sourceWord of customWords) {
            const word = normalizeWord(sourceWord, "custom");
            if (word) {
                wordsByThai.set(word.thai, word);
            }
        }

        const wordsByLength = [...wordsByThai.values()]
            .sort((left, right) => right.thai.length - left.thai.length);
        const segmenter = typeof Intl.Segmenter === "function"
            ? new Intl.Segmenter("th", { granularity: "word" })
            : null;

        function findWordAt(text, index, segmentEnds) {
            return wordsByLength.find(word =>
                text.startsWith(word.thai, index) &&
                segmentEnds.has(index + word.thai.length)
            ) || null;
        }

        function segment(text) {
            const value = String(text || "");
            const nativeSegments = segmenter
                ? [...segmenter.segment(value)]
                : [{ segment: value, index: 0, isWordLike: true }];
            const segmentEnds = new Set(
                nativeSegments.map(item => item.index + item.segment.length)
            );
            const output = [];
            let segmentIndex = 0;

            while (segmentIndex < nativeSegments.length) {
                const native = nativeSegments[segmentIndex];
                const match = findWordAt(value, native.index, segmentEnds);
                if (!/\p{Script=Thai}/u.test(native.segment)) {
                    output.push({ text: native.segment, entry: null });
                    segmentIndex++;
                    continue;
                }
                if (!match) {
                    output.push({ text: native.segment, entry: null });
                    segmentIndex++;
                    continue;
                }

                output.push({ text: match.thai, entry: match });
                const matchEnd = native.index + match.thai.length;
                while (
                    segmentIndex < nativeSegments.length &&
                    nativeSegments[segmentIndex].index + nativeSegments[segmentIndex].segment.length <= matchEnd
                ) {
                    segmentIndex++;
                }
            }

            return output;
        }

        function appendWordMarkup(button, word) {
            const syllables = word?.syllables;
            const validSyllables = syllables?.length > 0 &&
                syllables.every(syllable =>
                    syllable &&
                    typeof syllable.thai === "string" &&
                    typeof syllable.transliteration === "string"
                ) &&
                syllables.map(syllable => syllable.thai).join("") === word.thai;
            if (validSyllables) {
                for (const syllable of syllables) {
                    const span = document.createElement("span");
                    span.className = `thq-syllable ${getToneClass(syllable.transliteration)}`;
                    span.textContent = syllable.thai;
                    button.append(span);
                }
                return;
            }
            const span = document.createElement("span");
            span.className = `thq-syllable ${getToneClass(word?.transliteration)}`;
            span.textContent = button.dataset.thai;
            button.append(span);
        }

        function render(container, text, onWordClick) {
            for (const part of segment(text)) {
                if (!part.text) {
                    continue;
                }
                if (!/\p{Script=Thai}/u.test(part.text)) {
                    container.append(document.createTextNode(part.text));
                    continue;
                }
                const word = document.createElement("span");
                word.className = "thq-word";
                word.lang = "th";
                word.dataset.thai = part.text;
                word.setAttribute("role", "button");
                word.tabIndex = 0;
                word.setAttribute("aria-label", `Wort nachschlagen: ${part.text}`);
                appendWordMarkup(word, part.entry || { thai: part.text });
                word.addEventListener("click", () => onWordClick(part.entry, part.text));
                word.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onWordClick(part.entry, part.text);
                    }
                });
                container.append(word);
            }
        }

        return {
            wordsByThai,
            segment,
            render,
            find: thai => wordsByThai.get(thai) || null
        };
    }

    const api = { createVocabulary, getToneClass };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.THAILAND_QUIZ_VOCABULARY = api;
    }
})(typeof window !== "undefined" ? window : null);
