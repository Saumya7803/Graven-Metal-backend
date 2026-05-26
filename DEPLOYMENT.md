# GRAVEN METAL Deployment Guide

This project deploys as:
- Frontend (React + Vite): **Vercel**
- Backend (Node + Express): **Render**
- Database: **MongoDB Atlas**

---

## 1. Frontend Deployment (Vercel)

### Files already prepared
- `vercel.json` (SPA rewrites + cache/security headers + Vite output config)
- `.env.example` (local frontend env template)
- `.env.production.example` (Vercel production env template)
- `.vercelignore` (exclude backend and local artifacts from frontend deployment bundle)

### Required Vercel Environment Variables
- `VITE_API_BASE_URL` = `https://<your-render-service>.onrender.com/api`
- `VITE_SITE_URL` = `https://<your-vercel-domain>`

### Deploy steps
1. Push repo to GitHub.
2. Import repo in Vercel.
3. Framework preset: `Vite` (auto-detected).
4. Build command: `npm run build:vercel`
5. Output directory: `dist`
6. Add env vars above for Production and Preview environments.
7. Deploy.

---

## 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create database user (username/password).
3. In **Network Access**, allow Render egress or `0.0.0.0/0` (temporary, less strict).
4. Copy connection string and set:
   - `MONGODB_URI=mongodb+srv://...`

---

## 3. Backend Deployment (Render)

### Files already prepared
- `render.yaml` (Render service blueprint)
- `backend/package.json` (backend-only scripts/deps)
- `backend/.env.example` (production-ready variable list)

### Required Render Environment Variables
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URLS` (comma-separated frontend origins)
- `JWT_ISSUER` (recommended: `graven-metal-api`)
- `JWT_AUDIENCE` (recommended: `graven-metal-client`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:
- `JWT_EXPIRES_IN=7d`
- `NODE_ENV=production`
- `MONGO_MAX_POOL_SIZE=10`
- `MONGO_MIN_POOL_SIZE=1`
- `MONGO_SERVER_SELECTION_TIMEOUT_MS=10000`
- `MONGO_SOCKET_TIMEOUT_MS=45000`

### Deploy steps
1. Create new Web Service on Render from this repo (or apply `render.yaml`).
2. Root directory: `backend`.
3. Build command: `npm ci --omit=dev`.
4. Start command: `npm run start:prod`.
5. Add environment variables listed above.
6. Optional preflight check in Render Shell: `npm run env:check:render`.
7. Deploy and verify:
   - `https://<render-domain>/api/health`

---

## 4. CORS + Integration Notes

- Backend now supports **multiple origins** via `CLIENT_URLS` (comma-separated).
- After Vercel deploy, set:
  - `CLIENT_URLS=https://<your-vercel-domain>`
  - or include multiple domains (preview + production):
    `CLIENT_URLS=https://preview-url.vercel.app,https://prod-url.vercel.app`

---

## 5. Production Scripts Summary

### Frontend (root)
- `npm run build:frontend` -> clean build + gzip/brotli compressed assets
- `npm run preview` -> local production preview

### Backend
- From root: `npm run start:server`
- From `backend/`: `npm start`
- Optional prod install only: `npm run build:backend`

## 7. Pre-Deploy Checklist
- Run `npm run env:check:production` with deployment env vars loaded
- Run `npm run build:frontend`
- Verify backend health endpoint after deployment: `/api/health`

---

## 6. Final Cleanup Completed

- Added dedicated deployment configs (`vercel.json`, `render.yaml`)
- Added backend standalone package manifest (`backend/package.json`)
- Updated backend env template for Atlas + production CORS
- Added frontend and backend env examples
- Removed deprecated frontend API helper file (`src/lib/api.ts`)
