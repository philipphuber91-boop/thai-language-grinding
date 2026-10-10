(function (global) {
    "use strict";

    const APP_ID = "thai-language-grinding";
    const FORMAT_VERSION = 1;
    const MAX_LOCAL_BACKUP_SIZE = 32 * 1024 * 1024;
    const MAX_CLOUD_SAVE_SIZE = 4 * 1024 * 1024;
    const ACCOUNT_STATE_PREFIX = "thaiGrindingAccount:";
    const RELOADABLE_CACHE_KEYS = new Set(["thaiGigaDrill:v1:content"]);

    function isProtectedKey(key) {
        return /^sb-[a-z0-9-]+-auth-token(?:-code-verifier)?$/i.test(key)
            || /^supabase\.auth\.token$/i.test(key)
            || key.startsWith(ACCOUNT_STATE_PREFIX);
    }

    function collectLocalData(storage = global.localStorage) {
        const entries = [];

        for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);

            if (key === null || isProtectedKey(key) || RELOADABLE_CACHE_KEYS.has(key)) {
                continue;
            }

            const value = storage.getItem(key);

            if (value !== null) {
                entries.push([key, value]);
            }
        }

        entries.sort(([left], [right]) => left.localeCompare(right));
        return Object.fromEntries(entries);
    }

    function validatePayload(payload, maxSize = MAX_LOCAL_BACKUP_SIZE) {
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            throw new Error("Der Spielstand muss ein JSON-Objekt sein.");
        }

        const entries = Object.entries(payload)
            .filter(([key]) => !RELOADABLE_CACHE_KEYS.has(key));

        if (entries.length > 500) {
            throw new Error("Der Spielstand enthält zu viele Einträge.");
        }

        for (const [key, value] of entries) {
            if (typeof key !== "string" || key.length === 0 || key.length > 300) {
                throw new Error("Der Spielstand enthält einen ungültigen Speicher-Schlüssel.");
            }

            if (isProtectedKey(key)) {
                throw new Error("Die Sicherung enthält einen geschützten Anmeldeschlüssel.");
            }

            if (typeof value !== "string") {
                throw new Error(`Der Wert für „${key}“ muss eine Zeichenkette sein.`);
            }
        }

        const validatedPayload = Object.fromEntries(entries);

        if (JSON.stringify(validatedPayload).length > maxSize) {
            const limitInMegabytes = Math.floor(maxSize / (1024 * 1024));
            throw new Error(`Der Spielstand ist größer als ${limitInMegabytes} MB und kann nicht verarbeitet werden.`);
        }

        return validatedPayload;
    }

    function validateCloudPayload(payload) {
        return validatePayload(payload, MAX_CLOUD_SAVE_SIZE);
    }

    function createBackup(storage = global.localStorage) {
        const data = validatePayload(collectLocalData(storage));

        return {
            appId: APP_ID,
            formatVersion: FORMAT_VERSION,
            exportedAt: new Date().toISOString(),
            data,
        };
    }

    function parseBackup(rawText) {
        if (typeof rawText !== "string" || rawText.length > MAX_LOCAL_BACKUP_SIZE * 2 + 10000) {
            throw new Error("Die Sicherungsdatei ist ungültig oder zu groß.");
        }

        let backup;

        try {
            backup = JSON.parse(rawText);
        } catch (error) {
            throw new Error("Die Sicherungsdatei enthält kein gültiges JSON.", { cause: error });
        }

        if (!backup || backup.appId !== APP_ID) {
            throw new Error("Diese Datei ist keine Sicherung von Thai Language Grinding.");
        }

        if (backup.formatVersion !== FORMAT_VERSION) {
            throw new Error(`Dieses Sicherungsformat (Version ${backup.formatVersion}) wird nicht unterstützt.`);
        }

        return {
            ...backup,
            data: validatePayload(backup.data),
        };
    }

    function replaceLocalData(payload, storage = global.localStorage) {
        const validatedPayload = validatePayload(payload);
        const currentData = collectLocalData(storage);

        function removeCurrentData() {
            for (const key of Object.keys(collectLocalData(storage))) {
                storage.removeItem(key);
            }
        }

        function writeData(data) {
            for (const [key, value] of Object.entries(data)) {
                storage.setItem(key, value);
            }
        }

        try {
            removeCurrentData();
            writeData(validatedPayload);
        } catch (error) {
            try {
                removeCurrentData();
                writeData(currentData);
            } catch (rollbackError) {
                const failure = new Error(
                    "Die Wiederherstellung ist fehlgeschlagen; auch der vorherige Spielstand konnte nicht vollständig zurückgespielt werden.",
                    { cause: error }
                );
                failure.rollbackError = rollbackError;
                throw failure;
            }

            throw error;
        }

        return Object.keys(validatedPayload).length;
    }

    function downloadBackup(backup = createBackup()) {
        const safeBackup = {
            appId: APP_ID,
            formatVersion: FORMAT_VERSION,
            exportedAt: typeof backup.exportedAt === "string" ? backup.exportedAt : new Date().toISOString(),
            data: validatePayload(backup.data),
        };
        const json = `${JSON.stringify(safeBackup, null, 2)}\n`;
        const blob = new Blob([json], { type: "application/json" });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const date = new Date().toISOString().slice(0, 10);

        link.href = objectUrl;
        link.download = `thai-language-grinding-save-${date}.json`;
        link.hidden = true;
        document.body.append(link);
        link.click();
        link.remove();
        global.setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    }

    global.THAI_GRIND_SAVE_BACKUP = Object.freeze({
        collectLocalData,
        createBackup,
        downloadBackup,
        isProtectedKey,
        parseBackup,
        replaceLocalData,
        validateCloudPayload,
        validatePayload,
    });
})(window);
