(function () {
    "use strict";

    const STORAGE_KEY = "thaiGigaDrill:v1:wordmix-points";

    function normalizePoints(value) {
        const points = Number(value);
        if (!Number.isFinite(points) || points < 0) {
            return 0;
        }

        return Math.round(points * 1000000) / 1000000;
    }

    function readExact() {
        try {
            return normalizePoints(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            console.warn("Wortmix-Punktestand konnte nicht gelesen werden.", error);
            return 0;
        }
    }

    function writeExact(value) {
        const normalizedPoints = normalizePoints(value);

        try {
            localStorage.setItem(STORAGE_KEY, String(normalizedPoints));
        } catch (error) {
            console.warn("Wortmix-Punktestand konnte nicht gespeichert werden.", error);
        }

        return normalizedPoints;
    }

    function addExact(value) {
        const points = Number(value);
        if (!Number.isFinite(points) || points <= 0) {
            return readExact();
        }

        return writeExact(readExact() + points);
    }

    window.wordMixPoints = {
        getExact: readExact,
        getDisplay: function () {
            return Math.floor(readExact());
        },
        addExact: addExact,
        storageKey: STORAGE_KEY
    };
})();
