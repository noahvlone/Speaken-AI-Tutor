# 🎯 SpeakenAI Tutor - Use Case Diagram

This diagram describes the functional requirements of the system from the perspective of different actors.

```mermaid
usecaseDiagram
    actor Learner
    actor "HeyGen API" as HeyGen <<Service>>
    actor "OpenRouter" as LLM <<Service>>
    actor "Supabase" as DB <<Service>>

    package "SpeakenAI Tutor System" {
        usecase "Register & Login" as UC1
        usecase "Voice Roleplay with Avatar" as UC2
        usecase "AI Text Conversation" as UC3
        usecase "Perform Daily Challenge" as UC4
        usecase "Track Learning Progress" as UC5
        usecase "View Global Leaderboard" as UC6
        usecase "Manage User Profile" as UC7
    }

    Learner --> UC1
    Learner --> UC2
    Learner --> UC3
    Learner --> UC4
    Learner --> UC5
    Learner --> UC6
    Learner --> UC7

    %% System interactions with external services
    UC1 --> DB
    UC2 --> HeyGen
    UC2 --> LLM
    UC2 --> DB
    UC3 --> LLM
    UC3 --> DB
    UC4 --> DB
    UC5 --> DB
    UC6 --> DB
    UC7 --> DB
```

### Actors Definition
- **Learner**: The primary user who wants to learn English.
- **HeyGen API**: External service for generating streaming avatars and lip-sync.
- **OpenRouter**: External service providing the LLM (Llama 3.3) for conversation generation.
- **Supabase**: Backend-as-a-service for authentication and PostgreSQL database.

### Use Case Descriptions
- **Voice Roleplay**: The core feature involving real-time voice interaction with an AI avatar.
- **AI Text Conversation**: A text-only alternative for practicing writing and reading.
- **Daily Challenge**: Gamified tasks to keep the learner engaged.
- **Track Progress**: Visualizing scores and improvement over time.
