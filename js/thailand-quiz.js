(function () {
    "use strict";

    const STORAGE_KEY = "thailandQuizStats";
    const PREFERENCES_KEY = "thailandQuizPreferences";
    const CUSTOM_WORDS_KEY = "thailandQuizCustomWords";
    const OPTION_ORDER_STORAGE_KEY = "thailandQuizOptionOrders";
    const DEFAULT_PLAYER_AVATAR_ID = "avatar10";
    const BUTLER_AVATAR_PATH = "../assets/ui/monk-mentor.png";
    const FONT_STORAGE_KEY = "thaiFontFamily";
    const TONE_COLORS_STORAGE_KEY = "thaiGigaToneColors";
    const WORD_SEPARATION_STORAGE_KEY = "thaiGigaWordSeparation";
    const DEFAULT_FONT = "sarabun";
    const FONT_FAMILIES = {
        standard: '"Noto Serif Thai", "Times New Roman", Times, serif',
        "noto-sans-thai": '"Noto Sans Thai", sans-serif',
        sarabun: '"Sarabun", sans-serif',
        prompt: '"Prompt", sans-serif',
        kanit: '"Kanit", sans-serif'
    };
    const root = document.getElementById("thailandQuizView");
    if (!root) {
        return;
    }

    const data = window.THAILAND_QUIZ_DATA;
    const engine = window.THAILAND_QUIZ_ENGINE;
    const vocabularyApi = window.THAILAND_QUIZ_VOCABULARY;
    if (!data || !engine || !vocabularyApi) {
        throw new Error("Die Thailand-Quiz-Module konnten nicht geladen werden.");
    }
    const validationErrors = engine.validateQuestionBank(data);
    if (validationErrors.length > 0) {
        throw new Error(`Thailand-Quiz-Fragebank ungültig:\n${validationErrors.join("\n")}`);
    }

    const elements = {
        chatLog: document.getElementById("thqChatLog"),
        turnStatus: document.getElementById("thqTurnStatus"),
        choices: document.getElementById("thqChoices"),
        timer: document.getElementById("thqTimer"),
        startButton: document.getElementById("thqStartButton"),
        submitButton: document.getElementById("thqSubmitButton"),
        nextButton: document.getElementById("thqNextButton"),
        headerLevel: document.getElementById("thqHeaderLevel"),
        headerPoints: document.getElementById("thqHeaderPoints"),
        headerRound: document.getElementById("thqHeaderRound"),
        profileButton: document.getElementById("thqProfileButton"),
        profile: document.getElementById("thqProfile"),
        profileClose: document.getElementById("thqProfileClose"),
        profileAvatar: document.getElementById("thqProfileAvatar"),
        profilePoints: document.getElementById("thqProfilePoints"),
        profileLevel: document.getElementById("thqProfileLevel"),
        profileStats: document.getElementById("thqProfileStats"),
        germanQuickToggle: document.getElementById("thqGermanQuickToggle"),
        settingsButton: document.getElementById("thqSettingsButton"),
        settings: document.getElementById("thqSettings"),
        settingsClose: document.getElementById("thqSettingsClose"),
        fontSelect: document.getElementById("thqFontSelect"),
        toneColorsToggle: document.getElementById("thqToneColorsToggle"),
        wordSeparationToggle: document.getElementById("thqWordSeparationToggle"),
        transliterationToggle: document.getElementById("thqTransliterationToggle"),
        germanToggle: document.getElementById("thqGermanToggle"),
        categoryFilters: document.getElementById("thqCategoryFilters"),
        difficultyFilters: document.getElementById("thqDifficultyFilters"),
        roundLength: document.getElementById("thqRoundLength"),
        roundLengthValue: document.getElementById("thqRoundLengthValue"),
        endlessToggle: document.getElementById("thqEndlessToggle"),
        definitionOverlay: document.getElementById("thqWordDefinition"),
        definitionClose: document.getElementById("thqDefinitionClose"),
        definitionTitle: document.getElementById("thqDefinitionTitle"),
        definitionTransliteration: document.getElementById("thqDefinitionTransliteration"),
        definitionMeanings: document.getElementById("thqDefinitionMeanings"),
        definitionContext: document.getElementById("thqDefinitionContext"),
        wordForm: document.getElementById("thqWordForm"),
        wordFormTitle: document.getElementById("thqWordFormTitle"),
        wordThai: document.getElementById("thqWordThai"),
        wordTransliteration: document.getElementById("thqWordTransliteration"),
        wordMeaning: document.getElementById("thqWordMeaning"),
        wordSyllables: document.getElementById("thqWordSyllables"),
        wordReadings: document.getElementById("thqWordReadings"),
        wordFormError: document.getElementById("thqWordFormError")
    };

    const stats = engine.normalizeStats(readStoredObject(STORAGE_KEY));
    let preferences = normalizePreferences(readStoredObject(PREFERENCES_KEY));
    let lastOptionOrders = readStoredObject(OPTION_ORDER_STORAGE_KEY);
    let customWords = readStoredArray(CUSTOM_WORDS_KEY);
    let vocabulary = vocabularyApi.createVocabulary({
        quizWords: window.THAILAND_QUIZ_WORDS?.words || [],
        customWords
    });
    let gigaIndexes = null;
    let round = [];
    let roundIndex = -1;
    let endlessCycle = null;
    let currentEndlessMode = false;
    let currentQuestionOptions = [];
    let selectedIds = new Set();
    let currentAnswer = null;
    let roundFinished = false;
    let endlessQuestionCount = 0;
    let roundCorrect = 0;
    let roundPoints = 0;
    let elapsedBeforeQuestion = 0;
    let questionStartedAt = null;
    let timerInterval = null;
    let returnFocusElement = null;
    let gigaDictionaryUnavailable = false;
    let wordSeparation = localStorage.getItem(WORD_SEPARATION_STORAGE_KEY) !== "false";
    let currentQuestionMessage = null;

    function readStoredObject(key) {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return {};
        }
        try {
            const value = JSON.parse(stored);
            return value && typeof value === "object" && !Array.isArray(value) ? value : {};
        } catch (error) {
            console.warn(`Quiz-Einstellung ${key} ist ungültig und wird ignoriert.`, error);
            return {};
        }
    }

    function readStoredArray(key) {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return [];
        }
        try {
            const value = JSON.parse(stored);
            if (!Array.isArray(value)) {
                throw new TypeError("Der gespeicherte Wert ist keine Liste.");
            }
            return value;
        } catch (error) {
            console.error(`Gespeicherte Quiz-Wörter (${key}) konnten nicht gelesen werden.`, error);
            appendButlerText("Dein lokales Quiz-Glossar konnte nicht gelesen werden. Bitte prüfe den Browser-Speicher.");
            return [];
        }
    }

    function normalizePreferences(value) {
        return {
            categories: Array.isArray(value.categories)
                ? value.categories.filter(id => data.categories.some(category => category.id === id))
                : data.categories.map(category => category.id),
            difficulties: Array.isArray(value.difficulties)
                ? value.difficulties.map(Number).filter(level => Number.isInteger(level) && level >= 1 && level <= 5)
                : [1, 2, 3, 4, 5],
            roundLength: Number.isInteger(Number(value.roundLength))
                ? Math.min(100, Math.max(1, Number(value.roundLength)))
                : 10,
            endless: value.endless === true,
            transliteration: value.transliteration === true,
            german: value.german === true
        };
    }

    function savePreferences() {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    }

    function saveStats() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }

    function getDateKey(date = new Date()) {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    }

    function getElapsedSeconds() {
        const activeMilliseconds = questionStartedAt === null
            ? 0
            : Date.now() - questionStartedAt;
        return elapsedBeforeQuestion + activeMilliseconds / 1000;
    }

    function scrollChatToBottom() {
        elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
    }

    function resetChatQuestionCentering() {
        currentQuestionMessage?.style.removeProperty("margin-block-start");
        currentQuestionMessage = null;
        elements.chatLog.classList.remove("is-centering-first");
        elements.chatLog.style.removeProperty("--thq-chat-bottom-space");
    }

    function centerQuestionInChat(message) {
        currentQuestionMessage = message;
        if (elements.chatLog.classList.contains("is-centering-first")) {
            return;
        }
        window.requestAnimationFrame(() => {
            if (!message.isConnected) {
                return;
            }
            message.style.removeProperty("margin-block-start");
            const chatBounds = elements.chatLog.getBoundingClientRect();
            const messageBounds = message.getBoundingClientRect();
            const targetScrollTop = elements.chatLog.scrollTop +
                messageBounds.top -
                chatBounds.top -
                elements.chatLog.clientTop -
                (elements.chatLog.clientHeight - messageBounds.height) / 2;
            if (targetScrollTop < 0) {
                message.style.marginBlockStart = `${-targetScrollTop}px`;
                return;
            }
            const currentBottomSpace = Number.parseFloat(
                getComputedStyle(elements.chatLog).getPropertyValue("--thq-chat-bottom-space")
            ) || 0;
            const maxScrollTop = elements.chatLog.scrollHeight - elements.chatLog.clientHeight;
            const extraBottomSpace = Math.max(0, targetScrollTop - maxScrollTop);
            if (extraBottomSpace > 0) {
                elements.chatLog.style.setProperty(
                    "--thq-chat-bottom-space",
                    `${currentBottomSpace + extraBottomSpace}px`
                );
            }
            const updatedMaxScrollTop =
                elements.chatLog.scrollHeight - elements.chatLog.clientHeight;
            elements.chatLog.scrollTop = Math.max(
                0,
                Math.min(targetScrollTop, updatedMaxScrollTop)
            );
        });
    }

    function makeMessage(role, label, detail) {
        const article = document.createElement("article");
        article.className = `thq-message thq-message--${role}`;
        const avatar = document.createElement("div");
        avatar.className = "thq-message-avatar";
        avatar.setAttribute("aria-hidden", "true");
        const avatarImage = document.createElement("img");
        avatarImage.alt = "";
        avatarImage.src = role === "user" ? getPlayerAvatarPath() : BUTLER_AVATAR_PATH;
        avatar.append(avatarImage);
        const content = document.createElement("div");
        content.className = "thq-message-content";
        const byline = document.createElement("div");
        byline.className = "thq-message-byline";
        const name = document.createElement("strong");
        name.textContent = role === "user" ? "Du" : "Dein Mentor";
        const note = document.createElement("span");
        note.textContent = detail;
        byline.append(name, note);
        content.append(byline);
        article.append(avatar, content);
        elements.chatLog.append(article);
        return content;
    }

    function getPlayerAvatarPath() {
        const savedAvatarId = localStorage.getItem("profileAvatar");
        const avatarId = /^avatar(?:[1-9]|1[01])$/.test(savedAvatarId || "")
            ? savedAvatarId
            : DEFAULT_PLAYER_AVATAR_ID;
        return `../assets/ui/avatars/${avatarId}.png`;
    }

    function renderThai(container, text) {
        container.classList.add("thq-thai-text");
        vocabulary.render(container, text, openDefinition);
    }

    function appendButlerText(text, detail = "") {
        const content = makeMessage("butler", "Dein Mentor", detail);
        const paragraph = document.createElement("p");
        renderThai(paragraph, text);
        content.append(paragraph);
        scrollChatToBottom();
    }

    function appendRichParagraph(content, text, className = "") {
        const paragraph = document.createElement("p");
        if (className) {
            paragraph.className = className;
        }
        renderThai(paragraph, text);
        content.append(paragraph);
        return paragraph;
    }

    function appendAssistLine(content, text, kind, className = "") {
        if (!text) {
            return null;
        }
        const line = document.createElement("p");
        line.className = `thq-assist-line ${className}`.trim();
        line.dataset.assist = kind;
        line.textContent = text;
        line.hidden = kind === "transliteration"
            ? !preferences.transliteration
            : !preferences.german;
        content.append(line);
        return line;
    }

    function updateAssistVisibility() {
        for (const line of elements.chatLog.querySelectorAll("[data-assist]")) {
            line.hidden = line.dataset.assist === "transliteration"
                ? !preferences.transliteration
                : !preferences.german;
        }
        const question = getCurrentQuestion();
        if (question) {
            renderChoices(question);
        }
    }

    function updateGermanQuickToggle() {
        const enabled = preferences.german;
        elements.germanQuickToggle.setAttribute("aria-pressed", String(enabled));
        elements.germanQuickToggle.setAttribute(
            "aria-label",
            enabled ? "Deutsch ausschalten" : "Deutsch einschalten"
        );
        elements.germanQuickToggle.title = enabled ? "Deutsch ausblenden" : "Deutsch anzeigen";
        elements.germanQuickToggle.classList.toggle("is-active", enabled);
    }

    function setGermanPreference(enabled) {
        preferences.german = enabled;
        elements.germanToggle.checked = enabled;
        savePreferences();
        updateGermanQuickToggle();
        updateAssistVisibility();
    }

    function renderStats() {
        const level = engine.getQuizLevel(stats.totalQuizPoints);
        elements.headerLevel.textContent = String(level);
        elements.headerPoints.textContent = String(stats.totalQuizPoints);
        elements.profilePoints.textContent = String(stats.totalQuizPoints);
        elements.profileLevel.textContent = `Quiz-Level ${level}`;
        const accuracy = stats.totalQuestionsAnswered === 0
            ? 0
            : Math.round(stats.correctAnswers / stats.totalQuestionsAnswered * 100);
        const rows = [
            ["Beantwortete Fragen", stats.totalQuestionsAnswered],
            ["Richtig beantwortet", `${stats.correctAnswers} (${accuracy}%)`],
            ["Abgeschlossene Runden", stats.roundsCompleted],
            ["Aktuelle Serie", stats.currentStreak],
            ["Beste Serie", stats.bestStreak]
        ];
        elements.profileStats.replaceChildren();
        for (const [label, value] of rows) {
            const term = document.createElement("dt");
            term.textContent = label;
            const description = document.createElement("dd");
            description.textContent = String(value);
            elements.profileStats.append(term, description);
        }
    }

    function updateTimer() {
        elements.timer.textContent = `${Math.floor(getElapsedSeconds())} s`;
    }

    function stopTimer() {
        if (timerInterval !== null) {
            window.clearInterval(timerInterval);
            timerInterval = null;
        }
        if (questionStartedAt !== null) {
            elapsedBeforeQuestion += (Date.now() - questionStartedAt) / 1000;
            questionStartedAt = null;
        }
    }

    function resumeTimer() {
        if (
            questionStartedAt !== null ||
            !round.length ||
            currentAnswer ||
            roundIndex < 0 ||
            roundFinished
        ) {
            return;
        }
        questionStartedAt = Date.now();
        updateTimer();
        timerInterval = window.setInterval(updateTimer, 250);
    }

    function updateRoundHeader() {
        if (roundFinished) {
            elements.headerRound.textContent = "—";
        } else if (currentEndlessMode && endlessCycle) {
            elements.headerRound.textContent = `∞ · ${endlessQuestionCount + 1}`;
        } else if (round.length && roundIndex >= 0) {
            elements.headerRound.textContent = `${roundIndex + 1}/${round.length}`;
        } else {
            elements.headerRound.textContent = "—";
        }
    }

    function setSelectionState(choice, toggle, option, question) {
        const isSelected = selectedIds.has(option.id);
        toggle.setAttribute("aria-pressed", String(isSelected));
        toggle.disabled = Boolean(currentAnswer);
        if (currentAnswer) {
            if (question.correctAnswers.includes(option.id)) {
                choice.classList.add("is-correct");
            } else if (isSelected) {
                choice.classList.add("is-incorrect");
            }
        }
    }

    function prepareQuestionOptions(question) {
        const previousOrder = Array.isArray(lastOptionOrders[question.id])
            ? lastOptionOrders[question.id]
            : [];
        currentQuestionOptions = engine.shuffleOptions(
            question.options,
            previousOrder,
            Math.random,
            question.correctAnswers
        );
        lastOptionOrders[question.id] = currentQuestionOptions.map(option => option.id);
        localStorage.setItem(OPTION_ORDER_STORAGE_KEY, JSON.stringify(lastOptionOrders));
    }

    function renderChoices(question) {
        elements.choices.replaceChildren();
        for (const option of currentQuestionOptions) {
            const choice = document.createElement("div");
            choice.className = "thq-choice";
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "thq-choice-toggle";
            toggle.setAttribute("aria-label", `Antwort auswählen: ${option.de}`);
            toggle.textContent = selectedIds.has(option.id) ? "✓" : "";
            const content = document.createElement("div");
            content.className = "thq-choice-content";
            const thai = document.createElement("span");
            thai.className = "thq-choice-thai";
            renderThai(thai, option.th);
            content.append(thai);
            appendAssistLine(content, option.transliteration, "transliteration");
            appendAssistLine(content, option.de, "german");
            choice.append(toggle, content);
            setSelectionState(choice, toggle, option, question);
            const selectOption = () => {
                if (currentAnswer) {
                    return;
                }
                if (question.type !== "multiple_choice") {
                    selectedIds.clear();
                }
                if (selectedIds.has(option.id)) {
                    selectedIds.delete(option.id);
                } else {
                    selectedIds.add(option.id);
                }
                renderChoices(question);
                elements.submitButton.disabled = selectedIds.size === 0;
            };
            toggle.addEventListener("click", selectOption);
            choice.addEventListener("click", event => {
                if (!event.target.closest(".thq-word") && !event.target.closest(".thq-choice-toggle")) {
                    selectOption();
                }
            });
            elements.choices.append(choice);
        }
    }

    function appendQuestion(question) {
        const category = data.categories.find(item => item.id === question.categoryId);
        const content = makeMessage(
            "butler",
            "Dein Mentor",
            `${category?.de || "Thailand"} · Schwierigkeit ${question.difficulty}/5`
        );
        appendRichParagraph(content, question.question.th, "thq-message--question");
        appendAssistLine(content, question.transliteration.question, "transliteration");
        appendAssistLine(content, question.question.de, "german");
        return content.closest(".thq-message");
    }

    function appendUserAnswer(question) {
        resetChatQuestionCentering();
        const selectedOptions = question.options.filter(option => selectedIds.has(option.id));
        const content = makeMessage("user", "Du", "Deine Antwort");
        for (const option of selectedOptions) {
            appendRichParagraph(content, option.th, "thq-message--question");
            appendAssistLine(content, option.transliteration, "transliteration");
            appendAssistLine(content, option.de, "german");
        }
        scrollChatToBottom();
    }

    function appendAnswerFeedback(question, answer) {
        const content = makeMessage(
            "butler",
            "Dein Mentor",
            answer.isCorrect ? "Richtig" : "Noch nicht richtig"
        );
        const feedback = document.createElement("p");
        feedback.className = answer.isCorrect
            ? "thq-feedback is-correct"
            : "thq-feedback is-incorrect";
        feedback.textContent = answer.isCorrect
            ? `ถูกต้อง · +${answer.points} Quizpunkte`
            : "ยังไม่ถูกต้อง · Für diese Antwort gibt es keine Punkte.";
        content.append(feedback);
        appendRichParagraph(content, question.explanation.th, "thq-message--explanation");
        appendAssistLine(
            content,
            question.transliteration.explanation,
            "transliteration",
            "thq-message--explanation"
        );
        appendAssistLine(
            content,
            question.explanation.de,
            "german",
            "thq-message--explanation"
        );
        if (question.sources?.length) {
            const sources = document.createElement("ul");
            for (const source of question.sources) {
                const item = document.createElement("li");
                const link = document.createElement("a");
                link.href = source.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = source.title;
                item.append(link);
                sources.append(item);
            }
            content.append(sources);
        }
        scrollChatToBottom();
    }

    function renderCurrentQuestion() {
        const question = currentEndlessMode
            ? endlessCycle?.currentQuestion
            : round[roundIndex];
        if (!question) {
            return;
        }
        updateRoundHeader();
        prepareQuestionOptions(question);
        const questionMessage = appendQuestion(question);
        renderChoices(question);
        elements.choices.hidden = false;
        elements.startButton.hidden = true;
        elements.submitButton.hidden = false;
        elements.submitButton.disabled = selectedIds.size === 0;
        elements.nextButton.hidden = true;
        elements.timer.hidden = false;
        elements.turnStatus.textContent = question.type === "multiple_choice"
            ? "Wähle alle richtigen Antworten aus."
            : "Wähle eine Antwort aus.";
        centerQuestionInChat(questionMessage);
        resumeTimer();
    }

    function getCurrentQuestion() {
        return currentEndlessMode
            ? endlessCycle?.currentQuestion || null
            : round[roundIndex] || null;
    }

    function getActiveFilters() {
        return {
            categories: [...elements.categoryFilters.querySelectorAll("input:checked")]
                .map(input => input.value),
            difficulties: [...elements.difficultyFilters.querySelectorAll("input:checked")]
                .map(input => Number(input.value))
        };
    }

    function startRound() {
        stopTimer();
        const filters = getActiveFilters();
        const filteredQuestions = engine.filterQuestions(data.questions, filters);
        if (filteredQuestions.length === 0) {
            elements.turnStatus.textContent = "Mit diesen Filtern gibt es keine passenden Fragen. Wähle mindestens eine Kategorie und Schwierigkeit.";
            elements.startButton.hidden = false;
            return;
        }

        preferences.endless = elements.endlessToggle.checked;
        currentEndlessMode = preferences.endless;
        preferences.roundLength = Number(elements.roundLength.value);
        savePreferences();
        round = [];
        roundIndex = -1;
        endlessCycle = null;
        currentQuestionOptions = [];
        endlessQuestionCount = 0;
        selectedIds = new Set();
        currentAnswer = null;
        roundFinished = false;
        roundCorrect = 0;
        roundPoints = 0;
        elapsedBeforeQuestion = 0;
        elements.chatLog.replaceChildren();
        elements.chatLog.scrollTop = 0;
        elements.chatLog.classList.remove("is-centering-first");
        elements.chatLog.style.removeProperty("--thq-chat-bottom-space");

        if (currentEndlessMode) {
            endlessCycle = {
                cycle: engine.createEndlessCycle(filteredQuestions),
                currentQuestion: null
            };
            endlessCycle.currentQuestion = endlessCycle.cycle.next();
            round = [endlessCycle.currentQuestion];
        } else {
            round = engine.selectRound(
                data.questions,
                stats.recentQuestionIds,
                Math.random,
                preferences.roundLength,
                filters
            );
            roundIndex = 0;
        }
        elements.chatLog.classList.add("is-centering-first");
        if (gigaDictionaryUnavailable) {
            appendButlerText(
                "Hinweis: Das GigaDrill-Wörterbuch ist nicht verfügbar; dieses Quiz verwendet deshalb nur seine eigenen Glossareinträge.",
                "Wörterbuchhinweis"
            );
        }
        renderCurrentQuestion();
    }

    function submitAnswer() {
        if (selectedIds.size === 0) {
            elements.turnStatus.textContent = "Wähle zuerst eine Antwort aus.";
            return;
        }
        const question = getCurrentQuestion();
        if (!question || currentAnswer) {
            return;
        }
        stopTimer();
        const result = engine.recordAnswer(
            stats,
            question,
            [...selectedIds],
            getElapsedSeconds(),
            getDateKey()
        );
        Object.assign(stats, result.stats);
        currentAnswer = result.answer;
        if (result.answer.isCorrect) {
            roundCorrect++;
            roundPoints += result.answer.points;
        }
        saveStats();
        if (result.xpAwarded > 0) {
            if (typeof window.awardPlayerXp !== "function") {
                throw new Error("Die zentrale Spieler-XP-Funktion ist nicht verfügbar.");
            }
            window.awardPlayerXp(result.xpAwarded);
        }
        appendUserAnswer(question);
        appendAnswerFeedback(question, result.answer);
        renderStats();
        renderChoices(question);
        elements.submitButton.hidden = true;
        elements.nextButton.hidden = false;
        elements.timer.hidden = true;
        elements.turnStatus.textContent = result.answer.isCorrect
            ? "Gut gemacht! Lies die Erklärung oder fahre fort."
            : "Lies die Erklärung und fahre fort.";
        updateRoundHeader();
    }

    function finishRound() {
        if (roundFinished) {
            return;
        }
        roundFinished = true;
        stopTimer();
        Object.assign(stats, engine.completeRound(
            stats,
            round.map(question => question.id)
        ));
        saveStats();
        renderStats();
        resetChatQuestionCentering();
        const content = makeMessage("butler", "Dein Mentor", "Runde abgeschlossen");
        const summary = document.createElement("p");
        summary.textContent =
            `Runde abgeschlossen: ${roundCorrect} von ${round.length} richtig, ${roundPoints} Quizpunkte.`;
        content.append(summary);
        const level = document.createElement("p");
        level.textContent =
            `Quiz-Level ${engine.getQuizLevel(stats.totalQuizPoints)} · ${stats.totalQuizPoints} Gesamtpunkte · beste Serie ${stats.bestStreak}`;
        content.append(level);
        elements.choices.hidden = true;
        elements.nextButton.hidden = true;
        elements.submitButton.hidden = true;
        elements.startButton.hidden = false;
        elements.startButton.textContent = "Neue Quizrunde starten";
        elements.turnStatus.textContent = "Runde abgeschlossen. Du kannst direkt eine neue starten.";
        elements.timer.hidden = true;
        updateRoundHeader();
        scrollChatToBottom();
    }

    function nextQuestion() {
        if (!currentAnswer) {
            return;
        }
        if (currentEndlessMode) {
            endlessQuestionCount++;
            endlessCycle.currentQuestion = endlessCycle.cycle.next();
            round = [endlessCycle.currentQuestion];
        } else if (roundIndex + 1 >= round.length) {
            finishRound();
            return;
        } else {
            roundIndex++;
        }
        currentAnswer = null;
        selectedIds = new Set();
        elapsedBeforeQuestion = 0;
        renderCurrentQuestion();
    }

    function createFilterOptions(container, name, options, selectedValues) {
        container.replaceChildren();
        for (const option of options) {
            const label = document.createElement("label");
            label.className = "thq-filter-option";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.name = name;
            input.value = String(option.value);
            input.checked = selectedValues.includes(option.value);
            const text = document.createElement("span");
            text.textContent = option.label;
            label.append(input, text);
            container.append(label);
        }
    }

    function initializeSettings() {
        createFilterOptions(
            elements.categoryFilters,
            "thqCategory",
            data.categories.map(category => ({
                value: category.id,
                label: `${category.icon} ${category.de}`
            })),
            preferences.categories
        );
        createFilterOptions(
            elements.difficultyFilters,
            "thqDifficulty",
            [1, 2, 3, 4, 5].map(value => ({
                value,
                label: `Stufe ${value}`
            })),
            preferences.difficulties
        );
        const font = localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT;
        elements.fontSelect.value = Object.hasOwn(FONT_FAMILIES, font) ? font : DEFAULT_FONT;
        document.body.style.setProperty("--thai-font-family", FONT_FAMILIES[elements.fontSelect.value]);
        const toneColors = localStorage.getItem(TONE_COLORS_STORAGE_KEY);
        elements.toneColorsToggle.checked = toneColors === null || toneColors === "true";
        document.body.dataset.thaiToneColors = String(elements.toneColorsToggle.checked);
        elements.wordSeparationToggle.checked = wordSeparation;
        document.body.dataset.thaiWordSeparation = String(wordSeparation);
        elements.transliterationToggle.checked = preferences.transliteration;
        elements.germanToggle.checked = preferences.german;
        updateGermanQuickToggle();
        elements.roundLength.value = String(preferences.roundLength);
        elements.roundLengthValue.value = String(preferences.roundLength);
        elements.roundLengthValue.textContent = String(preferences.roundLength);
        elements.endlessToggle.checked = preferences.endless;
        elements.roundLength.disabled = preferences.endless;
    }

    function openOverlay(overlay, button) {
        returnFocusElement = button;
        overlay.hidden = false;
        button.setAttribute("aria-expanded", "true");
        overlay.querySelector('[role="dialog"] button')?.focus();
    }

    function closeOverlay(overlay, button) {
        overlay.hidden = true;
        button.setAttribute("aria-expanded", "false");
        button.focus();
    }

    function updateWordForm(word, thai) {
        const hasSyllables = word?.syllables?.length > 0 &&
            word.syllables.every(syllable =>
                syllable &&
                typeof syllable.thai === "string" &&
                typeof syllable.transliteration === "string"
            ) &&
            word.syllables.map(syllable => syllable.thai).join("") === thai;
        elements.wordForm.hidden = Boolean(word && hasSyllables);
        elements.wordFormTitle.textContent = word
            ? "Quiz-Glossareintrag ergänzen"
            : "Neuen Quiz-Glossareintrag anlegen";
        elements.wordFormError.hidden = true;
        elements.wordFormError.textContent = "";
        elements.wordThai.value = thai;
        elements.wordTransliteration.value = word?.transliteration || "";
        elements.wordMeaning.value = word?.meanings?.[0] || "";
        elements.wordSyllables.value = word?.syllables?.length
            ? word.syllables.map(syllable => syllable.thai).join("|")
            : thai;
        elements.wordReadings.value = word?.syllables?.length
            ? word.syllables.map(syllable => syllable.transliteration).join("|")
            : "";
    }

    function openDefinition(word, thai) {
        returnFocusElement = document.activeElement;
        elements.definitionTitle.textContent = thai;
        elements.definitionTransliteration.textContent = word?.transliteration || "";
        elements.definitionMeanings.replaceChildren();
        const meanings = word?.meanings || [];
        if (meanings.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Für dieses Wort gibt es noch keine Definition.";
            elements.definitionMeanings.append(empty);
        } else {
            for (const meaning of meanings) {
                const paragraph = document.createElement("p");
                paragraph.textContent = meaning;
                elements.definitionMeanings.append(paragraph);
            }
        }
        elements.definitionContext.hidden =
            word?.source !== "giga" && !word?.canonicalId;
        elements.definitionContext.textContent =
            word?.source === "giga" || word?.canonicalId
            ? "Verknüpft mit dem kanonischen GigaDrill-Wörterbuch."
            : "";
        updateWordForm(word, thai);
        elements.definitionOverlay.hidden = false;
        elements.definitionClose.focus();
    }

    function makeWordId(thai) {
        return `quiz-custom-${[...thai]
            .map(character => character.codePointAt(0).toString(16))
            .join("-")}`;
    }

    function saveNewWord(event) {
        event.preventDefault();
        const thai = elements.wordThai.value.trim();
        const meaning = elements.wordMeaning.value.trim();
        const transliteration = elements.wordTransliteration.value.trim();
        const syllables = elements.wordSyllables.value.split("|").map(part => part.trim());
        const readingsValue = elements.wordReadings.value.trim();
        const readings = readingsValue
            ? readingsValue.split("|").map(part => part.trim())
            : syllables.map(() => "");
        if (!thai || !meaning || !/\p{Script=Thai}/u.test(thai)) {
            showWordFormError("Bitte trage ein Thai-Wort und eine kurze Bedeutung ein.");
            return;
        }
        if (
            syllables.length === 0 ||
            syllables.some(syllable => !syllable) ||
            syllables.join("") !== thai ||
            readings.length !== syllables.length ||
            readings.some(reading => !reading && readingsValue)
        ) {
            showWordFormError("Die Silben müssen das Wort exakt ergeben. Falls du Umschriften einträgst, muss eine je Silbe angegeben sein.");
            return;
        }
        const entry = {
            id: makeWordId(thai),
            thai,
            transliteration,
            meanings: [meaning],
            canonicalId: vocabulary.find(thai)?.id || "",
            syllables: syllables.map((syllable, index) => ({
                thai: syllable,
                transliteration: readings[index]
            }))
        };
        const existingIndex = customWords.findIndex(word => word.thai === thai);
        if (existingIndex >= 0) {
            customWords[existingIndex] = entry;
        } else {
            customWords.push(entry);
        }
        try {
            localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
        } catch (error) {
            console.error("Quiz-Glossar-Eintrag konnte nicht gespeichert werden.", error);
            showWordFormError("Der Eintrag konnte im Browser-Speicher nicht gespeichert werden.");
            return;
        }
        rebuildVocabulary();
        openDefinition(entry, thai);
    }

    function showWordFormError(message) {
        elements.wordFormError.textContent = message;
        elements.wordFormError.hidden = false;
    }

    function rebuildVocabulary() {
        vocabulary = vocabularyApi.createVocabulary({
            gigaWords: gigaIndexes ? [...gigaIndexes.wordsById.values()] : [],
            quizWords: window.THAILAND_QUIZ_WORDS?.words || [],
            customWords
        });
    }

    function initializeEvents() {
        elements.startButton.addEventListener("click", startRound);
        elements.submitButton.addEventListener("click", submitAnswer);
        elements.nextButton.addEventListener("click", nextQuestion);
        elements.profileButton.addEventListener("click", () =>
            openOverlay(elements.profile, elements.profileButton)
        );
        elements.profileClose.addEventListener("click", () =>
            closeOverlay(elements.profile, elements.profileButton)
        );
        elements.settingsButton.addEventListener("click", () =>
            openOverlay(elements.settings, elements.settingsButton)
        );
        elements.settingsClose.addEventListener("click", () =>
            closeOverlay(elements.settings, elements.settingsButton)
        );
        elements.definitionClose.addEventListener("click", () => {
            elements.definitionOverlay.hidden = true;
            returnFocusElement?.focus();
        });
        elements.definitionOverlay.addEventListener("click", event => {
            if (event.target === elements.definitionOverlay) {
                elements.definitionOverlay.hidden = true;
                returnFocusElement?.focus();
            }
        });
        for (const [overlay, button] of [
            [elements.profile, elements.profileButton],
            [elements.settings, elements.settingsButton]
        ]) {
            overlay.addEventListener("click", event => {
                if (event.target === overlay) {
                    closeOverlay(overlay, button);
                }
            });
        }
        elements.wordForm.addEventListener("submit", saveNewWord);
        elements.fontSelect.addEventListener("change", () => {
            document.body.style.setProperty(
                "--thai-font-family",
                FONT_FAMILIES[elements.fontSelect.value]
            );
            localStorage.setItem(FONT_STORAGE_KEY, elements.fontSelect.value);
        });
        elements.toneColorsToggle.addEventListener("change", () => {
            document.body.dataset.thaiToneColors = String(elements.toneColorsToggle.checked);
            localStorage.setItem(TONE_COLORS_STORAGE_KEY, String(elements.toneColorsToggle.checked));
        });
        elements.wordSeparationToggle.addEventListener("change", () => {
            wordSeparation = elements.wordSeparationToggle.checked;
            document.body.dataset.thaiWordSeparation = String(wordSeparation);
            localStorage.setItem(WORD_SEPARATION_STORAGE_KEY, String(wordSeparation));
        });
        elements.transliterationToggle.addEventListener("change", () => {
            preferences.transliteration = elements.transliterationToggle.checked;
            savePreferences();
            updateAssistVisibility();
        });
        elements.germanToggle.addEventListener("change", () => {
            setGermanPreference(elements.germanToggle.checked);
        });
        elements.germanQuickToggle.addEventListener("click", () => {
            setGermanPreference(!preferences.german);
        });
        elements.categoryFilters.addEventListener("change", () => {
            preferences.categories = getActiveFilters().categories;
            savePreferences();
        });
        elements.difficultyFilters.addEventListener("change", () => {
            preferences.difficulties = getActiveFilters().difficulties;
            savePreferences();
        });
        elements.roundLength.addEventListener("input", () => {
            preferences.roundLength = Number(elements.roundLength.value);
            elements.roundLengthValue.value = elements.roundLength.value;
            elements.roundLengthValue.textContent = elements.roundLength.value;
            savePreferences();
        });
        elements.endlessToggle.addEventListener("change", () => {
            preferences.endless = elements.endlessToggle.checked;
            elements.roundLength.disabled = preferences.endless;
            savePreferences();
        });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopTimer();
            } else {
                resumeTimer();
            }
        });
        document.addEventListener("keydown", event => {
            if (event.key !== "Escape") {
                return;
            }
            if (!elements.definitionOverlay.hidden) {
                elements.definitionOverlay.hidden = true;
                returnFocusElement?.focus();
            } else if (!elements.profile.hidden) {
                closeOverlay(elements.profile, elements.profileButton);
            } else if (!elements.settings.hidden) {
                closeOverlay(elements.settings, elements.settingsButton);
            }
        });
    }

    async function initialize() {
        initializeSettings();
        initializeEvents();
        renderStats();
        elements.profileAvatar.src = getPlayerAvatarPath();
        try {
            const content = await window.thaiGigaDrill.loadContent();
            gigaIndexes = window.thaiGigaDrill.buildIndexes(content);
            rebuildVocabulary();
        } catch (error) {
            gigaDictionaryUnavailable = true;
            console.error("GigaDrill-Wörterbuch für das Thailand-Quiz konnte nicht geladen werden.", error);
            appendButlerText(
                "Das GigaDrill-Wörterbuch konnte nicht geladen werden. Das Quiz-Glossar bleibt verfügbar; neue Wörter kannst du hier separat ergänzen.",
                "Wörterbuch nicht verfügbar"
            );
        }
    }

    initialize();
})();
