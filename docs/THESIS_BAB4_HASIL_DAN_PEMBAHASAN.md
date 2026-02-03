# BAB IV - HASIL DAN PEMBAHASAN

Bab ini menjelaskan hasil implementasi sistem SpeakenAI Tutor dan hasil pengujian yang telah dilakukan. Pembahasan difokuskan pada sejauh mana sistem memenuhi kebutuhan fungsional dan non-fungsional yang telah didefinisikan sebelumnya, serta analisis terhadap kinerja komponen kecerdasan buatan (AI) yang digunakan.

## 4.1 Hasil Implementasi Sistem

Implementasi sistem SpeakenAI Tutor menghasilkan sebuah platform berbasis web yang mengintegrasikan berbagai teknologi mutakhir seperti *Large Language Model* (LLM), *Streaming Avatar*, dan *Cloud Database*. Berikut adalah detail hasil implementasi pada berbagai antarmuka utama sistem:

### 4.1.1 Antarmuka Autentikasi dan Dashboard
Sistem menyediakan antarmuka login yang mendukung autentikasi berbasis email-password dan Google OAuth. Setelah berhasil masuk, pengguna diarahkan ke dashboard (Halaman Home) yang menyajikan statistik pembelajaran, termasuk total sesi, *streak* harian, dan poin pengalaman (XP) yang telah dikumpulkan.

### 4.1.2 Antarmuka Roleplay (Tutor Virtual)
Fitur *Roleplay* adalah komponen utama sistem yang menyajikan avatar interaktif dari HeyGen. Antarmuka ini memungkinkan pengguna untuk:
1.  Memilih persona tutor (Ann, Shawn, Bryan, Dexter, atau Elenora).
2.  Memilih bahasa input yang mendukung lebih dari 28 bahasa.
3.  Melakukan percakapan suara yang secara otomatis diubah menjadi teks (*Speech-to-Text*) dan direspon oleh tutor dengan suara dan gerakan bibir yang sinkron (*Lip-sync*).

### 4.1.3 Antarmuka Text Chat
Untuk pengguna yang lebih menyukai interaksi tertulis, sistem menyediakan modul *Text Chat*. Modul ini mengimplementasikan mekanisme *streaming* respons dari OpenRouter (Llama 3.3 70B), memberikan pengalaman percakapan yang cepat dan efisien seperti aplikasi chat modern.

### 4.1.4 Antarmuka Progress dan Daily Challenge
Guna mendukung motivasi belajar, sistem mengimplementasikan modul statistik progress dalam bentuk grafik interaktif dan fitur tantangan harian (*Daily Challenge*). Pengguna dapat melihat perkembangan kemampuan bahasa mereka dalam aspek *grammar*, *fluency*, dan *pronunciation* melalui data yang dihimpun dari setiap sesi roleplay.

---

## 4.2 Hasil Pengujian Sistem

Pengujian dilakukan menggunakan metode *Black Box Testing* untuk memvalidasi fungsionalitas sistem berdasarkan kasus uji (*test cases*) yang disusun dari dokumen kebutuhan sistem.

### 4.2.1 Ringkasan Hasil Pengujian
Sistem telah diuji melalui 58 kasus uji yang mencakup 9 modul utama. Seluruh kasus uji menunjukkan hasil yang sesuai dengan ekspektasi (Kesimpulan: Sesuai).

Tabel 4.1 Ringkasan Hasil Pengujian Black Box

| No | Modul Pengujian           | Total Test Case | Sesuai | Tidak Sesuai |
| -- | ------------------------- | --------------- | ------ | ------------ |
| 1  | Modul Autentikasi         | 9               | 9      | 0            |
| 2  | Modul Roleplay (Voice)    | 9               | 9      | 0            |
| 3  | Modul Text Chat           | 8               | 8      | 0            |
| 4  | Modul Daily Challenge     | 5               | 5      | 0            |
| 5  | Modul Progress Evaluation | 7               | 7      | 0            |
| 6  | Modul Leaderboard         | 3               | 3      | 0            |
| 7  | Modul Profile & Settings  | 7               | 7      | 0            |
| 8  | Modul API Server          | 5               | 5      | 0            |
| 9  | Modul Database (Supabase) | 5               | 5      | 0            |
|    | **TOTAL**                 | **58**          | **58** | **0**        |

### 4.2.2 Analisis Hasil Pengujian
Berdasarkan Tabel 4.1, tingkat keberhasilan pengujian fungsional sistem mencapai 100%. Modul kritis seperti autentikasi dan integrasi API (HeyGen & OpenRouter) terbukti stabil dan mampu menangani skenario input positif maupun negatif (misalnya: input kosong, API key salah, atau akses tanpa login).

---

## 4.3 Pembahasan

Bagian ini membahas efektivitas sistem SpeakenAI Tutor berdasarkan hasil implementasi dan pengujian yang telah dipaparkan.

### 4.3.1 Pemenuhan Kebutuhan Sistem
Sistem telah berhasil mengimplementasikan seluruh kebutuhan fungsional inti, termasuk integrasi *Streaming Avatar* yang merupakan inovasi utama dalam platform ini. Penggunaan Supabase sebagai *backend-as-a-service* sangat efektif dalam mengelola data relasional dan kebijakan keamanan berbasis *Row Level Security* (RLS).

### 4.3.2 Kinerja Komponen AI
Integrasi Llama 3.3 melalui OpenRouter memberikan kualitas respons yang cerdas dan kontekstual. Mekanisme *Server-Sent Events* (SSE) untuk *streaming* respons terbukti krusial dalam menekan *perceived latency* (latensi yang dirasakan pengguna), sehingga interaksi terasa lebih natural meskipun proses LLM membutuhkan waktu beberapa detik di latar belakang.

### 4.3.3 Pengalaman Pengguna dan Gamifikasi
Fitur gamifikasi seperti *XP*, *Leaderboard*, dan *Daily Streak* memberikan elemen motivasi bagi pengguna untuk berlatih secara rutin. Dari sisi visual, penggunaan *Framer Motion* dan desain responsif menggunakan Tailwind CSS memastikan antarmuka sistem terasa modern dan mudah digunakan baik di perangkat desktop maupun *mobile*.

### 4.3.4 Keterbatasan Sistem
Meskipun hasil pengujian menunjukkan keberhasilan penuh pada sisi fungsional, sistem masih memiliki ketergantungan yang tinggi pada API eksternal (HeyGen dan OpenRouter). Kualitas pengalaman pengguna sangat dipengaruhi oleh stabilitas koneksi internet dan kuota penggunaan API dari penyedia layanan tersebut.

---

_Dokumen ini disusun sebagai draf isi untuk BAB IV Skripsi._
_Terakhir diperbarui: 26 Januari 2026_
