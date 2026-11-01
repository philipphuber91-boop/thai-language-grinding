(function () {
    "use strict";

    const player = document.querySelector("[data-drill-audio-player]");
    if (!player) {
        return;
    }

    const prefix = player.dataset.drillAudioPrefix;
    if (!prefix) {
        throw new Error("Dem Audio-Player fehlt ein Namenspräfix.");
    }

    const storageNamespace = player.dataset.drillAudioStorageNamespace || prefix;
    const apiName = player.dataset.drillAudioApi || `${prefix}Audio`;
    const contentName = player.dataset.drillAudioContent || `${prefix}Content`;
    const itemLabel = player.dataset.drillAudioItemLabel || "Satz";
    const emptyMessage = player.dataset.drillAudioEmptyMessage || "Noch keine Sätze ausgewählt.";
    const audioPrefix = `${prefix}Audio`;
    const storageKey = `${storageNamespace}:v1:audio-playlist`;
    const entriesById = new Map();
    const elements = {
        player,
        playerToggle: document.getElementById(`${prefix}PlayerToggle`),
        count: document.getElementById(`${audioPrefix}Count`),
        previous: document.getElementById(`${audioPrefix}Previous`),
        playPause: document.getElementById(`${audioPrefix}PlayPause`),
        next: document.getElementById(`${audioPrefix}Next`),
        loop: document.getElementById(`${audioPrefix}Loop`),
        shuffle: document.getElementById(`${audioPrefix}Shuffle`),
        speed: document.getElementById(`${audioPrefix}Speed`),
        speedValue: document.getElementById(`${audioPrefix}SpeedValue`),
        clear: document.getElementById(`${audioPrefix}Clear`),
        playlist: document.getElementById(`${audioPrefix}Playlist`),
        status: document.getElementById(`${audioPrefix}Status`),
        openSentenceMix: document.getElementById(`${audioPrefix}OpenSentenceMix`),
        openTyping: document.getElementById(`${audioPrefix}OpenTyping`),
        openRsvp: document.getElementById(`${audioPrefix}OpenRsvp`)
    };

    let controller = null;
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

    function getAudioForText(text) {
        const configuredProfile = voiceConfig.voiceProfiles?.W;
        const profile = typeof configuredProfile === "string"
            ? { voiceId: configuredProfile }
            : configuredProfile && typeof configuredProfile === "object"
                ? configuredProfile
                : {};
        return {
            type: "speechSynthesis",
            lang: profile.language || "th-TH",
            voiceId: profile.voiceId || voiceConfig.defaultVoiceId || "",
            modelId: profile.modelId || "inworld-tts-2",
            speakingRate: profile.speakingRate,
            deliveryMode: profile.deliveryMode,
            fallbackSrc:
                "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=" +
                encodeURIComponent(text)
        };
    }

    function getEntryAudio(entry) {
        return entry.audio || getAudioForText(entry.thai);
    }

    function normalizeEntries(entries) {
        if (!Array.isArray(entries)) {
            throw new TypeError("Audiosätze müssen als Array übergeben werden.");
        }

        const ids = new Set();
        return entries.map((entry, index) => {
            if (
                !entry ||
                typeof entry !== "object" ||
                typeof entry.id !== "string" ||
                entry.id.trim() === "" ||
                typeof entry.thai !== "string" ||
                entry.thai.trim() === ""
            ) {
                throw new TypeError(`Audiosatz ${index + 1} braucht eine stabile ID und Thai-Text.`);
            }
            if (ids.has(entry.id)) {
                throw new TypeError(`Audiosatz-ID "${entry.id}" ist doppelt vorhanden.`);
            }

            ids.add(entry.id);
            return {
                ...entry,
                storyTitle: entry.storyTitle || itemLabel,
                sentenceNumber: entry.sentenceNumber ?? index + 1
            };
        });
    }

    function renderPlaylist() {
        const state = controller.state;
        const playlistEntries = state.playlist;
        elements.count.textContent =
            `${playlistEntries.length > 0 ? state.currentIndex + 1 : 0}/${playlistEntries.length}`;
        elements.previous.disabled = playlistEntries.length === 0;
        elements.playPause.disabled = playlistEntries.length === 0;
        elements.next.disabled = playlistEntries.length === 0;
        elements.clear.disabled = playlistEntries.length === 0;
        if (elements.openSentenceMix) elements.openSentenceMix.disabled = playlistEntries.length === 0;
        if (elements.openTyping) elements.openTyping.disabled = playlistEntries.length === 0;
        if (elements.openRsvp) elements.openRsvp.disabled = playlistEntries.length === 0;
        elements.playPause.textContent = state.playing ? "⏸ Pause" : "▶ Abspielen";
        elements.loop.checked = state.loop;
        elements.shuffle.checked = state.shuffle;
        elements.speed.value = String(state.playbackRate);
        elements.speedValue.textContent = `${state.playbackRate
            .toFixed(2)
            .replace(".", ",")
            .replace(",00", "")}×`;

        elements.playlist.innerHTML = playlistEntries.length === 0
            ? `<li class="thai-giga-playlist-empty">${escapeHtml(emptyMessage)}</li>`
            : playlistEntries.map((entry, index) => `
                <li class="thai-giga-playlist-item${index === state.currentIndex ? " is-current" : ""}">
                    <button
                        type="button"
                        class="thai-giga-playlist-select"
                        data-drill-audio-index="${index}">
                        <span class="thai-giga-playlist-card-number">
                            <strong>${escapeHtml(entry.sentenceNumber)}</strong>
                            <small>${escapeHtml(itemLabel)}</small>
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
                            data-drill-audio-move="${index}:up"
                            aria-label="Satz nach oben verschieben"
                            ${index === 0 ? "disabled" : ""}>↑</button>
                        <button
                            type="button"
                            class="thai-giga-playlist-order-button"
                            data-drill-audio-move="${index}:down"
                            aria-label="Satz nach unten verschieben"
                            ${index === playlistEntries.length - 1 ? "disabled" : ""}>↓</button>
                    </div>
                    <button
                        type="button"
                        class="thai-giga-playlist-remove"
                        data-drill-audio-remove="${index}"
                        aria-label="Satz aus Playlist entfernen">×</button>
                </li>
            `).join("");

        elements.playlist
            .querySelectorAll("[data-drill-audio-index]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    controller.select(Number(button.dataset.drillAudioIndex));
                });
            });
        elements.playlist
            .querySelectorAll("[data-drill-audio-remove]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    controller.remove(Number(button.dataset.drillAudioRemove));
                });
            });
        elements.playlist
            .querySelectorAll("[data-drill-audio-move]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const [indexValue, direction] =
                        button.dataset.drillAudioMove.split(":");
                    const index = Number(indexValue);
                    controller.move(index, index + (direction === "up" ? -1 : 1));
                });
            });
    }

    function setStatus(message) {
        elements.status.textContent = message;
    }

    function setContentNow(entries) {
        const normalizedEntries = normalizeEntries(entries);
        controller.pause();
        entriesById.clear();
        normalizedEntries.forEach(entry => {
            entriesById.set(entry.id, entry);
        });
        controller.load();
        return normalizedEntries.length;
    }

    function addSentencesNow(entries) {
        const normalizedEntries = normalizeEntries(entries);
        normalizedEntries.forEach(entry => {
            entriesById.set(entry.id, entry);
        });
        return normalizedEntries.length > 0
            ? controller.addMany(normalizedEntries)
            : 0;
    }

    function requireController() {
        if (!controller) {
            throw new Error("Der Audio-Player wurde nicht initialisiert.");
        }
    }

    async function initialize() {
        const requiredKeys = ["player", "count", "previous", "playPause", "next", "loop", "shuffle", "speed", "speedValue", "clear", "playlist"];
        const missingElements = requiredKeys
            .filter(name => !elements[name]);
        if (missingElements.length > 0) {
            throw new Error(`Audio-Player-Elemente fehlen: ${missingElements.join(", ")}.`);
        }
        if (!window.questAudio?.createPlaylistPlayer) {
            throw new Error("Der gemeinsame Audio-Player ist nicht verfügbar.");
        }

        await loadVoiceConfig();
        window.questAudio.initializeFloatingPlayerMenu({
            player: elements.player,
            toggle: elements.playerToggle,
            positionStorageKey: `${storageNamespace}:v1:audio-player-position`,
            sizeStorageKey: `${storageNamespace}:v1:audio-player-size`
        });

        controller = window.questAudio.createPlaylistPlayer({
            storageKey,
            getEntryId: entry => entry.id,
            resolveEntry: entryId => entriesById.get(entryId) || null,
            getEntryText: entry => entry.thai,
            getEntryAudio,
            onStateChange: state => {
                renderPlaylist();
                window.dispatchEvent(new CustomEvent(`${prefix}:playlist-updated`, { detail: state }));
            },
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

        if (elements.openSentenceMix) {
            elements.openSentenceMix.addEventListener("click", () => {
                if (!controller || controller.state.playlist.length === 0) {
                    setStatus("Füge zuerst Sätze zur Playlist hinzu.");
                    return;
                }
                window.location.href = `satzmix.html?source=playlist&key=${encodeURIComponent(storageKey)}`;
            });
        }

        if (elements.openTyping) {
            elements.openTyping.addEventListener("click", () => {
                if (!controller || controller.state.playlist.length === 0) {
                    setStatus("Füge zuerst Sätze zur Playlist hinzu.");
                    return;
                }
                const playlistSentences = controller.state.playlist;
                const typingPlaylist = {
                    id: `${prefix}-playlist`,
                    version: 1,
                    titel: `${itemLabel} Typing-Playlist`,
                    thaiZeilen: playlistSentences.map(entry => entry.thai),
                    deutschZeilen: playlistSentences.map(entry => entry.translation || ""),
                    transliterationZeilen: playlistSentences.map(entry => entry.transliteration || ""),
                    gigaDrill: true,
                    gigaDrillPlaylist: true,
                    gigaDrillSentenceIds: playlistSentences.map(entry => entry.id),
                    gigaDrillTokensByLine: playlistSentences.map(entry => entry.tokens || []),
                    audio: { type: "none" }
                };
                localStorage.setItem("thaiGigaDrill:v1:typing-sentence", JSON.stringify(typingPlaylist));
                localStorage.setItem("contentMode", "thai-giga");
                localStorage.setItem("aktuelleQuest", typingPlaylist.id);
                localStorage.setItem("questMode", "challenge");
                window.location.href = "typing.html";
            });
        }

        if (elements.openRsvp) {
            elements.openRsvp.addEventListener("click", () => {
                if (!controller || controller.state.playlist.length === 0) {
                    setStatus("Füge zuerst Sätze zur Playlist hinzu.");
                    return;
                }
                if (window.thaiGigaRsvp?.open) {
                    window.thaiGigaRsvp.open(
                        controller.state.playlist,
                        `RSVP · ${itemLabel}-Playlist`,
                        `${controller.state.playlist.length} Sätze`,
                        elements.openRsvp
                    );
                }
            });
        }

        let initialContent = window[contentName]?.sentences;
        if (!Array.isArray(initialContent) && window[contentName]?.levels) {
            initialContent = window[contentName].levels.flatMap(level =>
                (level.bosses || []).flatMap(boss =>
                    (boss.blocks || []).flatMap(block =>
                        (block.miniStories || []).flatMap(story => story.sentences || [])
                    )
                )
            );
        }
        setContentNow(Array.isArray(initialContent) ? initialContent : []);

        if (window.ResizeObserver) {
            const playlistResizeObserver = new ResizeObserver(() => {
                const currentItem = elements.playlist.querySelector(
                    ".thai-giga-playlist-item.is-current"
                );
                if (!currentItem || elements.playlist.clientHeight <= 0) {
                    return;
                }
                const playlistRect = elements.playlist.getBoundingClientRect();
                const itemRect = currentItem.getBoundingClientRect();
                elements.playlist.scrollTop +=
                    itemRect.top + itemRect.height / 2 -
                    (playlistRect.top + elements.playlist.clientHeight / 2);
            });
            playlistResizeObserver.observe(elements.playlist);
        }
    }

    const api = {
        ready: null,
        setContent(entries) {
            return api.ready.then(initialized => {
                if (!initialized) {
                    throw new Error("Der Audio-Player konnte nicht initialisiert werden.");
                }
                requireController();
                return setContentNow(entries);
            });
        },
        addSentences(entries) {
            return api.ready.then(initialized => {
                if (!initialized) {
                    throw new Error("Der Audio-Player konnte nicht initialisiert werden.");
                }
                requireController();
                return addSentencesNow(entries);
            });
        },
        hasSentence(sentenceId) {
            return controller ? controller.state.playlist.some(entry => entry.id === sentenceId) : false;
        },
        addSentence(sentenceId, play = false) {
            if (!controller) return false;
            const entry = entriesById.get(sentenceId);
            if (!entry) return false;
            const existingIndex = controller.state.playlist.findIndex(item => item.id === sentenceId);
            if (existingIndex >= 0) {
                if (play) controller.select(existingIndex, true);
                return true;
            }
            controller.add(entry);
            if (play) {
                const index = controller.state.playlist.findIndex(item => item.id === sentenceId);
                controller.select(index, true);
            }
            return true;
        },
        removeSentence(sentenceId) {
            if (!controller) return false;
            const index = controller.state.playlist.findIndex(item => item.id === sentenceId);
            if (index >= 0) {
                controller.remove(index);
                return true;
            }
            return false;
        },
        toggleSentence(sentenceId) {
            if (this.hasSentence(sentenceId)) {
                this.removeSentence(sentenceId);
                return false;
            } else {
                this.addSentence(sentenceId);
                return true;
            }
        },
        addStory(storySentenceIds) {
            if (!controller) return 0;
            const entries = (Array.isArray(storySentenceIds) ? storySentenceIds : [])
                .map(id => typeof id === "string" ? entriesById.get(id) : id)
                .filter(Boolean);
            return controller.addMany(entries);
        },
        removeStory(storySentenceIds) {
            if (!controller) return 0;
            const idSet = new Set(Array.isArray(storySentenceIds) ? storySentenceIds : []);
            let count = 0;
            for (let i = controller.state.playlist.length - 1; i >= 0; i--) {
                if (idSet.has(controller.state.playlist[i].id)) {
                    controller.remove(i);
                    count++;
                }
            }
            return count;
        },
        getAudioForSentence(sentenceId) {
            const entry = entriesById.get(sentenceId);
            return entry ? getEntryAudio(entry) : null;
        },
        getAudioForText,
        getState: () => controller?.state || null
    };
    window[apiName] = api;

    api.ready = initialize()
        .then(() => true)
        .catch(error => {
            console.error("Audio-Player konnte nicht gestartet werden.", error);
            if (elements.status) {
                setStatus("Der Audio-Player konnte nicht initialisiert werden.");
            }
            return false;
        });
})();
