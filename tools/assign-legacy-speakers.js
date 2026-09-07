const fs = require("node:fs/promises");

const contentPath = process.env.TTS_CONTENT_PATH || "data/thai-giga-drill.v1.json";
const writeChanges = process.argv.includes("--write");
const repairGender = process.argv.includes("--repair-gender");

const MALE_MARKERS = [/\u0e1c\u0e21/u, /\u0e04\u0e23\u0e31\u0e1a/u];
const FEMALE_MARKERS = [/\u0e09\u0e31\u0e19/u, /\u0e04\u0e48\u0e30/u, /\u0e04\u0e30/u];
const MALE_PROFILES = new Set(["M", "M1", "M2", "JM", "VA", "OP", "ON"]);

function hasMarker(text, markers) {
    return markers.some(marker => marker.test(text));
}

function getGender(text) {
    const male = hasMarker(text, MALE_MARKERS);
    const female = hasMarker(text, FEMALE_MARKERS);
    if (male && !female) {
        return "male";
    }
    if (female && !male) {
        return "female";
    }
    return "";
}

function getProfileGender(profile) {
    return MALE_PROFILES.has(profile) ? "male" : "female";
}

function getParityEvidence(sentences) {
    return [0, 1].map(parity => {
        const genders = sentences
            .filter((sentence, index) => index % 2 === parity)
            .map(sentence => getGender(sentence.thai))
            .filter(Boolean);
        return {
            male: genders.filter(gender => gender === "male").length,
            female: genders.filter(gender => gender === "female").length
        };
    });
}

function getDominantGender(evidence) {
    if (evidence.male > evidence.female) {
        return "male";
    }
    if (evidence.female > evidence.male) {
        return "female";
    }
    return "";
}

function getProfilePair(sentences) {
    const evidence = getParityEvidence(sentences);
    const genders = evidence.map(getDominantGender);
    const knownGenders = genders.filter(Boolean);
    let profiles;
    let confidence;

    if (genders[0] && genders[1] && genders[0] !== genders[1]) {
        profiles = genders.map(gender => gender === "male" ? "M" : "W");
        confidence = 0.9;
    } else if (knownGenders.length === 2 && knownGenders[0] === knownGenders[1]) {
        profiles = knownGenders[0] === "male" ? ["M1", "M2"] : ["F1", "F2"];
        confidence = 0.8;
    } else if (knownGenders.length === 1) {
        const knownProfile = knownGenders[0] === "male" ? "M" : "W";
        const otherProfile = knownGenders[0] === "male" ? "W" : "M";
        profiles = genders[0] ? [knownProfile, otherProfile] : [otherProfile, knownProfile];
        confidence = 0.65;
    } else {
        profiles = ["M", "W"];
        confidence = 0.35;
    }

    return {
        profiles,
        assignmentSource: confidence >= 0.8 ? "contextual" : "uncertain",
        confidence
    };
}

function repairStoryGender(story) {
    if (!Array.isArray(story.speakers) || story.speakers.length < 2) {
        return { changed: false, repairedSentences: 0 };
    }

    const explicitGenders = new Set(
        story.sentences.map(sentence => getGender(sentence.thai)).filter(Boolean)
    );
    let maleSpeaker = story.speakers.find(
        speaker => getProfileGender(speaker.voiceProfileId) === "male"
    );
    let femaleSpeaker = story.speakers.find(
        speaker => getProfileGender(speaker.voiceProfileId) === "female"
    );
    let changed = false;

    if (explicitGenders.has("male") && !maleSpeaker) {
        const replacement = story.speakers.find(speaker => speaker !== femaleSpeaker);
        if (replacement) {
            replacement.role = "M";
            replacement.voiceProfileId = "M";
            maleSpeaker = replacement;
            changed = true;
        }
    }
    if (explicitGenders.has("female") && !femaleSpeaker) {
        const replacement = story.speakers.find(speaker => speaker !== maleSpeaker);
        if (replacement) {
            replacement.role = "W";
            replacement.voiceProfileId = "W";
            femaleSpeaker = replacement;
            changed = true;
        }
    }

    let repairedSentences = 0;
    story.sentences.forEach(sentence => {
        const gender = getGender(sentence.thai);
        const targetSpeaker = gender === "male" ? maleSpeaker : gender === "female" ? femaleSpeaker : null;
        const currentSpeaker = story.speakers.find(speaker => speaker.id === sentence.speakerId);
        const currentGender = currentSpeaker
            ? getProfileGender(currentSpeaker.voiceProfileId)
            : "";
        if (targetSpeaker && currentGender !== gender) {
            sentence.speakerId = targetSpeaker.id;
            repairedSentences += 1;
        }
    });

    return {
        changed: changed || repairedSentences > 0,
        repairedSentences
    };
}

function assignStory(story) {
    if (Array.isArray(story.speakers) && story.speakers.length > 0 && !repairGender) {
        return { changed: false, confidence: null };
    }
    if (Array.isArray(story.speakers) && story.speakers.length > 0) {
        const repair = repairStoryGender(story);
        return { changed: repair.changed, confidence: null, repairedSentences: repair.repairedSentences };
    }

    const assignment = getProfilePair(story.sentences);
    const speakerIds = ["a", "b"].map(suffix => `${story.id}-speaker-${suffix}`);
    story.speakers = assignment.profiles.map((profile, index) => ({
        id: speakerIds[index],
        role: profile,
        assignmentSource: assignment.assignmentSource,
        confidence: assignment.confidence,
        voiceProfileId: profile
    }));
    story.sentences.forEach((sentence, index) => {
        sentence.speakerId = speakerIds[index % 2];
    });
    const repair = repairStoryGender(story);

    return {
        changed: true,
        confidence: assignment.confidence,
        repairedSentences: repair.repairedSentences
    };
}

async function run() {
    const content = JSON.parse(await fs.readFile(contentPath, "utf8"));
    const summary = {
        stories: 0,
        assignedStories: 0,
        skippedStories: 0,
        assignedSentences: 0,
        uncertainStories: 0,
        repairedStories: 0,
        repairedSentences: 0,
        profiles: {}
    };

    for (const level of content.levels || []) {
        for (const boss of level.bosses || []) {
            for (const block of boss.blocks || []) {
                for (const story of block.miniStories || []) {
                    summary.stories += 1;
                    const result = assignStory(story);
                    if (!result.changed) {
                        summary.skippedStories += 1;
                        continue;
                    }
                    if (repairGender && story.speakers?.length) {
                        summary.repairedStories += 1;
                        summary.repairedSentences += result.repairedSentences || 0;
                    } else {
                        summary.assignedStories += 1;
                        summary.assignedSentences += story.sentences.length;
                    }
                    if (result.confidence !== null && result.confidence < 0.8) {
                        summary.uncertainStories += 1;
                    }
                    story.speakers.forEach(speaker => {
                        summary.profiles[speaker.voiceProfileId] =
                            (summary.profiles[speaker.voiceProfileId] || 0) + 1;
                    });
                }
            }
        }
    }

    if (writeChanges) {
        await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    }

    console.log(JSON.stringify({
        ...summary,
        mode: writeChanges ? "write" : "dry-run",
        contentPath
    }, null, 2));
}

run().catch(error => {
    console.error("Legacy-Sprecherzuordnung fehlgeschlagen.", error);
    process.exitCode = 1;
});
