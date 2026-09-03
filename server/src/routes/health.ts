import { ServerResponse } from "node:http";

export function health(res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({
    ok: true,
    service: "thai-giga-backend",
    message: "Thai Giga Backend läuft."
  }));
}
