(function () {
    "use strict";

    const NUMPAD_LAYOUTS = ["standard", "laptop"];
    const SENTENCE_ORDERS = ["original", "shuffle"];
    const NUMPAD_LAYOUT_STORAGE_KEY = "thaiGigaDrill:v1:sentence-mix-numpad-layout";
    const SENTENCE_ORDER_STORAGE_KEY = "thaiGigaDrill:v1:sentence-mix-sentence-order";

    function readNumpadLayout() {
        if (typeof window === "undefined" || !window.localStorage) {
            return "standard";
        }

        try {
            const savedLayout = window.localStorage.getItem(NUMPAD_LAYOUT_STORAGE_KEY);
            return NUMPAD_LAYOUTS.includes(savedLayout) ? savedLayout : "standard";
        } catch (error) {
            console.warn("Satzmix-Numpad-Einstellung konnte nicht gelesen werden.", error);
            return "standard";
        }
    }

    function writeNumpadLayout(layout) {
        if (typeof window === "undefined" || !window.localStorage) {
            return;
        }

        try {
            window.localStorage.setItem(NUMPAD_LAYOUT_STORAGE_KEY, layout);
        } catch (error) {
            console.warn("Satzmix-Numpad-Einstellung konnte nicht gespeichert werden.", error);
        }
    }

    function readSentenceOrder() {
        if (typeof window === "undefined" || !window.localStorage) {
            return "original";
        }

        try {
            const savedOrder = window.localStorage.getItem(SENTENCE_ORDER_STORAGE_KEY);
            return SENTENCE_ORDERS.includes(savedOrder) ? savedOrder : "original";
        } catch (error) {
            console.warn("Satzmix-Satzreihenfolge konnte nicht gelesen werden.", error);
            return "original";
        }
    }

    function writeSentenceOrder(order) {
        if (typeof window === "undefined" || !window.localStorage) {
            return;
        }

        try {
            window.localStorage.setItem(SENTENCE_ORDER_STORAGE_KEY, order);
        } catch (error) {
            console.warn("Satzmix-Satzreihenfolge konnte nicht gespeichert werden.", error);
        }
    }

    function shuffleArray(array) {
        const shuffled = array.slice();
        for (let index = shuffled.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            const temporary = shuffled[index];
            shuffled[index] = shuffled[randomIndex];
            shuffled[randomIndex] = temporary;
        }
        return shuffled;
    }

    function SentenceMixUI() {
        this.sentences = [];
        this.allSentences = [];
        this.currentIndex = 0;
        this.stageContainer = null;
        this.currentRound = null;
        this.currentLiveDisplayEl = null;
        this.feedbackContainerEl = null;
        this.activePillElements = new Map();
        this.roundState = "idle"; // "idle" | "playing" | "evaluated"
        this.solvedCount = 0;
        this.totalDurationMs = 0;
        this.numpadLayout = readNumpadLayout();
        this.sentenceOrder = readSentenceOrder();
    }

    SentenceMixUI.prototype.init = async function (options) {
        options = options || {};
        this.stageContainer = document.getElementById("sentenceMixStageContainer") || document.getElementById("sentenceMixChatArea");

        try {
            const contentUrl = options.contentUrl || "../data/thai-giga-drill.v1.json";
            const source = options.source ||
                new URLSearchParams(window.location.search).get("source") ||
                "all";
            this.allSentences = source === "playlist"
                ? await window.SentenceMixAdapter.loadPlaylist(contentUrl)
                : await window.SentenceMixAdapter.loadContent(contentUrl);
            this.applySentenceOrder();
            this.setupSettings();
            this.applyNumpadLayout();

            if (this.sentences.length === 0) {
                this.renderSystemMessage(
                    source === "playlist"
                        ? "Die Audio-Playlist enthält keine spielbaren Sätze für den Satzmix."
                        : "Keine spielbaren Sätze im Giga-Drill gefunden."
                );
                return;
            }

            this.setupInputHandlers();
            this.startNextRound();
        } catch (error) {
            console.error("Fehler beim Initialisieren des Satzmix-Modus:", error);
            this.renderSystemMessage("Fehler beim Laden der Spieldaten: " + error.message);
        }
    };

    SentenceMixUI.prototype.setupSettings = function () {
        const panel = document.getElementById("sentenceMixSettings");
        const openButton = document.getElementById("sentenceMixSettingsButton");
        const closeButton = document.getElementById("sentenceMixSettingsClose");
        const layoutInputs = document.querySelectorAll('input[name="sentenceMixNumpadLayout"]');
        const orderInputs = document.querySelectorAll('input[name="sentenceMixSentenceOrder"]');

        if (!panel || !openButton || !closeButton) {
            return;
        }

        const closePanel = () => {
            panel.hidden = true;
            openButton.setAttribute("aria-expanded", "false");
        };

        openButton.addEventListener("click", () => {
            panel.hidden = false;
            openButton.setAttribute("aria-expanded", "true");
        });
        closeButton.addEventListener("click", closePanel);
        panel.addEventListener("click", event => {
            if (event.target === panel) {
                closePanel();
            }
        });
        window.addEventListener("keydown", event => {
            if (event.key === "Escape" && !panel.hidden) {
                event.preventDefault();
                event.stopPropagation();
                closePanel();
            }
        }, { capture: true });

        layoutInputs.forEach(input => {
            input.checked = input.value === this.numpadLayout;
            input.addEventListener("change", () => {
                if (input.checked) {
                    this.setNumpadLayout(input.value);
                }
            });
        });
        orderInputs.forEach(input => {
            input.checked = input.value === this.sentenceOrder;
            input.addEventListener("change", () => {
                if (input.checked) {
                    this.setSentenceOrder(input.value);
                }
            });
        });
    };

    SentenceMixUI.prototype.setNumpadLayout = function (layout) {
        if (!NUMPAD_LAYOUTS.includes(layout)) {
            return;
        }

        this.numpadLayout = layout;
        writeNumpadLayout(layout);
        this.applyNumpadLayout();
    };

    SentenceMixUI.prototype.setSentenceOrder = function (order) {
        if (!SENTENCE_ORDERS.includes(order)) {
            return;
        }

        this.sentenceOrder = order;
        writeSentenceOrder(order);
        this.applySentenceOrder();

        if (this.sentences.length > 0) {
            this.currentIndex = 0;
            this.startNextRound();
        }
    };

    SentenceMixUI.prototype.applySentenceOrder = function () {
        if (this.sentenceOrder === "shuffle") {
            this.sentences = shuffleArray(this.allSentences);
        } else {
            this.sentences = this.allSentences.slice();
        }
    };

    SentenceMixUI.prototype.applyNumpadLayout = function () {
        const grid = document.querySelector("#mobileNumpad .numpad-grid");
        if (!grid) {
            return;
        }

        const digitButtons = Array.from(grid.querySelectorAll(".numpad-key[data-key]"));
        const actionButtons = Array.from(grid.querySelectorAll(".numpad-key[data-action]"));
        const digitsByValue = new Map(digitButtons.map(button => [button.dataset.key, button]));
        let digitOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

        if (this.numpadLayout === "laptop") {
            digitOrder = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
        } else if (this.numpadLayout === "shuffle") {
            digitOrder = shuffleArray(digitOrder);
        }

        digitOrder.forEach(digit => {
            const button = digitsByValue.get(digit);
            if (button) {
                grid.appendChild(button);
            }
        });
        actionButtons.forEach(button => grid.appendChild(button));
    };

    SentenceMixUI.prototype.setupInputHandlers = function () {
        const input = window.SentenceMixInput;
        input.onChange = this.handleInputChange.bind(this);
        input.onSubmit = this.handleSubmit.bind(this);
        input.onReset = this.handleInputReset.bind(this);
        input.attach();

        // Touch-/Klick-Handler für mobilen Zahlenblock
        const numpad = document.getElementById("mobileNumpad");
        if (numpad) {
            numpad.addEventListener("click", event => {
                const button = event.target.closest(".numpad-key");
                if (!button || button.disabled) return;

                const digit = button.dataset.key;
                const action = button.dataset.action;

                if (digit) {
                    input.pressDigit(digit);
                } else if (action === "backspace") {
                    input.pressBackspace();
                } else if (action === "escape") {
                    input.pressEscape();
                } else if (action === "enter") {
                    input.pressEnter();
                }
            });
        }
    };

    SentenceMixUI.prototype.updateMobileNumpad = function (sequence) {
        sequence = sequence || [];
        const numpad = document.getElementById("mobileNumpad");
        if (!numpad || !this.currentRound) return;

        const maxTokens = this.currentRound.tokenCount || 9;
        const digitButtons = numpad.querySelectorAll(".numpad-key[data-key]");
        const enterButton = numpad.querySelector('.numpad-key[data-action="enter"]');
        const backspaceButton = numpad.querySelector('.numpad-key[data-action="backspace"]');
        const escapeButton = numpad.querySelector('.numpad-key[data-action="escape"]');

        if (this.roundState === "evaluated") {
            digitButtons.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove("is-used");
            });
            if (backspaceButton) backspaceButton.disabled = true;
            if (escapeButton) escapeButton.disabled = true;
            if (enterButton) {
                enterButton.disabled = false;
                enterButton.textContent = "Weiter ↵";
                enterButton.classList.add("highlight-next");
            }
            return;
        }

        // Status "playing"
        if (enterButton) {
            enterButton.disabled = false;
            enterButton.textContent = "↵ Enter";
            enterButton.classList.remove("highlight-next");
        }

        if (backspaceButton) {
            backspaceButton.disabled = sequence.length === 0;
        }

        if (escapeButton) {
            escapeButton.disabled = sequence.length === 0;
        }

        digitButtons.forEach(btn => {
            const digit = Number(btn.dataset.key);
            if (digit > maxTokens) {
                btn.disabled = true;
                btn.classList.remove("is-used");
            } else if (sequence.includes(digit)) {
                btn.disabled = true;
                btn.classList.add("is-used");
            } else {
                btn.disabled = false;
                btn.classList.remove("is-used");
            }
        });
    };

    SentenceMixUI.prototype.startNextRound = function () {
        if (this.sentences.length === 0) return;

        const sentenceModel = this.sentences[this.currentIndex];
        this.currentRound = window.SentenceMixEngine.startRound(sentenceModel);
        this.roundState = "playing";

        window.SentenceMixInput.clear();
        window.SentenceMixInput.setMaxDigits(this.currentRound.tokenCount);
        window.SentenceMixInput.setEnabled(true);

        this.renderStage(this.currentRound);
        this.updateMobileNumpad([]);
        this.updateHeaderStats();
    };

    SentenceMixUI.prototype.renderStage = function (round) {
        if (!this.stageContainer) return;
        this.stageContainer.innerHTML = "";
        this.activePillElements.clear();

        const stage = document.createElement("div");
        stage.className = "sentence-mix-stage";

        // 1. Stage Header (Butler & Kontext)
        const header = document.createElement("div");
        header.className = "stage-header";

        const profile = document.createElement("div");
        profile.className = "stage-butler-profile";
        const avatar = document.createElement("div");
        avatar.className = "stage-avatar";
        avatar.textContent = "🤵";
        const info = document.createElement("div");
        info.className = "stage-butler-info";
        info.innerHTML = `<h2>Butler</h2><span>Satz ${this.currentIndex + 1} von ${this.sentences.length}</span>`;
        profile.appendChild(avatar);
        profile.appendChild(info);
        header.appendChild(profile);

        if (round.translation) {
            const transBadge = document.createElement("div");
            transBadge.className = "stage-translation-badge";
            transBadge.textContent = round.translation;
            header.appendChild(transBadge);
        }
        stage.appendChild(header);

        // 2. Tokens Grid
        const grid = document.createElement("div");
        grid.className = "stage-tokens-grid";

        round.displayPills.forEach(pill => {
            const pillEl = document.createElement("div");
            pillEl.className = "token-pill";
            pillEl.dataset.digit = pill.displayNumber;

            const numSpan = document.createElement("span");
            numSpan.className = "token-pill-num";
            numSpan.textContent = pill.displayNumber;

            const thaiSpan = document.createElement("span");
            thaiSpan.className = "token-pill-thai";
            thaiSpan.textContent = pill.text;

            pillEl.appendChild(numSpan);
            pillEl.appendChild(thaiSpan);
            grid.appendChild(pillEl);

            this.activePillElements.set(pill.displayNumber, pillEl);
        });
        stage.appendChild(grid);

        // 3. Kompakte Live-Eingabe
        const inputSection = document.createElement("div");
        inputSection.className = "stage-input-section";

        const inputLabel = document.createElement("span");
        inputLabel.className = "stage-input-label";
        inputLabel.textContent = "Eingabe";
        inputSection.appendChild(inputLabel);

        const inputDisplay = document.createElement("div");
        inputDisplay.className = "stage-input-display";
        inputDisplay.innerHTML = '<span class="player-seq">> </span><span class="player-cursor"></span>';
        inputSection.appendChild(inputDisplay);

        stage.appendChild(inputSection);
        this.currentLiveDisplayEl = inputDisplay;

        // 4. Feedback-Container (leer zur Initialisierung)
        const feedbackContainer = document.createElement("div");
        feedbackContainer.className = "stage-feedback-slot";
        stage.appendChild(feedbackContainer);
        this.feedbackContainerEl = feedbackContainer;

        this.stageContainer.appendChild(stage);
    };

    SentenceMixUI.prototype.handleInputChange = function (sequence) {
        if (!this.currentLiveDisplayEl || this.roundState !== "playing") return;

        const seqText = sequence.length > 0 ? sequence.join(" ") : "";
        this.currentLiveDisplayEl.innerHTML = `<span class="player-seq">> ${seqText}</span><span class="player-cursor"></span>`;

        this.activePillElements.forEach((pillEl, digit) => {
            if (sequence.includes(digit)) {
                pillEl.classList.add("is-selected");
            } else {
                pillEl.classList.remove("is-selected");
            }
        });

        this.updateMobileNumpad(sequence);
    };

    SentenceMixUI.prototype.handleInputReset = function () {
        this.handleInputChange([]);
    };

    SentenceMixUI.prototype.handleSubmit = function (sequence) {
        if (this.roundState === "evaluated") {
            // Nach der Auswertung schaltet Enter direkt zum nächsten Satz
            this.currentIndex = (this.currentIndex + 1) % this.sentences.length;
            this.startNextRound();
            return;
        }

        if (this.roundState !== "playing") return;

        if (sequence.length === 0) {
            return;
        }

        const result = window.SentenceMixEngine.validate(sequence);
        this.roundState = "evaluated";
        window.SentenceMixInput.setEnabled(false);

        // Cursor entfernen
        if (this.currentLiveDisplayEl) {
            const seqText = sequence.join(" ");
            this.currentLiveDisplayEl.innerHTML = `<span class="player-seq">> ${seqText}</span>`;
        }

        this.renderEvaluation(result);
    };

    SentenceMixUI.prototype.renderEvaluation = function (result) {
        if (!this.feedbackContainerEl) return;
        this.feedbackContainerEl.innerHTML = "";

        const feedback = document.createElement("div");

        if (result.isCorrect) {
            this.solvedCount++;
            this.totalDurationMs += result.durationMs;
            feedback.className = "stage-feedback correct";

            const row = document.createElement("div");
            row.className = "feedback-row";

            const headline = document.createElement("div");
            headline.className = "feedback-headline";
            headline.textContent = `✓ Richtig! (${result.durationFormatted})`;
            row.appendChild(headline);

            const nextPrompt = document.createElement("div");
            nextPrompt.className = "feedback-next-prompt";
            nextPrompt.innerHTML = 'Drücke <span class="kbd-badge">Enter ↵</span> für den nächsten Satz';
            row.appendChild(nextPrompt);
            feedback.appendChild(row);

            const thaiRow = document.createElement("div");
            thaiRow.className = "feedback-thai-text";
            thaiRow.textContent = this.currentRound.thai;
            feedback.appendChild(thaiRow);
        } else {
            feedback.className = "stage-feedback wrong";

            const row = document.createElement("div");
            row.className = "feedback-row";

            const headline = document.createElement("div");
            headline.className = "feedback-headline";
            headline.textContent = "✗ Falsche Reihenfolge!";
            row.appendChild(headline);

            const nextPrompt = document.createElement("div");
            nextPrompt.className = "feedback-next-prompt";
            nextPrompt.innerHTML = 'Drücke <span class="kbd-badge">Enter ↵</span> zum Fortfahren';
            row.appendChild(nextPrompt);
            feedback.appendChild(row);

            const details = document.createElement("div");
            details.className = "feedback-details";
            const enteredStr = result.enteredNumbers.join(" ");
            const expectedStr = result.expectedNumbers.join(" ");
            details.textContent = `Deine Eingabe: [ ${enteredStr} ]  |  Richtig: [ ${expectedStr} ]`;
            feedback.appendChild(details);

            const thaiRow = document.createElement("div");
            thaiRow.className = "feedback-thai-text";
            thaiRow.textContent = this.currentRound.thai;
            feedback.appendChild(thaiRow);
        }

        this.feedbackContainerEl.appendChild(feedback);
        this.updateMobileNumpad();

        setTimeout(() => {
            window.SentenceMixInput.setEnabled(true);
        }, 80);

        this.updateHeaderStats();
    };

    SentenceMixUI.prototype.updateHeaderStats = function () {
        const countEl = document.getElementById("statSolvedCount");
        if (countEl) {
            countEl.textContent = `${this.solvedCount}`;
        }
        const timeEl = document.getElementById("statAvgTime");
        if (timeEl) {
            if (this.solvedCount > 0) {
                const avgSec = (this.totalDurationMs / this.solvedCount / 1000).toFixed(2);
                timeEl.textContent = `${avgSec} s`;
            } else {
                timeEl.textContent = "--:--";
            }
        }
    };

    SentenceMixUI.prototype.renderSystemMessage = function (text) {
        if (!this.stageContainer) return;
        this.stageContainer.innerHTML = `<div class="sentence-mix-stage"><div class="stage-header"><h2>Information</h2></div><p>${text}</p></div>`;
    };

    const sentenceMixUIInstance = new SentenceMixUI();
    sentenceMixUIInstance.SentenceMixUI = SentenceMixUI;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = sentenceMixUIInstance;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixUI = sentenceMixUIInstance;
    }
})();
