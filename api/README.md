# TTS-Proxy

`tts.js` is an optional server-side proxy for Inworld Realtime TTS. The
browser sends Thai text and voice settings to `/api/tts`; the Inworld API key
never leaves the server.

## Configuration

Copy the variables from `api/.env.example` into the deployment environment.
For Docker Compose, place the resulting `.env` file in the repository root
next to `docker-compose.tts.yml`:

- `INWORLD_API_KEY` is the Base64 credential created in the Inworld Portal.
- `INWORLD_DEFAULT_VOICE_ID` selects the default voice for requests that do
  not provide a voice ID.
- `INWORLD_DEFAULT_MODEL_ID` defaults to `inworld-tts-2`.
- `TTS_ALLOWED_ORIGINS` is a comma-separated list for a separately hosted
  frontend. Same-origin requests are allowed automatically.
- `AUDIO_STORAGE_*` configures an S3-compatible bucket for durable audio
  storage. Leave these values empty to use only the warm-runtime cache.

The local proxy loads a `.env` file from the repository root automatically.
Create it once from `api/.env.example`, fill in the Inworld key, and keep the
file local; `.env` is ignored by Git. Start the proxy with:

```powershell
npm run start:tts
```

The same environment variables can be configured in a hosted deployment
without changing the source code.

For the local static test server on port 8765, start the proxy in the same
PowerShell session after setting the key:

```powershell
$env:INWORLD_API_KEY = "paste-your-current-key-here"
$env:TTS_ALLOWED_ORIGINS = "http://localhost:8765"
node api/local-server.js
```

The Thai Giga pages automatically use `http://localhost:3000/api/tts` when
opened on localhost. Keep the key out of HTML, JavaScript and
`data/tts-voices.json`.

The frontend uses `/api/tts` automatically. A different endpoint can be
provided before `quest-audio.js` loads:

```html
<script>
    window.THAI_GIGA_TTS_CONFIG = {
        endpoint: "https://tts-api.example/api/tts",
        modelId: "inworld-tts-2"
    };
</script>
```

This is useful when the static GitHub Pages frontend and the API are deployed
separately. Voice IDs can also be supplied here, but the recommended default
is to keep the selected voice in `INWORLD_DEFAULT_VOICE_ID` on the server.

## GitHub Pages and Vercel

GitHub Pages serves the static frontend but cannot safely execute the proxy or
hold the Inworld key. Deploy the `api/tts.js` function to a serverless Node
host, such as Vercel, and configure these environment variables there:

```text
INWORLD_API_KEY
TTS_ALLOWED_ORIGINS=https://<github-account>.github.io
AUDIO_STORAGE_BUCKET=<r2-bucket-name>
AUDIO_STORAGE_REGION=auto
AUDIO_STORAGE_ENDPOINT=https://<cloudflare-account-id>.r2.cloudflarestorage.com
AUDIO_STORAGE_FORCE_PATH_STYLE=false
AUDIO_STORAGE_ACCESS_KEY_ID=<r2-access-key>
AUDIO_STORAGE_SECRET_ACCESS_KEY=<r2-secret-key>
```

Cloudflare R2 uses the S3-compatible API already supported by the proxy. The
R2 bucket must be private; the proxy reads and writes objects server-side.
After deployment, set the public function URL in
`window.THAI_GIGA_TTS_CONFIG` before `quest-audio.js` loads:

```html
<script>
    window.THAI_GIGA_TTS_CONFIG = {
        endpoint: "https://<your-vercel-project>.vercel.app/api/tts",
        modelId: "inworld-tts-2"
    };
</script>
```

The cache key includes the complete text, language, voice, model, speaking
rate and delivery mode. An identical request served from R2 does not call
Inworld again, even after a server restart or from another device.

## Multiple voices

`data/tts-voices.json` is the shared, non-secret voice assignment file. It
contains the fixed role profiles from `M` through `M2`; only their concrete
Inworld `voiceId` values still need to be selected:

`M`, `W`, `MU`, `VA`, `OM`, `OP`, `TA`, `ON`, `JM`, `JW`, `F1`, `F2`, `M1`,
and `M2`.

The dictionary currently exposes two independent choices:

- `female` → `regal-walnut-9770__main_female`
- `male` → `regal-walnut-9770__main_male`

These dictionary voices are intentionally separate from the story-role voice
assignments. The selected dictionary voice is persisted in the browser and is
part of the client and server cache key.

```json
{
    "voiceProfiles": {
        "M": { "label": "Erwachsener Mann", "voiceId": "" },
        "W": { "label": "Erwachsene Frau", "voiceId": "" },
        "MU": { "label": "Mutter", "voiceId": "" }
    },
    "defaultVoiceId": "",
    "speakerVoices": {
        "story-12-speaker-a": "voice-a",
        "story-12-speaker-b": "voice-b"
    },
    "storyVoices": {},
    "sentenceVoices": {}
}
```

Sentence-level assignments override speaker-level assignments. A speaker's
`voiceProfileId` then resolves through `voiceProfiles`; story-level
assignments and the default are used as fallbacks. A sentence may carry a
`speakerId`; when a story declares `speakers`, the content validator checks
that the reference exists in that story.

Each profile may also define its `modelId`, `language`, `speakingRate` and
`deliveryMode`. These values are carried through to the proxy request, so a
profile's voice and delivery settings remain consistent for generated audio.

Speaker IDs describe who is speaking and are intentionally independent from
gender. This supports two male, two female or mixed conversations without
changing the audio pipeline. Existing stories without explicit speaker
metadata continue to use the configured default voice until their dialogue
roles have been reviewed.

The legacy content can be assigned deterministic story-local speaker IDs with:

```text
node tools/assign-legacy-speakers.js --write
```

The command only adds speaker metadata and preserves the supplied Thai,
transliteration, translation and token data. Stories whose roles cannot be
inferred confidently are marked with `assignmentSource: "uncertain"` and a
lower confidence value for later review.

## Cache boundary

The proxy derives a stable SHA-256 key from text, language, voice, model and
audio settings. It keeps a bounded in-process cache and returns `X-TTS-Cache`
as `HIT` or `MISS`. This prevents repeated requests within one warm runtime.

Serverless runtimes can discard memory or run multiple instances. A
production-wide cache uses the configured object storage behind the same cache
boundary; the provider and frontend do not need to change when that store is
added. The in-process cache remains useful for hot objects.

## Local Docker workflow

The optional `docker-compose.tts.yml` starts MinIO, the proxy and a batch
profile. Copy the environment values into a local `.env` file, then run:

```text
docker compose -f docker-compose.tts.yml up --build tts-api
docker compose -f docker-compose.tts.yml --profile batch run --rm tts-batch
```

The MinIO console is available at `http://localhost:9001`. The batch worker
reads the canonical drill JSON and sends every sentence to the proxy. Existing
objects are served from the cache, so rerunning the batch does not synthesize
identical audio again.

Set `TTS_ENDPOINT` in the root `.env` to a production proxy URL when the batch
should populate the Worldserver's shared storage instead of local MinIO.
