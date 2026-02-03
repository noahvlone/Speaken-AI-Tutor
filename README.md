# Speaken AI Tutor

AI tutor with **voice role-play avatars** and **text chat**. Pick an avatar + language, talk in real time, or switch to plain text chat. Sessions can be saved to Supabase for later review.

> Built with React (Vite + TS), Tailwind, Radix primitives, Express/Hono backend, HeyGen Streaming Avatar, and OpenRouter.

---

## ✨ Features

- **Two modes:** Voice **Role-play** (avatar) & **Text Chat**
- **Avatars**: curated list of HeyGen avatars you can pick from
- **Multilingual STT**: choose the speech-to-text input language
- **Streaming responses** via SSE
- **Optional persistence** (save chats to Supabase)
- **Typed React + Vite** dev experience

---

## 🧱 Tech Stack

- **Frontend:** React + Vite + TypeScript, Tailwind, Radix UI, Lucide icons
- **Backend:** Node.js, Express + Hono
- **AI:** HeyGen Streaming Avatar (voice), OpenRouter (LLM text)
- **Storage (optional):** Supabase (REST/JS client)

---

## 🗺️ App Overview

- **Role-play Page:** choose avatar + language, start/stop voice chat
- **Text Chat Page:** pick model, send/stream messages, (optionally) log to Supabase
- **Server API:**
  - `/api/heygen/token` — mint short-lived token for the HeyGen session
  - `/api/openrouter` — proxy to OpenRouter with streaming

---

## 🚀 Getting Started

### 1) Prerequisites

- Node.js 18+
- pnpm 9+ (repo is configured for pnpm)

### 2) Clone & install

```bash
git clone https://github.com/noahvlone/Speaken-AI-Tutor.git
cd Speaken-AI-Tutor
pnpm install
```

---

## ⚠️ SECURITY ALERT

**CRITICAL**: If you're setting up this project, please read `URGENT_SECURITY_ALERT.md` first!

The original `.env` file contained exposed API keys. You **MUST** use your own keys.

---

## 3) Environment variables

### Client Environment Variables

Create a **root** `.env` for the web app (Vite reads `VITE_*`):

```env
# Client (use .env.example as template)
VITE_HEYGEN_BASE_API_URL=https://api.heygen.com

# Supabase (optional, only if you want to save chat logs)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server Environment Variables

Create a **server/.env** for private keys (use `server/.env.example` as template):

```env
# Server
PORT=8787

# HeyGen (Server-side only)
HEYGEN_API_KEY=your_heygen_api_key

# OpenRouter (Server-side only - DO NOT use VITE_ prefix)
OPENROUTER_API_KEY=your_openrouter_api_key

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Important**: 
> - Never commit `.env` files to Git
> - Keep API keys server-side only (no `VITE_` prefix for sensitive keys)
> - Use `.env.example` files as templates
> - See `SECURITY.md` for detailed security guidelines



### 4) Run dev

Open two terminals:

**Server**

```bash
pnpm server:dev
# or: node server/index.ts (if you compiled)
```

**Web**

```bash
pnpm dev
```

Visit: `http://localhost:5173` (default Vite port)

---

## 🔧 Configuration

### Choose avatars & languages

Edit the lists in:

```
src/app/lib/constants.ts
```

- `AVATARS`: the available HeyGen avatars (id, label)
- `STT_LANGUAGES`: input languages for speech-to-text

### Model selection (OpenRouter)

On the Text Chat page you can switch models at runtime.
If you want a default/fallback, set it in your chat client code.

### Supabase logging (optional)

Wire a table like:

```sql
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);
```

Point the client to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 📡 API Endpoints (local)

- `POST /api/heygen/token`
  Returns a short-lived token to start a HeyGen Streaming Avatar session.

- `POST /api/openrouter` (SSE)
  Proxies your request to OpenRouter and streams back tokens.

> Both endpoints are served by the Node server (Express/Hono). Configure `VITE_API_BASE` to match your server origin in dev/prod.

---

## 🧪 Scripts

Common scripts:

```bash
# Web
pnpm dev        # start Vite
pnpm build      # build client
pnpm preview    # preview client build

# Server
pnpm server:dev     # dev server (watch)
pnpm server:build   # compile server (if configured)
pnpm server:start   # start compiled server
```

---

## 🧪 Testing

This project uses **Vitest** for unit testing with React Testing Library.

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Tests are located in `src/components/__tests__/` directory. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

See `src/components/__tests__/ErrorBoundary.test.tsx` for a complete example.

---

## 🩹 Troubleshooting

- **CORS**: make sure `VITE_API_BASE` points at your server (e.g., `http://localhost:8787`).
- **HTTPS mic permissions**: browsers block mic on insecure origins—use `localhost` or HTTPS in prod.
- **Streaming stuck**: confirm your OpenRouter key is valid and your model supports streaming.
- **Avatar won’t start**: ensure `/api/heygen/token` returns a token and the API key is correct.

---

## 🗓️ Roadmap

- [ ] In-UI chat session manager (rename, delete, search)
- [ ] Per-avatar system prompts & “roles”
- [ ] Simple lesson flows (goal → drill → feedback → recap)
- [ ] Export sessions (JSON/Markdown)
- [ ] Auth (Supabase) for private histories

---

## 🙏 Acknowledgements

- [HeyGen Streaming Avatar](https://www.heygen.com/)
- [OpenRouter](https://openrouter.ai/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/), [React](https://react.dev/)

### Key reference points

- Server endpoints and structure are defined in `server/index.ts` (HeyGen token + OpenRouter SSE proxy). :contentReference[oaicite:0]{index=0}
- Avatars & STT languages are configured in `src/app/lib/constants.ts`. :contentReference[oaicite:1]{index=1}
- Package manager and core deps (HeyGen SDK, LiveKit client, Express/Hono, Vite/React/TS) are declared in `package.json`. :contentReference[oaicite:2]{index=2}
- The app routes include Roleplay and Chat pages (see `src/App.tsx`). :contentReference[oaicite:3]{index=3}

---

## 📚 Additional Documentation

- **[SECURITY.md](./SECURITY.md)** - Security best practices and guidelines
- **[IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)** - Recent improvements and changes
- **[URGENT_SECURITY_ALERT.md](./URGENT_SECURITY_ALERT.md)** - Critical security alert (if applicable)

---

## 🛡️ Security

This project has been audited for security issues. Key improvements:

- ✅ Error Boundary for graceful error handling
- ✅ CORS restrictions for API security
- ✅ Proper environment variable separation
- ✅ Unit testing framework
- ✅ CI/CD pipeline

For security concerns, see `SECURITY.md`.

---

## 📝 License

This project is for educational purposes. See individual dependencies for their licenses.
