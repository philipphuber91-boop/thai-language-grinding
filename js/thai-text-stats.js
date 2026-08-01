let thaiWordSegmenter = null;

function getThaiWordSegmenter() {

    if (
        typeof Intl === "undefined" ||
        typeof Intl.Segmenter !== "function"
    ) {
        return null;
    }

    if (!thaiWordSegmenter) {
        thaiWordSegmenter =
            new Intl.Segmenter("th", { granularity: "word" });
    }

    return thaiWordSegmenter;
}

function getThaiWordList(thaiZeilen) {

    const segmenter = getThaiWordSegmenter();

    if (!segmenter) {
        console.error(
            "Thai-Wortzählung benötigt Intl.Segmenter mit Wortsegmentierung."
        );

        return {
            words: [],
            supported: false
        };
    }

    const words = [];

    for (const zeile of Array.isArray(thaiZeilen) ? thaiZeilen : []) {

        for (const segment of segmenter.segment(String(zeile ?? ""))) {

            if (!segment.isWordLike) {
                continue;
            }

            const normalizedWord = segment.segment.normalize("NFC");

            words.push(normalizedWord);
        }
    }

    return {
        words,
        supported: true
    };
}

function getThaiWordStatistics(thaiZeilen) {

    const wordList = getThaiWordList(thaiZeilen);

    if (!wordList.supported) {
        return {
            total: 0,
            unique: 0,
            supported: false
        };
    }

    return {
        total: wordList.words.length,
        unique: new Set(wordList.words).size,
        supported: true
    };
}

function getThaiWordFamiliarityStatistics(thaiZeilen, knownWords) {

    const wordList = getThaiWordList(thaiZeilen);

    if (!wordList.supported) {
        return {
            total: 0,
            known: 0,
            unknown: 0,
            unknownUnique: 0,
            knownPercentage: 0,
            supported: false
        };
    }

    const knownWordSet =
        knownWords instanceof Set
            ? knownWords
            : new Set(Array.isArray(knownWords) ? knownWords : []);
    const unknownWords = wordList.words.filter(
        word => !knownWordSet.has(word)
    );
    const known = wordList.words.length - unknownWords.length;

    return {
        total: wordList.words.length,
        known,
        unknown: unknownWords.length,
        unknownUnique: new Set(unknownWords).size,
        knownPercentage:
            wordList.words.length > 0
                ? Math.round((known / wordList.words.length) * 100)
                : 0,
        supported: true
    };
}

function formatThaiWordFamiliarityStatistics(statistics) {

    if (!statistics.supported) {
        return "Bekanntheitsgrad nicht verfügbar";
    }

    return (
        statistics.knownPercentage +
        "% bekannt · " +
        statistics.unknownUnique +
        " unbekannt"
    );
}

function getThaiWordFamiliarityCategory(statistics) {

    if (!statistics.supported) {
        return {
            key: "unavailable",
            emoji: "⚪",
            label: "Nicht verfügbar",
            range: "Keine Berechnung"
        };
    }

    if (statistics.knownPercentage >= 90) {
        return {
            key: "too-easy",
            emoji: "🟢",
            label: "Leicht",
            range: "90–100 %"
        };
    }

    if (statistics.knownPercentage >= 80) {
        return {
            key: "perfect-flow",
            emoji: "🟡",
            label: "Perfekter Flow",
            range: "80–89 %"
        };
    }

    if (statistics.knownPercentage >= 65) {
        return {
            key: "challenging",
            emoji: "🟠",
            label: "Anspruchsvoll",
            range: "65–79 %"
        };
    }

    return {
        key: "too-difficult",
        emoji: "🔴",
        label: "Schwer",
        range: "0–64 %"
    };
}

function getThaiCharacterCount(thaiZeilen) {

    return (
        Array.isArray(thaiZeilen)
            ? thaiZeilen
            : []
    ).reduce(
        (total, zeile) => total + String(zeile ?? "").length,
        0
    );
}

function formatThaiWordStatistics(statistics) {

    if (!statistics.supported) {
        return "Wortzählung nicht verfügbar";
    }

    return (
        statistics.total +
        " Wörter · " +
        statistics.unique +
        " einzigartig"
    );
}
