const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
    path.join(__dirname, "..", "js", "account-backup.js"),
    "utf8"
);

class MemoryStorage {
    constructor(entries = {}) {
        this.values = new Map(Object.entries(entries));
    }

    get length() {
        return this.values.size;
    }

    key(index) {
        return [...this.values.keys()][index] ?? null;
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(String(key), String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function createBackupApi(storage) {
    const window = { localStorage: storage };
    vm.runInNewContext(source, { window });
    return window.THAI_GRIND_SAVE_BACKUP;
}

test("local backups include progress and omit Supabase credentials", () => {
    const storage = new MemoryStorage({
        player: "{\"stats\":{\"xp\":42}}",
        questStats: "{}",
        "sb-project-auth-token": "{\"access_token\":\"secret\"}",
        "sb-project-auth-token-code-verifier": "secret-verifier",
        "thaiGrindingAccount:cloudOwner": "account-id",
    });
    const backupApi = createBackupApi(storage);
    const backup = backupApi.createBackup();

    assert.equal(backup.appId, "thai-language-grinding");
    assert.equal(backup.formatVersion, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(backup.data)), {
        player: "{\"stats\":{\"xp\":42}}",
        questStats: "{}",
    });
});

test("backup parsing rejects other apps, unsupported versions, and auth tokens", () => {
    const backupApi = createBackupApi(new MemoryStorage());

    assert.throws(
        () => backupApi.parseBackup(JSON.stringify({
            appId: "another-app",
            formatVersion: 1,
            data: {},
        })),
        /keine Sicherung/
    );
    assert.throws(
        () => backupApi.parseBackup(JSON.stringify({
            appId: "thai-language-grinding",
            formatVersion: 2,
            data: {},
        })),
        /nicht unterstützt/
    );
    assert.throws(
        () => backupApi.validatePayload({ "sb-project-auth-token": "secret" }),
        /geschützten Anmeldeschlüssel/
    );
    assert.throws(
        () => backupApi.validatePayload({ player: { xp: 42 } }),
        /Zeichenkette/
    );
});

test("restore replaces game data but preserves auth and account-local keys", () => {
    const storage = new MemoryStorage({
        player: "old-player",
        obsoletePreference: "old-value",
        "sb-project-auth-token": "still-signed-in",
        "thaiGrindingAccount:cloudOwner": "account-id",
    });
    const backupApi = createBackupApi(storage);

    const restoredCount = backupApi.replaceLocalData({
        player: "new-player",
        questStats: "{\"completed\":3}",
    });

    assert.equal(restoredCount, 2);
    assert.equal(storage.getItem("player"), "new-player");
    assert.equal(storage.getItem("questStats"), "{\"completed\":3}");
    assert.equal(storage.getItem("obsoletePreference"), null);
    assert.equal(storage.getItem("sb-project-auth-token"), "still-signed-in");
    assert.equal(storage.getItem("thaiGrindingAccount:cloudOwner"), "account-id");
});

test("invalid payloads leave the existing save untouched", () => {
    const storage = new MemoryStorage({ player: "keep-me" });
    const backupApi = createBackupApi(storage);

    assert.throws(() => backupApi.replaceLocalData({ player: { xp: 100 } }), /Zeichenkette/);
    assert.equal(storage.getItem("player"), "keep-me");
});

test("local backups allow more than 4 MB and omit the reloadable Giga content cache", () => {
    const backupApi = createBackupApi(new MemoryStorage({
        player: "x".repeat(4 * 1024 * 1024 + 1),
        "thaiGigaDrill:v1:content": "reloadable-content",
        "thaiGigaDrill:v1:progress": "{\"completedSentenceIds\":[\"sentence-1\"]}",
    }));
    const backup = backupApi.createBackup();
    const parsedBackup = backupApi.parseBackup(JSON.stringify(backup));
    const cloudPayload = backupApi.validateCloudPayload({
        "thaiGigaDrill:v1:content": "x".repeat(4 * 1024 * 1024 + 1),
        "thaiGigaDrill:v1:progress": parsedBackup.data["thaiGigaDrill:v1:progress"],
    });

    assert.ok(backup.data.player.length > 4 * 1024 * 1024);
    assert.equal(backup.data["thaiGigaDrill:v1:content"], undefined);
    assert.equal(
        parsedBackup.data["thaiGigaDrill:v1:progress"],
        "{\"completedSentenceIds\":[\"sentence-1\"]}"
    );
    assert.equal(cloudPayload.player, undefined);
    assert.equal(
        cloudPayload["thaiGigaDrill:v1:progress"],
        parsedBackup.data["thaiGigaDrill:v1:progress"]
    );
    assert.throws(
        () => backupApi.validateCloudPayload({ player: "x".repeat(4 * 1024 * 1024 + 1) }),
        /größer als 4 MB/
    );
});

test("restore rolls back the previous save if local storage rejects a write", () => {
    class FailOnceStorage extends MemoryStorage {
        setItem(key, value) {
            if (this.failNextWrite) {
                this.failNextWrite = false;
                throw new Error("simulated storage quota error");
            }

            super.setItem(key, value);
        }
    }

    const storage = new FailOnceStorage({
        player: "previous-player",
        questStats: "previous-quests",
    });
    const backupApi = createBackupApi(storage);
    storage.failNextWrite = true;

    assert.throws(
        () => backupApi.replaceLocalData({ player: "replacement" }),
        /simulated storage quota error/
    );
    assert.equal(storage.getItem("player"), "previous-player");
    assert.equal(storage.getItem("questStats"), "previous-quests");
});
