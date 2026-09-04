# ReWear — Free Deployment Guide

This repo is deploy-ready for **Render (recommended)** or **Vercel + Render/Railway**. No paid services needed.

## Option 1: Easiest — Render (Backend + DB + Frontend, all free)

Render provides free Postgres (90 days) + free web services.

### Steps
1. **Push to GitHub** (already done): `https://github.com/Mohammad-416/ReWear`
2. Go to https://dashboard.render.com → **New +** → **Blueprint** → connect your GitHub repo
3. Render auto-detects `render.yaml` which creates:
   - `rewear-backend` (Docker, Django + Gunicorn)
   - `rewear-db` (Postgres free)
   - `rewear-frontend` (static Vite build) — *if you prefer, skip this and use Vercel for frontend (see Option 2)*

   If Blueprint not wanted, create manually:
   - **New Web Service** → connect repo → **Docker** → **Root Directory: backend** → **Dockerfile: ./backend/Dockerfile**
     - Env vars:
       ```
       DEBUG=False
       SECRET_KEY=<generate random 50 chars>
       ALLOWED_HOSTS=*
       SUPERUSER_SECRET_KEY=your-secret
       CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com,https://your-frontend.vercel.app
       CSRF_TRUSTED_ORIGINS=https://your-frontend.onrender.com,https://your-frontend.vercel.app,https://your-backend.onrender.com
       CLOUDINARY_CLOUD_NAME=... (optional)
       CLOUDINARY_API_KEY=...
       CLOUDINARY_API_SECRET=...
       ```
     - Add **Postgres** → copy its **Internal Database URL** → set as `DATABASE_URL` in backend service.
   - **New Static Site** → Root `frontend` → Build `npm install && npm run build` → Publish `dist` → Env `VITE_API_URL=https://your-backend.onrender.com`

4. **After backend deploys**, create admin:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/accounts/create-superuser/ \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@example.com","password":"StrongPass123","secret_key":"your SUPERUSER_SECRET_KEY"}'
   ```
   Then admin panel: `https://your-backend.onrender.com/admin/` and human verification: `https://your-frontend.onrender.com/admin/panel`

5. **Update CORS** — after you know frontend URL, set `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to that exact URL and redeploy.

> Free tier spins down after 15 min inactivity (cold start ~30s). Postgres free expires after 90 days — export/renew or switch to Supabase Neon.

---

## Option 2: Vercel (Frontend) + Render/Railway (Backend) — faster frontend

### Frontend on Vercel (free, no cold start)
1. Go to https://vercel.com → **Add New Project** → import `Mohammad-416/ReWear`
2. **Framework: Vite** → **Root Directory: frontend** → **Build: npm run build** → **Output: dist**
3. Env: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy → you get `https://rewear-xxx.vercel.app`

### Backend on Render (same as Option 1, just without static site)
Follow Option 1 backend steps, set `CORS_ALLOWED_ORIGINS=https://rewear-xxx.vercel.app`

**Alternative backend free hosts:**
- **Railway** (`railway.app`): `New Project → Deploy from GitHub → backend/Dockerfile` → add Postgres plugin → set envs → copy public URL to `VITE_API_URL`
- **Fly.io**: `fly launch` in `backend/`, `fly postgres create`

---

## Option 3: Local prod test with Docker Compose
```bash
# Create env file
cp backend/.env.example backend/.env
# Edit SECRET_KEY, SUPERUSER_SECRET_KEY, CORS_ALLOWED_ORIGINS

# Prod compose (builds frontend with nginx + backend with gunicorn)
docker compose -f docker-compose.prod.yml up --build
# Frontend: http://localhost/
# Backend: http://localhost:8000/admin/
```

## Env Checklist (production)
- `SECRET_KEY` — must be random, never `django-insecure-*`
- `DEBUG=False`
- `DATABASE_URL` — from Render/Railway Postgres
- `CORS_ALLOWED_ORIGINS` — exact frontend origin(s), comma separated, no trailing slash
- `CSRF_TRUSTED_ORIGINS` — same + backend origin, with `https://`
- `VITE_API_URL` — backend public URL, set in Vercel/Render frontend env

## Post-deploy verification
- `GET https://backend/api/items/` → should return `[]` (empty, needs approved items)
- Create user via `/signup`, list item via `/add-item` → appears in `/admin/panel` as pending
- Login as admin → approve → item appears on `/landing`

## Notes
- Media: without Cloudinary, uploads go to `backend/media/` and are lost on redeploy (ephemeral). Set Cloudinary env for persistence.
- Whitenoise serves `staticfiles` collected via `collectstatic`.
- Backend runs `migrate --noinput` on start, so DB migrations auto-apply.
