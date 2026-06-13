# Bolão Swipe — Copa do Mundo 2026

Two apps in one repo: a self-contained swipe-to-predict experience and a multi-user hosted bolão platform.

---

## Apps in this repo

### 1. `bolao-de-bico/` — Swipe Predictor (standalone)

A single-page app where you swipe cards to pick winners for all 72 group-stage matches and the full knockout bracket. Runs entirely in the browser with no backend.

**Features:**
- 12 groups × 6 matches — swipe left/right to pick winner, tap VS for draw
- Auto-generated scores based on FIFA ratings (realistic, weighted randomness)
- Editable scores — tap any score chip to adjust goals manually
- Full FIFA 2026 knockout bracket (Round of 32 → R16 → QF → SF → 3rd place → Final)
- Spider bracket preview before each knockout round
- Print-ready bracket chart (full-page layout, print from browser)
- Share modal — generates a text summary of your predictions to copy/paste
- JSON export (`</>` button) — exports your full prediction state
- Onboarding screens with interactive demos
- Champion reveal with confetti

**How to run:**

```bash
cd bolao-de-bico
npm install
npm run dev
```

Open `http://localhost:5173`

> The `worldcup2026.jsx` file in this folder is the English version of the same app. Drop it into any Vite React project or paste it into the Claude.ai artifact renderer to run it standalone.

---

### 2. Root — Multi-user Bolão Platform (Next.js)

A hosted platform where multiple participants each submit their own score predictions and compete. Predictions are locked after the deadline; after that, everyone can see each other's picks.

**Features:**
- User registration and login with email/password
- Email verification and password reset
- Score prediction submission for all 72 group-stage matches
- Deadline enforcement (June 6, 2026) — editing disabled after deadline
- After deadline: all predictions visible to all users
- Dashboard with live stats (total users, predictions completed)
- Group standings and qualification calculation
- Knockout bracket generation (R16, QF, SF, Final)
- Countdown timer to deadline

**How to run:**

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`

**Environment variables needed:**

```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-random-secret
# Email (optional for local dev, required for production):
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## How the two apps relate

The swipe app (`bolao-de-bico/`) is used to **generate your predictions** — you swipe through all the matches and it simulates the scores. Once done, you can:

- Print your bracket chart
- Copy a text summary via the **Share** button to paste into external bolão apps (such as [Bolão do Copão](https://bolaodocopao.base44.app/))
- Export a JSON file for record-keeping or integration

The multi-user Next.js app is for **hosting a bolão** where friends each submit their own independent predictions.

---

## Tech stack

| App | Framework | Styling | Backend |
|-----|-----------|---------|---------|
| `bolao-de-bico/` | React 18 + Vite | CSS-in-JS (inline) | None |
| Root (Next.js) | Next.js 14 + TypeScript | Tailwind CSS | Prisma + SQLite + JWT |

---

## Project structure

```
bolao-swipe-2026/
├── bolao-de-bico/        ← Standalone Vite swipe app (Portuguese)
│   ├── src/App.jsx       ← Entire app in one file
│   └── worldcup2026.jsx  ← English version (single-file, Claude.ai compatible)
├── app/                  ← Next.js pages and API routes
├── components/           ← Shared React components
├── lib/                  ← Auth, DB, email, utilities
├── prisma/               ← Database schema and seed data
└── middleware.ts         ← JWT auth middleware
```

---

*Built for family fun — no monetary prizes, no gambling mechanics.*
