# Shiftly

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-000020?logo=expo)](https://docs.expo.dev/versions/v54.0.0/)

**A calendar built for people who work rotating day and night shifts.**

Shiftly tracks your shift schedule and your everyday plans in one place. Mark each day as a shift — Day, Night, Off, Leave, or any custom label you create — attach regular calendar events to any date, and set up repeating shift patterns that fill in weeks or months in a single tap instead of setting every day by hand.

All data stays on your device: there's no account, no server, and nothing is ever uploaded anywhere.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database](#database)
- [Testing](#testing)
- [License](#license)

## Features

- 📅 **Full month calendar** — every day shows its shift and events at a glance, with a running count of shifts per type for the month
- 🎨 **Custom shift types** — start with Day / Night / Off / Leave, or create your own with any name and color
- 📝 **Everyday events** — appointments, reminders, anything with an optional time and notes; Shiftly doubles as a regular calendar
- 🔁 **Repeating patterns** — define a shift cycle once (e.g. _2 days, 2 nights, 4 off_) and stamp it onto any date range
- 🗓️ **Jump to any month** — tap the month title to pick a month and year instead of paging one month at a time
- 🧹 **Flexible clearing** — clear a single month, a custom date range, or everything at once
- 💾 **Backup & restore** — export everything to a JSON file and restore it later, or on another device
- 🌓 **Light & dark mode** — follows your system setting, with a manual override
- 🔒 **Fully private** — everything is stored locally on your device

## Getting Started

Want to run Shiftly from source — to develop, debug, or just try it before it's on your device? Use [Expo Go](https://expo.dev/go):

1. Install [Node.js](https://nodejs.org/) 20+ and the **Expo Go** app on your phone.
2. Install dependencies from the project root:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with Expo Go, or press `i` / `a` in the terminal to launch an iOS/Android simulator.

## Tech Stack

- [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/) — React Native with file-based navigation
- [Drizzle ORM](https://orm.drizzle.team/) over [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — local, reactive storage
- `expo-file-system` + `expo-sharing` + `expo-document-picker` — JSON backup export/import
- TypeScript, ESLint, and Prettier, with Jest for tests and GitHub Actions for CI

## Project Structure

```
shiftly/
├── app/                       # Expo Router routes — thin screens that render src/features components
│   ├── _layout.tsx            # Root layout: DB migration gate, theme
│   ├── (tabs)/                 # Calendar / Patterns / Settings tab navigator
│   ├── day/[date].tsx         # Day detail: shift picker + events for one date
│   ├── pattern/               # Create a pattern, apply/edit a pattern on a date range
│   ├── shift-types.tsx        # Manage shift types
│   ├── shift-type/            # Create/edit a shift type
│   └── clear-calendar.tsx     # Bulk-clear shifts + events over a date range
├── src/
│   ├── db/                    # Drizzle schema, client, generated migrations (schema + seed data)
│   ├── features/              # Feature-first domain code
│   │   ├── calendar/          # Month calendar UI, month/year picker, day marking logic
│   │   ├── shifts/            # Shift picker, shift CRUD, clear-calendar range
│   │   ├── shiftTypes/        # User-managed shift type CRUD, color palette
│   │   ├── events/            # Event form, event CRUD
│   │   ├── patterns/          # Pattern sequence editor + generatePatternShifts (pure, tested)
│   │   ├── backup/            # Export/import everything to/from a JSON file
│   │   └── settings/          # Theme selector
│   ├── theme/                  # Color tokens, spacing, ThemeProvider (light/dark, persisted override)
│   ├── components/             # Cross-feature UI primitives, grouped by purpose
│   │   ├── ui/                 # Screen, Button, EmptyState, SectionHeader, FieldLabel
│   │   ├── pickers/            # DateRangePicker, DateRangeModeSelector, ColorSwatchPicker, TimeField
│   │   └── system/             # MigrationErrorScreen, SplashLoadingScreen (app bootstrap states)
│   └── types/                   # Ambient type declarations
├── drizzle.config.ts           # drizzle-kit config (SQLite, Expo driver)
└── .github/workflows/ci.yml    # Lint, typecheck, and test on every push/PR
```

Each screen in `app/` stays intentionally thin — it wires up a route and delegates all real UI and logic to `src/features/**`, keeping navigation concerns separate from feature code.

## Database

Shiftly stores everything locally in SQLite via [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/) and [Drizzle ORM](https://orm.drizzle.team/), with reactive queries (`useLiveQuery`) so the UI updates automatically whenever data changes.

Applying a pattern is a one-time generation, not a live recurring rule: [`generatePatternShifts`](./src/features/patterns/generatePatternShifts.ts) is a pure function that expands a sequence over a date range, and the result is upserted into the `shifts` table. If a pattern is later deleted, the shifts it generated are left in place by design — use the clear tools on the Calendar tab or in Settings to remove them in bulk if needed.

Shift types are seeded with four defaults (Day, Night, Off, Leave) the first time the app runs, then behave like any other user data — editable and deletable from **Settings → Manage shift types**, except a type currently in use by a day or a pattern can't be deleted until it's no longer referenced.

If you change [`src/db/schema.ts`](./src/db/schema.ts), regenerate migrations and commit the result (migrations are checked-in build artifacts, bundled into the app at build time):

```bash
npm run db:generate
```

Inspect the local database during development with [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview):

```bash
npm run db:studio
```

## Testing

```bash
npm test
```

The highest-value coverage is on [`generatePatternShifts`](./src/features/patterns/generatePatternShifts.test.ts), the pure function responsible for expanding a pattern into concrete shifts.

## License

MIT © 2026 Devroic — see [LICENSE](./LICENSE).
