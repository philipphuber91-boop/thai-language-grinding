const backupTools = window.THAI_GRIND_SAVE_BACKUP;
const config = window.THAI_GRIND_SUPABASE_CONFIG || {};

const elements = {
    configurationStatus: document.getElementById("supabaseConfigurationStatus"),
    accountStatus: document.getElementById("accountStatus"),
    signedOutPanel: document.getElementById("signedOutPanel"),
    signedInPanel: document.getElementById("signedInPanel"),
    currentEmail: document.getElementById("currentAccountEmail"),
    cloudSaveStatus: document.getElementById("cloudSaveStatus"),
    cloudSaveUpdatedAt: document.getElementById("cloudSaveUpdatedAt"),
    signInForm: document.getElementById("signInForm"),
    signUpButton: document.getElementById("signUpButton"),
    resetPasswordButton: document.getElementById("resetPasswordButton"),
    signOutButton: document.getElementById("signOutButton"),
    passwordRecoveryForm: document.getElementById("passwordRecoveryForm"),
    backupExportButton: document.getElementById("backupExportButton"),
    backupImportForm: document.getElementById("backupImportForm"),
    backupFile: document.getElementById("backupFile"),
    saveToCloudButton: document.getElementById("saveToCloudButton"),
    restoreFromCloudButton: document.getElementById("restoreFromCloudButton"),
    returnToGameButton: document.getElementById("returnToGameButton"),
};

let supabase = null;
let currentSession = null;
let cloudSave = null;
let cloudStatusLoaded = false;
let passwordRecoveryActive = false;

function setStatus(element, message, state = "info") {
    element.textContent = message;
    element.dataset.state = state;
}

function setAccountVisibility() {
    const signedIn = Boolean(currentSession?.user);
    elements.signedOutPanel.hidden = signedIn;
    elements.signedInPanel.hidden = !signedIn;
    elements.passwordRecoveryForm.hidden = !passwordRecoveryActive;

    if (signedIn) {
        elements.currentEmail.textContent = currentSession.user.email || "Konto angemeldet";
    }
}

function setCloudActionsEnabled(enabled) {
    const supportedSave = !cloudSave || cloudSave.save_version === 1;
    const canUseCloud = enabled && cloudStatusLoaded && supportedSave;
    elements.saveToCloudButton.disabled = !canUseCloud;
    elements.restoreFromCloudButton.disabled = !canUseCloud || !cloudSave;
}

function setAuthenticationEnabled(enabled) {
    elements.signInForm.querySelector('button[type="submit"]').disabled = !enabled;
    elements.signUpButton.disabled = !enabled;
    elements.resetPasswordButton.disabled = !enabled;
    elements.signOutButton.disabled = !enabled;
    elements.passwordRecoveryForm.querySelector('button[type="submit"]').disabled = !enabled;
}

async function getCloudSave() {
    if (!currentSession?.user) {
        throw new Error("Bitte melde dich zuerst an.");
    }

    cloudStatusLoaded = false;

    const { data, error } = await supabase
        .from("player_saves")
        .select("save_version, payload, updated_at")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

    if (error) {
        cloudSave = null;
        throw error;
    }

    cloudSave = data;
    cloudStatusLoaded = true;
    return data;
}

function renderCloudSaveStatus(save) {
    if (!save) {
        elements.cloudSaveUpdatedAt.textContent = "";
        setStatus(elements.cloudSaveStatus, "Für dieses Konto ist noch kein Cloud-Spielstand gespeichert.", "info");
        return;
    }

    if (save.save_version !== 1) {
        elements.cloudSaveUpdatedAt.textContent = "";
        setStatus(
            elements.cloudSaveStatus,
            `Der Cloud-Spielstand hat das nicht unterstützte Format ${save.save_version}. Er wurde nicht verändert.`,
            "error"
        );
        return;
    }

    const updatedAt = new Date(save.updated_at);
    elements.cloudSaveUpdatedAt.textContent = Number.isNaN(updatedAt.getTime())
        ? ""
        : `Zuletzt gespeichert: ${new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(updatedAt)}`;
    setStatus(elements.cloudSaveStatus, "Ein Cloud-Spielstand ist vorhanden.", "success");
}

async function refreshCloudSaveStatus() {
    setCloudActionsEnabled(false);
    setStatus(elements.cloudSaveStatus, "Cloud-Spielstand wird geprüft …", "info");

    try {
        const save = await getCloudSave();
        renderCloudSaveStatus(save);
        setCloudActionsEnabled(Boolean(save?.save_version === 1) || !save);
    } catch (error) {
        setStatus(elements.cloudSaveStatus, `Cloud-Spielstand konnte nicht geladen werden: ${error.message}`, "error");
    }
}

async function runAction(button, action) {
    button.disabled = true;

    try {
        await action();
    } catch (error) {
        setStatus(elements.accountStatus, error.message || "Die Aktion ist fehlgeschlagen.", "error");
    } finally {
        button.disabled = false;
        setAccountVisibility();
        setCloudActionsEnabled(Boolean(currentSession?.user) && Boolean(supabase));
    }
}

function accountRedirectUrl() {
    return new URL("./account.html", window.location.href).toString();
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw error;
    }

    currentSession = data.session;
    setAccountVisibility();
    setStatus(elements.accountStatus, "Du bist angemeldet.", "success");
    await refreshCloudSaveStatus();
}

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: accountRedirectUrl(),
        },
    });

    if (error) {
        throw error;
    }

    currentSession = data.session;
    setAccountVisibility();

    if (data.session) {
        setStatus(elements.accountStatus, "Konto erstellt und angemeldet. Sichere deinen lokalen Spielstand in die Cloud.", "success");
        await refreshCloudSaveStatus();
    } else {
        setStatus(elements.accountStatus, "Konto erstellt. Bitte bestätige zuerst den Link in deiner E-Mail und melde dich danach an.", "success");
    }
}

async function saveLocalGameToCloud() {
    const localBackup = backupTools.createBackup();
    const previousSave = cloudSave;

    if (previousSave && !window.confirm(
        "Der vorhandene Cloud-Spielstand wird vor dem Überschreiben als JSON-Datei auf dieses Gerät heruntergeladen. Danach ersetzt ihn der Spielstand dieses Geräts. Fortfahren?"
    )) {
        return;
    }

    if (previousSave) {
        backupTools.downloadBackup({
            appId: "thai-language-grinding",
            formatVersion: 1,
            exportedAt: previousSave.updated_at || new Date().toISOString(),
            data: backupTools.validatePayload(previousSave.payload),
        });
    }

    const latestSave = await getCloudSave();

    if ((previousSave?.updated_at || null) !== (latestSave?.updated_at || null)) {
        throw new Error("Der Cloud-Spielstand hat sich seit der letzten Prüfung geändert. Prüfe den Status erneut und starte den Upload noch einmal.");
    }

    const { error } = await supabase
        .from("player_saves")
        .upsert({
            user_id: currentSession.user.id,
            save_version: 1,
            payload: localBackup.data,
        }, { onConflict: "user_id" });

    if (error) {
        throw error;
    }

    setStatus(elements.accountStatus, "Der lokale Spielstand wurde im Konto gespeichert. Weitere Änderungen müssen vorerst manuell erneut hochgeladen werden.", "success");
    await refreshCloudSaveStatus();
}

async function restoreCloudGameToLocal() {
    if (!window.confirm(
        "Der Cloud-Spielstand ersetzt die lokalen Spieldaten auf diesem Gerät. Zuerst wird automatisch eine JSON-Sicherung der lokalen Daten heruntergeladen. Fortfahren?"
    )) {
        return;
    }

    backupTools.downloadBackup(backupTools.createBackup());
    const save = await getCloudSave();

    if (!save) {
        throw new Error("Für dieses Konto ist kein Cloud-Spielstand vorhanden.");
    }

    if (save.save_version !== 1) {
        throw new Error(`Das Cloud-Format ${save.save_version} wird von dieser App-Version nicht unterstützt.`);
    }

    const payload = backupTools.validatePayload(save.payload);
    const restoredEntries = backupTools.replaceLocalData(payload);
    setStatus(elements.accountStatus, `${restoredEntries} lokale Einträge aus der Cloud wiederhergestellt. Die App wird neu geladen.`, "success");
    window.setTimeout(() => window.location.assign("index.html"), 800);
}

async function initializeSupabase() {
    const url = typeof config.url === "string" ? config.url.trim() : "";
    const publishableKey = typeof config.publishableKey === "string" ? config.publishableKey.trim() : "";

    if (!url || !publishableKey) {
        elements.configurationStatus.textContent =
            "Supabase ist noch nicht konfiguriert. Lokale Sicherungen funktionieren bereits. ";
        const setupLink = document.createElement("a");
        setupLink.href = "../docs/supabase-account-setup.md";
        setupLink.textContent = "Zur Einrichtungsanleitung";
        elements.configurationStatus.append(setupLink, ".");
        setStatus(elements.accountStatus, "Anmeldung und Cloud-Speicherung sind erst nach Eintragung der Supabase-Projekt-URL und des Publishable Keys verfügbar.", "info");
        return;
    }

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
            throw new Error("Die Supabase-Projekt-URL muss HTTPS verwenden.");
        }

        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.117.3");
        supabase = createClient(url, publishableKey, {
            auth: {
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: "pkce",
                persistSession: true,
            },
        });
        setAuthenticationEnabled(true);

        elements.configurationStatus.textContent = "Supabase-Konfiguration erkannt. Anmeldedaten werden sicher von Supabase verwaltet.";

        supabase.auth.onAuthStateChange((event, session) => {
            currentSession = session;
            if (event === "PASSWORD_RECOVERY") {
                passwordRecoveryActive = true;
            }
            setAccountVisibility();

            if (!session) {
                cloudSave = null;
                cloudStatusLoaded = false;
                setCloudActionsEnabled(false);
                setStatus(elements.cloudSaveStatus, "Melde dich an, um den Cloud-Spielstand zu prüfen.", "info");
                return;
            }

            window.setTimeout(() => {
                refreshCloudSaveStatus().catch((error) => {
                    setStatus(elements.cloudSaveStatus, `Cloud-Spielstand konnte nicht geladen werden: ${error.message}`, "error");
                });
            }, 0);
        });

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw error;
        }

        currentSession = data.session;
        setAccountVisibility();

        if (currentSession) {
            setStatus(elements.accountStatus, "Du bist angemeldet.", "success");
            await refreshCloudSaveStatus();
        } else {
            setStatus(elements.accountStatus, "Melde dich an oder erstelle ein Konto.", "info");
        }
    } catch (error) {
        setAuthenticationEnabled(false);
        setCloudActionsEnabled(false);
        setStatus(elements.configurationStatus, `Supabase konnte nicht initialisiert werden: ${error.message}`, "error");
        setStatus(elements.accountStatus, "Lokale Sicherungen funktionieren weiterhin; die Cloud-Anmeldung ist aktuell nicht verfügbar.", "error");
    }
}

elements.backupExportButton.addEventListener("click", () => {
    try {
        backupTools.downloadBackup();
        setStatus(elements.accountStatus, "Die lokale JSON-Sicherung wurde erstellt.", "success");
    } catch (error) {
        setStatus(elements.accountStatus, `Sicherung konnte nicht erstellt werden: ${error.message}`, "error");
    }
});

elements.backupImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = elements.backupFile.files?.[0];

    if (!file) {
        setStatus(elements.accountStatus, "Wähle zuerst eine JSON-Sicherungsdatei aus.", "error");
        return;
    }

    if (!window.confirm(
        "Die Sicherung ersetzt alle lokalen Spieldaten. Vorher wird automatisch eine JSON-Sicherung der aktuellen Daten heruntergeladen. Fortfahren?"
    )) {
        return;
    }

    try {
        backupTools.downloadBackup(backupTools.createBackup());
        const backup = backupTools.parseBackup(await file.text());
        const restoredEntries = backupTools.replaceLocalData(backup.data);
        setStatus(elements.accountStatus, `${restoredEntries} Einträge wiederhergestellt. Öffne jetzt das Spiel neu, damit alle Anzeigen aktualisiert werden.`, "success");
        elements.returnToGameButton.hidden = false;
    } catch (error) {
        setStatus(elements.accountStatus, `Sicherung konnte nicht importiert werden: ${error.message}`, "error");
    }
});

elements.signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(elements.signInForm);
    const submitButton = elements.signInForm.querySelector('button[type="submit"]');
    await runAction(submitButton, () => signIn(form.get("email").trim(), form.get("password")));
});

elements.signUpButton.addEventListener("click", async () => {
    const form = new FormData(elements.signInForm);
    const email = form.get("email").trim();
    const password = form.get("password");

    if (!elements.signInForm.reportValidity()) {
        return;
    }

    await runAction(elements.signUpButton, () => signUp(email, password));
});

elements.resetPasswordButton.addEventListener("click", async () => {
    const email = elements.signInForm.elements.email.value.trim();

    if (!email) {
        setStatus(elements.accountStatus, "Gib zuerst deine E-Mail-Adresse ein.", "error");
        elements.signInForm.elements.email.focus();
        return;
    }

    await runAction(elements.resetPasswordButton, async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: accountRedirectUrl(),
        });

        if (error) {
            throw error;
        }

        setStatus(elements.accountStatus, "Falls für diese E-Mail ein Konto besteht, wurde ein Link zum Zurücksetzen versendet.", "success");
    });
});

elements.passwordRecoveryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = elements.passwordRecoveryForm.elements.newPassword.value;
    const button = elements.passwordRecoveryForm.querySelector('button[type="submit"]');

    await runAction(button, async () => {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            throw error;
        }

        passwordRecoveryActive = false;
        elements.passwordRecoveryForm.reset();
        setStatus(elements.accountStatus, "Passwort aktualisiert.", "success");
        setAccountVisibility();
    });
});

elements.signOutButton.addEventListener("click", async () => {
    await runAction(elements.signOutButton, async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        currentSession = null;
        cloudSave = null;
        setStatus(elements.accountStatus, "Du wurdest abgemeldet. Lokale Spielstände bleiben auf diesem Gerät erhalten.", "success");
        setAccountVisibility();
    });
});

elements.saveToCloudButton.addEventListener("click", () => {
    runAction(elements.saveToCloudButton, saveLocalGameToCloud);
});

elements.restoreFromCloudButton.addEventListener("click", () => {
    runAction(elements.restoreFromCloudButton, restoreCloudGameToLocal);
});

elements.returnToGameButton.addEventListener("click", () => {
    window.location.assign("index.html");
});

supabase = null;
passwordRecoveryActive = /type=recovery/i.test(window.location.hash);
setAccountVisibility();
setAuthenticationEnabled(false);
setCloudActionsEnabled(false);
initializeSupabase();
