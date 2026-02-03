# Image Generation Prompts

Gunakan prompt berikut ini di tools generative AI (seperti Napkin.ai, Midjourney, Recraft, atau DALL-E) untuk membuat diagram sistem yang profesional.

---

## 1. System Architecture Diagrams (untuk `docs/SYSTEM_DESIGN.md`)

### A. Roleplay Flow Diagram

**Prompt:**

```text
A professional flow diagram showing data flow for an AI Avatar Roleplay app.
Horizontal flow from left to right:
1. "User" icon (speaking).
2. "Browser" box (Microphone Input).
3. "Express Server" box (/token endpoint).
4. "HeyGen Service" cloud (STT -> TTS -> Lip-sync).
5. "OpenRouter LLM" cloud (Llama 3.3).
Arrows: User -> Browser -> Server -> HeyGen STT -> OpenRouter -> HeyGen TTS -> Avatar Video -> User.
Style: Modern tech architecture diagram, flat design, white background, blue and purple gradient accents, professional and clean.
```

### B. Text Chat Flow Diagram

**Prompt:**

```text
A professional sequence flow diagram for a Real-time Text Chat AI app.
Left to right flow:
1. "User" icon (typing).
2. "React Frontend" box (Input).
3. "Express Server" box (API Proxy).
4. "OpenRouter LLM" cloud (Llama 3.3).
5. "Supabase DB" cylinder (Storage).
Key feature: Show "SSE Stream" arrows flowing back from OpenRouter -> Server -> Frontend.
Separate arrow for "Save to DB" from Frontend to Supabase.
Style: Modern software diagram, flat vector style, white background, green and teal gradient accents, clean lines.
```

### C. Overall System Architecture

**Prompt:**

```text
A full system architecture diagram for "SpeakenAI Tutor".
Four distinct layers stacked vertically:
1. Top Layer: "Client Layer" (React + Vite, Roleplay Page, Chat Page).
2. Second Layer: "API Layer" (Node.js Express Server).
3. Third Layer: "Services Layer" (HeyGen Streaming Avatar, OpenRouter API).
4. Bottom Layer: "Data Layer" (Supabase PostgreSQL, Local Storage).
Connectors showing interactions between layers.
Style: Enterprise architecture diagram, block diagram style, distinct colors for each layer (Client=Blue, API=Purple, Services=Orange, Data=Green), professional, high resolution.
```

---

## 2. UML Diagrams (untuk `docs/UML_DESIGN.md`)

_(Sudah digenerate, gunakan ini jika ingin membuat ulang dengan style berbeda)_

### A. Use Case Diagram

**Prompt:**

```text
A professional UML Use Case Diagram for "SpeakenAI" language app.
Actors: "Learner", "AI Tutor", "System".
System Boundary Box containing use cases:
- Group "Roleplay": Select Avatar, Speak, Receive Video.
- Group "Chat": Send Text, Receive Correction.
- Group "Account": Leaderboard, Progress, Login.
Style: Classic UML, clean blue lines, white background, professional vector graphics.
```

### B. Activity Diagram

**Prompt:**

```text
A UML Activity Diagram for "Roleplay Session".
Vertical flow: Login -> Select Mode -> Speak -> AI Processing -> (Parallel: TTS + Subtitles) -> Listen -> Loop or End.
Style: Professional flowchart, rounded blocks, diamonds for decisions, solid arrows, minimalist corporate design.
```

### C. Sequence Diagram

**Prompt:**

```text
A UML Sequence Diagram for "Chat Message Flow".
Lifelines: User, Frontend, Backend, OpenRouter, Database.
Show message flow with request/response arrows. Highlight "Stream Chunks" and "SSE Events" for real-time response.
Style: Digital sequence diagram, activation bars, clear text labels, modern tech aesthetic.
```

### D. Class Diagram

**Prompt:**

```text
A UML Class Diagram for a database schema.
Classes: User, ChatSession, ChatMessage, UserProgress.
Show attributes (id, email, score) and methods.
Relationships: One-to-Many connections (User -> Sessions).
Style: Software engineering diagram, standard notation, clean layout, high contrast.
```
