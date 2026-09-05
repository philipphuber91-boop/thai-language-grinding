(function () {
    "use strict";

    const elements = {
        sidebar: document.getElementById("thaiGigaSidebar"),
        sidebarBackdrop: document.getElementById("thaiGigaSidebarBackdrop"),
        sidebarToggle: document.getElementById("thaiGigaSidebarToggle"),
        hierarchy: document.getElementById("thaiGigaHierarchy"),
        foreword: document.getElementById("thaiGigaForeword"),
        forewordButton: document.getElementById("thaiGigaForewordButton"),
        audioPlayer: document.getElementById("thaiGigaAudioPlayer"),
        bossOverview: document.getElementById("thaiGigaBossOverview"),
        bossEyebrow: document.getElementById("thaiGigaBossEyebrow"),
        bossTitle: document.getElementById("thaiGigaBossTitle"),
        bossDescription: document.getElementById("thaiGigaBossDescription"),
        sentenceCount: document.getElementById("thaiGigaSentenceCount"),
        introduction: document.getElementById("thaiGigaIntroduction"),
        pattern: document.getElementById("thaiGigaPattern"),
        patternTranslation: document.getElementById("thaiGigaPatternTranslation"),
        blockList: document.getElementById("thaiGigaBlockList"),
        readerContent: document.getElementById("thaiGigaReaderContent"),
        emptyState: document.getElementById("thaiGigaEmptyState"),
        sentenceList: document.getElementById("thaiGigaBlockList"),
        dictionary: document.getElementById("thaiGigaDictionary"),
        wordDictionary: document.getElementById("thaiGigaWordDictionary"),
        wordDictionaryBossFilter: document.getElementById("thaiGigaWordDictionaryBossFilter"),
        wordDictionaryScopeFilter: document.getElementById("thaiGigaWordDictionaryScopeFilter"),
        wordDictionaryVoice: document.getElementById("thaiGigaDictionaryVoice"),
        wordDictionarySummary: document.getElementById("thaiGigaWordDictionarySummary"),
        wordDictionaryList: document.getElementById("thaiGigaWordDictionaryList"),
        wordDictionaryExport: document.getElementById("thaiGigaWordDictionaryExport"),
        sentenceListExport: document.getElementById("thaiGigaSentenceListExport"),
        wordDictionaryExportStatus: document.getElementById(
            "thaiGigaWordDictionaryExportStatus"
        ),
        speedreading: document.getElementById("thaiGigaSpeedreading"),
        speedreadingScope: document.getElementById("thaiGigaSpeedreadingScope"),
        speedreadingList: document.getElementById("thaiGigaSpeedreadingList"),
        speedreadingClose: document.getElementById("thaiGigaSpeedreadingClose"),
        speedreadingTransliteration: document.getElementById(
            "thaiGigaSpeedreadingTransliteration"
        ),
        speedreadingTranslation: document.getElementById("thaiGigaSpeedreadingTranslation"),
        bossSpeedreading: document.getElementById("thaiGigaBossSpeedreading")
    };

    let content = null;
    let indexes = null;
    let activeStory = null;
    let activeSentenceId = "";
    let activeBossId = "";
    let dictionaryAnchor = null;
    let dictionaryDrag = null;
    let speedreadingReturnFocus = null;
    const DICTIONARY_VOICE_STORAGE_KEY = "thaiGigaDrill:v1:dictionary-voice";
    const GRAMMAR_BOSS_1_ID = "level-1-grammar-boss-1";
    const GRAMMAR_BOSS_3_ID = "level-1-grammar-boss-3";
    const CHAI_MAI_PHRASE_ID = "word-chai-mai";
    const KO_DAI_PHRASE_ID = "word-ko-dai";

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const TONE_MARKS = new Map([
        ["\u0300", "low"],
        ["\u0301", "high"],
        ["\u0302", "falling"],
        ["\u030c", "rising"]
    ]);

    function getToneClass(transliteration) {
        const tones = [...String(transliteration ?? "").normalize("NFD")]
            .map(character => TONE_MARKS.get(character))
            .filter(Boolean);
        const uniqueTones = [...new Set(tones)];

        if (uniqueTones.length === 0) {
            return "thai-tone-mid";
        }
        if (uniqueTones.length === 1) {
            return `thai-tone-${uniqueTones[0]}`;
        }
        return "thai-tone-mixed";
    }

    function renderToneMarkup(thai, transliteration, syllables) {
        const validSyllables = Array.isArray(syllables) &&
            syllables.length > 1 &&
            syllables.every(syllable =>
                syllable &&
                typeof syllable.thai === "string" &&
                typeof syllable.transliteration === "string"
            ) &&
            syllables.map(syllable => syllable.thai).join("") === thai;

        if (validSyllables) {
            return syllables.map(syllable =>
                `<span class="${getToneClass(syllable.transliteration)}">${escapeHtml(
                    syllable.thai
                )}</span>`
            ).join("");
        }

        return `<span class="${getToneClass(transliteration)}">${escapeHtml(thai)}</span>`;
    }

    function getWordSyllables(thai) {
        return (content?.words || []).find(word => word.thai === thai)?.syllables;
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

    function updateSpeedreadingVisibility() {
        if (!elements.speedreading) {
            return;
        }

        elements.speedreading.dataset.speedreadingTransliteration = String(
            elements.speedreadingTransliteration?.checked !== false
        );
        elements.speedreading.dataset.speedreadingTranslation = String(
            elements.speedreadingTranslation?.checked !== false
        );
    }

    function syncSpeedreadingVisibility() {
        const body = document.body;
        if (elements.speedreadingTransliteration) {
            elements.speedreadingTransliteration.checked =
                body.dataset.thaiTransliterationVisible !== "false";
        }
        if (elements.speedreadingTranslation) {
            elements.speedreadingTranslation.checked =
                body.dataset.thaiTranslationVisible !== "false";
        }
        updateSpeedreadingVisibility();
    }

    function setThaiView(view, shouldScroll = false) {
        const isForeword = view === "foreword";
        elements.foreword.hidden = !isForeword;
        elements.audioPlayer.hidden = isForeword;
        elements.bossOverview.hidden = isForeword;
        elements.readerContent.hidden = isForeword;
        elements.forewordButton.classList.toggle("is-active", isForeword);
        elements.forewordButton.setAttribute("aria-pressed", String(isForeword));

        if (shouldScroll) {
            (isForeword ? elements.foreword : elements.bossOverview)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function showForeword() {
        setThaiView("foreword", true);
        closeSidebar();
    }

    function getStoryContext(story) {
        return [
            story.levelTitle,
            story.bossTitle,
            story.blockTitle,
            story.title
        ].filter(Boolean).join(" · ");
    }

    function getWordDictionaryEntries() {
        const bosses = content.levels.flatMap(level => level.bosses);
        const bossesById = new Map(bosses.map(boss => [boss.id, boss]));
        const wordBossIds = new Map();

        indexes.sentencesById.forEach(sentence => {
            sentence.tokens.forEach(token => {
                if (!token.wordId) {
                    return;
                }

                const bossIds = wordBossIds.get(token.wordId) || new Set();
                bossIds.add(sentence.bossId);
                wordBossIds.set(token.wordId, bossIds);
            });
        });

        return (content.words || []).map(word => {
            const firstSentence = indexes.sentencesById.get(word.firstSentenceId);
            const firstBoss = firstSentence
                ? bossesById.get(firstSentence.bossId)
                : null;

            return {
                ...word,
                firstSentence,
                firstBoss,
                appearsInBossIds: wordBossIds.get(word.id) || new Set()
            };
        });
    }

    function renderWordDictionaryFilters() {
        if (!elements.wordDictionaryBossFilter || !content) {
            return;
        }

        const currentBossId = elements.wordDictionaryBossFilter.value || "all";
        const bosses = content.levels.flatMap(level => level.bosses);
        elements.wordDictionaryBossFilter.innerHTML = `
            <option value="all">Alle Bosse</option>
            ${bosses.map(boss => `
                <option value="${escapeHtml(boss.id)}">
                    ${escapeHtml(boss.title)} · ${escapeHtml(boss.grammarFocus)}
                </option>
            `).join("")}
        `;
        elements.wordDictionaryBossFilter.value =
            bosses.some(boss => boss.id === currentBossId) ? currentBossId : "all";
    }

    function renderWordDictionaryVoiceOptions() {
        if (!elements.wordDictionaryVoice || !window.thaiGigaAudio) {
            return;
        }

        const options = window.thaiGigaAudio.getDictionaryVoiceOptions();
        const storedVoiceId = localStorage.getItem(DICTIONARY_VOICE_STORAGE_KEY);
        const selectedVoiceId = options.some(option => option.id === storedVoiceId)
            ? storedVoiceId
            : options[0]?.id || "";

        elements.wordDictionaryVoice.innerHTML = options.map(option => `
            <option value="${escapeHtml(option.id)}">
                ${escapeHtml(option.label)}
            </option>
        `).join("");
        elements.wordDictionaryVoice.value = selectedVoiceId;
        elements.wordDictionaryVoice.disabled = options.length === 0;
    }

    function getSelectedDictionaryVoice() {
        const selectedId = elements.wordDictionaryVoice?.value || "";
        const options = window.thaiGigaAudio?.getDictionaryVoiceOptions() || [];
        return options.find(option => option.id === selectedId) || null;
    }

    function renderWordDictionaryEntry(entry) {
        const selectedVoice = getSelectedDictionaryVoice();
        const audioMarkup = window.questAudio?.renderSentenceAudioPlayer({
            audio: window.thaiGigaAudio?.getAudioForText(
                entry.thai,
                selectedVoice?.voiceId || "",
                selectedVoice || {}
            ) || {
                type: "speechSynthesis",
                lang: "th-TH"
            },
            text: entry.thai,
            className: "thai-giga-word-audio",
            ariaLabel: "Wort vorlesen"
        }) || "";

        return `
            <article class="thai-giga-word-card">
                <div class="thai-giga-word-card-main">
                    <div class="thai-giga-word-card-thai-line">
                        <strong lang="th">${renderToneMarkup(
                            entry.thai,
                            entry.transliteration,
                            entry.syllables
                        )}</strong>
                    </div>
                    <em>${escapeHtml(entry.transliteration)}</em>
                    <span>${escapeHtml(entry.meanings.join(" / "))}</span>
                </div>
                ${audioMarkup}
            </article>
        `;
    }

    function renderWordDictionary() {
        if (
            !elements.wordDictionaryList ||
            !elements.wordDictionarySummary ||
            !content ||
            !indexes
        ) {
            return;
        }

        const entries = getWordDictionaryEntries();
        const selectedBossId = elements.wordDictionaryBossFilter?.value || "all";
        const scope = elements.wordDictionaryScopeFilter?.value || "all";
        const filteredEntries = entries.filter(entry => {
            const appearsInSelectedBoss =
                selectedBossId === "all" ||
                entry.appearsInBossIds.has(selectedBossId);
            const isNewInSelectedBoss =
                selectedBossId === "all"
                    ? true
                    : entry.firstBoss?.id === selectedBossId;
            return appearsInSelectedBoss &&
                (scope === "all" || isNewInSelectedBoss);
        });
        const bosses = content.levels.flatMap(level => level.bosses);
        const groups = new Map();

        filteredEntries.forEach(entry => {
            const groupId = selectedBossId === "all"
                ? entry.firstBoss?.id || "unassigned"
                : selectedBossId;
            const group = groups.get(groupId) || {
                title: selectedBossId === "all"
                    ? entry.firstBoss?.title || "Nicht zugeordnet"
                    : bosses.find(boss => boss.id === selectedBossId)?.title ||
                        "Nicht zugeordnet",
                entries: []
            };
            group.entries.push(entry);
            groups.set(groupId, group);
        });

        const orderedGroups = [
            ...bosses.map(boss => groups.get(boss.id)).filter(Boolean),
            groups.get("unassigned")
        ].filter(Boolean);
        elements.wordDictionaryList.innerHTML = orderedGroups.length > 0
            ? orderedGroups.map(group => `
                <section class="thai-giga-word-group">
                    <header>
                        <h3>${escapeHtml(
                            scope === "new" || selectedBossId === "all"
                                ? `Neu in ${group.title}`
                                : group.title
                        )}</h3>
                        <span>${group.entries.length} Wörter</span>
                    </header>
                    <div class="thai-giga-word-card-grid">
                        ${group.entries
                            .sort((left, right) =>
                                (left.firstSentence?.number || 0) -
                                (right.firstSentence?.number || 0)
                            )
                            .map(renderWordDictionaryEntry)
                            .join("")}
                    </div>
                </section>
            `).join("")
            : `<p class="thai-giga-word-dictionary-empty">
                Für diesen Filter sind noch keine Wörter vorhanden.
            </p>`;

        const scopeLabel = scope === "new"
            ? "neue Wörter"
            : "Wörter des aktiven Contents";
        elements.wordDictionarySummary.textContent =
            `${filteredEntries.length} ${scopeLabel} angezeigt · ` +
            `${entries.length} eindeutige Wörter insgesamt`;
        window.questAudio?.initializeSentenceAudioPlayers(elements.wordDictionaryList);
    }

    function escapeMarkdown(value) {
        return String(value ?? "")
            .replace(/\|/g, "\\|")
            .replace(/\r?\n/g, " ");
    }

    function buildWordListDocument() {
        const entries = getWordDictionaryEntries().sort((left, right) => {
            const leftBoss = left.firstBoss?.id || "";
            const rightBoss = right.firstBoss?.id || "";
            return leftBoss.localeCompare(rightBoss) ||
                (left.firstSentence?.number || 0) -
                    (right.firstSentence?.number || 0);
        });
        const bosses = content.levels.flatMap(level => level.bosses);
        const lines = [
            "# Thai Super Ultra Mega Giga Drill – vollständige Wortliste",
            "",
            `Stand: ${new Date().toISOString().slice(0, 10)}`,
            `Content-Version: ${content.contentVersion}`,
            `Eindeutige Wörter: ${entries.length}`,
            "",
            "Diese Liste enthält alle eindeutigen Wörter des aktiven Contents. " +
                "Neue Wörter sollen vor dem Ergänzen neuer Inhalte gegen diese " +
                "Liste geprüft werden.",
            ""
        ];

        bosses.forEach(boss => {
            const bossEntries = entries.filter(entry => entry.firstBoss?.id === boss.id);
            if (bossEntries.length === 0) {
                return;
            }

            lines.push(`## ${boss.title} – ${boss.grammarFocus}`, "");
            lines.push("| Thai | Umschrift | Deutsche Bedeutung | Erster Satz |");
            lines.push("| --- | --- | --- | --- |");
            bossEntries.forEach(entry => {
                lines.push(
                    `| ${escapeMarkdown(entry.thai)} | ` +
                    `${escapeMarkdown(entry.transliteration)} | ` +
                    `${escapeMarkdown(entry.meanings.join(" / "))} | ` +
                    `${escapeMarkdown(
                        entry.firstSentence
                            ? `Satz ${entry.firstSentence.numberInBoss}`
                            : "–"
                    )} |`
                );
            });
            lines.push("");
        });

        const unassignedEntries = entries.filter(entry => !entry.firstBoss);
        if (unassignedEntries.length > 0) {
            lines.push("## Noch keinem Grammatikboss zugeordnet", "");
            unassignedEntries.forEach(entry => {
                lines.push(
                    `- ${escapeMarkdown(entry.thai)} — ` +
                    `${escapeMarkdown(entry.transliteration)} — ` +
                    `${escapeMarkdown(entry.meanings.join(" / "))}`
                );
            });
        }

        return lines.join("\n");
    }

    function buildSentenceListDocument() {
        const lines = [
            "# Thai Super Ultra Mega Giga Drill – vollständige Satzliste",
            "",
            `Stand: ${new Date().toISOString().slice(0, 10)}`,
            `Content-Version: ${content.contentVersion}`,
            `Sätze: ${indexes.sentencesById.size}`,
            "",
            "Diese Liste enthält alle Sätze des aktiven Contents in der Reihenfolge " +
                "des Curriculums. Sie dient als Referenz für die Erstellung neuer Inhalte.",
            ""
        ];

        content.levels.forEach(level => {
            level.bosses.forEach(boss => {
                lines.push(`## ${boss.title} – ${boss.grammarFocus}`, "");
                boss.blocks.forEach(block => {
                    lines.push(`### ${block.title}`, "");
                    block.miniStories.forEach(story => {
                        lines.push(`#### ${story.title}`, "");
                        lines.push("| Satz-ID | Thai | Umschrift | Deutsche Übersetzung |");
                        lines.push("| --- | --- | --- | --- |");
                        story.sentences.forEach(sentence => {
                            lines.push(
                                `| ${escapeMarkdown(sentence.id)} | ` +
                                `${escapeMarkdown(sentence.thai)} | ` +
                                `${escapeMarkdown(sentence.transliteration)} | ` +
                                `${escapeMarkdown(sentence.translation)} |`
                            );
                        });
                        lines.push("");
                    });
                });
            });
        });

        return lines.join("\n");
    }

    function downloadMarkdownDocument(documentText, filename) {
        const blob = new Blob([documentText], {
            type: "text/markdown;charset=utf-8"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function exportWordList() {
        if (!content || !indexes || !elements.wordDictionaryExportStatus) {
            return;
        }

        try {
            downloadMarkdownDocument(
                buildWordListDocument(),
                "thai-giga-woerterliste.md"
            );
            elements.wordDictionaryExportStatus.textContent =
                "Vollständige Wortliste wurde heruntergeladen.";
        } catch (error) {
            console.error("Thai-Giga-Wortliste konnte nicht exportiert werden.", error);
            elements.wordDictionaryExportStatus.textContent =
                "Export fehlgeschlagen. Bitte erneut versuchen.";
        }
    }

    function exportSentenceList() {
        if (!content || !indexes || !elements.wordDictionaryExportStatus) {
            return;
        }

        try {
            downloadMarkdownDocument(
                buildSentenceListDocument(),
                "thai-giga-satzliste.md"
            );
            elements.wordDictionaryExportStatus.textContent =
                "Vollständige Satzliste wurde heruntergeladen.";
        } catch (error) {
            console.error("Thai-Giga-Satzliste konnte nicht exportiert werden.", error);
            elements.wordDictionaryExportStatus.textContent =
                "Export fehlgeschlagen. Bitte erneut versuchen.";
        }
    }

    function renderHierarchy() {
        if (!elements.hierarchy) {
            return;
        }

        const bosses = content.levels.flatMap(level => level.bosses);
        elements.hierarchy.innerHTML = `
            <div class="thai-giga-chapter-group">
                <p class="thai-giga-chapter-group-title">Grammatikbosse</p>
                ${bosses.map(boss => `
                    <button
                        class="thai-giga-chapter-button"
                        type="button"
                        data-boss-id="${escapeHtml(boss.id)}">
                        <strong>${escapeHtml(boss.title)}</strong>
                        <small>${escapeHtml(boss.grammarFocus)}</small>
                    </button>
                `).join("")}
            </div>
        `;

        elements.hierarchy.querySelectorAll("[data-boss-id]").forEach(button => {
            button.addEventListener("click", () => {
                const boss = bosses.find(candidate => candidate.id === button.dataset.bossId);
                if (boss) {
                    activeBossId = boss.id;
                    activeStory = Array.from(indexes.storiesById.values()).find(
                        story => story.bossId === boss.id
                    ) || null;
                    activeSentenceId = "";
                    window.history.replaceState(
                        null,
                        "",
                        `#${encodeURIComponent(boss.id)}`
                    );
                    if (elements.bossOverview) {
                        renderBossOverview(boss);
                        setThaiView("reader");
                        renderBlockList();
                        if (window.questAudio && window.thaiGigaAudio) {
                            initializeSentenceActions();
                        }
                    } else {
                        window.location.href =
                            `thai-giga.html#${encodeURIComponent(boss.id)}`;
                    }
                    closeSidebar();
                }
            });
        });
    }

    function renderThaiReminderWord(word) {
        return `
            <div class="thai-giga-reminder-word">
                <div class="thai-giga-reminder-thai-line">
                    <strong lang="th">${renderToneMarkup(
                        word.thai,
                        word.transliteration,
                        word.syllables || getWordSyllables(word.thai)
                    )}</strong>
                    ${renderReminderAudio(word.thai)}
                </div>
                <em>${escapeHtml(word.transliteration)}</em>
                <span>${escapeHtml(word.translation)}</span>
            </div>
        `;
    }

    function renderToneMarkedPhrase(phrase) {
        const matchingSentence = indexes &&
            Array.from(indexes.sentencesById.values()).find(sentence =>
                sentence.thai === phrase.thai &&
                sentence.transliteration === phrase.transliteration
            );

        if (!matchingSentence) {
            return renderToneMarkup(
                phrase.thai,
                phrase.transliteration,
                phrase.syllables || getWordSyllables(phrase.thai)
            );
        }

        return matchingSentence.tokens.map(token => {
            if (token.kind !== "word" || !token.wordId) {
                return escapeHtml(token.text);
            }

            const word = indexes.wordsById.get(token.wordId);
            return renderToneMarkup(
                token.text,
                word?.transliteration,
                word?.syllables
            );
        }).join("");
    }

    function renderReminderAudio(text) {
        if (!window.questAudio?.renderSentenceAudioPlayer) {
            return "";
        }

        return window.questAudio.renderSentenceAudioPlayer({
            audio: window.thaiGigaAudio?.getAudioForText(text) || {
                type: "speechSynthesis",
                lang: "th-TH"
            },
            text,
            className: "thai-giga-reminder-audio",
            ariaLabel: "Reminder vorlesen"
        });
    }

    function renderThaiReminderExample(example) {
        return `
            <div class="thai-giga-reminder-example">
                <div class="thai-giga-reminder-thai-line">
                    <strong lang="th">${renderToneMarkedPhrase(example)}</strong>
                    ${renderReminderAudio(example.thai)}
                </div>
                <em>${escapeHtml(example.transliteration)}</em>
                <span>${escapeHtml(example.translation)}</span>
            </div>
        `;
    }

    const REMINDER_WINDOW_SIZE = 50;
    const REMINDER_WORD_LIMIT = 20;

    function getBlockSentences(block) {
        return block.miniStories
            .flatMap(story => story.sentences)
            .map(sentence => indexes.sentencesById.get(sentence.id))
            .filter(Boolean);
    }

    function getReminderWindow(block, position) {
        const sentences = getBlockSentences(block);
        return position === "first"
            ? sentences.slice(0, REMINDER_WINDOW_SIZE)
            : sentences.slice(-REMINDER_WINDOW_SIZE);
    }

    function getContextualReminderWords(targetSentences) {
        const targetSentenceIds = new Set(targetSentences.map(sentence => sentence.id));
        const seenWordIds = new Set();
        const newWordIds = [];

        indexes.sentencesById.forEach(sentence => {
            const isTargetSentence = targetSentenceIds.has(sentence.id);
            sentence.tokens.forEach(token => {
                if (token.kind !== "word" || !token.wordId || seenWordIds.has(token.wordId)) {
                    return;
                }

                seenWordIds.add(token.wordId);
                if (isTargetSentence) {
                    newWordIds.push(token.wordId);
                }
            });
        });

        return newWordIds
            .slice(0, REMINDER_WORD_LIMIT)
            .map(wordId => indexes.wordsById.get(wordId))
            .filter(Boolean)
            .map(word => ({
                ...word,
                translation: word.meanings.join(" / ")
            }));
    }

    function getReminderRangeLabel(sentences) {
        if (!sentences.length) {
            return "";
        }

        return `${sentences[0].number}–${sentences[sentences.length - 1].number}`;
    }

    function getReminderPhraseParts(phrase) {
        const matchingSentence = indexes &&
            Array.from(indexes.sentencesById.values()).find(sentence =>
                sentence.thai === phrase.thai &&
                sentence.transliteration === phrase.transliteration
            );

        if (!matchingSentence) {
            return [];
        }

        return matchingSentence.tokens
            .filter(token => token.kind === "word" && token.wordId)
            .map(token => {
                const word = indexes.wordsById.get(token.wordId);
                return word
                    ? {
                        thai: token.text,
                        transliteration: word.transliteration,
                        translation: word.meanings.join(" / "),
                        syllables: word.syllables
                    }
                    : null;
            })
            .filter(Boolean);
    }

    function renderReminderContext(source, position) {
        const phrase = position === "first"
            ? source.pattern
            : source.question || source.systemExamples?.[0];
        const parts = phrase ? getReminderPhraseParts(phrase) : [];
        const lead = position === "first"
            ? source.patternLead || "Ein Beispiel aus diesem 50-Satz-Fenster"
            : source.questionLead || "Ein Beispiel aus diesem 50-Satz-Fenster";
        const closing = typeof source.closing === "string" && source.closing.length <= 140
            ? source.closing
            : "Achte darauf, wie die neuen Wörter hier mit bereits bekannten Strukturen verbunden werden.";
        const variations = position === "first"
            ? (source.discoveries || [])
                .slice(0, 2)
                .map(example => ({ example }))
            : [
                { lead: source.answerLead, example: source.answer },
                { lead: source.alternativeLead, example: source.alternative }
            ].filter(item => item.example).slice(0, 2);
        let previousVariationLead = lead;
        const variationMarkup = variations.length
            ? `
                <p class="thai-giga-introduction-lead">
                    ${escapeHtml(
                        position === "first"
                            ? "Weitere Verbindungen aus diesem Abschnitt:"
                            : "So reagiert das Muster im Gespräch:"
                    )}
                </p>
                <div class="thai-giga-reminder-examples">
                    ${variations.map(({ lead: variationLead, example }) => {
                        const leadMarkup = variationLead && variationLead !== previousVariationLead
                            ? `<p class="thai-giga-reminder-lead">${escapeHtml(variationLead)}</p>`
                            : "";
                        previousVariationLead = variationLead || previousVariationLead;
                        return `${leadMarkup}${renderThaiReminderExample(example)}`;
                    }).join("")}
                </div>
            `
            : "";

        if (!phrase) {
            return `<p class="thai-giga-reminder-explanation">${escapeHtml(closing)}</p>`;
        }

        return `
            <div class="thai-giga-reminder-context">
                <p class="thai-giga-reminder-lead">${escapeHtml(lead)}</p>
                <div class="thai-giga-introduction-example">
                    <div class="thai-giga-introduction-audio-line">
                        <p class="thai-giga-introduction-thai" lang="th">
                            ${renderToneMarkedPhrase(phrase)}
                        </p>
                        ${renderThaiIntroductionAudio(phrase.thai)}
                    </div>
                    <p class="thai-giga-introduction-transliteration">
                        <em>${escapeHtml(phrase.transliteration)}</em>
                    </p>
                    <p class="thai-giga-introduction-translation">
                        ${escapeHtml(phrase.translation)}
                    </p>
                </div>
                ${parts.length
                    ? `
                        <p class="thai-giga-introduction-lead">
                            Du kannst es hier als kleinen Baukasten sehen:
                        </p>
                        <div class="thai-giga-introduction-parts">
                            ${parts.map(part => `
                                <div class="thai-giga-introduction-part">
                                    <div class="thai-giga-introduction-audio-line">
                                        <strong lang="th">${renderIntroductionPart(part)}</strong>
                                        ${renderThaiIntroductionAudio(part.thai)}
                                    </div>
                                    <em>${escapeHtml(part.transliteration)}</em>
                                    <span>${escapeHtml(part.translation)}</span>
                                </div>
                            `).join("")}
                        </div>
                        <div class="thai-giga-introduction-assembly">
                            <p class="thai-giga-pattern-label">Also:</p>
                            <p class="thai-giga-introduction-thai" lang="th">
                                <strong>${parts.map(part => renderIntroductionPart(part)).join(" + ")}</strong>
                            </p>
                            <p class="thai-giga-introduction-transliteration">
                                <em>${escapeHtml(parts.map(part => part.transliteration).join(" + "))}</em>
                            </p>
                            <p class="thai-giga-introduction-translation">
                                <strong>${escapeHtml(parts.map(part => part.translation).join(" + "))}</strong>
                            </p>
                        </div>
                    `
                    : ""}
                ${variationMarkup}
                <p class="thai-giga-introduction-warning">
                    💡 <strong>Wichtig:</strong> ${escapeHtml(closing)}
                </p>
            </div>
        `;
    }

    function renderContextualReminder({ source, block, position, className, prefix }) {
        const sentences = getReminderWindow(block, position);
        const words = getContextualReminderWords(sentences);
        const rangeLabel = getReminderRangeLabel(sentences);
        const section = (source.sections || [])[0];
        const note = (source.sections || [])
            .map(section => section.note)
            .find(note => typeof note === "string" && note.trim()) ||
            (position === "first"
                ? source.lead
                : source.progress?.length > 40
                    ? source.progress
                    : source.progressSummary || source.message) ||
            "Diese Wörter wurden in den letzten 50 Sätzen erstmals verwendet. Ihre Bedeutung bleibt an den jeweiligen Satzkontext gebunden.";
        const sectionTitle = typeof section?.title === "string" ? section.title : "";
        const wordTitle = position === "first"
            ? sectionTitle.length <= 80
                ? sectionTitle || source.patternLead || source.message || "Neue Wörter"
                : source.patternLead || source.message || "Neue Wörter"
            : source.wordSectionTitle || source.heading || "Neue Wörter";

        return `
            <details class="${className}">
                <summary>${escapeHtml(prefix)} · SÄTZE ${escapeHtml(rangeLabel)}</summary>
                <div class="thai-giga-midpoint-content">
                    <p class="thai-giga-reminder-lead">${escapeHtml(wordTitle)}</p>
                    <p class="thai-giga-reminder-explanation">${escapeHtml(note)}</p>
                    <div class="thai-giga-reminder-words">
                        ${words.map(renderThaiReminderWord).join("")}
                    </div>
                    ${renderReminderContext(source, position)}
                </div>
            </details>
        `;
    }

    function renderThaiMidpointReminder(reminder, block) {
        if (!reminder || !block) {
            return "";
        }

        return renderContextualReminder({
            source: reminder,
            block,
            position: "first",
            className: "thai-giga-midpoint-reminder",
            prefix: "💎 REMINDER"
        });
    }

    function renderThaiBlockCompletion(completion, block) {
        if (!completion || !block) {
            return "";
        }

        return renderContextualReminder({
            source: completion,
            block,
            position: "last",
            className: "thai-giga-block-completion",
            prefix: "🏆 100er-REMINDER"
        });
    }

    function renderThaiIntroductionAudio(text) {
        if (!window.questAudio?.renderSentenceAudioPlayer) {
            return "";
        }

        return window.questAudio.renderSentenceAudioPlayer({
            audio: window.thaiGigaAudio?.getAudioForText(text) || {
                type: "speechSynthesis",
                lang: "th-TH"
            },
            text,
            className: "thai-giga-introduction-audio",
            playbackRate: 1
        });
    }

    function renderIntroductionPart(part) {
        return renderToneMarkup(
            part.thai,
            part.transliteration,
            part.syllables || getWordSyllables(part.thai)
        );
    }

    function renderIntroductionPhrase(phrase, parts, separator) {
        const validParts = Array.isArray(parts) &&
            parts.length > 0 &&
            parts.map(part => part.thai).join(separator) === phrase.thai;

        return validParts
            ? parts.map(renderIntroductionPart).join(separator)
            : renderToneMarkup(phrase.thai, phrase.transliteration, phrase.syllables);
    }

    function renderThaiIntroduction(introduction) {
        if (!elements.introduction) {
            return;
        }

        if (!introduction) {
            elements.introduction.hidden = true;
            elements.introduction.innerHTML = "";
            return;
        }

        elements.introduction.hidden = false;
        elements.introduction.innerHTML = `
            <details class="thai-giga-introduction-disclosure" open>
                <summary>🧩 Das Grundmuster</summary>
                <div class="thai-giga-introduction-content">
                    <div class="thai-giga-introduction-example">
                        <div class="thai-giga-introduction-audio-line">
                            <p class="thai-giga-introduction-thai" lang="th">
                                ${renderIntroductionPhrase(
                                    introduction.example,
                                    introduction.parts,
                                    ""
                                )}
                            </p>
                            ${renderThaiIntroductionAudio(introduction.example.thai)}
                        </div>
                        <p class="thai-giga-introduction-transliteration">
                            <em>${escapeHtml(introduction.example.transliteration)}</em>
                        </p>
                        <p class="thai-giga-introduction-translation">
                            ${escapeHtml(introduction.example.translation)}
                        </p>
                    </div>
                    <p class="thai-giga-introduction-lead">
                        Du kannst es zunächst als Baukasten sehen:
                    </p>
                    <div class="thai-giga-introduction-parts">
                        ${introduction.parts.map(part => `
                            <div class="thai-giga-introduction-part">
                                <div class="thai-giga-introduction-audio-line">
                                    <strong lang="th">${renderIntroductionPart(part)}</strong>
                                    ${renderThaiIntroductionAudio(part.thai)}
                                </div>
                                <em>${escapeHtml(part.transliteration)}</em>
                                <span>${escapeHtml(part.translation)}</span>
                            </div>
                        `).join("")}
                    </div>
                    <div class="thai-giga-introduction-assembly">
                        <p class="thai-giga-pattern-label">Also:</p>
                        <p class="thai-giga-introduction-thai" lang="th">
                            <strong>${renderIntroductionPhrase(
                                introduction.assembly,
                                introduction.parts,
                                " + "
                            )}</strong>
                        </p>
                        <p class="thai-giga-introduction-transliteration">
                            <em>${escapeHtml(introduction.assembly.transliteration)}</em>
                        </p>
                        <p class="thai-giga-introduction-translation">
                            <strong>${escapeHtml(introduction.assembly.translation)}</strong>
                        </p>
                    </div>
                    <p class="thai-giga-introduction-warning">
                        💡 <strong>Wichtig:</strong> ${escapeHtml(introduction.warning)}
                    </p>
                </div>
            </details>
        `;

        window.questAudio?.initializeSentenceAudioPlayers(elements.introduction);
    }

    function renderBossOverview(boss) {
        if (!boss) {
            elements.bossOverview.hidden = true;
            return;
        }

        const sentences = boss.blocks.flatMap(block =>
            block.miniStories.flatMap(story => story.sentences)
        );
        elements.bossOverview.hidden = false;
        elements.bossEyebrow.textContent = boss.title;
        elements.bossTitle.textContent = boss.grammarFocus;
        elements.bossDescription.textContent =
            boss.introduction?.description ||
            "Das aktive Grammatikmuster wird in den Situationen und Sätzen dieses Bosses wiederholt.";
        elements.sentenceCount.textContent = `${sentences.length} Beispielsätze`;
        if (elements.pattern) {
            elements.pattern.textContent = boss.grammarFocus;
        }
        if (elements.patternTranslation) {
            elements.patternTranslation.textContent =
                "Das aktive Grammatikmuster wird in den Situationen und Sätzen dieses Bosses wiederholt.";
        }
        if (elements.bossSpeedreading) {
            elements.bossSpeedreading.dataset.thaiGigaSpeedreadingBoss = boss.id;
        }
        renderThaiIntroduction(boss.introduction);
    }

    function renderBlockList() {
        if (!elements.blockList) {
            return;
        }

        const bosses = content.levels.flatMap(level => level.bosses);
        const activeBoss = bosses.find(boss => boss.id === activeBossId) || bosses[0];
        const blocks = activeBoss ? activeBoss.blocks : [];
        elements.blockList.innerHTML = blocks.map(block => `
            <details class="thai-giga-block">
                <summary class="thai-giga-block-summary" id="${escapeHtml(block.id)}-title">
                    <span class="thai-giga-block-summary-title">${escapeHtml(block.title)}</span>
                    <span class="thai-giga-block-summary-actions">
                        <button
                            class="thai-giga-block-speedreading-button"
                            type="button"
                            data-thai-giga-speedreading-block="${escapeHtml(block.id)}"
                            aria-label="Speedreading für diesen Foundation Block öffnen"
                            title="Speedreading für diesen Foundation Block öffnen">▶</button>
                        <button
                            class="thai-giga-block-playlist-button"
                            type="button"
                            data-thai-giga-block-playlist="${escapeHtml(block.id)}"
                            aria-label="Alle Sätze dieses Blocks zur Playlist hinzufügen"
                            title="Alle Sätze dieses Blocks zur Playlist hinzufügen">
                            + Block zur Playlist
                        </button>
                    </span>
                </summary>
                ${block.description
                    ? `<p class="thai-giga-block-description">${escapeHtml(block.description)}</p>`
                    : ""}
                ${block.miniStories.map((story, index) => `
                    <div class="thai-giga-level-shell">
                        <details class="thai-giga-level">
                            <summary class="thai-giga-level-summary">${escapeHtml(story.title)}</summary>
                            <div class="thai-giga-sentence-list">
                                ${story.sentences
                                    .map(sentence => renderSentence(indexes.sentencesById.get(sentence.id)))
                                    .join("")}
                            </div>
                        </details>
                        <button
                            class="thai-giga-level-playlist-button"
                            type="button"
                            data-thai-giga-story-playlist="${escapeHtml(story.id)}"
                            aria-label="Alle Sätze dieser Situation zur Playlist hinzufügen"
                            title="Alle Sätze dieser Situation zur Playlist hinzufügen">
                            + Situation zur Playlist
                        </button>
                    </div>
                    ${index === 4
                        ? renderThaiMidpointReminder(block.midpointReminder, block)
                        : ""}
                `).join("")}
                ${renderThaiBlockCompletion(block.completion, block)}
            </details>
        `).join("");

        elements.blockList
            .querySelectorAll("[data-thai-giga-block-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const sentenceIds = getBlockSentenceIds(
                        button.dataset.thaiGigaBlockPlaylist
                    );
                    if (arePlaylistSentencesAdded(sentenceIds)) {
                        window.thaiGigaAudio.removeSentences(sentenceIds);
                    } else {
                        window.thaiGigaAudio.addBlock(button.dataset.thaiGigaBlockPlaylist);
                    }
                    updatePlaylistButtons();
                });
            });
        elements.blockList
            .querySelectorAll("[data-thai-giga-story-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const sentenceIds = getStorySentenceIds(
                        button.dataset.thaiGigaStoryPlaylist
                    );
                    if (arePlaylistSentencesAdded(sentenceIds)) {
                        window.thaiGigaAudio.removeSentences(sentenceIds);
                    } else {
                        window.thaiGigaAudio.addStory(button.dataset.thaiGigaStoryPlaylist);
                    }
                    updatePlaylistButtons();
                });
            });
        updatePlaylistButtons();
    }

    function getChaiMaiPhrase(sentence, tokenIndex) {
        const token = sentence.tokens[tokenIndex];
        const nextToken = sentence.tokens[tokenIndex + 1];
        const thirdToken = sentence.tokens[tokenIndex + 2];
        if (
            sentence.id === "l1-b3-s1008" &&
            sentence.bossId === GRAMMAR_BOSS_3_ID &&
            token?.kind === "word" &&
            nextToken?.kind === "word" &&
            thirdToken?.kind === "word" &&
            token.text === "ไม่" &&
            nextToken.text === "ได้" &&
            thirdToken.text === "ไป" &&
            token.wordId &&
            nextToken.wordId &&
            thirdToken.wordId
        ) {
            const phraseTokens = [token, nextToken, thirdToken];
            const words = phraseTokens.map(currentToken =>
                indexes.wordsById.get(currentToken.wordId)
            );
            return {
                endIndex: tokenIndex + 2,
                wordId: token.wordId,
                thai: phraseTokens.map(currentToken => currentToken.text).join(""),
                transliteration: words
                    .map(word => word?.transliteration)
                    .filter(Boolean)
                    .join(" "),
                contextToken: token.text,
                contextMeaning: "nicht gehen / nicht mitgehen",
                meanings: ["nicht gehen / nicht mitgehen"],
                infoSentence:
                    "Verneint die vorangehende Frage; hier bedeutet die feste Einheit „nicht gehen / nicht mitgehen“.",
                toneMarkup: phraseTokens.map((currentToken, index) =>
                    renderToneMarkup(
                        currentToken.text,
                        words[index]?.transliteration,
                        words[index]?.syllables
                    )
                ).join("")
            };
        }
        const phraseDefinition = indexes.wordsById.get(CHAI_MAI_PHRASE_ID);
        const phraseParts = phraseDefinition?.phraseParts;
        const phraseTokens = Array.isArray(phraseParts)
            ? phraseParts.map((part, index) => sentence.tokens[tokenIndex + index])
            : [];
        if (
            !phraseDefinition ||
            !Array.isArray(phraseParts) ||
            phraseParts.length < 2 ||
            phraseTokens.length !== phraseParts.length ||
            phraseParts.some((part, index) => {
                const phraseToken = phraseTokens[index];
                return (
                    !phraseToken ||
                    phraseToken.kind !== "word" ||
                    phraseToken.text !== part.thai ||
                    phraseToken.wordId !== part.wordId
                );
            })
        ) {
            return null;
        }

        const words = phraseTokens.map(currentToken =>
            indexes.wordsById.get(currentToken.wordId)
        );
        const phraseBossContext = phraseDefinition.bossContexts?.[sentence.bossId];
        const contextExample = phraseBossContext?.contextExamples?.find(
            example => example.sentenceId === sentence.id
        );
        return {
            endIndex: tokenIndex + phraseParts.length - 1,
            wordId: phraseDefinition.id,
            thai: phraseDefinition.thai,
            transliteration: phraseDefinition.transliteration,
            contextToken: phraseDefinition.thai,
            contextMeaning:
                contextExample?.entryMeaningInSentence ||
                phraseTokens.map(currentToken => currentToken.contextMeaning).find(Boolean) ||
                "",
            meanings: phraseBossContext?.meanings || phraseDefinition.meanings || [],
            infoSentence:
                phraseBossContext?.infoSentence ||
                phraseDefinition.infoSentence ||
                "",
            toneMarkup: words
                .map((word, index) => renderToneMarkup(
                    phraseTokens[index].text,
                    word?.transliteration,
                    word?.syllables
                ))
                .join("")
        };
    }

    function getKoDaiPhrase(sentence, tokenIndex) {
        const phraseDefinition = indexes.wordsById.get(KO_DAI_PHRASE_ID);
        const phraseParts = phraseDefinition?.phraseParts;
        const phraseTokens = Array.isArray(phraseParts)
            ? phraseParts.map((part, index) => sentence.tokens[tokenIndex + index])
            : [];
        if (
            !phraseDefinition ||
            !Array.isArray(phraseParts) ||
            phraseParts.length < 2 ||
            phraseTokens.length !== phraseParts.length ||
            phraseParts.some((part, index) => {
                const phraseToken = phraseTokens[index];
                return (
                    !phraseToken ||
                    phraseToken.kind !== "word" ||
                    phraseToken.text !== part.thai ||
                    phraseToken.wordId !== part.wordId
                );
            })
        ) {
            return null;
        }

        const words = phraseTokens.map(currentToken =>
            indexes.wordsById.get(currentToken.wordId)
        );
        const phraseBossContext = phraseDefinition.bossContexts?.[sentence.bossId];
        const contextExample = phraseBossContext?.contextExamples?.find(
            example => example.sentenceId === sentence.id
        );
        return {
            endIndex: tokenIndex + phraseParts.length - 1,
            wordId: phraseDefinition.id,
            thai: phraseDefinition.thai,
            transliteration: phraseDefinition.transliteration,
            contextToken: phraseDefinition.thai,
            contextMeaning:
                contextExample?.entryMeaningInSentence ||
                phraseTokens.map(currentToken => currentToken.contextMeaning).find(Boolean) ||
                "",
            meanings: phraseBossContext?.meanings || phraseDefinition.meanings || [],
            infoSentence:
                phraseBossContext?.infoSentence ||
                phraseDefinition.infoSentence ||
                "",
            toneMarkup: words
                .map((word, index) => renderToneMarkup(
                    phraseTokens[index].text,
                    word?.transliteration,
                    word?.syllables
                ))
                .join("")
        };
    }

    function renderSentenceTokenMarkup(sentence, interactive = true) {
        let thaiOffset = 0;
        let previousToken = null;
        const tokenMarkup = [];

        for (let tokenIndex = 0; tokenIndex < sentence.tokens.length; tokenIndex += 1) {
            const token = sentence.tokens[tokenIndex];
            const phrase =
                getChaiMaiPhrase(sentence, tokenIndex) ||
                getKoDaiPhrase(sentence, tokenIndex);
            const renderedToken = phrase
                ? {
                    ...token,
                    wordId: phrase.wordId,
                    text: phrase.thai,
                    transliteration: phrase.transliteration,
                    toneMarkup: phrase.toneMarkup
                }
                : token;

            if (previousToken?.kind === "word" && token.kind === "word") {
                tokenMarkup.push(
                    '<span class="thai-giga-space-token thai-giga-generated-space"> </span>'
                );
            }

            const tokenStart = thaiOffset;
            thaiOffset += token.text.length;
            if (phrase) {
                thaiOffset += sentence.tokens[phrase.endIndex].text.length;
            }

            if (token.kind === "space") {
                const isRequiredSpace =
                    sentence.thai.slice(tokenStart, thaiOffset) === token.text;
                const spaceClass = isRequiredSpace
                    ? " thai-giga-space-token-is-required"
                    : "";
                tokenMarkup.push(
                    `<span class="thai-giga-space-token${spaceClass}">${escapeHtml(token.text)}</span>`
                );
                previousToken = token;
                continue;
            }

            if (!renderedToken.wordId) {
                tokenMarkup.push(`<span>${escapeHtml(renderedToken.text)}</span>`);
                previousToken = token;
                continue;
            }

            const standaloneQuestionMeaning =
                !phrase &&
                sentence.bossId === GRAMMAR_BOSS_1_ID &&
                token.text === "ไหม"
                    ? "?"
                    : "";
            const contextMeaning =
                standaloneQuestionMeaning ||
                phrase?.contextMeaning ||
                token.contextMeaning ||
                "";
            const contextAttribute = contextMeaning
                ? ` data-context-meaning="${escapeHtml(contextMeaning)}"`
                : "";
            const phraseAttributes = phrase
                ? ` data-phrase-thai="${escapeHtml(phrase.thai)}"` +
                    ` data-phrase-transliteration="${escapeHtml(phrase.transliteration)}"` +
                    ` data-phrase-context-token="${escapeHtml(phrase.contextToken)}"` +
                    ` data-phrase-context-meaning="${escapeHtml(phrase.contextMeaning || "")}"` +
                    ` data-phrase-meaning="${escapeHtml(phrase.meanings?.[0] || "")}"` +
                    ` data-phrase-info-sentence="${escapeHtml(phrase.infoSentence || "")}"`
                : "";
            const contextTitle = phrase
                ? "Wörterbuch öffnen – feste Einheit anzeigen"
                : contextMeaning
                    ? "Wörterbuch öffnen – Kontextbedeutung anzeigen"
                    : "Wörterbuch öffnen";
            const sentenceAttribute = ` data-sentence-id="${escapeHtml(sentence.id)}"`;
            const word = indexes.wordsById.get(renderedToken.wordId);
            const toneMarkup = renderedToken.toneMarkup || renderToneMarkup(
                renderedToken.text,
                word?.transliteration,
                word?.syllables
            );
            const tokenAttribute = renderedToken.id
                ? ` data-token-id="${escapeHtml(renderedToken.id)}"`
                : "";
            tokenMarkup.push(
                interactive
                    ? `<button class="thai-giga-word-button" type="button" data-word-id="${escapeHtml(
                        renderedToken.wordId
                    )}"${tokenAttribute}${sentenceAttribute}${contextAttribute}${phraseAttributes} title="${contextTitle}">${toneMarkup}</button>`
                    : `<span>${toneMarkup}</span>`
            );
            previousToken = renderedToken;
            if (phrase) {
                tokenIndex = phrase.endIndex;
            }
        }
        return tokenMarkup.join("");
    }

    function renderSentence(sentence) {
        const audioMarkup = window.questAudio.renderSentenceAudioPlayer({
            audio: window.thaiGigaAudio.getAudioForSentence(sentence.id) || sentence.audio,
            text: sentence.thai,
            className: "thai-giga-inline-audio",
            playbackRate: 1
        });

        return `
            <article
                class="thai-giga-sentence${sentence.id === activeSentenceId ? " is-highlighted" : ""}"
                id="thai-giga-sentence-${escapeHtml(sentence.id)}"
                data-sentence-id="${escapeHtml(sentence.id)}"
                data-sentence-number="${sentence.numberInStory}"
                tabindex="0"
                title="Tippen, um die deutsche Übersetzung ein- oder auszublenden">
                <span class="thai-giga-sentence-number">${sentence.numberInStory}.</span>
                <div>
                    <p class="thai-giga-thai" lang="th">${renderSentenceTokenMarkup(sentence)}</p>
                    <p class="thai-giga-transliteration">${escapeHtml(sentence.transliteration)}</p>
                    <p
                        class="thai-giga-translation"
                        id="thai-giga-translation-${escapeHtml(sentence.id)}"
                        data-thai-giga-translation-state="default">
                        ${escapeHtml(sentence.translation)}
                    </p>
                </div>
                ${audioMarkup}
                <button
                    class="thai-giga-playlist-button"
                    type="button"
                    data-thai-giga-playlist-sentence="${escapeHtml(sentence.id)}"
                    aria-label="Satz zur Playlist hinzufügen"
                    title="Satz zur Playlist hinzufügen">
                    + Playlist
                </button>
            </article>
        `;
    }

    function renderSpeedreadingSentence(sentence, displayNumber) {
        const audioMarkup = window.questAudio.renderSentenceAudioPlayer({
            audio: window.thaiGigaAudio.getAudioForSentence(sentence.id) || sentence.audio,
            text: sentence.thai,
            className: "thai-giga-speedreading-audio",
            playbackRate: 1
        });

        return `
            <article class="thai-giga-speedreading-line" data-sentence-id="${escapeHtml(sentence.id)}">
                <span class="thai-giga-speedreading-number">${displayNumber}.</span>
                <div class="thai-giga-speedreading-content">
                    <p class="thai-giga-thai" lang="th">${renderSentenceTokenMarkup(
                        sentence,
                        false
                    )}</p>
                    <p class="thai-giga-transliteration">${escapeHtml(sentence.transliteration)}</p>
                    <p class="thai-giga-translation">${escapeHtml(sentence.translation)}</p>
                </div>
                ${audioMarkup}
            </article>
        `;
    }

    function getSpeedreadingScope(scope, scopeId) {
        const bosses = content.levels.flatMap(level => level.bosses);
        const boss = scope === "boss"
            ? bosses.find(candidate => candidate.id === scopeId)
            : bosses.find(candidate => candidate.blocks.some(block => block.id === scopeId));
        if (!boss) {
            return null;
        }

        const blocks = scope === "boss"
            ? boss.blocks
            : boss.blocks.filter(block => block.id === scopeId);
        const sentences = blocks.flatMap(block =>
            block.miniStories.flatMap(story =>
                story.sentences
                    .map(sentence => indexes.sentencesById.get(sentence.id))
                    .filter(Boolean)
            )
        );

        return {
            boss,
            title: scope === "boss"
                ? `${boss.title} — ${boss.grammarFocus}`
                : blocks[0]?.title || "Foundation Block",
            scopeLabel: scope === "boss" ? "Grammatikboss" : "Foundation Block",
            sentences
        };
    }

    function openSpeedreading(scope, scopeId, trigger) {
        if (
            !elements.speedreading ||
            !elements.speedreadingScope ||
            !elements.speedreadingList ||
            !indexes
        ) {
            return;
        }

        const speedreadingScope = getSpeedreadingScope(scope, scopeId);
        if (!speedreadingScope) {
            return;
        }

        if (window.thaiGigaRsvp?.open) {
            window.thaiGigaRsvp.open(
                speedreadingScope.sentences,
                speedreadingScope.title,
                `${speedreadingScope.sentences.length} Sätze · ${speedreadingScope.boss.title}`,
                trigger
            );
            return;
        }

        speedreadingReturnFocus = trigger || document.activeElement;
        syncSpeedreadingVisibility();
        elements.speedreadingScope.textContent = "Speed Reading";
        elements.speedreadingList.innerHTML = speedreadingScope.sentences
            .map((sentence, index) => renderSpeedreadingSentence(sentence, index + 1))
            .join("");
        elements.speedreading.hidden = false;
        document.body.classList.add("thai-giga-speedreading-open");
        window.questAudio.initializeSentenceAudioPlayers(elements.speedreadingList);
        elements.speedreadingClose?.focus();
    }

    function closeSpeedreading() {
        if (!elements.speedreading || elements.speedreading.hidden) {
            return;
        }

        window.thaiGigaRsvp?.close();
        window.questAudio.stopSpeech();
        window.questAudio.stopNativeAudioPlayers();
        elements.speedreading.hidden = true;
        if (elements.speedreadingList) {
            elements.speedreadingList.innerHTML = "";
        }
        document.body.classList.remove("thai-giga-speedreading-open");
        const returnFocus = speedreadingReturnFocus;
        speedreadingReturnFocus = null;
        if (returnFocus && typeof returnFocus.focus === "function") {
            returnFocus.focus();
        }
    }

    function initializeSentenceActions() {
        window.questAudio.initializeSentenceAudioPlayers(elements.sentenceList);

        elements.sentenceList.querySelectorAll("[data-word-id]").forEach(button => {
            button.addEventListener("click", () =>
                showDictionary(
                    button.dataset.wordId,
                    button,
                    button.dataset.contextMeaning || "",
                    button.dataset.sentenceId || "",
                    button.dataset.tokenId || "",
                    button.dataset.phraseThai
                        ? {
                            thai: button.dataset.phraseThai,
                            transliteration: button.dataset.phraseTransliteration || "",
                            contextToken: button.dataset.phraseContextToken || "",
                            contextMeaning: button.dataset.phraseContextMeaning || "",
                            meanings: button.dataset.phraseMeaning
                                ? [button.dataset.phraseMeaning]
                                : [],
                            infoSentence: button.dataset.phraseInfoSentence || ""
                        }
                        : null
                )
            );
        });

        elements.sentenceList
            .querySelectorAll("[data-sentence-id]")
            .forEach(sentenceElement => {
                const translation = sentenceElement.querySelector(
                    "[data-thai-giga-translation-state]"
                );
                if (!translation) {
                    return;
                }
                const initiallyVisible =
                    document.body.dataset.thaiTranslationVisible !== "false";
                sentenceElement.setAttribute(
                    "aria-expanded",
                    String(initiallyVisible)
                );

                const toggleTranslation = () => {
                    const globallyVisible =
                        document.body.dataset.thaiTranslationVisible !== "false";
                    const state =
                        translation.dataset.thaiGigaTranslationState || "default";
                    const currentlyVisible =
                        state === "visible" ||
                        (state === "default" && globallyVisible);
                    const nextState = currentlyVisible ? "hidden" : "visible";

                    translation.dataset.thaiGigaTranslationState = nextState;
                    sentenceElement.setAttribute(
                        "aria-expanded",
                        String(nextState === "visible")
                    );
                };

                sentenceElement.addEventListener("click", event => {
                    if (event.target.closest("button, a, input, select, textarea")) {
                        return;
                    }
                    toggleTranslation();
                });
                sentenceElement.addEventListener("keydown", event => {
                    if (
                        event.target !== sentenceElement ||
                        (event.key !== "Enter" && event.key !== " ")
                    ) {
                        return;
                    }
                    event.preventDefault();
                    toggleTranslation();
                });
            });

        elements.sentenceList
            .querySelectorAll("[data-thai-giga-playlist-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentenceId = button.dataset.thaiGigaPlaylistSentence;
                    if (window.thaiGigaAudio.hasSentence(sentenceId)) {
                        window.thaiGigaAudio.removeSentence(sentenceId);
                    } else {
                        window.thaiGigaAudio.addSentence(sentenceId);
                    }
                    updatePlaylistButtons();
                });
            });

        updatePlaylistButtons();
    }

    function showStory(storyId, sentenceId = "") {
        const story = indexes.storiesById.get(storyId);
        if (!story) {
            return;
        }

        const bossChanged = activeBossId !== story.bossId;
        activeStory = story;
        activeSentenceId = sentenceId;
        activeBossId = story.bossId;
        const boss = content.levels
            .flatMap(level => level.bosses)
            .find(candidate => candidate.id === story.bossId);
        renderBossOverview(boss);
        setThaiView("reader");
        if (bossChanged && elements.blockList) {
            renderBlockList();
            if (window.questAudio && window.thaiGigaAudio) {
                initializeSentenceActions();
            }
        }
        window.thaiGigaDrill.saveProgress({
            levelId: story.levelId,
            bossId: story.bossId,
            blockId: story.blockId,
            storyId: story.id,
            sentenceId
        });

        elements.blockList
            .querySelectorAll(".thai-giga-level, .thai-giga-block")
            .forEach(details => {
                const containsStory = Array.from(
                    details.querySelectorAll("[data-sentence-id]")
                ).some(sentenceElement =>
                    indexes.sentencesById.get(sentenceElement.dataset.sentenceId)?.storyId === story.id
                );
                if (containsStory) {
                    details.open = true;
                }
            });
        elements.blockList
            .querySelectorAll(".thai-giga-sentence")
            .forEach(sentenceElement => {
                sentenceElement.classList.toggle(
                    "is-highlighted",
                    sentenceElement.dataset.sentenceId === sentenceId
                );
            });

        if (sentenceId) {
            requestAnimationFrame(() => {
                document
                    .getElementById(`thai-giga-sentence-${sentenceId}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
    }

    function getStorySentenceIds(storyId) {
        return indexes?.storiesById.get(storyId)?.sentences.map(sentence => sentence.id) || [];
    }

    function getBlockSentenceIds(blockId) {
        const sentenceIds = [];
        indexes?.storiesById.forEach(story => {
            if (story.blockId === blockId) {
                sentenceIds.push(...story.sentences.map(sentence => sentence.id));
            }
        });
        return sentenceIds;
    }

    function arePlaylistSentencesAdded(sentenceIds) {
        return sentenceIds.length > 0 &&
            sentenceIds.every(sentenceId => window.thaiGigaAudio.hasSentence(sentenceId));
    }

    function updatePlaylistButtons() {
        elements.sentenceList
            .querySelectorAll("[data-thai-giga-block-playlist]")
            .forEach(button => {
                const sentenceIds = getBlockSentenceIds(
                    button.dataset.thaiGigaBlockPlaylist
                );
                const isAdded = arePlaylistSentencesAdded(sentenceIds);
                button.classList.toggle("is-added", isAdded);
                button.textContent = isAdded
                    ? "✓ Block in Playlist"
                    : "+ Block zur Playlist";
                button.setAttribute(
                    "aria-label",
                    isAdded
                        ? "Alle Sätze dieses Blocks sind in der Playlist"
                        : "Alle Sätze dieses Blocks zur Playlist hinzufügen"
                );
                button.title = isAdded
                    ? "Alle Sätze dieses Blocks sind bereits in der Playlist"
                    : "Alle Sätze dieses Blocks zur Playlist hinzufügen";
            });

        elements.sentenceList
            .querySelectorAll("[data-thai-giga-story-playlist]")
            .forEach(button => {
                const sentenceIds = getStorySentenceIds(
                    button.dataset.thaiGigaStoryPlaylist
                );
                const isAdded = arePlaylistSentencesAdded(sentenceIds);
                button.classList.toggle("is-added", isAdded);
                button.textContent = isAdded
                    ? "✓ Situation in Playlist"
                    : "+ Situation zur Playlist";
                button.setAttribute(
                    "aria-label",
                    isAdded
                        ? "Alle Sätze dieser Situation sind in der Playlist"
                        : "Alle Sätze dieser Situation zur Playlist hinzufügen"
                );
                button.title = isAdded
                    ? "Alle Sätze dieser Situation sind bereits in der Playlist"
                    : "Alle Sätze dieser Situation zur Playlist hinzufügen";
            });

        elements.sentenceList
            .querySelectorAll("[data-thai-giga-playlist-sentence]")
            .forEach(button => {
                const sentenceId = button.dataset.thaiGigaPlaylistSentence;
                const isAdded = window.thaiGigaAudio.hasSentence(sentenceId);
                button.classList.toggle("is-added", isAdded);
                button.textContent = isAdded ? "− Playlist" : "+ Playlist";
                button.setAttribute(
                    "aria-label",
                    isAdded
                        ? "Satz aus Playlist entfernen"
                        : "Satz zur Playlist hinzufügen"
                );
                button.title = isAdded
                    ? "Satz aus Playlist entfernen"
                    : "Satz zur Playlist hinzufügen";
            });
    }

    function closeDictionary() {
        dictionaryAnchor = null;
        dictionaryDrag = null;
        elements.dictionary.hidden = true;
        elements.dictionary.removeAttribute("aria-labelledby");
        elements.dictionary.style.removeProperty("left");
        elements.dictionary.style.removeProperty("top");
        elements.dictionary.classList.remove("is-dragging");
    }

    function clampDictionaryPosition(left, top) {
        if (!elements.dictionary) {
            return { left, top };
        }

        const dictionaryRect = elements.dictionary.getBoundingClientRect();
        const margin = 16;
        const maxLeft = window.innerWidth - dictionaryRect.width - margin;
        const maxTop = window.innerHeight - dictionaryRect.height - margin;

        return {
            left: Math.min(Math.max(left, margin), Math.max(margin, maxLeft)),
            top: Math.min(Math.max(top, margin), Math.max(margin, maxTop))
        };
    }

    function beginDictionaryDrag(event) {
        if (!elements.dictionary || elements.dictionary.hidden) {
            return;
        }
        if (event.target.closest("button, summary, input, select, textarea, a")) {
            return;
        }

        const rect = elements.dictionary.getBoundingClientRect();
        dictionaryDrag = {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };
        elements.dictionary.classList.add("is-dragging");
        event.preventDefault();
    }

    function moveDictionaryDrag(event) {
        if (!dictionaryDrag || !elements.dictionary) {
            return;
        }

        const nextPosition = clampDictionaryPosition(
            event.clientX - dictionaryDrag.offsetX,
            event.clientY - dictionaryDrag.offsetY
        );
        elements.dictionary.style.left = `${nextPosition.left}px`;
        elements.dictionary.style.top = `${nextPosition.top}px`;
    }

    function endDictionaryDrag() {
        if (!elements.dictionary) {
            return;
        }
        dictionaryDrag = null;
        elements.dictionary.classList.remove("is-dragging");
    }

    window.addEventListener("pointermove", event => {
        if (dictionaryDrag) {
            moveDictionaryDrag(event);
        }
    });
    window.addEventListener("pointerup", endDictionaryDrag);
    window.addEventListener("pointercancel", endDictionaryDrag);

    function positionDictionary() {
        if (!dictionaryAnchor || elements.dictionary.hidden) {
            return;
        }

        const anchorRect = dictionaryAnchor.getBoundingClientRect();
        const dictionaryRect = elements.dictionary.getBoundingClientRect();
        const margin = 12;
        const edge = 16;
        let left = anchorRect.right + margin;
        if (left + dictionaryRect.width > window.innerWidth - edge) {
            left = anchorRect.left - dictionaryRect.width - margin;
        }
        left = Math.max(edge, Math.min(left, window.innerWidth - dictionaryRect.width - edge));

        let top = anchorRect.top;
        if (top + dictionaryRect.height > window.innerHeight - edge) {
            top = window.innerHeight - dictionaryRect.height - edge;
        }
        top = Math.max(edge, top);

        elements.dictionary.style.left = `${left}px`;
        elements.dictionary.style.top = `${top}px`;
    }

    function showDictionary(
        wordId,
        anchor,
        contextMeaning = "",
        sentenceId = "",
        tokenId = "",
        phrase = null
    ) {
        const word = indexes.wordsById.get(wordId);
        if (!word) {
            return;
        }

        const bossContext = activeBossId && word.bossContexts
            ? word.bossContexts[activeBossId]
            : null;
        const meanings = phrase?.meanings?.length
            ? phrase.meanings
            : bossContext?.meanings || word.meanings;
        const infoSentence =
            phrase?.infoSentence ||
            bossContext?.infoSentence ||
            word.infoSentence;
        const contextExample = bossContext?.contextExamples?.find(example =>
            example.sentenceId === sentenceId &&
            (!example.matchedTokenId || example.matchedTokenId === tokenId) &&
            (!example.matchedToken ||
                example.matchedToken === (phrase?.contextToken || anchor.textContent.trim()))
        );
        const sentenceMeaning =
            phrase?.contextMeaning ||
            contextMeaning ||
            contextExample?.entryMeaningInSentence ||
            "";
        const distinctMeanings = Array.from(new Set(
            meanings.map(meaning => meaning.trim()).filter(Boolean)
        ));
        const hasInfoSentence = infoSentence && infoSentence !== "Keine erforderlich.";
        const showSingleGlobalMeaning =
            distinctMeanings.length > 0;
        const generalMeaningMarkup = distinctMeanings.length > 1 ||
            showSingleGlobalMeaning ||
            hasInfoSentence
            ? `
                <div class="thai-giga-dictionary-meaning">
                    <div class="thai-giga-dictionary-meaning-header">DEUTSCHE BEDEUTUNG</div>
                    <div class="thai-giga-dictionary-meaning-body">
                        ${distinctMeanings.length > 1 || showSingleGlobalMeaning
                            ? `<p class="thai-giga-dictionary-meaning-text">${escapeHtml(
                                distinctMeanings.join(" / ")
                            )}</p>`
                            : ""}
                        ${hasInfoSentence
                            ? `
                                <div class="thai-giga-dictionary-meaning-info-label">Hinweis</div>
                                <p class="thai-giga-dictionary-meaning-info">${escapeHtml(infoSentence)}</p>
                            `
                            : ""}
                    </div>
                </div>
            `
            : "";
        const scopedContextSentenceIds = bossContext?.contextExamples
            ?.map(example => example.sentenceId)
            .filter(sentenceId => {
                const sentence = indexes.sentencesById.get(sentenceId);
                return sentence && (!activeBossId || sentence.bossId === activeBossId);
            }) || [];
        const indexedSentenceIds = indexes.sentenceIdsByWordId
            .get(wordId)
            ?.filter(sentenceId => {
                const sentence = indexes.sentencesById.get(sentenceId);
                return sentence && (!activeBossId || sentence.bossId === activeBossId);
            }) || [];
        const sentenceIds = Array.from(new Set(
            scopedContextSentenceIds.length > 0
                ? scopedContextSentenceIds
                : indexedSentenceIds
        ));
        dictionaryAnchor = anchor;
        elements.dictionary.innerHTML = `
            <div class="thai-giga-dictionary-header">
                <p class="thai-giga-eyebrow">Wörterbuch</p>
                <button
                    class="thai-giga-dictionary-close"
                    type="button"
                    aria-label="Wörterbuch schließen">×</button>
            </div>
            <div class="thai-giga-dictionary-word" lang="th">${renderToneMarkup(
                phrase?.thai || word.thai,
                phrase?.transliteration || word.transliteration,
                phrase?.syllables || word.syllables
            )}</div>
            <p class="thai-giga-dictionary-transliteration">${escapeHtml(
                phrase?.transliteration || word.transliteration
            )}</p>
            ${sentenceMeaning
                ? `
                    <div class="thai-giga-dictionary-context">
                        <strong>In diesem Satz gemeint als:</strong>
                        <span>${escapeHtml(sentenceMeaning)}</span>
                    </div>
                `
                : ""}
            ${generalMeaningMarkup}
            <details class="thai-giga-dictionary-examples">
                <summary>Beispiele in ${sentenceIds.length} Sätzen</summary>
                <div class="thai-giga-dictionary-sentences">
                    ${sentenceIds.map(sentenceId => {
                        const sentence = indexes.sentencesById.get(sentenceId);
                        return `
                            <button
                                class="thai-giga-dictionary-example"
                                type="button"
                                data-dictionary-sentence="${escapeHtml(sentenceId)}">
                                <span class="thai-giga-dictionary-example-thai" lang="th">
                                    ${renderSentenceTokenMarkup(sentence, false)}
                                </span>
                                <span class="thai-giga-dictionary-example-translation">
                                    ${escapeHtml(sentence.translation)}
                                </span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </details>
        `;
        elements.dictionary.hidden = false;
        positionDictionary();
        elements.dictionary.onpointerdown = beginDictionaryDrag;
        elements.dictionary.onpointermove = moveDictionaryDrag;
        elements.dictionary.onpointerup = endDictionaryDrag;
        elements.dictionary.onpointercancel = endDictionaryDrag;
        elements.dictionary
            .querySelectorAll("[data-dictionary-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentence = indexes.sentencesById.get(button.dataset.dictionarySentence);
                    if (!sentence) {
                        return;
                    }
                    closeDictionary();
                    showStory(sentence.storyId, sentence.id);
                    window.thaiGigaAudio.addSentence(sentence.id, true);
                });
            });
    }

    function showInitialStory() {
        const progress = window.thaiGigaDrill.getStoredProgress();
        const story = progress.storyId &&
            (!activeBossId || progress.bossId === activeBossId)
            ? indexes.storiesById.get(progress.storyId)
            : Array.from(indexes.storiesById.values()).find(
                candidate => !activeBossId || candidate.bossId === activeBossId
            );

        if (story && progress.sentenceId) {
            showStory(story.id, progress.sentenceId);
        } else if (story) {
            activeStory = story;
        }
    }

    async function initialize() {
        try {
            content = await window.thaiGigaDrill.loadContent();
            indexes = window.thaiGigaDrill.buildIndexes(content);
            if (content.levels.length === 0) {
                elements.emptyState.hidden = false;
                return;
            }

            const bosses = content.levels.flatMap(level => level.bosses);
            const requestedBossId = decodeURIComponent(window.location.hash.slice(1));
            const firstBoss = bosses.find(boss => boss.id === requestedBossId) || bosses[0];
            activeBossId = firstBoss?.id || "";
            renderHierarchy();
            if (elements.blockList) {
                await window.thaiGigaAudio.initialize(indexes);
                renderBlockList();
            } else if (window.thaiGigaAudio) {
                await window.thaiGigaAudio.loadVoiceConfig();
            }
            window.thaiGigaRsvp?.initialize(indexes);
            renderWordDictionaryVoiceOptions();
            renderWordDictionaryFilters();
            renderWordDictionary();
            if (elements.bossOverview && firstBoss) {
                renderBossOverview(firstBoss);
                setThaiView("reader");
                showInitialStory();
            }
            if (elements.sentenceList && window.thaiGigaAudio) {
                initializeSentenceActions();
            }
            if (window.location.hash === "#foreword" && elements.forewordButton) {
                showForeword();
            }
        } catch (error) {
            console.error(error);
            if (!elements.emptyState) {
                throw error;
            }
            elements.emptyState.hidden = false;
            elements.emptyState.innerHTML = `
                <h2>Content-Import fehlgeschlagen</h2>
                <p>${escapeHtml(error.message)}</p>
                <p>Der gesamte Datensatz bleibt deaktiviert, bis alle Fehler behoben sind.</p>
            `;
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
    elements.forewordButton?.addEventListener("click", showForeword);
    elements.blockList?.addEventListener("click", event => {
        const blockTrigger = event.target.closest("[data-thai-giga-speedreading-block]");
        if (blockTrigger) {
            event.preventDefault();
            event.stopPropagation();
            openSpeedreading(
                "block",
                blockTrigger.dataset.thaiGigaSpeedreadingBlock,
                blockTrigger
            );
            return;
        }
    });
    elements.bossSpeedreading?.addEventListener("click", event => {
        event.preventDefault();
        openSpeedreading(
            "boss",
            event.currentTarget.dataset.thaiGigaSpeedreadingBoss,
            event.currentTarget
        );
    });
    elements.speedreadingTransliteration?.addEventListener(
        "change",
        updateSpeedreadingVisibility
    );
    elements.speedreadingTranslation?.addEventListener(
        "change",
        updateSpeedreadingVisibility
    );
    elements.speedreadingClose?.addEventListener("click", closeSpeedreading);
    elements.speedreading?.addEventListener("click", event => {
        if (event.target === elements.speedreading) {
            closeSpeedreading();
        }
    });
    elements.dictionary?.addEventListener("click", event => {
        if (event.target.closest(".thai-giga-dictionary-close")) {
            closeDictionary();
        }
    });
    document.addEventListener("pointerdown", event => {
        if (elements.dictionary && !elements.dictionary.hidden) {
            const clickedInsideDictionary = elements.dictionary.contains(event.target);
            const clickedOnAnchor = dictionaryAnchor && dictionaryAnchor.contains(event.target);
            if (!clickedInsideDictionary && !clickedOnAnchor) {
                closeDictionary();
            }
        }
    });
    elements.wordDictionaryBossFilter?.addEventListener(
        "change",
        renderWordDictionary
    );
    elements.wordDictionaryScopeFilter?.addEventListener(
        "change",
        renderWordDictionary
    );
    elements.wordDictionaryVoice?.addEventListener("change", () => {
        localStorage.setItem(
            DICTIONARY_VOICE_STORAGE_KEY,
            elements.wordDictionaryVoice.value
        );
        window.questAudio?.stopSpeech();
        renderWordDictionary();
    });
    elements.wordDictionaryExport?.addEventListener("click", exportWordList);
    elements.sentenceListExport?.addEventListener("click", exportSentenceList);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && elements.speedreading && !elements.speedreading.hidden) {
            closeSpeedreading();
            return;
        }
        if (event.key === "Escape" && !elements.dictionary.hidden) {
            closeDictionary();
        }
    });
    window.addEventListener("resize", positionDictionary);

    window.addEventListener("thai-giga:audio-current", event => {
        const sentenceId = event.detail?.sentenceId;
        if (!sentenceId) {
            return;
        }

        activeSentenceId = sentenceId;
        elements.blockList?.querySelectorAll(".thai-giga-sentence")
            .forEach(sentenceElement => {
                sentenceElement.classList.toggle(
                    "is-highlighted",
                    sentenceElement.dataset.sentenceId === sentenceId
                );
            });
    });

    initialize();
})();
