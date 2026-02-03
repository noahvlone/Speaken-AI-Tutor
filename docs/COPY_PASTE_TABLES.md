# DAFTAR TABEL & GAMBAR BAB III

## Untuk Copy-Paste ke Google Docs

---

## 📊 DAFTAR TABEL

### Tabel 3.1 - Identifikasi Masalah Pembelajaran Bahasa Inggris

| No  | Masalah                                     | Dampak                              |
| --- | ------------------------------------------- | ----------------------------------- |
| 1   | Kurangnya partner latihan percakapan        | Kemampuan speaking tidak berkembang |
| 2   | Keterbatasan waktu dan tempat untuk belajar | Proses pembelajaran tidak fleksibel |
| 3   | Tidak ada feedback langsung pronunciation   | Kesalahan berulang tanpa koreksi    |
| 4   | Metode pembelajaran monoton                 | Motivasi belajar menurun            |
| 5   | Biaya kursus bahasa yang mahal              | Akses pembelajaran terbatas         |

---

### Tabel 3.2 - Analisis Kebutuhan Pengguna (Learner)

| Kebutuhan          | Deskripsi                                         |
| ------------------ | ------------------------------------------------- |
| Latihan Percakapan | Membutuhkan partner untuk berlatih speaking       |
| Feedback Real-time | Koreksi grammar dan pronunciation secara langsung |
| Fleksibilitas      | Belajar kapan saja dan di mana saja               |
| Personalisasi      | Materi disesuaikan dengan level kemampuan         |
| Gamifikasi         | Elemen permainan untuk meningkatkan motivasi      |

---

### Tabel 3.3 - Daftar Kebutuhan Fungsional Sistem

| Kode  | Kebutuhan Fungsional | Deskripsi                                                |
| ----- | -------------------- | -------------------------------------------------------- |
| FR-01 | Autentikasi Pengguna | Registrasi dan login menggunakan email atau Google OAuth |
| FR-02 | AI Conversational    | Percakapan berbasis teks/suara dengan AI (LLM)           |
| FR-03 | Speech-to-Text (STT) | Konversi suara pengguna ke teks                          |
| FR-04 | Text-to-Speech (TTS) | Konversi respons AI ke audio natural                     |
| FR-05 | Avatar Interaktif    | Avatar virtual dengan lip-sync real-time                 |
| FR-06 | Chat Interface       | Dua mode: Text Chat dan Roleplay dengan avatar           |
| FR-07 | Progress Tracking    | Evaluasi grammar, fluency, pronunciation dengan skor     |
| FR-08 | Gamifikasi           | Daily challenges, XP points, leaderboard                 |
| FR-09 | Penyimpanan Data     | Data tersimpan di cloud database                         |

---

### Tabel 3.4 - Daftar Kebutuhan Non-Fungsional Sistem

| Kode   | Kebutuhan    | Deskripsi                                |
| ------ | ------------ | ---------------------------------------- |
| NFR-01 | Performa     | Response LLM maksimal 2-4 detik          |
| NFR-02 | Keamanan     | API keys tersimpan di server, RLS aktif  |
| NFR-03 | Reliabilitas | Fallback ke text-only jika avatar gagal  |
| NFR-04 | Usability    | Dark/light theme, responsive, multi-lang |
| NFR-05 | Portabilitas | Cross-browser dan cross-platform         |

---

### Tabel 3.5 - Estimasi Waktu Pengembangan Sistem

| No  | Tahapan       | Durasi        | Kegiatan                           |
| --- | ------------- | ------------- | ---------------------------------- |
| 1   | Communication | 1 minggu      | Analisis kebutuhan, wawancara      |
| 2   | Planning      | 1 minggu      | Perencanaan arsitektur, resource   |
| 3   | Modeling      | 2 minggu      | Desain UML, database, UI/UX        |
| 4   | Construction  | 6 minggu      | Implementasi frontend, backend, AI |
| 5   | Deployment    | 2 minggu      | Testing, deployment, dokumentasi   |
|     | **Total**     | **12 minggu** |                                    |

---

### Tabel 3.6 - Daftar Teknologi yang Digunakan

| Layer          | Teknologi                  | Fungsi                 |
| -------------- | -------------------------- | ---------------------- |
| Frontend       | React + Vite + TypeScript  | UI halaman web         |
| Backend        | Express.js (Node.js)       | API server             |
| Database       | Supabase (PostgreSQL)      | Penyimpanan data       |
| AI Agent       | OpenRouter (Llama 3.3 70B) | Chatbot conversational |
| Avatar Service | HeyGen Streaming Avatar    | Avatar interaktif      |
| STT/TTS        | HeyGen Built-in            | Konversi suara ↔ teks  |

---

### Tabel 3.7 - Analisis Risiko dan Mitigasi

| Risiko                       | Dampak | Mitigasi                            |
| ---------------------------- | ------ | ----------------------------------- |
| API HeyGen down              | Tinggi | Fallback ke mode text-only          |
| Quota OpenRouter habis       | Sedang | Monitoring usage, rate limiting     |
| Koneksi internet pengguna    | Sedang | Optimasi streaming, caching         |
| Browser tidak support WebRTC | Rendah | Deteksi browser, info compatibility |

---

### Tabel 3.8 - Daftar Halaman dan Routing Sistem

| No  | Halaman        | Route           | Deskripsi                |
| --- | -------------- | --------------- | ------------------------ |
| 1   | Login          | /login          | Autentikasi email/Google |
| 2   | Register       | /register       | Pendaftaran akun         |
| 3   | Home           | /home           | Dashboard utama          |
| 4   | Roleplay       | /roleplay       | Voice chat dengan avatar |
| 5   | Text Chat      | /chat           | Text chat dengan AI      |
| 6   | Progress       | /progress       | Grafik progress          |
| 7   | History        | /history        | Riwayat sesi             |
| 8   | Challenge      | /challenge      | Daily challenge          |
| 9   | Leaderboard    | /leaderboard    | Ranking pengguna         |
| 10  | Profile        | /profile        | Pengaturan profil        |
| 11  | Settings       | /settings       | Pengaturan aplikasi      |
| 12  | Result Summary | /result-summary | Evaluasi setelah sesi    |

---

### Tabel 3.9 - Rancangan Kategori Test Case

| Kategori              | Jumlah Test Case | Deskripsi                         |
| --------------------- | ---------------- | --------------------------------- |
| Autentikasi           | 9                | Login, register, logout, OAuth    |
| Roleplay (Voice)      | 9                | Avatar, STT, TTS, lip-sync        |
| Text Chat             | 8                | Kirim pesan, streaming, history   |
| Daily Challenge       | 5                | Challenge, submit, XP             |
| Progress & Evaluation | 7                | Skor, grafik, evaluasi            |
| Leaderboard           | 3                | Ranking, filter, position         |
| Profile & Settings    | 7                | Edit profil, upload avatar, theme |
| API Server            | 5                | Token, proxy, CORS                |
| Database              | 5                | CRUD, RLS, data integrity         |
| **TOTAL**             | **58**           |                                   |

---

### Tabel 3.10 - Format Dokumentasi Test Case

| Kolom                  | Deskripsi                                |
| ---------------------- | ---------------------------------------- |
| No                     | Nomor urut test case                     |
| Fungsi yang Diuji      | Nama fungsi atau fitur yang diuji        |
| Skenario               | Kondisi pengujian (positif/negatif)      |
| Input                  | Data masukan yang diberikan              |
| Output yang Diharapkan | Hasil yang seharusnya muncul             |
| Status                 | Hasil pengujian (✅ Berjalan / ❌ Gagal) |

---

### Tabel 3.11 - Contoh Test Case Black Box Testing

| No  | Fungsi       | Skenario         | Input              | Output Diharapkan             | Status |
| --- | ------------ | ---------------- | ------------------ | ----------------------------- | ------ |
| 1   | Login Email  | Kredensial valid | Email & password ✓ | Masuk ke dashboard            | ✅     |
| 2   | Login Email  | Password salah   | Email ✓, pass ✗    | Error "Email/password salah"  | ✅     |
| 3   | Registrasi   | Email sudah ada  | Email existing     | Error "Email sudah terdaftar" | ✅     |
| 4   | Kirim Pesan  | Pesan valid      | Teks chat          | Response AI streaming         | ✅     |
| 5   | Start Avatar | Token valid      | Klik Start Session | Avatar muncul dengan lip-sync | ✅     |

---

## 🖼️ DAFTAR GAMBAR

Gambar-gambar berikut sudah tersedia di folder `docs/images/`. Upload ke Google Docs via Insert → Image → Upload from computer.

| No         | Nama File              | Caption/Keterangan                      |
| ---------- | ---------------------- | --------------------------------------- |
| Gambar 3.1 | `use_case_diagram.png` | Use Case Diagram Sistem SpeakenAI Tutor |
| Gambar 3.2 | `architecture.png`     | Arsitektur Sistem 3-Tier                |
| Gambar 3.3 | `class_diagram.png`    | Class Diagram Database                  |
| Gambar 3.4 | `sequence_diagram.png` | Sequence Diagram Alur Text Chat         |
| Gambar 3.5 | `activity_diagram.png` | Activity Diagram Alur Roleplay          |
| Gambar 3.6 | `roleplay_flow.png`    | Flowchart Alur Roleplay                 |
| Gambar 3.7 | `text_chat_flow.png`   | Flowchart Alur Text Chat                |

---

## 📝 Cara Copy-Paste Tabel ke Google Docs:

1. Select tabel di atas (dari header sampai row terakhir)
2. Copy (Ctrl+C)
3. Buka Google Docs
4. Paste (Ctrl+V) - tabel akan otomatis terformat

## 📝 Cara Insert Gambar di Google Docs:

1. Klik Insert → Image → Upload from computer
2. Pilih file dari folder: `c:\AI-Projects\Speaken-AI-Tutor\docs\images\`
3. Setelah insert, klik gambar → tambahkan caption di bawahnya
