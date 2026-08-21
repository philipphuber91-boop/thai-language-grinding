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
        return {
            id: sentence.id,
            storyId: sentence.storyId,
            storyTitle: story?.title || "Situation",
            thai: sentence.thai,
            transliteration: sentence.transliteration,
            translation: sentence.translation,
            audio: sentence.audio || { type: "speechSynthesis" }
        };
    }

    function getEntryLabel(entry) {
        return `${entry.storyTitle} · ${entry.thai}`;
    }

    function renderPlaylist() {
        const state = controller.state;
        const entries = state.playlist;
        elements.count.textContent = `${entries.length} ${entries.length === 1 ? "Satz" : "Sätze"}`;
        elements.previous.disabled = entries.length === 0;
        elements.playPause.disabled = entries.length === 0;
        elements.next.disabled = entries.length === 0;
        elements.clear.disabled = entries.length === 0;
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
            : "Füge einzelne Sätze, Situationen oder Blöcke hinzu.";

        elements.playlist.innerHTML = entries.length === 0
            ? "<li class=\"thai-giga-playlist-empty\">Noch keine Sätze ausgewählt.</li>"
            : entries.map((entry, index) => `
                <li class="thai-giga-playlist-item${index === state.currentIndex ? " is-current" : ""}">
                    <button
                        type="button"
                        class="thai-giga-playlist-select"
                        data-thai-giga-playlist-index="${index}">
                        <strong>${escapeHtml(entry.thai)}</strong>
                        <span>${escapeHtml(entry.storyTitle)} · ${escapeHtml(entry.translation)}</span>
                    </button>
                    <button
                        type="button"
                        class="thai-giga-playlist-remove"
                        data-thai-giga-playlist-remove="${index}"
                        aria-label="Satz aus Playlist entfernen">×</button>
                </li>
            `).join("");

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
        controller.load();
    }

    window.thaiGigaAudio = {
        initialize,
        addSentence,
        addStory,
        addBlock,
        removeSentence,
        hasSentence: sentenceId =>
            Boolean(controller?.state.playlist.some(entry => entry.id === sentenceId)),
        getState: () => controller?.state || null
    };
})();
