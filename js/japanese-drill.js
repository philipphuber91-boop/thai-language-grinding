(function () {
    "use strict";

    const STORAGE_KEY = "japaneseGigaDrill:v1";
    const DEFAULT_PLAYBACK_RATE = 0.85;
    const MIN_PLAYBACK_RATE = 0.5;
    const MAX_PLAYBACK_RATE = 1.5;
    const bosses = Array.isArray(window.japaneseGrammarBosses)
        ? window.japaneseGrammarBosses
        : [];

    const elements = {
        sidebar: document.getElementById("japaneseSidebar"),
        sidebarBackdrop: document.getElementById("japaneseSidebarBackdrop"),
        sidebarToggle: document.getElementById("japaneseSidebarToggle"),
        chapterNav: document.getElementById("japaneseChapterNav"),
        foreword: document.getElementById("japaneseForeword"),
        forewordButton: document.getElementById("japaneseForewordButton"),
        player: document.getElementById("japanesePlayer"),
        reader: document.getElementById("japaneseReader"),
        bossEyebrow: document.getElementById("japaneseBossEyebrow"),
        bossTitle: document.getElementById("japaneseBossTitle"),
        bossDescription: document.getElementById("japaneseBossDescription"),
        introduction: document.getElementById("japaneseIntroduction"),
        sentenceCount: document.getElementById("japaneseSentenceCount"),
        resumeButton: document.getElementById("japaneseResumeButton"),
        pattern: document.getElementById("japanesePattern"),
        patternRomaji: document.getElementById("japanesePatternRomaji"),
        patternTranslation: document.getElementById("japanesePatternTranslation"),
        playlistCount: document.getElementById("japanesePlaylistCount"),
        playerNowPlaying: document.getElementById("japanesePlayerNowPlaying"),
        playerPrevious: document.getElementById("japanesePlayerPrevious"),
        playerPlayPause: document.getElementById("japanesePlayerPlayPause"),
        playerNext: document.getElementById("japanesePlayerNext"),
        playerLoop: document.getElementById("japanesePlayerLoop"),
        playerShuffle: document.getElementById("japanesePlayerShuffle"),
        playerSpeed: document.getElementById("japanesePlayerSpeed"),
        playerSpeedValue: document.getElementById("japanesePlayerSpeedValue"),
        addAllButton: document.getElementById("japaneseAddAllButton"),
        clearPlaylistButton: document.getElementById("japaneseClearPlaylistButton"),
        playlist: document.getElementById("japanesePlaylist"),
        blockList: document.getElementById("japaneseBlockList"),
        audioStatus: document.getElementById("japaneseAudioStatus")
    };

    let currentBoss = null;
    let activeAudioButton = null;
    let speechRunId = 0;
    let draggedPlaylistIndex = null;
    const playerState = {
        playlist: [],
        currentIndex: 0,
        loop: true,
        shuffle: false,
        shuffleOrder: [],
        shufflePosition: 0,
        playbackRate: DEFAULT_PLAYBACK_RATE,
        playing: false
    };

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizePlaybackRate(value) {
        const rate = Number(value);
        if (!Number.isFinite(rate)) {
            return DEFAULT_PLAYBACK_RATE;
        }
        return Math.min(MAX_PLAYBACK_RATE, Math.max(MIN_PLAYBACK_RATE, rate));
    }

    function formatPlaybackRate(rate) {
        return `${normalizePlaybackRate(rate).toFixed(2).replace(".", ",")}×`;
    }

    function readProgress() {
        try {
            const rawProgress = localStorage.getItem(STORAGE_KEY);
            const progress = rawProgress ? JSON.parse(rawProgress) : {};

            return {
                bossId: typeof progress.bossId === "string" ? progress.bossId : "",
                sentenceNumber: Number.isInteger(progress.sentenceNumber)
                    ? progress.sentenceNumber
                    : 1,
                playlist: Array.isArray(progress.playlist)
                    ? progress.playlist.filter(item =>
                        item &&
                        typeof item.bossId === "string" &&
                        typeof item.sentenceId === "string"
                    )
                    : [],
                playlistIndex: Number.isInteger(progress.playlistIndex)
                    ? Math.max(0, progress.playlistIndex)
                    : 0,
                loop: progress.loop !== false,
                shuffle: progress.shuffle === true,
                playbackRate: normalizePlaybackRate(progress.playbackRate)
            };
        } catch (error) {
            console.warn("Japanischer Lesefortschritt konnte nicht gelesen werden.", error);
            setAudioStatus("Der lokale japanische Lesefortschritt ist nicht verfügbar.");
            return {
                bossId: "",
                sentenceNumber: 1,
                playlist: [],
                playlistIndex: 0,
                loop: true,
                shuffle: false,
                playbackRate: DEFAULT_PLAYBACK_RATE
            };
        }
    }

    function saveProgress(bossId, sentenceNumber) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    ...readProgress(),
                    bossId,
                    sentenceNumber
                })
            );
        } catch (error) {
            console.warn("Japanischer Lesefortschritt konnte nicht gespeichert werden.", error);
            setAudioStatus("Der lokale japanische Lesefortschritt konnte nicht gespeichert werden.");
        }
    }

    function setAudioStatus(message) {
        if (elements.audioStatus) {
            elements.audioStatus.textContent = message;
        }
    }

    function closeSidebar() {
        elements.sidebar?.classList.remove("is-open");
        elements.sidebarBackdrop?.classList.remove("is-visible");
        elements.sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    function openSidebar() {
        elements.sidebar?.classList.add("is-open");
        elements.sidebarBackdrop?.classList.add("is-visible");
        elements.sidebarToggle?.setAttribute("aria-expanded", "true");
    }

    function setJapaneseView(view, shouldScroll) {
        const isForeword = view === "foreword";
        elements.player.hidden = isForeword;
        elements.reader.hidden = isForeword;
        elements.foreword.hidden = !isForeword;
        elements.forewordButton.classList.toggle("is-active", isForeword);
        elements.forewordButton.setAttribute("aria-pressed", String(isForeword));

        if (shouldScroll) {
            (isForeword ? elements.foreword : elements.reader)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function showForeword() {
        setJapaneseView("foreword", true);
        closeSidebar();
    }

    function resetAudioButton() {
        if (!activeAudioButton) {
            return;
        }

        activeAudioButton.classList.remove("is-speaking");
        activeAudioButton.textContent = "🔊";
        activeAudioButton.setAttribute(
            "aria-label",
            activeAudioButton.dataset.audioLabel || "Satz vorlesen"
        );
        activeAudioButton = null;
    }

    function stopSpeaking() {
        speechRunId += 1;
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        resetAudioButton();
    }

    function savePlayerState() {
        try {
            const progress = readProgress();
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    ...progress,
                    playlist: playerState.playlist,
                    playlistIndex: playerState.currentIndex,
                    loop: playerState.loop,
                    shuffle: playerState.shuffle,
                    playbackRate: playerState.playbackRate
                })
            );
        } catch (error) {
            console.warn("Japanische Playlist konnte nicht gespeichert werden.", error);
            setAudioStatus("Die japanische Playlist konnte nicht gespeichert werden.");
        }
    }

    function findSentenceInBoss(boss, sentenceId) {
        return boss?.sentences.find(sentence => sentence.id === sentenceId) || null;
    }

    function findPlaylistEntry(entry) {
        const boss = bosses.find(candidate => candidate.id === entry.bossId);
        const sentence = findSentenceInBoss(boss, entry.sentenceId);

        return boss && sentence ? { boss, sentence } : null;
    }

    function getBossShortLabel(boss) {
        if (Number.isInteger(boss?.bossNumber)) {
            return `#${boss.bossNumber}`;
        }

        const titleMatch = String(boss?.title || "").match(/#\d+/);
        return titleMatch ? titleMatch[0] : "Boss";
    }

    function playlistContains(sentenceId) {
        return playerState.playlist.some(entry =>
            entry.bossId === currentBoss?.id &&
            entry.sentenceId === sentenceId
        );
    }

    function getLevelSentences(levelId) {
        return currentBoss?.sentences.filter(sentence => sentence.levelId === levelId) || [];
    }

    function isLevelInPlaylist(levelId) {
        const levelSentences = getLevelSentences(levelId);
        return levelSentences.length > 0 &&
            levelSentences.every(sentence => playlistContains(sentence.id));
    }

    function updatePlaylistButtons() {
        elements.blockList.querySelectorAll("[data-playlist-sentence-id]").forEach(button => {
            const isAdded = playlistContains(button.dataset.playlistSentenceId);
            button.classList.toggle("is-added", isAdded);
            button.textContent = isAdded ? "− Playlist" : "+ Playlist";
            button.setAttribute(
                "aria-label",
                isAdded ? "Satz aus Playlist entfernen" : "Satz zur Playlist hinzufügen"
            );
            button.title = isAdded
                ? "Satz aus Playlist entfernen"
                : "Satz zur Playlist hinzufügen";
        });

        elements.blockList.querySelectorAll("[data-playlist-level-id]").forEach(button => {
            const isAdded = isLevelInPlaylist(button.dataset.playlistLevelId);
            button.classList.toggle("is-added", isAdded);
            button.textContent = isAdded
                ? "✓ Level in Playlist"
                : "+ Level zur Playlist";
            button.setAttribute(
                "aria-label",
                isAdded
                    ? "Alle Sätze dieses Levels sind in der Playlist"
                    : "Alle Sätze dieses Levels zur Playlist hinzufügen"
            );
            button.title = isAdded
                ? "Alle Sätze dieses Levels sind bereits in der Playlist"
                : "Alle Sätze dieses Levels zur Playlist hinzufügen";
        });
    }

    function renderPlaylist() {
        const validEntries = playerState.playlist.filter(entry => findPlaylistEntry(entry));
        if (validEntries.length !== playerState.playlist.length) {
            playerState.playlist = validEntries;
            playerState.currentIndex = Math.min(
                playerState.currentIndex,
                Math.max(0, validEntries.length - 1)
            );
            savePlayerState();
        }

        elements.playlist.innerHTML = playerState.playlist.length === 0
            ? "<li class=\"japanese-playlist-empty\">Noch keine Sätze ausgewählt.</li>"
            : (() => {
                return playerState.playlist.map((entry, index) => {
                const item = findPlaylistEntry(entry);
                return `
                    <li
                        class="japanese-playlist-item ${index === playerState.currentIndex ? "is-current" : ""}"
                        data-playlist-index="${index}"
                        draggable="true">
                        <button
                            class="japanese-playlist-select"
                            type="button"
                            data-playlist-index="${index}">
                            <span class="japanese-playlist-card-number">
                                <strong>${item.sentence.number}</strong>
                                <small>${escapeHtml(getBossShortLabel(item.boss))}</small>
                            </span>
                            <span>
                                <strong lang="ja">${escapeHtml(item.sentence.japanese)}</strong>
                                <small class="japanese-playlist-romaji">${escapeHtml(item.sentence.romaji)}</small>
                                <small class="japanese-playlist-translation">${escapeHtml(item.sentence.translation)}</small>
                            </span>
                        </button>
                        <button
                            class="japanese-playlist-remove"
                            type="button"
                            data-remove-playlist-index="${index}"
                            aria-label="Satz aus Playlist entfernen">×</button>
                    </li>
                `;
                }).join("");
            })();

        elements.playlist.querySelectorAll(".japanese-playlist-select[data-playlist-index]").forEach(button => {
            button.addEventListener("click", () => {
                playerState.currentIndex = Number(button.dataset.playlistIndex);
                savePlayerState();
                updatePlayerUi();
                if (playerState.playing) {
                    speakPlaylistEntry();
                }
            });
        });

        elements.playlist.querySelectorAll(".japanese-playlist-item").forEach(item => {
            item.addEventListener("dragstart", event => {
                draggedPlaylistIndex = Number(item.dataset.playlistIndex);
                item.classList.add("is-dragging");
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(draggedPlaylistIndex));
            });
            item.addEventListener("dragover", event => {
                if (draggedPlaylistIndex === null) {
                    return;
                }
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                item.classList.add("is-drag-over");
            });
            item.addEventListener("dragleave", () => {
                item.classList.remove("is-drag-over");
            });
            item.addEventListener("drop", event => {
                event.preventDefault();
                item.classList.remove("is-drag-over");
                if (draggedPlaylistIndex === null) {
                    return;
                }

                const targetIndex = Number(item.dataset.playlistIndex);
                const insertAfterTarget =
                    event.clientY > item.getBoundingClientRect().top + item.offsetHeight / 2;
                let insertionIndex = insertAfterTarget
                    ? targetIndex + 1
                    : targetIndex;
                if (draggedPlaylistIndex < insertionIndex) {
                    insertionIndex -= 1;
                }

                movePlaylistEntry(draggedPlaylistIndex, insertionIndex);
                draggedPlaylistIndex = null;
            });
            item.addEventListener("dragend", () => {
                draggedPlaylistIndex = null;
                item.classList.remove("is-dragging", "is-drag-over");
            });
        });

        elements.playlist.querySelectorAll("[data-remove-playlist-index]").forEach(button => {
            button.addEventListener("click", () => {
                removeFromPlaylist(Number(button.dataset.removePlaylistIndex));
            });
        });
    }

    function updatePlayerUi() {
        const playlistLength = playerState.playlist.length;
        const currentEntry = playerState.playlist[playerState.currentIndex];
        const currentItem = currentEntry ? findPlaylistEntry(currentEntry) : null;

        elements.playlistCount.textContent =
            `${playlistLength} ${playlistLength === 1 ? "Satz" : "Sätze"}`;
        elements.playerPrevious.disabled = playlistLength === 0;
        elements.playerPlayPause.disabled = playlistLength === 0;
        elements.playerNext.disabled = playlistLength === 0;
        elements.clearPlaylistButton.disabled = playlistLength === 0;
        elements.playerPlayPause.textContent =
            playerState.playing ? "⏸ Pause" : "▶ Abspielen";
        elements.playerLoop.checked = playerState.loop;
        elements.playerShuffle.checked = playerState.shuffle;
        elements.playerSpeed.value = String(playerState.playbackRate);
        elements.playerSpeedValue.textContent = formatPlaybackRate(playerState.playbackRate);

        if (currentItem) {
            elements.playerNowPlaying.textContent =
                `${playerState.currentIndex + 1}/${playlistLength}`;
        } else {
            elements.playerNowPlaying.textContent =
                "Füge Sätze über „+ Playlist“ hinzu.";
        }

        elements.playlist.querySelectorAll(".japanese-playlist-item").forEach(item => {
            item.classList.toggle(
                "is-current",
                Number(item.dataset.playlistIndex) === playerState.currentIndex
            );
        });
    }

    function focusPlaylistEntry() {
        const playlist = elements.playlist;
        const currentItem = playlist.querySelector(".japanese-playlist-item.is-current");
        if (!currentItem || playlist.scrollHeight <= playlist.clientHeight) {
            return;
        }

        const playlistRect = playlist.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();
        const targetTop = playlist.scrollTop +
            (itemRect.top - playlistRect.top) -
            (playlist.clientHeight - itemRect.height) / 2;
        const maxTop = playlist.scrollHeight - playlist.clientHeight;

        playlist.scrollTo({
            top: Math.max(0, Math.min(targetTop, maxTop)),
            behavior: "smooth"
        });
    }

    function addToPlaylist(sentenceId) {
        if (!currentBoss || playlistContains(sentenceId)) {
            return;
        }

        playerState.playlist.push({
            bossId: currentBoss.id,
            sentenceId
        });
        if (playerState.playlist.length === 1) {
            playerState.currentIndex = 0;
        }
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        updatePlaylistButtons();
        setAudioStatus("Satz zur Playlist hinzugefügt.");
    }

    function removeFromPlaylist(index) {
        if (index < 0 || index >= playerState.playlist.length) {
            return;
        }

        if (playerState.playing && index === playerState.currentIndex) {
            pausePlaylist();
        }

        playerState.playlist.splice(index, 1);
        if (playerState.currentIndex > index) {
            playerState.currentIndex -= 1;
        }
        playerState.currentIndex = Math.min(
            playerState.currentIndex,
            Math.max(0, playerState.playlist.length - 1)
        );
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        updatePlaylistButtons();
    }

    function movePlaylistEntry(fromIndex, toIndex) {
        if (
            fromIndex < 0 ||
            fromIndex >= playerState.playlist.length ||
            toIndex < 0 ||
            toIndex >= playerState.playlist.length ||
            fromIndex === toIndex
        ) {
            return;
        }

        const [entry] = playerState.playlist.splice(fromIndex, 1);
        playerState.playlist.splice(toIndex, 0, entry);

        if (playerState.currentIndex === fromIndex) {
            playerState.currentIndex = toIndex;
        } else if (fromIndex < playerState.currentIndex && toIndex >= playerState.currentIndex) {
            playerState.currentIndex -= 1;
        } else if (fromIndex > playerState.currentIndex && toIndex <= playerState.currentIndex) {
            playerState.currentIndex += 1;
        }

        if (playerState.shuffle) {
            resetShuffleOrder();
        }
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
    }

    function clearPlaylist() {
        pausePlaylist();
        playerState.playlist = [];
        playerState.currentIndex = 0;
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        updatePlaylistButtons();
        setAudioStatus("Playlist geleert.");
    }

    function addAllSentences() {
        if (!currentBoss) {
            return;
        }

        const existingIds = new Set(
            playerState.playlist
                .filter(entry => entry.bossId === currentBoss.id)
                .map(entry => entry.sentenceId)
        );
        currentBoss.sentences.forEach(sentence => {
            if (!existingIds.has(sentence.id)) {
                playerState.playlist.push({
                    bossId: currentBoss.id,
                    sentenceId: sentence.id
                });
            }
        });
        if (playerState.playlist.length > 0 && !Number.isInteger(playerState.currentIndex)) {
            playerState.currentIndex = 0;
        }
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        updatePlaylistButtons();
        setAudioStatus("Alle Sätze dieses Grammatik-Unterkapitels sind in der Playlist.");
    }

    function resetShuffleOrder() {
        const indexes = playerState.playlist.map((_, index) => index);
        for (let index = indexes.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [indexes[index], indexes[randomIndex]] =
                [indexes[randomIndex], indexes[index]];
        }

        const currentPosition = indexes.indexOf(playerState.currentIndex);
        if (currentPosition > 0) {
            [indexes[0], indexes[currentPosition]] =
                [indexes[currentPosition], indexes[0]];
        }

        playerState.shuffleOrder = indexes;
        playerState.shufflePosition = 0;
    }

    function advancePlaylistIndex() {
        if (playerState.playlist.length === 0) {
            return false;
        }

        if (!playerState.shuffle) {
            const isLastSentence =
                playerState.currentIndex >= playerState.playlist.length - 1;
            if (isLastSentence && !playerState.loop) {
                return false;
            }

            playerState.currentIndex = isLastSentence
                ? 0
                : playerState.currentIndex + 1;
            return true;
        }

        if (
            playerState.shuffleOrder.length !== playerState.playlist.length ||
            playerState.shuffleOrder[playerState.shufflePosition] !==
                playerState.currentIndex
        ) {
            resetShuffleOrder();
        }

        if (playerState.shufflePosition >= playerState.shuffleOrder.length - 1) {
            if (!playerState.loop) {
                return false;
            }

            resetShuffleOrder();
            if (playerState.shuffleOrder.length > 1) {
                playerState.shufflePosition = 1;
            }
        } else {
            playerState.shufflePosition += 1;
        }

        playerState.currentIndex =
            playerState.shuffleOrder[playerState.shufflePosition];
        return true;
    }

    function addLevelToPlaylist(levelId) {
        if (!currentBoss) {
            return;
        }

        const levelSentences = getLevelSentences(levelId);
        const existingIds = new Set(
            playerState.playlist
                .filter(entry => entry.bossId === currentBoss.id)
                .map(entry => entry.sentenceId)
        );

        levelSentences.forEach(sentence => {
            if (!existingIds.has(sentence.id)) {
                playerState.playlist.push({
                    bossId: currentBoss.id,
                    sentenceId: sentence.id
                });
            }
        });

        if (playerState.playlist.length > 0 && !Number.isInteger(playerState.currentIndex)) {
            playerState.currentIndex = 0;
        }
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        updatePlaylistButtons();
        setAudioStatus(
            `${levelSentences.length} Sätze aus diesem Level sind in der Playlist.`
        );
    }

    function markCurrentSentence(number, shouldScroll) {
        document.querySelectorAll(".japanese-sentence").forEach(sentenceElement => {
            const isCurrent = Number(sentenceElement.dataset.sentenceNumber) === number;
            sentenceElement.classList.toggle("is-current", isCurrent);

            if (isCurrent && shouldScroll) {
                sentenceElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });

        if (currentBoss) {
            saveProgress(currentBoss.id, number);
            updateResumeButton(number);
        }
    }

    function updateResumeButton(sentenceNumber) {
        const progress = readProgress();
        const canResume =
            currentBoss &&
            progress.bossId === currentBoss.id &&
            progress.sentenceNumber > 1 &&
            progress.sentenceNumber <= currentBoss.sentences.length &&
            progress.sentenceNumber !== sentenceNumber;

        elements.resumeButton.hidden = !canResume;
        if (canResume) {
            elements.resumeButton.textContent =
                `Bei Satz ${progress.sentenceNumber} fortsetzen`;
        }
    }

    function findSentence(sentenceId) {
        return currentBoss?.sentences.find(sentence => sentence.id === sentenceId);
    }

    function getSpeechVoice() {
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice =>
            voice.lang.toLowerCase().startsWith("ja")
        );

        if (japaneseVoice) {
            return { voice: japaneseVoice, usedFallback: false };
        }

        const fallbackVoice =
            voices.find(voice => voice.default) || voices[0] || null;

        return { voice: fallbackVoice, usedFallback: true };
    }

    function speakWithVoice(sentence, onEnd) {
        const speechVoice = getSpeechVoice();
        const utterance = new SpeechSynthesisUtterance(sentence.japanese);
        const currentRunId = ++speechRunId;
        utterance.rate = playerState.playbackRate;
        utterance.pitch = 1;

        if (speechVoice.voice) {
            utterance.voice = speechVoice.voice;
            utterance.lang = speechVoice.voice.lang;
        } else {
            utterance.lang = "ja-JP";
        }

        if (speechVoice.usedFallback) {
            setAudioStatus(
                "Keine japanische Stimme gefunden. Die Standardsprache des Browsers wird verwendet."
            );
        } else {
            setAudioStatus("");
        }

        utterance.onend = () => {
            if (currentRunId !== speechRunId) {
                return;
            }
            resetAudioButton();
            onEnd?.();
        };
        utterance.onerror = event => {
            if (currentRunId !== speechRunId) {
                return;
            }
            resetAudioButton();
            playerState.playing = false;
            updatePlayerUi();
            setAudioStatus(
                `Audio konnte nicht abgespielt werden (${event.error || "unbekannter Fehler"}).`
            );
        };

        window.speechSynthesis.speak(utterance);
    }

    function speakPlaylistEntry() {
        if (!playerState.playing || playerState.playlist.length === 0) {
            return;
        }

        const entry = playerState.playlist[playerState.currentIndex];
        const item = entry ? findPlaylistEntry(entry) : null;
        if (!item) {
            playerState.playing = false;
            updatePlayerUi();
            setAudioStatus("Ein Satz in der Playlist konnte nicht gefunden werden.");
            return;
        }

        markCurrentSentence(item.sentence.number, false);
        updatePlayerUi();
        focusPlaylistEntry();
        speakWithVoice(item.sentence, () => {
            if (!playerState.playing) {
                return;
            }

            if (!advancePlaylistIndex()) {
                playerState.playing = false;
                updatePlayerUi();
                setAudioStatus("Playlist beendet.");
                return;
            }

            savePlayerState();
            renderPlaylist();
            updatePlayerUi();
            speakPlaylistEntry();
        });
    }

    function pausePlaylist() {
        playerState.playing = false;
        stopSpeaking();
        updatePlayerUi();
    }

    function togglePlaylistPlayback() {
        if (playerState.playlist.length === 0) {
            return;
        }

        if (playerState.playing) {
            pausePlaylist();
            return;
        }

        if (playerState.shuffle) {
            resetShuffleOrder();
        }
        playerState.playing = true;
        setAudioStatus("");
        speakPlaylistEntry();
    }

    function movePlaylist(offset) {
        if (playerState.playlist.length === 0) {
            return;
        }

        pausePlaylist();
        const playlistLength = playerState.playlist.length;
        playerState.currentIndex =
            (playerState.currentIndex + offset + playlistLength) % playlistLength;
        if (playerState.shuffle) {
            resetShuffleOrder();
        }
        savePlayerState();
        renderPlaylist();
        updatePlayerUi();
        const item = findPlaylistEntry(playerState.playlist[playerState.currentIndex]);
        if (item) {
            markCurrentSentence(item.sentence.number, false);
            focusPlaylistEntry();
        }
    }

    function loadPlayerState() {
        const progress = readProgress();
        playerState.playlist = progress.playlist;
        playerState.currentIndex = Math.min(
            progress.playlistIndex,
            Math.max(0, playerState.playlist.length - 1)
        );
        playerState.loop = progress.loop;
        playerState.shuffle = progress.shuffle;
        playerState.playbackRate = progress.playbackRate;
        renderPlaylist();
        updatePlayerUi();
    }

    function speakSentence(sentence, button) {
        if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
            setAudioStatus("Dein Browser unterstützt keine integrierte Sprachausgabe.");
            return;
        }

        if (activeAudioButton === button) {
            stopSpeaking();
            setAudioStatus("");
            return;
        }

        if (playerState.playing) {
            pausePlaylist();
        }
        stopSpeaking();

        activeAudioButton = button;
        button.classList.add("is-speaking");
        button.textContent = "⏹";
        button.setAttribute("aria-label", "Vorlesen stoppen");
        speakWithVoice(sentence);
    }

    function renderChapterNav() {
        const groups = new Map();
        bosses.forEach(boss => {
            const category = boss.category || "Grammatikbosse";
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category).push(boss);
        });

        elements.chapterNav.innerHTML = Array.from(groups.entries()).map(
            ([category, categoryBosses]) => `
                <div class="japanese-chapter-group">
                    <p class="japanese-chapter-group-title">${escapeHtml(category)}</p>
                    ${categoryBosses.map(boss => `
                        <button
                            class="japanese-chapter-button"
                            type="button"
                            data-boss-id="${escapeHtml(boss.id)}">
                            ${escapeHtml(boss.title)}
                            <span> · ${boss.sentences.length} Sätze</span>
                        </button>
                    `).join("")}
                </div>
            `
        ).join("");

        elements.chapterNav.querySelectorAll("[data-boss-id]").forEach(button => {
            button.addEventListener("click", () => {
                renderBoss(button.dataset.bossId, true);
                closeSidebar();
            });
        });
    }

    function renderIntroduction(introduction) {
        if (!introduction) {
            elements.introduction.hidden = true;
            elements.introduction.innerHTML = "";
            return;
        }

        elements.introduction.hidden = false;
        elements.introduction.innerHTML = `
            <details class="japanese-introduction-disclosure" open>
                <summary>🧩 Das Grundmuster</summary>
                <div class="japanese-introduction-content">
                    <div class="japanese-introduction-example">
                        <p class="japanese-introduction-japanese" lang="ja">
                            ${escapeHtml(introduction.example.japanese)}
                        </p>
                        <p class="japanese-introduction-romaji">
                            <em>${escapeHtml(introduction.example.romaji)}</em>
                        </p>
                        <p class="japanese-introduction-translation">
                            ${escapeHtml(introduction.example.translation)}
                        </p>
                    </div>
                    <p class="japanese-introduction-lead">
                        Du kannst es zunächst ganz einfach als Baukasten sehen:
                    </p>
                    <div class="japanese-introduction-parts">
                        ${introduction.parts.map(part => `
                            <div class="japanese-introduction-part">
                                <strong lang="ja">${escapeHtml(part.japanese)}</strong>
                                <em>${escapeHtml(part.romaji)}</em>
                                <span>${escapeHtml(part.translation)}</span>
                            </div>
                        `).join("")}
                    </div>
                    <div class="japanese-introduction-assembly">
                        <p class="japanese-pattern-label">Also:</p>
                        <p class="japanese-introduction-japanese" lang="ja">
                            <strong>${escapeHtml(introduction.assembly.japanese)}</strong>
                        </p>
                        <p class="japanese-introduction-romaji">
                            <em>${escapeHtml(introduction.assembly.romaji)}</em>
                        </p>
                        <p class="japanese-introduction-translation">
                            <strong>${escapeHtml(introduction.assembly.translation)}</strong>
                        </p>
                    </div>
                    <p class="japanese-introduction-warning">
                        💡 <strong>Wichtig:</strong> ${escapeHtml(introduction.warning)}
                    </p>
                </div>
            </details>
        `;
    }

    function renderMidpointReminder(reminder) {
        if (!reminder) {
            return "";
        }

        return `
            <details class="japanese-midpoint-reminder">
                <summary>${escapeHtml(reminder.title)}</summary>
                <div class="japanese-midpoint-content">
                    <p>${escapeHtml(reminder.message)}</p>
                    <p>${escapeHtml(reminder.lead)}</p>
                    ${reminder.sections.map(section => `
                        <section class="japanese-reminder-section">
                            <h4>${escapeHtml(section.title)}</h4>
                            <div class="japanese-reminder-words">
                                ${section.words.map(word => renderReminderWord(word)).join("")}
                            </div>
                        </section>
                    `).join("")}
                    <p class="japanese-reminder-pattern-lead">
                        ${escapeHtml(reminder.patternLead)}
                    </p>
                    ${renderReminderExample(reminder.pattern)}
                    <div class="japanese-reminder-discoveries">
                        ${reminder.discoveries.map(word => `
                            <div>
                                <strong lang="ja">${escapeHtml(word.japanese)}</strong>
                                <em>${escapeHtml(word.romaji)}</em>
                                <span>${escapeHtml(word.translation)}</span>
                            </div>
                        `).join("")}
                    </div>
                    <p class="japanese-reminder-closing">
                        ${escapeHtml(reminder.closing)}
                    </p>
                </div>
            </details>
        `;
    }

    function renderReminderWord(word) {
        return `
            <div class="japanese-reminder-word">
                <strong lang="ja">${escapeHtml(word.japanese)}</strong>
                <em>${escapeHtml(word.romaji)}</em>
                <span>${escapeHtml(word.translation)}</span>
                ${renderSpecialAudioButton(word.japanese)}
            </div>
        `;
    }

    function renderReminderExample(example) {
        return `
            <div class="japanese-reminder-example">
                <strong lang="ja">${escapeHtml(example.japanese)}</strong>
                <em>${escapeHtml(example.romaji)}</em>
                <span>${escapeHtml(example.translation)}</span>
                ${renderSpecialAudioButton(example.japanese)}
            </div>
        `;
    }

    function renderSpecialAudioButton(japanese) {
        return `
            <button
                class="japanese-special-audio-button"
                type="button"
                data-special-audio="${escapeHtml(japanese)}"
                data-audio-label="Aussprache abspielen"
                aria-label="Aussprache abspielen"
                title="Japanische Aussprache abspielen">🔊</button>
        `;
    }

    function renderBlockCompletion(completion) {
        if (!completion) {
            return "";
        }

        return `
            <details class="japanese-quest-completion" open>
                <summary>${escapeHtml(completion.title)}</summary>
                <div class="japanese-quest-content">
                    <h3>${escapeHtml(completion.heading)}</h3>
                    <p>${escapeHtml(completion.message)}</p>
                    <p>${escapeHtml(completion.lead)}</p>
                    <h4>${escapeHtml(completion.wordSectionTitle)}</h4>
                    <div class="japanese-reminder-words">
                        ${completion.words.map(word => renderReminderWord(word)).join("")}
                    </div>
                    <p class="japanese-quest-lead">${escapeHtml(completion.questionLead)}</p>
                    ${renderReminderExample(completion.question)}
                    <p class="japanese-quest-lead">${escapeHtml(completion.answerLead)}</p>
                    ${renderReminderExample(completion.answer)}
                    <p class="japanese-quest-lead">${escapeHtml(completion.alternativeLead)}</p>
                    ${renderReminderExample(completion.alternative)}
                    <p class="japanese-quest-lead">${escapeHtml(completion.possessionLead)}</p>
                    ${renderReminderExample(completion.possession)}
                    <h3 class="japanese-quest-progress-title">${escapeHtml(completion.progressTitle)}</h3>
                    <p class="japanese-quest-progress">${escapeHtml(completion.progress)}</p>
                    <p class="japanese-reminder-summary">${escapeHtml(completion.progressSummary)}</p>
                    <p class="japanese-quest-lead">${escapeHtml(completion.systemLead)}</p>
                    <div class="japanese-reminder-examples">
                        ${completion.systemExamples.map(renderReminderExample).join("")}
                    </div>
                    <p class="japanese-quest-final">${escapeHtml(completion.final)}</p>
                    <p class="japanese-quest-progress">${escapeHtml(completion.finalProgress)}</p>
                </div>
            </details>
        `;
    }

    function renderSentence(sentence) {
        return `
            <article
                class="japanese-sentence"
                id="${escapeHtml(sentence.id)}"
                data-sentence-number="${sentence.number}">
                <span class="japanese-sentence-number">${sentence.number}.</span>
                <div>
                    <p class="japanese-sentence-japanese" lang="ja">${escapeHtml(sentence.japanese)}</p>
                    <p class="japanese-sentence-romaji">${escapeHtml(sentence.romaji)}</p>
                    <p class="japanese-sentence-translation">${escapeHtml(sentence.translation)}</p>
                </div>
                <button
                    class="japanese-audio-button"
                    type="button"
                    data-sentence-id="${escapeHtml(sentence.id)}"
                    aria-label="Satz vorlesen"
                    title="Japanischen Satz vorlesen">🔊</button>
                <button
                    class="japanese-playlist-button"
                    type="button"
                    data-playlist-sentence-id="${escapeHtml(sentence.id)}"
                    aria-label="Satz zur Playlist hinzufügen"
                    title="Satz zur Playlist hinzufügen">+ Playlist</button>
            </article>
        `;
    }

    function renderBoss(bossId, shouldScroll = false) {
        const boss = bosses.find(candidate => candidate.id === bossId);
        if (!boss) {
            setAudioStatus("Das ausgewählte japanische Grammatik-Unterkapitel wurde nicht gefunden.");
            return;
        }

        setJapaneseView("reader", shouldScroll);
        if (playerState.playing) {
            pausePlaylist();
        } else {
            stopSpeaking();
        }
        currentBoss = boss;
        const progress = readProgress();

        elements.bossEyebrow.textContent = boss.title;
        elements.bossTitle.textContent = boss.subtitle;
        elements.bossDescription.textContent = boss.description;
        renderIntroduction(boss.introduction);
        elements.sentenceCount.textContent = `${boss.sentences.length} Beispielsätze`;
        elements.pattern.textContent = boss.pattern;
        elements.patternRomaji.textContent = boss.patternRomaji;
        elements.patternTranslation.textContent = boss.patternTranslation;

        elements.blockList.innerHTML = boss.blocks.map(block => `
            <details class="japanese-block" open>
                <summary id="${escapeHtml(block.id)}-title" class="japanese-block-summary">
                    ${escapeHtml(block.title)}
                </summary>
                <p class="japanese-block-description">${escapeHtml(block.description)}</p>
                ${block.levels.map(level => `
                    <div class="japanese-level-shell">
                        <details class="japanese-level">
                            <summary class="japanese-level-summary">${escapeHtml(level.title)}</summary>
                            <div class="japanese-sentence-list">
                                ${boss.sentences
                                    .filter(sentence => sentence.levelId === level.id)
                                    .map(renderSentence)
                                    .join("")}
                            </div>
                        </details>
                        <button
                            class="japanese-level-playlist-button"
                            type="button"
                            data-playlist-level-id="${escapeHtml(level.id)}"
                            aria-label="Alle Sätze dieses Levels zur Playlist hinzufügen"
                            title="Alle Sätze dieses Levels zur Playlist hinzufügen">
                            + Level zur Playlist
                        </button>
                    </div>
                    ${level.id === "level-4"
                        ? renderMidpointReminder(boss.midpointReminder)
                        : ""}
                `).join("")}
                ${renderBlockCompletion(block.completion)}
            </details>
        `).join("");

        elements.chapterNav.querySelectorAll("[data-boss-id]").forEach(button => {
            button.classList.toggle("is-active", button.dataset.bossId === boss.id);
        });

        elements.blockList.querySelectorAll(".japanese-audio-button").forEach(button => {
            button.addEventListener("click", () => {
                const sentence = findSentence(button.dataset.sentenceId);
                if (!sentence) {
                    setAudioStatus("Dieser Satz konnte nicht geladen werden.");
                    return;
                }

                markCurrentSentence(sentence.number, false);
                speakSentence(sentence, button);
            });
        });
        elements.blockList.querySelectorAll("[data-special-audio]").forEach(button => {
            button.addEventListener("click", () => {
                const japanese = button.dataset.specialAudio;
                if (!japanese) {
                    setAudioStatus("Diese Aussprache konnte nicht geladen werden.");
                    return;
                }

                speakSentence({ japanese }, button);
            });
        });
        elements.blockList.querySelectorAll("[data-playlist-sentence-id]").forEach(button => {
            button.addEventListener("click", () => {
                const sentenceId = button.dataset.playlistSentenceId;
                if (playlistContains(sentenceId)) {
                    const playlistIndex = playerState.playlist.findIndex(entry =>
                        entry.bossId === currentBoss.id &&
                        entry.sentenceId === sentenceId
                    );
                    removeFromPlaylist(playlistIndex);
                } else {
                    addToPlaylist(sentenceId);
                }
            });
        });
        elements.blockList.querySelectorAll("[data-playlist-level-id]").forEach(button => {
            button.addEventListener("click", () => {
                addLevelToPlaylist(button.dataset.playlistLevelId);
            });
        });
        updatePlaylistButtons();

        if (progress.bossId === boss.id && progress.sentenceNumber > 1) {
            updateResumeButton(1);
        } else {
            elements.resumeButton.hidden = true;
        }
    }

    elements.sidebarToggle?.addEventListener("click", () => {
        if (elements.sidebar?.classList.contains("is-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    elements.forewordButton?.addEventListener("click", showForeword);

    elements.sidebarBackdrop?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
            stopSpeaking();
        }
    });

    elements.resumeButton?.addEventListener("click", () => {
        const progress = readProgress();
        if (!currentBoss || progress.bossId !== currentBoss.id) {
            return;
        }

        markCurrentSentence(progress.sentenceNumber, true);
        setAudioStatus(`Satz ${progress.sentenceNumber} ist markiert.`);
    });

    elements.playerPlayPause?.addEventListener("click", togglePlaylistPlayback);
    elements.playerPrevious?.addEventListener("click", () => movePlaylist(-1));
    elements.playerNext?.addEventListener("click", () => movePlaylist(1));
    elements.playerLoop?.addEventListener("change", () => {
        playerState.loop = elements.playerLoop.checked;
        savePlayerState();
    });
    elements.playerShuffle?.addEventListener("change", () => {
        playerState.shuffle = elements.playerShuffle.checked;
        if (playerState.shuffle) {
            resetShuffleOrder();
        } else {
            playerState.shuffleOrder = [];
            playerState.shufflePosition = 0;
        }
        savePlayerState();
    });
    elements.playerSpeed?.addEventListener("input", () => {
        playerState.playbackRate = normalizePlaybackRate(elements.playerSpeed.value);
        updatePlayerUi();
        savePlayerState();
    });
    elements.playerSpeed?.addEventListener("change", () => {
        if (playerState.playing) {
            stopSpeaking();
            speakPlaylistEntry();
        }
    });
    elements.addAllButton?.addEventListener("click", addAllSentences);
    elements.clearPlaylistButton?.addEventListener("click", clearPlaylist);

    window.addEventListener("beforeunload", stopSpeaking);

    if (bosses.length === 0) {
        setAudioStatus("Noch kein japanisches Grammatik-Unterkapitel verfügbar.");
    } else {
        loadPlayerState();
        renderChapterNav();
        const progress = readProgress();
        const initialBoss = bosses.find(boss => boss.id === progress.bossId) || bosses[0];
        renderBoss(initialBoss.id);
    }
})();
