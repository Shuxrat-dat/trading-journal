# Trading Journal

A personal trading journal built with **Next.js 14, TypeScript, Prisma, SQLite, and Recharts**.

The project is designed to help traders record their trades, review their decisions, and analyze performance over time. The UI is inspired by the dark aesthetic of TradingView.

## Features

* 📋 **Trade logging** - instrument, direction, entry/exit, risk, P/L and R/R
* 📸 **Screenshots** - attach entry, exit and setup screenshots to trades
* 🧠 **Trading psychology** - emotions, entry reasons, mistakes and lessons
* 📊 **Statistics** - win rate, profit factor, equity curve and max drawdown
* 🌑 **Dark UI** - TradingView-inspired interface
* 💾 **SQLite + Prisma** — simple local database with no external services

## Tech Stack

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* Prisma + SQLite
* Recharts
* Lucide React

## Getting Started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000` in your browser.

### Quick Setup

```bash
npm run setup
npm run dev
```

## Project Structure

```text
src/
├── app/           # Pages and API routes
├── components/    # UI components
├── lib/           # Prisma client
└── types/         # TypeScript types

prisma/            # Database schema and SQLite DB
public/uploads/    # Uploaded trade screenshots
```

## Data

The application stores data locally:

* `prisma/dev.db` — SQLite database
* `public/uploads/` — trade screenshots

For production use, SQLite can be replaced with PostgreSQL.

## Purpose

Built as a personal project to make trade journaling, performance analysis, and post-trade review easier.
