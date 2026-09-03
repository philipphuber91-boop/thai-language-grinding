const crypto = require("node:crypto");
const {
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} = require("@aws-sdk/client-s3");

const INWORLD_TTS_URL = "https://api.inworld.ai/tts/v1/voice";
const DEFAULT_MODEL_ID = process.env.INWORLD_DEFAULT_MODEL_ID || "inworld-tts-2";
const DEFAULT_VOICE_ID = process.env.INWORLD_DEFAULT_VOICE_ID || "";
const DEFAULT_DELIVERY_MODE = process.env.INWORLD_DELIVERY_MODE || "STABLE";
const DEFAULT_SPEAKING_RATE = Number(process.env.INWORLD_SPEAKING_RATE || 1);
const MAX_TEXT_LENGTH = 4000;
const MAX_CACHE_ENTRIES = 128;
const AUDIO_CACHE_PREFIX = process.env.AUDIO_CACHE_PREFIX || "tts/v1";
const audioCache = new Map();
const pendingGenerations = new Map();

const objectStorage = process.env.AUDIO_STORAGE_BUCKET &&
    process.env.AUDIO_STORAGE_ACCESS_KEY_ID &&
    process.env.AUDIO_STORAGE_SECRET_ACCESS_KEY
    ? {
        bucket: process.env.AUDIO_STORAGE_BUCKET,
        prefix: AUDIO_CACHE_PREFIX,
        client: new S3Client({
            region: process.env.AUDIO_STORAGE_REGION || "auto",
            endpoint: process.env.AUDIO_STORAGE_ENDPOINT || undefined,
            forcePathStyle: process.env.AUDIO_STORAGE_FORCE_PATH_STYLE === "true",
            credentials: {
                accessKeyId: process.env.AUDIO_STORAGE_ACCESS_KEY_ID,
                secretAccessKey: process.env.AUDIO_STORAGE_SECRET_ACCESS_KEY
            }
        })
    }
    : null;

function sendJson(response, status, body) {
    if (typeof response.status === "function") {
        response.status(status);
    } else {
        response.statusCode = status;
    }
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(body));
}

function getAllowedOrigins() {
    return String(process.env.TTS_ALLOWED_ORIGINS || "")
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean);
}

function applyCors(request, response) {
    const origin = request.headers.origin;
    const allowedOrigins = getAllowedOrigins();

    if (!origin) {
        return true;
    }

    const forwardedProtocol = String(request.headers["x-forwarded-proto"] || "https")
        .split(",")[0]
        .trim();
    const sameOrigin = request.headers.host
        ? `${forwardedProtocol}://${request.headers.host}` === origin
        : false;
    if (!sameOrigin && !allowedOrigins.includes(origin)) {
        return false;
    }

    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return true;
}

function parseBody(body) {
    if (body && typeof body === "object") {
        return body;
    }

    if (typeof body === "string" && body.trim()) {
        try {
            const parsed = JSON.parse(body);
            return parsed && typeof parsed === "object" ? parsed : null;
        } catch {
            return null;
        }
    }

    return null;
}

function getRequestOptions(body) {
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const language = typeof body.language === "string" && body.language.trim()
        ? body.language.trim()
        : "th-TH";
    const voiceId = typeof body.voiceId === "string" && body.voiceId.trim()
        ? body.voiceId.trim()
        : DEFAULT_VOICE_ID;
    const modelId = typeof body.modelId === "string" && body.modelId.trim()
        ? body.modelId.trim()
        : DEFAULT_MODEL_ID;
    const deliveryMode = typeof body.deliveryMode === "string" && body.deliveryMode.trim()
        ? body.deliveryMode.trim()
        : DEFAULT_DELIVERY_MODE;
    const speakingRate = Number.isFinite(Number(body.speakingRate))
        ? Number(body.speakingRate)
        : DEFAULT_SPEAKING_RATE;

    if (!text || text.length > MAX_TEXT_LENGTH) {
        return { error: `text muss zwischen 1 und ${MAX_TEXT_LENGTH} Zeichen enthalten.` };
    }
    if (!voiceId || voiceId.length > 200) {
        return { error: "Eine gültige voiceId ist erforderlich." };
    }
    if (language.length > 35 || modelId.length > 100 || deliveryMode.length > 20) {
        return { error: "language, modelId oder deliveryMode ist zu lang." };
    }
    if (speakingRate < 0 || speakingRate > 2) {
        return { error: "speakingRate muss zwischen 0 und 2 liegen." };
    }

    return {
        value: {
            text,
            language,
            voiceId,
            modelId,
            audioEncoding: "MP3",
            speakingRate,
            deliveryMode
        }
    };
}

function getCacheKey(options) {
    return crypto
        .createHash("sha256")
        .update(JSON.stringify(options))
        .digest("hex");
}

function readCache(key) {
    const cached = audioCache.get(key);
    if (!cached) {
        return null;
    }

    audioCache.delete(key);
    audioCache.set(key, cached);
    return cached;
}

function writeCache(key, audio) {
    audioCache.delete(key);
    audioCache.set(key, audio);
    while (audioCache.size > MAX_CACHE_ENTRIES) {
        const oldestKey = audioCache.keys().next().value;
        audioCache.delete(oldestKey);
    }
}

function getObjectKey(key) {
    return `${objectStorage.prefix}/${key}.mp3`;
}

async function readObjectCache(key) {
    if (!objectStorage) {
        return null;
    }

    try {
        const response = await objectStorage.client.send(new GetObjectCommand({
            Bucket: objectStorage.bucket,
            Key: getObjectKey(key)
        }));
        if (!response.Body) {
            throw new Error("Der Object Storage hat keinen Audio-Body geliefert.");
        }
        const chunks = [];
        for await (const chunk of response.Body) {
            chunks.push(Buffer.from(chunk));
        }
        return {
            contentType: response.ContentType || "audio/mpeg",
            audio: Buffer.concat(chunks)
        };
    } catch (error) {
        const statusCode = error?.$metadata?.httpStatusCode;
        const errorName = error?.name;
        if (statusCode === 404 || errorName === "NoSuchKey" || errorName === "NotFound") {
            return null;
        }
        throw error;
    }
}

async function writeObjectCache(key, audio) {
    if (!objectStorage) {
        return;
    }

    await objectStorage.client.send(new PutObjectCommand({
        Bucket: objectStorage.bucket,
        Key: getObjectKey(key),
        Body: audio.audio,
        ContentType: audio.contentType,
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: { "tts-cache-key": key }
    }));
}

async function readAnyCache(key) {
    const memoryAudio = readCache(key);
    if (memoryAudio) {
        return { audio: memoryAudio, source: "MEMORY" };
    }

    const storedAudio = await readObjectCache(key);
    if (!storedAudio) {
        return null;
    }
    writeCache(key, storedAudio);
    return { audio: storedAudio, source: "OBJECT_STORAGE" };
}

async function getOrGenerate(options, key) {
    const cached = await readAnyCache(key);
    if (cached) {
        return { ...cached, cacheStatus: "HIT" };
    }

    const pending = pendingGenerations.get(key);
    if (pending) {
        const result = await pending;
        return { ...result, cacheStatus: "HIT" };
    }

    const generation = (async () => {
        const lateCached = await readAnyCache(key);
        if (lateCached) {
            return lateCached;
        }

        const generated = await synthesize(options);
        writeCache(key, generated);
        await writeObjectCache(key, generated);
        return { audio: generated, source: "INWORLD" };
    })();
    pendingGenerations.set(key, generation);

    try {
        const result = await generation;
        return { ...result, cacheStatus: "MISS" };
    } finally {
        if (pendingGenerations.get(key) === generation) {
            pendingGenerations.delete(key);
        }
    }
}

async function readAudioResponse(response) {
    const contentType = response.headers.get("content-type") || "audio/mpeg";
    if (!contentType.includes("json")) {
        return {
            contentType,
            audio: Buffer.from(await response.arrayBuffer())
        };
    }

    const payload = await response.json();
    const encodedAudio = payload.audioContent || payload.audio || payload.data;
    if (typeof encodedAudio !== "string" || !encodedAudio) {
        throw new Error("Inworld hat keine Audiodaten zurückgegeben.");
    }

    return {
        contentType: "audio/mpeg",
        audio: Buffer.from(encodedAudio, "base64")
    };
}

async function synthesize(options) {
    const upstreamResponse = await fetch(INWORLD_TTS_URL, {
        method: "POST",
        headers: {
            Authorization: `Basic ${process.env.INWORLD_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: options.text,
            voiceId: options.voiceId,
            modelId: options.modelId,
            audioConfig: {
                audioEncoding: options.audioEncoding,
                speakingRate: options.speakingRate
            },
            deliveryMode: options.deliveryMode,
            language: options.language
        })
    });

    if (!upstreamResponse.ok) {
        const detail = (await upstreamResponse.text()).slice(0, 500);
        throw new Error(`Inworld antwortete mit ${upstreamResponse.status}: ${detail}`);
    }

    return readAudioResponse(upstreamResponse);
}

module.exports = async function handler(request, response) {
    if (!applyCors(request, response)) {
        sendJson(response, 403, { error: "Origin ist nicht freigeschaltet." });
        return;
    }

    if (request.method === "OPTIONS") {
        response.statusCode = 204;
        response.end();
        return;
    }

    if (request.method !== "POST") {
        response.setHeader("Allow", "POST, OPTIONS");
        sendJson(response, 405, { error: "Nur POST und OPTIONS werden unterstützt." });
        return;
    }

    if (!process.env.INWORLD_API_KEY) {
        sendJson(response, 503, { error: "INWORLD_API_KEY ist serverseitig nicht konfiguriert." });
        return;
    }

    const body = parseBody(request.body);
    const requestOptions = getRequestOptions(body || {});
    if (requestOptions.error) {
        sendJson(response, 400, { error: requestOptions.error });
        return;
    }

    const options = requestOptions.value;
    const cacheKey = getCacheKey(options);
    let result;
    try {
        result = await getOrGenerate(options, cacheKey);
    } catch (error) {
        console.error("TTS-Cache- oder Inworld-Anfrage fehlgeschlagen.", error);
        sendJson(response, 502, { error: "Der TTS-Dienst konnte kein Audio liefern." });
        return;
    }

    if (result?.audio) {
        if (typeof response.status === "function") {
            response.status(200);
        } else {
            response.statusCode = 200;
        }
        response
            .setHeader("Content-Type", result.audio.contentType)
            .setHeader("Cache-Control", "private, max-age=31536000")
            .setHeader("X-TTS-Cache", result.cacheStatus)
            .end(result.audio.audio);
    }
};
