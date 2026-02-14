# Analisis Proyek & Feedback

## 1. Fitur yang Tidak Jalan / Belum Selesai (Broken/Incomplete)

### 🚨 Masalah Kritis (Critical Issues)
- **Nama User di Leaderboard (Peringkat)**: Leaderboard (`Leaderboard.tsx`) bisa mengambil skor tapi **tidak bisa menampilkan nama asli user**. Di sini nama semua orang di-hardcode menjadi "User" karena sistem kamu tidak bisa menghubungkan tabel `leaderboard_entries` dengan tabel `auth.users` di Supabase.
- **Ganti Password di Profil (Change Password)**: Fitur "Change Password" di halaman Profil (`ProfilePage.tsx`) itu **PALSU (FAKE)**. Saat kamu klik simpan, codingannya hanya melakukan simulasi loading (`setTimeout`) dan memunculkan pesan sukses, tapi **tidak benar-benar mengganti password** di database Supabase.
- **Upload Avatar (Foto Profil)**: Sistem upload avatar saat ini menggunakan **penyimpanan file lokal** di server (`server/index.ts`) dan bukan Supabase Storage. Ini mungkin jalan di komputer kamu (localhost), tapi akan **rusak/hilang** kalau kamu deploy ke hosting seperti Vercel atau Netlify karena file lokal tidak persisten.

### 🚧 Fitur Belum Lengkap ("Coming Soon")
- **Tantangan Mingguan (Weekly Challenges)**: Di halaman `DailyChallengePage.tsx`, tab "Weekly" hanyalah tampilan placeholder dengan tulisan "Weekly challenges coming soon!". Tidak ada fungsinya.
- **Pencapaian (Achievements)**: Di halaman `DailyChallengePage.tsx`, tab "Achievements" juga cuma placeholder. Codingan untuk mengambil data achievement (`useAchievements`) ada, tapi belum dipakai sepenuhnya di tampilan.

## 2. Fitur Frontend "Pajangan" (Hardcoded/Statis)

Ini adalah fitur yang kelihatannya jalan dan canggih, padahal aslinya cuma teks statis atau logika yang di-hardcode (bukan data asli).

- **Tips Progress (Focus Areas)**: Di halaman `ProgressPage.tsx`, bagian yang menyarankan untuk latihan suara tertentu (misal: "The 'th' sound", "The 'r' sound") itu teksnya **HARDCODED (statis)**. Tips ini **TIDAK berubah** berdasarkan error pronunciation asli dari user. Jadi mau sebagus atau sejelek apapun user bicara, tipsnya akan selalu menyarankan latihan 'th' dan 'r'.
- **Isi Tantangan (Challenge Content)**: Soal-soal latihan di `GrammarChallengePage` dan `PronunciationChallengePage` sifatnya statis (hardcoded array). Kalau user sudah mengerjakan soal-soal itu, soalnya akan berulang terus. Soal ini **bukan** digenerate secara dinamis oleh AI atau diambil dari database bank soal yang besar.

## 3. Kesimpulan & Saran Perbaikan

### ✅ Yang Sudah Bagus (Positive)
- **Fitur Utama (Core Loop)**: Integasi Voice Roleplay (HeyGen) dan Text Chat (OpenRouter) sepertinya adalah bagian yang paling solid dan jalan dengan baik.
- **Tampilan (UI/UX)**: Desain antarmuka sudah sangat rapi, modern, dan terlihat profesional.
- **Keamanan API**: Server proxy sudah benar untuk menyembunyikan API key HeyGen dan OpenRouter.

### 🔧 Yang Perlu Diperbaiki (Improvements Needed)
- **Integrasi Data User**: Aplikasi ini butuh tabel `public_profiles` di Supabase yang tersinkronisasi dengan `auth.users`. Ini supaya kamu bisa menyimpan dan menampilkan username, avatar, dan bio dengan benar di seluruh aplikasi (terutama Leaderboard).
- **Konten Dinamis**: Tantangan (Challenge) sebaiknya digenerate otomatis pakai AI (OpenRouter) supaya soalnya tidak itu-itu saja dan tidak membosankan.
- **Feedback Asli**: Halaman Progress harusnya benar-benar menganalisa data history error user (dari tabel `pronunciation_errors`) untuk menampilkan "Focus Areas" yang akurat, bukan teks asal tembak.
- **Fitur Palsu**: Segera perbaiki fitur Ganti Password dan Upload Avatar supaya benar-benar jalan menggunakan fitur asli Supabase.

**Rekomendasi Tindakan Selanjutnya:**
1.  **Perbaiki Leaderboard**: Buat tabel profil publik untuk simpan username.
2.  **Fix Ganti Password & Avatar**: Pakai fungsi asli dari Supabase Auth dan Storage.
3.  **Bikin Tantangan Dinamis**: Gunakan AI untuk bikin soal baru setiap hari.
