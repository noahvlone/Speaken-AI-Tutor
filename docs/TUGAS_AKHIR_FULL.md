<div class="page-break"></div>

<center>
<h1>INSTITUT TEKNOLOGI INDONESIA</h1>

<br><br><br>

<h2>PENGEMBANGAN AI AGENT BERBASIS WEB DENGAN AVATAR INTERAKTIF UNTUK PEMBELAJARAN BAHASA INGGRIS MENGGUNAKAN MODEL LLM DARI OPENROUTER</h2>

<br><br><br>

<h3>TUGAS AKHIR</h3>
<p>Diajukan sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer</p>

<br><br><br>

<p><b>Ananda Putra Ahnaf</b></p>
<p><b>1152200019</b></p>

<br><br><br><br><br>

<h3>TEKNIK INFORMATIKA</h3>
<h3>TANGERANG SELATAN</h3>
<h3>2025</h3>
</center>

<div class="page-break"></div>

# HALAMAN PERNYATAAN ORISINALITAS

Skripsi ini adalah hasil karya saya sendiri, dan semua sumber baik yang dikutip maupun dirujuk telah saya nyatakan dengan benar.

<br><br><br>

Nama: Ananda Putra Ahnaf  
NPM: 1152200019  
Tanggal: 17 Juli 2025  

<div class="page-break"></div>

# HALAMAN PENGESAHAN

Skripsi ini diajukan oleh: Ananda Putra Ahnaf  
Nama: Ananda Putra Ahnaf  
NPM: 1152200019  
Program Studi: Teknik Informatika  
Judul Skripsi: **PENGEMBANGAN AI AGENT BERBASIS WEB DENGAN AVATAR INTERAKTIF UNTUK PEMBELAJARAN BAHASA INGGRIS MENGGUNAKAN MODEL LLM DARI OPENROUTER**

Telah berhasil dipertahankan di hadapan Dewan Penguji dan diterima sebagai bagian persyaratan yang diperlukan untuk memperoleh gelar Sarjana Komputer Pada Program Studi Teknik Informatika Institut Teknologi Indonesia.

**DEWAN PENGUJI**

| Jabatan | Nama | Tanda Tangan |
| --- | --- | --- |
| Pembimbing | Dino Haritama, S.Kom, M.Kom. | ( ) |
| Penguji 1 | ........................................ | ( ) |
| Penguji 2 | ........................................ | ( ) |
| Penguji 3 | ........................................ | ( ) |

Ditetapkan di: Kampus Institut Teknologi Indonesia, Tangerang Selatan  
Tanggal: .....................

**KETUA PROGRAM STUDI TEKNIK INFORMATIKA**

<br><br>
(......................................................)

<div class="page-break"></div>

# KATA PENGANTAR

Puji syukur saya panjatkan kepada Tuhan Yang Maha Esa, karena atas berkat dan rahmat-Nya, saya dapat menyelesaikan skripsi ini. Penulisan skripsi ini dilakukan dalam rangka memenuhi salah satu syarat untuk mencapai gelar Sarjana Komputer pada Program Studi Teknik Informatika Institut Teknologi Indonesia. Saya menyadari bahwa, tanpa bantuan dan bimbingan dari berbagai pihak, dari masa perkuliahan sampai pada penyusunan skripsi ini, sangatlah sulit bagi saya untuk menyelesaikan skripsi ini. Oleh karena itu, saya mengucapkan terima kasih kepada:
1. Dr. A...., sebagai Ketua Program Studi Teknik Informatika yang telah mengarahkan saya dalam penyusunan Tugas Akhir ini;
2. Dr. B....., sebagai Dosen Pembimbing yang telah menyediakan waktu, tenaga, dan pikiran untuk mengarahkan saya dalam penyusunan skripsi ini;
3. Dr. C....., sebagai Dosen Penasehat Akademik yang telah membimbing saya dari awal perkuliahan sampai dengan penyusunan Tugas Akhir;
4. Orang tua dan keluarga saya yang telah memberikan bantuan dukungan material dan moral;
5. Seseorang yang selalu menemani saya, selalu memberikan semangat kepada saya, dan orang yang selalu saya libatkan dalam perubahan serta dalam tujuan saya menyelesaikan perkuliahan saya, yaitu Disha Nur Hafifah; dan
6. Sahabat Informatika 2022 yang telah banyak membantu saya dari awal perkuliahan sampai dengan penyusunan Tugas Akhir.

Akhir kata, saya berharap Tuhan Yang Maha Esa berkenan membalas kebaikan semua pihak yang telah membantu. Semoga skripsi ini membawa manfaat bagi pengembangan ilmu.

Tangerang Selatan, 17 Juli 2025  
Penulis

<div class="page-break"></div>

# HALAMAN PERNYATAAN PERSETUJUAN PUBLIKASI 
# TUGAS AKHIR / SKRIPSI UNTUK KEPENTINGAN AKADEMIS

Sebagai sivitas akademika Institut Teknologi Indonesia, saya yang bertanda tangan di bawah ini:
Nama: Ananda Putra Ahnaf  
NPM: 1152200019  
Program Studi: Teknik Informatika  
Jenis Karya: Tugas Akhir  

demi pengembangan ilmu pengetahuan, menyetujui untuk memberikan kepada Institut Teknologi Indonesia Hak Bebas Royalti Non Eksklusif (Non-exclusive Royalty Free Right) atas karya ilmiah saya yang berjudul:
**"PENGEMBANGAN AI AGENT BERBASIS WEB DENGAN AVATAR INTERAKTIF UNTUK PEMBELAJARAN BAHASA INGGRIS MENGGUNAKAN MODEL LLM DARI OPENROUTER"**

Beserta perangkat yang ada (jika diperlukan). Dengan Hak Bebas Royalti Non Eksklusif ini Institut Teknologi Indonesia berhak menyimpan, mengalih media/formatkan, mengelola dalam bentuk pangkalan data (database), merawat, dan mempublikasikan Tugas Akhir saya selama tetap mencantumkan nama saya sebagai penulis/pencipta dan sebagai pemilik Hak Cipta.

Demikian pernyataan ini saya buat dengan sebenarnya.

Dibuat di: Tangerang Selatan  
Pada Tanggal 17 Juli 2025  
Yang Menyatakan,

(.................................)

<div class="page-break"></div>

# ABSTRAK

Nama: Ananda Putra Ahnaf  
Program Studi: Teknik Informatika  
Judul: **PENGEMBANGAN AI AGENT BERBASIS WEB DENGAN AVATAR INTERAKTIF UNTUK PEMBELAJARAN BAHASA INGGRIS MENGGUNAKAN MODEL LLM DARI OPENROUTER**  
Dosen Pembimbing: Dino Haritama, S.Kom, M.Kom.

*(Konten abstrak dapat diisi di sini)*

<div class="page-break"></div>

# ABSTRACT

*(Abstract content in English)*

<div class="page-break"></div>

# DAFTAR ISI

*(Daftar isi otomatis akan di-generate jika memungkinkan, atau diisi manual)*

<div class="page-break"></div>

# BAB 1
# PENDAHULUAN

## 1.1 Latar Belakang
Bahasa Inggris merupakan salah satu bahasa internasional yang memiliki peran penting dalam berbagai aspek kehidupan, mulai dari pendidikan, bisnis, hingga komunikasi global. Kemampuan berbahasa Inggris, terutama keterampilan berbicara (speaking), menjadi kebutuhan utama bagi individu di era digital saat ini. Namun, fakta di lapangan menunjukkan bahwa sebagian besar pembelajar bahasa Inggris di Indonesia masih mengalami kesulitan dalam melatih kemampuan berbicara secara efektif. Faktor-faktor seperti keterbatasan waktu belajar, minimnya interaksi dengan penutur asli, serta rasa kurang percaya diri menjadi hambatan utama dalam meningkatkan kemampuan speaking.

Perkembangan teknologi kecerdasan buatan (Artificial Intelligence/AI) telah membawa dampak signifikan dalam dunia pendidikan, terutama dalam bidang pembelajaran bahasa. Teknologi berbasis AI seperti Speech-to-Text (STT), Text-to-Speech (TTS), dan Large Language Model (LLM) kini banyak dimanfaatkan sebagai media bantu belajar yang interaktif dan adaptif. Menurut Dubey et al. (2025), teknologi STT memungkinkan pengguna untuk melatih kemampuan berbicara dengan cara mengenali dan mengonversi ucapan menjadi teks secara real-time, sehingga pengguna dapat mengetahui kesalahan pelafalan dan memperbaikinya secara mandiri. Dengan demikian, STT berperan penting dalam membantu siswa meningkatkan ketepatan pengucapan dan kepercayaan diri dalam berbicara.

Sementara itu, teknologi TTS berfungsi sebagai sistem yang mengubah teks menjadi suara yang alami dan mudah dipahami. Berdasarkan hasil tinjauan sistematis oleh Widyana et al. (2022), penerapan TTS dalam pembelajaran bahasa dapat meningkatkan kemampuan listening dan pronunciation siswa karena sistem mampu memberikan contoh pengucapan yang akurat dan konsisten. Namun, mereka juga mencatat bahwa sebagian besar sistem TTS masih memiliki keterbatasan dalam hal naturalitas intonasi dan ekspresivitas suara. Hal ini menunjukkan perlunya penelitian lebih lanjut dalam mengembangkan sistem TTS yang lebih interaktif dan menyerupai percakapan manusia.

Selain itu, perkembangan teknologi LLM seperti GPT-3 dan GPT-4 memberikan terobosan besar dalam dunia pembelajaran bahasa Inggris. Menurut Jiang (2024), LLM mampu memahami konteks percakapan dan memberikan umpan balik tata bahasa serta kosakata secara real-time. LLM juga dapat berperan sebagai tutor virtual yang adaptif terhadap level kemampuan pengguna, sehingga proses pembelajaran menjadi lebih personal dan efisien. Jeon et al. (2023) menambahkan bahwa penggunaan chatbot berbasis LLM dalam pembelajaran bahasa dapat meningkatkan keterlibatan siswa serta membantu mereka mempraktekkan kemampuan komunikasi sehari-hari. Namun, sebagian besar penelitian sebelumnya masih berfokus pada kemampuan writing, belum banyak yang mengoptimalkan kemampuan speaking berbasis interaksi suara dua arah.

Menurut penelitian Nurkholis et al. (2022), penerapan teknologi STT berbasis cloud dapat membantu siswa dalam meningkatkan motivasi dan partisipasi belajar bahasa Inggris. Sistem yang mereka kembangkan mampu mengenali ucapan pengguna dan menampilkan hasil transkripsi yang dapat dibandingkan dengan teks acuan. Walau demikian, penelitian tersebut belum mengintegrasikan teknologi TTS dan LLM, sehingga interaksi pengguna masih bersifat satu arah dan kurang kontekstual. Di sisi lain, Widyana et al. (2022) dalam hasil penelitiannya menegaskan perlunya sistem pembelajaran berbasis suara yang tidak hanya menampilkan teks hasil pengenalan suara, tetapi juga memberikan umpan balik berupa suara yang interaktif dan alami.

Lo et al. (2024) dalam kajiannya mengenai penerapan ChatGPT pada pembelajaran bahasa Inggris menemukan bahwa mayoritas penelitian hanya meneliti aspek penulisan (writing) dan grammar, sedangkan aspek berbicara (speaking) dan mendengarkan (listening) masih jarang dikaji secara mendalam. Hal ini menandakan adanya peluang penelitian baru untuk mengembangkan sistem pembelajaran berbasis suara dua arah dengan kemampuan interaksi real-time yang dapat memberikan pengalaman belajar lebih alami. Selain itu, penelitian Dubey et al. (2025) juga menyoroti tantangan utama dalam penggunaan teknologi STT dan TTS, yaitu kurangnya kemampuan sistem dalam mengenali berbagai aksen pengguna, khususnya bagi pembelajar non-native seperti di Indonesia.

Berdasarkan tinjauan beberapa penelitian tersebut, dapat disimpulkan bahwa integrasi teknologi Speech-to-Text (STT), Text-to-Speech (TTS), dan Large Language Model (LLM) dalam satu sistem pembelajaran berbasis aplikasi mobile belum banyak dikembangkan secara komprehensif. Penelitian-penelitian sebelumnya masih berfokus pada penerapan salah satu komponen teknologi secara terpisah, sehingga interaksi yang dihasilkan belum sepenuhnya menyerupai komunikasi dua arah yang alami. Padahal, dengan menggabungkan ketiga teknologi tersebut, sistem pembelajaran dapat memberikan pengalaman interaktif yang menyerupai percakapan nyata, di mana pengguna dapat berbicara, mendengarkan, dan mendapatkan umpan balik langsung secara otomatis.

Selain itu, sebagian besar penelitian yang ada lebih banyak dilakukan pada konteks pendidikan tinggi dan belum menyasar pengguna umum yang ingin meningkatkan kemampuan berbicara secara mandiri melalui perangkat mobile. Mengingat tingginya penggunaan smartphone di Indonesia serta kebutuhan masyarakat terhadap pembelajaran yang fleksibel, maka pengembangan aplikasi pembelajaran bahasa Inggris berbasis STT, TTS, dan LLM menjadi sangat relevan. Oleh karena itu, penelitian ini akan berfokus pada pengembangan sistem pembelajaran berbasis mobile yang memanfaatkan ketiga teknologi tersebut untuk meningkatkan kemampuan berbicara bahasa Inggris bagi pengguna umum.

## 1.2 Perumusan Masalah
Berdasarkan latar belakang tersebut, rumusan masalah penelitian ini adalah sebagai berikut:
1. Bagaimana merancang AI Agent berbasis web untuk mendukung pembelajaran bahasa Inggris?
2. Bagaimana mengintegrasikan model LLM dari OpenRouter agar AI mampu melakukan percakapan interaktif dan koreksi bahasa?
3. Bagaimana memanfaatkan teknologi STT dan TTS untuk mendukung interaksi berbasis suara antara pengguna dan AI Agent?
4. Bagaimana mengembangkan avatar interaktif yang mampu menampilkan ekspresi serta sinkronisasi bibir (lip sync) sesuai dengan hasil TTS?
5. Bagaimana merancang arsitektur aplikasi berbasis web yang mendukung interaksi real-time dengan performa yang optimal?
6. Bagaimana mengevaluasi efektivitas sistem dalam meningkatkan keterampilan bahasa Inggris pengguna?

## 1.3 Tujuan Penelitian
Berdasarkan rumusan masalah yang telah dijelaskan, tujuan dari penelitian ini adalah sebagai berikut:
1. Menghasilkan aplikasi web AI Agent yang interaktif untuk pembelajaran bahasa Inggris.
2. Mengintegrasikan model LLM dari OpenRouter dalam sistem untuk mendukung percakapan, koreksi grammar, dan peningkatan kosakata.
3. Menerapkan teknologi STT dan TTS untuk interaksi suara.
4. Mengembangkan avatar interaktif dengan lip-sync sehingga pembelajaran lebih imersif.
5. Merancang arsitektur aplikasi web yang mendukung komunikasi real-time.
6. Melakukan evaluasi efektivitas sistem terhadap aspek keterampilan berbahasa (speaking, listening) dan faktor psikologis (percaya diri, motivasi).

## 1.4 Batasan Masalah
Agar penelitian ini terfokus dan terarah, batasan masalah dalam pengembangan sistem ini adalah sebagai berikut:
1. Model bahasa yang digunakan dibatasi pada LLM yang tersedia melalui OpenRouter.
2. Fokus pembelajaran adalah bahasa Inggris (English as an International Language).
3. Sistem mendukung interaksi berbasis teks dan suara, tanpa fitur fine-tuning model LLM secara khusus.
4. Avatar interaktif menggunakan layanan pihak ketiga (HeyGen API) untuk lip-sync.
5. Evaluasi sistem dilakukan dalam skala terbatas (1–10 pengguna uji).
6. Sistem dikembangkan berbasis web menggunakan framework modern (React/Vite).

## 1.5 State of The Art
*(Tabel State of The Art sesuai dengan dokumen sebelumnya)*

| No | Peneliti | Tahun | Judul | Hasil Penelitian |
| -- | -------- | ----- | ----- | ---------------- |
| 1 | Dubey et al. | 2025 | Bridging language gaps... | Model STT masih bermasalah dalam mengenali variasi aksen. |
| 2 | Widyana et al. | 2022 | Text-to-Speech Technology... | TTS membantu listening namun intonasi masih tidak natural. |
| 3 | Nurkholis et al. | 2022 | Implementasi STT... | STT meningkatkan motivasi namun belum diuji kondisi nyata. |

## 1.6 Sistematika Penulisan
1. **BAB I PENDAHULUAN**: Latar belakang, rumusan masalah, tujuan, batasan, dan sistematika.
2. **BAB II TINJAUAN PUSTAKA**: Teori AI, STT, TTS, LLM, dan kerangka teori.
3. **BAB III METODOLOGI PENELITIAN**: Metode prototyping, analisis kebutuhan, dan perancangan sistem.
4. **BAB IV HASIL DAN PEMBAHASAN**: Implementasi dan hasil pengujian sistem.
5. **BAB V KESIMPULAN**: Kesimpulan dan saran pengembangan.

<div class="page-break"></div>

# BAB II
# TINJAUAN PUSTAKA

## 2.1 Kecerdasan Buatan (Artificial Intelligence)
Kecerdasan Buatan (Artificial Intelligence/AI) merupakan cabang ilmu komputer yang berfokus pada pengembangan sistem yang mampu meniru kecerdasan manusia dalam melakukan pengambilan keputusan, memahami bahasa, mengolah informasi, serta berinteraksi secara adaptif. Dalam konteks penelitian ini, AI digunakan sebagai fondasi untuk tiga komponen utama: STT, TTS, dan LLM.

## 2.2 Speech-to-Text (STT)
STT adalah teknologi yang mengubah sinyal suara menjadi teks. STT modern memanfaatkan arsitektur transformer dan model multibahasa yang dilatih dari data audio skala besar.

## 2.3 Text-to-Speech (TTS)
TTS adalah teknologi yang mengubah teks menjadi suara sintetis. Model modern seperti neural expressive TTS mampu memberikan pengalaman belajar yang lebih realistik dan interaktif.

## 2.4 Large Language Models (LLM) dalam Pembelajaran Bahasa
LLM merupakan model bahasa berukuran besar yang mampu memahami, menganalisis, dan menghasilkan teks secara kontekstual. LLM seperti Llama dan GPT telah digunakan secara luas dalam domain pendidikan untuk mendukung interaksi percakapan yang cerdas.

<div class="page-break"></div>

# BAB III
# METODOLOGI PENELITIAN

## 3.1 Pendahuluan
Bab ini menjelaskan metode dan tahapan yang digunakan dalam proses pengembangan sistem AI Agent berbasis web untuk pembelajaran bahasa Inggris. Metodologi disusun untuk memberikan alur yang sistematis mulai dari perancangan hingga evaluasi.

## 3.2 Metode Penelitian (Prototyping)
Metode Prototyping dipilih karena karakteristik output AI yang dinamis dan membutuhkan validasi langsung dari pengguna. Tahapan meliputi:
1. **Communication**: Identifikasi kebutuhan fungsional (chat, avatar, voice).
2. **Quick Plan**: Penentuan arsitektur dan stack teknologi.
3. **Quick Design**: Perancangan UI/UX dan alur data API.
4. **Construction of Prototype**: Pembangunan sistem fungsional awal.
5. **Feedback**: Pengujian dan iterasi pengembangan.

## 3.3 Analisis Kebutuhan Sistem
Sistem membutuhkan integrasi Real-time dengan LLM (OpenRouter), Avatar Service (HeyGen), dan Database cloud (Supabase) untuk menyimpan log sesi dan progress pengguna.

<div class="page-break"></div>

# BAB IV
# HASIL DAN PEMBAHASAN

## 4.1 Hasil Implementasi Sistem
Implementasi sistem SpeakenAI Tutor menghasilkan sebuah platform berbasis web yang mengintegrasikan berbagai teknologi mutakhir seperti *Large Language Model* (LLM), *Streaming Avatar*, dan *Cloud Database*. 

### 4.1.1 Antarmuka Autentikasi dan Dashboard
Sistem menyediakan antarmuka login yang mendukung autentikasi berbasis email-password dan Google OAuth. Setelah berhasil masuk, pengguna diarahkan ke dashboard (Halaman Home) yang menyajikan statistik pembelajaran.

### 4.1.2 Antarmuka Roleplay (Tutor Virtual)
Fitur *Roleplay* adalah komponen utama sistem yang menyajikan avatar interaktif dari HeyGen. Antarmuka ini memungkinkan pengguna untuk memilih persona tutor dan melakukan percakapan suara secara real-time.

## 4.2 Hasil Pengujian Sistem
Pengujian dilakukan menggunakan metode *Black Box Testing*. Seluruh 58 kasus uji menunjukkan hasil yang sesuai dengan ekspektasi (Kesimpulan: Sesuai).

| No | Modul Pengujian | Total Case | Sesuai | Kesimpulan |
| -- | --------------- | ---------- | ------ | ---------- |
| 1 | Modul Autentikasi | 9 | 9 | Sesuai |
| 2 | Modul Roleplay | 9 | 9 | Sesuai |
| 3 | Modul Text Chat | 8 | 8 | Sesuai |

---

## 4.3 Pembahasan
Integrasi Llama 3.3 melalui OpenRouter memberikan kualitas respons yang cerdas dan kontekstual. Mekanisme *Server-Sent Events* (SSE) terbukti krusial dalam menekan latensi sehingga interaksi terasa lebih natural.

<div class="page-break"></div>

# BAB V
# KESIMPULAN DAN SARAN

## 5.1 Kesimpulan
Sistem SpeakenAI Tutor telah berhasil dikembangkan sebagai platform pembelajaran bahasa Inggris yang interaktif. Pengujian menunjukkan kesesuaian fungsional 100% dan efektivitas penggunaan model AI generatif dalam mendukung praktik speaking dan listening secara mandiri.

## 5.2 Saran
Pengembangan masa depan disarankan untuk fokus pada reduksi latensi inisialisasi avatar dan penambahan variasi persona untuk skenario pembelajaran yang lebih spesifik.

<div class="page-break"></div>

# DAFTAR REFERENSI
*(Daftar referensi sesuai dengan dokumen yang disediakan)*
