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
        blockList: document.getElementById("japaneseBlockList"),
        audioStatus: document.getElementById("japaneseAudioStatus")
    };

    let currentBoss = null;
    let activeAudioButton = null;

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
                    : 1
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
                JSON.stringify({ bossId, sentenceNumber })
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
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        resetAudioButton();
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

        stopSpeaking();

        const speechVoice = getSpeechVoice();
        const utterance = new SpeechSynthesisUtterance(sentence.japanese);
        utterance.rate = 0.85;
        utterance.pitch = 1;

        if (speechVoice.voice) {
            utterance.voice = speechVoice.voice;
            utterance.lang = speechVoice.voice.lang;
        } else {
            utterance.lang = "ja-JP";
        }

        activeAudioButton = button;
        button.classList.add("is-speaking");
        button.textContent = "⏹";
        button.setAttribute("aria-label", "Vorlesen stoppen");

        if (speechVoice.usedFallback) {
            setAudioStatus(
                "Keine japanische Stimme gefunden. Die Standardsprache des Browsers wird verwendet."
            );
        } else {
            setAudioStatus("");
        }

        utterance.onend = () => {
            resetAudioButton();
        };
        utterance.onerror = event => {
            resetAudioButton();
            setAudioStatus(
                `Audio konnte nicht abgespielt werden (${event.error || "unbekannter Fehler"}).`
            );
        };

        window.speechSynthesis.speak(utterance);
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
            </article>
        `;
    }

    function renderBoss(bossId) {
        const boss = bosses.find(candidate => candidate.id === bossId);
        if (!boss) {
            setAudioStatus("Das ausgewählte japanische Grammatik-Unterkapitel wurde nicht gefunden.");
            return;
        }

        stopSpeaking();
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
                    <details class="japanese-level" open>
                        <summary>${escapeHtml(level.title)}</summary>
                        <div class="japanese-sentence-list">
                            ${boss.sentences
                                .filter(sentence => sentence.levelId === level.id)
                                .map(renderSentence)
                                .join("")}
                        </div>
                    </details>
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

    window.addEventListener("beforeunload", stopSpeaking);

    if (bosses.length === 0) {
        setAudioStatus("Noch kein japanisches Grammatik-Unterkapitel verfügbar.");
    } else {
        renderChapterNav();
        const progress = readProgress();
        const initialBoss = bosses.find(boss => boss.id === progress.bossId) || bosses[0];
        renderBoss(initialBoss.id);
    }
})();
