(function () {
    "use strict";

    if (window.THAI_GIGA_TTS_CONFIG) {
        return;
    }

    const endpoint = ["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:3000/api/tts"
        : "https://thai-giga-tts.vercel.app/api/tts";

    window.THAI_GIGA_TTS_CONFIG = {
        endpoint,
        modelId: "inworld-tts-2"
    };
})();
