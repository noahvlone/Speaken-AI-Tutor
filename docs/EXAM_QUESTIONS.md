# PhD‑Level Examination – Speaken‑AI Tutor System

This document contains a set of advanced questions and model answers designed for a doctoral‑level evaluation of the **Speaken‑AI Tutor** platform. The questions probe deep understanding of system architecture, algorithms, security, and testing.

---

## Question 1

**Explain the end‑to‑end data flow for a voice‑based role‑play session, from microphone capture to AI‑driven feedback. Include all intermediate services and protocols.**

**Answer**

1. **Audio Capture** – The browser’s `MediaStream` API captures raw PCM audio from the user’s microphone.
2. **Streaming to HeyGen** – The audio stream is sent via a **WebSocket** (`VoiceChatTransport.WEBSOCKET`) to HeyGen’s streaming‑avatar service.
3. **Speech‑to‑Text (STT)** – HeyGen performs real‑time STT (built‑in) and forwards the transcribed text to the client.
4. **Text Sent to OpenRouter** – The transcribed text (or user‑typed text) is packaged into a prompt and posted to the `/api/openrouter` proxy, which forwards it to OpenRouter’s LLM endpoint (`meta‑llama/llama‑3.2‑3b‑instruct`).
5. **LLM Response** – The LLM streams back a response (JSON) containing the avatar’s reply and optional evaluation metrics (pronunciation, fluency, grammar, prosody).
6. **Avatar TTS** – The reply text is sent back to HeyGen, which synthesizes speech (TTS) and streams the audio to the client for playback.
7. **Session Metrics Storage** – After the session ends, the transcript, duration, and AI‑generated scores are upserted into Supabase tables (`daily_challenge_progress`, `user_progress`).

---

## Question 2

**The system uses a deterministic “daily seed” for challenge selection. Derive the mathematical properties of this seed and discuss its impact on reproducibility and fairness across users.**

**Answer**

- The seed is computed as the sum of Unicode code‑point values of the ISO‑date string `YYYY‑MM‑DD`.
- **Determinism**: For any given calendar day, the seed is identical for all users, guaranteeing the same shuffled order of challenges.
- **Uniformity**: Since the sum of character codes is a linear function, the distribution of seeds across days is roughly uniform, avoiding bias toward particular challenge sets.
- **Fairness**: All users receive the same challenge subset (first 5 after shuffling), preventing advantage by logging in at a specific time.
- **Security**: The seed is not cryptographically secret, but it is sufficient because challenge selection is not security‑critical.

---

## Question 3

**Critically evaluate the fallback analysis algorithm used in `ResultSummaryPage`. What are its statistical assumptions, and how could it be improved to reduce bias?**

**Answer**

- **Current Fallback**: Generates random scores within fixed ranges (e.g., pronunciation 70‑84) and static mistake/suggestion lists.
- **Assumptions**:
  1. User performance is roughly centered around 70 % with a ±15 % variance.
  2. Errors are limited to “pronunciation variations” and “fluency pauses”.
- **Bias Sources**:
  - Over‑optimistic baseline (70 %); may inflate user confidence.
  - Uniform random distribution ignores user‑specific difficulty or language background.
- **Improvements**:
  1. Use **historical user data** (e.g., prior session averages) to seed a Gaussian distribution centered on the user’s mean.
  2. Incorporate **difficulty level** of the challenge (easy/medium/hard) to adjust score ranges.
  3. Dynamically select mistake categories based on the most common errors in the user’s recent history.

---

## Question 4

**Describe how the `useSupabaseChat` hook ensures eventual consistency between the client UI and the Supabase backend when multiple devices edit the same chat session concurrently.**

**Answer**

- **Optimistic UI Updates**: After inserting a new message, the hook immediately updates local state (`setMessages`) before the server acknowledges.
- **Server‑Side Timestamp Update**: The `updated_at` field of the session is refreshed via a separate `update` call, guaranteeing the latest modification time.
- **Polling/Refresh Functions**: `refreshSessions` and `refreshMessages` can be invoked to re‑fetch the authoritative state from Supabase, reconciling any divergent local caches.
- **Conflict Resolution**: Supabase’s `upsert` semantics (on `chat_sessions`) replace the row if the primary key matches, ensuring the most recent write wins.
- **Real‑time Subscriptions (future work)**: Adding Postgres `realtime` listeners would push server changes instantly to all connected clients, eliminating stale UI.

---

## Question 5

**The system stores avatar configuration in `AVATARS` (constants). Propose a schema change that would allow per‑user avatar personalization while preserving backward compatibility.**

**Answer**

1. **Create a new table `user_avatars`** with columns:
   - `user_id` (UUID, PK + FK to `users`)
   - `avatar_id` (VARCHAR) – foreign key to `constants/AVATARS.avatar_id`
   - `quality` (VARCHAR) – enum (`low`, `medium`, `high`)
   - `voice_model` (VARCHAR) – optional, defaults to system‑wide default.
2. **Migration**: Populate `user_avatars` with a default entry for each existing user using the first avatar in `AVATARS`.
3. **API Adjustments**:
   - `GET /api/user/avatar` returns the user‑specific config (fallback to defaults if missing).
   - `POST /api/user/avatar` upserts the record.
4. **Backward Compatibility**: Existing code that reads `AVATARS` continues to work; new UI components fetch the per‑user config and fall back to the constant if none exists.

---

## Question 6

**Explain the security implications of exposing the OpenRouter API key in the client‑side code (`openrouter.ts`). Suggest a hardened architecture to mitigate these risks.**

**Answer**

- **Risk**: The API key is sent to the browser via environment variable `VITE_OPENROUTER_API_KEY`. An attacker can inspect the network traffic or source code and steal the key, leading to unauthorized usage and potential billing abuse.
- **Mitigation Architecture**:
  1. **Server‑Side Proxy** (`/api/openrouter`) – Already exists; ensure it **never** forwards the client‑side key. The proxy should read the secret from a server‑only env var (`OPENROUTER_API_KEY`).
  2. **Rate Limiting & Authentication** – Enforce per‑user rate limits and require a valid session token before proxying.
  3. **CORS Restrictions** – Restrict the proxy to same‑origin requests only.
  4. **Audit Logging** – Log each request with user ID, model, token usage for anomaly detection.

---

## Question 7

**Design a unit test (using Jest) for the `seededShuffle` function that verifies its deterministic behavior across runs. Provide the test code.**

**Answer**

```ts
// __tests__/seededShuffle.test.ts
import { seededShuffle } from '../../src/hooks/useDailyChallenges'

describe('seededShuffle', () => {
  const sample = ['aa', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  test('produces the same order for the same seed', () => {
    const seed = 12345
    const firstRun = seededShuffle([...sample], seed)
    const secondRun = seededShuffle([...sample], seed)
    expect(firstRun).toEqual(secondRun)
  })

  test('produces a different order for different seeds', () => {
    const first = seededShuffle([...sample], 111)
    const second = seededShuffle([...sample], 222)
    // Very unlikely to be identical; assert they differ
    expect(first).not.toEqual(second)
  })

  test('does not mutate the original array', () => {
    const original = [...sample]
    seededShuffle([...sample], 999)
    expect(sample).toEqual(original)
  })
})
```

- The test confirms **determinism**, **seed sensitivity**, and **immutability** of the input array.

---

_End of exam._
