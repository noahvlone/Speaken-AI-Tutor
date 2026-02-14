// server/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { fetch } from "undici";
import { Readable } from "node:stream";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ // Allow all origins for dev simplicity
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploads as static files
app.use("/uploads", express.static(UPLOADS_DIR));

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
    const json = (await r.json()) as any;
    res.json({ token: json.data?.token });
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
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] 🤖 AI Analysis Request started...`);

  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error(`[${requestId}] ❌ OPENROUTER_API_KEY is missing! Make sure it's set in server .env file (NOT with VITE_ prefix)`);
      return res.status(500).json({ error: "OPENROUTER_API_KEY is missing" });
    }

    console.log(`[${requestId}] 📡 Forwarding to OpenRouter (Model: ${req.body?.model || 'default'})...`);

    // forward abort kalau client nutup koneksi (buat SSE)
    const controller = new AbortController();
    req.on("close", () => {
      console.log(`[${requestId}] ⚠️ Client closed connection.`);
      controller.abort();
    });

    const startTime = Date.now();
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": req.headers.origin || "http://localhost:3000",
        "X-Title": "SpeakenAI",
      },
      body: JSON.stringify(req.body ?? {}),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    console.log(`[${requestId}] 📥 Upstream responded in ${duration}ms (Status: ${upstream.status})`);

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
        console.error(`[${requestId}] ❌ Stream error`);
        if (!res.headersSent) res.status(500);
        res.end();
      });
      nodeStream.on("end", () => console.log(`[${requestId}] ✅ Stream finished.`));
      nodeStream.pipe(res);
    } else {
      console.log(`[${requestId}] ℹ️ No body in upstream response.`);
      res.end();
    }
  } catch (e: any) {
    if (e?.name === "AbortError") {
      console.log(`[${requestId}] 🛑 Request aborted.`);
      return;
    }
    console.error(`[${requestId}] 💥 Proxy error:`, e?.message);
    res.status(500).json({ error: e?.message || "Proxy error" });
  }
});

/**
 * 3) Gemini API Proxy (Fast AI Analysis)
 *    POST /api/gemini
 *    Body = { prompt: string, model?: string }
 */
app.post("/api/gemini", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  // console.log(`[${requestId}] 🌟 Gemini AI Request started...`);

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      // console.error(`[${requestId}] ❌ GEMINI_API_KEY is missing! Get one from https://aistudio.google.com/apikey`);
      return res.status(500).json({ error: "GEMINI_API_KEY is missing. Get one from https://aistudio.google.com/apikey" });
    }

    const { prompt, model = "gemini-2.0-flash" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    // console.log(`[${requestId}] 📡 Calling Gemini API (Model: ${model})...`);

    const startTime = Date.now();
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const duration = Date.now() - startTime;
    // console.log(`[${requestId}] 📥 Gemini responded in ${duration}ms (Status: ${upstream.status})`);

    if (!upstream.ok) {
      const errorText = await upstream.text();
      // console.error(`[${requestId}] ❌ Gemini error:`, errorText);
      return res.status(upstream.status).json({ error: errorText });
    }

    const data = await upstream.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // console.log(`[${requestId}] ✅ Gemini response received (${text.length} chars)`);

    // Return in OpenAI-compatible format for easy frontend integration
    res.json({
      choices: [{
        message: {
          content: text,
          role: "assistant"
        }
      }]
    });

  } catch (e: any) {
    // console.error(`[${requestId}] 💥 Gemini proxy error:`, e?.message);
    res.status(500).json({ error: e?.message || "Gemini proxy error" });
  }
});

/**
 * 3) Local Avatar Upload
 *    POST /api/upload-avatar
 */
app.post("/api/upload-avatar", async (req, res) => {
  try {
    const { userId, imageData } = req.body;

    if (!userId || !imageData) {
      return res.status(400).json({ error: "userId and imageData are required" });
    }

    // data:image/jpeg;base64,/9j/4AAQSkZJRg...
    const matches = imageData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid image data format" });
    }

    const extension = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Create user subdirectory if it doesn't exist
    const userDir = path.join(UPLOADS_DIR, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const fileName = `avatar.${extension}`;
    const filePath = path.join(userDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // Return the local URL
    const baseUrl = req.headers.origin || `http://localhost:${PORT}`;
    const publicUrl = `${baseUrl}/uploads/${userId}/${fileName}?t=${Date.now()}`;

    res.json({ publicUrl });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Upload failed" });
  }
});

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => {
  console.log(`SpeakenAI server listening on http://localhost:${PORT}`);
});
