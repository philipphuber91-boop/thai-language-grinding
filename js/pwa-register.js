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
        const hadController = Boolean(navigator.serviceWorker.controller);
        let reloadedForUpdate = false;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!hadController || reloadedForUpdate) {
                return;
            }

            reloadedForUpdate = true;
            window.location.reload();
        });

        navigator.serviceWorker.register('../service-worker.js', {
            scope: '../',
            updateViaCache: 'none'
        })
            .then((registration) => {
                const requestUpdate = () => {
                    registration.update().catch((err) => {
                        console.warn('Service Worker Update fehlgeschlagen:', err);
                    });
                };

                // Beim Öffnen und beim Zurückkehren aus dem Hintergrund nach Updates suchen.
                requestUpdate();
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        requestUpdate();
                    }
                });
                window.addEventListener('pageshow', requestUpdate);
            })
            .catch((err) => {
                console.warn('Service Worker Registrierung fehlgeschlagen:', err);
            });
    });
})();
