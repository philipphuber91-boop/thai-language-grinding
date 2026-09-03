const http = require("node:http");
const handler = require("./tts.js");

const port = Number(process.env.PORT || 3000);
const maxBodyBytes = 1024 * 1024;

function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;

        request.on("data", chunk => {
            size += chunk.length;
            if (size > maxBodyBytes) {
                reject(new Error("Request body ist zu groß."));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        request.on("error", reject);
    });
}

const server = http.createServer(async (request, response) => {
    try {
        request.body = request.method === "POST"
            ? await readRequestBody(request)
            : null;
        await handler(request, response);
    } catch (error) {
        console.error("Lokaler TTS-Server konnte die Anfrage nicht verarbeiten.", error);
        if (!response.headersSent) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "Ungültige Anfrage." }));
        }
    }
});

server.listen(port, () => {
    console.log(`TTS-Proxy läuft auf http://localhost:${port}/api/tts`);
});
