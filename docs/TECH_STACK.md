# Perangkat Lunak Pengembang Speaken-AI-Tutor

Dokumen ini menjelaskan perangkat lunak yang digunakan dalam pengembangan sistem **Speaken-AI-Tutor**.

---

## 📊 Tabel Perangkat Lunak Pengembang

| Perangkat Lunak          | Versi            | Fungsi                              |
| ------------------------ | ---------------- | ----------------------------------- |
| HeyGen Streaming Avatar  | ^2.1.0           | Model avatar real-time dengan suara |
| Meta: Llama (OpenRouter) | 3.3 70B Instruct | Chatbot LLM                         |
| Visual Studio Code       | 1.106.0          | Editor                              |
| Node.js                  | 22.17.0          | Runtime untuk Vite & Express        |
| Vite                     | ^6.4.1           | Build tool & dev server             |
| Express.js               | ^5.1.0           | Backend server                      |
| React                    | ^18.3.1          | Frontend framework                  |
| TypeScript               | -                | Static typing                       |
| Tailwind CSS             | -                | Utility-first CSS framework         |
| Supabase                 | ^2               | Database PostgreSQL & Auth          |
| Radix UI                 | -                | UI component primitives             |
| Framer Motion            | ^12.23.25        | Animasi komponen                    |
| i18next                  | ^25.7.3          | Internationalization (multi-bahasa) |
| LiveKit Client           | ^2.15.14         | Real-time communication             |
| Postman                  | -                | Uji REST API                        |

---

## 🔧 Komponen Utama

### Frontend

- **React + Vite + TypeScript** - SPA dengan hot module replacement
- **Tailwind CSS + Radix UI** - Styling dan UI primitives
- **Framer Motion** - Micro-animations dan transisi
- **i18next** - Dukungan multi-bahasa

### Backend

- **Node.js + Express** - REST API server
- **Supabase Client** - Database operations

### AI & Real-time

- **HeyGen Streaming Avatar** - Voice roleplay dengan avatar
- **OpenRouter (Llama 3.3 70B)** - Text-based chatbot
- **LiveKit** - Real-time audio/video communication

### Storage & Database

- **Supabase (PostgreSQL)** - User data, chat sessions, progress
- **Local Storage** - Uploads directory untuk avatar

---

## 📁 Struktur Project

```
Speaken-AI-Tutor/
├── src/                    # Frontend React code
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization
│   └── lib/                # Utilities & constants
├── server/                 # Express backend
│   └── index.ts            # API endpoints
├── supabase/               # Database migrations
│   └── migrations/         # SQL migration files
├── public/                 # Static assets
└── uploads/                # User uploaded files
```

---

_Terakhir diperbarui: 20 Januari 2026_
