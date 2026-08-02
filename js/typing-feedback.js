const TYPING_VIBRATION_KEY = "typingVibrationEnabled";
const TYPING_SOUND_KEY = "typingSoundEnabled";
const TYPING_SOUND_PRESET_KEY = "typingSoundPreset";
const TYPING_VIBRATION_DURATION_MS = 10;
const DEFAULT_TYPING_SOUND_PRESET = "recorded-click";

const TYPING_SOUND_PRESETS = Object.freeze({
    "recorded-click": {
        label: "Klick (Aufnahme)",
        audioSources: ["../assets/audio/typing-click.mp3"]
    },
    "recorded-drop": {
        label: "Wassertropfen (Aufnahme)",
        audioSources: ["../assets/audio/typing-drop.mp3"]
    },
    "recorded-iphone": {
        label: "iPhone-Klick (Aufnahme)",
        audioSources: ["../assets/audio/typing-iphone.mp3"]
    },
    "recorded-iphone2": {
        label: "iPhone-Ton (Aufnahme)",
        audioSources: ["../assets/audio/typing-iphone2.mp3"]
    },
    bell: {
        label: "Glocke",
        tones: [
            {
                type: "sine",
                frequency: 1050,
                endFrequency: 720,
                duration: 0.24,
                volume: 0.06
            },
            {
                type: "triangle",
                frequency: 1580,
                endFrequency: 1050,
                duration: 0.18,
                delay: 0.008,
                volume: 0.028
            }
        ]
    }
});

const TYPING_ERROR_TONES = [
    {
        type: "sawtooth",
        frequency: 260,
        endFrequency: 120,
        duration: 0.12,
        volume: 0.06
    },
    {
        type: "square",
        frequency: 150,
        endFrequency: 90,
        duration: 0.1,
        delay: 0.015,
        volume: 0.035
    }
];

let typingAudioContext = null;
const typingAudioPools = new Map();
const TYPING_AUDIO_POOL_SIZE = 4;

function supportsTypingVibration() {
    return typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function";
}

function isTypingVibrationEnabled() {
    return supportsTypingVibration() &&
        localStorage.getItem(TYPING_VIBRATION_KEY) !== "false";
}

function setTypingVibrationEnabled(enabled) {
    if (!supportsTypingVibration()) {
        return false;
    }

    const value = Boolean(enabled);
    localStorage.setItem(TYPING_VIBRATION_KEY, String(value));
    return value;
}

function isTypingSoundEnabled() {
    return localStorage.getItem(TYPING_SOUND_KEY) === "true";
}

function getTypingSoundPreset() {
    const savedPreset = localStorage.getItem(TYPING_SOUND_PRESET_KEY);

    return Object.prototype.hasOwnProperty.call(TYPING_SOUND_PRESETS, savedPreset)
        ? savedPreset
        : DEFAULT_TYPING_SOUND_PRESET;
}

function setTypingSoundPreset(preset) {
    if (!Object.prototype.hasOwnProperty.call(TYPING_SOUND_PRESETS, preset)) {
        return getTypingSoundPreset();
    }

    localStorage.setItem(TYPING_SOUND_PRESET_KEY, preset);
    return preset;
}

function getTypingSoundPresets() {
    return Object.entries(TYPING_SOUND_PRESETS).map(([value, preset]) => ({
        label: preset.label,
        value
    }));
}

function setTypingSoundEnabled(enabled) {
    const value = Boolean(enabled);
    localStorage.setItem(TYPING_SOUND_KEY, String(value));
    return value;
}

function getTypingAudioContext() {
    if (typingAudioContext) {
        return typingAudioContext;
    }

    const AudioContextConstructor =
        window.AudioContext || window.webkitAudioContext;

    if (typeof AudioContextConstructor !== "function") {
        return null;
    }

    try {
        typingAudioContext = new AudioContextConstructor();
    } catch (error) {
        console.warn("Tippgeräusch konnte nicht initialisiert werden.", error);
        return null;
    }

    return typingAudioContext;
}

function playTypingAudio(sources) {
    if (typeof Audio !== "function" || !Array.isArray(sources) || sources.length === 0) {
        return;
    }

    const source = sources[Math.floor(Math.random() * sources.length)];
    let pool = typingAudioPools.get(source);

    if (!pool) {
        pool = [];
        typingAudioPools.set(source, pool);
    }

    let audio = pool.find(candidate => candidate.paused || candidate.ended);

    if (!audio) {
        audio = pool.length < TYPING_AUDIO_POOL_SIZE
            ? new Audio(source)
            : pool[0];

        audio.preload = "auto";

        if (!pool.includes(audio)) {
            pool.push(audio);
        }
    }

    audio.currentTime = 0;
    audio.volume = 0.45;
    const playback = audio.play();

    if (playback && typeof playback.catch === "function") {
        playback.catch(error => {
            console.warn("Aufgenommener Tipp-Ton konnte nicht abgespielt werden.", error);
        });
    }
}

function playTypingPreset(preset) {
    if (Array.isArray(preset.audioSources)) {
        playTypingAudio(preset.audioSources);
        return;
    }

    playTypingSequence(preset.tones);
}

function playTypingSequence(tones) {
    const audioContext = getTypingAudioContext();

    if (!audioContext) {
        return;
    }

    if (audioContext.state === "closed") {
        return;
    }

    if (audioContext.state === "suspended") {
        const resumePromise = audioContext.resume();
        resumePromise?.catch(error => {
            console.warn("Tippgeräusch konnte nicht aktiviert werden.", error);
        });
    }

    tones.forEach(tone => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime + (tone.delay || 0);
        const endTime = startTime + tone.duration;
        const attackTime = Math.min(0.006, tone.duration / 4);

        oscillator.type = tone.type;
        oscillator.frequency.setValueAtTime(tone.frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            tone.endFrequency,
            endTime
        );

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(
            tone.volume,
            startTime + attackTime
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

function triggerTypingFeedback() {
    if (isTypingVibrationEnabled()) {
        navigator.vibrate(TYPING_VIBRATION_DURATION_MS);
    }

    if (isTypingSoundEnabled()) {
        playTypingPreset(TYPING_SOUND_PRESETS[getTypingSoundPreset()]);
    }
}

function triggerTypingErrorFeedback() {
    if (isTypingSoundEnabled()) {
        playTypingSequence(TYPING_ERROR_TONES);
    }
}

window.typingFeedback = {
    getSoundPreset: getTypingSoundPreset,
    getSoundPresets: getTypingSoundPresets,
    isSoundEnabled: isTypingSoundEnabled,
    isVibrationEnabled: isTypingVibrationEnabled,
    setSoundEnabled: setTypingSoundEnabled,
    setSoundPreset: setTypingSoundPreset,
    setVibrationEnabled: setTypingVibrationEnabled,
    supportsVibration: supportsTypingVibration,
    trigger: triggerTypingFeedback,
    triggerError: triggerTypingErrorFeedback
};
