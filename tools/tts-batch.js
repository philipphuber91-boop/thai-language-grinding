const fs = require("node:fs/promises");

const contentPath = "data/thai-giga-drill.v1.json";
const voiceConfigPath = process.env.TTS_VOICE_CONFIG_PATH || "data/tts-voices.json";
const endpoint = process.env.TTS_ENDPOINT || "http://localhost:3000/api/tts";
const voiceId = process.env.TTS_VOICE_ID || "";
const modelId = process.env.TTS_MODEL_ID || "inworld-tts-2";
const configuredConcurrency = Number(process.env.TTS_CONCURRENCY || 3);
const concurrency = Number.isInteger(configuredConcurrency) && configuredConcurrency > 0
    ? configuredConcurrency
    : 3;

function collectSentences(content) {
    return content.levels
        .flatMap(level => level.bosses)
        .flatMap(boss => boss.blocks)
        .flatMap(block => block.miniStories)
        .flatMap(story => story.sentences.map(sentence => {
            const speaker = story.speakers?.find(item => item.id === sentence.speakerId);
            return {
                ...sentence,
                storyId: story.id,
                voiceProfileId: speaker?.voiceProfileId || ""
            };
        }))
        .filter(sentence => typeof sentence?.thai === "string" && sentence.thai.trim());
}

function getProfileVoiceId(profileId, voiceConfig) {
    const profile = profileId && voiceConfig.voiceProfiles?.[profileId];
    return typeof profile === "string" ? profile : profile?.voiceId || "";
}

function getSentenceGender(sentence) {
    const text = String(sentence?.thai || "");
    if (/ค่ะ|คะ/.test(text)) {
        return "female";
    }
    if (/ครับ/.test(text)) {
        return "male";
    }
    return "";
}

function getStableVoicePoolIndex(key, poolLength) {
    let hash = 2166136261;
    for (const character of String(key)) {
        hash ^= character.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % poolLength;
}

function getBalancedProfileId(sentence, profileId, voiceConfig) {
    const routing = voiceConfig.contentVoiceRouting;
    if (!routing || !profileId) {
        return profileId;
    }

    const profile = voiceConfig.voiceProfiles?.[profileId];
    const gender = profile && typeof profile === "object" ? profile.gender : "";
    const genericProfiles = gender === "female"
        ? routing.genericFemaleProfileIds
        : routing.genericMaleProfileIds;
    const rotationProfiles = gender === "female"
        ? routing.genericFemaleRotationProfileIds
        : routing.genericMaleRotationProfileIds;
    if (!Array.isArray(genericProfiles) ||
        !genericProfiles.includes(profileId) ||
        !Array.isArray(rotationProfiles) ||
        rotationProfiles.length === 0) {
        return profileId;
    }

    const storyKey = sentence?.storyId || sentence?.id || profileId;
    const speakerMatch = String(sentence?.speakerId || "").match(/speaker-([a-z])$/);
    const speakerOffset = speakerMatch
        ? speakerMatch[1].charCodeAt(0) - "a".charCodeAt(0)
        : 0;
    const poolIndex = getStableVoicePoolIndex(storyKey, rotationProfiles.length);
    return rotationProfiles[(poolIndex + speakerOffset) % rotationProfiles.length];
}

function getSentenceVoiceProfileId(sentence, voiceConfig) {
    const profile = sentence.voiceProfileId &&
        voiceConfig.voiceProfiles?.[sentence.voiceProfileId];
    const sentenceGender = getSentenceGender(sentence);
    const profileGender = profile && typeof profile === "object" ? profile.gender : "";

    if (!sentenceGender || !profileGender || sentenceGender === profileGender) {
        return getBalancedProfileId(sentence, sentence.voiceProfileId || "", voiceConfig);
    }

    return sentenceGender === "female" ? "W" : "M";
}

function resolveVoiceId(sentence, voiceConfig) {
    return sentence.voiceId ||
        voiceConfig.sentenceVoices?.[sentence.id] ||
        voiceConfig.speakerVoices?.[sentence.speakerId] ||
        getProfileVoiceId(getSentenceVoiceProfileId(sentence, voiceConfig), voiceConfig) ||
        voiceConfig.storyVoices?.[sentence.storyId] ||
        voiceConfig.defaultVoiceId ||
        voiceId;
}

async function synthesize(sentence, voiceConfig) {
    const body = {
        text: sentence.thai,
        language: "th-TH",
        modelId
    };
    const resolvedVoiceId = resolveVoiceId(sentence, voiceConfig);
    if (resolvedVoiceId) {
        body.voiceId = resolvedVoiceId;
    }

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                return response.headers.get("x-tts-cache") || "UNKNOWN";
            }
            if (response.status < 429 && response.status < 500) {
                throw new Error(`TTS-Proxy antwortete mit ${response.status}.`);
            }
        } catch (error) {
            if (attempt === 3) {
                throw error;
            }
        }
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }

    throw new Error("TTS-Anfrage konnte nicht abgeschlossen werden.");
}

async function run() {
    const content = JSON.parse(await fs.readFile(contentPath, "utf8"));
    const voiceConfig = JSON.parse(await fs.readFile(voiceConfigPath, "utf8"));
    const sentences = collectSentences(content);
    let nextIndex = 0;
    let completed = 0;

    async function worker() {
        while (nextIndex < sentences.length) {
            const index = nextIndex;
            nextIndex += 1;
            const status = await synthesize(sentences[index], voiceConfig);
            completed += 1;
            console.log(`[${completed}/${sentences.length}] ${sentences[index].id} ${status}`);
        }
    }

    await Promise.all(Array.from(
        { length: Math.min(concurrency, sentences.length) },
        () => worker()
    ));
}

run().catch(error => {
    console.error("TTS-Batch fehlgeschlagen.", error);
    process.exitCode = 1;
});
