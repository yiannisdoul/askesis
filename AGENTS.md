# Askesis — Agent Guide

**Askesis (Ασκηση)** is a high-contrast, gamified ascetic discipline and physical reconstruction companion. It tracks STAR behavioral economy, 19/5 intermittent fasting, calisthenics/running volume, Tomodachi deep-work timers, unified journaling (workout + Forex + mental health), and dual media feeds.

This file is the source of truth for Cursor agents working in this repository. Prefer code over outdated notes in `3_Month_Reconstruction_Blueprint.md` when they conflict (notably: negative star balances and shop lockout are intentional in live code).

---

## Tech stack (exact)

| Layer | Choice |
| --- | --- |
| Runtime / UI | **Expo SDK ~58** + **React Native 0.88** + **React 19** |
| Routing | **expo-router** (file-based; typed routes enabled) |
| Language | **TypeScript** (`strict: true`) |
| Local state | **Zustand** (`starStore`, `timerStore`, `journalStore`) |
| Persistence | **Firestore** when `EXPO_PUBLIC_FIREBASE_*` is set; else **AsyncStorage** demo mode |
| Styling | React Native **`StyleSheet`** + `src/theme` tokens (no NativeWind / Tailwind / Vue) |
| Fonts | Press Start 2P (display), DM Sans (body) |
| Motion / UX | `react-native-reanimated`, `expo-haptics`, `expo-linear-gradient`, `expo-blur` |

Entry point: `expo-router/entry` (`package.json` → `"main"`).

Path alias `@/*` → `src/*` is configured in `tsconfig.json` but **current source uses relative imports** from `app/` → `../../src/...`. Match the surrounding file.

---

## Architecture

```
app/                         # Expo Router screens (UI only)
  _layout.tsx                # Fonts, hydrate star store, MobileCanvas, Stack
  (tabs)/
    _layout.tsx              # Tabs + FloatingPillTabBar
    index.tsx                # Star Ledger (bank, sections, shop)
    timer.tsx                # Tomodachi focus / break timer
    journal.tsx              # Daily macros, workouts, trading, MH score
    media.tsx                # Mindset / Orthodox YouTube feeds

src/
  components/                # Shared UI primitives
  constants/                 # starFramework, mediaFeeds, layout metrics
  models/types.ts            # Domain types + DEFAULT_* seeds
  services/                  # firebase, starLedger, journalService, localStore
  stores/                    # Zustand stores
  theme/                     # colors, typography
  utils/                     # economy math, dates / star formatting
```

**Rules of the architecture**

1. Screens in `app/` compose components and call stores — they do not talk to AsyncStorage or Firestore directly.
2. All star mutations go through `src/services/starLedger.ts` (transactions when remote).
3. Journal writes go through `src/services/journalService.ts`.
4. Economy math lives in `src/utils/economy.ts` — never hardcode ±0.5 / ±1.0 for dynamic section tasks.
5. Theme tokens live in `src/theme` — no ad-hoc hex colors in new UI.
6. Dual persistence: check `isFirebaseConfigured` only inside services; UI stays mode-agnostic (amber = local, emerald = Firestore).

### Firestore shape

```text
/users/{userId}/
  profile/main              → UserProfile (starBank, sections[], shopItems[], phase, weight…)
  daily_logs/{YYYY-MM-DD}   → DailyLog (macros, taskStatuses, criticalMissSectionIds, stars…)
  workout_logs/{logId}      → WorkoutLog
  trading_logs/{tradeId}    → TradingLog
```

Default user id: `EXPO_PUBLIC_DEFAULT_USER_ID` or `local-ascetic`.

---

## Directory layout (reference)

```text
askesis/
├── AGENTS.md
├── .cursor/rules/           # Scoped Cursor rules (see below)
├── app/                     # Routes
├── src/                     # Domain, UI kit, services, stores
├── assets/                  # Icons / splash
├── app.json                 # Expo config (portrait, dark, newArch)
├── babel.config.js
├── tsconfig.json
├── package.json
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── README.md
└── 3_Month_Reconstruction_Blueprint.md
```

---

## Commands

```bash
npm install
cp .env.example .env          # optional — enables Firestore; omit for AsyncStorage demo

npm run dev                   # Expo Metro (alias of start)
npm run start
npm run android               # Metro + Android
npm run ios                   # Metro + iOS (macOS)
npm run web                   # Web preview (phone canvas ≤430px)

npm run typecheck             # tsc --noEmit
npm run lint                  # same as typecheck (no ESLint config yet)
```

There is no separate build/lint toolchain beyond TypeScript. Treat `npm run typecheck` as the quality gate before finishing a task.

---

## Cursor rules map

| File | Apply mode | Purpose |
| --- | --- | --- |
| `.cursor/rules/00-core-workflow.mdc` | `alwaysApply: true` | TypeScript discipline, no hallucinated deps, plan → approve → edit |
| `.cursor/rules/01-architect.mdc` | Manual `@01-architect` | Systems Architect persona (blueprints only) |
| `.cursor/rules/02-fitness-nutrition-domain.mdc` | Agent-requested | Fasting, macros, calisthenics, STAR economy domain |
| `.cursor/rules/03-frontend-standards.mdc` | Globs on UI files | Expo/RN StyleSheet + theme + PWA/mobile-first patterns |

---

## 3-phase human-in-the-loop workflow

Use this for any multi-file or cross-cutting feature. Single-line typo fixes may skip Phase 1.

### Phase 1 — Architect Blueprint

1. Invoke the Architect persona (`@01-architect`) or follow `01-architect.mdc`.
2. Produce a dependency-ordered checklist: data model deltas, services, stores, components, screens, and verification steps.
3. **Do not write implementation code** in this phase.
4. **Stop and wait for human approval** of the blueprint before any file edits.

### Phase 2 — Modular Execution

1. Implement one checklist item (or a tightly coupled pair) at a time.
2. Follow `00-core-workflow.mdc`: restate the mini-plan for the next slice if scope grew; reuse existing packages only.
3. Prefer extending `types.ts`, `economy.ts`, services, and theme tokens over inventing parallel systems.
4. Keep screens thin; put logic in stores/services/utils.

### Phase 3 — Self-Audit & QA

1. Re-read the diff against the approved blueprint.
2. Confirm dual persistence still works (no direct storage calls from UI).
3. Confirm economy helpers and theme tokens were used correctly.
4. Run `npm run typecheck`.
5. Summarize what changed, what was verified, and any residual risks.

---

## Domain quick reference

- **STAR ledger:** Dynamic sections split `sectionValue` across tasks; complete = full task value; slip = 50%; all-slip section = extra 50% critical miss. Negative balances lock the Rewards Shop until unlock target (`ceil(|balance| * 1.5)`) is cleared.
- **Morning Crucible / IF / Deep Work / Evening:** Seeded in `DEFAULT_SECTIONS` (`src/models/types.ts`).
- **19/5 fasting:** Feeding window 8:00 AM–1:00 PM (ledger task + daily flags); phased calorie step-down 87 → 72–74 kg (see domain rule + blueprint).
- **Tomodachi timer:** Ephemeral Zustand only; default 30 focus / 5 break.
- **Journal:** Water, macros, calisthenics/running logs (RIR), Forex sessions, mental health 1–10.
- **Media:** Curated YouTube clips in `src/constants/mediaFeeds.ts` (mindset + Orthodox).

When domain logic is involved, load `.cursor/rules/02-fitness-nutrition-domain.mdc`.
