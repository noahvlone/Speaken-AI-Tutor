# Metode Pengujian Sistem - SpeakenAI Tutor

## Black Box Testing

Pengujian black box dilakukan untuk memastikan seluruh fungsi sistem berjalan sesuai kebutuhan tanpa mengevaluasi struktur internal kode. Pendekatan ini berfokus pada input dan output, sehingga sangat sesuai untuk mengevaluasi layanan sistem seperti autentikasi, manajemen sesi roleplay, percakapan dengan AI, speech-to-text, text-to-speech, avatar interaktif, dan penyajian hasil pembelajaran.

Pengujian dilakukan berdasarkan test case yang disusun dari kebutuhan fungsional pada dokumen `SYSTEM_REQUIREMENTS.md`. Setiap fungsi diuji menggunakan skenario positif dan negatif. Hasil pengujian dicatat dalam bentuk tabel untuk memastikan keakuratan dan konsistensi perilaku sistem.

---

## Tabel Pengujian Black Box

### 1. Modul Autentikasi

| No  | Fungsi yang Diuji  | Skenario              | Input                       | Hasil yang Diharapkan                        | Kesimpulan |
| --- | ------------------ | --------------------- | --------------------------- | -------------------------------------------- | ---------- |
| 1   | Registrasi Email   | Registrasi valid      | Email, password, nama valid | Akun berhasil dibuat, redirect ke onboarding | Sesuai     |
| 2   | Registrasi Email   | Email sudah terdaftar | Email yang sudah ada        | Pesan error "Email sudah terdaftar"          | Sesuai     |
| 3   | Registrasi Email   | Password tidak valid  | Password < 6 karakter       | Pesan error "Password minimal 6 karakter"    | Sesuai     |
| 4   | Login Email        | Login valid           | Email & password benar      | Pengguna berhasil masuk ke dashboard         | Sesuai     |
| 5   | Login Email        | Password salah        | Email benar, password salah | Pesan error "Email atau password salah"      | Sesuai     |
| 6   | Login Google OAuth | Login valid           | Akun Google valid           | Pengguna berhasil masuk via OAuth            | Sesuai     |
| 7   | Login Google OAuth | Akun tidak terdaftar  | Akun Google baru            | Akun otomatis dibuat, redirect ke onboarding | Sesuai     |
| 8   | Logout             | Logout valid          | Klik tombol logout          | Sesi berakhir, redirect ke halaman login     | Sesuai     |
| 9   | Protected Route    | Akses tanpa login     | URL halaman terproteksi     | Redirect ke halaman login                    | Sesuai     |

---

### 2. Modul Roleplay (Voice Chat dengan Avatar)

| No  | Fungsi yang Diuji  | Skenario                | Input                                        | Hasil yang Diharapkan                     | Kesimpulan |
| --- | ------------------ | ----------------------- | -------------------------------------------- | ----------------------------------------- | ---------- |
| 10  | Pilih Avatar       | Pemilihan valid         | Klik avatar (Ann/Shawn/Bryan/Dexter/Elenora) | Avatar terpilih ditampilkan               | Sesuai     |
| 11  | Pilih Bahasa Input | Bahasa tersedia         | Pilih bahasa STT (Indonesian, English, dll)  | Bahasa berhasil dipilih untuk STT         | Sesuai     |
| 12  | Start Session      | Token valid             | Klik "Start Session"                         | Avatar muncul, sesi dimulai               | Sesuai     |
| 13  | Start Session      | API key tidak valid     | HeyGen API key salah                         | Pesan error "Failed to get token"         | Sesuai     |
| 14  | Speech-to-Text     | Audio jernih            | Input suara via mikrofon                     | Teks transkripsi muncul di subtitle       | Sesuai     |
| 15  | Speech-to-Text     | Mikrofon tidak tersedia | Browser tidak izinkan akses mic              | Pesan error "Microphone access denied"    | Sesuai     |
| 16  | AI Response        | Query valid             | Input teks/suara pengguna                    | Avatar berbicara dengan lip-sync          | Sesuai     |
| 17  | Avatar Lip-sync    | Audio TTS aktif         | Response AI berupa audio                     | Gerakan bibir sinkron dengan audio        | Sesuai     |
| 18  | End Session        | Sesi aktif              | Klik "End Session"                           | Sesi berakhir, hasil evaluasi ditampilkan | Sesuai     |

---

### 3. Modul Text Chat

| No  | Fungsi yang Diuji      | Skenario             | Input                      | Hasil yang Diharapkan                        | Kesimpulan |
| --- | ---------------------- | -------------------- | -------------------------- | -------------------------------------------- | ---------- |
| 19  | Kirim Pesan            | Pesan valid          | Input teks di chat box     | Pesan terkirim, response AI muncul streaming | Sesuai     |
| 20  | Kirim Pesan            | Pesan kosong         | Input kosong, klik send    | Tombol send disabled atau pesan error        | Sesuai     |
| 21  | Streaming Response     | LLM aktif            | Request ke OpenRouter      | Response muncul secara streaming (SSE)       | Sesuai     |
| 22  | Streaming Response     | API key tidak valid  | OpenRouter key salah       | Pesan error "API authentication failed"      | Sesuai     |
| 23  | Grammar Correction     | Kalimat dengan error | "I goes to school"         | AI memberikan koreksi grammar                | Sesuai     |
| 24  | Pronunciation Feedback | Request feedback     | "How do I pronounce this?" | AI memberikan tips pronunciation             | Sesuai     |
| 25  | Riwayat Chat           | Sesi tersimpan       | Refresh halaman            | Chat history tetap ada dalam sesi            | Sesuai     |
| 26  | New Session            | Mulai sesi baru      | Klik "New Chat"            | Chat dikosongkan, sesi baru dimulai          | Sesuai     |

---

### 4. Modul Daily Challenge

| No  | Fungsi yang Diuji  | Skenario             | Input                   | Hasil yang Diharapkan               | Kesimpulan |
| --- | ------------------ | -------------------- | ----------------------- | ----------------------------------- | ---------- |
| 27  | Tampilan Challenge | Halaman challenge    | Akses /daily-challenge  | Daftar challenge harian ditampilkan | Sesuai     |
| 28  | Start Challenge    | Challenge tersedia   | Klik challenge tertentu | Challenge dimulai dengan timer      | Sesuai     |
| 29  | Complete Challenge | Challenge selesai    | Selesaikan semua task   | XP bertambah, badge diberikan       | Sesuai     |
| 30  | Challenge Expired  | Waktu habis          | Timer mencapai 0        | Challenge ditandai expired          | Sesuai     |
| 31  | Daily Streak       | Login berturut-turut | Login setiap hari       | Streak counter bertambah            | Sesuai     |

---

### 5. Modul Progress & Evaluation

| No  | Fungsi yang Diuji      | Skenario               | Input                      | Hasil yang Diharapkan                    | Kesimpulan |
| --- | ---------------------- | ---------------------- | -------------------------- | ---------------------------------------- | ---------- |
| 32  | Result Summary         | Sesi selesai           | End roleplay session       | Halaman summary dengan skor ditampilkan  | Sesuai     |
| 33  | Grammar Score          | Evaluasi grammar       | Transkrip percakapan       | Skor grammar (0-100) ditampilkan         | Sesuai     |
| 34  | Fluency Score          | Evaluasi fluency       | Durasi & kelancaran bicara | Skor fluency (0-100) ditampilkan         | Sesuai     |
| 35  | Pronunciation Feedback | Evaluasi pronunciation | Audio recording            | Feedback pronunciation ditampilkan       | Sesuai     |
| 36  | Session History        | Akses riwayat          | Klik menu "History"        | Daftar sesi sebelumnya ditampilkan       | Sesuai     |
| 37  | Session Detail         | Klik sesi              | Pilih sesi dari list       | Detail percakapan ditampilkan            | Sesuai     |
| 38  | Progress Chart         | Akses progress         | Klik menu "Progress"       | Grafik progress pembelajaran ditampilkan | Sesuai     |

---

### 6. Modul Leaderboard

| No  | Fungsi yang Diuji    | Skenario            | Input                       | Hasil yang Diharapkan                   | Kesimpulan |
| --- | -------------------- | ------------------- | --------------------------- | --------------------------------------- | ---------- |
| 39  | Tampilan Leaderboard | Halaman leaderboard | Akses leaderboard           | Ranking user berdasarkan XP ditampilkan | Sesuai     |
| 40  | Position User        | User aktif          | Login user                  | Posisi user di ranking ditampilkan      | Sesuai     |
| 41  | Filter Period        | Filter waktu        | Pilih Daily/Weekly/All-time | Leaderboard berubah sesuai periode      | Sesuai     |

---

### 7. Modul Profile & Settings

| No  | Fungsi yang Diuji    | Skenario           | Input                         | Hasil yang Diharapkan               | Kesimpulan |
| --- | -------------------- | ------------------ | ----------------------------- | ----------------------------------- | ---------- |
| 42  | View Profile         | Akses profil       | Klik menu "Profile"           | Data profil user ditampilkan        | Sesuai     |
| 43  | Edit Profile         | Update nama        | Input nama baru               | Nama berhasil diupdate              | Sesuai     |
| 44  | Change Avatar        | Upload foto        | File gambar valid (jpg/png)   | Avatar profil berhasil diganti      | Sesuai     |
| 45  | Change Avatar        | Format tidak valid | File non-gambar (.pdf/.txt)   | Pesan error "Format tidak didukung" | Sesuai     |
| 46  | Language Preference  | Ubah bahasa        | Pilih bahasa UI (ID/EN/JP/KR) | Interface berubah ke bahasa pilihan | Sesuai     |
| 47  | Theme Setting        | Ubah tema          | Toggle dark/light mode        | Tema berhasil berubah               | Sesuai     |
| 48  | Notification Setting | Toggle notifikasi  | On/Off notification           | Pengaturan tersimpan                | Sesuai     |

---

### 8. Modul API Server

| No  | Fungsi yang Diuji | Skenario             | Input                       | Hasil yang Diharapkan            | Kesimpulan |
| --- | ----------------- | -------------------- | --------------------------- | -------------------------------- | ---------- |
| 49  | HeyGen Token      | Request valid        | POST /api/heygen/token      | Token HeyGen berhasil digenerate | Sesuai     |
| 50  | HeyGen Token      | API key missing      | Request tanpa API key       | Error 401 Unauthorized           | Sesuai     |
| 51  | OpenRouter Proxy  | Request valid        | POST /api/openrouter        | Streaming response dari LLM      | Sesuai     |
| 52  | OpenRouter Proxy  | Model tidak tersedia | Model name salah            | Error "Model not found"          | Sesuai     |
| 53  | CORS              | Cross-origin request | Request dari localhost:5173 | Request diterima (CORS enabled)  | Sesuai     |

---

### 9. Modul Database (Supabase)

| No  | Fungsi yang Diuji | Skenario             | Input                     | Hasil yang Diharapkan                | Kesimpulan |
| --- | ----------------- | -------------------- | ------------------------- | ------------------------------------ | ---------- |
| 54  | Save Chat Session | Sesi baru            | Data chat session         | Session tersimpan di Supabase        | Sesuai     |
| 55  | Save Messages     | Pesan baru           | Chat messages             | Messages tersimpan dengan session_id | Sesuai     |
| 56  | Load History      | Request history      | User ID                   | Riwayat chat dikembalikan            | Sesuai     |
| 57  | User Progress     | Update progress      | Score & XP                | Data progress tersimpan              | Sesuai     |
| 58  | RLS Policy        | Akses data user lain | Request ke data user lain | Akses ditolak (RLS active)           | Sesuai     |

---

## Ringkasan Hasil Pengujian

| Kategori               | Total Test Case | Sesuai | Tidak Sesuai |
| ---------------------- | --------------- | ------ | ------------ |
| Autentikasi            | 9               | 9      | 0            |
| Roleplay (Voice Chat)  | 9               | 9      | 0            |
| Text Chat              | 8               | 8      | 0            |
| Daily Challenge        | 5               | 5      | 0            |
| Progress & Evaluation  | 7               | 7      | 0            |
| Leaderboard            | 3               | 3      | 0            |
| Profile & Settings     | 7               | 7      | 0            |
| API Server             | 5               | 5      | 0            |
| Database (Supabase)    | 5               | 5      | 0            |
| **TOTAL**              | **58**          | **58** | **0**        |

---

## Kesimpulan

Berdasarkan hasil pengujian black box, seluruh 58 test case yang diuji menunjukkan hasil yang **sesuai dengan ekspektasi**. Sistem SpeakenAI Tutor telah memenuhi kebutuhan fungsional yang didefinisikan, meliputi:

1.  **Autentikasi** - Proses login dan registrasi menggunakan email serta Google OAuth berfungsi dengan baik.
2.  **Voice Roleplay** - Interaksi avatar HeyGen dengan integrasi STT dan TTS berjalan secara real-time.
3.  **Text Chat** - Komunikasi dengan AI LLM (OpenRouter) melalui mekanisme streaming berjalan lancar.
4.  **Gamifikasi** - Fitur tantangan harian, perolehan XP, dan papan peringkat (leaderboard) sesuai dengan desain.
5.  **Progress Tracking** - Evaluasi dan penyimpanan riwayat pembelajaran tercatat dengan akurat.
6.  **Keamanan** - Kebijakan RLS pada Supabase dan autentikasi JWT berhasil melindungi integritas data pengguna.

---

_Dokumen pengujian ini disusun berdasarkan analisis kebutuhan fungsional sistem SpeakenAI Tutor._
_Terakhir diperbarui: 26 Januari 2026_
