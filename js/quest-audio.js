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
            activeNativeAudio.onended = null;
            activeNativeAudio.onerror = null;
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

    function stopNativeAudioPlayers() {
        activePlayers.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        activePlayers.clear();
    }

    function getSpeechVoices(language = "") {
        if (!("speechSynthesis" in window)) {
            return [];
        }

        const requestedLanguage = String(language || "").toLowerCase();
        const languageCode = requestedLanguage.split("-")[0];
        const voices = window.speechSynthesis.getVoices();
        if (!requestedLanguage) {
            return voices;
        }
        return voices.filter(voice => {
                const voiceLanguage = String(voice.lang || "").toLowerCase();
                return voiceLanguage === requestedLanguage ||
                    voiceLanguage.split("-")[0] === languageCode;
            });
    }

    function getSpeechVoice(language, voiceId = "") {
        const voices = getSpeechVoices(language);
        if (voiceId) {
            const exactVoice = voices.find(voice =>
                voice.voiceURI === voiceId || voice.name === voiceId
            );
            if (exactVoice) {
                return exactVoice;
            }
        }
        return voices[0] || null;
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

        if (
            button &&
            activeSpeech?.button === button &&
            activeSpeech?.text === text
        ) {
            stopSpeech();
            return true;
        }

        stopSpeech();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || "th-TH";
        const voice = options.voice ||
            getSpeechVoice(utterance.lang, options.voiceId || options.voiceName);
        if (
            options.requireVoice &&
            getSpeechVoices("").length > 0 &&
            !voice
        ) {
            return false;
        }
        if (voice) {
            utterance.voice = voice;
        }
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
            window.dispatchEvent(new CustomEvent("questaudio:ended", {
                detail: {
                    source: "speechSynthesis",
                    contentMode: options.contentMode || "",
                    questNumber: options.questNumber || "",
                    sentenceId: options.sentenceId || ""
                }
            }));
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
        const preloadedAudio = new Map();

        const preloadEntry = entry => {
            const resolvedEntry = resolveEntry(getEntryId(entry));
            const audio = resolvedEntry ? getEntryAudio?.(resolvedEntry) : null;
            if (
                audio?.type !== "url" ||
                typeof audio.src !== "string" ||
                !audio.src.trim()
            ) {
                return;
            }

            const entryId = getEntryId(entry);
            const cached = preloadedAudio.get(entryId);
            if (cached?.src === audio.src && !cached.element.error) {
                return;
            }

            if (cached) {
                cached.element.onended = null;
                cached.element.onerror = null;
                cached.element.pause();
            }

            const element = new Audio();
            element.preload = "auto";
            element.src = audio.src;
            element.load();
            preloadedAudio.set(entryId, { src: audio.src, element });
        };

        const preloadPlaylist = () => {
            const playlistIds = new Set(state.playlist.map(getEntryId));
            preloadedAudio.forEach((cached, entryId) => {
                if (playlistIds.has(entryId)) {
                    return;
                }
                cached.element.onended = null;
                cached.element.onerror = null;
                cached.element.pause();
                cached.element.removeAttribute("src");
                cached.element.load();
                preloadedAudio.delete(entryId);
            });
            state.playlist.forEach(preloadEntry);
        };

        const clearPreloadedAudio = () => {
            preloadedAudio.forEach(cached => {
                cached.element.onended = null;
                cached.element.onerror = null;
                cached.element.pause();
                cached.element.removeAttribute("src");
                cached.element.load();
            });
            preloadedAudio.clear();
        };

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
            const speechVoice = audio?.type === "speechSynthesis"
                ? getSpeechVoice(audio.lang || "th-TH", audio.voiceId || audio.voiceName)
                : null;

            if (audio?.type === "url" && typeof audio.src === "string" && audio.src.trim()) {
                preloadEntry(entry);
                const cached = preloadedAudio.get(getEntryId(entry));
                const nativeAudio = cached?.src === audio.src
                    ? cached.element
                    : new Audio(audio.src);
                nativeAudio.preload = "auto";
                nativeAudio.playbackRate = state.playbackRate;
                nativeAudio.currentTime = 0;
                activeNativeAudio = nativeAudio;
                nativeAudio.onended = () => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    nativeAudio.onended = null;
                    nativeAudio.onerror = null;
                    finish();
                };
                nativeAudio.onerror = () => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    nativeAudio.onended = null;
                    nativeAudio.onerror = null;
                    fail();
                };
                if (!cached || cached.src !== audio.src) {
                    nativeAudio.load();
                }
                nativeAudio.play().catch(() => {
                    if (activeNativeAudio === nativeAudio) {
                        activeNativeAudio = null;
                    }
                    nativeAudio.onended = null;
                    nativeAudio.onerror = null;
                    fail();
                });
                return;
            }

            const text = getEntryText(resolvedEntry);
            if (!speakText(text, null, {
                rate: state.playbackRate,
                lang: audio?.lang || "th-TH",
                voiceId: audio?.voiceId || audio?.voiceName || "",
                requireVoice: audio?.requireVoice === true,
                voice: speechVoice,
                contentMode: resolvedEntry.contentMode || "",
                sentenceId: getEntryId(resolvedEntry),
                onEnd: finish,
                onError: fail
            })) {
                fail();
            }
        };

        const renderAfterMutation = message => {
            save();
            notify();
            preloadPlaylist();
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
            clearPreloadedAudio();
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
            preloadPlaylist();
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
                    preloadPlaylist();
                    speakCurrent();
                } else {
                    notify();
                }
                save();
                preloadPlaylist();
            },
            preload: preloadPlaylist,
            playCurrent: speakCurrent
        };
    }

    function initializeFloatingPlayerMenu({
        player,
        toggle,
        positionStorageKey,
        sizeStorageKey,
        collapsedClass = "is-desktop-collapsed",
        breakpoint = 901
    } = {}) {
        if (!player || !toggle || typeof positionStorageKey !== "string" || typeof sizeStorageKey !== "string") {
            return;
        }

        const isDesktopLayout = () =>
            window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
        let menuPosition = null;
        let menuSize = null;

        const readPosition = () => {
            try {
                const rawPosition = localStorage.getItem(positionStorageKey);
                const position = rawPosition ? JSON.parse(rawPosition) : {};
                return {
                    left: Number.isFinite(position.left) ? position.left : null,
                    top: Number.isFinite(position.top) ? position.top : 100,
                    playerLeft: Number.isFinite(position.playerLeft)
                        ? position.playerLeft
                        : null
                };
            } catch (error) {
                console.warn("Die Position des Audio-Player-Menüs konnte nicht gelesen werden.", error);
                return { left: null, top: 100, playerLeft: null };
            }
        };

        const savePosition = () => {
            if (!menuPosition) {
                return;
            }

            try {
                localStorage.setItem(positionStorageKey, JSON.stringify(menuPosition));
            } catch (error) {
                console.warn("Die Position des Audio-Player-Menüs konnte nicht gespeichert werden.", error);
            }
        };

        const readSize = () => {
            try {
                const rawSize = localStorage.getItem(sizeStorageKey);
                const size = rawSize ? JSON.parse(rawSize) : {};
                const maxHeight = Math.max(260, window.innerHeight - 48);
                return {
                    width: Number.isFinite(size.width)
                        ? Math.max(280, Math.min(560, size.width))
                        : 320,
                    height: Number.isFinite(size.height)
                        ? Math.max(260, Math.min(maxHeight, size.height))
                        : 445
                };
            } catch (error) {
                console.warn("Die Größe des Audio-Player-Menüs konnte nicht gelesen werden.", error);
                return { width: 320, height: 445 };
            }
        };

        const saveSize = () => {
            if (!menuSize) {
                return;
            }

            try {
                localStorage.setItem(sizeStorageKey, JSON.stringify(menuSize));
            } catch (error) {
                console.warn("Die Größe des Audio-Player-Menüs konnte nicht gespeichert werden.", error);
            }
        };

        const applySize = () => {
            if (!isDesktopLayout()) {
                player.style.removeProperty("width");
                player.style.removeProperty("height");
                return;
            }

            menuSize = menuSize || readSize();
            player.style.width = `${menuSize.width}px`;
            player.style.height = `${menuSize.height}px`;
        };

        const applyPosition = () => {
            if (!isDesktopLayout()) {
                applySize();
                player.classList.remove(collapsedClass);
                toggle.style.removeProperty("left");
                toggle.style.removeProperty("top");
                toggle.style.removeProperty("right");
                player.style.removeProperty("left");
                player.style.removeProperty("top");
                player.style.removeProperty("right");
                player.style.removeProperty("transform");
                return;
            }

            menuPosition = menuPosition || readPosition();
            applySize();
            const toggleWidth = toggle.offsetWidth || 36;
            const toggleHeight = toggle.offsetHeight || 36;
            const playerWidth = menuSize.width;
            const defaultToggleLeft =
                window.innerWidth - 12 - playerWidth + (playerWidth - toggleWidth) / 2;
            const left = Number.isFinite(menuPosition.left)
                ? menuPosition.left
                : defaultToggleLeft;
            const boundedLeft = Math.max(
                12,
                Math.min(window.innerWidth - toggleWidth - 12, left)
            );
            const boundedTop = Math.max(
                12,
                Math.min(window.innerHeight - toggleHeight - 12, menuPosition.top)
            );
            const defaultPlayerLeft = boundedLeft - (playerWidth - toggleWidth) / 2;
            const playerLeft = Number.isFinite(menuPosition.playerLeft)
                ? menuPosition.playerLeft
                : defaultPlayerLeft;
            const maxPlayerLeft = Math.max(12, window.innerWidth - playerWidth - 12);
            const boundedPlayerLeft = Math.max(
                12,
                Math.min(maxPlayerLeft, playerLeft)
            );

            menuPosition.left = boundedLeft;
            menuPosition.top = boundedTop;
            menuPosition.playerLeft = boundedPlayerLeft;
            toggle.style.left = `${boundedLeft}px`;
            toggle.style.top = `${boundedTop}px`;
            toggle.style.right = "auto";
            player.style.left = `${boundedPlayerLeft}px`;
            player.style.top = `${boundedTop + toggleHeight + 8}px`;
            player.style.right = "auto";
            player.style.transform = "none";
            savePosition();
        };

        menuPosition = readPosition();
        menuSize = readSize();
        player.classList.add(collapsedClass);
        applySize();
        applyPosition();

        let playerResizeObserver = null;
        const observePlayerSize = () => {
            if (playerResizeObserver || !window.ResizeObserver) {
                return;
            }

            playerResizeObserver = new ResizeObserver(entries => {
                if (!isDesktopLayout() || !entries[0]) {
                    return;
                }

                const rect = player.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) {
                    return;
                }

                menuSize.width = Math.max(280, Math.min(560, rect.width));
                menuSize.height = Math.max(
                    260,
                    Math.min(Math.max(260, window.innerHeight - 48), rect.height)
                );
                menuPosition.playerLeft = rect.left;
                applySize();
                saveSize();
                savePosition();
            });
            playerResizeObserver.observe(player);
        };

        toggle.addEventListener("click", () => {
            if (toggle.dataset.dragged === "true") {
                delete toggle.dataset.dragged;
                return;
            }

            const isOpen = !player.classList.contains(collapsedClass);
            player.classList.toggle(collapsedClass, isOpen);
            if (!isOpen) {
                observePlayerSize();
            }
            toggle.setAttribute("aria-expanded", String(!isOpen));
            toggle.setAttribute(
                "aria-label",
                isOpen ? "Audio-Player öffnen" : "Audio-Player schließen"
            );
        });

        toggle.addEventListener("pointerdown", event => {
            if (!isDesktopLayout() || event.button !== 0) {
                return;
            }

            const toggleRect = toggle.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();
            const initialPlayerLeft = playerRect.width > 0
                ? playerRect.left
                : menuPosition.playerLeft ??
                    toggleRect.left - (menuSize.width - toggleRect.width) / 2;
            const offsetX = event.clientX - toggleRect.left;
            const offsetY = event.clientY - toggleRect.top;
            let moved = false;
            toggle.setPointerCapture(event.pointerId);

            const moveToggle = moveEvent => {
                const nextLeft = Math.max(
                    12,
                    Math.min(window.innerWidth - toggleRect.width - 12, moveEvent.clientX - offsetX)
                );
                const nextTop = Math.max(
                    12,
                    Math.min(window.innerHeight - toggleRect.height - 12, moveEvent.clientY - offsetY)
                );
                if (
                    Math.abs(nextLeft - toggleRect.left) > 3 ||
                    Math.abs(nextTop - toggleRect.top) > 3
                ) {
                    moved = true;
                }
                menuPosition.left = nextLeft;
                menuPosition.top = nextTop;
                menuPosition.playerLeft = initialPlayerLeft + nextLeft - toggleRect.left;
                applyPosition();
            };
            const stopMoving = stopEvent => {
                if (toggle.hasPointerCapture(stopEvent.pointerId)) {
                    toggle.releasePointerCapture(stopEvent.pointerId);
                }
                toggle.removeEventListener("pointermove", moveToggle);
                toggle.removeEventListener("pointerup", stopMoving);
                toggle.removeEventListener("pointercancel", stopMoving);
                if (moved) {
                    toggle.dataset.dragged = "true";
                    savePosition();
                }
            };

            toggle.addEventListener("pointermove", moveToggle);
            toggle.addEventListener("pointerup", stopMoving);
            toggle.addEventListener("pointercancel", stopMoving);
        });

        window.addEventListener("resize", applyPosition);
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

                if (!audio || !playButton) {
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

                const fixedRate = Number(playerElement.dataset.playbackRate);
                const playbackRate = Number.isFinite(fixedRate)
                    ? fixedRate
                    : getStoredPlaybackRate();
                if (speedSlider && speedValue) {
                    speedSlider.value = String(playbackRate);
                    speedValue.value = formatPlaybackRate(playbackRate);
                    speedValue.textContent = formatPlaybackRate(playbackRate);
                }
                audio.playbackRate = playbackRate;

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

                if (speedSlider && speedValue) {
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
                }

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
        className = "",
        playbackRate = null
    } = {}) {
        if (audio?.type === "url" && typeof audio.src === "string" && audio.src.trim()) {
            const fixedRate = Number(playbackRate);
            const playbackRateAttribute = Number.isFinite(fixedRate)
                ? ` data-playback-rate="${fixedRate}"`
                : "";
            return `
                <div class="quest-audio-player ${className}" data-quest-audio-player${playbackRateAttribute} data-audio-source="${escapeAttribute(audio.src)}">
                    <button type="button" class="quest-audio-play-button" aria-label="Satzaudio abspielen" aria-pressed="false">
                        <span aria-hidden="true">▶</span>
                    </button>
                    <span class="quest-audio-status" aria-live="polite"></span>
                    <audio class="quest-audio-native" preload="auto" src="${escapeAttribute(audio.src)}"></audio>
                </div>
            `;
        }

        if (audio?.type === "none") {
            return "";
        }

        const speechText = typeof audio?.text === "string" && audio.text.trim()
            ? audio.text
            : text;
        if (typeof speechText !== "string" || speechText.trim() === "") {
            return "";
        }

        return `
            <div class="quest-audio-player ${className}" data-speech-audio-player data-speech-text="${encodeURIComponent(speechText)}" data-speech-lang="${escapeAttribute(audio?.lang || "th-TH")}" data-speech-voice-id="${escapeAttribute(audio?.voiceId || audio?.voiceName || "")}" data-speech-require-voice="${audio?.requireVoice ? "true" : "false"}">
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
                const started = speakText(text, button, {
                    rate: 1,
                    lang: playerElement.dataset.speechLang || "th-TH",
                    voiceId: playerElement.dataset.speechVoiceId || "",
                    requireVoice: playerElement.dataset.speechRequireVoice === "true"
                });
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
        initializeFloatingPlayerMenu,
        getSpeechVoices,
        speakText,
        stopSpeech,
        stopNativeAudioPlayers
    };

})();
