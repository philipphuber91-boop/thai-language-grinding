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

function getThaiWordStatistics(thaiZeilen) {

    const segmenter = getThaiWordSegmenter();

    if (!segmenter) {
        console.error(
            "Thai-Wortzählung benötigt Intl.Segmenter mit Wortsegmentierung."
        );

        return {
            total: 0,
            unique: 0,
            supported: false
        };
    }

    const uniqueWords = new Set();
    let total = 0;

    for (const zeile of Array.isArray(thaiZeilen) ? thaiZeilen : []) {

        for (const segment of segmenter.segment(String(zeile ?? ""))) {

            if (!segment.isWordLike) {
                continue;
            }

            const normalizedWord = segment.segment.normalize("NFC");

            total++;
            uniqueWords.add(normalizedWord);
        }
    }

    return {
        total,
        unique: uniqueWords.size,
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
