# 🚀 Quick Start Guide - Speaken AI Tutor

This is a quick reference guide for developers. For detailed information, see `README.md`.

---

## ⚡ Fast Setup (5 Minutes)

### 1. Clone & Install
```bash
git clone https://github.com/noahvlone/Speaken-AI-Tutor.git
cd Speaken-AI-Tutor
npm install
```

### 2. Setup Environment Variables

**Root `.env`** (copy from `.env.example`):
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

**Server `.env`** (copy from `server/.env.example`):
```bash
cp server/.env.example server/.env
# Edit server/.env with your API keys
```

### 3. Get API Keys

| Service | URL | Key Type |
|---------|-----|----------|
| HeyGen | https://app.heygen.com/ | Server-side |
| OpenRouter | https://openrouter.ai/ | Server-side |
| Supabase | https://supabase.com/dashboard | Client-side |

### 4. Run Development Server
```bash
npm run dev
# Opens on http://localhost:5173
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server (frontend + backend)
npm run server           # Start backend only
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run format:md        # Format markdown files
npm audit                # Check for vulnerabilities
npm audit fix            # Fix vulnerabilities
```

---

## 🗂️ Project Structure

```
Speaken-AI-Tutor/
├── src/
│   ├── components/          # React components
│   │   ├── __tests__/      # Unit tests
│   │   ├── ui/             # Reusable UI components
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # CSS files
│   └── App.tsx             # Main app component
├── server/
│   ├── index.ts            # Express server
│   └── .env.example        # Server env template
├── public/                 # Static assets
├── docs/                   # Documentation
├── .env.example            # Client env template
└── package.json
```

---

## 🔑 Environment Variables Reference

### Client-Side (`.env`)
```env
VITE_HEYGEN_BASE_API_URL=https://api.heygen.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Server-Side (`server/.env`)
```env
PORT=8787
HEYGEN_API_KEY=sk_V2_...
OPENROUTER_API_KEY=sk-or-v1-...
FRONTEND_URL=http://localhost:5173
```

---

## 🐛 Troubleshooting

### Error: "OPENROUTER_API_KEY is missing"
- Make sure you created `server/.env` (not just root `.env`)
- Don't use `VITE_` prefix for server keys

### Error: "Not allowed by CORS"
- Check `FRONTEND_URL` in `server/.env`
- Add your domain to `allowedOrigins` in `server/index.ts`

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Port Already in Use
```bash
# Change port in server/.env
PORT=8788

# Or kill the process using the port
# Windows:
netstat -ano | findstr :8787
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8787 | xargs kill -9
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main application & routing |
| `server/index.ts` | Backend API server |
| `src/components/ErrorBoundary.tsx` | Error handling |
| `vitest.config.ts` | Testing configuration |
| `.github/workflows/ci.yml` | CI/CD pipeline |
| `SECURITY.md` | Security guidelines |

---

## 🎯 Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run dev          # Test in browser
   npm test             # Run unit tests
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - CI will automatically run tests
   - Wait for review and approval

---

## 🔒 Security Checklist

Before deploying or sharing:

- [ ] All API keys are in `.env` files (not committed)
- [ ] `.env` is in `.gitignore`
- [ ] Using different keys for dev/production
- [ ] CORS is configured for production domain
- [ ] All tests passing
- [ ] No security vulnerabilities (`npm audit`)

---

## 🆘 Need Help?

1. **Check Documentation**
   - `README.md` - Full documentation
   - `SECURITY.md` - Security guidelines
   - `IMPROVEMENTS_SUMMARY.md` - Recent changes

2. **Common Issues**
   - See Troubleshooting section above
   - Check GitHub Issues

3. **Contact**
   - Create an issue on GitHub
   - Contact project maintainers

---

## 📊 Tech Stack Quick Reference

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Radix UI |
| **Backend** | Node.js, Express |
| **AI Services** | HeyGen (Avatar), OpenRouter (LLM) |
| **Database** | Supabase |
| **Testing** | Vitest, React Testing Library |
| **CI/CD** | GitHub Actions |

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Guide](https://vitest.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [HeyGen API](https://docs.heygen.com/)
- [OpenRouter API](https://openrouter.ai/docs)

---

**Last Updated**: 2026-02-03  
**Version**: 0.1.0 (Post-Security-Audit)
