(function () {
    "use strict";

    function SentenceMixInput() {
        this.currentSequence = [];
        this.maxDigits = 9;
        this.enabled = true;
        this.onDigitAdded = null;
        this.onDigitRemoved = null;
        this.onSubmit = null;
        this.onReset = null;
        this.onChange = null;
        this.boundKeyHandler = this.handleKeyDown.bind(this);
        this.isAttached = false;
    }

    SentenceMixInput.prototype.setMaxDigits = function (count) {
        this.maxDigits = Math.max(1, Math.min(9, Number(count) || 9));
    };

    SentenceMixInput.prototype.clear = function () {
        const wasEmpty = this.currentSequence.length === 0;
        this.currentSequence = [];
        if (!wasEmpty && typeof this.onChange === "function") {
            this.onChange(this.currentSequence.slice());
        }
        if (typeof this.onReset === "function") {
            this.onReset();
        }
    };

    SentenceMixInput.prototype.getSequence = function () {
        return this.currentSequence.slice();
    };

    SentenceMixInput.prototype.setEnabled = function (enabled) {
        this.enabled = !!enabled;
    };

    SentenceMixInput.prototype.parseKey = function (event) {
        const key = event.key;
        const code = event.code;

        if (code && code.startsWith("Numpad")) {
            const digit = parseInt(code.replace("Numpad", ""), 10);
            if (!isNaN(digit) && digit >= 1 && digit <= 9) {
                return { type: "digit", value: digit };
            }
        }

        if (key && key >= "1" && key <= "9") {
            const digit = parseInt(key, 10);
            return { type: "digit", value: digit };
        }

        if (key === "Backspace" || key === "Delete") {
            return { type: "backspace" };
        }

        if (key === "Enter") {
            return { type: "enter" };
        }

        if (key === "Escape") {
            return { type: "escape" };
        }

        return null;
    };

    SentenceMixInput.prototype.handleKeyDown = function (event) {
        if (!this.enabled) {
            return;
        }

        // Nicht abfangen, wenn der Benutzer in ein echtes Formularfeld schreibt
        const targetTag = event.target ? event.target.tagName : "";
        if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") {
            return;
        }

        const action = this.parseKey(event);
        if (!action) {
            return;
        }

        // Verhindere Standardaktionen für die Spieltasten (z. B. Scrollen bei Leertaste oder Backspace-History)
        event.preventDefault();

        if (action.type === "digit") {
            this.pressDigit(action.value);
        } else if (action.type === "backspace") {
            this.pressBackspace();
        } else if (action.type === "enter") {
            this.pressEnter();
        } else if (action.type === "escape") {
            this.pressEscape();
        }
    };

    SentenceMixInput.prototype.pressDigit = function (digit) {
        if (!this.enabled) return;
        digit = Number(digit);
        if (isNaN(digit) || digit < 1 || digit > this.maxDigits) {
            return;
        }
        if (this.currentSequence.includes(digit)) {
            return;
        }
        this.currentSequence.push(digit);
        if (typeof this.onDigitAdded === "function") {
            this.onDigitAdded(digit, this.currentSequence.slice());
        }
        if (typeof this.onChange === "function") {
            this.onChange(this.currentSequence.slice());
        }
    };

    SentenceMixInput.prototype.pressBackspace = function () {
        if (!this.enabled) return;
        if (this.currentSequence.length > 0) {
            const removed = this.currentSequence.pop();
            if (typeof this.onDigitRemoved === "function") {
                this.onDigitRemoved(removed, this.currentSequence.slice());
            }
            if (typeof this.onChange === "function") {
                this.onChange(this.currentSequence.slice());
            }
        }
    };

    SentenceMixInput.prototype.pressEnter = function () {
        if (!this.enabled) return;
        if (typeof this.onSubmit === "function") {
            this.onSubmit(this.currentSequence.slice());
        }
    };

    SentenceMixInput.prototype.pressEscape = function () {
        this.clear();
    };

    SentenceMixInput.prototype.attach = function () {
        if (this.isAttached) {
            return;
        }
        if (typeof window !== "undefined") {
            window.addEventListener("keydown", this.boundKeyHandler, { capture: true });
            this.isAttached = true;
        }
    };

    SentenceMixInput.prototype.detach = function () {
        if (!this.isAttached) {
            return;
        }
        if (typeof window !== "undefined") {
            window.removeEventListener("keydown", this.boundKeyHandler, { capture: true });
            this.isAttached = false;
        }
    };

    const sentenceMixInputInstance = new SentenceMixInput();
    sentenceMixInputInstance.SentenceMixInput = SentenceMixInput;

    if (typeof module !== "undefined" && module.exports) {
        module.exports = sentenceMixInputInstance;
    }

    if (typeof window !== "undefined") {
        window.SentenceMixInput = sentenceMixInputInstance;
    }
})();
