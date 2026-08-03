(function () {

    const SPEED_STORAGE_KEY = "questAudioPlaybackRate";
    const DEFAULT_PLAYBACK_RATE = 1;
    const MIN_PLAYBACK_RATE = 0.5;
    const MAX_PLAYBACK_RATE = 2;
    const activePlayers = new Set();

    function getStoredPlaybackRate() {
        const storedRate = Number(localStorage.getItem(SPEED_STORAGE_KEY));

        if (!Number.isFinite(storedRate)) {
            return DEFAULT_PLAYBACK_RATE;
        }

        return Math.min(
            MAX_PLAYBACK_RATE,
            Math.max(MIN_PLAYBACK_RATE, storedRate)
        );
    }

    function formatPlaybackRate(rate) {
        return `${Number(rate).toFixed(2).replace(/0$/, "").replace(/\.0$/, "")}×`;
    }

    function getQuestAudioSource(contentMode, questNumber) {
        if (contentMode !== "campaign") {
            return null;
        }

        const number = Number(questNumber);

        if (!Number.isInteger(number) || number < 1 || number > 42) {
            return null;
        }

        return `../assets/audio/quests/dialog-${String(number).padStart(2, "0")}.mp3`;
    }

    function renderQuestAudioPlayer({
        contentMode = "campaign",
        questNumber,
        className = ""
    } = {}) {
        const source = getQuestAudioSource(contentMode, questNumber);

        if (!source) {
            return "";
        }

        return `
            <div
                class="quest-audio-player ${className}"
                data-quest-audio-player
                data-audio-source="${source}">
                <button
                    type="button"
                    class="quest-audio-play-button"
                    aria-label="Dialogaudio abspielen"
                    aria-pressed="false">
                    <span aria-hidden="true">▶</span>
                </button>
                <label class="quest-audio-speed">
                    <span>Tempo</span>
                    <input
                        type="range"
                        class="quest-audio-speed-slider"
                        min="${MIN_PLAYBACK_RATE}"
                        max="${MAX_PLAYBACK_RATE}"
                        step="0.05"
                        value="${getStoredPlaybackRate()}"
                        aria-label="Wiedergabegeschwindigkeit">
                    <output class="quest-audio-speed-value">1×</output>
                </label>
                <span class="quest-audio-status" aria-live="polite"></span>
                <audio
                    class="quest-audio-native"
                    preload="none"
                    src="${source}"></audio>
            </div>
        `;
    }

    function initializeQuestAudioPlayers(container = document) {
        container
            .querySelectorAll("[data-quest-audio-player]")
            .forEach(playerElement => {
                if (playerElement.dataset.audioInitialized === "true") {
                    return;
                }

                const audio = playerElement.querySelector(".quest-audio-native");
                const playButton = playerElement.querySelector(
                    ".quest-audio-play-button"
                );
                const speedSlider = playerElement.querySelector(
                    ".quest-audio-speed-slider"
                );
                const speedValue = playerElement.querySelector(
                    ".quest-audio-speed-value"
                );
                const status = playerElement.querySelector(
                    ".quest-audio-status"
                );

                if (!audio || !playButton || !speedSlider || !speedValue) {
                    return;
                }

                const setStatus = message => {
                    if (status) {
                        status.textContent = message;
                    }
                };

                const updateButton = () => {
                    const isPlaying = !audio.paused && !audio.ended;
                    playButton.classList.toggle("is-playing", isPlaying);
                    playButton.setAttribute("aria-pressed", String(isPlaying));
                    playButton.setAttribute(
                        "aria-label",
                        isPlaying
                            ? "Dialogaudio pausieren"
                            : "Dialogaudio abspielen"
                    );
                    playButton.firstElementChild.textContent = isPlaying
                        ? "❚❚"
                        : "▶";
                };

                const stopOtherPlayers = () => {
                    activePlayers.forEach(otherAudio => {
                        if (otherAudio !== audio) {
                            otherAudio.pause();
                        }
                    });
                };

                const storedRate = getStoredPlaybackRate();
                speedSlider.value = String(storedRate);
                speedValue.value = formatPlaybackRate(storedRate);
                speedValue.textContent = formatPlaybackRate(storedRate);
                audio.playbackRate = storedRate;

                playButton.addEventListener("click", event => {
                    event.stopPropagation();
                    setStatus("");

                    if (!audio.paused && !audio.ended) {
                        audio.pause();
                        return;
                    }

                    stopOtherPlayers();
                    audio.play().catch(() => {
                        setStatus("Audio konnte nicht gestartet werden.");
                        updateButton();
                    });
                });

                speedSlider.addEventListener("click", event => {
                    event.stopPropagation();
                });

                speedSlider.addEventListener("input", event => {
                    event.stopPropagation();
                    const rate = Number(event.target.value);
                    audio.playbackRate = rate;
                    speedValue.value = formatPlaybackRate(rate);
                    speedValue.textContent = formatPlaybackRate(rate);
                    localStorage.setItem(SPEED_STORAGE_KEY, String(rate));
                });

                playerElement.addEventListener("click", event => {
                    event.stopPropagation();
                });

                audio.addEventListener("play", () => {
                    activePlayers.add(audio);
                    stopOtherPlayers();
                    updateButton();
                });

                audio.addEventListener("pause", () => {
                    activePlayers.delete(audio);
                    updateButton();
                });

                audio.addEventListener("ended", () => {
                    activePlayers.delete(audio);
                    updateButton();
                    window.dispatchEvent(new Event("questaudio:ended"));
                });

                audio.addEventListener("error", () => {
                    playButton.disabled = true;
                    setStatus("Audio nicht verfügbar.");
                    updateButton();
                });

                playerElement.dataset.audioInitialized = "true";
                updateButton();
            });
    }

    window.questAudio = {
        getQuestAudioSource,
        initializeQuestAudioPlayers,
        renderQuestAudioPlayer
    };

})();
