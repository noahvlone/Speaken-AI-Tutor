// server/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { fetch } from "undici";
import { Readable } from "node:stream";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * 1) HeyGen token (tetep ada yang lama)
 *    GET /api/heygen/token
 */
app.get("/api/heygen/token", async (_req, res) => {
  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: { "x-api-key": process.env.HEYGEN_API_KEY ?? "" },
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const { data } = await r.json();
    res.json({ token: data?.token });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Failed to fetch token" });
  }
});

/**
 * 2) OpenRouter proxy (fix tanpa node-fetch, support SSE streaming)
 *    POST /api/openrouter
 *    Body = payload asli ke /chat/completions
 */
app.post("/api/openrouter", async (req, res) => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY is missing" });
    }

    // forward abort kalau client nutup koneksi (buat SSE)
    const controller = new AbortController();
    req.on("close", () => controller.abort());

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // header opsional, bagus buat rate limiting yang bener
        "HTTP-Referer": req.headers.origin || "http://localhost:3000",
        "X-Title": "SpeakenAI",
      },
      body: JSON.stringify(req.body ?? {}),
      signal: controller.signal,
    });

    // forward status
    res.status(upstream.status);

    const ct = upstream.headers.get("content-type") || "";
    const isSSE = ct.includes("text/event-stream");

    // set header respons
    res.setHeader(
      "Content-Type",
      isSSE ? "text/event-stream; charset=utf-8" : ct || "application/json; charset=utf-8"
    );
    res.setHeader("Cache-Control", "no-cache, no-transform");
    if (isSSE) res.setHeader("Connection", "keep-alive");

    // kalau body ada → pipe ke client
    if (upstream.body) {
      // WHATWG stream → Node stream
      const nodeStream = Readable.fromWeb(upstream.body as any);
      nodeStream.on("error", () => {
        if (!res.headersSent) res.status(500);
        res.end();
      });
      nodeStream.pipe(res);
    } else {
      // fallback text kosong
      res.end();
    }
  } catch (e: any) {
    // kalau aborted, jangan spam error
    if (e?.name === "AbortError") return;
    res.status(500).json({ error: e?.message || "Proxy error" });
  }
});

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => {
  console.log(`SpeakenAI server listening on http://localhost:${PORT}`);
});
