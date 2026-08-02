const TYPING_VIBRATION_KEY = "typingVibrationEnabled";
const TYPING_SOUND_KEY = "typingSoundEnabled";
const TYPING_VIBRATION_DURATION_MS = 10;
const TYPING_SOUND_PRESET = "soft-click";

let typingAudioContext = null;

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

function playTypingClick() {
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

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;
    const endTime = startTime + 0.035;

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1850, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, endTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime);
}

function triggerTypingFeedback() {
    if (isTypingVibrationEnabled()) {
        navigator.vibrate(TYPING_VIBRATION_DURATION_MS);
    }

    if (isTypingSoundEnabled()) {
        playTypingClick();
    }
}

window.typingFeedback = {
    isSoundEnabled: isTypingSoundEnabled,
    isVibrationEnabled: isTypingVibrationEnabled,
    setSoundEnabled: setTypingSoundEnabled,
    setVibrationEnabled: setTypingVibrationEnabled,
    supportsVibration: supportsTypingVibration,
    trigger: triggerTypingFeedback,
    soundPreset: TYPING_SOUND_PRESET
};
