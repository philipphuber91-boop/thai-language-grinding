const fs = require("node:fs/promises");

const contentPath = process.env.TTS_CONTENT_PATH || "data/thai-giga-drill.v1.json";
const writeChanges = process.argv.includes("--write");

const MALE_MARKERS = [/\u0e1c\u0e21/u, /\u0e04\u0e23\u0e31\u0e1a/u];
const FEMALE_MARKERS = [/\u0e09\u0e31\u0e19/u, /\u0e04\u0e48\u0e30/u, /\u0e04\u0e30/u];

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

function assignStory(story) {
    if (Array.isArray(story.speakers) && story.speakers.length > 0) {
        return { changed: false, confidence: null };
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

    return { changed: true, confidence: assignment.confidence };
}

async function run() {
    const content = JSON.parse(await fs.readFile(contentPath, "utf8"));
    const summary = {
        stories: 0,
        assignedStories: 0,
        skippedStories: 0,
        assignedSentences: 0,
        uncertainStories: 0,
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
                    summary.assignedStories += 1;
                    summary.assignedSentences += story.sentences.length;
                    if (result.confidence < 0.8) {
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
