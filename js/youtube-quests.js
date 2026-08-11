const YOUTUBE_QUESTS_STORAGE_KEY = "youtubeQuests";

function readYoutubeQuests() {
    const stored = localStorage.getItem(YOUTUBE_QUESTS_STORAGE_KEY);

    if (!stored) {
        return {};
    }

    try {
        const parsed = JSON.parse(stored);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed
            : {};
    } catch (error) {
        console.warn("Gespeicherte Videoquests konnten nicht gelesen werden.", error);
        return {};
    }
}

let youtubeQuests = readYoutubeQuests();

function saveYoutubeQuests() {
    localStorage.setItem(
        YOUTUBE_QUESTS_STORAGE_KEY,
        JSON.stringify(youtubeQuests)
    );
}

function getYoutubeQuests() {
    return youtubeQuests;
}

function getYoutubeQuestIds() {
    return Object.keys(youtubeQuests).sort((left, right) => {
        const leftDate = Date.parse(youtubeQuests[left]?.createdAt || "");
        const rightDate = Date.parse(youtubeQuests[right]?.createdAt || "");

        return (
            (Number.isFinite(rightDate) ? rightDate : 0) -
            (Number.isFinite(leftDate) ? leftDate : 0)
        );
    });
}

function getLessonVersion(lesson) {
    const input = [
        lesson.videoId,
        ...(lesson.thaiZeilen || []),
        ...(lesson.deutschZeilen || [])
    ].join("\u0000");
    let hash = 2166136261;

    for (let index = 0; index < input.length; index++) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return Math.abs(hash >>> 0) || 1;
}

function createYoutubeQuest(lesson) {
    const videoId = String(lesson?.videoId || "").trim();
    const thaiZeilen = Array.isArray(lesson?.thaiZeilen)
        ? lesson.thaiZeilen.map(line => String(line).trim()).filter(Boolean)
        : [];
    const rawDeutschZeilen = Array.isArray(lesson?.deutschZeilen)
        ? lesson.deutschZeilen.map(line => String(line).trim())
        : [];
    const deutschZeilen = thaiZeilen.map(
        (_, index) => rawDeutschZeilen[index] || ""
    );

    if (!videoId || thaiZeilen.length === 0) {
        throw new Error("Die Video-Lektion enthält keine gültigen Thai-Zeilen.");
    }

    const quest = {
        videoId,
        version: lesson.version || getLessonVersion({
            videoId,
            thaiZeilen,
            deutschZeilen
        }),
        titel: String(lesson.title || `YouTube-Video ${videoId}`).trim(),
        bild: "alltag",
        thumbnailUrl: String(lesson.thumbnailUrl || "").trim(),
        beschreibung: "Automatisch erstellte Video-Lektion",
        kapitel: "Video-Lektion",
        schwierigkeit: "Individuell",
        xp: 50,
        story: String(
            lesson.sourceType === "automatic"
                ? "Diese Lektion basiert auf automatisch erzeugten YouTube-Untertiteln. Prüfe unbekannte Wörter sorgfältig."
                : lesson.sourceType === "pasted"
                    ? "Diese Lektion basiert auf einem manuell eingefügten Thai-Transkript."
                : "Diese Lektion basiert auf dem Untertitel des verlinkten YouTube-Videos."
        ),
        deutschZeilen,
        thaiZeilen,
        sourceUrl: String(lesson.sourceUrl || "").trim(),
        sourceType: String(lesson.sourceType || "unknown"),
        createdAt: new Date().toISOString()
    };

    youtubeQuests[videoId] = quest;
    saveYoutubeQuests();

    return {
        id: videoId,
        quest
    };
}

function deleteYoutubeQuest(videoId) {
    const normalizedId = String(videoId || "").trim();

    if (!normalizedId || !youtubeQuests[normalizedId]) {
        return false;
    }

    delete youtubeQuests[normalizedId];
    saveYoutubeQuests();
    return true;
}

window.youtubeQuestStore = {
    createYoutubeQuest,
    deleteYoutubeQuest,
    getYoutubeQuestIds,
    getYoutubeQuests,
    saveYoutubeQuests
};
