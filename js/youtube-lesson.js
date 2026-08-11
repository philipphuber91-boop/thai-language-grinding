(function () {
    const form = document.getElementById("youtubeLessonForm");
    const titleInput = document.getElementById("youtubeLessonTitle");
    const difficultyInput = document.getElementById("youtubeLessonDifficulty");
    const chapterInput = document.getElementById("youtubeLessonChapter");
    const transcriptInput = document.getElementById("youtubeLessonTranscript");
    const status = document.getElementById("youtubeLessonStatus");
    const preview = document.getElementById("youtubeLessonPreview");
    const previewTitle = document.getElementById("youtubeLessonPreviewTitle");
    const sourceBadge = document.getElementById("youtubeLessonSourceBadge");
    const truncatedNotice = document.getElementById("youtubeLessonTruncatedNotice");
    const segmentsContainer = document.getElementById("youtubeLessonSegments");
    const confirmButton = document.getElementById("youtubeLessonConfirmButton");
    const cancelButton = document.getElementById("youtubeLessonCancelButton");
    let pendingLesson = null;

    if (
        !form ||
        !titleInput ||
        !difficultyInput ||
        !chapterInput ||
        !transcriptInput ||
        !status ||
        !preview ||
        !previewTitle ||
        !sourceBadge ||
        !truncatedNotice ||
        !segmentsContainer ||
        !confirmButton ||
        !cancelButton
    ) {
        return;
    }

    function setStatus(message, type = "") {
        status.textContent = message;
        status.className = `youtube-lesson-status${type ? ` is-${type}` : ""}`;
    }

    function clearPreview() {
        pendingLesson = null;
        preview.hidden = true;
        previewTitle.textContent = "";
        sourceBadge.textContent = "";
        truncatedNotice.hidden = true;
        segmentsContainer.replaceChildren();
    }

    function renderPreview(lesson) {
        pendingLesson = lesson;
        previewTitle.textContent = lesson.title;
        sourceBadge.textContent = "Eigener Thai-Text";
        truncatedNotice.hidden = !lesson.truncated;
        truncatedNotice.textContent =
            "Das Video ist länger als die MVP-Grenze. Nur der erste Abschnitt wurde als Lektion übernommen.";
        segmentsContainer.replaceChildren();

        lesson.segments.forEach((segment, index) => {
            const row = document.createElement("article");
            row.className = "youtube-lesson-segment";

            const number = document.createElement("span");
            number.className = "youtube-lesson-segment-number";
            number.textContent = String(index + 1);

            const thaiLabel = document.createElement("label");
            thaiLabel.textContent = "ไทย";
            const thaiInput = document.createElement("textarea");
            thaiInput.lang = "th";
            thaiInput.rows = 2;
            thaiInput.value = segment.thai;
            thaiInput.dataset.field = "thai";
            thaiInput.dataset.index = String(index);
            thaiLabel.appendChild(thaiInput);

            const germanLabel = document.createElement("label");
            germanLabel.textContent = "Deutsch";
            const germanInput = document.createElement("textarea");
            germanInput.lang = "de";
            germanInput.rows = 2;
            germanInput.value = segment.deutsch;
            germanInput.dataset.field = "deutsch";
            germanInput.dataset.index = String(index);
            germanLabel.appendChild(germanInput);

            row.append(number, thaiLabel, germanLabel);
            segmentsContainer.appendChild(row);
        });

        preview.hidden = false;
        preview.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const thaiDigitReplacements = {
        "0": "๐",
        "1": "๑",
        "2": "๒",
        "3": "๓",
        "4": "๔",
        "5": "๕",
        "6": "๖",
        "7": "๗",
        "8": "๘",
        "9": "๙"
    };
    const thaiKeyboardCharacters = new Set(
        Array.from("ฃ๊ๅ/๑-๒ภ๓ถ๔ุูึค๕ต๖จ๗ข๘ช๙ๆ๐ไำฎพฑะธัํีรณนฯยญบฐลฅฟฤหฆกฏดโเฌ้็่๋าษสศวซงผปแฉอฮิื์ทมฒใฬฝฦ ")
    );

    function normalizeThaiText(value) {
        return Array.from(String(value || "").normalize("NFC"))
            .map(character => thaiDigitReplacements[character] || character)
            .filter(character => thaiKeyboardCharacters.has(character))
            .join("")
            .replace(/\s+/g, " ")
            .trim();
    }

    function createTextLessonId(text) {
        let hash = 2166136261;
        const input = String(text || "");

        for (let index = 0; index < input.length; index += 1) {
            hash ^= input.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }

        return `text:${Math.abs(hash >>> 0).toString(36)}`;
    }

    function createTextLesson(text, metadata) {
        const lines = String(text)
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !/^(?:\d{1,2}:)?\d{1,2}:\d{2}$/.test(line))
            .map(normalizeThaiText)
            .filter(Boolean);
        const limitedLines = [];
        let characterCount = 0;

        for (const line of lines) {
            if (
                limitedLines.length >= 80 ||
                characterCount + line.length > 12000
            ) {
                break;
            }

            limitedLines.push(line);
            characterCount += line.length;
        }

        if (limitedLines.length === 0) {
            throw new Error("Das eingefügte Transkript enthält keine nutzbaren Zeilen.");
        }

        return {
            videoId: createTextLessonId(
                [metadata.title, metadata.difficulty, metadata.chapter, ...limitedLines].join("\n")
            ),
            sourceUrl: "",
            title: metadata.title,
            difficulty: metadata.difficulty,
            chapter: metadata.chapter,
            thumbnailUrl: "",
            sourceType: "text",
            truncated: limitedLines.length < lines.length,
            segments: limitedLines.map(thai => ({
                thai,
                deutsch: "",
                start: 0,
                duration: 0
            }))
        };
    }

    function readPreviewFields() {
        const thaiZeilen = [];
        const deutschZeilen = [];

        segmentsContainer.querySelectorAll("textarea").forEach(field => {
            const index = Number(field.dataset.index);
            const target =
                field.dataset.field === "thai" ? thaiZeilen : deutschZeilen;
            target[index] =
                field.dataset.field === "thai"
                    ? normalizeThaiText(field.value)
                    : field.value.trim();
        });

        return { thaiZeilen, deutschZeilen };
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearPreview();

        const transcript = transcriptInput.value.trim();
        if (!transcript) {
            setStatus("Bitte füge einen Thai-Text ein.", "error");
            return;
        }

        form.querySelector("button[type='submit']").disabled = true;
        setStatus("Eigene Thai-Lektion wird vorbereitet …", "loading");

        try {
            const lesson = createTextLesson(transcript, {
                title: titleInput.value.trim(),
                difficulty: difficultyInput.value.trim(),
                chapter: chapterInput.value.trim()
            });
            renderPreview(lesson);
            setStatus(
                "Text übernommen. Prüfe jetzt die Zeilen und speichere die Quest.",
                "success"
            );
        } catch (error) {
            setStatus(error.message, "error");
        } finally {
            form.querySelector("button[type='submit']").disabled = false;
        }
    });

    cancelButton.addEventListener("click", () => {
        clearPreview();
        setStatus("Vorschau verworfen.");
    });

    confirmButton.addEventListener("click", () => {
        if (!pendingLesson) {
            setStatus("Es gibt keine Lektion zur Bestätigung.", "error");
            return;
        }

        const { thaiZeilen, deutschZeilen } = readPreviewFields();

        if (thaiZeilen.some(line => !line)) {
            setStatus("Jede Thai-Zeile muss mindestens ein Thai-Zeichen enthalten.", "error");
            return;
        }

        try {
            const saved = createYoutubeQuest({
                ...pendingLesson,
                title: titleInput.value.trim(),
                difficulty: difficultyInput.value.trim(),
                chapter: chapterInput.value.trim(),
                thaiZeilen,
                deutschZeilen
            });
            clearPreview();
            titleInput.value = "";
            difficultyInput.value = "";
            chapterInput.value = "";
            transcriptInput.value = "";
            setStatus(
                "Lektion gespeichert. Du kannst sie jetzt starten.",
                "success"
            );
            ladeKarten();
            document.getElementById(`quest-${saved.id}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            setStatus(error.message, "error");
        }
    });

    window.editYoutubeQuest = function (questId) {
        const quest = getYoutubeQuests()?.[questId];
        if (!quest) {
            setStatus("Diese Videoquest wurde nicht gefunden.", "error");
            return;
        }

        if (typeof switchContent === "function") {
            switchContent("youtube");
        }

        titleInput.value = quest.titel || "";
        difficultyInput.value = quest.schwierigkeit || "";
        chapterInput.value = quest.kapitel || "";
        transcriptInput.value = (quest.thaiZeilen || []).join("\n");
        renderPreview({
            videoId: quest.videoId || questId,
            title: quest.titel || "Eigene Thai-Lektion",
            difficulty: quest.schwierigkeit || "",
            chapter: quest.kapitel || "",
            sourceType: "text",
            truncated: false,
            segments: (quest.thaiZeilen || []).map((thai, index) => ({
                thai,
                deutsch: quest.deutschZeilen?.[index] || "",
                start: 0,
                duration: 0
            }))
        });
        setStatus("Lektion geöffnet. Bearbeite die Zeilen und speichere sie erneut.", "success");
    };
})();
