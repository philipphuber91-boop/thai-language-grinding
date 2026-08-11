(function () {
    const form = document.getElementById("youtubeLessonForm");
    const urlInput = document.getElementById("youtubeLessonUrl");
    const translateInput = document.getElementById("youtubeLessonTranslate");
    const transcriptInput = document.getElementById("youtubeLessonTranscript");
    const status = document.getElementById("youtubeLessonStatus");
    const preview = document.getElementById("youtubeLessonPreview");
    const previewTitle = document.getElementById("youtubeLessonPreviewTitle");
    const sourceLink = document.getElementById("youtubeLessonSourceLink");
    const sourceBadge = document.getElementById("youtubeLessonSourceBadge");
    const truncatedNotice = document.getElementById("youtubeLessonTruncatedNotice");
    const translationNotice = document.getElementById("youtubeLessonTranslationNotice");
    const segmentsContainer = document.getElementById("youtubeLessonSegments");
    const confirmButton = document.getElementById("youtubeLessonConfirmButton");
    const cancelButton = document.getElementById("youtubeLessonCancelButton");
    let pendingLesson = null;

    if (
        !form ||
        !urlInput ||
        !translateInput ||
        !transcriptInput ||
        !status ||
        !preview ||
        !previewTitle ||
        !sourceLink ||
        !sourceBadge ||
        !truncatedNotice ||
        !translationNotice ||
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
        sourceLink.removeAttribute("href");
        sourceBadge.textContent = "";
        truncatedNotice.hidden = true;
        translationNotice.hidden = true;
        segmentsContainer.replaceChildren();
    }

    function renderPreview(lesson) {
        pendingLesson = lesson;
        previewTitle.textContent = lesson.title;
        sourceLink.href = lesson.sourceUrl;
        const subtitleLabel = lesson.sourceType === "automatic"
            ? "Automatische Untertitel"
            : lesson.sourceType === "pasted"
                ? "Manuell eingefügtes Transkript"
                : "Untertitel";
        sourceBadge.textContent = lesson.translationPending
            ? `${subtitleLabel} · Deutsch manuell`
            : subtitleLabel;
        truncatedNotice.hidden = !lesson.truncated;
        truncatedNotice.textContent =
            "Das Video ist länger als die MVP-Grenze. Nur der erste Abschnitt wurde als Lektion übernommen.";
        translationNotice.hidden = !lesson.translationPending;
        translationNotice.textContent =
            "Keine automatische Übersetzung verwendet. Ergänze bitte die deutschen Zeilen manuell, bevor du die Quest speicherst.";
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

    async function requestLesson(url, translate) {
        const endpoint =
            window.YOUTUBE_LESSON_API_URL || "/api/youtube-lesson";
        let response;

        try {
            response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url, translate })
            });
        } catch (error) {
            throw new Error(
                "Der Video-Service ist nicht erreichbar. Prüfe die Backend-Konfiguration."
            );
        }

        const responseText = await response.text();
        let payload;

        try {
            payload = JSON.parse(responseText);
        } catch (error) {
            const statusText = response.status
                ? ` (HTTP ${response.status})`
                : "";
            throw new Error(
                `Der Video-Service ist nicht korrekt eingerichtet${statusText}. ` +
                "Auf GitHub Pages werden API-Routen nicht ausgeführt; deploye das Backend " +
                "separat und setze YOUTUBE_LESSON_API_URL."
            );
        }

        if (!response.ok) {
            throw new Error(
                payload?.error?.message ||
                "Die Video-Lektion konnte nicht erstellt werden."
            );
        }

        if (
            !payload.videoId ||
            !Array.isArray(payload.segments) ||
            payload.segments.length === 0
        ) {
            throw new Error("Die Antwort enthält keine nutzbaren Lektionsegmente.");
        }

        return payload;
    }

    function getYoutubeVideoId(value) {
        let url;

        try {
            url = new URL(String(value || "").trim());
        } catch (error) {
            throw new Error("Bitte gib eine gültige YouTube-URL ein.");
        }

        const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
        if (hostname === "youtu.be") {
            return url.pathname.slice(1).split("/")[0] || null;
        }

        if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
            return null;
        }

        if (url.pathname === "/watch") {
            return url.searchParams.get("v");
        }

        const pathParts = url.pathname.split("/").filter(Boolean);
        return ["shorts", "embed", "live"].includes(pathParts[0])
            ? pathParts[1] || null
            : null;
    }

    function createPastedLesson(url, text) {
        const videoId = getYoutubeVideoId(url);
        if (!videoId || !/^[\w-]{6,20}$/.test(videoId)) {
            throw new Error("Die YouTube-URL enthält keine gültige Video-ID.");
        }

        const lines = String(text)
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line && !/^(?:\d{1,2}:)?\d{1,2}:\d{2}$/.test(line));
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
            videoId,
            sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
            title: `YouTube-Video ${videoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            sourceType: "pasted",
            truncated: limitedLines.length < lines.length,
            translationPending: true,
            segments: limitedLines.map(thai => ({
                thai,
                deutsch: "",
                start: 0,
                duration: 0
            }))
        };
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        clearPreview();

        const url = urlInput.value.trim();
        if (!url) {
            setStatus("Bitte füge eine YouTube-URL ein.", "error");
            return;
        }

        form.querySelector("button[type='submit']").disabled = true;
        const translate = translateInput.checked;
        setStatus(
            transcriptInput.value.trim()
                ? "Eingefügtes Transkript wird vorbereitet …"
                : translate
                ? "Untertitel werden geladen und übersetzt …"
                : "Untertitel werden geladen …",
            "loading"
        );

        try {
            const lesson = transcriptInput.value.trim()
                ? createPastedLesson(url, transcriptInput.value)
                : await requestLesson(url, translate);
            renderPreview(lesson);
            setStatus(
                lesson.sourceType === "pasted"
                    ? "Transkript übernommen. Ergänze jetzt die deutschen Zeilen."
                    : lesson.translationPending
                    ? "Thai-Untertitel geladen. Ergänze jetzt die deutschen Zeilen."
                    : "Prüfe jetzt jede Zeile. Erst danach wird die Videoquest gespeichert.",
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

        const thaiZeilen = [];
        const deutschZeilen = [];
        const fields = segmentsContainer.querySelectorAll("textarea");

        fields.forEach(field => {
            const index = Number(field.dataset.index);
            const target =
                field.dataset.field === "thai" ? thaiZeilen : deutschZeilen;
            target[index] = field.value.trim();
        });

        if (
            thaiZeilen.some(line => !line) ||
            deutschZeilen.some(line => !line) ||
            thaiZeilen.length !== deutschZeilen.length
        ) {
            setStatus("Jede Thai-Zeile braucht eine passende deutsche Übersetzung.", "error");
            return;
        }

        try {
            const saved = createYoutubeQuest({
                ...pendingLesson,
                thaiZeilen,
                deutschZeilen
            });
            clearPreview();
            urlInput.value = "";
            transcriptInput.value = "";
            setStatus("Videoquest gespeichert. Du kannst sie jetzt starten.", "success");
            ladeKarten();
            document.getElementById(`quest-${saved.id}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } catch (error) {
            setStatus(error.message, "error");
        }
    });
})();
