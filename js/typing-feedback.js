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
    "synth-click": {
        label: "Klick (Oszillator)",
        tones: [
            {
                type: "square",
                frequency: 2600,
                endFrequency: 1600,
                duration: 0.045,
                volume: 0.018
            },
            {
                type: "sine",
                frequency: 5200,
                endFrequency: 2800,
                duration: 0.025,
                delay: 0.001,
                volume: 0.012
            }
        ]
    },
    "recorded-drop": {
        label: "Wassertropfen (Aufnahme)",
        audioSources: ["../assets/audio/typing-drop.mp3"]
    },
    "synth-drop": {
        label: "Wassertropfen (Oszillator)",
        tones: [
            {
                type: "sine",
                frequency: 1100,
                endFrequency: 420,
                duration: 0.12,
                volume: 0.035
            },
            {
                type: "triangle",
                frequency: 1750,
                endFrequency: 700,
                duration: 0.09,
                delay: 0.003,
                volume: 0.016
            }
        ]
    },
    "recorded-iphone": {
        label: "iPhone-Klick (Aufnahme)",
        audioSources: ["../assets/audio/typing-iphone.mp3"]
    },
    "synth-iphone": {
        label: "iPhone-Klick (Oszillator)",
        tones: [
            {
                type: "sine",
                frequency: 1800,
                endFrequency: 1200,
                duration: 0.07,
                volume: 0.03
            },
            {
                type: "triangle",
                frequency: 2900,
                endFrequency: 1800,
                duration: 0.045,
                delay: 0.002,
                volume: 0.012
            }
        ]
    },
    "recorded-iphone2": {
        label: "iPhone-Ton (Aufnahme)",
        audioSources: ["../assets/audio/typing-iphone2.mp3"]
    },
    "synth-iphone2": {
        label: "iPhone-Ton (Oszillator)",
        tones: [
            {
                type: "sine",
                frequency: 1200,
                endFrequency: 850,
                duration: 0.1,
                volume: 0.035
            },
            {
                type: "triangle",
                frequency: 2100,
                endFrequency: 1400,
                duration: 0.08,
                delay: 0.003,
                volume: 0.02
            },
            {
                type: "sine",
                frequency: 2800,
                endFrequency: 1900,
                duration: 0.05,
                delay: 0.006,
                volume: 0.01
            }
        ]
    },
    "recorded-robot-laser-01": {
        label: "Robot-/Laser-Ton 1",
        audioSources: ["../assets/audio/typing-robot-laser-01.mp3"]
    },
    "synth-robot-laser-01": {
        label: "Robot-/Laser-Ton 1 (Oszillator)",
        tones: [
            {
                type: "sawtooth",
                frequency: 300,
                endFrequency: 760,
                duration: 0.065,
                volume: 0.03
            },
            {
                type: "square",
                frequency: 900,
                endFrequency: 1800,
                duration: 0.05,
                delay: 0.002,
                volume: 0.013
            }
        ]
    },
    "recorded-robot-laser-02": {
        label: "Robot-/Laser-Ton 2",
        audioSources: ["../assets/audio/typing-robot-laser-02.mp3"]
    },
    "synth-robot-laser-02": {
        label: "Robot-/Laser-Ton 2 (Oszillator)",
        tones: [
            {
                type: "sawtooth",
                frequency: 680,
                endFrequency: 250,
                duration: 0.09,
                volume: 0.035
            },
            {
                type: "triangle",
                frequency: 1450,
                endFrequency: 530,
                duration: 0.084,
                delay: 0.002,
                volume: 0.022
            },
            {
                type: "square",
                frequency: 2800,
                endFrequency: 900,
                duration: 0.07,
                delay: 0.004,
                volume: 0.012
            },
            {
                type: "sine",
                frequency: 420,
                endFrequency: 180,
                duration: 0.095,
                delay: 0.001,
                volume: 0.018
            }
        ]
    },
    "recorded-robot-laser-03": {
        label: "Robot-/Laser-Ton 3",
        audioSources: ["../assets/audio/typing-robot-laser-03.mp3"]
    },
    "synth-robot-laser-03": {
        label: "Robot-/Laser-Ton 3 (Oszillator)",
        tones: [
            {
                type: "triangle",
                frequency: 520,
                endFrequency: 1700,
                duration: 0.065,
                volume: 0.03
            },
            {
                type: "sine",
                frequency: 1300,
                endFrequency: 3200,
                duration: 0.05,
                delay: 0.002,
                volume: 0.014
            }
        ]
    },
    "recorded-robot-laser-04": {
        label: "Robot-/Laser-Ton 4",
        audioSources: ["../assets/audio/typing-robot-laser-04.mp3"]
    },
    "synth-robot-laser-04": {
        label: "Robot-/Laser-Ton 4 (Oszillator)",
        tones: [
            {
                type: "square",
                frequency: 2400,
                endFrequency: 700,
                duration: 0.06,
                volume: 0.025
            },
            {
                type: "sawtooth",
                frequency: 600,
                endFrequency: 260,
                duration: 0.066,
                delay: 0.001,
                volume: 0.018
            }
        ]
    },
    "recorded-robot-laser-05": {
        label: "Robot-/Laser-Ton 5",
        audioSources: ["../assets/audio/typing-robot-laser-05.mp3"]
    },
    "synth-robot-laser-05": {
        label: "Robot-/Laser-Ton 5 (Oszillator)",
        tones: [
            {
                type: "sawtooth",
                frequency: 900,
                endFrequency: 280,
                duration: 0.066,
                volume: 0.03
            },
            {
                type: "triangle",
                frequency: 1900,
                endFrequency: 700,
                duration: 0.055,
                delay: 0.003,
                volume: 0.015
            }
        ]
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

    if (audio.error) {
        audio.load();
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

function resetTypingAudioPool() {
    typingAudioPools.forEach(pool => {
        pool.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            audio.load();
        });
    });
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
        if (resumePromise && typeof resumePromise.then === "function") {
            resumePromise
                .then(() => {
                    if (
                        typingAudioContext === audioContext &&
                        audioContext.state !== "closed"
                    ) {
                        scheduleTypingSequence(audioContext, tones);
                    }
                })
                .catch(error => {
                    console.warn("Tippgeräusch konnte nicht aktiviert werden.", error);
                });
            return;
        }
    }

    scheduleTypingSequence(audioContext, tones);
}

function scheduleTypingSequence(audioContext, tones) {
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

window.addEventListener("questaudio:ended", resetTypingAudioPool);

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
