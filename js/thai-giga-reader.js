(function () {
    "use strict";

    const elements = {
        sidebar: document.getElementById("thaiGigaSidebar"),
        sidebarBackdrop: document.getElementById("thaiGigaSidebarBackdrop"),
        sidebarToggle: document.getElementById("thaiGigaSidebarToggle"),
        hierarchy: document.getElementById("thaiGigaHierarchy"),
        bossOverview: document.getElementById("thaiGigaBossOverview"),
        bossEyebrow: document.getElementById("thaiGigaBossEyebrow"),
        bossTitle: document.getElementById("thaiGigaBossTitle"),
        bossDescription: document.getElementById("thaiGigaBossDescription"),
        sentenceCount: document.getElementById("thaiGigaSentenceCount"),
        introduction: document.getElementById("thaiGigaIntroduction"),
        pattern: document.getElementById("thaiGigaPattern"),
        patternTranslation: document.getElementById("thaiGigaPatternTranslation"),
        blockList: document.getElementById("thaiGigaBlockList"),
        emptyState: document.getElementById("thaiGigaEmptyState"),
        sentenceList: document.getElementById("thaiGigaBlockList"),
        dictionary: document.getElementById("thaiGigaDictionary"),
        wordDictionary: document.getElementById("thaiGigaWordDictionary"),
        wordDictionaryBossFilter: document.getElementById("thaiGigaWordDictionaryBossFilter"),
        wordDictionaryScopeFilter: document.getElementById("thaiGigaWordDictionaryScopeFilter"),
        wordDictionarySummary: document.getElementById("thaiGigaWordDictionarySummary"),
        wordDictionaryList: document.getElementById("thaiGigaWordDictionaryList"),
        wordDictionaryExport: document.getElementById("thaiGigaWordDictionaryExport"),
        sentenceListExport: document.getElementById("thaiGigaSentenceListExport"),
        wordDictionaryExportStatus: document.getElementById(
            "thaiGigaWordDictionaryExportStatus"
        )
    };

    let content = null;
    let indexes = null;
    let activeStory = null;
    let activeSentenceId = "";
    let activeBossId = "";
    let dictionaryAnchor = null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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

    function renderWordDictionaryEntry(entry) {
        const firstSentenceLabel = entry.firstSentence
            ? `Satz ${entry.firstSentence.numberInBoss}`
            : "Noch keinem Satz zugeordnet";
        const firstBossLabel = entry.firstBoss
            ? entry.firstBoss.title
            : "Nicht zugeordnet";

        return `
            <article class="thai-giga-word-card">
                <div class="thai-giga-word-card-main">
                    <strong lang="th">${escapeHtml(entry.thai)}</strong>
                    <em>${escapeHtml(entry.transliteration)}</em>
                    <span>${escapeHtml(entry.meanings.join(" / "))}</span>
                </div>
                <div class="thai-giga-word-card-meta">
                    <span>Neu in ${escapeHtml(firstBossLabel)}</span>
                    <small>${escapeHtml(firstSentenceLabel)}</small>
                </div>
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
            : "bekannte Wörter";
        elements.wordDictionarySummary.textContent =
            `${filteredEntries.length} ${scopeLabel} angezeigt · ` +
            `${entries.length} eindeutige Wörter insgesamt`;
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
            "Diese Liste enthält alle bisher bekannten eindeutigen Wörter. " +
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
            "Diese Liste enthält alle bisher bekannten Sätze in der Reihenfolge " +
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
                <strong lang="th">${escapeHtml(word.thai)}</strong>
                <em>${escapeHtml(word.transliteration)}</em>
                <span>${escapeHtml(word.translation)}</span>
            </div>
        `;
    }

    function renderThaiReminderExample(example) {
        return `
            <div class="thai-giga-reminder-example">
                <strong lang="th">${escapeHtml(example.thai)}</strong>
                <em>${escapeHtml(example.transliteration)}</em>
                <span>${escapeHtml(example.translation)}</span>
            </div>
        `;
    }

    function renderThaiMidpointReminder(reminder) {
        if (!reminder) {
            return "";
        }

        return `
            <details class="thai-giga-midpoint-reminder">
                <summary>${escapeHtml(reminder.title)}</summary>
                <div class="thai-giga-midpoint-content">
                    <p>${escapeHtml(reminder.message)}</p>
                    <p>${escapeHtml(reminder.lead)}</p>
                    ${reminder.sections.map(section => `
                        <section class="thai-giga-reminder-section">
                            <h4>${escapeHtml(section.title)}</h4>
                            <div class="thai-giga-reminder-words">
                                ${section.words.map(renderThaiReminderWord).join("")}
                            </div>
                        </section>
                    `).join("")}
                    <p class="thai-giga-reminder-pattern-lead">
                        ${escapeHtml(reminder.patternLead)}
                    </p>
                    ${renderThaiReminderExample(reminder.pattern)}
                    <div class="thai-giga-reminder-discoveries">
                        ${reminder.discoveries.map(renderThaiReminderExample).join("")}
                    </div>
                    <p class="thai-giga-reminder-closing">
                        ${escapeHtml(reminder.closing)}
                    </p>
                </div>
            </details>
        `;
    }

    function renderThaiBlockCompletion(completion) {
        if (!completion) {
            return "";
        }

        return `
            <details class="thai-giga-block-completion">
                <summary>${escapeHtml(completion.title)}</summary>
                <div class="thai-giga-completion-content">
                    <h3>${escapeHtml(completion.heading)}</h3>
                    <p>${escapeHtml(completion.message)}</p>
                    <p>${escapeHtml(completion.lead)}</p>
                    <h4>${escapeHtml(completion.wordSectionTitle)}</h4>
                    <div class="thai-giga-reminder-words">
                        ${completion.words.map(renderThaiReminderWord).join("")}
                    </div>
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.questionLead)}</p>
                    ${renderThaiReminderExample(completion.question)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.answerLead)}</p>
                    ${renderThaiReminderExample(completion.answer)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.alternativeLead)}</p>
                    ${renderThaiReminderExample(completion.alternative)}
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.possessionLead)}</p>
                    ${renderThaiReminderExample(completion.possession)}
                    <h3 class="thai-giga-completion-progress-title">
                        ${escapeHtml(completion.progressTitle)}
                    </h3>
                    <p class="thai-giga-completion-progress">${escapeHtml(completion.progress)}</p>
                    <p class="thai-giga-reminder-summary">${escapeHtml(completion.progressSummary)}</p>
                    <p class="thai-giga-reminder-lead">${escapeHtml(completion.systemLead)}</p>
                    <div class="thai-giga-reminder-examples">
                        ${completion.systemExamples.map(renderThaiReminderExample).join("")}
                    </div>
                    <p class="thai-giga-completion-final">${escapeHtml(completion.final)}</p>
                    <p class="thai-giga-completion-progress">
                        ${escapeHtml(completion.finalProgress)}
                    </p>
                </div>
            </details>
        `;
    }

    function renderThaiIntroductionAudio(text) {
        if (!window.questAudio?.renderSentenceAudioPlayer) {
            return "";
        }

        return window.questAudio.renderSentenceAudioPlayer({
            audio: { type: "speechSynthesis", lang: "th-TH" },
            text,
            className: "thai-giga-introduction-audio",
            playbackRate: 1
        });
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
                                ${escapeHtml(introduction.example.thai)}
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
                                    <strong lang="th">${escapeHtml(part.thai)}</strong>
                                    ${renderThaiIntroductionAudio(part.thai)}
                                </div>
                                <em>${escapeHtml(part.transliteration)}</em>
                                <span>${escapeHtml(part.translation)}</span>
                            </div>
                        `).join("")}
                    </div>
                    <div class="thai-giga-introduction-assembly">
                        <p class="thai-giga-pattern-label">Also:</p>
                        <div class="thai-giga-introduction-audio-line">
                            <p class="thai-giga-introduction-thai" lang="th">
                                <strong>${escapeHtml(introduction.assembly.thai)}</strong>
                            </p>
                            ${renderThaiIntroductionAudio(introduction.assembly.thai)}
                        </div>
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
                    <button
                        class="thai-giga-block-playlist-button"
                        type="button"
                        data-thai-giga-block-playlist="${escapeHtml(block.id)}"
                        aria-label="Alle Sätze dieses Blocks zur Playlist hinzufügen"
                        title="Alle Sätze dieses Blocks zur Playlist hinzufügen">
                        + Block zur Playlist
                    </button>
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
                    ${index === 4 ? renderThaiMidpointReminder(block.midpointReminder) : ""}
                `).join("")}
                ${renderThaiBlockCompletion(block.completion)}
            </details>
        `).join("");

        elements.blockList
            .querySelectorAll("[data-thai-giga-block-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.thaiGigaAudio.addBlock(button.dataset.thaiGigaBlockPlaylist);
                });
            });
        elements.blockList
            .querySelectorAll("[data-thai-giga-story-playlist]")
            .forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.thaiGigaAudio.addStory(button.dataset.thaiGigaStoryPlaylist);
                });
            });
    }

    function renderSentence(sentence) {
        const tokenMarkup = sentence.tokens
            .map(token => token.wordId
                ? `
                    <button
                        class="thai-giga-word-button"
                        type="button"
                        data-word-id="${escapeHtml(token.wordId)}"
                        title="Wörterbuch öffnen">${escapeHtml(token.text)}</button>
                `
                : `<span>${escapeHtml(token.text)}</span>`)
            .join("");
        const audioMarkup = window.questAudio.renderSentenceAudioPlayer({
            audio: sentence.audio,
            text: sentence.thai,
            className: "thai-giga-inline-audio"
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
                    <p class="thai-giga-thai" lang="th">${tokenMarkup}</p>
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

    function initializeSentenceActions() {
        window.questAudio.initializeSentenceAudioPlayers(elements.sentenceList);

        elements.sentenceList.querySelectorAll("[data-word-id]").forEach(button => {
            button.addEventListener("click", () =>
                showDictionary(button.dataset.wordId, button)
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

    function updatePlaylistButtons() {
        elements.sentenceList
            .querySelectorAll("[data-thai-giga-playlist-sentence]")
            .forEach(button => {
                const sentenceId = button.dataset.thaiGigaPlaylistSentence;
                const isAdded = window.thaiGigaAudio.hasSentence(sentenceId);
                button.textContent = isAdded ? "− Playlist" : "+ Playlist";
                button.setAttribute(
                    "aria-label",
                    isAdded
                        ? "Satz aus Playlist entfernen"
                        : "Satz zur Playlist hinzufügen"
                );
            });
    }

    function closeDictionary() {
        dictionaryAnchor = null;
        elements.dictionary.hidden = true;
        elements.dictionary.removeAttribute("aria-labelledby");
        elements.dictionary.style.removeProperty("left");
        elements.dictionary.style.removeProperty("top");
    }

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

    function showDictionary(wordId, anchor) {
        const word = indexes.wordsById.get(wordId);
        if (!word) {
            return;
        }

        dictionaryAnchor = anchor;
        const sentenceIds = indexes.sentenceIdsByWordId.get(wordId) || [];
        elements.dictionary.innerHTML = `
            <div class="thai-giga-dictionary-header">
                <p class="thai-giga-eyebrow">Wörterbuch</p>
                <button
                    class="thai-giga-dictionary-close"
                    type="button"
                    aria-label="Wörterbuch schließen">×</button>
            </div>
            <div class="thai-giga-dictionary-word" lang="th">${escapeHtml(word.thai)}</div>
            <p class="thai-giga-dictionary-transliteration">${escapeHtml(word.transliteration)}</p>
            <div class="thai-giga-dictionary-meaning">
                ${word.meanings.map(meaning => `<div>${escapeHtml(meaning)}</div>`).join("")}
            </div>
            <details class="thai-giga-dictionary-examples">
                <summary>Beispiele in ${sentenceIds.length} Sätzen</summary>
                <div class="thai-giga-dictionary-sentences">
                    ${sentenceIds.map(sentenceId => {
                        const sentence = indexes.sentencesById.get(sentenceId);
                        const story = indexes.storiesById.get(sentence.storyId);
                        return `
                            <button class="thai-giga-dictionary-sentence"
                                    type="button"
                                    data-dictionary-sentence="${escapeHtml(sentenceId)}">
                                ${escapeHtml(story.title)} · Satz ${sentence.numberInStory}
                            </button>
                        `;
                    }).join("")}
                </div>
            </details>
        `;
        elements.dictionary.hidden = false;
        positionDictionary();

        elements.dictionary
            .querySelectorAll("[data-dictionary-sentence]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const sentence = indexes.sentencesById.get(button.dataset.dictionarySentence);
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
                renderBlockList();
            }
            renderWordDictionaryFilters();
            renderWordDictionary();
            if (elements.bossOverview && firstBoss) {
                renderBossOverview(firstBoss);
                showInitialStory();
            }
            if (elements.sentenceList && window.thaiGigaAudio) {
                window.thaiGigaAudio.initialize(indexes);
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
    elements.dictionary?.addEventListener("click", event => {
        if (event.target.closest(".thai-giga-dictionary-close")) {
            closeDictionary();
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
    elements.wordDictionaryExport?.addEventListener("click", exportWordList);
    elements.sentenceListExport?.addEventListener("click", exportSentenceList);
    document.addEventListener("keydown", event => {
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
