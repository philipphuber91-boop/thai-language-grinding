(function () {
    "use strict";

    const STORAGE_KEY = "thaiGigaDrill:v1:audio-playlist";
    let controller = null;
    let indexes = null;
    let elements = null;
    let voiceConfig = {};
    let voiceConfigPromise = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getProfileVoiceId(profileId) {
        const profile = profileId && voiceConfig.voiceProfiles?.[profileId];
        return typeof profile === "string" ? profile : profile?.voiceId || "";
    }

    function getProfileAudioOptions(profileId) {
        const profile = profileId && voiceConfig.voiceProfiles?.[profileId];
        if (!profile || typeof profile !== "object") {
            return {};
        }

        return {
            modelId: profile.modelId,
            speakingRate: profile.speakingRate,
            deliveryMode: profile.deliveryMode,
            language: profile.language
        };
    }

    function getSpeakerVoiceProfileId(sentence) {
        const story = indexes?.storiesById.get(sentence.storyId);
        const speaker = story?.speakers?.find(item => item.id === sentence.speakerId);
        return speaker?.voiceProfileId || "";
    }

    function getSentenceGender(sentence) {
        const text = String(sentence?.thai || "");
        if (/ค่ะ|คะ/.test(text)) {
            return "female";
        }
        if (/ครับ/.test(text)) {
            return "male";
        }
        return "";
    }

    function getStableVoicePoolIndex(key, poolLength) {
        let hash = 2166136261;
        for (const character of String(key)) {
            hash ^= character.charCodeAt(0);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0) % poolLength;
    }

    function getBalancedProfileId(sentence, profileId) {
        const routing = voiceConfig.contentVoiceRouting;
        if (!routing || !profileId) {
            return profileId;
        }

        const profile = voiceConfig.voiceProfiles?.[profileId];
        const gender = profile && typeof profile === "object" ? profile.gender : "";
        const genericProfiles = gender === "female"
            ? routing.genericFemaleProfileIds
            : routing.genericMaleProfileIds;
        const rotationProfiles = gender === "female"
            ? routing.genericFemaleRotationProfileIds
            : routing.genericMaleRotationProfileIds;
        if (!Array.isArray(genericProfiles) ||
            !genericProfiles.includes(profileId) ||
            !Array.isArray(rotationProfiles) ||
            rotationProfiles.length === 0) {
            return profileId;
        }

        const storyKey = sentence?.storyId || sentence?.id || profileId;
        const speakerMatch = String(sentence?.speakerId || "").match(/speaker-([a-z])$/);
        const speakerOffset = speakerMatch
            ? speakerMatch[1].charCodeAt(0) - "a".charCodeAt(0)
            : 0;
        const poolIndex = getStableVoicePoolIndex(storyKey, rotationProfiles.length);
        return rotationProfiles[(poolIndex + speakerOffset) % rotationProfiles.length];
    }

    function getSentenceVoiceProfileId(sentence) {
        const speakerProfileId = getSpeakerVoiceProfileId(sentence);
        const profile = speakerProfileId && voiceConfig.voiceProfiles?.[speakerProfileId];
        const sentenceGender = getSentenceGender(sentence);
        const profileGender = profile && typeof profile === "object" ? profile.gender : "";

        if (!sentenceGender || !profileGender || sentenceGender === profileGender) {
            return getBalancedProfileId(sentence, speakerProfileId);
        }

        return sentenceGender === "female" ? "W" : "M";
    }

    function getConfiguredVoiceId(sentence = {}) {
        return sentence.voiceId ||
            voiceConfig.sentenceVoices?.[sentence.id] ||
            voiceConfig.speakerVoices?.[sentence.speakerId] ||
            getProfileVoiceId(getSentenceVoiceProfileId(sentence)) ||
            voiceConfig.storyVoices?.[sentence.storyId] ||
            voiceConfig.defaultVoiceId ||
            "";
    }

    function getAudioForText(text, voiceId = "", options = {}) {
        const defaultProfile = getProfileVoiceId("W");
        const configuredVoiceId = voiceId || options.voiceId || defaultProfile;
        const profileOptions = voiceId || options.voiceId
            ? {}
            : getProfileAudioOptions("W");

        return {
            type: "speechSynthesis",
            lang: options.language || profileOptions.language || "th-TH",
            voiceId: configuredVoiceId,
            modelId: options.modelId || profileOptions.modelId || "inworld-tts-2",
            speakingRate: options.speakingRate ?? profileOptions.speakingRate,
            deliveryMode: options.deliveryMode || profileOptions.deliveryMode,
            fallbackSrc:
                "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=" +
                encodeURIComponent(text)
        };
    }

    function loadVoiceConfig() {
        if (voiceConfigPromise) {
            return voiceConfigPromise;
        }

        voiceConfigPromise = fetch("../data/tts-voices.json", { cache: "no-cache" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Voice-Konfiguration konnte nicht geladen werden (${response.status}).`);
                }
                return response.json();
            })
            .then(configured => {
                voiceConfig = configured && typeof configured === "object" ? configured : {};
            })
            .catch(error => {
                voiceConfig = {};
                console.warn("Voice-Konfiguration ist nicht verfügbar; Standardstimme wird verwendet.", error);
            });

        return voiceConfigPromise;
    }

    function getDictionaryVoiceOptions() {
        return Array.isArray(voiceConfig.dictionaryVoices)
            ? voiceConfig.dictionaryVoices
                .filter(option =>
                    option &&
                    typeof option.id === "string" &&
                    typeof option.label === "string"
                )
                .map(option => ({
                    id: option.id,
                    label: option.label,
                    voiceId: option.voiceId || getProfileVoiceId(option.voiceProfileId),
                    ...getProfileAudioOptions(option.voiceProfileId)
                }))
            : [];
    }

    function getSentenceAudio(sentence) {
        return getAudioForText(
            sentence.thai,
            getConfiguredVoiceId(sentence),
            getProfileAudioOptions(getSentenceVoiceProfileId(sentence))
        );
    }

    function getSentenceEntry(sentenceId) {
        const sentence = indexes?.sentencesById.get(sentenceId);
        if (!sentence) {
            return null;
        }

        const story = indexes.storiesById.get(sentence.storyId);
        const audio = getSentenceAudio(sentence);
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
                ? { ...audio, lang: audio.lang || "th-TH" }
                : audio
        };
    }

    function getAudioForSentence(sentenceId) {
        const sentence = indexes?.sentencesById.get(sentenceId);
        return sentence ? getSentenceAudio(sentence) : null;
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
        if (elements.openRsvp) {
            elements.openRsvp.disabled = entries.length === 0;
        }
        if (elements.openSentenceMix) {
            elements.openSentenceMix.disabled = entries.length === 0;
        }
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

    function openRsvpPlaylist() {
        const sentenceIds = controller.state.playlist.map(entry => entry.id);
        if (sentenceIds.length === 0) {
            setStatus("Füge zuerst Sätze zur Playlist hinzu.");
            return false;
        }
        return window.thaiGigaRsvp?.openPlaylist(elements.openRsvp) || false;
    }

    function openSentenceMixPlaylist() {
        if (controller.state.playlist.length === 0) {
            setStatus("Füge zuerst Sätze zur Playlist hinzu.");
            return false;
        }

        window.location.href = "satzmix.html?source=playlist";
        return true;
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

    function removeSentences(sentenceIds) {
        if (!controller || !Array.isArray(sentenceIds)) {
            return 0;
        }

        const ids = new Set(sentenceIds);
        const indexesToRemove = controller.state.playlist
            .map((entry, index) => ids.has(entry.id) ? index : -1)
            .filter(index => index >= 0)
            .reverse();

        indexesToRemove.forEach(index => controller.remove(index));
        return indexesToRemove.length;
    }

    async function initialize(nextIndexes) {
        indexes = nextIndexes;
        await loadVoiceConfig();
        elements = {
            player: document.getElementById("thaiGigaAudioPlayer"),
            playerToggle: document.getElementById("thaiGigaPlayerToggle"),
            openTyping: document.getElementById("thaiGigaAudioOpenTyping"),
            openRsvp: document.getElementById("thaiGigaAudioOpenRsvp"),
            openSentenceMix: document.getElementById("thaiGigaAudioOpenSentenceMix"),
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
            getEntryAudio: entry => getSentenceEntry(entry.id)?.audio || entry.audio,
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
        elements.openRsvp?.addEventListener("click", openRsvpPlaylist);
        elements.openSentenceMix?.addEventListener("click", openSentenceMixPlaylist);
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
        loadVoiceConfig,
        addSentence,
        addSentences,
        addStory,
        addBlock,
        openTypingPlaylist,
        openRsvpPlaylist,
        openSentenceMixPlaylist,
        removeSentence,
        removeSentences,
        getAudioForSentence,
        getAudioForText,
        getDictionaryVoiceOptions,
        hasSentence: sentenceId =>
            Boolean(controller?.state.playlist.some(entry => entry.id === sentenceId)),
        getState: () => controller?.state || null
    };
})();
