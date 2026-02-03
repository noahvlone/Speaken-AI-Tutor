# BAB V - KESIMPULAN DAN SARAN

Bab ini menyajikan kesimpulan dari seluruh proses penelitian dan pengembangan sistem SpeakenAI Tutor, serta memberikan saran-saran yang dapat dikembangkan lebih lanjut untuk meningkatkan kualitas sistem di masa mendatang.

## 5.1 Kesimpulan

Berdasarkan hasil perancangan, implementasi, dan pengujian yang telah dilakukan pada sistem SpeakenAI Tutor, dapat ditarik beberapa kesimpulan sebagai berikut:

1.  **Berhasil Diimplementasikan**: Sistem SpeakenAI Tutor telah berhasil dikembangkan sebagai platform pembelajaran bahasa berbasis web yang mengintegrasikan teknologi *Streaming Avatar* (HeyGen) dan *Large Language Model* (OpenRouter/Llama 3.3).
2.  **Kesesuaian Fungsional**: Berdasarkan hasil *Black Box Testing*, sistem memenuhi 100% kebutuhan fungsional (58 dari 58 *test cases* berjalan sesuai ekspektasi), mencakup modul autentikasi, *roleplay* suara, *text chat*, gamifikasi, hingga penyimpanan data *progress* pengguna.
3.  **Efektivitas AI**: Penggunaan LLM Llama 3.3 melalui mekanisme *streaming* respons (SSE) terbukti efektif dalam memberikan interaksi yang cerdas dan responsif, sekaligus menimalisir dampak latensi pada pengalaman pengguna.
4.  **Keamanan Data**: Implementasi *Row Level Security* (RLS) pada Supabase dan autentikasi JWT telah berhasil memberikan perlindungan data pengguna, memastikan bahwa akses data hanya dapat dilakukan oleh pemilik sah.
5.  **Pengalaman Belajar**: Integrasi fitur gamifikasi seperti *XP*, *Leaderboard*, dan *Daily Challenge* memberikan nilai tambah dalam meningkatkan keterlibatan dan motivasi pengguna untuk melakukan praktik bahasa secara rutin.

## 5.2 Saran

Meskipun sistem SpeakenAI Tutor telah berfungsi dengan baik, terdapat beberapa saran yang dapat diajukan untuk pengembangan sistem di masa depan:

1.  **Reduksi Latensi**: Mengembangkan mekanisme *caching* atau optimasi pada sisi *backend* untuk mempercepat *token generation* awal dari HeyGen guna mengurangi waktu tunggu sebelum avatar muncul.
2.  **Variasi Persona**: Menambahkan lebih banyak variasi persona avatar dan skenario percakapan yang lebih spesifik pada kurikulum tertentu (misalnya: persiapan wawancara kerja teknis atau bahasa bisnis tingkat lanjut).
3.  **Pengembangan Model Lokal**: Mempertimbangkan penggunaan model bahasa lokal ( *self-hosted* LLM) untuk mengurangi ketergantungan pada API eksternal dan meningkatkan privasi data pada level perusahaan.
4.  **Analisis Audio Lanjutan**: Mengintegrasikan analisis audio yang lebih mendalam untuk memberikan umpan balik terhadap intonasi dan emosi pengguna secara lebih presisi.
5.  **Aplikasi Mobile Native**: Mengembangkan versi aplikasi mobile native (iOS/Android) guna mempermudah aksesibilitas pengguna dalam berlatih di mana saja dengan fitur notifikasi *push* yang lebih optimal.

---

_Dokumen ini disusun sebagai draf isi untuk BAB V Skripsi._
_Terakhir diperbarui: 26 Januari 2026_
