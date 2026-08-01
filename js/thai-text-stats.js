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
