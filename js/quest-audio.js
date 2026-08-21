(function () {

    const SPEED_STORAGE_KEY = "questAudioPlaybackRate";
    const DEFAULT_PLAYBACK_RATE = 1;
    const MIN_PLAYBACK_RATE = 0.5;
    const MAX_PLAYBACK_RATE = 2;
    const activePlayers = new Set();
    let activeSpeech = null;
    let activeNativeAudio = null;

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

    function escapeAttribute(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function stopSpeech() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        if (activeNativeAudio) {
            activeNativeAudio.pause();
            activeNativeAudio.currentTime = 0;
            activeNativeAudio = null;
        }

        if (activeSpeech?.button) {
            activeSpeech.button.classList.remove("is-playing");
            activeSpeech.button.setAttribute("aria-pressed", "false");
            activeSpeech.button.textContent = "🔊";
        }

        activeSpeech = null;
    }

    function speakText(text, button = null, options = {}) {
        if (
            typeof text !== "string" ||
            text.trim() === "" ||
            !("speechSynthesis" in window) ||
            typeof SpeechSynthesisUtterance !== "function"
        ) {
            return false;
        }

        if (button && activeSpeech?.text === text) {
            stopSpeech();
            return true;
        }

        stopSpeech();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || "th-TH";
        utterance.rate = Number.isFinite(options.rate)
            ? options.rate
            : getStoredPlaybackRate();
        activeSpeech = { text, button, utterance };

        if (button) {
            button.classList.add("is-playing");
            button.setAttribute("aria-pressed", "true");
            button.textContent = "❚❚";
        }

        utterance.onend = () => {
            if (activeSpeech?.utterance !== utterance) {
                return;
            }

            stopSpeech();
            options.onEnd?.();
        };
        utterance.onerror = () => {
            if (activeSpeech?.utterance === utterance) {
                stopSpeech();
                options.onError?.();
            }
        };

        window.speechSynthesis.speak(utterance);
        return true;
    }

    function createPlaylistPlayer({
        storageKey,
        getEntryId,
        resolveEntry,
        getEntryText,
        getEntryAudio,
        onCurrentChange,
        onStateChange,
        onStatus,
        defaultPlaybackRate = DEFAULT_PLAYBACK_RATE,
        minPlaybackRate = MIN_PLAYBACK_RATE,
        maxPlaybackRate = MAX_PLAYBACK_RATE
    } = {}) {
        if (
            typeof storageKey !== "string" ||
            typeof getEntryId !== "function" ||
            typeof resolveEntry !== "function" ||
            typeof getEntryText !== "function"
        ) {
            throw new TypeError("Eine Playlist braucht stabile IDs, eine Auflösung und Satztext.");
        }

        const clampRate = value => {
            const rate = Number(value);
            if (!Number.isFinite(rate)) {
                return defaultPlaybackRate;
            }
            return Math.min(maxPlaybackRate, Math.max(minPlaybackRate, rate));
        };
        const state = {
            playlist: [],
            currentIndex: 0,
            loop: true,
            shuffle: false,
            shuffleOrder: [],
            shufflePosition: 0,
            playbackRate: clampRate(defaultPlaybackRate),
            playing: false
        };
        let playbackRunId = 0;

        const notify = () => {
            const current = state.playlist[state.currentIndex] || null;
            onCurrentChange?.(current, state);
            onStateChange?.(state);
        };

        const setStatus = message => {
            onStatus?.(message);
        };

        const save = () => {
            try {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify({
                        playlist: state.playlist.map(getEntryId),
                        currentIndex: state.currentIndex,
                        loop: state.loop,
                        shuffle: state.shuffle,
                        playbackRate: state.playbackRate
                    })
                );
            } catch (error) {
                console.warn("Audio-Playlist konnte nicht gespeichert werden.", error);
                setStatus("Die Audio-Playlist konnte nicht gespeichert werden.");
            }
        };

        const resetShuffleOrder = () => {
            const indexes = state.playlist.map((_, index) => index);
            for (let index = indexes.length - 1; index > 0; index -= 1) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [indexes[index], indexes[randomIndex]] =
                    [indexes[randomIndex], indexes[index]];
            }

            const currentPosition = indexes.indexOf(state.currentIndex);
            if (currentPosition > 0) {
                [indexes[0], indexes[currentPosition]] =
                    [indexes[currentPosition], indexes[0]];
            }
            state.shuffleOrder = indexes;
            state.shufflePosition = 0;
        };

        const stopPlayback = () => {
            playbackRunId += 1;
            state.playing = false;
            stopSpeech();
            notify();
        };

        const advance = () => {
            if (state.playlist.length === 0) {
                return false;
            }

            if (!state.shuffle) {
                const isLast = state.currentIndex >= state.playlist.length - 1;
                if (isLast && !state.loop) {
                    return false;
                }
                state.currentIndex = isLast ? 0 : state.currentIndex + 1;
                return true;
            }

            if (
                state.shuffleOrder.length !== state.playlist.length ||
                state.shuffleOrder[state.shufflePosition] !== state.currentIndex
            ) {
                resetShuffleOrder();
            }

            if (state.shufflePosition >= state.shuffleOrder.length - 1) {
                if (!state.loop) {
                    return false;
                }
                resetShuffleOrder();
                state.shufflePosition = state.shuffleOrder.length > 1 ? 1 : 0;
            } else {
                state.shufflePosition += 1;
            }
            state.currentIndex = state.shuffleOrder[state.shufflePosition];
            return true;
        };

        const speakCurrent = () => {
            if (!state.playing || state.playlist.length === 0) {
                return;
            }

            const entry = state.playlist[state.currentIndex];
            const resolvedEntry = resolveEntry(getEntryId(entry));
            if (!resolvedEntry) {
                setStatus("Ein Satz in der Playlist konnte nicht gefunden werden.");
                stopPlayback();
                return;
            }

            const currentRunId = ++playbackRunId;
            onCurrentChange?.(resolvedEntry, state);
            const finish = () => {
                if (currentRunId !== playbackRunId || !state.playing) {
                    return;
                }
                if (!advance()) {
                    state.playing = false;
                    notify();
                    setStatus("Playlist beendet.");
                    return;
                }
                save();
                notify();
                speakCurrent();
            };
            const fail = () => {
                if (currentRunId !== playbackRunId) {
                    return;
                }
                state.playing = false;
                notify();
                setStatus("Audio konnte nicht abgespielt werden.");
            };
            const audio = getEntryAudio?.(resolvedEntry);

            if (audio?.type === "url" && typeof audio.src === "string" && audio.src.trim()) {
                const nativeAudio = new Audio(audio.src);
                nativeAudio.playbackRate = state.playbackRate;
                activeNativeAudio = nativeAudio;
                nativeAudio.addEventListener("ended", () => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    finish();
                }, { once: true });
                nativeAudio.addEventListener("error", () => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    fail();
                }, { once: true });
                nativeAudio.play().catch(() => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    fail();
                });
                return;
            }

            const text = getEntryText(resolvedEntry);
            if (!speakText(text, null, {
                rate: state.playbackRate,
                lang: audio?.lang || "th-TH",
                onEnd: finish,
                onError: fail
            })) {
                fail();
            }
        };

        const renderAfterMutation = message => {
            save();
            notify();
            if (message) {
                setStatus(message);
            }
        };

        const add = entry => {
            const id = getEntryId(entry);
            if (typeof id !== "string" || state.playlist.some(item => getEntryId(item) === id)) {
                return false;
            }
            state.playlist.push(entry);
            if (state.playlist.length === 1) {
                state.currentIndex = 0;
            }
            renderAfterMutation("Satz zur Playlist hinzugefügt.");
            return true;
        };

        const addMany = entries => {
            let added = 0;
            const ids = new Set(state.playlist.map(getEntryId));
            entries.forEach(entry => {
                const id = getEntryId(entry);
                if (typeof id !== "string" || ids.has(id)) {
                    return;
                }
                ids.add(id);
                state.playlist.push(entry);
                added += 1;
            });
            if (state.playlist.length > 0 && !Number.isInteger(state.currentIndex)) {
                state.currentIndex = 0;
            }
            renderAfterMutation(
                added > 0 ? `${added} Sätze zur Playlist hinzugefügt.` : "Alle Sätze sind bereits in der Playlist."
            );
            return added;
        };

        const remove = index => {
            if (!Number.isInteger(index) || index < 0 || index >= state.playlist.length) {
                return false;
            }
            if (state.playing && index === state.currentIndex) {
                stopPlayback();
            }
            state.playlist.splice(index, 1);
            if (state.currentIndex > index) {
                state.currentIndex -= 1;
            }
            state.currentIndex = Math.min(
                state.currentIndex,
                Math.max(0, state.playlist.length - 1)
            );
            renderAfterMutation();
            return true;
        };

        const move = (fromIndex, toIndex) => {
            if (
                !Number.isInteger(fromIndex) ||
                !Number.isInteger(toIndex) ||
                fromIndex < 0 ||
                fromIndex >= state.playlist.length ||
                toIndex < 0 ||
                toIndex >= state.playlist.length ||
                fromIndex === toIndex
            ) {
                return false;
            }
            const [entry] = state.playlist.splice(fromIndex, 1);
            state.playlist.splice(toIndex, 0, entry);
            if (state.currentIndex === fromIndex) {
                state.currentIndex = toIndex;
            } else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
                state.currentIndex -= 1;
            } else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) {
                state.currentIndex += 1;
            }
            if (state.shuffle) {
                resetShuffleOrder();
            }
            renderAfterMutation();
            return true;
        };

        const clear = () => {
            stopPlayback();
            state.playlist = [];
            state.currentIndex = 0;
            renderAfterMutation("Playlist geleert.");
        };

        const togglePlayback = () => {
            if (state.playlist.length === 0) {
                return;
            }
            if (state.playing) {
                stopPlayback();
                return;
            }
            if (state.shuffle) {
                resetShuffleOrder();
            }
            state.playing = true;
            setStatus("");
            notify();
            speakCurrent();
        };

        const moveCurrent = offset => {
            if (state.playlist.length === 0) {
                return;
            }
            stopPlayback();
            const length = state.playlist.length;
            state.currentIndex = (state.currentIndex + offset + length) % length;
            if (state.shuffle) {
                resetShuffleOrder();
            }
            renderAfterMutation();
        };

        const select = (index, autoplay = false) => {
            if (!Number.isInteger(index) || index < 0 || index >= state.playlist.length) {
                return false;
            }
            stopPlayback();
            state.currentIndex = index;
            renderAfterMutation();
            if (autoplay) {
                state.playing = true;
                speakCurrent();
            }
            return true;
        };

        const load = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                const stored = raw ? JSON.parse(raw) : {};
                const ids = Array.isArray(stored.playlist) ? stored.playlist : [];
                state.playlist = ids
                    .map(id => resolveEntry(id))
                    .filter(Boolean);
                state.currentIndex = Math.min(
                    Number.isInteger(stored.currentIndex) ? stored.currentIndex : 0,
                    Math.max(0, state.playlist.length - 1)
                );
                state.loop = stored.loop !== false;
                state.shuffle = stored.shuffle === true;
                state.playbackRate = clampRate(stored.playbackRate);
            } catch (error) {
                console.warn("Audio-Playlist konnte nicht geladen werden.", error);
                setStatus("Die gespeicherte Audio-Playlist konnte nicht geladen werden.");
            }
            notify();
        };

        return {
            state,
            load,
            add,
            addMany,
            remove,
            move,
            clear,
            togglePlayback,
            pause: stopPlayback,
            next: () => moveCurrent(1),
            previous: () => moveCurrent(-1),
            select,
            setLoop(value) {
                state.loop = Boolean(value);
                renderAfterMutation();
            },
            setShuffle(value) {
                state.shuffle = Boolean(value);
                if (state.shuffle) {
                    resetShuffleOrder();
                } else {
                    state.shuffleOrder = [];
                    state.shufflePosition = 0;
                }
                renderAfterMutation();
            },
            setPlaybackRate(value) {
                state.playbackRate = clampRate(value);
                if (state.playing) {
                    stopPlayback();
                    state.playing = true;
                    notify();
                    speakCurrent();
                } else {
                    notify();
                }
                save();
            },
            playCurrent: speakCurrent
        };
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
                data-audio-source="${source}"
                data-content-mode="${contentMode}"
                data-quest-number="${Number(questNumber)}">
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
                    window.dispatchEvent(
                        new CustomEvent("questaudio:ended", {
                            detail: {
                            source: audio.currentSrc || audio.src,
                            contentMode: playerElement.dataset.contentMode,
                            questNumber: playerElement.dataset.questNumber
                            }
                        })
                    );
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

    function renderSentenceAudioPlayer({
        audio = null,
        text = "",
        className = ""
    } = {}) {
        if (audio?.type === "url" && typeof audio.src === "string" && audio.src.trim()) {
            return `
                <div class="quest-audio-player ${className}" data-quest-audio-player data-audio-source="${escapeAttribute(audio.src)}">
                    <button type="button" class="quest-audio-play-button" aria-label="Satzaudio abspielen" aria-pressed="false">
                        <span aria-hidden="true">▶</span>
                    </button>
                    <span class="quest-audio-status" aria-live="polite"></span>
                    <audio class="quest-audio-native" preload="none" src="${escapeAttribute(audio.src)}"></audio>
                </div>
            `;
        }

        if (audio?.type === "none") {
            return "";
        }

        if (typeof text !== "string" || text.trim() === "") {
            return "";
        }

        return `
            <div class="quest-audio-player ${className}" data-speech-audio-player data-speech-text="${encodeURIComponent(text)}">
                <button type="button" class="quest-audio-play-button" aria-label="Satz vorlesen" aria-pressed="false">🔊</button>
                <span class="quest-audio-status" aria-live="polite"></span>
            </div>
        `;
    }

    function initializeSpeechAudioPlayers(container = document) {
        container.querySelectorAll("[data-speech-audio-player]").forEach(playerElement => {
            if (playerElement.dataset.audioInitialized === "true") {
                return;
            }

            const button = playerElement.querySelector(".quest-audio-play-button");
            const status = playerElement.querySelector(".quest-audio-status");
            const text = decodeURIComponent(playerElement.dataset.speechText || "");

            if (!button || !text) {
                return;
            }

            button.addEventListener("click", event => {
                event.stopPropagation();
                const started = speakText(text, button);
                if (!started && status) {
                    status.textContent = "Sprachausgabe nicht verfügbar.";
                }
            });

            playerElement.dataset.audioInitialized = "true";
        });
    }

    function initializeSentenceAudioPlayers(container = document) {
        initializeQuestAudioPlayers(container);
        initializeSpeechAudioPlayers(container);
    }

    window.questAudio = {
        getQuestAudioSource,
        initializeQuestAudioPlayers,
        initializeSentenceAudioPlayers,
        renderQuestAudioPlayer,
        renderSentenceAudioPlayer,
        createPlaylistPlayer,
        speakText,
        stopSpeech
    };

})();
