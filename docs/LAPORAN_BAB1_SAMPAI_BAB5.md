# BAB I PENDAHULUAN
Bab ini berisi latar belakang yang menjelaskan pentingnya penelitian, perumusan masalah, tujuan penelitian, manfaat penelitian, batasan masalah, state of the art yang memuat kajian penelitian terdahulu, serta sistematika penulisan laporan.

## 1.1 Latar Belakang
Bahasa Inggris merupakan salah satu bahasa internasional yang memiliki peran penting dalam berbagai aspek kehidupan, mulai dari pendidikan, bisnis, hingga komunikasi global. Kemampuan berbahasa Inggris, terutama keterampilan berbicara (speaking), menjadi kebutuhan utama bagi individu di era digital saat ini. Namun, fakta di lapangan menunjukkan bahwa sebagian besar pembelajar bahasa Inggris di Indonesia masih mengalami kesulitan dalam melatih kemampuan berbicara secara efektif. Faktor-faktor seperti keterbatasan waktu belajar, minimnya interaksi dengan penutur asli, serta rasa kurang percaya diri menjadi hambatan utama dalam meningkatkan kemampuan speaking.

Perkembangan teknologi kecerdasan buatan (Artificial Intelligence/AI) telah membawa dampak signifikan dalam dunia pendidikan, terutama dalam bidang pembelajaran bahasa. Teknologi berbasis AI seperti Speech-to-Text (STT), Text-to-Speech (TTS), dan Large Language Model (LLM) kini banyak dimanfaatkan sebagai media bantu belajar yang interaktif dan adaptif. Penelitian ini mengembangkan "Speaken AI Tutor", sebuah sistem AI Agent berbasis web dengan avatar interaktif untuk membantu pengguna melatih kemampuan berbicara bahasa Inggris.

## 1.2 Perumusan Masalah
Berdasarkan latar belakang tersebut, rumusan masalah penelitian ini adalah:
1.  Bagaimana merancang AI Agent berbasis web untuk mendukung pembelajaran bahasa Inggris?
2.  Bagaimana mengintegrasikan model LLM dari OpenRouter agar AI mampu melakukan percakapan interaktif dan koreksi bahasa?
3.  Bagaimana memanfaatkan teknologi STT dan TTS untuk mendukung interaksi berbasis suara antara pengguna dan AI Agent?
4.  Bagaimana mengembangkan avatar interaktif yang mampu menampilkan ekspresi serta sinkronisasi bibir (lip sync) sesuai dengan hasil TTS?

## 1.3 Tujuan Penelitian
Tujuan dari penelitian ini adalah:
1.  Menghasilkan aplikasi web AI Agent yang interaktif untuk pembelajaran bahasa Inggris.
2.  Mengintegrasikan model LLM dari OpenRouter dalam sistem untuk mendukung percakapan, koreksi grammar, dan peningkatan kosakata.
3.  Menerapkan teknologi STT dan TTS untuk interaksi suara yang natural.
4.  Mengembangkan avatar interaktif dengan fitur lip-sync untuk pengalaman belajar yang imersif.

## 1.4 Manfaat Penelitian
Manfaat yang diharapkan dari penelitian ini adalah memberikan alternatif media pembelajaran bahasa Inggris yang fleksibel, interaktif, dan dapat diakses kapan saja, serta membantu pengguna meningkatkan kepercayaan diri dalam berbicara bahasa Inggris tanpa rasa takut salah.

## 1.5 Batasan Masalah
Agar penelitian ini terfokus dan terarah, batasan masalah dalam pengembangan sistem AI Tutor Bahasa Inggris ini adalah sebagai berikut:

### Teknis
1.  Model bahasa yang digunakan dibatasi pada LLM yang tersedia melalui OpenRouter.
2.  Sistem mendukung interaksi berbasis teks dan suara, tanpa fitur *fine-tuning* model LLM secara khusus.
3.  Avatar interaktif menggunakan layanan pihak ketiga (HeyGen API) untuk fitur *lip-sync* dan *text-to-speech*.
4.  Sistem mengasumsikan pengguna memiliki koneksi internet stabil untuk akses fitur AI dan avatar interaktif.

### Target Pengguna
5.  Target pengguna utama adalah pelajar usia 15-35 tahun dengan tingkat kemahiran bahasa Inggris level pemula hingga menengah (*CEFR A1-B1*).
6.  Sistem difokuskan untuk pengguna di Indonesia yang ingin meningkatkan kemampuan bahasa Inggris untuk keperluan akademik dan profesional.

### Materi & Metode Pembelajaran
7.  Fokus pembelajaran adalah bahasa Inggris (*English as an International Language*).
8.  Materi pembelajaran mencakup 4 keterampilan dasar (*Speaking, Listening, Reading, Writing*) dengan penekanan utama pada *Speaking* & *Listening*.
9.  Topik *roleplay* dibatasi pada skenario umum seperti perkenalan, wawancara kerja, transaksi, reservasi, dan percakapan sehari-hari.
10. Umpan balik (*feedback*) terbatas pada aspek *grammar*, *vocabulary*, dan *pronunciation* tanpa analisis mendalam intonasi atau aksen regional.

### Evaluasi & Fitur
11. Evaluasi sistem dilakukan dalam skala terbatas (1–10 pengguna uji).
12. Fitur premium/subscription hanya berupa konsep desain, tanpa implementasi penuh *payment gateway*.
13. Sistem tidak menyediakan sertifikasi resmi atau akreditasi seperti persiapan TOEFL/IELTS secara formal.

## 1.6 State of The Art
Penelitian terdahulu menunjukkan bahwa teknologi STT dan TTS dapat meningkatkan motivasi belajar namun masih memiliki keterbatasan dalam naturalitas intonasi (Widyana et al., 2022; Dubey et al., 2025). Selain itu, penggunaan LLM dalam pembelajaran bahasa mampu meningkatkan keterlibatan siswa namun penerapannya dalam interaksi suara dua arah dengan avatar visual masih jarang dilakukan secara komprehensif.

## 1.7 Sistematika Penulisan
Laporan ini disusun dalam lima bab, yaitu Bab I Pendahuluan, Bab II Tinjauan Pustaka, Bab III Metodologi Penelitian, Bab IV Hasil dan Pembahasan, dan Bab V Kesimpulan.

# BAB II TINJAUAN PUSTAKA
Bab ini berisi teori-teori yang relevan dengan penelitian, meliputi teori mengenai pembelajaran bahasa berbantuan komputer, teknologi Speech-to-Text (STT), Text-to-Speech (TTS), Large Language Models (LLM), teknologi Avatar Interaktif, dan penelitian terkait lainnya sebagai dasar dalam pengembangan sistem.

## 2.1 Kecerdasan Buatan (Artificial Intelligence)
Kecerdasan Buatan digunakan sebagai fondasi utama dalam sistem ini, mencakup kemampuan mesin untuk memproses bahasa alami dan berinteraksi dengan manusia.

## 2.2 Speech-to-Text (STT)
Speech-to-Text (STT) adalah teknologi yang mengubah sinyal suara menjadi teks. Dalam sistem ini, STT digunakan untuk menangkap ucapan pengguna (user input) agar dapat diproses oleh mesin. Teknologi ini memungkinkan pengguna untuk berbicara secara langsung kepada sistem tanpa harus mengetik.

## 2.3 Text-to-Speech (TTS)
Text-to-Speech (TTS) adalah teknologi yang mengubah teks menjadi suara sintetis. TTS digunakan untuk menyuarakan respons dari AI Agent, sehingga interaksi terasa seperti percakapan nyata. Kualitas TTS modern yang ekspresif sangat penting untuk memberikan contoh pelafalan yang baik.

## 2.4 Large Language Models (LLM)
Large Language Models (LLM) seperti GPT dan Llama adalah model bahasa yang dilatih dengan data teks dalam jumlah sangat besar. Dalam sistem ini, LLM berfungsi sebagai "otak" dari tutor virtual, yang bertugas memahami konteks percakapan, memberikan jawaban yang relevan, serta melakukan koreksi tata bahasa (grammar correction) terhadap input pengguna.

## 2.5 Teknologi Avatar Interaktif
Avatar interaktif digunakan untuk memvisualisasikan lawan bicara (tutor). Teknologi ini mencakup sinkronisasi bibir (lip-sync) yang menyesuaikan gerakan mulut avatar dengan audio yang dihasilkan oleh TTS, menciptakan pengalaman komunikasi tatap muka yang lebih riil.

# BAB III METODOLOGI PENELITIAN
Bab ini berisi metode yang digunakan dalam penelitian, termasuk metode pengumpulan data, metode pengembangan perangkat lunak, desain arsitektur sistem, perancangan alur pipeline sistem (Avatar Interaktif, transkripsi menggunakan STT, pemrosesan bahasa menggunakan LLM), serta perancangan basis data dan antarmuka sistem.

## 3.1 Metode Pengembangan Perangkat Lunak
Metode yang digunakan adalah **Prototyping**, yang terdiri dari tahapan:
1.  **Communication**: Mengidentifikasi kebutuhan pengguna akan sistem tutor bahasa Inggris.
2.  **Quick Plan**: Merencanakan alur kerja sistem dan teknologi yang akan digunakan (React, OpenRouter, HeyGen).
3.  **Quick Design**: Merancang antarmuka pengguna (UI) dan arsitektur sistem.
4.  **Construction of Prototype**: Membangun versi awal sistem yang dapat dijalankan.
5.  **Deployment & Feedback**: Menguji sistem kepada pengguna dan melakukan perbaikan.

## 3.2 Desain Arsitektur Sistem
Sistem dibangun berbasis web dengan arsitektur *Client-Server*:
*   **Frontend**: Dibangun menggunakan React.js dan Vite untuk antarmuka yang responsif.
*   **Backend Services**: Menggunakan integrasi API untuk layanan AI (OpenRouter untuk LLM, HeyGen untuk Avatar).
*   **Database**: Menggunakan Supabase untuk menyimpan data pengguna, riwayat percakapan, dan progres belajar.

## 3.3 Alur Pipeline Sistem
1.  **Input Suara**: Pengguna berbicara melalui mikrofon.
2.  **Transkripsi (STT)**: Suara diubah menjadi teks menggunakan browser Speech Recognition API atau layanan STT terkait.
3.  **Pemrosesan (LLM)**: Teks dikirim ke LLM (via OpenRouter) untuk dianalisis dan dibuatkan balasan serta koreksi.
4.  **Respon Audio & Visual (TTS & Avatar)**: Balasan teks diubah menjadi suara (TTS) dan dikirim ke layanan Avatar untuk di-render menjadi video streaming yang berbicara (Lip-sync).

# BAB IV HASIL DAN PEMBAHASAN
Bab ini menjelaskan hasil implementasi sistem, pengujian sistem dengan skenario percakapan bahasa Inggris, analisis akurasi respons, relevansi koreksi bahasa, serta pembahasan kelebihan dan keterbatasan sistem.

## 4.1 Hasil Implementasi Sistem
Sistem "Speaken AI Tutor" berhasil diimplementasikan dengan fitur utama:
*   **Dashboard Pengguna**: Menampilkan progres dan menu latihan.
*   **Roleplay Mode**: Halaman interaksi utama dimana pengguna berbicara dengan avatar AI.
*   **Fitur Koreksi**: AI mampu memberikan feedback koreksi grammar setelah pengguna berbicara.

### 4.1.1 Antarmuka Roleplay
Antarmuka Roleplay menampilkan avatar di tengah layar dengan tombol kontrol untuk mulai berbicara. Respons avatar ditampilkan secara real-time dengan latensi yang dapat diterima untuk pembelajaran.

## 4.2 Pengujian Sistem
Pengujian dilakukan menggunakan metode **Black Box Testing** untuk memastikan setiap fitur berfungsi sesuai spesifikasi.
*   **Skenario Percakapan**: Sistem diuji dengan berbagai topik percakapan (Introduction, Ordering Food, Daily Activity).
*   **Hasil**: Sistem mampu merespons dengan konteks yang sesuai dan memberikan koreksi jika terdapat kesalahan grammar yang signifikan.
*   **Akurasi**: Transkripsi suara cukup akurat pada lingkungan yang tenang, namun performa menurun pada lingkungan bising.

## 4.3 Pembahasan
Integrasi antara LLM dan Avatar memberikan pengalaman belajar yang lebih menarik dibandingkan aplikasi berbasis teks biasa. Pengguna merasa lebih termotivasi untuk berbicara. Namun, ketergantungan pada API pihak ketiga (OpenRouter, HeyGen) menyebabkan adanya biaya operasional dan potensi latensi jaringan yang mempengaruhi kelancaran percakapan.

# BAB V KESIMPULAN
Bab ini berisi kesimpulan dari penelitian yang telah dilakukan dan saran untuk pengembangan sistem di masa mendatang agar dapat lebih optimal dan memenuhi kebutuhan pengguna.

## 5.1 Kesimpulan
1.  Sistem Speaken AI Tutor berhasil dikembangkan sebagai media pembelajaran bahasa Inggris interaktif berbasis web.
2.  Integrasi LLM memungkinkan sistem memberikan umpan balik yang cerdas dan personal.
3.  Penggunaan avatar meningkatkan aspek imersif dalam pembelajaran daring.
4.  Sistem valid dan efektif digunakan sebagai alat bantu latihan speaking mandiri.

## 5.2 Saran
1.  Pengembangan model STT yang lebih robust terhadap aksen lokal pengguna.
2.  Optimasi latensi respon untuk mendekati percakapan real-time yang instan.
3.  Penambahan mode offline atau penggunaan model lokal untuk mengurangi biaya API.
