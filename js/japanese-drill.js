(function () {
    "use strict";

    const STORAGE_KEY = "japaneseGigaDrill:v1";
    const bosses = Array.isArray(window.japaneseGrammarBosses)
        ? window.japaneseGrammarBosses
        : [];

    const elements = {
        sidebar: document.getElementById("japaneseSidebar"),
        sidebarBackdrop: document.getElementById("japaneseSidebarBackdrop"),
        sidebarToggle: document.getElementById("japaneseSidebarToggle"),
        chapterNav: document.getElementById("japaneseChapterNav"),
        bossEyebrow: document.getElementById("japaneseBossEyebrow"),
        bossTitle: document.getElementById("japaneseBossTitle"),
        bossDescription: document.getElementById("japaneseBossDescription"),
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
        addAllButton: document.getElementById("japaneseAddAllButton"),
        clearPlaylistButton: document.getElementById("japaneseClearPlaylistButton"),
        playlist: document.getElementById("japanesePlaylist"),
        blockList: document.getElementById("japaneseBlockList"),
        audioStatus: document.getElementById("japaneseAudioStatus")
    };

    let currentBoss = null;
    let activeAudioButton = null;
    let speechRunId = 0;
    const playerState = {
        playlist: [],
        currentIndex: 0,
        loop: true,
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
                loop: progress.loop !== false
            };
        } catch (error) {
            console.warn("Japanischer Lesefortschritt konnte nicht gelesen werden.", error);
            setAudioStatus("Der lokale japanische Lesefortschritt ist nicht verfügbar.");
            return { bossId: "", sentenceNumber: 1 };
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

    function resetAudioButton() {
        if (!activeAudioButton) {
            return;
        }

        activeAudioButton.classList.remove("is-speaking");
        activeAudioButton.textContent = "🔊";
        activeAudioButton.setAttribute("aria-label", "Satz vorlesen");
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
                    loop: playerState.loop
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
            : playerState.playlist.map((entry, index) => {
                const item = findPlaylistEntry(entry);
                return `
                    <li class="japanese-playlist-item ${index === playerState.currentIndex ? "is-current" : ""}">
                        <button
                            class="japanese-playlist-select"
                            type="button"
                            data-playlist-index="${index}">
                            <span>${index + 1}.</span>
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

        elements.playlist.querySelectorAll("[data-playlist-index]").forEach(button => {
            button.addEventListener("click", () => {
                playerState.currentIndex = Number(button.dataset.playlistIndex);
                savePlayerState();
                updatePlayerUi();
                if (playerState.playing) {
                    speakPlaylistEntry();
                }
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

        if (currentItem) {
            elements.playerNowPlaying.innerHTML = `
                <span class="japanese-player-current-label">
                    ${playerState.currentIndex + 1}/${playlistLength}:
                </span>
                <span class="japanese-player-current-japanese" lang="ja">
                    ${escapeHtml(currentItem.sentence.japanese)}
                </span>
                <span class="japanese-player-current-romaji">
                    ${escapeHtml(currentItem.sentence.romaji)}
                </span>
                <span class="japanese-player-current-translation">
                    ${escapeHtml(currentItem.sentence.translation)}
                </span>
            `;
        } else {
            elements.playerNowPlaying.textContent =
                "Füge Sätze über „+ Playlist“ hinzu.";
        }

        elements.playlist.querySelectorAll(".japanese-playlist-item").forEach((item, index) => {
            item.classList.toggle("is-current", index === playerState.currentIndex);
        });
    }

    function focusPlaylistEntry() {
        const playlist = elements.playlist;
        const currentItem = playlist.querySelector(".japanese-playlist-item.is-current");
        if (!currentItem || playlist.scrollHeight <= playlist.clientHeight) {
            return;
        }

        const targetTop = currentItem.offsetTop -
            (playlist.clientHeight - currentItem.offsetHeight) / 2;
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
        utterance.rate = 0.85;
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

            const isLastSentence =
                playerState.currentIndex >= playerState.playlist.length - 1;
            if (isLastSentence && !playerState.loop) {
                playerState.playing = false;
                updatePlayerUi();
                setAudioStatus("Playlist beendet.");
                return;
            }

            playerState.currentIndex = isLastSentence
                ? 0
                : playerState.currentIndex + 1;
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
        elements.chapterNav.innerHTML = bosses.map(boss => `
            <button
                class="japanese-chapter-button"
                type="button"
                data-boss-id="${escapeHtml(boss.id)}">
                ${escapeHtml(boss.title)}
                <span> · ${boss.sentences.length} Sätze</span>
            </button>
        `).join("");

        elements.chapterNav.querySelectorAll("[data-boss-id]").forEach(button => {
            button.addEventListener("click", () => {
                renderBoss(button.dataset.bossId);
                closeSidebar();
            });
        });
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

    function renderBoss(bossId) {
        const boss = bosses.find(candidate => candidate.id === bossId);
        if (!boss) {
            setAudioStatus("Das ausgewählte japanische Grammatik-Unterkapitel wurde nicht gefunden.");
            return;
        }

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
        elements.sentenceCount.textContent = `${boss.sentences.length} Beispielsätze`;
        elements.pattern.textContent = boss.pattern;
        elements.patternRomaji.textContent = boss.patternRomaji;
        elements.patternTranslation.textContent = boss.patternTranslation;

        elements.blockList.innerHTML = boss.blocks.map(block => `
            <section class="japanese-block" aria-labelledby="${escapeHtml(block.id)}-title">
                <h3 id="${escapeHtml(block.id)}-title" class="japanese-block-heading">
                    ${escapeHtml(block.title)}
                </h3>
                <p class="japanese-block-description">${escapeHtml(block.description)}</p>
                ${block.levels.map(level => `
                    <div class="japanese-level-shell">
                        <details class="japanese-level" open>
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
                `).join("")}
            </section>
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
