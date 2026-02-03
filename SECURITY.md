# Security Policy

## 🔐 Reporting Security Vulnerabilities

If you discover a security vulnerability in Speaken AI Tutor, please report it by emailing the maintainers directly. **Do not open a public issue.**

## 🛡️ Security Best Practices

### Environment Variables

1. **Never commit `.env` files** to version control
2. Use `.env.example` as a template
3. Keep API keys server-side only (no `VITE_` prefix for sensitive keys)
4. Rotate API keys immediately if exposed

### API Key Management

- **HeyGen API Key**: Server-side only (`HEYGEN_API_KEY`)
- **OpenRouter API Key**: Server-side only (`OPENROUTER_API_KEY`)
- **Supabase Keys**: 
  - `VITE_SUPABASE_URL`: Safe for client-side
  - `VITE_SUPABASE_ANON_KEY`: Safe for client-side (public key)
  - Never expose service role keys

### CORS Configuration

The server is configured to only accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `http://localhost:8787` (Server port)
- Custom `FRONTEND_URL` from environment

Update `server/index.ts` to add your production domain.

## 🔄 Key Rotation Checklist

If your API keys have been exposed:

1. **Immediately** rotate all exposed keys:
   - [ ] HeyGen API Key
   - [ ] OpenRouter API Key
   - [ ] Supabase keys (if service role was exposed)

2. Update `.env` files with new keys

3. Restart all services

4. Review access logs for suspicious activity

## 📋 Security Checklist for Deployment

- [ ] All `.env` files are in `.gitignore`
- [ ] API keys are rotated from development
- [ ] CORS is configured for production domain
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Error messages don't expose sensitive information
- [ ] Dependencies are up to date (`npm audit`)

## 🔍 Regular Security Audits

Run these commands regularly:

```bash
# Check for vulnerable dependencies
npm audit

# Fix automatically if possible
npm audit fix

# Update dependencies
npm update
```

## 📞 Contact

For security concerns, contact the project maintainers.
