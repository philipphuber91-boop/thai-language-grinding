const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const audioScript = fs.readFileSync(
    path.join(__dirname, "../js/quest-audio.js"),
    "utf8"
);

function createAudioHarness({ rejectAudioContextResume = false, rejectHtmlAudioPlay = false } = {}) {
    const calls = [];
    const storage = new Map();
    let resolveAudioStarted;
    const audioStarted = new Promise(resolve => {
        resolveAudioStarted = resolve;
    });

    class FakeAudioContext {
        constructor() {
            this.state = "suspended";
            this.destination = {};
        }

        resume() {
            calls.push("resume");
            if (rejectAudioContextResume) {
                return Promise.reject(new Error("AudioContext resume rejected"));
            }
            this.state = "running";
            return Promise.resolve();
        }

        decodeAudioData() {
            calls.push("decode");
            return Promise.resolve({ duration: 1 });
        }

        createBufferSource() {
            return {
                playbackRate: { value: 1 },
                connect() {},
                disconnect() {},
                start() {
                    calls.push("start");
                    resolveAudioStarted();
                },
                stop() {},
                onended: null
            };
        }
    }

    class FakeAudio {
        pause() {}
        load() {}
        removeAttribute() {}
        play() {
            return rejectHtmlAudioPlay
                ? Promise.reject(new Error("HTML audio play rejected"))
                : Promise.resolve();
        }
    }

    class FakeUtterance {
        constructor(text) {
            this.text = text;
        }
    }

    const window = {
        THAI_GIGA_TTS_CONFIG: { endpoint: "https://tts.example.test/api/tts" },
        AudioContext: FakeAudioContext,
        speechSynthesis: {
            cancel() {},
            getVoices: () => [],
            speak: utterance => calls.push(`speak:${utterance.text}`)
        },
        dispatchEvent() {}
    };

    const sandbox = {
        AbortController,
        Audio: FakeAudio,
        SpeechSynthesisUtterance: FakeUtterance,
        URL: {
            createObjectURL: () => "blob:remote-audio",
            revokeObjectURL() {}
        },
        console: { warn() {} },
        document: {},
        fetch: () => {
            calls.push("fetch");
            return Promise.resolve({
                ok: true,
                blob: async () => ({
                    arrayBuffer: async () => new ArrayBuffer(8)
                })
            });
        },
        localStorage: {
            getItem: key => storage.get(key) || null,
            setItem: (key, value) => storage.set(key, value)
        },
        window
    };

    vm.runInNewContext(audioScript, sandbox, { filename: "quest-audio.js" });

    const entry = {
        id: "sentence-1",
        thai: "สวัสดี",
        audio: { type: "speechSynthesis", lang: "th-TH" }
    };
    const player = window.questAudio.createPlaylistPlayer({
        storageKey: "test-playlist",
        getEntryId: item => item.id,
        resolveEntry: id => id === entry.id ? entry : null,
        getEntryText: item => item.thai,
        getEntryAudio: item => item.audio
    });
    player.add(entry);

    return { audioStarted, calls, player };
}

test("remote TTS unlocks Web Audio synchronously before fetching on mobile browsers", async () => {
    const { audioStarted, calls, player } = createAudioHarness();

    player.togglePlayback();

    assert.deepEqual(calls, ["resume", "fetch"]);
    await audioStarted;
    assert.deepEqual(calls, ["resume", "fetch", "decode", "start"]);
});

test("a rejected HTML audio start falls back to browser speech instead of reporting success", async () => {
    const { calls, player } = createAudioHarness({
        rejectAudioContextResume: true,
        rejectHtmlAudioPlay: true
    });

    player.togglePlayback();
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));

    assert.ok(calls.includes("speak:สวัสดี"));
});
