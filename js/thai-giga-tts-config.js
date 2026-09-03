(function () {
    "use strict";

    if (
        ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
        !window.THAI_GIGA_TTS_CONFIG
    ) {
        window.THAI_GIGA_TTS_CONFIG = {
            endpoint: "http://localhost:3000/api/tts",
            modelId: "inworld-tts-2"
        };
    }
})();
