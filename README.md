# Vellum — AI Resume Builder

A full-stack resume builder: 20 templates, a real editable builder with
live preview, AI-assisted writing (summary, bullet improvement, skill
suggestions, resume review), and PDF export — free, no locked features.

---

## Project structure

```
src/            React frontend (Vite + Tailwind v4)
server/         Express backend for local dev, Render, Railway
  lib/          Shared handler logic — the actual AI/Gemini calls
api/            Vercel serverless functions (reuse server/lib, don't duplicate it)
```

The frontend never talks to the Gemini API directly. It calls `/api/ai/*`,
which is served by `server/index.js` locally (or on Render/Railway), or by
the files in `api/` on Vercel. The API key only ever lives on the server
side — it is never bundled into frontend code.

---

## 1. Setup

```bash
npm install
```

### Getting your Gemini API key (one-time, ~2 minutes, free)

1. Go to **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**
2. Sign in with any Google account
3. If asked to select a project, choose **"Default Gemini Project"** — the
   other options (upload/select existing project) are for larger Google
   Cloud setups, not needed here
4. Click **"Create API key"** and copy it — it will look like `AQ.Ab...`
   (Google's current key format; older tutorials may show `AIzaSy...`
   keys, both are valid)
5. No credit card is required for this. The free tier includes 1,500
   requests/day — far more than personal use needs

**Important — this is a separate thing from "Gemini Advanced" or "Google AI
Pro/Plus" (the paid consumer chat subscription).** That subscription does
**not** include API access and won't make this project's AI features work.
Only a key from the URL above does.

### Adding the key to this project

```bash
cp .env.example .env
```

Open `.env` in any editor, find the line `GEMINI_API_KEY=your_key_here`,
and replace `your_key_here` with the key you copied. Save the file.

**Never edit `.env.example`** — it's a template and should keep the
placeholder text. Only `.env` (no ".example") gets your real key.
**Never commit `.env`** to git — it's already in `.gitignore`.

### If the free tier ever changes

Go back to the same page you got your key from and add a small amount of
pay-as-you-go credit directly to that API key's account. Nothing in the
code or your `.env` file needs to change — the same key starts working
again automatically once billing is active. (You do **not** need to buy
any Google subscription for this — it's pay-per-use, typically pennies
for personal-scale usage.)

---

## 2. Run locally

```bash
npm run dev
```

This runs the Vite frontend (port 5173) and the Express AI backend (port
3001) together, with the frontend's dev server proxying `/api` requests to
the backend automatically. Open the URL Vite prints (usually
`http://localhost:5173`).

If you only need the frontend (AI features will show an error, everything
else works):

```bash
npm run dev:frontend-only
```

### Viewing it on your phone while developing

The dev server is already configured to be reachable from other devices —
useful for checking how it actually looks on a phone, not just guessing
from a laptop browser.

1. Make sure your phone and laptop are on the **same WiFi network**
2. Run `npm run dev` as usual
3. Look for a line in the terminal output like `Network: http://192.168.x.x:5173/`
   (alongside the usual `localhost` one)
4. Open that `192.168.x.x` address in your phone's browser

AI features work from your phone too in this setup — the phone only needs
to reach the frontend; the frontend's own server-side proxy handles
talking to the AI backend on the laptop automatically.

---

## 3. Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with `npm run preview`.

---

## 4. Deploy

This app needs **two things deployed**: the static frontend, and the AI
backend. Pick whichever path matches your platform.

### Option A — Vercel (recommended if you want one deployment)

Vercel auto-detects the `api/` folder as serverless functions and serves
the built frontend as static files — no separate backend deployment needed.

1. Push this project to GitHub.
2. Import it in Vercel.
3. In Vercel's project settings → Environment Variables, add
   `GEMINI_API_KEY` with your real key.
4. Deploy. Vercel builds the frontend (`vite build`) and wires up `/api/ai/*`
   automatically.

### Option B — Render or Railway (frontend + backend as two services)

Both platforms run a persistent Node server well, which is what
`server/index.js` is.

1. Deploy `server/index.js` as a Node web service (both platforms
   auto-detect `npm install` + a start command — set the start command to
   `node server/index.js`, or add a `"start"` script if the platform
   requires one).
2. Add `GEMINI_API_KEY` in that service's environment variables.
3. Deploy the frontend separately as a static site (build command
   `npm run build`, publish directory `dist`).
4. Point the frontend at your backend: since this project's frontend calls
   relative paths like `/api/ai/summary`, you'll either need the frontend
   and backend on the same domain (e.g. via a reverse proxy / rewrite rule
   on Render/Railway) or update `src/lib/ai/client.js` to call your
   backend's full URL directly instead of a relative path.

---

## 5. Honest limitations, on purpose

- **Auth and data storage run entirely client-side against the browser's
  localStorage** — there is no real backend database in this project.
  Passwords are hashed (SHA-256 + per-user salt, never stored in plaintext)
  and per-user data is properly isolated, but this is not server-grade
  security since everything lives in the browser. See `src/lib/auth/` and
  `src/lib/resumes/storage.js` — those are the only files that would need
  to change to swap in a real backend (Supabase, Firebase, or a custom
  Node + Postgres API) later.
- **PDF export generates a real PDF file directly in code** (via
  `@react-pdf/renderer`), not through the browser's print dialog. An
  earlier version relied on the browser's "print to PDF" flow, but that
  produced inconsistent, sometimes broken files depending on the device's
  OS/print driver — this was fixed by generating the file directly, which
  is now reliable on every device. The tradeoff: the downloaded PDF uses
  standard system fonts (not the on-screen custom fonts), a deliberate
  choice for reliability — see `src/lib/pdf/pdfFonts.js` for why.
- **The AI backend needs your own free Gemini API key** and will show a
  clear error in the UI if one isn't configured, rather than failing
  silently.
- **Photos are optional everywhere** — resumes work fully without one.
  Uploaded photos are resized/compressed client-side (via Canvas) before
  storage, to avoid bloating localStorage with full-resolution phone
  photos.

---

## 6. What's inside

- 20 named, individually designed resume templates (Executive Noir, Swiss
  Minimal Pro, AI Engineer Elite, Silicon Valley Developer, Luxury Black
  Titanium, Royal Sapphire, Creative Studio, Platinum Consultant, Future
  Vision AI, Academic Scholar, Global Traveler, Product Leader, Startup
  Founder, Metro Modern, Glassmorphism Pro, European Classic, One Page
  Master, Magazine Luxury, Cyber Tech, Infinity Premium) — built on one
  shared rendering engine (`src/components/resume/`, `src/lib/documentThemes.js`)
  with real structural variety (three layout modes, a connected-timeline
  experience variant, and a progress-bar skills variant — see the comments
  atop `documentThemes.js`) rather than 20 separate one-off implementations.
  Every color pairing was verified against WCAG contrast minimums, not
  eyeballed.
- Full auth: signup, login, forgot password, protected routes, per-user
  data isolation.
- Dashboard with real resume CRUD (create, rename, delete).
- Builder: all data-entry sections (including optional photo upload),
  live preview, template switching, autosave.
- AI features: resume summary generation, bullet improvement, skill
  suggestions, full resume review with an ATS score — via Gemini.
- Real PDF download + browser print.
- A real icon+wordmark logo (`src/components/ui/LogoMark.jsx`), applied
  consistently across the app and the browser tab favicon.
