(function () {
    "use strict";

    const FONT_STORAGE_KEY = "thaiFontFamily";
    const REMINDER_SIZE_STORAGE_KEY = "thaiGigaReminderFontSize";
    const THEME_STORAGE_KEY = "thaiGigaTheme";
    const TRANSLITERATION_STORAGE_KEY = "thaiGigaTransliterationVisible";
    const TRANSLATION_STORAGE_KEY = "thaiGigaTranslationVisible";
    const DEFAULT_FONT = "sarabun";
    const DEFAULT_REMINDER_SIZE = 20;
    const DEFAULT_THEME = "classic";
    const FONT_FAMILIES = {
        standard: '"Noto Serif Thai", "Times New Roman", Times, serif',
        "noto-sans-thai": '"Noto Sans Thai", sans-serif',
        sarabun: '"Sarabun", sans-serif',
        prompt: '"Prompt", sans-serif',
        kanit: '"Kanit", sans-serif'
    };
    const FONT_OPTIONS = Object.keys(FONT_FAMILIES);
    const THEME_OPTIONS = ["classic", "night", "desert", "japanese"];

    const elements = {
        body: document.body,
        toggle: document.getElementById("thaiGigaSettingsToggle"),
        backdrop: document.getElementById("thaiGigaSettingsBackdrop"),
        panel: document.getElementById("thaiGigaSettingsPanel"),
        close: document.getElementById("thaiGigaSettingsClose"),
        themeSelect: document.getElementById("thaiGigaThemeSelect"),
        fontSelect: document.getElementById("thaiGigaFontSelect"),
        transliterationToggle: document.getElementById("thaiGigaTransliterationToggle"),
        translationToggle: document.getElementById("thaiGigaTranslationToggle"),
        reminderSize: document.getElementById("thaiGigaReminderFontSize"),
        reminderSizeValue: document.getElementById("thaiGigaReminderFontSizeValue")
    };

    function normalizeFont(value) {
        const selection = String(value ?? "");
        return FONT_OPTIONS.includes(selection) ? selection : DEFAULT_FONT;
    }

    function normalizeReminderSize(value) {
        const size = Number(value);
        if (!Number.isFinite(size)) {
            return DEFAULT_REMINDER_SIZE;
        }
        return Math.min(24, Math.max(18, Math.round(size)));
    }

    function normalizeTheme(value) {
        const selection = String(value ?? "");
        return THEME_OPTIONS.includes(selection) ? selection : DEFAULT_THEME;
    }

    function applyTheme(value) {
        const selection = normalizeTheme(value);
        elements.body.dataset.thaiTheme = selection;
        elements.themeSelect.value = selection;
        return selection;
    }

    function applyVisibilitySetting(setting, value) {
        const visible = value !== false;
        elements.body.dataset[`thai${setting}Visible`] = String(visible);
        return visible;
    }

    function readStoredVisibility(key) {
        const stored = localStorage.getItem(key);
        return stored === null ? true : stored === "true";
    }

    function applyFont(value) {
        const selection = normalizeFont(value);
        elements.body.style.setProperty("--thai-font-family", FONT_FAMILIES[selection]);
        elements.fontSelect.value = selection;
        return selection;
    }

    function applyReminderSize(value) {
        const size = normalizeReminderSize(value);
        elements.body.style.setProperty("--thai-reminder-word-size", `${size}px`);
        elements.reminderSize.value = String(size);
        elements.reminderSizeValue.value = `${size} px`;
        elements.reminderSizeValue.textContent = `${size} px`;
        return size;
    }

    function closeSettings() {
        elements.panel.hidden = true;
        elements.backdrop.hidden = true;
        elements.toggle.setAttribute("aria-expanded", "false");
    }

    function openSettings() {
        elements.panel.hidden = false;
        elements.backdrop.hidden = false;
        elements.toggle.setAttribute("aria-expanded", "true");
        elements.fontSelect.focus();
    }

    const initialFont = applyFont(
        localStorage.getItem(FONT_STORAGE_KEY) || DEFAULT_FONT
    );
    const initialReminderSize = applyReminderSize(
        localStorage.getItem(REMINDER_SIZE_STORAGE_KEY) || DEFAULT_REMINDER_SIZE
    );
    const initialTheme = applyTheme(
        localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME
    );
    const initialTransliterationVisible = applyVisibilitySetting(
        "Transliteration",
        readStoredVisibility(TRANSLITERATION_STORAGE_KEY)
    );
    const initialTranslationVisible = applyVisibilitySetting(
        "Translation",
        readStoredVisibility(TRANSLATION_STORAGE_KEY)
    );
    elements.transliterationToggle.checked = initialTransliterationVisible;
    elements.translationToggle.checked = initialTranslationVisible;
    localStorage.setItem(FONT_STORAGE_KEY, initialFont);
    localStorage.setItem(REMINDER_SIZE_STORAGE_KEY, String(initialReminderSize));
    localStorage.setItem(THEME_STORAGE_KEY, initialTheme);
    localStorage.setItem(
        TRANSLITERATION_STORAGE_KEY,
        String(initialTransliterationVisible)
    );
    localStorage.setItem(TRANSLATION_STORAGE_KEY, String(initialTranslationVisible));

    elements.toggle.addEventListener("click", () => {
        if (elements.panel.hidden) {
            openSettings();
        } else {
            closeSettings();
        }
    });
    elements.close.addEventListener("click", closeSettings);
    elements.backdrop.addEventListener("click", closeSettings);
    elements.themeSelect.addEventListener("change", event => {
        const selection = applyTheme(event.target.value);
        localStorage.setItem(THEME_STORAGE_KEY, selection);
    });
    elements.transliterationToggle.addEventListener("change", event => {
        const visible = applyVisibilitySetting("Transliteration", event.target.checked);
        localStorage.setItem(TRANSLITERATION_STORAGE_KEY, String(visible));
    });
    elements.translationToggle.addEventListener("change", event => {
        const visible = applyVisibilitySetting("Translation", event.target.checked);
        localStorage.setItem(TRANSLATION_STORAGE_KEY, String(visible));
    });
    elements.fontSelect.addEventListener("change", event => {
        const selection = applyFont(event.target.value);
        localStorage.setItem(FONT_STORAGE_KEY, selection);
    });
    elements.reminderSize.addEventListener("input", event => {
        const size = applyReminderSize(event.target.value);
        localStorage.setItem(REMINDER_SIZE_STORAGE_KEY, String(size));
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !elements.panel.hidden) {
            closeSettings();
            elements.toggle.focus();
        }
    });
})();
