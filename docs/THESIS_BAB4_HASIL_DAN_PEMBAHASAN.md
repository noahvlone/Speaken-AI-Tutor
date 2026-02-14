# BAB IV
# HASIL DAN PEMBAHASAN

---

Bab ini menjelaskan hasil implementasi sistem SpeakenAI Tutor secara komprehensif, meliputi tampilan dan fungsionalitas setiap halaman dari halaman login hingga halaman progress. Pembahasan difokuskan pada antarmuka pengguna, fitur-fitur yang diimplementasikan, serta integrasi teknologi AI yang digunakan.

---

## 4.1 Hasil Implementasi Antarmuka Sistem

Implementasi sistem SpeakenAI Tutor menghasilkan sebuah platform berbasis web yang mengintegrasikan berbagai teknologi mutakhir. Berikut adalah penjelasan detail setiap halaman yang diimplementasikan dalam sistem.

---

### 4.1.1 Halaman Login (Login Page)

Halaman Login merupakan titik masuk utama bagi pengguna untuk mengakses sistem SpeakenAI Tutor. Halaman ini dirancang dengan antarmuka modern dan responsif yang mendukung dua metode autentikasi.

**Gambar 4.1** Tampilan Halaman Login

#### A. Deskripsi Antarmuka

Halaman Login terdiri dari dua bagian utama yang ditampilkan dalam layout grid dua kolom:

| Komponen | Deskripsi |
|----------|-----------|
| **Form Login (Kiri)** | Berisi form input email, password, checkbox "Remember me", dan tombol login |
| **3D Avatar Mascot (Kanan)** | Menampilkan maskot 3D interaktif dengan pesan "Ready to learn English today?" |
| **Background Animasi** | Elemen blur gradient dengan animasi menggunakan Framer Motion |

**Tabel 4.1** Komponen Halaman Login

#### B. Fitur Autentikasi

Sistem menyediakan dua metode autentikasi yang terintegrasi dengan Supabase Auth:

**1. Login dengan Email dan Password**
- Pengguna memasukkan email dan password pada form yang disediakan
- Validasi dilakukan secara real-time sebelum submit
- Setelah berhasil, pengguna diarahkan ke Halaman Home dengan notifikasi sukses
- Jika gagal, sistem menampilkan pesan error yang informatif

**2. Login dengan Google OAuth**
- Pengguna dapat memilih opsi "Continue with Google"
- Sistem melakukan redirect ke halaman autentikasi Google
- Setelah pengguna memberikan izin, sistem menerima OAuth token
- Pengguna otomatis terdaftar/login dan diarahkan ke sistem

#### C. Elemen Visual

| Elemen | Teknologi | Fungsi |
|--------|-----------|--------|
| **Gradient Background** | CSS + Framer Motion | Memberikan kesan dinamis dan modern |
| **Glassmorphism Card** | Tailwind CSS (backdrop-blur) | Efek kaca transparan untuk form container |
| **Icon Input** | Lucide React (Mail, Lock) | Visual indicator untuk setiap field input |
| **Loading State** | Loader2 (animated spinner) | Feedback saat proses autentikasi berlangsung |

**Tabel 4.2** Elemen Visual Halaman Login

#### D. Navigasi

- Link "Forgot Password?" untuk reset password (belum diimplementasikan)
- Link "Sign Up here" untuk navigasi ke halaman registrasi
- Setelah login berhasil: redirect ke `/home`

---

### 4.1.2 Halaman Register (Register Page)

Halaman Register memungkinkan pengguna baru untuk membuat akun pada sistem SpeakenAI Tutor.

**Gambar 4.2** Tampilan Halaman Register

#### A. Deskripsi Antarmuka

Halaman Register memiliki desain yang konsisten dengan halaman login, dengan form yang lebih lengkap untuk pengumpulan data pengguna baru.

| Field | Tipe Input | Validasi |
|-------|------------|----------|
| **Full Name** | Text | Required, minimum 2 karakter |
| **Email** | Email | Required, format email valid |
| **Password** | Password | Required, minimum 8 karakter |
| **Confirm Password** | Password | Harus sama dengan password |

**Tabel 4.3** Field Form Registrasi

#### B. Proses Registrasi

1. Pengguna mengisi semua field yang diperlukan
2. Sistem melakukan validasi client-side
3. Data dikirim ke Supabase Auth untuk pembuatan akun
4. Jika berhasil:
   - Akun dibuat di Supabase Auth
   - Profile default dibuat di tabel `profiles`
   - Entry default dibuat di tabel `leaderboard_entries`
   - Pengguna diarahkan ke halaman onboarding
5. Jika gagal: pesan error ditampilkan

#### C. Fitur Tambahan

- Opsi registrasi dengan Google OAuth (sama seperti login)
- Link "Already have an account? Login here" untuk navigasi kembali ke login
- Password strength indicator (opsional)

---

### 4.1.3 Halaman Home (Dashboard)

Halaman Home berfungsi sebagai dashboard utama setelah pengguna berhasil login. Halaman ini menyajikan ringkasan statistik pembelajaran dan akses cepat ke fitur-fitur utama.

**Gambar 4.3** Tampilan Halaman Home (Dashboard)

#### A. Deskripsi Antarmuka

Halaman Home terdiri dari beberapa section yang memberikan gambaran lengkap tentang progress pembelajaran pengguna:

| Section | Deskripsi |
|---------|-----------|
| **Welcome Header** | Sapaan personal dengan nama pengguna dan motivational quote |
| **Stats Cards** | Kartu statistik: Total Sessions, Current Streak, Total XP |
| **Quick Actions** | Tombol akses cepat ke Roleplay dan Text Chat |
| **Beginner Scenarios** | Rekomendasi skenario latihan untuk pemula |
| **Daily Challenge Widget** | Widget tantangan harian dengan progress |

**Tabel 4.4** Section Halaman Home

#### B. Komponen Stats Cards

Sistem menampilkan tiga kartu statistik utama yang diambil dari database Supabase:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Total Sesi    │  │  Daily Streak   │  │    Total XP     │
│      15         │  │    🔥 7 days    │  │    ⚡ 2,450     │
│  sessions       │  │   consecutive   │  │    points       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

| Statistik | Sumber Data | Keterangan |
|-----------|-------------|------------|
| **Total Sessions** | `user_progress` table | Jumlah sesi roleplay yang telah diselesaikan |
| **Daily Streak** | `leaderboard_entries` table | Hari berturut-turut aktif di platform |
| **Total XP** | `leaderboard_entries` table | Akumulasi poin dari semua aktivitas |

**Tabel 4.5** Sumber Data Stats Cards

#### C. Quick Actions

Dua tombol utama untuk memulai pembelajaran:

1. **Start Roleplay** → Navigasi ke `/roleplay`
   - Ikon: Video camera
   - Deskripsi: "Practice speaking with AI tutor"
   
2. **Text Chat** → Navigasi ke `/chat`
   - Ikon: Message Square
   - Deskripsi: "Chat with AI for grammar help"

#### D. Beginner Scenarios

Sistem menampilkan skenario latihan yang disarankan untuk pemula:

| Skenario | Deskripsi | Difficulty |
|----------|-----------|------------|
| **Coffee Shop** | Ordering a drink at a café | Beginner |
| **Hotel Check-in** | Checking into a hotel | Beginner |
| **Restaurant** | Ordering food at a restaurant | Beginner |
| **Airport** | Navigating through the airport | Intermediate |

**Tabel 4.6** Beginner Scenarios

---

### 4.1.4 Halaman Roleplay (Interactive Avatar)

Halaman Roleplay merupakan fitur utama SpeakenAI Tutor yang memungkinkan pengguna berlatih speaking dengan avatar AI interaktif dari HeyGen.

**Gambar 4.4** Tampilan Halaman Roleplay

#### A. Deskripsi Antarmuka

Halaman Roleplay menampilkan antarmuka video conference-like dengan avatar AI:

| Komponen | Posisi | Deskripsi |
|----------|--------|-----------|
| **Avatar Video Stream** | Tengah | Video stream avatar HeyGen secara real-time |
| **Avatar Selector** | Atas | Dropdown untuk memilih persona avatar |
| **Language Selector** | Atas | Dropdown untuk memilih bahasa input STT |
| **Control Buttons** | Bawah | Start/Stop session, Start/Stop talking |
| **Message History** | Samping | Riwayat percakapan (user & assistant) |
| **Live Transcript** | Bawah | Transkripsi real-time saat user berbicara |

**Tabel 4.7** Komponen Halaman Roleplay

#### B. Pilihan Avatar

Sistem menyediakan 5 avatar dengan persona berbeda:

| Avatar | Persona | Voice ID | Karakteristik |
|--------|---------|----------|---------------|
| **Ann** | Therapist | Female | Suportif, sabar, cocok untuk pemula |
| **Shawn** | Counselor | Male | Langsung, efisien, cocok untuk latihan intensif |
| **Bryan** | Coach | Male | Energetik, memotivasi, cocok untuk practice aktif |
| **Dexter** | Doctor | Male | Formal, detail, cocok untuk grammar focus |
| **Elenora** | Tech Expert | Female | Analitis, structured, cocok untuk learner advanced |

**Tabel 4.8** Pilihan Avatar SpeakenAI

#### C. Bahasa Input yang Didukung

Sistem mendukung 28+ bahasa untuk Speech-to-Text:

| Kode | Bahasa | Kode | Bahasa |
|------|--------|------|--------|
| en | English | id | Indonesian |
| ja | Japanese | ko | Korean |
| zh | Chinese | es | Spanish |
| fr | French | de | German |
| ... | ... | ... | ... |

**Tabel 4.9** Bahasa Input STT (Sebagian)

#### D. Alur Interaksi Roleplay

```
1. User memilih Avatar dan Bahasa
         ↓
2. User klik "Start Session"
         ↓
3. Sistem request token dari backend → HeyGen API
         ↓
4. Avatar stream diinisialisasi via WebRTC
         ↓
5. Avatar siap dan menyapa user
         ↓
┌────────────────────────────────────────┐
│  LOOP INTERAKSI:                       │
│  6. User klik "Start Talking"          │
│  7. User berbicara (audio captured)    │
│  8. User klik "Stop Talking"           │
│  9. Audio → STT → Text (HeyGen)        │
│  10. Text → LLM → Response (OpenRouter)│
│  11. Response → TTS + Lip-sync → Avatar│
│  12. Avatar berbicara dengan gerakan   │
│  13. Kembali ke step 6 atau End        │
└────────────────────────────────────────┘
         ↓
14. User klik "End Session"
         ↓
15. Sistem menghitung skor evaluasi
         ↓
16. Progress disimpan ke database
         ↓
17. User diarahkan ke Result Summary
```

#### E. Teknologi yang Diintegrasikan

| Teknologi | Provider | Fungsi |
|-----------|----------|--------|
| **WebRTC** | HeyGen SDK | Streaming video/audio real-time |
| **Speech-to-Text** | HeyGen | Konversi suara user ke teks |
| **LLM Processing** | OpenRouter (Llama 3.3) | Generasi respons AI |
| **Text-to-Speech** | HeyGen | Konversi respons ke suara |
| **Lip-Sync** | HeyGen | Sinkronisasi gerakan bibir avatar |

**Tabel 4.10** Teknologi Integrasi Roleplay

#### F. Fitur Evaluasi

Setelah sesi berakhir, sistem memberikan evaluasi:

| Aspek | Rentang | Deskripsi |
|-------|---------|-----------|
| **Pronunciation** | 0-100 | Kejelasan pelafalan kata |
| **Fluency** | 0-100 | Kelancaran berbicara |
| **Grammar** | 0-100 | Ketepatan tata bahasa |
| **Prosody** | 0-100 | Intonasi dan ritme bicara |

**Tabel 4.11** Aspek Evaluasi Roleplay

---

### 4.1.5 Halaman Text Chat

Halaman Text Chat menyediakan alternatif interaksi berbasis teks dengan AI tutor untuk pengguna yang lebih nyaman dengan komunikasi tertulis.

**Gambar 4.5** Tampilan Halaman Text Chat

#### A. Deskripsi Antarmuka

| Komponen | Posisi | Deskripsi |
|----------|--------|-----------|
| **Chat Sidebar** | Kiri | Daftar sesi chat sebelumnya |
| **Chat Area** | Tengah | Area percakapan utama |
| **Message Input** | Bawah | Text area untuk input pesan |
| **Scenario Picker** | Atas | Pilihan skenario roleplay |
| **Grammar Highlight** | Inline | Highlight kesalahan grammar dengan warna |

**Tabel 4.12** Komponen Halaman Text Chat

#### B. Fitur Chat Sessions

Sistem menyimpan riwayat percakapan dalam sesi-sesi terpisah:

| Fitur | Deskripsi |
|-------|-----------|
| **Create Session** | Membuat sesi chat baru dengan judul otomatis |
| **Rename Session** | Mengubah judul sesi untuk referensi mudah |
| **Delete Session** | Menghapus sesi beserta semua pesan |
| **Load History** | Memuat pesan-pesan dari sesi sebelumnya |

**Tabel 4.13** Fitur Manajemen Sesi Chat

#### C. Roleplay Scenarios

Pengguna dapat memilih skenario untuk konteks percakapan:

| Skenario | Role AI | Role User | Difficulty |
|----------|---------|-----------|------------|
| **Job Interview** | Interviewer | Job Applicant | Intermediate |
| **Coffee Shop** | Barista | Customer | Beginner |
| **Business Meeting** | Colleague | Business Professional | Advanced |
| **Travel** | Travel Agent | Traveler | Beginner |
| **Doctor Visit** | Doctor | Patient | Intermediate |

**Tabel 4.14** Skenario Text Chat

#### D. LLM Streaming Response

Sistem mengimplementasikan streaming response untuk pengalaman chat yang responsif:

```
User Input: "Hello, I want to practice for a job interview"
              ↓
         POST /api/openrouter
              ↓
         OpenRouter API (Llama 3.3 70B)
              ↓
         Server-Sent Events (SSE)
              ↓
    ┌─────────────────────────────────┐
    │ Token 1: "Great"                │
    │ Token 2: "!"                    │
    │ Token 3: " I'd"                 │
    │ Token 4: " be"                  │
    │ Token 5: " happy"               │
    │ ...                             │
    │ [DONE]                          │
    └─────────────────────────────────┘
              ↓
    UI menampilkan token secara progresif
    (typing effect)
```

#### E. Grammar Analysis

Sistem secara otomatis menganalisis pesan user untuk kesalahan grammar:

| Tipe Error | Warna Highlight | Contoh |
|------------|-----------------|--------|
| **Subject-Verb Agreement** | Merah | "He go" → "He goes" |
| **Tense Error** | Orange | "I go yesterday" → "I went yesterday" |
| **Article Error** | Kuning | "I bought car" → "I bought a car" |
| **Spelling** | Biru | "recieve" → "receive" |

**Tabel 4.15** Tipe Grammar Error

---

### 4.1.6 Halaman Daily Challenge

Halaman Daily Challenge menyediakan tantangan harian berupa quiz untuk melatih kemampuan bahasa Inggris secara konsisten.

**Gambar 4.6** Tampilan Halaman Daily Challenge

#### A. Deskripsi Antarmuka

| Komponen | Deskripsi |
|----------|-----------|
| **Challenge Header** | Judul challenge, tanggal, dan progress indicator |
| **Question Card** | Kartu pertanyaan dengan 4 pilihan jawaban |
| **Answer Buttons** | Tombol A, B, C, D untuk memilih jawaban |
| **Feedback Panel** | Penjelasan setelah menjawab (benar/salah) |
| **Progress Bar** | Indikator pertanyaan ke-n dari 5 |
| **Score Summary** | Ringkasan skor di akhir challenge |

**Tabel 4.16** Komponen Halaman Daily Challenge

#### B. Mekanisme Challenge

1. **Availability Check**: Sistem mengecek apakah user sudah menyelesaikan challenge hari ini
2. **Question Loading**: 5 pertanyaan diambil dari database berdasarkan tanggal
3. **Answer Submission**: User memilih jawaban untuk setiap pertanyaan
4. **Immediate Feedback**: Sistem menampilkan apakah jawaban benar/salah dengan penjelasan
5. **XP Calculation**: 20 XP per jawaban benar (maksimal 100 XP per hari)
6. **Streak Update**: Jika berhasil, streak harian bertambah

#### C. Kategori Pertanyaan

| Kategori | Contoh Pertanyaan |
|----------|-------------------|
| **Grammar** | "Which sentence is grammatically correct?" |
| **Vocabulary** | "What is the meaning of 'ubiquitous'?" |
| **Idioms** | "What does 'break the ice' mean?" |
| **Pronunciation** | "Which word has the same vowel sound as 'cat'?" |
| **Comprehension** | "Based on the passage, what can be inferred?" |

**Tabel 4.17** Kategori Pertanyaan Daily Challenge

#### D. Reward System

| Hasil | XP Earned | Streak Effect |
|-------|-----------|---------------|
| 5/5 Correct | 100 XP | Streak +1 |
| 4/5 Correct | 80 XP | Streak +1 |
| 3/5 Correct | 60 XP | Streak +1 |
| 2/5 Correct | 40 XP | Streak +1 |
| 1/5 Correct | 20 XP | Streak +1 |
| 0/5 Correct | 0 XP | Streak reset |

**Tabel 4.18** Sistem Reward Daily Challenge

---

### 4.1.7 Halaman Leaderboard

Halaman Leaderboard menampilkan peringkat pengguna berdasarkan total XP yang dikumpulkan.

**Gambar 4.7** Tampilan Halaman Leaderboard

#### A. Deskripsi Antarmuka

| Komponen | Deskripsi |
|----------|-----------|
| **Top 3 Podium** | Display khusus untuk 3 peringkat teratas dengan medali |
| **Leaderboard Table** | Tabel ranking 4-100 dengan data lengkap |
| **User Highlight** | Highlight khusus untuk posisi user saat ini |
| **Filter Options** | Filter berdasarkan: All Time, This Week, This Month |

**Tabel 4.19** Komponen Halaman Leaderboard

#### B. Data yang Ditampilkan

| Kolom | Deskripsi |
|-------|-----------|
| **Rank** | Posisi di leaderboard (1, 2, 3, dst.) |
| **Avatar** | Foto profil pengguna |
| **Name** | Nama lengkap pengguna |
| **Total XP** | Total poin pengalaman |
| **Streak** | Hari berturut-turut aktif |
| **Challenges** | Jumlah challenge yang diselesaikan |

**Tabel 4.20** Kolom Leaderboard

#### C. Ranking Badges

| Rank | Badge | Warna |
|------|-------|-------|
| 1 | 🥇 | Gold (#FFD700) |
| 2 | 🥈 | Silver (#C0C0C0) |
| 3 | 🥉 | Bronze (#CD7F32) |
| 4-10 | ⭐ | Blue |
| 11+ | - | Default |

**Tabel 4.21** Ranking Badges

---

### 4.1.8 Halaman Profile

Halaman Profile memungkinkan pengguna untuk melihat dan mengedit informasi profil pribadi mereka.

**Gambar 4.8** Tampilan Halaman Profile

#### A. Deskripsi Antarmuka

| Section | Komponen |
|---------|----------|
| **Profile Header** | Avatar, nama, level, total XP, join date |
| **Personal Info** | Form: Full Name, Email, Phone, Location, Birthday |
| **Account Settings** | Change Password, Privacy Settings |
| **Level Progress** | Progress bar menuju level berikutnya |
| **Achievement Badges** | Koleksi badge yang telah diraih |

**Tabel 4.22** Section Halaman Profile

#### B. Level System

Sistem level berdasarkan akumulasi XP:

| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 - 100 | Beginner |
| 2 | 101 - 300 | Novice |
| 3 | 301 - 600 | Learner |
| 4 | 601 - 1000 | Student |
| 5 | 1001 - 1500 | Practitioner |
| 6 | 1501 - 2500 | Advanced |
| 7 | 2501 - 4000 | Expert |
| 8 | 4001 - 6000 | Master |
| 9 | 6001 - 10000 | Grandmaster |
| 10 | 10000+ | Legend |

**Tabel 4.23** Level System

#### C. Fitur Edit Profile

| Field | Tipe | Validasi |
|-------|------|----------|
| **Full Name** | Text | Required, 2-50 karakter |
| **Email** | Email | Read-only (dari auth) |
| **Phone** | Tel | Optional, format E.164 |
| **Location** | Text | Optional |
| **Birthday** | Date | Optional |
| **Avatar** | File | Max 2MB, JPG/PNG |

**Tabel 4.24** Validasi Field Profile

#### D. Upload Avatar

Proses upload avatar menggunakan Supabase Storage:

1. User memilih file gambar
2. Client-side validation (size, type)
3. Upload ke Supabase Storage bucket `avatars`
4. URL publik disimpan di tabel `profiles`
5. UI menampilkan avatar baru

---

### 4.1.9 Halaman Progress

Halaman Progress menampilkan statistik pembelajaran pengguna dalam bentuk grafik dan visualisasi data yang informatif.

**Gambar 4.9** Tampilan Halaman Progress

#### A. Deskripsi Antarmuka

| Section | Komponen | Library |
|---------|----------|---------|
| **Stats Overview** | Cards: Total Sessions, Avg Score, Best Score, Practice Time | Custom |
| **Weekly Progress Chart** | Line chart skor mingguan | Recharts |
| **Skill Breakdown** | Bar chart per aspek (Grammar, Fluency, etc.) | Recharts |
| **Activity Calendar** | Heat map aktivitas harian | Custom |
| **Challenge Progress** | Pie chart completion rate | Recharts |

**Tabel 4.25** Komponen Halaman Progress

#### B. Grafik Weekly Progress

Line chart yang menampilkan perkembangan skor selama 7 hari terakhir:

```
Score
100 |                    ●
 90 |          ●────●   /
 80 |    ●────●       ●
 70 |   /
 60 |  ●
    └─────────────────────
      Mon Tue Wed Thu Fri Sat Sun
```

| Data Point | Sumber |
|------------|--------|
| Date | `session_date` dari `user_progress` |
| Average Score | Mean(pronunciation, fluency, grammar, prosody) |

**Tabel 4.26** Data Weekly Progress Chart

#### C. Skill Breakdown

Bar chart horizontal untuk setiap aspek kemampuan:

| Aspek | Warna | Sumber Data |
|-------|-------|-------------|
| **Pronunciation** | #22c55e (Green) | Avg dari `pronunciation_score` |
| **Fluency** | #3b82f6 (Blue) | Avg dari `fluency_score` |
| **Grammar** | #f59e0b (Amber) | Avg dari `grammar_score` |
| **Prosody** | #8b5cf6 (Purple) | Avg dari `prosody_score` |

**Tabel 4.27** Data Skill Breakdown

#### D. Stats Cards

| Card | Kalkulasi | Icon |
|------|-----------|------|
| **Total Sessions** | COUNT(*) from user_progress | 📊 |
| **Average Score** | AVG(all scores) | 📈 |
| **Best Score** | MAX(average score per session) | 🏆 |
| **Practice Time** | SUM(duration_seconds) | ⏱️ |

**Tabel 4.28** Kalkulasi Stats Cards

#### E. Challenge Progress

Pie chart yang menampilkan:

| Segment | Warna | Data |
|---------|-------|------|
| **Completed** | Green | Challenges yang diselesaikan |
| **Missed** | Red | Hari tanpa challenge |
| **Pending** | Gray | Challenge hari ini (jika belum) |

**Tabel 4.29** Data Challenge Progress

---

### 4.1.10 Halaman Settings

Halaman Settings memungkinkan pengguna untuk mengkonfigurasi preferensi aplikasi.

**Gambar 4.10** Tampilan Halaman Settings

#### A. Kategori Pengaturan

| Kategori | Pengaturan |
|----------|------------|
| **Appearance** | Theme (Light/Dark/System), Language |
| **Notifications** | Email notifications, Push notifications |
| **Audio** | Auto-play TTS, TTS Speed, TTS Voice |
| **Privacy** | Profile visibility, Show in leaderboard |
| **Account** | Change password, Delete account |

**Tabel 4.30** Kategori Settings

#### B. Theme Options

| Theme | Deskripsi |
|-------|-----------|
| **Light** | Background putih, teks gelap |
| **Dark** | Background gelap, teks terang |
| **System** | Mengikuti preferensi OS |

**Tabel 4.31** Theme Options

#### C. Data Persistence

Pengaturan disimpan di dua lokasi:

| Data | Lokasi | Alasan |
|------|--------|--------|
| **Theme** | LocalStorage | Akses cepat, tidak perlu auth |
| **User Preferences** | Supabase (user_settings) | Sinkronisasi cross-device |

**Tabel 4.32** Lokasi Penyimpanan Settings

---

## 4.2 Ringkasan Implementasi Antarmuka

### 4.2.1 Daftar Halaman Sistem

| No | Halaman | Route | Status Auth |
|----|---------|-------|-------------|
| 1 | Login | `/login` | Public |
| 2 | Register | `/register` | Public |
| 3 | Home | `/home` | Protected |
| 4 | Roleplay | `/roleplay` | Protected |
| 5 | Text Chat | `/chat` | Protected |
| 6 | Daily Challenge | `/challenge` | Protected |
| 7 | Leaderboard | `/leaderboard` | Protected |
| 8 | Profile | `/profile` | Protected |
| 9 | Progress | `/progress` | Protected |
| 10 | Settings | `/settings` | Protected |

**Tabel 4.33** Daftar Halaman Sistem SpeakenAI

### 4.2.2 Teknologi Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 18.x | UI Library |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool |
| **Tailwind CSS** | 3.x | Styling |
| **Framer Motion** | 11.x | Animasi |
| **Recharts** | 2.x | Visualisasi data |
| **Lucide React** | - | Icon library |
| **shadcn/ui** | - | Component library |

**Tabel 4.34** Teknologi Frontend

### 4.2.3 Integrasi External Services

| Service | Provider | Fungsi |
|---------|----------|--------|
| **Authentication** | Supabase Auth | Login, Register, OAuth |
| **Database** | Supabase PostgreSQL | Data storage |
| **Storage** | Supabase Storage | Avatar upload |
| **LLM** | OpenRouter (Llama 3.3) | AI responses |
| **Avatar** | HeyGen Streaming | Interactive avatar |
| **STT/TTS** | HeyGen | Voice processing |

**Tabel 4.35** External Services Integration

---

## 4.3 Hasil Pengujian Sistem

_(Bagian ini akan berisi hasil pengujian Black Box Testing yang telah dilakukan)_

---

## 4.4 Pembahasan

_(Bagian ini akan berisi analisis dan pembahasan hasil implementasi)_

---

_Dokumen ini disusun sebagai BAB IV Hasil dan Pembahasan untuk Tugas Akhir SpeakenAI Tutor_  
_Terakhir diperbarui: 4 Februari 2026_
