(function () {
    "use strict";

    const STORAGE_KEY = "thaiGigaDrill:v1:audio-playlist";
    let controller = null;
    let indexes = null;
    let elements = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getSentenceEntry(sentenceId) {
        const sentence = indexes?.sentencesById.get(sentenceId);
        if (!sentence) {
            return null;
        }

        const story = indexes.storiesById.get(sentence.storyId);
        const audio = sentence.audio || { type: "speechSynthesis" };
        return {
            id: sentence.id,
            storyId: sentence.storyId,
            storyTitle: story?.title || "Situation",
            bossTitle: story?.bossTitle || "",
            sentenceNumber: sentence.numberInBoss || sentence.numberInStory,
            thai: sentence.thai,
            transliteration: sentence.transliteration,
            translation: sentence.translation,
            audio: audio.type === "speechSynthesis"
                ? {
                    ...audio,
                    lang: audio.lang || "th-TH",
                    fallbackSrc:
                        "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=" +
                        encodeURIComponent(sentence.thai)
                }
                : audio
        };
    }

    function getEntryLabel(entry) {
        return `${entry.storyTitle} · ${entry.thai}`;
    }

    function getBossShortLabel(entry) {
        const match = String(entry.bossTitle || "").match(/(\d+)/);
        return match ? `#${match[1]}` : "#?";
    }

    function centerCurrentPlaylistItem() {
        if (!elements?.playlist || elements.playlist.clientHeight <= 0) {
            return;
        }

        const currentItem = elements.playlist.querySelector(".thai-giga-playlist-item.is-current");
        if (!currentItem) {
            return;
        }

        const playlistRect = elements.playlist.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();
        const playlistCenter = playlistRect.top + elements.playlist.clientHeight / 2;
        const itemCenter = itemRect.top + itemRect.height / 2;
        const scrollDelta = itemCenter - playlistCenter;
        if (Math.abs(scrollDelta) > 1) {
            elements.playlist.scrollTop += scrollDelta;
        }
    }

    function renderPlaylist() {
        const state = controller.state;
        const entries = state.playlist;
        elements.count.textContent = `${entries.length} ${entries.length === 1 ? "Satz" : "Sätze"}`;
        elements.previous.disabled = entries.length === 0;
        elements.playPause.disabled = entries.length === 0;
        elements.next.disabled = entries.length === 0;
        elements.clear.disabled = entries.length === 0;
        elements.openTyping.disabled = entries.length === 0;
        elements.playPause.textContent = state.playing ? "⏸ Pause" : "▶ Abspielen";
        elements.loop.checked = state.loop;
        elements.shuffle.checked = state.shuffle;
        elements.speed.value = String(state.playbackRate);
        elements.speedValue.textContent = `${state.playbackRate
            .toFixed(2)
            .replace(".", ",")
            .replace(",00", "")}×`;

        const currentEntry = entries[state.currentIndex];
        elements.nowPlaying.textContent = currentEntry
            ? `${state.currentIndex + 1}/${entries.length} · ${getEntryLabel(currentEntry)}`
            : "Füge Sätze über „+ Playlist“ hinzu.";

        elements.playlist.innerHTML = entries.length === 0
            ? "<li class=\"thai-giga-playlist-empty\">Noch keine Sätze ausgewählt.</li>"
            : entries.map((entry, index) => `
                <li class="thai-giga-playlist-item${index === state.currentIndex ? " is-current" : ""}">
                    <button
                        type="button"
                        class="thai-giga-playlist-select"
                        data-thai-giga-playlist-index="${index}">
                        <span class="thai-giga-playlist-card-number">
                            <strong>${escapeHtml(entry.sentenceNumber)}</strong>
                            <small>${escapeHtml(getBossShortLabel(entry))}</small>
                        </span>
                        <span>
                            <strong lang="th">${escapeHtml(entry.thai)}</strong>
                            <small class="thai-giga-playlist-transliteration">${escapeHtml(entry.transliteration)}</small>
                            <small class="thai-giga-playlist-translation">${escapeHtml(entry.translation)}</small>
                        </span>
                    </button>
                    <div class="thai-giga-playlist-order">
                        <button
                            type="button"
                            class="thai-giga-playlist-order-button"
                            data-thai-giga-playlist-move="${index}:up"
                            aria-label="Satz nach oben verschieben"
                            ${index === 0 ? "disabled" : ""}>↑</button>
                        <button
                            type="button"
                            class="thai-giga-playlist-order-button"
                            data-thai-giga-playlist-move="${index}:down"
                            aria-label="Satz nach unten verschieben"
                            ${index === entries.length - 1 ? "disabled" : ""}>↓</button>
                    </div>
                    <button
                        type="button"
                        class="thai-giga-playlist-remove"
                        data-thai-giga-playlist-remove="${index}"
                        aria-label="Satz aus Playlist entfernen">×</button>
                </li>
            `).join("");

        centerCurrentPlaylistItem();
        elements.playlist
            .querySelectorAll("[data-thai-giga-playlist-index]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    controller.select(Number(button.dataset.thaiGigaPlaylistIndex));
                });
            });
        elements.playlist
            .querySelectorAll("[data-thai-giga-playlist-remove]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    controller.remove(Number(button.dataset.thaiGigaPlaylistRemove));
                });
            });
        elements.playlist
            .querySelectorAll("[data-thai-giga-playlist-move]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const [indexValue, direction] =
                        button.dataset.thaiGigaPlaylistMove.split(":");
                    const index = Number(indexValue);
                    controller.move(index, index + (direction === "up" ? -1 : 1));
                });
            });
    }

    function notifyCurrentSentence(entry) {
        window.dispatchEvent(new CustomEvent("thai-giga:audio-current", {
            detail: { sentenceId: entry?.id || "" }
        }));
    }

    function setStatus(message) {
        elements.status.textContent = message;
    }

    function getEntriesForStory(storyId) {
        const story = indexes?.storiesById.get(storyId);
        return story ? story.sentences.map(sentence => getSentenceEntry(sentence.id)).filter(Boolean) : [];
    }

    function getEntriesForBlock(blockId) {
        const entries = [];
        indexes?.storiesById.forEach(story => {
            if (story.blockId === blockId) {
                entries.push(...getEntriesForStory(story.id));
            }
        });
        return entries;
    }

    function addSentence(sentenceId, play = false) {
        const entry = getSentenceEntry(sentenceId);
        if (!entry) {
            return false;
        }

        const existingIndex = controller.state.playlist.findIndex(item => item.id === sentenceId);
        if (existingIndex >= 0) {
            controller.select(existingIndex, play);
            return true;
        }

        controller.add(entry);
        if (play) {
            const index = controller.state.playlist.findIndex(item => item.id === sentenceId);
            controller.select(index, true);
        }
        return true;
    }

    function addStory(storyId) {
        controller.addMany(getEntriesForStory(storyId));
    }

    function addSentences(sentenceIds) {
        const entries = Array.isArray(sentenceIds)
            ? sentenceIds.map(getSentenceEntry).filter(Boolean)
            : [];
        return controller.addMany(entries);
    }

    function openTypingPlaylist() {
        const sentenceIds = controller.state.playlist.map(entry => entry.id);
        if (sentenceIds.length === 0) {
            setStatus("Füge zuerst Sätze zur Playlist hinzu.");
            return false;
        }

        return window.thaiGigaDrill.openTypingPlaylistInTyping(sentenceIds);
    }

    function addBlock(blockId) {
        controller.addMany(getEntriesForBlock(blockId));
    }

    function removeSentence(sentenceId) {
        const index = controller.state.playlist.findIndex(entry => entry.id === sentenceId);
        if (index >= 0) {
            controller.remove(index);
        }
    }

    function initialize(nextIndexes) {
        indexes = nextIndexes;
        elements = {
            player: document.getElementById("thaiGigaAudioPlayer"),
            playerToggle: document.getElementById("thaiGigaPlayerToggle"),
            openTyping: document.getElementById("thaiGigaAudioOpenTyping"),
            count: document.getElementById("thaiGigaAudioCount"),
            nowPlaying: document.getElementById("thaiGigaAudioNowPlaying"),
            previous: document.getElementById("thaiGigaAudioPrevious"),
            playPause: document.getElementById("thaiGigaAudioPlayPause"),
            next: document.getElementById("thaiGigaAudioNext"),
            loop: document.getElementById("thaiGigaAudioLoop"),
            shuffle: document.getElementById("thaiGigaAudioShuffle"),
            speed: document.getElementById("thaiGigaAudioSpeed"),
            speedValue: document.getElementById("thaiGigaAudioSpeedValue"),
            clear: document.getElementById("thaiGigaAudioClear"),
            playlist: document.getElementById("thaiGigaAudioPlaylist"),
            status: document.getElementById("thaiGigaAudioStatus")
        };

        window.questAudio.initializeFloatingPlayerMenu({
            player: elements.player,
            toggle: elements.playerToggle,
            positionStorageKey: "thaiGigaDrill:v1:audio-player-position",
            sizeStorageKey: "thaiGigaDrill:v1:audio-player-size"
        });

        controller = window.questAudio.createPlaylistPlayer({
            storageKey: STORAGE_KEY,
            getEntryId: entry => entry.id,
            resolveEntry: getSentenceEntry,
            getEntryText: entry => entry.thai,
            getEntryAudio: entry => entry.audio,
            onCurrentChange: notifyCurrentSentence,
            onStateChange: renderPlaylist,
            onStatus: setStatus,
            defaultPlaybackRate: 0.85,
            minPlaybackRate: 0.5,
            maxPlaybackRate: 1.5
        });

        elements.previous.addEventListener("click", () => controller.previous());
        elements.playPause.addEventListener("click", () => controller.togglePlayback());
        elements.next.addEventListener("click", () => controller.next());
        elements.loop.addEventListener("change", () => controller.setLoop(elements.loop.checked));
        elements.shuffle.addEventListener("change", () => controller.setShuffle(elements.shuffle.checked));
        elements.speed.addEventListener("input", () => controller.setPlaybackRate(elements.speed.value));
        elements.clear.addEventListener("click", () => controller.clear());
        elements.openTyping.addEventListener("click", openTypingPlaylist);
        controller.load();

        if (window.ResizeObserver) {
            const playlistResizeObserver = new ResizeObserver(() => {
                centerCurrentPlaylistItem();
            });
            playlistResizeObserver.observe(elements.playlist);
        } else {
            window.addEventListener("resize", centerCurrentPlaylistItem);
        }
    }

    window.thaiGigaAudio = {
        initialize,
        addSentence,
        addSentences,
        addStory,
        addBlock,
        openTypingPlaylist,
        removeSentence,
        hasSentence: sentenceId =>
            Boolean(controller?.state.playlist.some(entry => entry.id === sentenceId)),
        getState: () => controller?.state || null
    };
})();
