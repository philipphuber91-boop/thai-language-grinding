// Registriert den Service Worker für Offline-Support und Installierbarkeit (PWA).
// Verändert keine bestehende Spiellogik – nur zusätzliche Infrastruktur.
(function () {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    // Service Worker funktionieren nur über http(s) (oder localhost), nicht über file://.
    if (location.protocol !== 'http:' && location.protocol !== 'https:') {
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../service-worker.js', { scope: '../' })
            .catch((err) => {
                console.warn('Service Worker Registrierung fehlgeschlagen:', err);
            });
    });
})();
