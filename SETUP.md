# VDMS Frontend Team Setup

This guide explains how your friend can run frontend against real backend data.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Copy local example:

```bash
cp .env.local.example .env
```

Windows PowerShell alternative:

```powershell
Copy-Item .env.local.example .env
```

Set API base URL:

- Local backend: http://localhost:3000
- Shared deployed backend: https://your-backend-domain.com

## 3. Run frontend

```bash
npm run dev
```

Default frontend URL is http://localhost:5173.

---

## For Friends To See Real Shared Output

1. Pull latest frontend and backend code.
2. Use same shared backend URL in frontend .env.
3. Backend must connect to same shared PostgreSQL DB.
4. Backend CORS FRONTEND_URL must include frontend origin.

If a friend points frontend to their own localhost backend, output will differ.
