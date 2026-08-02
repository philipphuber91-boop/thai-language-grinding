/*
 * Service Worker für Thai Language Grinding (PWA)
 * ------------------------------------------------
 * Diese Datei fügt keine neuen Spielfunktionen hinzu. Sie sorgt nur dafür,
 * dass das Spiel installierbar ist und offline weiter funktioniert.
 *
 * WICHTIG – Cache-Versionierung für aktive Entwicklung:
 * Bei jedem Release bitte CACHE_VERSION erhöhen (z. B. 'v1' -> 'v2').
 * Das alte, veraltete Caches werden im "activate"-Event automatisch gelöscht.
 *
 * Zusätzlich verwendet dieser Service Worker für alle Same-Origin-Anfragen
 * eine "Network-first"-Strategie: Ist der Spieler online, wird IMMER zuerst
 * versucht, die aktuelle Datei aus dem Netzwerk zu laden. Der Cache dient
 * nur als Fallback, wenn kein Netzwerk verfügbar ist (Offline-Betrieb).
 * So bleiben Spieler nie auf einer veralteten Version "gefangen" und
 * müssen den Cache in Safari nicht manuell löschen.
 */

const CACHE_VERSION = 'v4';
const CACHE_NAME = `thai-language-grinding-${CACHE_VERSION}`;

// App-Shell: alles, was für Start und Offline-Betrieb gebraucht wird.
const PRECACHE_ASSETS = [
    'manifest.json',
    'index.html',

    'html/index.html',
    'html/typing.html',
    'html/achievements.html',

    'style.css',
    'css/mobile.css',

    'data/quests.js',
    'data/missions.js',

    'js/save.js',
    'js/player.js',
    'js/achievements.js',
    'js/chronik.js',
    'js/achievementRenderer.js',
    'js/engine.js',
    'js/keyboard.js',
    'js/typing-feedback.js',
    'js/typing.js',
    'js/pwa-register.js',

    'assets/ui/logo.png',
    'assets/ui/logo1.png',
    'assets/ui/main-bg.png',
    'assets/ui/button-start.png',
    'assets/ui/button-weltkarte.png',
    'assets/ui/menücard.png',
    'assets/ui/quest-badge.png',
    'assets/ui/quest-frame.png',
    'assets/ui/chronik/chronik-title.png',
    'assets/ui/chronik/chronik-title1.png',
    'assets/ui/chronik/stat-accuracy.png',
    'assets/ui/chronik/stat-attempts.png',
    'assets/ui/chronik/stat-averagecpm.png',
    'assets/ui/chronik/stat-bestcpm.png',
    'assets/ui/chronik/stat-characters.png',
    'assets/ui/chronik/stat-quests.png',
    'assets/ui/chronik/stat-time.png',

    'assets/audio/typing-click.mp3',
    'assets/audio/typing-drop.mp3',
    'assets/audio/typing-iphone.mp3',
    'assets/audio/typing-iphone2.mp3',
    'assets/audio/typing-robot-laser-01.mp3',
    'assets/audio/typing-robot-laser-02.mp3',
    'assets/audio/typing-robot-laser-03.mp3',
    'assets/audio/typing-robot-laser-04.mp3',
    'assets/audio/typing-robot-laser-05.mp3',

    'assets/quest/bahnhof.png',
    'assets/quest/frühstück.png',
    'assets/quest/hotel.png',
    'assets/quest/strand.png',
    'assets/quest/urlaub.png',

    'assets/backgrounds/thaiworld.png',
    'assets/backgrounds/thaiworld1.png',
    'assets/backgrounds/worldmap.png',

    'assets/icons/achievements/blitz.png',
    'assets/icons/achievements/book.png',
    'assets/icons/achievements/brain.png',
    'assets/icons/achievements/common.png',
    'assets/icons/achievements/diamond.png',
    'assets/icons/achievements/epic.png',
    'assets/icons/achievements/heart.png',
    'assets/icons/achievements/keyboard.png',
    'assets/icons/achievements/krone.png',
    'assets/icons/achievements/legendary.png',
    'assets/icons/achievements/pokal.png',
    'assets/icons/achievements/puzzle.png',
    'assets/icons/achievements/rare.png',
    'assets/icons/achievements/sanduhr.png',
    'assets/icons/achievements/scharfschütze.png',
    'assets/icons/achievements/schriftrolle.png',

    'assets/icons/pwa/favicon-16.png',
    'assets/icons/pwa/favicon-32.png',
    'assets/icons/pwa/apple-touch-icon.png',
    'assets/icons/pwa/icon-192.png',
    'assets/icons/pwa/icon-512.png',
    'assets/icons/pwa/icon-192-maskable.png',
    'assets/icons/pwa/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            // Neue Version soll so schnell wie möglich aktiv werden.
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            // Sofort alle offenen Tabs übernehmen, statt auf Reload zu warten.
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Nur lesende GET-Anfragen behandeln, alles andere unverändert durchlassen.
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        // Fremde Ressourcen (z. B. CDNs) nicht cachen/abfangen.
        return;
    }

    event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }

        // Bei einer Seitennavigation ohne Netz und ohne passenden Cache-Eintrag
        // wenigstens die Startseite offline anzeigen, statt einen Fehler zu zeigen.
        if (request.mode === 'navigate') {
            const fallback = await cache.match('html/index.html');
            if (fallback) {
                return fallback;
            }
        }

        throw err;
    }
}
