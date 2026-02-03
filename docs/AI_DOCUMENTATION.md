# Dokumentasi Lengkap AI SpeakenAI Tutor

Dokumen ini menjelaskan cara kerja setiap fitur AI dalam sistem SpeakenAI Tutor, termasuk mekanisme penilaian dan alur kerja.

---

## 📑 Daftar Isi

1. [Overview Sistem AI](#overview-sistem-ai)
2. [Chatbot AI (Text Chat)](#1-chatbot-ai-text-chat)
3. [Roleplay AI (Avatar Interaktif)](#2-roleplay-ai-avatar-interaktif)
4. [Quiz AI (Daily Challenge)](#3-quiz-ai-daily-challenge)
5. [Sistem Penilaian AI](#4-sistem-penilaian-ai)
6. [Grammar Analysis AI](#5-grammar-analysis-ai)
7. [Diagram Alur Kerja](#6-diagram-alur-kerja)
8. [Bagaimana AI Memproses Input User](#7-bagaimana-ai-memproses-input-user)

---

## Overview Sistem AI

SpeakenAI menggunakan beberapa komponen AI yang saling terintegrasi:

| Komponen          | Model AI                              | Fungsi                                            |
| ----------------- | ------------------------------------- | ------------------------------------------------- |
| **Chatbot**       | Meta Llama 3.3 70B (via OpenRouter)   | Percakapan text-based untuk latihan bahasa        |
| **Roleplay**      | HeyGen Streaming Avatar + OpenRouter  | Avatar interaktif dengan voice/text chat          |
| **Quiz**          | Database-driven dengan seeded shuffle | Tantangan harian dengan soal pilihan ganda        |
| **Penilaian**     | Meta Llama 3.2 3B Instruct            | Evaluasi pronunciation, fluency, grammar, prosody |
| **Grammar Check** | Meta Llama 3.2 3B Instruct            | Analisis kesalahan tata bahasa real-time          |

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEAKENAI AI ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   CHATBOT    │    │   ROLEPLAY   │    │    QUIZ      │     │
│   │   (Text)     │    │   (Avatar)   │    │  (Challenge) │     │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│          │                   │                   │              │
│          ▼                   ▼                   ▼              │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              OPENROUTER API (LLM Provider)           │     │
│   │         Model: Meta Llama 3.3 70B Instruct           │     │
│   └──────────────────────────────────────────────────────┘     │
│                             │                                   │
│                             ▼                                   │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              AI SCORING & EVALUATION                 │     │
│   │    Pronunciation │ Fluency │ Grammar │ Prosody       │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Chatbot AI (Text Chat)

### Lokasi File

- **Frontend**: `src/components/ChatPage.tsx`
- **Hook**: `src/hooks/useSupabaseChat.ts`
- **OpenRouter Client**: `src/lib/openrouter.ts`
- **Grammar AI**: `src/lib/grammarAI.ts`

### Cara Kerja

#### 1.1 Alur Percakapan

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User    │───▶│  ChatPage    │───▶│  OpenRouter  │───▶│   LLM API    │
│  Input   │    │  Component   │    │    Proxy     │    │  (Streaming) │
└──────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                       │                                        │
                       │         ◄──────────────────────────────┘
                       │              SSE Streaming Response
                       ▼
              ┌──────────────┐
              │   Grammar    │
              │   Analysis   │
              └──────────────┘
```

#### 1.2 Konfigurasi Model

```typescript
// src/lib/openrouter.ts
const DEFAULT_OPTIONS = {
  model: 'moonshotai/kimi-k2:free', // Model default
  temperature: 0.7, // Kreativitas respons
  stream: true // Streaming enabled
}
```

#### 1.3 Fitur Streaming

Chatbot menggunakan **Server-Sent Events (SSE)** untuk streaming respons:

```typescript
// Streaming response handler
async *stream() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    // Parse SSE chunks
    const lines = buffer.split("\n");
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const jsonStr = line.replace(/^data:\s*/, "");
        const obj = JSON.parse(jsonStr);
        const token = obj.choices?.[0]?.delta?.content ?? "";
        if (token) yield token;
      }
    }
  }
}
```

### Session Management

```typescript
// useSupabaseChat.ts - Key functions
{
  ;(createSession, // Buat session baru
    appendMessage, // Simpan pesan ke database
    updateMessage, // Update streaming message
    deleteSession, // Hapus session
    refreshSessions) // Reload dari database
}
```

---

## 2. Roleplay AI (Avatar Interaktif)

### Lokasi File

- **Frontend**: `src/components/RoleplayPage.tsx`
- **Avatar Logic**: `src/components/logic/useStreamingAvatarSession.ts`
- **Voice Chat**: `src/components/logic/useVoiceChat.ts`
- **Text Chat**: `src/components/logic/useTextChat.ts`

### Cara Kerja

#### 2.1 Arsitektur Avatar

```
┌─────────────────────────────────────────────────────────────────┐
│                       HEYGEN AVATAR SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                      ┌─────────────────────┐ │
│   │   Browser   │                      │   HeyGen Cloud      │ │
│   │   Client    │◄────WebRTC/WS───────►│   Avatar Service    │ │
│   └─────────────┘                      └─────────────────────┘ │
│         │                                        │              │
│         │                                        ▼              │
│         │                              ┌─────────────────────┐ │
│         │                              │  Avatar Personas:   │ │
│         │                              │  • Ann (Therapist)  │ │
│         │                              │  • Shawn (Counselor)│ │
│         │                              │  • Bryan (Coach)    │ │
│         │                              │  • Dexter (Doctor)  │ │
│         │                              │  • Elenora (Expert) │ │
│         │                              └─────────────────────┘ │
│         ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                    BUILT-IN SERVICES                     │  │
│   │   ┌─────────┐  ┌─────────┐  ┌───────────────────────┐   │  │
│   │   │   STT   │  │   TTS   │  │   Lip-Sync Engine     │   │  │
│   │   │ (Voice) │  │ (Voice) │  │   (Real-time sync)    │   │  │
│   │   └─────────┘  └─────────┘  └───────────────────────┘   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.2 Konfigurasi Default

```typescript
// RoleplayPage.tsx
const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low, // Kualitas video
  avatarName: AVATARS[0].avatar_id, // Avatar default
  language: 'en', // Bahasa
  voiceChatTransport: VoiceChatTransport.WEBSOCKET // Transport
}
```

#### 2.3 Mode Interaksi

| Mode           | Fungsi                        | Implementation    |
| -------------- | ----------------------------- | ----------------- |
| **Voice Chat** | Bicara langsung dengan avatar | `useVoiceChat.ts` |
| **Text Chat**  | Ketik pesan, avatar berbicara | `useTextChat.ts`  |

```typescript
// Voice Chat Flow
startVoiceChat() → Avatar mendengarkan → STT → AI Response → TTS → Avatar berbicara

// Text Chat Flow
sendMessage(text) → Avatar.speak(text) → TTS → Avatar berbicara
```

#### 2.4 Event Handling

```typescript
// Roleplay event listeners
avatar.on(StreamingEvents.AVATAR_START_TALKING, ...);  // Avatar mulai bicara
avatar.on(StreamingEvents.AVATAR_STOP_TALKING, ...);   // Avatar selesai bicara
avatar.on(StreamingEvents.STREAM_READY, ...);          // Stream siap
avatar.on(StreamingEvents.USER_START, ...);            // User mulai bicara
avatar.on(StreamingEvents.USER_STOP, ...);             // User selesai bicara
avatar.on(StreamingEvents.USER_END_MESSAGE, ...);      // Pesan user selesai
```

---

## 3. Quiz AI (Daily Challenge)

### Lokasi File

- **Frontend**: `src/components/DailyChallengePage.tsx`
- **Hook**: `src/hooks/useDailyChallenges.ts`
- **Database**: `supabase/migrations/` (daily_challenges table)

### Cara Kerja

#### 3.1 Sistem Challenge Harian

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY CHALLENGE SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐│
│   │   Today's   │───▶│   Seeded    │───▶│  5 Questions/Day   ││
│   │    Date     │    │   Shuffle   │    │  (Deterministic)   ││
│   └─────────────┘    └─────────────┘    └─────────────────────┘│
│                                                                 │
│   Daily Seed Formula:                                           │
│   seed = dateString.split('').reduce((acc, char) =>            │
│          acc + char.charCodeAt(0), 0)                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                   QUESTION TYPES                         │  │
│   │  • Grammar      • Vocabulary    • Reading Comprehension │  │
│   │  • Idioms       • Pronunciation • Sentence Structure    │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2 Algoritma Seeded Shuffle

```typescript
// Deterministic shuffle: Semua user dapat soal yang sama per hari
const getDailySeed = (date: Date): number => {
  const dateStr = date.toISOString().split('T')[0] // "2026-01-20"
  return dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

const seededShuffle = <T>(array: T[], seed: number): T[] => {
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
```

#### 3.3 Sistem Penilaian Quiz

| Jawaban  | Points |
| -------- | ------ |
| ✅ Benar | +20 XP |
| ❌ Salah | +0 XP  |

```typescript
// Submit answer logic
const submitAnswer = async (challengeId, selectedAnswer, correctAnswer) => {
  const isCorrect = selectedAnswer === correctAnswer
  const pointsEarned = isCorrect ? 20 : 0

  // Simpan ke database
  await supabase.from('user_challenge_attempts').insert({
    user_id: userId,
    challenge_id: challengeId,
    selected_answer: selectedAnswer,
    is_correct: isCorrect,
    points_earned: pointsEarned,
    attempt_date: new Date().toISOString().split('T')[0]
  })

  return { isCorrect, pointsEarned }
}
```

#### 3.4 Struktur Data Challenge

```typescript
interface Challenge {
  id: string
  question: string
  options: string[] // 4 pilihan jawaban
  correctAnswer: number // Index jawaban benar (0-3)
  explanation: string // Penjelasan jawaban
  category: string // grammar, vocabulary, etc.
  difficulty?: string // easy, medium, hard
}
```

---

## 4. Sistem Penilaian AI

### Lokasi File

- **Result Page**: `src/components/ResultSummaryPage.tsx`
- **Progress Hook**: `src/hooks/useUserProgress.ts`
- **Leaderboard**: `src/hooks/useLeaderboard.ts`

### Cara Kerja

#### 4.1 Metrik Penilaian

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI EVALUATION METRICS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│   │ PRONUNCIATION │  │    FLUENCY    │  │    GRAMMAR    │      │
│   │    0-100      │  │     0-100     │  │     0-100     │      │
│   │               │  │               │  │               │      │
│   │ • Accuracy    │  │ • Speech rate │  │ • Syntax      │      │
│   │ • Clarity     │  │ • Hesitation  │  │ • Word order  │      │
│   │ • Intonation  │  │ • Flow        │  │ • Tenses      │      │
│   └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                 │
│   ┌───────────────┐  ┌───────────────────────────────────────┐ │
│   │    PROSODY    │  │           TOTAL SCORE                 │ │
│   │     0-100     │  │                                       │ │
│   │               │  │  Total = (Pron + Flu + Gram + Pros)/4│ │
│   │ • Rhythm      │  │                                       │ │
│   │ • Stress      │  │  Grade:                               │ │
│   │ • Melody      │  │  S (95+) A (85+) B (75+) C (60+) D   │ │
│   └───────────────┘  └───────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.2 Prompt AI untuk Penilaian

```typescript
// ResultSummaryPage.tsx - AI Evaluation Prompt
const prompt = `Perform a professional linguistic analysis for an English learner. 
Evaluate: Pronunciation, Fluency, Grammar, and Prosody (0-100).
Identify exactly 2 common mistakes and 2 suggestions.
Return ONLY a pure JSON object without markdown or commentary.
Format:
{
  "pronunciation": number,
  "fluency": number,
  "grammar": number,
  "prosody": number,
  "feedbackSummary": "string (15 words max)",
  "commonMistakes": [{"mistake": "string", "explanation": "string", "correction": "string"}],
  "aiSuggestions": ["string", "string"]
}
Transcript: ${transcript}`
```

#### 4.3 Sistem Grade

```typescript
const getSessionGrade = (score: number) => {
  if (score >= 95) return { label: 'S', color: 'text-amber-500' } // Master
  if (score >= 85) return { label: 'A', color: 'text-emerald-500' } // Excellent
  if (score >= 75) return { label: 'B', color: 'text-blue-500' } // Good
  if (score >= 60) return { label: 'C', color: 'text-slate-500' } // Average
  return { label: 'D', color: 'text-rose-500' } // Needs work
}
```

#### 4.4 XP dan Leaderboard

```typescript
// Kalkulasi XP dari session
const pointsEarned = Math.round(totalScore / 2)

// Update leaderboard
await updateUserScore(pointsEarned)
await updateStreak() // Track consecutive practice days
```

#### 4.5 Fallback Analysis

Jika AI timeout atau error, sistem menggunakan fallback:

```typescript
const fallbackAnalysis = {
  pronunciation: 70 + Math.floor(Math.random() * 15),  // 70-84
  fluency: 65 + Math.floor(Math.random() * 20),        // 65-84
  grammar: 68 + Math.floor(Math.random() * 17),        // 68-84
  prosody: 72 + Math.floor(Math.random() * 13),        // 72-84
  feedbackSummary: "Good practice session! Keep practicing...",
  commonMistakes: [...],
  aiSuggestions: [...]
};
```

---

## 5. Grammar Analysis AI

### Lokasi File

- **Grammar AI**: `src/lib/grammarAI.ts`
- **UI Component**: `src/components/GrammarHighlight.tsx`

### Cara Kerja

#### 5.1 Real-time Grammar Check

```typescript
// grammarAI.ts
interface GrammarError {
  start: number // Posisi awal karakter
  end: number // Posisi akhir karakter
  message: string // Pesan error
  suggestion: string // Saran perbaikan
  type: 'grammar' | 'spelling' | 'style'
}
```

#### 5.2 Prompt Grammar Analysis

```typescript
const prompt = `Analyze this English sentence from a learner. 
Identify all grammar, spelling, and style errors.
Return ONLY a pure JSON array of objects with this format:
[{
  "start": number, 
  "end": number, 
  "message": "string", 
  "suggestion": "string", 
  "type": "grammar" | "spelling" | "style"
}]

Rules:
- 'start' and 'end' are 0-based character indices.
- Provide clear, helpful messages.
- If no errors, return [].

Text to analyze: "${text}"`
```

#### 5.3 Caching System

```typescript
// In-memory cache untuk efisiensi
const grammarCache = new Map<string, GrammarError[]>()
const CACHE_MAX_SIZE = 100

// Check cache sebelum API call
if (grammarCache.has(text)) {
  return grammarCache.get(text)!
}

// Cache hasil setelah analysis
grammarCache.set(text, result)
```

---

## 6. Diagram Alur Kerja

### 6.1 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER JOURNEY FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────┐                                                 │
│   │   LOGIN   │                                                 │
│   └─────┬─────┘                                                 │
│         │                                                       │
│         ▼                                                       │
│   ┌───────────┐                                                 │
│   │ DASHBOARD │◄─────────────────────────────────────┐         │
│   └─────┬─────┘                                      │         │
│         │                                            │         │
│         ▼                                            │         │
│   ┌─────────────────────────────────────────┐       │         │
│   │          CHOOSE ACTIVITY                 │       │         │
│   │                                          │       │         │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │       │         │
│   │  │ Text    │ │Roleplay │ │  Quiz   │   │       │         │
│   │  │  Chat   │ │ Avatar  │ │Challenge│   │       │         │
│   │  └────┬────┘ └────┬────┘ └────┬────┘   │       │         │
│   └───────┼───────────┼───────────┼────────┘       │         │
│           │           │           │                 │         │
│           ▼           ▼           ▼                 │         │
│   ┌─────────────────────────────────────────┐      │         │
│   │          PRACTICE SESSION                │      │         │
│   │   • Real-time AI interaction            │      │         │
│   │   • Grammar checking                    │      │         │
│   │   • Voice/Text input                    │      │         │
│   └──────────────────┬──────────────────────┘      │         │
│                      │                             │         │
│                      ▼                             │         │
│   ┌─────────────────────────────────────────┐      │         │
│   │           AI EVALUATION                  │      │         │
│   │   • Pronunciation score                 │      │         │
│   │   • Fluency score                       │      │         │
│   │   • Grammar score                       │      │         │
│   │   • Prosody score                       │      │         │
│   │   • Mistakes & Suggestions              │      │         │
│   └──────────────────┬──────────────────────┘      │         │
│                      │                             │         │
│                      ▼                             │         │
│   ┌─────────────────────────────────────────┐      │         │
│   │          SAVE PROGRESS                   │      │         │
│   │   • XP points added                     │      │         │
│   │   • Streak updated                      │──────┘         │
│   │   • Leaderboard updated                 │                │
│   └─────────────────────────────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   USER INPUT                 PROCESSING                 OUTPUT   │
│   ─────────                  ──────────                ────────  │
│                                                                  │
│   ┌────────┐               ┌──────────────┐          ┌────────┐ │
│   │ Voice  │──────────────▶│ HeyGen STT   │─────────▶│  Text  │ │
│   └────────┘               └──────────────┘          └───┬────┘ │
│                                                          │      │
│   ┌────────┐                                             │      │
│   │  Text  │─────────────────────────────────────────────┤      │
│   └────────┘                                             │      │
│                                                          ▼      │
│                            ┌──────────────┐        ┌─────────┐  │
│                            │  OpenRouter  │◀───────│ Context │  │
│                            │     LLM      │        │ History │  │
│                            └──────┬───────┘        └─────────┘  │
│                                   │                             │
│                                   ▼                             │
│   ┌────────┐               ┌──────────────┐                     │
│   │ Avatar │◀──────────────│  HeyGen TTS  │                     │
│   │ Video  │               └──────────────┘                     │
│   └────────┘                      │                             │
│                                   ▼                             │
│   ┌────────────────────────────────────────────────────────┐   │
│   │                    SUPABASE DATABASE                    │   │
│   │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │   │
│   │  │  Messages  │ │  Sessions  │ │  User Progress     │  │   │
│   │  │  History   │ │  Metadata  │ │  & Leaderboard     │  │   │
│   │  └────────────┘ └────────────┘ └────────────────────┘  │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Bagaimana AI Memproses Input User

Section ini menjelaskan secara detail **bagaimana AI memahami ucapan user** dan menghasilkan respons.

### 7.1 Alur Lengkap: User Bicara → AI Mengerti

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Bicara │ ──▶ │   Browser    │ ──▶ │   HeyGen     │ ──▶ │     LLM      │
│  (Suara)     │     │   Capture    │     │   STT API    │     │  (OpenRouter)│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      🎙️                  📡                  📝                    🧠
```

### 7.2 Step 1: Browser Menangkap Suara

Browser menggunakan **MediaStream API** untuk merekam audio dari microphone user:

```javascript
// Browser captures audio from microphone
navigator.mediaDevices.getUserMedia({ audio: true })
```

| Proses      | Penjelasan                                       |
| ----------- | ------------------------------------------------ |
| **Capture** | Microphone menangkap gelombang suara             |
| **Encode**  | Audio dikonversi ke format digital (PCM/Opus)    |
| **Stream**  | Data audio di-stream via **WebSocket** ke HeyGen |

### 7.3 Step 2: HeyGen STT (Speech-to-Text)

HeyGen memiliki **STT engine built-in** yang mengubah suara menjadi teks:

```
Audio Wave → Acoustic Model → Phoneme Recognition → Language Model → Text Output
```

**Proses Internal STT:**

| Tahap                   | Penjelasan                                                        |
| ----------------------- | ----------------------------------------------------------------- |
| **Acoustic Model**      | Neural network menganalisis spektrum audio (frekuensi, durasi)    |
| **Phoneme Recognition** | Mengidentifikasi fonem (unit suara terkecil: /h/, /ɛ/, /l/, /oʊ/) |
| **Language Model**      | Menyusun fonem menjadi kata berdasarkan probabilitas bahasa       |
| **Output**              | String teks: `"Hello, how are you?"`                              |

**Contoh Konversi:**

```
Gelombang suara → [analisis frekuensi] → /h-ɛ-l-oʊ/ → "hello"
```

### 7.4 Step 3: Teks Dikirim ke LLM

Setelah HeyGen menghasilkan teks transcript, kode mengirimnya ke OpenRouter:

```typescript
// Kirim transcript ke OpenRouter via proxy
const response = await fetch('/api/openrouter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'meta-llama/llama-3.2-3b-instruct',
    messages: [
      { role: 'system', content: 'You are an English tutor...' },
      { role: 'user', content: transcribedText } // ← Hasil STT dari HeyGen
    ]
  })
})
```

### 7.5 Step 4: LLM Memproses Teks

> **Penting:** LLM tidak mendengar suara — ia hanya menerima dan memproses **teks**.

**Proses Internal LLM:**

| Tahap            | Penjelasan                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| **Tokenization** | Teks dipecah jadi token: `["Hello", ",", " how", " are", " you", "?"]`  |
| **Embedding**    | Setiap token diubah jadi vektor numerik (representasi makna)            |
| **Attention**    | Model menganalisis hubungan antar kata dalam konteks percakapan         |
| **Prediction**   | Model memprediksi token berikutnya satu per satu secara auto-regressive |

**Contoh Pemrosesan:**

```
Input:  "Hello, how are you?"
         ↓ (tokenize)
Tokens: [15496, 11, 703, 527, 499, 30]
         ↓ (embedding + attention layers)
Output: "I'm doing well, thank you! How can I help you today?"
```

### 7.6 Step 5: Respons Dikembalikan via TTS

```
LLM Response (teks) → HeyGen TTS → Audio + Avatar Video → User
```

HeyGen **TTS (Text-to-Speech)** mengubah teks respons LLM menjadi suara, kemudian avatar berbicara dengan **lip-sync** yang tersinkronisasi.

**Proses TTS:**

| Tahap               | Penjelasan                                      |
| ------------------- | ----------------------------------------------- |
| **Text Analysis**   | Menganalisis struktur kalimat dan intonasi      |
| **Phoneme Mapping** | Mengubah teks ke representasi fonetik           |
| **Neural Vocoder**  | Menyintesis gelombang suara dari fonem          |
| **Lip-Sync**        | Menyinkronkan gerakan bibir avatar dengan audio |

### 7.7 Ringkasan Layer AI

| Layer                    | Fungsi                          | Teknologi               |
| ------------------------ | ------------------------------- | ----------------------- |
| **Audio Capture**        | Rekam suara user                | Browser MediaStream API |
| **STT (Speech-to-Text)** | Ubah suara → teks               | HeyGen built-in STT     |
| **LLM Processing**       | Pahami makna & generate respons | OpenRouter (Meta Llama) |
| **TTS (Text-to-Speech)** | Ubah teks → suara               | HeyGen built-in TTS     |
| **Avatar Rendering**     | Animasi bibir & wajah           | HeyGen Streaming Avatar |

### 7.8 Diagram Lengkap Alur Pemrosesan

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE AI PROCESSING FLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐                                                       │
│   │    USER     │                                                       │
│   │  🎤 Speaks  │                                                       │
│   └──────┬──────┘                                                       │
│          │ Audio Stream                                                 │
│          ▼                                                              │
│   ┌─────────────────────────────────────────┐                          │
│   │         BROWSER (MediaStream API)        │                          │
│   │   navigator.mediaDevices.getUserMedia()  │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │ WebSocket                                        │
│                      ▼                                                  │
│   ┌─────────────────────────────────────────┐                          │
│   │            HEYGEN STT ENGINE             │                          │
│   │   ┌───────────┐  ┌───────────────────┐  │                          │
│   │   │ Acoustic  │→ │ Phoneme → Words   │  │                          │
│   │   │   Model   │  │ Language Model    │  │                          │
│   │   └───────────┘  └───────────────────┘  │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │ Text Transcript                                  │
│                      ▼                                                  │
│   ┌─────────────────────────────────────────┐                          │
│   │         EXPRESS.JS PROXY SERVER          │                          │
│   │           /api/openrouter                │                          │
│   │   (Adds API key, forwards request)       │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │ HTTPS POST                                       │
│                      ▼                                                  │
│   ┌─────────────────────────────────────────┐                          │
│   │           OPENROUTER LLM API             │                          │
│   │   ┌─────────────────────────────────┐   │                          │
│   │   │ 1. Tokenize input               │   │                          │
│   │   │ 2. Embed tokens → vectors       │   │                          │
│   │   │ 3. Attention mechanism          │   │                          │
│   │   │ 4. Predict next tokens          │   │                          │
│   │   │ 5. Stream response (SSE)        │   │                          │
│   │   └─────────────────────────────────┘   │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │ AI Response (Text)                               │
│                      ▼                                                  │
│   ┌─────────────────────────────────────────┐                          │
│   │            HEYGEN TTS ENGINE             │                          │
│   │   ┌───────────────────────────────┐     │                          │
│   │   │ Text → Phonemes → Audio Wave  │     │                          │
│   │   │ + Real-time Lip-Sync Data     │     │                          │
│   │   └───────────────────────────────┘     │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │ Audio + Video Stream                             │
│                      ▼                                                  │
│   ┌─────────────────────────────────────────┐                          │
│   │          AVATAR VIDEO PLAYER             │                          │
│   │   🧑‍💼 Avatar speaks with lip-sync       │                          │
│   └──────────────────┬──────────────────────┘                          │
│                      │                                                  │
│                      ▼                                                  │
│   ┌─────────────┐                                                       │
│   │    USER     │                                                       │
│   │  👂 Listens │                                                       │
│   └─────────────┘                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.9 Key Takeaways

1. **AI tidak langsung mendengar suara** — HeyGen STT yang mengubah suara jadi teks terlebih dahulu
2. **LLM hanya memproses teks** — ia memprediksi respons berdasarkan pola bahasa yang dipelajari saat training
3. **HeyGen TTS** mengubah respons teks kembali jadi suara untuk avatar
4. **Semua proses terjadi secara streaming** — memberikan pengalaman near-realtime kepada user

---

## Kesimpulan

Sistem AI SpeakenAI Tutor terintegrasi dalam beberapa komponen:

1. **Chatbot AI** - Menggunakan OpenRouter dengan streaming untuk respons real-time
2. **Roleplay AI** - HeyGen Avatar dengan STT/TTS untuk interaksi natural
3. **Quiz AI** - Deterministic seeded shuffle untuk challenge harian konsisten
4. **Penilaian AI** - Multi-dimensional scoring (pronunciation, fluency, grammar, prosody)
5. **Grammar AI** - Real-time error detection dengan caching

Semua komponen bekerja bersama untuk memberikan pengalaman belajar bahasa Inggris yang komprehensif dan terukur.

---

_Dokumentasi ini dibuat pada: 20 Januari 2026_  
_Berdasarkan analisis kode SpeakenAI Tutor_
