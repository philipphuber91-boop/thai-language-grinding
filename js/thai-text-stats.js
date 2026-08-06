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

function getThaiWordMasteryCount(wordStats, word) {

    if (wordStats instanceof Map) {
        return Math.max(0, Number(wordStats.get(word) ?? 0));
    }

    if (wordStats instanceof Set) {
        return wordStats.has(word) ? 1 : 0;
    }

    if (Array.isArray(wordStats)) {
        return wordStats.includes(word) ? 1 : 0;
    }

    if (!wordStats || typeof wordStats !== "object") {
        return 0;
    }

    return Math.max(0, Number(wordStats[word] ?? 0));
}

function getThaiWordMasteryLevel(count) {

    if (count >= 25) {
        return "mastered";
    }

    if (count >= 10) {
        return "learned";
    }

    if (count >= 5) {
        return "known";
    }

    if (count >= 1) {
        return "seen";
    }

    return "unseen";
}

function getPercentage(value, total) {

    return total > 0
        ? Math.round((value / total) * 100)
        : 0;
}

function getThaiWordFamiliarityStatistics(thaiZeilen, wordStats) {

    const wordList = getThaiWordList(thaiZeilen);

    if (!wordList.supported) {
        return {
            total: 0,
            unique: 0,
            known: 0,
            unknown: 0,
            unknownUnique: 0,
            knownPercentage: 0,
            masteryPercentage: 0,
            readingComprehensionPercentage: 0,
            vocabularyCoveragePercentage: 0,
            occurrences: {
                unseen: 0,
                seen: 0,
                known: 0,
                learned: 0,
                mastered: 0
            },
            uniqueWordTypes: {
                unseen: 0,
                seen: 0,
                known: 0,
                learned: 0,
                mastered: 0
            },
            percentages: {
                unseen: 0,
                seen: 0,
                known: 0,
                learned: 0,
                mastered: 0
            },
            supported: false
        };
    }

    const occurrences = {
        unseen: 0,
        seen: 0,
        known: 0,
        learned: 0,
        mastered: 0
    };
    const uniqueWordCounts = new Map();

    for (const word of wordList.words) {

        const count = getThaiWordMasteryCount(wordStats, word);
        const level = getThaiWordMasteryLevel(count);

        occurrences[level]++;
        uniqueWordCounts.set(word, count);

    }

    const uniqueWordTypes = {
        unseen: 0,
        seen: 0,
        known: 0,
        learned: 0,
        mastered: 0
    };

    for (const count of uniqueWordCounts.values()) {
        uniqueWordTypes[getThaiWordMasteryLevel(count)]++;
    }

    const total = wordList.words.length;
    const unique = uniqueWordCounts.size;
    const known =
        occurrences.known +
        occurrences.learned +
        occurrences.mastered;
    const unknown = occurrences.unseen + occurrences.seen;
    const unknownUnique =
        uniqueWordTypes.unseen + uniqueWordTypes.seen;
    const masteryCount =
        occurrences.learned + occurrences.mastered;

    return {
        total,
        unique,
        known,
        unknown,
        unknownUnique,
        knownPercentage: getPercentage(known, total),
        masteryPercentage: getPercentage(masteryCount, total),
        readingComprehensionPercentage: getPercentage(known, total),
        vocabularyCoveragePercentage: getPercentage(
            uniqueWordTypes.learned + uniqueWordTypes.mastered,
            unique
        ),
        occurrences,
        uniqueWordTypes,
        percentages: {
            unseen: getPercentage(uniqueWordTypes.unseen, unique),
            seen: getPercentage(uniqueWordTypes.seen, unique),
            known: getPercentage(uniqueWordTypes.known, unique),
            learned: getPercentage(uniqueWordTypes.learned, unique),
            mastered: getPercentage(uniqueWordTypes.mastered, unique)
        },
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

    if (statistics.masteryPercentage >= 90) {
        return {
            key: "too-easy",
            emoji: "🟢",
            label: "Leicht",
            range: "90–100 %"
        };
    }

    if (statistics.masteryPercentage >= 70) {
        return {
            key: "perfect-flow",
            emoji: "🟡",
            label: "Perfekter Flow",
            range: "70–89 %"
        };
    }

    if (statistics.masteryPercentage >= 50) {
        return {
            key: "challenging",
            emoji: "🟠",
            label: "Anspruchsvoll",
            range: "50–69 %"
        };
    }

    return {
        key: "too-difficult",
        emoji: "🔴",
        label: "Schwer",
        range: "0–49 %"
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

function getThaiAverageWordLength(thaiZeilen) {

    const wordList = getThaiWordList(thaiZeilen);

    if (!wordList.supported || wordList.words.length === 0) {
        return 0;
    }

    const totalCharacters = wordList.words.reduce(
        (total, word) => total + Array.from(word).length,
        0
    );

    return totalCharacters / wordList.words.length;
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
