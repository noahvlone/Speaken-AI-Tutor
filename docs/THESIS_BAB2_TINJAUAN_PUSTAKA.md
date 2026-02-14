# BAB II
# TINJAUAN PUSTAKA

---

## 2.1 Kecerdasan Buatan (Artificial Intelligence)

### 2.1.1. Definisi dan Konsep Dasar

Kecerdasan Buatan (Artificial Intelligence/AI) adalah cabang ilmu komputer yang berfokus pada pengembangan sistem yang mampu melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia. Menurut Russell dan Norvig (2021), AI didefinisikan sebagai studi tentang agen yang menerima persepsi dari lingkungan dan melakukan aksi yang memaksimalkan peluang keberhasilan dalam mencapai tujuan tertentu.

Dalam konteks aplikasi SpeakenAI Tutor, kecerdasan buatan berperan sebagai komponen inti yang memungkinkan sistem untuk memahami ucapan pengguna, memproses bahasa natural, menghasilkan respons yang kontekstual, dan memberikan umpan balik pembelajaran yang personal. Kualitas dan kemampuan AI menjadi faktor penentu utama keberhasilan sistem pembelajaran bahasa Inggris ini.

Secara konseptual, sistem AI dalam SpeakenAI melibatkan serangkaian tahapan pemrosesan. Pertama, input suara pengguna dikonversi menjadi representasi teks melalui Speech-to-Text. Kemudian, teks tersebut diproses oleh Large Language Model untuk memahami konteks dan menghasilkan respons. Terakhir, respons dikonversi kembali menjadi suara melalui Text-to-Speech dan divisualisasikan melalui avatar interaktif.

### 2.1.2. Kategori Kecerdasan Buatan

Kecerdasan buatan dapat dikategorikan berdasarkan kemampuan dan cakupan fungsinya. Menurut Goodfellow et al. (2016), terdapat tiga kategori utama AI:

| Kategori | Deskripsi | Contoh Aplikasi |
|----------|-----------|-----------------|
| **Narrow AI (ANI)** | AI yang dirancang untuk tugas spesifik dan terbatas | Chatbot, speech recognition, rekomendasi |
| **General AI (AGI)** | AI dengan kemampuan kognitif setara manusia di berbagai domain | Belum ada implementasi nyata |
| **Super AI (ASI)** | AI yang melampaui kecerdasan manusia dalam semua aspek | Hipotetis, belum terwujud |

**Tabel 2.1** Kategori Kecerdasan Buatan

SpeakenAI Tutor termasuk dalam kategori **Narrow AI** karena sistem ini dirancang secara spesifik untuk membantu pembelajaran bahasa Inggris melalui percakapan interaktif dengan avatar virtual. Meskipun demikian, penggunaan Large Language Model memungkinkan fleksibilitas yang tinggi dalam menangani berbagai topik percakapan.

### 2.1.3. Machine Learning dan Deep Learning

Machine Learning (ML) merupakan subset dari AI yang memungkinkan sistem untuk belajar dari data tanpa diprogram secara eksplisit (Mitchell, 1997). Sementara Deep Learning adalah subset dari ML yang menggunakan jaringan saraf tiruan (neural network) dengan banyak lapisan tersembunyi (hidden layers) untuk mempelajari representasi data yang kompleks.

Dalam sistem SpeakenAI Tutor, Deep Learning digunakan dalam beberapa komponen:

1. **Speech Recognition** - Model neural network untuk mengenali dan mentranskripsikan suara pengguna
2. **Language Understanding** - Transformer-based models untuk memahami makna dan konteks percakapan
3. **Speech Synthesis** - Model generatif untuk menghasilkan suara natural
4. **Avatar Animation** - Neural networks untuk sinkronisasi bibir dan ekspresi wajah

---

## 2.2 Natural Language Processing (NLP)

### 2.2.1. Definisi dan Konsep Dasar

Natural Language Processing (NLP) adalah cabang kecerdasan buatan yang berfokus pada interaksi antara komputer dan bahasa manusia dalam bentuk natural. Menurut Jurafsky dan Martin (2023), NLP mencakup kemampuan mesin untuk memahami, menginterpretasi, memanipulasi, dan menghasilkan bahasa manusia dengan cara yang bermakna dan berguna.

Dalam konteks SpeakenAI Tutor, NLP menjadi teknologi kunci yang memungkinkan sistem untuk:
- Menganalisis struktur gramatikal ucapan pengguna
- Mendeteksi dan mengoreksi kesalahan tata bahasa
- Memahami konteks percakapan untuk memberikan respons yang relevan
- Menghasilkan umpan balik pembelajaran yang konstruktif

Pemahaman mendalam tentang NLP penting karena kesalahan pada tahap pemrosesan bahasa akan berdampak langsung pada kualitas interaksi pembelajaran dan efektivitas koreksi grammar yang diberikan sistem.

### 2.2.2. Komponen Utama NLP

Sistem NLP modern terdiri dari beberapa komponen utama yang saling terintegrasi:

| Komponen | Fungsi | Implementasi dalam SpeakenAI |
|----------|--------|------------------------------|
| **Tokenization** | Memecah teks menjadi unit-unit kecil (token) | Pemrosesan input oleh LLM |
| **Part-of-Speech Tagging** | Mengidentifikasi jenis kata (noun, verb, adjective) | Analisis grammar untuk koreksi |
| **Named Entity Recognition** | Mengenali entitas seperti nama, tempat, waktu | Kontekstualisasi percakapan |
| **Sentiment Analysis** | Menganalisis emosi dan nada dalam teks | Menyesuaikan respons tutor |
| **Language Generation** | Menghasilkan teks yang koheren dan natural | Respons AI dalam percakapan |
| **Grammar Checking** | Mendeteksi kesalahan tata bahasa | Fitur koreksi real-time |

**Tabel 2.2** Komponen Natural Language Processing

### 2.2.3. Pipeline NLP Modern

Menurut Goldberg (2017), pipeline NLP modern berbasis neural network telah mengalami revolusi signifikan dengan pendekatan end-to-end learning. Berbeda dengan sistem tradisional yang memerlukan feature engineering manual, model modern seperti Transformer dapat mempelajari representasi bahasa secara otomatis dari data.

Pipeline NLP dalam SpeakenAI mengikuti alur:

```
Input Text → Tokenization → Embedding → Transformer Layers → Output Generation
```

Setiap tahap memproses representasi bahasa secara bertahap, dari level karakter hingga pemahaman semantik tingkat tinggi yang memungkinkan generasi respons yang koheren dan kontekstual.

### 2.2.4. NLP dalam Computer-Assisted Language Learning

Aplikasi NLP dalam Computer-Assisted Language Learning (CALL) menurut Heift dan Schulze (2015) meliputi beberapa fungsi kritis:

1. **Automatic Grammar Checking** - Sistem dapat mendeteksi berbagai jenis kesalahan gramatikal seperti subject-verb agreement, tense consistency, dan article usage.

2. **Pronunciation Assessment** - Meskipun berbasis teks, analisis transkrip dapat mengindikasikan masalah pronunciation berdasarkan pola kesalahan spelling fonetik.

3. **Adaptive Feedback Generation** - Sistem dapat menghasilkan umpan balik yang disesuaikan dengan level kemampuan dan pola kesalahan spesifik pengguna.

4. **Conversational Practice** - NLP memungkinkan simulasi percakapan natural yang melampaui pola respons scripted.

---

## 2.3 Speech-to-Text (STT)

### 2.3.1. Definisi dan Konsep Dasar

Speech-to-Text (STT), yang juga dikenal sebagai Automatic Speech Recognition (ASR), merupakan teknologi yang memungkinkan komputer untuk mengonversi sinyal ucapan manusia menjadi representasi teks tertulis. Teknologi ini menjadi jembatan komunikasi antara manusia dan mesin melalui modalitas suara, memungkinkan berbagai aplikasi seperti asisten virtual, sistem dikte, dan transkripsi otomatis (Yu & Deng, 2015).

Dalam konteks aplikasi SpeakenAI Tutor, STT berperan sebagai komponen input yang mengubah ucapan pengguna menjadi teks untuk diproses oleh Large Language Model. Kualitas dan akurasi STT menjadi faktor penentu utama keberhasilan interaksi, karena kesalahan pada tahap transkripsi akan berdampak pada kualitas respons AI dan evaluasi pembelajaran.

Proses STT secara konseptual melibatkan serangkaian tahapan pemrosesan. Pertama, sinyal audio analog dari mikrofon pengguna dikonversi menjadi representasi digital. Kemudian, fitur-fitur akustik diekstraksi dari sinyal tersebut untuk menangkap karakteristik penting dari ucapan. Model akustik kemudian memetakan fitur-fitur ini ke unit linguistik seperti fonem atau karakter. Akhirnya, model bahasa membantu menentukan urutan kata yang paling mungkin berdasarkan konteks.

### 2.3.2. Evolusi Teknologi STT

Teknologi STT telah mengalami evolusi signifikan selama beberapa dekade terakhir. Pemahaman mengenai evolusi ini penting untuk memahami mengapa pendekatan modern lebih unggul dibandingkan sistem tradisional.

**1. Sistem Tradisional Berbasis Hidden Markov Model (HMM)**

Sistem STT generasi pertama menggunakan pendekatan berbasis statistik dengan Hidden Markov Model (HMM) sebagai komponen utama. Sistem ini memerlukan banyak komponen terpisah yang harus dilatih secara independen: ekstraksi fitur akustik, model akustik berbasis Gaussian Mixture Model (GMM), kamus pelafalan, dan model bahasa berbasis n-gram. Pendekatan ini memerlukan keahlian domain yang signifikan dan proses pengembangan yang kompleks (Rabiner & Juang, 1993).

**2. Sistem Hybrid Deep Neural Network**

Terobosan signifikan terjadi pada awal tahun 2010-an ketika Hinton et al. (2012) memperkenalkan penggunaan Deep Neural Networks (DNN) untuk menggantikan komponen GMM dalam model akustik. Pendekatan hybrid DNN-HMM ini menghasilkan peningkatan akurasi yang substansial, dengan penurunan error rate hingga 20-30% dibandingkan sistem berbasis GMM.

**3. Sistem End-to-End Modern**

Paradigma terkini dalam STT adalah pendekatan end-to-end yang mempelajari pemetaan langsung dari sinyal audio ke teks tanpa memerlukan komponen perantara yang dilatih terpisah. Arsitektur seperti Transformer yang diperkenalkan oleh Vaswani et al. (2017) memungkinkan model untuk menangkap dependensi jarak jauh dalam sekuens audio, menghasilkan transkripsi yang lebih koheren dan akurat.

### 2.3.3. Arsitektur STT Modern

Arsitektur STT modern menggunakan pendekatan encoder-decoder berbasis Transformer:

| Tahap | Komponen | Fungsi |
|-------|----------|--------|
| **Pre-processing** | Audio Sampling | Konversi audio ke sample rate standar (16kHz) |
| **Feature Extraction** | Mel-Spectrogram | Ekstraksi fitur spektral dari sinyal audio |
| **Encoding** | Transformer Encoder | Menghasilkan representasi kontekstual dari audio |
| **Decoding** | Autoregressive Decoder | Memprediksi token teks secara berurutan |
| **Post-processing** | Language Model | Koreksi dan normalisasi output teks |

**Tabel 2.3** Arsitektur Speech-to-Text Modern

### 2.3.4. Metrik Evaluasi STT

Untuk mengukur akurasi sistem STT, digunakan beberapa metrik standar:

| Metrik | Formula | Deskripsi |
|--------|---------|-----------|
| **Word Error Rate (WER)** | (S+D+I)/N × 100% | Persentase kesalahan pada level kata |
| **Character Error Rate (CER)** | (S+D+I)/C × 100% | Persentase kesalahan pada level karakter |
| **Real-Time Factor (RTF)** | T_processing / T_audio | Rasio waktu pemrosesan terhadap durasi audio |

**Tabel 2.4** Metrik Evaluasi Speech-to-Text

Keterangan:
- S = Substitution (kata yang salah diganti)
- D = Deletion (kata yang hilang)
- I = Insertion (kata tambahan yang tidak ada di referensi)
- N = Total jumlah kata dalam referensi
- C = Total jumlah karakter dalam referensi

### 2.3.5. Implementasi STT dalam SpeakenAI

Dalam SpeakenAI Tutor, teknologi STT diintegrasikan melalui layanan **HeyGen** yang menyediakan pipeline STT built-in. Sistem ini menawarkan beberapa keunggulan:

1. **Real-time Transcription** - Konversi suara ke teks secara langsung dengan latensi minimal (<500ms)
2. **Voice Activity Detection (VAD)** - Deteksi otomatis kapan pengguna mulai dan selesai berbicara
3. **Multi-language Support** - Dukungan untuk berbagai bahasa input termasuk Bahasa Inggris dan Indonesia
4. **Noise Robustness** - Kemampuan menangani noise lingkungan untuk transkripsi yang lebih akurat

Proses teknis STT dalam sistem:
```
User Microphone → WebRTC Audio Stream → HeyGen STT Engine → Transcribed Text → LLM Processing
```

---

## 2.4 Text-to-Speech (TTS)

### 2.4.1. Definisi dan Konsep Dasar

Text-to-Speech (TTS), atau yang dikenal juga sebagai speech synthesis, merupakan teknologi yang mengkonversi teks tertulis menjadi suara sintetis yang menyerupai ucapan manusia. Menurut Taylor (2009), TTS modern bertujuan untuk menghasilkan suara yang tidak hanya dapat dipahami, tetapi juga natural, ekspresif, dan sesuai konteks.

Dalam konteks SpeakenAI Tutor, TTS berperan sebagai komponen output yang mengubah respons AI menjadi suara yang diucapkan oleh avatar virtual. Kualitas TTS sangat penting karena memberikan model pronunciation yang benar kepada pengguna yang sedang belajar bahasa Inggris. Suara yang natural dan ekspresif juga meningkatkan engagement dan membuat pengalaman belajar lebih imersif.

Proses TTS secara konseptual melibatkan analisis teks untuk memahami struktur kalimat dan intonasi yang tepat, konversi ke representasi fonetik, generasi spektogram audio, dan akhirnya sintesis gelombang suara yang dapat didengar.

### 2.4.2. Evolusi Teknologi TTS

Teknologi TTS telah mengalami perkembangan signifikan dari metode konkatentif hingga pendekatan neural modern:

| Generasi | Teknologi | Karakteristik | Kualitas |
|----------|-----------|---------------|----------|
| **1st Gen** | Concatenative | Menyambung rekaman suara dari database | Kurang natural, artifact pada transisi |
| **2nd Gen** | Parametric | Sintesis berbasis parameter akustik | Lebih fleksibel, suara robotik |
| **3rd Gen** | Neural (WaveNet, Tacotron) | Deep learning untuk generasi audio | Sangat natural, ekspresif |
| **4th Gen** | End-to-End (VITS, FastSpeech2) | Arsitektur terpadu dengan latensi rendah | Real-time, highly natural |

**Tabel 2.5** Evolusi Teknologi Text-to-Speech

### 2.4.3. Arsitektur TTS Neural

Sistem TTS neural modern menggunakan arsitektur multi-stage:

**1. Text Analysis**
- Normalisasi teks (angka, singkatan, simbol)
- Analisis struktur kalimat untuk intonasi
- Prediksi stress dan emphasis

**2. Phoneme Mapping (Grapheme-to-Phoneme)**
- Konversi teks ke representasi fonetik
- Handling pengecualian dan kata asing
- Penentuan durasi fonem

**3. Acoustic Model**
- Generasi Mel-Spectrogram dari fonem
- Prediksi duration, pitch, dan energy
- Attention mechanism untuk alignment

**4. Vocoder**
- Konversi spectrogram ke waveform audio
- Model seperti HiFi-GAN untuk kualitas tinggi
- Real-time synthesis capability

### 2.4.4. Pentingnya TTS dalam Pembelajaran Bahasa

Menurut Shadiev et al. (2017), penggunaan TTS dalam pembelajaran bahasa memberikan beberapa manfaat signifikan:

1. **Model Pronunciation** - Memberikan contoh pelafalan yang benar dan konsisten, membantu learner memahami pronunciation yang tepat.

2. **Listening Practice** - Melatih kemampuan mendengar dengan berbagai variasi kecepatan dan intonasi.

3. **Immediate Feedback** - Respons audio langsung memungkinkan interaksi yang lebih natural dibanding text-only.

4. **Emotional Expression** - Intonasi yang sesuai konteks membantu learner memahami aspek pragmatis bahasa.

### 2.4.5. Implementasi TTS dalam SpeakenAI

SpeakenAI Tutor menggunakan layanan TTS terintegrasi dari **HeyGen** yang menyediakan:

1. **Voice Skins** - Berbagai pilihan suara dengan karakteristik berbeda untuk setiap avatar
2. **Expressive Speech** - Kemampuan menghasilkan intonasi dan emosi yang sesuai konteks
3. **Low Latency** - Generasi audio real-time untuk interaksi yang responsive
4. **Lip-Sync Integration** - Output audio terintegrasi dengan sistem sinkronisasi bibir avatar

Alur teknis TTS dalam sistem:
```
LLM Response → HeyGen TTS Engine → Audio Stream → Avatar Lip-Sync → Video Output
```

---

## 2.5 Large Language Models (LLM)

### 2.5.1. Definisi dan Konsep Dasar

Large Language Models (LLM) adalah model bahasa berbasis neural network yang dilatih dengan dataset teks dalam skala sangat besar, biasanya mencakup miliaran hingga triliunan token dari berbagai sumber seperti buku, artikel, website, dan kode program. Menurut Brown et al. (2020), LLM seperti GPT-3 mendemonstrasikan kemampuan few-shot learning yang memungkinkan performa tinggi pada berbagai tugas tanpa fine-tuning spesifik.

Dalam konteks SpeakenAI Tutor, LLM berfungsi sebagai "otak" dari sistem yang bertanggung jawab untuk:
- Memahami konteks percakapan dan maksud pengguna
- Menghasilkan respons yang relevan dan edukatif
- Mendeteksi kesalahan grammar dan memberikan koreksi
- Menyesuaikan level bahasa dengan kemampuan pengguna
- Mempertahankan koherensi dalam dialog multi-turn

Berbeda dengan chatbot berbasis rule yang hanya dapat merespons pola yang telah diprogramkan, LLM dapat menangani variasi input yang sangat luas dan menghasilkan respons yang kontekstual dan natural.

### 2.5.2. Arsitektur Transformer

LLM modern didasarkan pada arsitektur **Transformer** yang diperkenalkan oleh Vaswani et al. (2017) dalam paper seminal "Attention Is All You Need". Komponen utama arsitektur ini adalah mekanisme **Self-Attention** yang memungkinkan model untuk memahami hubungan antar kata dalam konteks yang sangat panjang.

**Komponen Utama Transformer:**

| Komponen | Fungsi | Keterangan |
|----------|--------|------------|
| **Tokenization** | Memecah teks menjadi token | Menggunakan BPE atau SentencePiece |
| **Embedding Layer** | Mengkonversi token ke vektor | Representasi numerik berdimensi tinggi |
| **Positional Encoding** | Menambahkan informasi posisi | Memungkinkan model memahami urutan |
| **Multi-Head Attention** | Menghitung relasi antar token | Inti dari pemahaman konteks |
| **Feed Forward Network** | Transformasi non-linear | Meningkatkan kapasitas representasi |
| **Layer Normalization** | Stabilisasi training | Mempercepat konvergensi |
| **Output Layer** | Prediksi token berikutnya | Softmax over vocabulary |

**Tabel 2.6** Komponen Arsitektur Transformer

### 2.5.3. Mekanisme Attention

Mekanisme Self-Attention memungkinkan setiap token dalam sekuens untuk "memperhatikan" semua token lainnya. Proses ini melibatkan:

1. **Query, Key, Value** - Setiap token direpresentasikan dalam tiga vektor yang digunakan untuk menghitung relevansi antar token.

2. **Attention Scores** - Dihitung sebagai dot product antara Query dan Key, menentukan seberapa "perhatian" satu token terhadap token lain.

3. **Weighted Sum** - Output adalah kombinasi terbobot dari semua Value berdasarkan attention scores.

Rumus attention:
```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

### 2.5.4. Model yang Digunakan dalam SpeakenAI

SpeakenAI Tutor menggunakan model **Meta Llama 3.3 70B Instruct** melalui layanan **OpenRouter** sebagai agregator API:

| Aspek | Spesifikasi |
|-------|-------------|
| **Model** | Meta Llama 3.3 70B Instruct |
| **Parameter** | 70 Miliar parameter |
| **Context Window** | 128K tokens |
| **Provider** | OpenRouter API |
| **Streaming** | Server-Sent Events (SSE) |
| **Temperatura** | 0.7 (balanced creativity) |

**Tabel 2.7** Spesifikasi Model LLM SpeakenAI

Model ini dipilih karena kemampuannya dalam:
- Memahami instruksi kompleks dengan baik
- Menghasilkan respons natural dalam bahasa Inggris
- Mendeteksi dan mengoreksi kesalahan grammar
- Mempertahankan konsistensi persona sebagai tutor

### 2.5.5. Stateless Nature dan Context Management

Menurut Zhao et al. (2023), LLM bersifat **stateless** - tidak menyimpan memori antar request API. Setiap interaksi adalah event baru yang terisolasi. Jika pengguna bertanya "Siapa nama saya?" di request kedua, LLM tidak akan tahu jawabannya meskipun pengguna sudah menyebutkan nama di request pertama, KECUALI seluruh history percakapan dikirimkan kembali.

**Solusi Context Management dalam SpeakenAI:**

Frontend React bertindak sebagai "memory orchestrator" yang menjembatani HeyGen (input/output) dengan OpenRouter (processing). Setiap request ke LLM menyertakan:

1. **System Prompt** - Instruksi peran sebagai English tutor
2. **Conversation History** - Seluruh chat user dan assistant sebelumnya
3. **New Input** - Pesan terbaru dari pengguna

Struktur payload:
```json
{
  "model": "meta-llama/llama-3.3-70b-instruct",
  "messages": [
    {"role": "system", "content": "You are a helpful English tutor..."},
    {"role": "user", "content": "Hi, my name is Andi"},
    {"role": "assistant", "content": "Nice to meet you, Andi!"},
    {"role": "user", "content": "Can you help me practice speaking?"}
  ]
}
```

### 2.5.6. Prompt Engineering

Prompt Engineering adalah disiplin yang berfokus pada merancang input prompt yang optimal untuk mendapatkan output yang diinginkan dari LLM (Liu et al., 2023). Kualitas prompt sangat mempengaruhi kualitas output.

**Komponen Prompt untuk SpeakenAI:**

1. **System Prompt** - Mendefinisikan peran dan persona: "You are an experienced, friendly English tutor specializing in conversational English..."

2. **Behavior Guidelines** - Panduan respons: "Always correct grammar mistakes gently. Provide examples when explaining concepts..."

3. **Output Format** - Struktur output yang diinginkan: "For evaluation, return JSON with pronunciation, fluency, grammar, and prosody scores..."

4. **Context Injection** - Informasi user level dan preferensi untuk personalisasi respons.

---

## 2.6 Teknologi Avatar Interaktif

### 2.6.1. Definisi dan Konsep Dasar

Avatar interaktif adalah representasi visual karakter digital yang dapat berinteraksi dengan pengguna secara real-time melalui berbagai modalitas seperti suara, gerakan, dan ekspresi wajah. Menurut Cassell et al. (2000), avatar yang efektif harus memiliki kemampuan komunikasi verbal dan non-verbal yang menyerupai manusia untuk menciptakan pengalaman interaksi yang natural.

Dalam konteks SpeakenAI Tutor, avatar interaktif berfungsi sebagai representasi visual tutor bahasa Inggris yang dapat:
- Berbicara dengan lip-sync yang tersinkronisasi
- Menampilkan ekspresi wajah yang sesuai konteks
- Memberikan kesan kehadiran sosial dalam pembelajaran digital
- Mengurangi kecemasan berbicara dengan lawan bicara non-manusia

Penggunaan avatar mengatasi salah satu tantangan utama pembelajaran bahasa mandiri, yaitu tidak adanya partner berbicara yang dapat memberikan respons interaktif seperti manusia.

### 2.6.2. Komponen Teknologi Avatar

Sistem avatar interaktif modern terdiri dari beberapa komponen teknologi yang terintegrasi:

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| **Video Streaming** | WebRTC | Transmisi video real-time dengan latensi rendah |
| **Lip-Sync Engine** | Deep Learning | Sinkronisasi gerakan bibir dengan audio |
| **Facial Animation** | GAN/NeRF | Generasi ekspresi wajah yang natural |
| **Voice Synthesis** | Neural TTS | Produksi suara karakter |
| **Rendering Engine** | GPU Processing | Komposisi video final secara real-time |

**Tabel 2.8** Komponen Teknologi Avatar Interaktif

### 2.6.3. HeyGen Streaming Avatar

SpeakenAI Tutor menggunakan layanan **HeyGen Streaming Avatar** yang menyediakan platform avatar interaktif berbasis cloud. HeyGen merupakan platform yang memungkinkan interaksi real-time dengan karakter AI berbentuk video.

**Teknologi Inti HeyGen:**

**1. WebRTC (Web Real-Time Communication)**
- Protokol untuk transmisi video dan audio dengan latensi sangat rendah (<500ms)
- Menggunakan UDP untuk kecepatan transmisi data real-time
- Codecs: H.264/VP8 untuk video, Opus untuk audio
- ICE (Interactive Connectivity Establishment) untuk koneksi melalui firewall/NAT

**2. WebSocket**
- Digunakan untuk signaling dan kontrol data
- Pertukaran event seperti USER_START, USER_STOP secara real-time
- Koneksi persisten untuk komunikasi dua arah yang instan

**3. Generative AI Rendering**
- Model Deep Learning untuk lip-sync real-time
- Manipulasi video frame-by-frame berdasarkan fonem audio
- Teknik seperti GANs atau NeRFs untuk animasi wajah natural

**4. Integrated STT/TTS Pipeline**
- Pipeline internal untuk konversi suara-teks dan teks-suara
- Voice skins yang sesuai karakteristik setiap avatar

### 2.6.4. Teknologi Lip-Synchronization

Lip-synchronization (lip-sync) adalah proses menyinkronkan gerakan bibir avatar dengan audio yang sedang diucapkan. Teknologi ini kritis untuk menciptakan ilusi avatar yang benar-benar berbicara.

**Proses Lip-Sync:**

1. **Phoneme Analysis** - Audio TTS dianalisis untuk mengidentifikasi fonem (unit suara terkecil)

2. **Viseme Mapping** - Fonem dipetakan ke viseme (representasi visual bentuk mulut)
   - Contoh: Fonem /p/, /b/, /m/ → Viseme "bibir tertutup"
   - Fonem /a/, /æ/ → Viseme "mulut terbuka lebar"

3. **Frame Generation** - Setiap frame video dimodifikasi untuk menampilkan viseme yang sesuai

4. **Temporal Smoothing** - Transisi antar viseme dihaluskan untuk gerakan natural

5. **Real-time Rendering** - Video stream dikirim ke browser pengguna

### 2.6.5. Avatar Personas dalam SpeakenAI

SpeakenAI menyediakan beberapa pilihan avatar dengan karakteristik berbeda:

| Avatar | Persona | Karakteristik |
|--------|---------|---------------|
| **Ann** | Therapist | Suportif, sabar, cocok untuk pemula |
| **Shawn** | Counselor | Langsung, efisien, cocok untuk latihan intensif |
| **Bryan** | Coach | Energetik, memotivasi, cocok untuk practice aktif |
| **Dexter** | Doctor | Formal, detail, cocok untuk grammar focus |
| **Elenora** | Tech Expert | Analitis, structured, cocok untuk learner advanced |

**Tabel 2.9** Avatar Personas dalam SpeakenAI

### 2.6.6. Manfaat Avatar dalam E-Learning

Menurut Schroeder dan Bailenson (2008), penggunaan avatar dalam pembelajaran memberikan beberapa manfaat psikologis dan pedagogis:

1. **Social Presence** - Meningkatkan kehadiran sosial dalam pembelajaran digital, membuat learner merasa tidak sendirian

2. **Increased Engagement** - Avatar visual meningkatkan keterlibatan dan atensi dibanding interface text-only

3. **Natural Interaction** - Interaksi face-to-face simulation lebih mendekati komunikasi natural

4. **Reduced Speaking Anxiety** - Berbicara dengan avatar mengurangi kecemasan dibanding dengan manusia sungguhan, memungkinkan learner bereksperimen tanpa takut dihakimi

---

## 2.7 Teknologi Pengembangan Web

### 2.7.1. React.js

React.js adalah library JavaScript untuk membangun user interfaces yang dikembangkan oleh Meta (Facebook). Menurut dokumentasi resmi React (2023), React menggunakan paradigma **component-based** dan **declarative** yang memudahkan pengembangan aplikasi kompleks.

**Fitur Utama React:**

| Fitur | Deskripsi | Manfaat |
|-------|-----------|---------|
| **Virtual DOM** | Representasi ringan dari DOM asli | Performa rendering optimal |
| **Component-Based** | UI dibangun dari komponen reusable | Maintainability tinggi |
| **Unidirectional Data Flow** | Data mengalir satu arah (top-down) | Predictability dan debugging mudah |
| **JSX** | Syntax extension untuk menulis UI | Developer experience lebih baik |
| **Hooks** | API untuk state dan side effects | Functional components lebih powerful |

**Tabel 2.10** Fitur Utama React.js

Dalam SpeakenAI, React digunakan untuk membangun seluruh antarmuka pengguna termasuk halaman roleplay, chat, dashboard, dan profile.

### 2.7.2. TypeScript

TypeScript adalah superset JavaScript yang menambahkan static typing. Menurut Bierman et al. (2014), TypeScript meningkatkan produktivitas developer dengan deteksi error pada waktu kompilasi daripada runtime.

**Manfaat TypeScript dalam SpeakenAI:**

1. **Error Prevention** - Mendeteksi type mismatch dan null reference saat development
2. **Enhanced IDE Support** - Autocomplete, inline documentation, dan refactoring lebih powerful
3. **Self-Documenting Code** - Type annotations berfungsi sebagai dokumentasi yang selalu up-to-date
4. **Scalability** - Memudahkan maintenance codebase yang besar

### 2.7.3. Node.js dan Express.js

Node.js adalah JavaScript runtime yang dibangun di atas V8 engine Chrome, memungkinkan eksekusi JavaScript di sisi server. Event-driven architecture dan non-blocking I/O model menjadikan Node.js sangat efisien untuk aplikasi real-time (OpenJS Foundation, 2023).

Express.js adalah minimal web framework untuk Node.js yang menyediakan:
- **Routing System** - Definisi endpoint dan handler untuk berbagai HTTP methods
- **Middleware Architecture** - Penambahan fungsionalitas cross-cutting secara modular
- **Request/Response Handling** - Abstraksi untuk HTTP communication

Dalam SpeakenAI, Express.js digunakan untuk membangun backend API dengan endpoints:
- `GET /api/heygen/token` - Menghasilkan token untuk HeyGen session
- `POST /api/openrouter` - Proxy ke OpenRouter LLM dengan streaming
- `POST /api/upload-avatar` - Upload custom avatar pengguna

### 2.7.4. Supabase

Supabase adalah platform Backend-as-a-Service (BaaS) open-source berbasis PostgreSQL. Menurut dokumentasi Supabase (2023), platform ini menyediakan:

| Fitur | Deskripsi | Penggunaan dalam SpeakenAI |
|-------|-----------|---------------------------|
| **PostgreSQL Database** | Relational database dengan real-time subscriptions | Penyimpanan user data, chat history, progress |
| **Authentication** | Sistem auth lengkap dengan berbagai provider | Email/password dan Google OAuth login |
| **Row Level Security (RLS)** | Kebijakan keamanan granular per-row | Isolasi data antar pengguna |
| **Storage** | Object storage untuk file | Penyimpanan avatar custom user |
| **Edge Functions** | Serverless functions | Logic tambahan di server |

**Tabel 2.11** Fitur Supabase

### 2.7.5. Vite

Vite adalah build tool modern untuk pengembangan web yang menyediakan:
- **Instant Server Start** - Development server yang sangat cepat
- **Hot Module Replacement (HMR)** - Update kode tanpa full page reload
- **Optimized Build** - Production build dengan code splitting dan tree shaking

SpeakenAI menggunakan Vite sebagai bundler untuk frontend React application.

### 2.7.6. Protokol Komunikasi Real-Time

**WebSocket**

WebSocket adalah protokol komunikasi yang menyediakan channel komunikasi full-duplex melalui single TCP connection (RFC 6455). Dalam SpeakenAI, WebSocket digunakan untuk:
- Komunikasi real-time dengan HeyGen avatar
- Event signaling untuk avatar state (talking, listening)

**Server-Sent Events (SSE)**

SSE adalah teknologi yang memungkinkan server mengirim updates ke client melalui HTTP connection. SSE bersifat unidirectional (server ke client) dan digunakan dalam SpeakenAI untuk:
- Streaming respons LLM token-by-token
- Progress updates untuk operasi async

---

## 2.8 Metodologi Pengembangan Perangkat Lunak

### 2.8.1. Software Engineering Menurut Pressman

Menurut **Roger S. Pressman (2015)** dalam bukunya "Software Engineering: A Practitioner's Approach" edisi ke-8, rekayasa perangkat lunak adalah pendekatan yang sistematis, disiplin, dan terukur untuk pengembangan, operasi, dan pemeliharaan perangkat lunak.

Pressman mengidentifikasi **Generic Process Framework** yang terdiri dari lima aktivitas kerangka kerja (framework activities) yang dapat diterapkan pada berbagai jenis proyek software:

1. **Communication** - Memahami kebutuhan stakeholder
2. **Planning** - Estimasi, penjadwalan, dan tracking
3. **Modeling** - Analisis dan desain sistem
4. **Construction** - Coding dan testing
5. **Deployment** - Delivery dan feedback

### 2.8.2. Tahapan Generic Process Framework

**1. Communication (Komunikasi)**

Tahap awal untuk memahami kebutuhan dan harapan stakeholder. Aktivitas meliputi:

- **Project Initiation** - Memulai proyek dengan identifikasi masalah dan peluang
- **Requirements Gathering** - Pengumpulan kebutuhan melalui wawancara, observasi, dan survei
- **Requirements Analysis** - Analisis, validasi, dan prioritisasi kebutuhan

Dalam SpeakenAI, tahap ini menghasilkan pemahaman bahwa pengguna membutuhkan platform latihan speaking bahasa Inggris yang interaktif, fleksibel, dan memberikan feedback real-time.

**2. Planning (Perencanaan)**

Membuat peta jalan pengembangan dengan aktivitas:

- **Estimation** - Estimasi effort, biaya, dan waktu pengembangan
- **Scheduling** - Penjadwalan milestone dan deliverable
- **Risk Analysis** - Identifikasi risiko potensial dan strategi mitigasi
- **Resource Allocation** - Alokasi sumber daya manusia dan teknis

**3. Modeling (Pemodelan)**

Membuat model atau blueprint sistem sebelum implementasi:

- **Analysis Model** - Pemodelan kebutuhan (Use Case Diagram, Activity Diagram)
- **Design Model** - Pemodelan arsitektur (Class Diagram, Sequence Diagram)
- **Architecture Design** - Perancangan arsitektur keseluruhan sistem
- **Interface Design** - Perancangan antarmuka pengguna

**4. Construction (Konstruksi)**

Implementasi kode program dan pengujian:

- **Code Generation** - Penulisan source code berdasarkan desain
- **Unit Testing** - Pengujian per komponen/modul
- **Integration Testing** - Pengujian integrasi antar komponen
- **Debugging** - Identifikasi dan perbaikan error/bug

**5. Deployment (Penyebaran)**

Penyerahan produk ke pengguna dan evaluasi:

- **Delivery** - Deploy sistem ke lingkungan produksi
- **User Support** - Dukungan teknis pasca-deploy
- **Feedback Collection** - Pengumpulan umpan balik pengguna
- **Iterative Improvement** - Perbaikan berkelanjutan berdasarkan feedback

### 2.8.3. Umbrella Activities

Selain lima aktivitas utama, Pressman (2015) juga mengidentifikasi **Umbrella Activities** yang berjalan sepanjang proses pengembangan:

| Aktivitas | Deskripsi |
|-----------|-----------|
| **Project Tracking & Control** | Pemantauan progres dan penyesuaian rencana |
| **Risk Management** | Pengelolaan risiko secara berkelanjutan |
| **Quality Assurance** | Jaminan kualitas produk melalui review dan testing |
| **Configuration Management** | Pengelolaan versi dan perubahan source code |
| **Technical Reviews** | Review teknis berkala untuk kualitas |
| **Documentation** | Dokumentasi proses dan produk |
| **Reusability Management** | Pengelolaan komponen yang dapat digunakan ulang |

**Tabel 2.12** Umbrella Activities (Pressman, 2015)

### 2.8.4. Kelebihan Metodologi Pressman

1. **Fleksibilitas** - Dapat diadaptasi untuk berbagai jenis dan skala proyek
2. **Iteratif** - Mendukung pendekatan iterative dengan feedback loop
3. **Komprehensif** - Mencakup seluruh aspek pengembangan software
4. **Terstruktur** - Panduan jelas untuk setiap tahapan
5. **Praktis** - Berorientasi pada praktisi dan implementasi nyata

---

## 2.9 Unified Modeling Language (UML)

### 2.9.1. Definisi dan Konsep Dasar

Unified Modeling Language (UML) adalah bahasa pemodelan standar yang digunakan untuk merancang, memvisualisasikan, menentukan, dan mendokumentasikan sistem perangkat lunak secara terstruktur. UML menyediakan seperangkat diagram yang memungkinkan pengembang memodelkan aspek statis dan dinamis dari sistem, mulai dari fungsionalitas pengguna hingga hubungan antar objek.

Menurut Fowler (2004) dan Booch et al. (2005), yang hingga kini tetap menjadi rujukan fundamental, UML meningkatkan konsistensi pemahaman antar pengembang serta memfasilitasi dokumentasi yang sistematis. Relevansinya hingga saat ini diperkuat oleh penelitian modern yang menunjukkan bahwa UML tetap menjadi komponen utama dalam pengembangan perangkat lunak berbasis model (Sumiati et al., 2024).

UML memiliki beberapa diagram utama yang secara umum digunakan dalam proses analisis dan perancangan sistem. Diagram tersebut mencakup Use Case Diagram, Activity Diagram, Sequence Diagram, serta Class Diagram. Masing-masing diagram memiliki peran berbeda namun saling melengkapi untuk memberikan gambaran keseluruhan mengenai sistem.

Dalam konteks SpeakenAI Tutor, UML digunakan untuk mendokumentasikan arsitektur sistem, alur interaksi pengguna dengan fitur roleplay dan chat, serta hubungan antar komponen dalam sistem.

### 2.9.2. Use Case Diagram

Use Case Diagram merupakan diagram perilaku (behavioral diagram) yang menggambarkan hubungan antara aktor dengan fungsionalitas (use case) yang disediakan sistem. Diagram ini digunakan secara luas pada tahap analisis kebutuhan karena mampu memetakan tujuan yang ingin dicapai pengguna melalui sistem dalam format yang mudah dipahami oleh pemangku kepentingan non-teknis.

Menurut Dias et al. (2023), Use Case Diagram mempermudah identifikasi batas sistem, aktor eksternal, serta fungsi utama yang harus diimplementasikan.

**Komponen Use Case Diagram:**

| Komponen | Nama | Keterangan |
|----------|------|------------|
| ![Actor](stick figure) | **Actor** | Peran orang, sistem, atau alat yang berinteraksi dengan sistem. Dalam SpeakenAI: User/Learner |
| ![Use Case](ellipse) | **Use Case** | Fitur yang disediakan sistem untuk aktor. Contoh: "Text Chat dengan AI", "Roleplay dengan Avatar" |
| ![Association](line) | **Association** | Penghubung antara aktor dan use case yang menunjukkan interaksi |
| ![System](rectangle) | **System Boundary** | Batas sistem yang memisahkan use case dari lingkungan luar |
| ![Include](dashed arrow) | **Include** | Menyatakan use case selalu menyertakan use case lain. Notasi: «include» |
| ![Extend](dashed arrow) | **Extend** | Menyatakan use case tambahan berjalan jika kondisi tertentu terpenuhi. Notasi: «extend» |

**Tabel 2.13** Komponen Use Case Diagram

**Contoh Use Case dalam SpeakenAI:**
- Actor: Learner (pengguna yang belajar bahasa Inggris)
- Use Cases: Login, Text Chat, Roleplay Avatar, Daily Challenge, View Progress, View Leaderboard
- Include: "Roleplay dengan Avatar" «include» "Speech-to-Text Processing"
- Extend: "Text Chat" «extend» "Grammar Analysis" (jika user meminta koreksi)

### 2.9.3. Activity Diagram

Activity Diagram merupakan diagram perilaku yang menggambarkan alur kerja suatu proses secara terstruktur. Diagram ini digunakan untuk memodelkan urutan aktivitas, percabangan keputusan, aktivitas paralel, hingga kondisi akhir dari suatu alur proses.

Menurut Molla et al. (2024), Activity Diagram efektif dalam analisis proses bisnis karena dapat menjelaskan logika operasional secara jelas dan terperinci. Diagram ini sangat berguna untuk memvisualisasikan alur pengguna dalam sistem SpeakenAI, seperti proses roleplay dengan avatar atau alur text chat.

**Komponen Activity Diagram:**

| Komponen | Nama | Simbol | Keterangan |
|----------|------|--------|------------|
| ● | **Start** | Filled circle (lingkaran penuh) | Titik awal aktivitas. Setiap diagram hanya memiliki satu start node |
| ▭ | **Activity** | Rounded rectangle (persegi panjang dengan sudut bulat) | Menunjukkan aktivitas atau proses yang dilakukan. Contoh: "Input Text", "Process LLM" |
| ◇ | **Decision** | Diamond (belah ketupat) | Titik percabangan untuk pilihan kondisi. Memiliki satu input dan multiple output berdasarkan kondisi |
| ◇ | **Merge** | Diamond (belah ketupat) | Menggabungkan beberapa alur alternatif menjadi satu. Kebalikan dari Decision |
| ⊙ | **End** | Circle with dot (lingkaran dengan titik) | Titik akhir aktivitas. Dapat memiliki lebih dari satu end node |
| ▬ | **Fork** | Horizontal bar (garis horizontal tebal) | Membagi satu alur menjadi beberapa aktivitas paralel yang berjalan bersamaan |
| ▬ | **Join** | Horizontal bar (garis horizontal tebal) | Menggabungkan beberapa alur paralel kembali menjadi satu alur |
| ║ | **Swimlane** | Vertical partition (partisi vertikal) | Memisahkan aktivitas berdasarkan aktor atau proses. Contoh: User, Frontend, Backend |
| → | **Control Flow** | Arrow (panah) | Alur perpindahan antar aktivitas yang menunjukkan urutan eksekusi |
| ⇢ | **Object Flow** | Dashed arrow (panah putus-putus) | Alur data atau objek yang berpindah antar aktivitas |

**Tabel 2.14** Komponen Activity Diagram

**Contoh Activity Diagram dalam SpeakenAI - Proses Roleplay:**

1. **Start** → User membuka halaman Roleplay
2. **Activity**: Pilih Avatar
3. **Activity**: Pilih Bahasa
4. **Activity**: Klik Start Session
5. **Decision**: Token Valid?
   - Ya → Initialize Avatar Stream
   - Tidak → Request New Token → kembali ke Decision
6. **Activity**: Avatar Ready
7. **Fork** (parallel activities):
   - User berbicara (voice input)
   - Avatar mendengarkan
8. **Activity**: STT Processing
9. **Activity**: LLM Processing
10. **Activity**: TTS + Lip-sync Rendering
11. **Activity**: Avatar Speaks
12. **Decision**: Continue Conversation?
    - Ya → kembali ke Fork
    - Tidak → End Session
13. **Activity**: Calculate Scores
14. **Activity**: Save Progress
15. **End**

### 2.9.4. Sequence Diagram

Sequence Diagram merupakan diagram interaksi yang menggambarkan pertukaran pesan antar objek dalam urutan waktu tertentu. Diagram ini berfungsi untuk memvisualisasikan bagaimana objek saling berkomunikasi dalam menjalankan suatu skenario.

Kurniawan et al. (2020) menjelaskan bahwa Sequence Diagram sangat berguna untuk memahami alur logika sistem dan potensi permasalahan dalam desain. Pada perkembangan modern, penelitian Ferrari et al. (2024) menunjukkan bahwa Sequence Diagram mulai dapat dihasilkan secara otomatis menggunakan model generatif seperti Large Language Models, meskipun aspek ketelitian dan akurasi tetap membutuhkan validasi manusia.

**Komponen Sequence Diagram:**

| Komponen | Nama | Simbol | Keterangan |
|----------|------|--------|------------|
| 🧑 | **Actor** | Stick figure | Peran orang, sistem, atau alat yang berinteraksi dengan sistem. Biasanya di sisi paling kiri |
| │ | **Lifeline** | Vertical dashed line | Garis vertikal putus-putus yang menyatakan keberadaan suatu objek sepanjang waktu |
| ▯ | **Activation** | Thin rectangle on lifeline | Blok persegi panjang tipis yang menunjukkan objek sedang aktif dan menjalankan operasi |
| → | **Message (Send)** | Solid arrow with label | Pesan/permintaan dari aktor atau objek ke objek lain. Dapat berupa synchronous atau asynchronous |
| ← - - | **Message (Return)** | Dashed arrow | Pesan balasan dari objek penerima ke pengirim. Biasanya berisi hasil atau konfirmasi |
| ⬚ | **Object** | Rectangle with name | Representasi instance dari suatu class yang berpartisipasi dalam interaksi |
| 🗄️ | **Database** | Cylinder or rectangle | Tempat penyimpanan data yang berinteraksi dengan sistem untuk operasi CRUD |
| [ ] | **Fragment** | Rectangle with label | Blok yang mengelompokkan message dengan kondisi tertentu (loop, alt, opt, par) |

**Tabel 2.15** Komponen Sequence Diagram

**Jenis Fragment dalam Sequence Diagram:**

| Fragment | Nama | Keterangan |
|----------|------|------------|
| **loop** | Loop | Pengulangan. Contoh: loop [user terus berbicara] |
| **alt** | Alternative | Percabangan if-else. Contoh: alt [token valid] ... else [request new token] |
| **opt** | Optional | Eksekusi opsional jika kondisi terpenuhi |
| **par** | Parallel | Eksekusi paralel dari beberapa message |
| **break** | Break | Keluar dari loop jika kondisi terpenuhi |
| **ref** | Reference | Referensi ke sequence diagram lain |

**Tabel 2.15b** Jenis Fragment dalam Sequence Diagram

**Contoh Sequence Diagram dalam SpeakenAI - Text Chat Flow:**

```
User → Frontend: Input text message
Frontend → Frontend: Display user message
Frontend → Database: Save user message
Frontend → Backend: POST /api/openrouter
Backend → OpenRouter: POST /chat/completions (stream: true)
loop [SSE Streaming]
    OpenRouter -->> Backend: data: {"content": "token"}
    Backend -->> Frontend: Forward SSE chunk
    Frontend → Frontend: Update UI progressively
end
OpenRouter -->> Backend: [DONE]
Backend -->> Frontend: Stream complete
Frontend → Database: Save assistant message
Frontend -->> User: Display complete response
```

### 2.9.5. Class Diagram

Class Diagram merupakan diagram struktur (structural diagram) yang menggambarkan kelas-kelas dalam sistem beserta atribut, metode, dan hubungan antar kelas. Diagram ini adalah inti dari perancangan berorientasi objek.

Ramdany et al. (2024) menjelaskan bahwa Class Diagram sangat penting untuk memodelkan struktur statis sistem, termasuk dependensi dan hierarki kelas yang membantu konsistensi implementasi.

**Komponen Class Diagram:**

| Komponen | Nama | Simbol | Keterangan |
|----------|------|--------|------------|
| ▭ | **Class** | Rectangle divided into 3 | Elemen utama yang mewakili struktur sistem. Terdiri dari: Nama Class, Atribut, Method |
| — | **Association** | Solid line | Relasi antar kelas, di mana satu kelas menggunakan kelas lain. Dapat dilengkapi multiplicity |
| ◇— | **Aggregation** | Line with empty diamond | Relasi "whole-part" yang menunjukkan satu kelas terdiri atas bagian-bagian kelas lain. Part dapat exist tanpa whole |
| ◆— | **Composition** | Line with filled diamond | Relasi "whole-part" yang lebih kuat. Part tidak dapat exist tanpa whole |
| △— | **Generalization** | Line with empty triangle | Relasi umum-khusus (inheritance), kelas turunan mewarisi sifat dari kelas induk |
| →| **Directed Association** | Arrow | Relasi berarah antar kelas, menunjukkan arah navigasi |
| - - → | **Dependency** | Dashed arrow | Relasi yang menunjukkan adanya ketergantungan antar kelas. Perubahan di satu class mempengaruhi class lain |
| — «interface» | **Realization** | Dashed line with triangle | Implementasi interface oleh class |

**Tabel 2.16** Komponen Class Diagram

**Notasi Multiplicity:**

| Notasi | Keterangan |
|--------|------------|
| **1** | Tepat satu |
| **0..1** | Nol atau satu (opsional) |
| **0..\*** atau **\*** | Nol atau lebih (unlimited) |
| **1..\*** | Satu atau lebih (minimal satu) |
| **n** | Tepat n buah |
| **n..m** | Antara n sampai m |

**Tabel 2.16b** Notasi Multiplicity dalam Class Diagram

**Notasi Visibility:**

| Simbol | Visibility | Keterangan |
|--------|------------|------------|
| **+** | Public | Dapat diakses dari mana saja |
| **-** | Private | Hanya dapat diakses dari dalam class |
| **#** | Protected | Dapat diakses dari class itu sendiri dan turunannya |
| **~** | Package | Dapat diakses dari package yang sama |

**Tabel 2.16c** Notasi Visibility dalam Class Diagram

**Contoh Class dalam SpeakenAI:**

```
┌───────────────────────────┐
│         User              │
├───────────────────────────┤
│ - id: UUID                │
│ - email: String           │
│ - full_name: String       │
│ - avatar_url: String      │
│ - created_at: DateTime    │
├───────────────────────────┤
│ + login(): Boolean        │
│ + register(): Boolean     │
│ + updateProfile(): void   │
└───────────────────────────┘
           │ 1
           │
           │ has
           │
           ▼ *
┌───────────────────────────┐
│      ChatSession          │
├───────────────────────────┤
│ - id: UUID                │
│ - user_id: UUID           │
│ - title: String           │
│ - avatar_id: String       │
│ - created_at: DateTime    │
├───────────────────────────┤
│ + create(): ChatSession   │
│ + rename(): void          │
│ + delete(): void          │
└───────────────────────────┘
```

### 2.9.6. Penggunaan UML dalam SpeakenAI

Dalam pengembangan sistem SpeakenAI Tutor, berbagai diagram UML digunakan untuk mendokumentasikan aspek yang berbeda dari sistem:

| Diagram | Penggunaan dalam SpeakenAI |
|---------|---------------------------|
| **Use Case Diagram** | Mendokumentasikan fungsionalitas sistem: Roleplay, Text Chat, Daily Challenge, Progress Tracking |
| **Activity Diagram** | Menggambarkan alur proses: Alur Roleplay dengan Avatar, Alur Text Chat, Alur Login |
| **Sequence Diagram** | Menunjukkan interaksi komponen: Frontend ↔ Backend ↔ HeyGen ↔ OpenRouter |
| **Class Diagram** | Memodelkan struktur data: User, ChatSession, ChatMessage, UserProgress, LeaderboardEntry |

**Tabel 2.17** Penggunaan UML dalam SpeakenAI

---

## 2.10 Gamifikasi dalam Pembelajaran

### 2.10.1. Definisi dan Konsep Dasar

Gamifikasi adalah penerapan elemen-elemen permainan dalam konteks non-permainan untuk meningkatkan keterlibatan dan motivasi. Menurut Deterding et al. (2011), gamifikasi dalam pendidikan bertujuan untuk membuat proses pembelajaran lebih menarik dan menyenangkan dengan memanfaatkan mekanisme psikologis yang sama dengan game.

### 2.10.2. Elemen Gamifikasi dalam SpeakenAI

| Elemen | Deskripsi | Implementasi |
|--------|-----------|--------------|
| **Points (XP)** | Poin yang dikumpulkan dari aktivitas | XP dari latihan roleplay dan challenge |
| **Levels** | Tingkatan berdasarkan akumulasi XP | Progression dari Beginner ke Expert |
| **Leaderboard** | Peringkat antar pengguna | Global ranking berdasarkan total XP |
| **Streaks** | Hari berturut-turut aktif | Daily login streak untuk konsistensi |
| **Daily Challenges** | Tantangan harian dengan soal baru | Quiz dengan 5 soal per hari |
| **Badges** | Penghargaan visual atas pencapaian | Badge untuk milestone tertentu |

**Tabel 2.17** Elemen Gamifikasi dalam SpeakenAI

### 2.10.3. Teori Motivasi dalam Gamifikasi

Menurut Ryan dan Deci (2000) dalam Self-Determination Theory, gamifikasi yang efektif harus memenuhi tiga kebutuhan psikologis dasar:

1. **Autonomy** - Kebebasan memilih aktivitas belajar (pilihan skenario roleplay)
2. **Competence** - Rasa mampu melalui feedback dan progres (skor dan evaluasi)
3. **Relatedness** - Koneksi sosial melalui kompetisi (leaderboard)

---

## 2.11 Metodologi Pengujian

### 2.11.1. Black-Box Testing

Black Box Testing adalah teknik pengujian perangkat lunak yang menguji fungsionalitas aplikasi tanpa melihat struktur internal kode program. Pengujian dilakukan dari perspektif pengguna akhir (end-user) dengan fokus pada validasi input dan output (Myers et al., 2011).

**Rumus Pass Rate:**
```
Pass Rate = (P / T) × 100%
```

Keterangan:
- P = Jumlah test case yang berhasil (passed)
- T = Total test case

**Interpretasi Pass Rate:**

| Pass Rate | Interpretasi |
|-----------|--------------|
| 100% | Semua fitur berfungsi sesuai spesifikasi |
| 90-99% | Ada bug minor yang perlu diperbaiki |
| 80-89% | Ada bug signifikan |
| < 80% | Sistem belum siap untuk deployment |

**Tabel 2.18** Interpretasi Pass Rate

### 2.11.2. Format Test Case

Setiap test case didokumentasikan dengan format standar:

| Kolom | Deskripsi |
|-------|-----------|
| No | Nomor urut test case |
| Fungsi yang Diuji | Nama fungsi atau fitur yang diuji |
| Skenario | Kondisi pengujian (positif/negatif) |
| Input | Data masukan yang diberikan |
| Output yang Diharapkan | Hasil yang seharusnya muncul |
| Status | Hasil pengujian (✅ Pass / ❌ Fail) |

**Tabel 2.19** Format Dokumentasi Test Case

---

## 2.12 Penelitian Terdahulu

### 2.12.1. Kajian Penelitian Relevan

Berikut adalah beberapa penelitian terdahulu yang relevan dengan pengembangan sistem SpeakenAI Tutor:

| No | Peneliti (Tahun) | Judul | Teknologi | Hasil |
|----|------------------|-------|-----------|-------|
| 1 | Widyana et al. (2022) | "AI Chatbot for English Learning" | GPT-3, Web | Respons natural, 24/7 availability. Keterbatasan: text-only, tidak ada pronunciation feedback |
| 2 | Dubey et al. (2025) | "Speech Recognition for Language Learning Apps" | Whisper STT, Mobile | Akurasi tinggi, aksen lokal. Keterbatasan: tidak real-time |
| 3 | Chen & Wang (2023) | "Virtual Tutors with Avatar Technology" | Unity, TTS | Visual engaging, lip-sync. Keterbatasan: scripted responses |
| 4 | Kim et al. (2024) | "LLM-based Conversation Practice" | GPT-4, React | Context panjang, grammar correction. Keterbatasan: latensi tinggi |

**Tabel 2.20** Perbandingan Penelitian Terdahulu

### 2.12.2. Kebaruan Penelitian (Novelty)

Berdasarkan kajian penelitian terdahulu, sistem SpeakenAI Tutor memiliki beberapa kebaruan:

1. **Integrasi End-to-End** - Menggabungkan STT, LLM, TTS, dan Avatar dalam satu sistem terintegrasi yang seamless

2. **Real-time Voice Interaction** - Interaksi suara dua arah dengan latensi rendah (<500ms), berbeda dengan penelitian sebelumnya yang hanya text-based atau batched processing

3. **Streaming Avatar with Lip-Sync** - Avatar berbicara secara streaming dengan sinkronisasi bibir real-time, bukan pre-rendered video

4. **Comprehensive Evaluation** - Penilaian multi-dimensi (pronunciation, fluency, grammar, prosody) dengan feedback detil

5. **Gamification Layer** - Integrasi elemen gamifikasi lengkap (XP, leaderboard, streaks, challenges) yang jarang ditemukan pada penelitian sejenis

---

## 2.13 Kerangka Berpikir

Berdasarkan tinjauan pustaka yang telah dilakukan, kerangka berpikir penelitian ini dapat digambarkan sebagai berikut:

**INPUT** → Permasalahan keterbatasan media latihan speaking bahasa Inggris yang interaktif, fleksibel, dan memberikan feedback real-time.

**LANDASAN TEORI** → Artificial Intelligence, NLP, STT, TTS, LLM, Avatar Interactive, Gamification, CALL.

**METODOLOGI** → Pressman (2015) Software Engineering dengan 5 tahapan: Communication, Planning, Modeling, Construction, Deployment.

**PROSES** → Pengembangan sistem mengikuti tahapan metodologi dengan iterasi perbaikan berdasarkan feedback.

**OUTPUT** → Sistem SpeakenAI Tutor: AI Agent dengan Avatar Interaktif untuk Pembelajaran Bahasa Inggris yang efektif dan engaging.

---

## Ringkasan BAB II

Berdasarkan tinjauan pustaka yang telah diuraikan, dapat disimpulkan bahwa:

1. **Kecerdasan Buatan (AI)** menjadi fondasi teknologi untuk memproses bahasa natural dan menghasilkan respons yang kontekstual dalam pembelajaran bahasa.

2. **NLP, STT, dan TTS** merupakan teknologi kunci untuk mengubah suara menjadi teks, memproses bahasa, dan menghasilkan output suara yang natural.

3. **Large Language Models (LLM)** seperti Meta Llama memberikan kemampuan pemahaman konteks dan generasi respons yang cerdas untuk percakapan natural.

4. **Avatar Interaktif** meningkatkan engagement dan memberikan pengalaman belajar yang lebih imersif melalui visualisasi lawan bicara dengan lip-sync.

5. **Metodologi Pressman (2015)** menyediakan kerangka kerja sistematis untuk pengembangan perangkat lunak dengan 5 tahapan utama yang terstruktur.

6. **UML** digunakan untuk memodelkan dan mendokumentasikan arsitektur sistem secara standar.

7. **Gamifikasi** meningkatkan motivasi belajar melalui elemen permainan seperti XP, leaderboard, dan daily challenges.

8. Penelitian terdahulu menunjukkan bahwa integrasi komprehensif antara AI, avatar, voice interaction, dan gamifikasi dalam satu sistem pembelajaran bahasa masih jarang dilakukan, sehingga menjadi peluang kebaruan penelitian ini.

---

## Daftar Pustaka BAB II

- Bierman, G., Abadi, M., & Torgersen, M. (2014). Understanding TypeScript. *ECOOP 2014*.
- Booch, G., Rumbaugh, J., & Jacobson, I. (2005). *The Unified Modeling Language User Guide*. Addison-Wesley.
- Brown, T. B., et al. (2020). Language Models are Few-Shot Learners. *NeurIPS 2020*.
- Cassell, J., et al. (2000). *Embodied Conversational Agents*. MIT Press.
- Deterding, S., et al. (2011). Gamification: Toward a Definition. *CHI 2011 Workshop*.
- Fowler, M. (2004). *UML Distilled: A Brief Guide to the Standard Object Modeling Language*. Addison-Wesley.
- Goldberg, Y. (2017). *Neural Network Methods for Natural Language Processing*. Morgan & Claypool.
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press.
- Heift, T., & Schulze, M. (2015). *Errors and Intelligence in Computer-Assisted Language Learning*. Routledge.
- Hinton, G., et al. (2012). Deep Neural Networks for Acoustic Modeling in Speech Recognition. *IEEE Signal Processing Magazine*.
- Jurafsky, D., & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed.). Stanford University.
- Liu, P., et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP. *ACM Computing Surveys*.
- Mitchell, T. M. (1997). *Machine Learning*. McGraw-Hill.
- Myers, G. J., Sandler, C., & Badgett, T. (2011). *The Art of Software Testing* (3rd ed.). Wiley.
- OpenJS Foundation. (2023). *Node.js Documentation*. https://nodejs.org/docs/
- **Pressman, R. S. (2015). *Software Engineering: A Practitioner's Approach* (8th ed.). McGraw-Hill Education.**
- Rabiner, L. R., & Juang, B. H. (1993). *Fundamentals of Speech Recognition*. Prentice Hall.
- Russell, S., & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.
- Ryan, R. M., & Deci, E. L. (2000). Self-Determination Theory and the Facilitation of Intrinsic Motivation. *American Psychologist*.
- Schroeder, R., & Bailenson, J. (2008). Research Uses of Multi-User Virtual Environments. *Oxford Internet Institute*.
- Shadiev, R., Hwang, W. Y., & Huang, Y. M. (2017). Review of Research on Mobile Language Learning. *British Journal of Educational Technology*.
- Supabase. (2023). *Supabase Documentation*. https://supabase.com/docs
- Taylor, P. (2009). *Text-to-Speech Synthesis*. Cambridge University Press.
- Vaswani, A., et al. (2017). Attention Is All You Need. *NeurIPS 2017*.
- Yu, D., & Deng, L. (2015). *Automatic Speech Recognition: A Deep Learning Approach*. Springer.
- Zhao, W. X., et al. (2023). A Survey of Large Language Models. *arXiv preprint*.

---

_Dokumen ini disusun sebagai BAB II Tinjauan Pustaka untuk Tugas Akhir SpeakenAI Tutor_  
_Metodologi mengacu pada Pressman, R. S. (2015). Software Engineering: A Practitioner's Approach_  
_Terakhir diperbarui: 4 Februari 2026_
