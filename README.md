# Trading Journal

A professional trading journal built with Next.js 14, TypeScript, Tailwind CSS, Prisma (SQLite), and Recharts. Inspired by TradingView's dark UI aesthetic.

## Features

- 📋 **Full trade logging** — date, time, instrument, direction, prices, risk, P/L, R/R
- 📸 **Screenshot uploads** — entry, exit, and additional screenshots stored locally
- 🧠 **Psychology tracking** — emotions, entry reasons, mistakes, lessons
- 📊 **Statistics** — win rate, profit factor, equity curve, max drawdown, monthly breakdown
- 🌑 **Dark theme** — TradingView-inspired design with green/red color coding
- 💾 **Local SQLite DB** via Prisma — no external services needed

## Setup

### 1. Install dependencies
```bash
cd trading-journal
npm install
```

### 2. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 3. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## One-command setup
```bash
npm run setup && npm run dev
```

---

## Project Structure

```
trading-journal/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── dev.db              # SQLite database (auto-created)
├── public/
│   └── uploads/            # Uploaded screenshots stored here
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── trades/     # GET all / POST new
│   │   │   │   └── [id]/   # GET / PUT / DELETE by ID
│   │   │   └── upload/     # POST file upload
│   │   ├── trades/
│   │   │   ├── new/        # Create new trade
│   │   │   └── [id]/       # Trade detail + edit + delete
│   │   ├── statistics/     # Stats dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx        # Journal home (trade list)
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── TradeCard.tsx
│   │   ├── TradeForm.tsx
│   │   ├── StatsCard.tsx
│   │   └── ImageUpload.tsx
│   ├── lib/
│   │   └── prisma.ts       # Prisma client singleton
│   └── types/
│       └── trade.ts        # TypeScript interfaces
├── .env                    # DATABASE_URL
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run setup` | Install + generate + push DB |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom TradingView-inspired tokens)
- **Prisma** + **SQLite** (zero-config local DB)
- **Recharts** (equity curve chart)
- **Lucide React** (icons)

## Notes

- Screenshots are saved in `public/uploads/` — back this up if needed
- The SQLite database is at `prisma/dev.db` — also worth backing up
- For production deployment, consider switching to PostgreSQL in `schema.prisma`
