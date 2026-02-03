# 🚀 BAB IV - IMPLEMENTASI DAN PENGUJIAN

## 💻 4.1 Lingkungan Pengembangan

### 4.1.1 Spesifikasi Perangkat Keras

| Komponen  | Spesifikasi                                 |
| --------- | ------------------------------------------- |
| Processor | AMD Ryzen 5 / Intel Core i5 atau setara     |
| RAM       | Minimal 8 GB                                |
| Storage   | SSD 256 GB                                  |
| Internet  | Koneksi broadband untuk akses API eksternal |

### 4.1.2 Spesifikasi Perangkat Lunak

| Software           | Versi     | Fungsi                         |
| ------------------ | --------- | ------------------------------ |
| Node.js            | v18.x LTS | Runtime JavaScript server-side |
| npm/pnpm           | v9.x      | Package manager                |
| Visual Studio Code | Latest    | Code editor                    |
| Git                | v2.x      | Version control                |
| Chrome/Firefox     | Latest    | Browser testing                |

### 4.1.3 Paket dan Library Utama

**Frontend (React + Vite):**

| Package               | Versi | Fungsi               |
| --------------------- | ----- | -------------------- |
| react                 | ^18.x | UI library           |
| react-router-dom      | ^6.x  | Client-side routing  |
| @supabase/supabase-js | ^2.x  | Supabase client      |
| framer-motion         | ^11.x | Animasi UI           |
| lucide-react          | ^0.x  | Icon library         |
| sonner                | ^1.x  | Toast notifications  |
| recharts              | ^2.x  | Grafik dan chart     |
| i18next               | ^23.x | Internationalization |

**Backend (Express.js):**

| Package | Versi | Fungsi                        |
| ------- | ----- | ----------------------------- |
| express | ^4.x  | Web framework                 |
| cors    | ^2.x  | Cross-origin resource sharing |
| dotenv  | ^16.x | Environment variables         |
| undici  | ^6.x  | HTTP client untuk fetch       |

---

---

## 🎨 4.2 Implementasi Frontend

> [!TIP]
> Implementasi frontend berfokus pada pengalaman pengguna yang responsif dan interaktif, menggunakan **React** sebagai pustaka utama dan **Tailwind CSS** untuk desain antarmuka yang modern.

### 4.2.1 Struktur Folder

```
src/
├── components/           # UI Components (36+ files)
│   ├── AvatarSession/    # Avatar roleplay components
│   ├── ChatPage.tsx      # Text chat halaman utama
│   ├── RoleplayPage.tsx  # Voice roleplay dengan avatar
│   ├── HomePage.tsx      # Dashboard
│   ├── LoginPage.tsx     # Autentikasi
│   ├── ProfilePage.tsx   # Pengaturan profil
│   └── ...
├── hooks/                # Custom React Hooks (8 files)
│   ├── useAuth.ts        # Authentication state
│   ├── useSupabaseChat.ts # Chat session management
│   ├── useUserProgress.ts # Progress tracking
│   └── useLeaderboard.ts  # Gamifikasi
├── lib/                  # Utilities
│   ├── supabaseClient.ts # Supabase connection
│   └── openrouter.ts     # LLM API helper
├── i18n/                 # Internationalization
├── App.tsx               # Routing utama
└── main.tsx              # Entry point
```

### 4.2.2 Implementasi Routing

```tsx
// App.tsx - Konfigurasi Route
export default function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage userId={user?.id} />} />
          <Route path="/roleplay" element={<RoleplayPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/history" element={<RoleplayHistoryPage />} />
          <Route path="/challenge" element={<DailyChallengePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 4.2.3 Implementasi Custom Hook - useSupabaseChat

```typescript
// hooks/useSupabaseChat.ts
export function useSupabaseChat(userId: string | null) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);

  // Load sessions dari database
  useEffect(() => {
    const loadSessions = async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      setSessions(data as Session[]);
    };
    loadSessions();
  }, [userId]);

  // Fungsi create session
  const createSession = async (title = "New chat") => {
    const { data } = await supabase
      .from("chat_sessions")
      .insert({ title, user_id: userId })
      .select("*")
      .single();
    setSessions(prev => [data, ...prev]);
    setActiveId(data.id);
    return data.id;
  };

  // Fungsi append message
  const appendMessage = async (sessionId, role, content) => {
    const { data } = await supabase
      .from("chat_messages")
      .insert({ session_id: sessionId, role, content })
      .select("*")
      .single();
    setMessages(prev => [...prev, data]);
    return data.id;
  };

  return { sessions, messages, createSession, appendMessage, ... };
}
```

### 4.2.4 Implementasi Real-time Streaming Chat

```typescript
// Fungsi untuk streaming response dari LLM
const handleSendMessage = async (userInput: string) => {
  // 1. Simpan pesan user
  await appendMessage(sessionId, 'user', userInput)

  // 2. Panggil API dengan streaming
  const response = await fetch('/api/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-70b-instruct',
      messages: [...history, { role: 'user', content: userInput }],
      stream: true
    })
  })

  // 3. Proses streaming SSE
  const reader = response.body.getReader()
  let assistantReply = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = new TextDecoder().decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        if (data.choices?.[0]?.delta?.content) {
          assistantReply += data.choices[0].delta.content
          setStreamingText(assistantReply) // Update UI real-time
        }
      }
    }
  }

  // 4. Simpan response lengkap ke database
  await appendMessage(sessionId, 'assistant', assistantReply)
}
```

---

---

## ⚙️ 4.3 Implementasi Backend

> [!NOTE]
> Backend berfungsi sebagai jembatan (proxy) antara frontend dan layanan AI eksternal, sekaligus menangani manajemen file dan logika bisnis server-side.

### 4.3.1 Struktur Server

```typescript
// server/index.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR))

const PORT = Number(process.env.PORT || 8787)
app.listen(PORT, () => {
  console.log(`SpeakenAI server listening on http://localhost:${PORT}`)
})
```

### 4.3.2 API Endpoint - HeyGen Token

```typescript
// GET /api/heygen/token - Generate HeyGen session token
app.get('/api/heygen/token', async (_req, res) => {
  try {
    const r = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: { 'x-api-key': process.env.HEYGEN_API_KEY ?? '' }
    })

    if (!r.ok) {
      return res.status(r.status).send(await r.text())
    }

    const json = await r.json()
    res.json({ token: json.data?.token })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch token' })
  }
})
```

### 4.3.3 API Endpoint - OpenRouter Proxy (SSE Streaming)

```typescript
// POST /api/openrouter - Proxy ke OpenRouter LLM dengan SSE
app.post('/api/openrouter', async (req, res) => {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  const controller = new AbortController()
  req.on('close', () => controller.abort())

  const upstream = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'SpeakenAI'
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    }
  )

  // Forward status dan headers
  res.status(upstream.status)
  const isSSE = upstream.headers
    .get('content-type')
    ?.includes('text/event-stream')
  res.setHeader(
    'Content-Type',
    isSSE ? 'text/event-stream' : 'application/json'
  )

  // Pipe stream ke client
  if (upstream.body) {
    const nodeStream = Readable.fromWeb(upstream.body)
    nodeStream.pipe(res)
  }
})
```

### 4.3.4 API Endpoint - Avatar Upload

```typescript
// POST /api/upload-avatar - Upload avatar ke local storage
app.post('/api/upload-avatar', async (req, res) => {
  const { userId, imageData } = req.body

  // Parse base64 image
  const matches = imageData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/)
  const extension = matches[1]
  const buffer = Buffer.from(matches[2], 'base64')

  // Save to user directory
  const userDir = path.join(UPLOADS_DIR, userId)
  fs.mkdirSync(userDir, { recursive: true })
  fs.writeFileSync(path.join(userDir, `avatar.${extension}`), buffer)

  res.json({ publicUrl: `/uploads/${userId}/avatar.${extension}` })
})
```

---

---

## 📅 4.4 Implementasi Database

> [!IMPORTANT]
> Sistem menggunakan **Supabase** sebagai platform backend-as-a-service untuk manajemen database relasional (PostgreSQL) dan autentikasi.

### 4.4.1 Koneksi Supabase

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
```

### 4.4.2 Migrasi Database - Chat System

```sql
-- migrations/005_add_chat_system.sql
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk performa
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);
```

### 4.4.3 Migrasi Database - Progress & Gamifikasi

```sql
-- migrations/001_progress_leaderboard_challenges.sql
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pronunciation_score INTEGER CHECK (pronunciation_score >= 0 AND pronunciation_score <= 100),
  fluency_score INTEGER CHECK (fluency_score >= 0 AND fluency_score <= 100),
  accuracy_score INTEGER CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  prosody_score INTEGER CHECK (prosody_score >= 0 AND prosody_score <= 100),
  session_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  rank INTEGER,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true
);
```

---

---

## 🧪 4.5 Pengujian Sistem

> [!IMPORTANT]
> Pengujian menggunakan metode **Black Box Testing** untuk memvalidasi fungsionalitas sistem berdasarkan input dan output tanpa melihat struktur internal kode.

### 4.5.1 Metode Pengujian

Pengujian menggunakan metode **Black Box Testing** untuk memvalidasi fungsionalitas sistem berdasarkan input dan output tanpa melihat struktur internal kode.

### 4.5.2 Hasil Pengujian - Modul Autentikasi

| No  | Fungsi          | Skenario              | Input                       | Output Diharapkan                   | Status      |
| --- | --------------- | --------------------- | --------------------------- | ----------------------------------- | ----------- |
| 1   | Registrasi      | Email valid           | Email, password, nama       | Akun berhasil dibuat                | ✅ Berjalan |
| 2   | Registrasi      | Email sudah terdaftar | Email existing              | Error "Email sudah terdaftar"       | ✅ Berjalan |
| 3   | Registrasi      | Password lemah        | Password < 6 char           | Error "Password minimal 6 karakter" | ✅ Berjalan |
| 4   | Login           | Kredensial valid      | Email & password benar      | Masuk ke dashboard                  | ✅ Berjalan |
| 5   | Login           | Password salah        | Email benar, password salah | Error "Email atau password salah"   | ✅ Berjalan |
| 6   | Login Google    | OAuth valid           | Akun Google                 | Berhasil login via OAuth            | ✅ Berjalan |
| 7   | Logout          | Sesi aktif            | Klik logout                 | Sesi berakhir, redirect login       | ✅ Berjalan |
| 8   | Protected Route | Tanpa login           | Akses URL protected         | Redirect ke login                   | ✅ Berjalan |

### 4.5.3 Hasil Pengujian - Modul Roleplay

| No  | Fungsi         | Skenario        | Input                | Output Diharapkan                | Status      |
| --- | -------------- | --------------- | -------------------- | -------------------------------- | ----------- |
| 9   | Pilih Avatar   | Pemilihan valid | Klik avatar          | Avatar terpilih ditampilkan      | ✅ Berjalan |
| 10  | Start Session  | Token valid     | Klik "Start Session" | Avatar muncul, sesi dimulai      | ✅ Berjalan |
| 11  | Speech-to-Text | Audio jernih    | Suara via mikrofon   | Teks transkripsi muncul          | ✅ Berjalan |
| 12  | AI Response    | Query valid     | Input teks/suara     | Avatar berbicara dengan lip-sync | ✅ Berjalan |
| 13  | End Session    | Sesi aktif      | Klik "End Session"   | Evaluasi ditampilkan             | ✅ Berjalan |

### 4.5.4 Hasil Pengujian - Modul Text Chat

| No  | Fungsi             | Skenario       | Input                 | Output Diharapkan     | Status      |
| --- | ------------------ | -------------- | --------------------- | --------------------- | ----------- |
| 14  | Kirim Pesan        | Pesan valid    | Teks di chat box      | Response AI streaming | ✅ Berjalan |
| 15  | Kirim Pesan        | Pesan kosong   | Kosong, klik send     | Tombol disabled       | ✅ Berjalan |
| 16  | Streaming          | LLM aktif      | Request ke OpenRouter | Response via SSE      | ✅ Berjalan |
| 17  | Grammar Correction | Kalimat error  | "I goes to school"    | AI koreksi grammar    | ✅ Berjalan |
| 18  | Riwayat Chat       | Sesi tersimpan | Refresh               | History tetap ada     | ✅ Berjalan |

### 4.5.5 Hasil Pengujian - Modul Gamifikasi

| No  | Fungsi          | Skenario          | Input                 | Output Diharapkan            | Status      |
| --- | --------------- | ----------------- | --------------------- | ---------------------------- | ----------- |
| 19  | Daily Challenge | Halaman challenge | Akses /challenge      | Daftar challenge ditampilkan | ✅ Berjalan |
| 20  | Submit Answer   | Jawaban benar     | Submit correct answer | XP bertambah                 | ✅ Berjalan |
| 21  | Submit Answer   | Jawaban salah     | Submit wrong answer   | Penjelasan ditampilkan       | ✅ Berjalan |
| 22  | Leaderboard     | Halaman ranking   | Akses /leaderboard    | Ranking berdasarkan XP       | ✅ Berjalan |
| 23  | Daily Streak    | Login berturut    | Login setiap hari     | Streak counter + 1           | ✅ Berjalan |

### 4.5.6 Ringkasan Hasil Pengujian

| Kategori              | Total Test Case | ✅ Berhasil | ❌ Gagal |
| --------------------- | --------------- | ----------- | -------- |
| Autentikasi           | 9               | 9           | 0        |
| Roleplay (Voice)      | 9               | 9           | 0        |
| Text Chat             | 8               | 8           | 0        |
| Daily Challenge       | 5               | 5           | 0        |
| Progress & Evaluation | 7               | 7           | 0        |
| Leaderboard           | 3               | 3           | 0        |
| Profile & Settings    | 7               | 7           | 0        |
| API Server            | 5               | 5           | 0        |
| Database (Supabase)   | 5               | 5           | 0        |
| **TOTAL**             | **58**          | **58**      | **0**    |

**Kesimpulan Pengujian:**

> [!NOTE]
> Seluruh 58 test case berhasil dijalankan dengan hasil sesuai ekspektasi. Tingkat keberhasilan: **100%**.

---

## 🖼️ 4.6 Tampilan Antarmuka Sistem

### 4.6.1 Halaman Login

Halaman login menyediakan dua opsi autentikasi:

- Login dengan email dan password
- Login dengan Google OAuth

### 4.6.2 Halaman Dashboard (Home)

Dashboard menampilkan:

- Welcome message dengan nama pengguna
- Statistik pembelajaran (total sessions, streak, XP)
- Quick actions ke fitur utama
- Recent activity summary

### 4.6.3 Halaman Roleplay

Halaman roleplay menampilkan:

- Pilihan avatar tutor (5 persona berbeda)
- Pilihan bahasa input STT
- Area video avatar dengan lip-sync
- Subtitle real-time
- Tombol Start/End Session

### 4.6.4 Halaman Text Chat

Halaman chat menampilkan:

- Sidebar daftar sesi chat
- Area pesan dengan bubble user/assistant
- Input teks dengan tombol send
- Markdown rendering untuk response AI

### 4.6.5 Halaman Progress

Halaman progress menampilkan:

- Grafik line chart progress mingguan
- Skor pronunciation, fluency, accuracy, prosody
- Statistik ringkasan (total sessions, average scores)
- Error frequency chart

### 4.6.6 Halaman Daily Challenge

Halaman challenge menampilkan:

- Soal tantangan dengan multiple choice
- Timer countdown
- Penjelasan setelah submit
- XP earned notification

---

_Dokumen ini merupakan bagian dari dokumentasi teknis sistem SpeakenAI Tutor_
