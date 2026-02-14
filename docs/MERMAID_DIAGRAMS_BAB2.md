# Mermaid Diagrams untuk BAB II - SpeakenAI Tutor

Dokumen ini berisi kumpulan diagram Mermaid untuk keperluan dokumentasi BAB II Tinjauan Pustaka dan perancangan sistem SpeakenAI Tutor.

---

## 1. Hierarki Kecerdasan Buatan

```mermaid
graph TD
    A[Artificial Intelligence] --> B[Machine Learning]
    B --> C[Deep Learning]
    C --> D[Neural Networks]
    D --> E[Transformer Models]
    E --> F[Large Language Models]
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style D fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style E fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style F fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

---

## 2. Generic Process Framework (Pressman, 2015)

```mermaid
flowchart LR
    A["📞 COMMUNICATION<br/>Memahami kebutuhan"] --> B["📋 PLANNING<br/>Estimasi & jadwal"]
    B --> C["📐 MODELING<br/>Analisis & desain"]
    C --> D["🏗️ CONSTRUCTION<br/>Coding & testing"]
    D --> E["🚀 DEPLOYMENT<br/>Delivery & feedback"]
    E -.->|"Iterasi"| A

    style A fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style D fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style E fill:#fce4ec,stroke:#c2185b,stroke-width:2px
```

---

## 3. Arsitektur Sistem SpeakenAI (3-Tier)

```mermaid
graph TB
    subgraph FRONTEND["PRESENTATION LAYER (Frontend)"]
        R[React + Vite + TypeScript]
        R --> RP[Roleplay Page]
        R --> CP[Chat Page]
        R --> PP[Profile Page]
        R --> DP[Dashboard Page]
    end

    subgraph BACKEND["BUSINESS LOGIC LAYER (Backend)"]
        E[Express.js + Node.js]
        E --> API1[/api/heygen/token]
        E --> API2[/api/openrouter]
        E --> API3[/api/upload-avatar]
    end

    subgraph DATA["DATA LAYER (External Services)"]
        H[HeyGen API<br/>Avatar + STT/TTS]
        O[OpenRouter API<br/>LLM Llama 3.3]
        S[Supabase<br/>PostgreSQL]
    end

    FRONTEND -->|HTTP/SSE| BACKEND
    API1 --> H
    API2 --> O
    API3 --> S

    style FRONTEND fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style BACKEND fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style DATA fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

---

## 4. Sequence Diagram - Alur Roleplay Avatar

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>(React)
    participant B as Backend<br/>(Express)
    participant H as HeyGen API
    participant O as OpenRouter<br/>LLM
    participant D as Supabase<br/>Database

    U->>F: Pilih Avatar & Start Session
    F->>B: GET /api/heygen/token
    B->>H: Request session token
    H-->>B: Return token
    B-->>F: Return token
    
    F->>H: Initialize Avatar (WebRTC)
    H-->>F: Avatar ready (stream)
    
    rect rgb(230, 245, 255)
        Note over U,H: Voice Interaction Loop
        U->>F: Speak (audio input)
        F->>H: Send audio stream
        H->>H: STT Processing
        H-->>F: Transcribed text
        
        F->>B: POST /api/openrouter
        B->>O: Chat completion request
        O-->>B: AI response (streaming)
        B-->>F: SSE response chunks
        
        F->>H: Send text for TTS
        H->>H: TTS + Lip-sync render
        H-->>F: Avatar video stream
        F-->>U: Display speaking avatar
    end
    
    U->>F: End Session
    F->>D: Save progress & evaluation
    F-->>U: Show result summary
```

---

## 5. Sequence Diagram - Alur Text Chat

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>(React)
    participant B as Backend<br/>(Express)
    participant O as OpenRouter<br/>LLM
    participant D as Supabase<br/>Database

    U->>F: Input text message
    F->>F: Display user message
    F->>D: Save user message
    
    F->>B: POST /api/openrouter
    Note over B,O: Streaming Request
    B->>O: POST /chat/completions<br/>(stream: true)
    
    loop SSE Streaming
        O-->>B: data: {"content": "token"}
        B-->>F: Forward SSE chunk
        F->>F: Update UI progressively
    end
    
    O-->>B: [DONE]
    B-->>F: Stream complete
    F->>D: Save assistant message
    F-->>U: Display complete response
```

---

## 6. Flowchart - Alur Utama Sistem

```mermaid
flowchart TD
    A([🚀 Start]) --> B{Authenticated?}
    B -->|No| C[Login / Register]
    C --> D{Success?}
    D -->|No| C
    D -->|Yes| E[Dashboard]
    B -->|Yes| E
    
    E --> F{Pilih Menu}
    
    F -->|🎭 Roleplay| G[Pilih Avatar]
    G --> H[Start Avatar Session]
    H --> I[Voice Input]
    I --> J[STT → LLM → TTS]
    J --> K[Avatar Speaks]
    K --> L{Continue?}
    L -->|Yes| I
    L -->|No| M[Save & Show Evaluation]
    M --> E
    
    F -->|💬 Text Chat| N[Start Chat Session]
    N --> O[Input Text]
    O --> P[LLM Streaming Response]
    P --> Q[Save to Database]
    Q --> R{Continue?}
    R -->|Yes| O
    R -->|No| E
    
    F -->|🎯 Challenge| S[Daily Challenge]
    S --> T[Answer Questions]
    T --> U{Correct?}
    U -->|Yes| V[+20 XP]
    U -->|No| W[Show Explanation]
    V --> X{More Questions?}
    W --> X
    X -->|Yes| T
    X -->|No| E
    
    F -->|📊 Progress| Y[View Statistics]
    Y --> E
    
    F -->|🚪 Logout| Z[Clear Session]
    Z --> A

    style A fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style E fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style M fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

---

## 7. Use Case Diagram

```mermaid
graph TB
    subgraph System["SpeakenAI Tutor System"]
        UC1((Login/Register))
        UC2((Text Chat dengan AI))
        UC3((Roleplay dengan Avatar))
        UC4((Daily Challenge))
        UC5((View Progress))
        UC6((View Leaderboard))
        UC7((Edit Profile))
        UC8((Logout))
        
        UC3 -.->|include| UC3a((Speech-to-Text))
        UC3 -.->|include| UC3b((Text-to-Speech))
        UC3 -.->|include| UC3c((LLM Processing))
        UC2 -.->|include| UC3c
    end
    
    User((👤 Learner))
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8

    style User fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style System fill:#f5f5f5,stroke:#616161,stroke-width:2px
```

---

## 8. Class Diagram (Entity Relationship)

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String full_name
        +String avatar_url
        +DateTime created_at
        +login()
        +register()
        +updateProfile()
    }
    
    class ChatSession {
        +UUID id
        +UUID user_id
        +String title
        +String avatar_id
        +String language
        +DateTime created_at
        +DateTime updated_at
        +create()
        +rename()
        +delete()
    }
    
    class ChatMessage {
        +UUID id
        +UUID session_id
        +String role
        +String content
        +DateTime created_at
        +append()
        +update()
    }
    
    class UserProgress {
        +UUID id
        +UUID user_id
        +Date session_date
        +Integer pronunciation_score
        +Integer fluency_score
        +Integer grammar_score
        +Integer prosody_score
        +saveSession()
        +getAverageScore()
    }
    
    class LeaderboardEntry {
        +UUID id
        +UUID user_id
        +Integer total_score
        +Integer current_streak
        +Integer max_streak
        +Integer rank
        +updateScore()
        +updateStreak()
    }
    
    class DailyChallenge {
        +UUID id
        +String question
        +JSON options
        +Integer correct_answer
        +String explanation
        +String category
        +getActiveChallenge()
    }
    
    class UserChallengeAttempt {
        +UUID id
        +UUID user_id
        +UUID challenge_id
        +Integer selected_answer
        +Boolean is_correct
        +Integer points_earned
        +Date attempt_date
        +submitAttempt()
    }
    
    User "1" --> "*" ChatSession : has
    ChatSession "1" --> "*" ChatMessage : contains
    User "1" --> "*" UserProgress : tracks
    User "1" --> "1" LeaderboardEntry : has
    User "1" --> "*" UserChallengeAttempt : attempts
    DailyChallenge "1" --> "*" UserChallengeAttempt : has
```

---

## 9. Activity Diagram - Proses Roleplay

```mermaid
flowchart TD
    Start([●]) --> A[Open Roleplay Page]
    A --> B[Select Avatar]
    B --> C[Select Language]
    C --> D[Click Start Session]
    D --> E{Token Valid?}
    E -->|No| F[Request New Token]
    F --> E
    E -->|Yes| G[Initialize Avatar Stream]
    G --> H[Avatar Ready]
    
    H --> I[Click Start Talking]
    I --> J[Recording User Audio]
    J --> K[Click Stop Talking]
    K --> L[Send Audio to STT]
    L --> M[Get Transcription]
    M --> N[Send to LLM]
    N --> O[Get AI Response]
    O --> P[Send to TTS + Avatar]
    P --> Q[Avatar Speaks with Lip-sync]
    Q --> R{Continue Conversation?}
    R -->|Yes| I
    R -->|No| S[End Session]
    S --> T[Calculate Scores]
    T --> U[Save Progress]
    U --> V[Show Result Summary]
    V --> End([◉])
```

---

## 10. Activity Diagram - Proses Text Chat

```mermaid
flowchart TD
    Start([●]) --> A[Open Chat Page]
    A --> B{Existing Session?}
    B -->|Yes| C[Load Chat History]
    B -->|No| D[Create New Session]
    C --> E[Display Messages]
    D --> E
    
    E --> F[User Types Message]
    F --> G[Click Send Button]
    G --> H[Display User Message]
    H --> I[Save to Database]
    I --> J[Send to Backend API]
    J --> K[Forward to OpenRouter LLM]
    
    K --> L[Receive SSE Stream]
    L --> M{Stream Complete?}
    M -->|No| N[Display Token]
    N --> L
    M -->|Yes| O[Finalize Response]
    O --> P[Save Assistant Message]
    P --> Q{Continue Chat?}
    Q -->|Yes| F
    Q -->|No| End([◉])

    style Start fill:#4caf50,stroke:#2e7d32
    style End fill:#f44336,stroke:#c62828
```

---

## 11. Activity Diagram - Proses Login

```mermaid
flowchart TD
    Start([●]) --> A[Open Login Page]
    A --> B{Login Method?}
    
    B -->|Email/Password| C[Enter Email]
    C --> D[Enter Password]
    D --> E[Click Login Button]
    E --> F{Credentials Valid?}
    F -->|No| G[Show Error Message]
    G --> C
    F -->|Yes| H[Create Session]
    
    B -->|Google OAuth| I[Click Google Login]
    I --> J[Redirect to Google]
    J --> K[User Authorizes]
    K --> L[Return with OAuth Token]
    L --> M{Token Valid?}
    M -->|No| N[Show Error]
    N --> A
    M -->|Yes| H
    
    H --> O[Fetch User Profile]
    O --> P[Update Progress Data]
    P --> Q[Redirect to Dashboard]
    Q --> End([◉])

    style Start fill:#4caf50,stroke:#2e7d32
    style End fill:#f44336,stroke:#c62828
```

---

## 12. Activity Diagram - Proses Daily Challenge

```mermaid
flowchart TD
    Start([●]) --> A[Open Challenge Page]
    A --> B{Challenge Available?}
    B -->|No| C[Show "Come Back Tomorrow"]
    C --> End1([◉])
    
    B -->|Yes| D[Load Challenge Questions]
    D --> E[Display Question 1]
    
    E --> F[User Selects Answer]
    F --> G{Answer Correct?}
    G -->|Yes| H[Show Correct Feedback]
    H --> I[Add 20 XP]
    G -->|No| J[Show Explanation]
    
    I --> K{More Questions?}
    J --> K
    K -->|Yes| L[Next Question]
    L --> F
    K -->|No| M[Calculate Total Score]
    M --> N[Update Leaderboard]
    N --> O[Update Streak]
    O --> P[Show Result Summary]
    P --> End2([◉])

    style Start fill:#4caf50,stroke:#2e7d32
    style End1 fill:#ff9800,stroke:#ef6c00
    style End2 fill:#f44336,stroke:#c62828
```

---

## 13. Use Case Diagram - Full System

```mermaid
graph TB
    subgraph System["🖥️ SpeakenAI Tutor System"]
        subgraph Auth["Authentication"]
            UC1((Login))
            UC2((Register))
            UC3((Logout))
        end
        
        subgraph Learning["Learning Features"]
            UC4((Text Chat dengan AI))
            UC5((Roleplay dengan Avatar))
            UC6((Daily Challenge))
        end
        
        subgraph Progress["Progress Tracking"]
            UC7((View Progress))
            UC8((View Leaderboard))
            UC9((Edit Profile))
        end
        
        subgraph AI_Processing["AI Processing"]
            UC10((Speech-to-Text))
            UC11((LLM Processing))
            UC12((Text-to-Speech))
            UC13((Grammar Analysis))
        end
        
        UC5 -.->|include| UC10
        UC5 -.->|include| UC11
        UC5 -.->|include| UC12
        UC4 -.->|include| UC11
        UC4 -.->|extend| UC13
    end
    
    User((👤 Learner))
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9

    style User fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style System fill:#f5f5f5,stroke:#616161,stroke-width:2px
    style Auth fill:#e3f2fd,stroke:#1976d2
    style Learning fill:#fff3e0,stroke:#f57c00
    style Progress fill:#f3e5f5,stroke:#7b1fa2
    style AI_Processing fill:#fce4ec,stroke:#c2185b
```

---

## 14. Sequence Diagram - Roleplay Avatar Detail

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as Frontend<br/>(React)
    participant SDK as HeyGen SDK
    participant B as Backend<br/>(Express)
    participant H as HeyGen API
    participant O as OpenRouter<br/>LLM
    participant D as Supabase<br/>Database

    Note over U,D: === Session Initialization ===
    U->>F: Click "Start Roleplay"
    F->>B: GET /api/heygen/token
    B->>H: Request access token
    H-->>B: Return token
    B-->>F: Return token
    
    F->>SDK: createAvatar(token, avatarId)
    SDK->>H: Initialize WebRTC session
    H-->>SDK: ICE candidates + SDP offer
    SDK-->>F: Avatar stream ready
    F-->>U: Display avatar video

    Note over U,D: === Voice Interaction Loop ===
    rect rgb(230, 245, 255)
        U->>F: Click "Start Talking"
        F->>SDK: startListening()
        SDK->>H: Start audio capture
        
        U->>F: Speak (audio input)
        F->>SDK: Audio stream
        SDK->>H: WebRTC audio stream
        
        U->>F: Click "Stop Talking"
        F->>SDK: stopListening()
        H->>H: STT Processing
        H-->>SDK: Transcribed text
        SDK-->>F: User message text
        
        F->>F: Add to conversation history
        F->>B: POST /api/openrouter
        Note over B,O: messages[] includes full history
        B->>O: Chat completion (stream)
        
        loop SSE Streaming
            O-->>B: data: {"content": "..."}
            B-->>F: Forward chunk
            F->>F: Accumulate response
        end
        
        O-->>B: [DONE]
        B-->>F: Stream complete
        
        F->>SDK: speak(responseText)
        SDK->>H: TTS + Lip-sync request
        H->>H: Generate audio + video
        H-->>SDK: Video stream (WebRTC)
        SDK-->>F: Avatar speaking
        F-->>U: Watch avatar respond
    end

    Note over U,D: === Session End ===
    U->>F: Click "End Session"
    F->>SDK: closeAvatar()
    SDK->>H: Close WebRTC connection
    F->>O: Request evaluation
    O-->>F: Scores JSON
    F->>D: Save progress + scores
    D-->>F: Saved
    F-->>U: Show result summary
```

---

## 15. Class Diagram - Full Entity Relationship

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String full_name
        +String avatar_url
        +DateTime created_at
        +DateTime updated_at
        +login() Boolean
        +register() Boolean
        +updateProfile() void
        +getProgress() UserProgress[]
    }
    
    class ChatSession {
        +UUID id
        +UUID user_id
        +String title
        +String avatar_id
        +String language
        +String session_type
        +DateTime created_at
        +DateTime updated_at
        +create() ChatSession
        +rename(title) void
        +delete() void
        +getMessages() ChatMessage[]
    }
    
    class ChatMessage {
        +UUID id
        +UUID session_id
        +String role
        +String content
        +DateTime created_at
        +append() void
        +update(content) void
        +delete() void
    }
    
    class UserProgress {
        +UUID id
        +UUID user_id
        +Date session_date
        +String session_type
        +Integer pronunciation_score
        +Integer fluency_score
        +Integer grammar_score
        +Integer prosody_score
        +Integer duration_seconds
        +saveSession() void
        +getAverageScore() Float
        +getWeeklyProgress() UserProgress[]
    }
    
    class LeaderboardEntry {
        +UUID id
        +UUID user_id
        +Integer total_score
        +Integer current_streak
        +Integer max_streak
        +Integer challenges_completed
        +Date last_activity_date
        +Integer rank
        +updateScore(points) void
        +updateStreak() void
        +calculateRank() Integer
    }
    
    class DailyChallenge {
        +UUID id
        +String question
        +JSON options
        +Integer correct_answer
        +String explanation
        +String category
        +String difficulty
        +Date active_date
        +getActiveChallenge() DailyChallenge
        +getAllByDate(date) DailyChallenge[]
    }
    
    class UserChallengeAttempt {
        +UUID id
        +UUID user_id
        +UUID challenge_id
        +Integer selected_answer
        +Boolean is_correct
        +Integer points_earned
        +DateTime attempt_date
        +submitAttempt() void
        +getAttemptsByUser(userId) UserChallengeAttempt[]
    }
    
    class Avatar {
        +String id
        +String name
        +String persona
        +String voice_id
        +String description
        +getAvailable() Avatar[]
    }

    User "1" --> "*" ChatSession : owns
    ChatSession "1" --> "*" ChatMessage : contains
    User "1" --> "*" UserProgress : tracks
    User "1" --> "1" LeaderboardEntry : has
    User "1" --> "*" UserChallengeAttempt : attempts
    DailyChallenge "1" --> "*" UserChallengeAttempt : has
    ChatSession "*" --> "1" Avatar : uses
```

---

## 10. Alur Data Sistem (Data Flow)

```mermaid
flowchart LR
    subgraph Input["INPUT"]
        Voice[🎤 Voice]
        Text[⌨️ Text]
    end
    
    subgraph Processing["PROCESSING"]
        STT[Speech-to-Text<br/>HeyGen]
        LLM[Large Language Model<br/>OpenRouter]
        TTS[Text-to-Speech<br/>HeyGen]
    end
    
    subgraph Output["OUTPUT"]
        Avatar[🧑‍💼 Avatar Video]
        Audio[🔊 Audio]
        TextOut[📝 Text Response]
    end
    
    subgraph Storage["STORAGE"]
        DB[(Supabase<br/>PostgreSQL)]
    end
    
    Voice --> STT
    STT --> LLM
    Text --> LLM
    LLM --> TTS
    LLM --> TextOut
    TTS --> Avatar
    TTS --> Audio
    LLM --> DB
    
    style Input fill:#e3f2fd,stroke:#1976d2
    style Processing fill:#e8f5e9,stroke:#388e3c
    style Output fill:#fff3e0,stroke:#f57c00
    style Storage fill:#fce4ec,stroke:#c2185b
```

---

## 11. Component Diagram - Tech Stack

```mermaid
graph TB
    subgraph Client["Client (Browser)"]
        React[React + TypeScript]
        Vite[Vite Bundler]
        Tailwind[Tailwind CSS]
        HeyGenSDK[HeyGen SDK]
    end
    
    subgraph Server["Server"]
        Express[Express.js]
        Node[Node.js Runtime]
    end
    
    subgraph ExternalAPI["External APIs"]
        HeyGen[HeyGen Streaming Avatar]
        OpenRouter[OpenRouter LLM]
    end
    
    subgraph Database["Database"]
        Supabase[Supabase PostgreSQL]
        Auth[Supabase Auth]
    end
    
    React --> Express
    HeyGenSDK --> HeyGen
    Express --> OpenRouter
    Express --> Supabase
    React --> Auth
    
    style Client fill:#e3f2fd,stroke:#1976d2
    style Server fill:#e8f5e9,stroke:#388e3c
    style ExternalAPI fill:#fff3e0,stroke:#f57c00
    style Database fill:#f3e5f5,stroke:#7b1fa2
```

---

## 12. Kerangka Berpikir Penelitian

```mermaid
flowchart TB
    subgraph INPUT["🎯 INPUT"]
        A[Permasalahan:<br/>Keterbatasan Media Latihan<br/>Speaking Bahasa Inggris]
    end
    
    subgraph TEORI["📚 LANDASAN TEORI"]
        B1[Artificial Intelligence]
        B2[Natural Language Processing]
        B3[Speech-to-Text & TTS]
        B4[Large Language Models]
        B5[Avatar Interactive]
        B6[Gamification Theory]
        B7[CALL Theory]
    end
    
    subgraph METODE["⚙️ METODOLOGI"]
        C[Pressman 2015<br/>Software Engineering]
        C1[Communication]
        C2[Planning]
        C3[Modeling]
        C4[Construction]
        C5[Deployment]
    end
    
    subgraph OUTPUT["✅ OUTPUT"]
        D[SpeakenAI Tutor:<br/>AI Agent dengan Avatar<br/>Interaktif untuk Pembelajaran<br/>Bahasa Inggris]
    end
    
    A --> B1 & B2 & B3 & B4 & B5 & B6 & B7
    B1 & B2 & B3 & B4 & B5 & B6 & B7 --> C
    C --> C1 --> C2 --> C3 --> C4 --> C5
    C5 --> D
    
    style INPUT fill:#ffebee,stroke:#c62828
    style TEORI fill:#e3f2fd,stroke:#1976d2
    style METODE fill:#e8f5e9,stroke:#388e3c
    style OUTPUT fill:#fff3e0,stroke:#ef6c00
```

---

## Cara Menggunakan Diagram

### Online Mermaid Editor
1. Buka [Mermaid Live Editor](https://mermaid.live/)
2. Copy kode Mermaid yang diinginkan
3. Paste di editor untuk melihat preview
4. Download sebagai PNG/SVG

### VS Code Extension
1. Install extension "Mermaid Preview" atau "Markdown Preview Mermaid Support"
2. Buka file ini di VS Code
3. Preview akan menampilkan diagram

### Export ke Word/PDF
1. Render diagram menggunakan Mermaid Live Editor
2. Export sebagai PNG atau SVG
3. Insert gambar ke dokumen Word

---

_Dokumen diagram dibuat untuk mendukung BAB II Tinjauan Pustaka SpeakenAI Tutor_  
_Terakhir diperbarui: 4 Februari 2026_
