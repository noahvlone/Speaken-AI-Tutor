# Analisis Kebutuhan Sistem SpeakenAI

Dokumen ini menjelaskan kebutuhan fungsional dan non-fungsional untuk sistem **SpeakenAI Tutor** - platform pembelajaran bahasa berbasis AI dengan avatar interaktif.

---

## Kebutuhan Fungsional

Kebutuhan fungsional adalah kebutuhan yang menggambarkan layanan apa saja yang harus disediakan oleh sistem. Fitur inti sistem SpeakenAI meliputi:

### 1. Autentikasi Pengguna

- Registrasi dan login menggunakan email atau Google OAuth.
- Manajemen sesi pengguna.
- Penyimpanan profil dasar (nama, level bahasa, riwayat belajar).

### 2. AI Conversational Agent (LLM – OpenRouter)

- Sistem dapat melakukan percakapan berbasis teks dan suara.
- AI memberikan koreksi grammar, pronunciation feedback, dan rekomendasi pembelajaran.
- AI mampu menyesuaikan tingkat kesulitan berdasarkan level user.
- Response dari AI dikirim ke server menggunakan API OpenRouter (Meta Llama 3.3 70B Instruct).

### 3. Modul Speech-to-Text (STT)

- Merekam suara pengguna melalui mikrofon browser.
- Mengonversi suara ke teks menggunakan HeyGen built-in STT.
- Mendukung 28 bahasa input (termasuk Indonesian, English, Japanese, Korean, dll).
- Hasil transkripsi dikirimkan ke LLM untuk diproses.

### 4. Modul Text-to-Speech (TTS)

- Mengonversi respon AI menjadi audio natural.
- Mendukung suara natural (neural TTS) via HeyGen.
- Output audio digunakan untuk sinkronisasi avatar lip-sync.

### 5. Avatar Interaktif (HeyGen Streaming Avatar)

- Menampilkan avatar virtual yang mampu:
  - Melakukan lip-sync sesuai audio TTS secara real-time.
  - Menampilkan ekspresi wajah natural.
  - Berinteraksi sebagai tutor dengan berbagai persona (Therapist, Coach, Doctor, Tech Expert).
- Avatar menampilkan respon AI secara visual dengan streaming.

### 6. Chat Interface (Web-Based)

- Percakapan real-time antara pengguna dan AI.
- Mendukung dua mode:
  - **Text Chat Mode**: Input/output berbasis teks dengan streaming SSE.
  - **Roleplay Mode**: Input suara dengan output avatar animasi.
- Menampilkan subtitle hasil STT dan respon AI.
- Riwayat chat tersimpan per sesi.

### 7. Manajemen Materi dan Pembelajaran

- Sistem menyediakan materi seperti:
  - Daily conversation practice
  - Pronunciation practice
  - Grammar practice
  - Vocabulary building
- 5 avatar tutor dengan persona berbeda:
  - Ann Therapist (Counselor - soft skills)
  - Shawn Therapist (Life Coach - professional)
  - Bryan Fitness Coach (Motivator - informal)
  - Dexter Doctor (Medical Expert - formal)
  - Elenora Tech Expert (Consultant - analytical)

### 8. Riwayat Interaksi & Progress Tracking

- Menampilkan hasil evaluasi pembelajaran:
  - Grammar score
  - Fluency score
  - Pronunciation feedback
  - Session summary
- Leaderboard untuk gamifikasi.
- Challenge system dengan daily/weekly goals.

### 9. Pengelolaan Penyimpanan

- Data disimpan di Supabase (PostgreSQL Cloud).
- Penyimpanan meliputi:
  - User profiles & authentication
  - Chat sessions & messages
  - Learning progress & scores
  - Challenge completions

---

## Kebutuhan Non-Fungsional

### 1. Performa

- Sistem harus response maksimal 2–4 detik per permintaan LLM.
- STT memproses audio < 3 detik untuk input 5–10 detik.
- Avatar HeyGen harus merender lip-sync secara real-time (streaming).
- SSE streaming untuk response AI yang smooth.

### 2. Keamanan

- Token API OpenRouter dan HeyGen disimpan di server (environment variables).
- API keys tidak di-expose ke client (menggunakan prefix non-VITE\_ untuk secrets).
- Akses database diproteksi dengan Supabase RLS (Row Level Security).
- Autentikasi menggunakan Supabase Auth dengan JWT.

### 3. Reliabilitas

- Sistem harus tetap stabil dengan multiple concurrent users.
- Jika HeyGen API gagal, sistem fallback ke text-only chat mode.
- Error handling untuk network failures dan API timeouts.
- Abort controller untuk membatalkan streaming yang tidak diperlukan.

### 4. Usability

- UI modern dengan dark/light theme support.
- Responsive design untuk mobile dan desktop.
- Multi-language interface (i18n) - mendukung berbagai bahasa UI.
- Animasi smooth menggunakan Framer Motion.

### 5. Portabilitas

- Frontend berbasis React + Vite (cross-browser compatible).
- Backend Node.js + Express (cross-platform).
- Bisa di-deploy ke berbagai cloud platform (Vercel, Railway, dll).

### 6. Maintainability

- Codebase menggunakan TypeScript untuk type safety.
- Komponen UI modular menggunakan Radix primitives.
- Separation of concerns antara hooks, components, dan utilities.

---

## Kebutuhan Pengguna

### Pengguna Utama (Learner)

Pengguna yang ingin belajar dan meningkatkan kemampuan bahasa:

| Kebutuhan             | Deskripsi                                                         |
| --------------------- | ----------------------------------------------------------------- |
| Memulai sesi roleplay | Memilih avatar tutor dan bahasa input untuk berlatih percakapan   |
| Chat dengan AI        | Melakukan percakapan teks dengan AI tutor                         |
| Input suara           | Berbicara langsung dengan avatar menggunakan mikrofon             |
| Melihat progress      | Mengakses riwayat sesi, skor, dan progress pembelajaran           |
| Personalisasi         | Mengatur profil, preferensi bahasa, dan tema tampilan             |
| Challenges            | Mengikuti tantangan harian/mingguan untuk meningkatkan engagement |
| Leaderboard           | Melihat peringkat dan membandingkan progress dengan pengguna lain |

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React + Vite + TypeScript               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Roleplay  │  │  Text Chat  │  │   Profile   │   │   │
│  │  │    Page     │  │    Page     │  │    Page     │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Node.js)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/heygen/token    │  /api/openrouter (SSE)      │   │
│  │  /api/upload-avatar   │                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  HeyGen API     │  │  OpenRouter API │  │    Supabase     │
│  (Avatar + TTS  │  │  (LLM - Llama   │  │  (PostgreSQL +  │
│   + STT)        │  │   3.3 70B)      │  │     Auth)       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

_Dokumen ini dibuat berdasarkan analisis sistem Speaken-AI-Tutor_  
_Terakhir diperbarui: 20 Januari 2026_
