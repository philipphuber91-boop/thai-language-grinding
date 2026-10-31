const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
    path.join(__dirname, "..", "api", "tts.js"),
    "utf8"
);

function createHandler() {
    const module = { exports: {} };
    vm.runInNewContext(source, {
        Buffer,
        console,
        module,
        process: {
            env: {
                TTS_ALLOWED_ORIGINS: "https://philipphuber91-boop.github.io"
            }
        },
        require: dependency => {
            if (dependency === "node:crypto") {
                return require("node:crypto");
            }
            if (dependency === "@aws-sdk/client-s3") {
                return {
                    GetObjectCommand: class {},
                    PutObjectCommand: class {},
                    S3Client: class {}
                };
            }
            throw new Error(`Unexpected dependency: ${dependency}`);
        },
        setTimeout
    });
    return module.exports;
}

function createResponse() {
    return {
        headers: new Map(),
        statusCode: 0,
        body: "",
        setHeader(name, value) {
            this.headers.set(name, value);
            return this;
        },
        end(body = "") {
            this.body = body;
        }
    };
}

async function sendOptions(handler, origin) {
    const response = createResponse();
    await handler({
        method: "OPTIONS",
        headers: {
            origin,
            host: "thai-giga-tts.vercel.app",
            "x-forwarded-proto": "https"
        }
    }, response);
    return response;
}

test("TTS CORS allows the production Vercel frontend and configured GitHub Pages", async () => {
    const handler = createHandler();

    for (const origin of [
        "https://thai-language-grinding.vercel.app",
        "https://philipphuber91-boop.github.io"
    ]) {
        const response = await sendOptions(handler, origin);
        assert.equal(response.statusCode, 204);
        assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
    }
});

test("TTS CORS still rejects unconfigured origins", async () => {
    const response = await sendOptions(
        createHandler(),
        "https://untrusted.example"
    );

    assert.equal(response.statusCode, 403);
    assert.match(response.body, /Origin ist nicht freigeschaltet/);
    assert.equal(response.headers.has("Access-Control-Allow-Origin"), false);
});
