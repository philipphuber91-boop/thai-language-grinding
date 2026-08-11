const MAX_SEGMENTS = 80;
const MAX_TRANSCRIPT_CHARACTERS = 12000;
const THAI_DIGIT_REPLACEMENTS = {
    "0": "๐",
    "1": "๑",
    "2": "๒",
    "3": "๓",
    "4": "๔",
    "5": "๕",
    "6": "๖",
    "7": "๗",
    "8": "๘",
    "9": "๙"
};
const THAI_KEYBOARD_CHARACTERS = new Set(
    Array.from("ฃ๊ๅ/๑-๒ภ๓ถ๔ุูึค๕ต๖จ๗ข๘ช๙ๆ๐ไำฎพฑะธัํีรณนฯยญบฐลฅฟฤหฆกฏดโเฌ้็่๋าษสศวซงผปแฉอฮิื์ทมฒใฬฝฦ ")
);

function setCorsHeaders(response) {
    const origin = process.env.YOUTUBE_LESSON_ALLOWED_ORIGIN || "*";
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function createApiError(status, code, message) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
}

function getYoutubeVideoId(value) {
    let url;

    try {
        url = new URL(String(value || "").trim());
    } catch {
        throw createApiError(400, "INVALID_URL", "Bitte gib eine gültige YouTube-URL ein.");
    }

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "youtu.be") {
        return url.pathname.slice(1).split("/")[0] || null;
    }

    if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
        throw createApiError(400, "INVALID_URL", "Die URL muss zu YouTube gehören.");
    }

    if (url.pathname === "/watch") {
        return url.searchParams.get("v");
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (["shorts", "embed", "live"].includes(pathParts[0])) {
        return pathParts[1] || null;
    }

    return null;
}

function decodeXml(value) {
    return String(value || "")
        .replace(/&#39;|&#x27;/gi, "'")
        .replace(/&quot;|&#x22;/gi, '"')
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeThaiText(value) {
    const normalized = String(value || "")
        .normalize("NFC")
        .replace(/[0-9]/g, digit => THAI_DIGIT_REPLACEMENTS[digit]);

    return Array.from(normalized)
        .filter(character => THAI_KEYBOARD_CHARACTERS.has(character))
        .join("")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeTranscriptSegments(segments) {
    return segments
        .map(segment => ({
            ...segment,
            thai: normalizeThaiText(segment?.thai)
        }))
        .filter(segment => segment.thai);
}

function parseCaptionAttributes(value) {
    const attributes = {};
    const attributePattern = /([\w-]+)="([^"]*)"/g;
    let match;

    while ((match = attributePattern.exec(value)) !== null) {
        attributes[match[1]] = match[2];
    }

    return attributes;
}

function parseTranscriptXml(xml) {
    const segments = [];
    const captionPattern = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
    let match;

    while ((match = captionPattern.exec(String(xml || ""))) !== null) {
        const attributes = parseCaptionAttributes(match[1]);
        const thai = normalizeThaiText(decodeXml(match[2]));

        if (!thai) {
            continue;
        }

        segments.push({
            thai,
            start: Number(attributes.start) || 0,
            duration: Number(attributes.dur) || 0
        });
    }

    return segments;
}

async function fetchTranscript(videoId) {
    const transcriptUrls = [
        `https://www.youtube.com/api/timedtext?fmt=srv3&lang=th&v=${encodeURIComponent(videoId)}`,
        `https://www.youtube.com/api/timedtext?fmt=srv3&kind=asr&lang=th&v=${encodeURIComponent(videoId)}`
    ];

    for (let index = 0; index < transcriptUrls.length; index++) {
        const response = await fetch(transcriptUrls[index], {
            headers: {
                Accept: "application/xml,text/xml"
            }
        });

        if (!response.ok) {
            continue;
        }

        const segments = parseTranscriptXml(await response.text());
        if (segments.length > 0) {
            return {
                segments,
                sourceType: index === 0 ? "manual" : "automatic"
            };
        }
    }

    throw createApiError(
        404,
        "NO_THAI_TRANSCRIPT",
        "Für dieses Video wurde kein verwendbarer Thai-Untertitel gefunden."
    );
}

function limitTranscript(segments) {
    const limitedSegments = [];
    let characterCount = 0;

    for (const segment of segments) {
        if (
            limitedSegments.length >= MAX_SEGMENTS ||
            characterCount + segment.thai.length > MAX_TRANSCRIPT_CHARACTERS
        ) {
            break;
        }

        limitedSegments.push(segment);
        characterCount += segment.thai.length;
    }

    if (limitedSegments.length === 0) {
        throw createApiError(
            422,
            "EMPTY_TRANSCRIPT",
            "Das gefundene Transkript enthält keinen nutzbaren Thai-Text."
        );
    }

    return {
        segments: limitedSegments,
        truncated: limitedSegments.length < segments.length
    };
}

function parseTranslationResponse(value, expectedLength) {
    const content = String(value || "")
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
    let parsed;

    try {
        parsed = JSON.parse(content);
    } catch {
        throw createApiError(
            502,
            "INVALID_TRANSLATION_RESPONSE",
            "Der Übersetzungsdienst hat kein gültiges Ergebnis geliefert."
        );
    }

    const translations = Array.isArray(parsed)
        ? parsed
        : parsed?.translations;

    if (
        !Array.isArray(translations) ||
        translations.length !== expectedLength ||
        translations.some(translation => typeof translation !== "string" || !translation.trim())
    ) {
        throw createApiError(
            502,
            "INVALID_TRANSLATION_RESPONSE",
            "Die Übersetzungen konnten nicht eindeutig den Thai-Zeilen zugeordnet werden."
        );
    }

    return translations.map(translation => translation.trim());
}

async function translateSegments(segments, shouldTranslate) {
    if (!shouldTranslate) {
        return {
            translations: segments.map(() => ""),
            translationPending: true
        };
    }

    const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
    if (!apiKey) {
        throw createApiError(
            503,
            "TRANSLATION_NOT_CONFIGURED",
            "Der serverseitige Übersetzungsdienst ist noch nicht konfiguriert."
        );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            temperature: 0,
            response_format: {
                type: "json_object"
            },
            messages: [
                {
                    role: "system",
                    content:
                        "Du übersetzt Thai aus gesprochenen Alltagssituationen ins natürliche Deutsche. " +
                        "Antworte ausschließlich als JSON-Objekt mit einem Array translations. " +
                        "Behalte die Reihenfolge und liefere exakt eine deutsche Übersetzung pro Eingabezeile. " +
                        "Erfinde keine Inhalte und lasse Eigennamen sinngemäß unverändert."
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        translations: segments.map(segment => segment.thai)
                    })
                }
            ]
        })
    });

    if (!response.ok) {
        throw createApiError(
            502,
            "TRANSLATION_PROVIDER_ERROR",
            "Der Übersetzungsdienst konnte die Lektion nicht erstellen."
        );
    }

    const payload = await response.json();
    return {
        translations: parseTranslationResponse(
            payload?.choices?.[0]?.message?.content,
            segments.length
        ),
        translationPending: false
    };
}

async function getVideoTitle(videoId) {
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    try {
        const response = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
        );

        if (!response.ok) {
            return `YouTube-Video ${videoId}`;
        }

        const payload = await response.json();
        return String(payload?.title || `YouTube-Video ${videoId}`).trim();
    } catch (error) {
        console.warn("Videotitel konnte nicht geladen werden.", error);
        return `YouTube-Video ${videoId}`;
    }
}

async function handler(request, response) {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }

    if (request.method !== "POST") {
        response
            .status(405)
            .json({
                error: {
                    code: "METHOD_NOT_ALLOWED",
                    message: "Nur POST-Anfragen werden unterstützt."
                }
            });
        return;
    }

    try {
        let body = request.body;
        if (typeof body === "string") {
            try {
                body = JSON.parse(body);
            } catch (error) {
                throw createApiError(
                    400,
                    "INVALID_REQUEST",
                    "Die Anfrage enthält kein gültiges JSON."
                );
            }
        }

        if (body?.translate === true && Array.isArray(body?.segments)) {
            const segments = normalizeTranscriptSegments(body.segments);
            const limitedTranscript = limitTranscript(segments);
            const translationResult = await translateSegments(
                limitedTranscript.segments,
                true
            );

            response.status(200).json({
                translationPending: false,
                segments: limitedTranscript.segments.map((segment, index) => ({
                    thai: segment.thai,
                    deutsch: translationResult.translations[index],
                    start: Number(segment.start) || 0,
                    duration: Number(segment.duration) || 0
                }))
            });
            return;
        }

        const videoId = getYoutubeVideoId(body?.url);
        if (!videoId || !/^[\w-]{6,20}$/.test(videoId)) {
            throw createApiError(
                400,
                "INVALID_VIDEO_ID",
                "Die YouTube-URL enthält keine gültige Video-ID."
            );
        }

        const transcript = await fetchTranscript(videoId);
        const limitedTranscript = limitTranscript(transcript.segments);
        const translationResult = await translateSegments(
            limitedTranscript.segments,
            body?.translate === true
        );
        const title = await getVideoTitle(videoId);

        response.status(200).json({
            videoId,
            sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
            title,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            sourceType: transcript.sourceType,
            truncated: limitedTranscript.truncated,
            translationPending: translationResult.translationPending,
            segments: limitedTranscript.segments.map((segment, index) => ({
                thai: segment.thai,
                deutsch: translationResult.translations[index],
                start: segment.start,
                duration: segment.duration
            }))
        });
    } catch (error) {
        const status = Number.isInteger(error?.status) ? error.status : 500;
        const code = error?.code || "LESSON_GENERATION_FAILED";
        const message =
            status === 500
                ? "Die Video-Lektion konnte nicht erstellt werden."
                : error.message;

        console.error("YouTube-Lektion fehlgeschlagen:", error);
        response.status(status).json({
            error: {
                code,
                message
            }
        });
    }
}

module.exports = handler;
