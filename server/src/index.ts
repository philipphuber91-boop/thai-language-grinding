import express from "express";
import { db } from "./db";
import wordsRouter from "./routes/words";
import { health } from "./routes/health";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "thai-giga-backend",
    message: "Thai Giga Backend läuft.",
  });
});

app.use("/api/words", wordsRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "Thai Giga Backend",
    status: "ok",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Thai Giga Backend läuft auf Port ${PORT}`);
});

async function shutdown(): Promise<void> {
  server.close();
  await db.end();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
