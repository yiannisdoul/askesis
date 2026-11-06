# ⚔️ Askesis (Ασκηση)

**Askesis** is a high-contrast, gamified ascetic discipline and physical reconstruction companion application. Designed to bridge the gap between prolonged sedentary deconditioning and peak athletic performance, it optimizes daily habits across spiritual, mental, and physical frameworks.

Built explicitly for high-performance routines using an intentional dark theme (`Deep Slate Background #121824`) paired with energetic, dopaminergic feedback visual styling (`Electric Amber #FFBF00`, `Vibrant Cyan #00E5FF`, and `Neon Emerald #00E676`).

---

## 🚀 Core Pillars

*   **The Star Ledger System:** A loss-aversion behavioral framework. Daily morning execution and fasting consistency earn *Stars* used to redeem guilt-free leisure blocks (gaming, movies). Delinquencies trigger asymmetric penalties at exactly half the gain rate.
*   **The Morning Crucible:** Structured timeline integration grouping dynamic prayer, low-impact running intervals, bodyweight calisthenics, and active recovery dog-walking routines before an 8:00 AM fast-break.
*   **19-5 Intermittent Fasting Guard:** Strict nutrient-partitioning ledger supporting a phased caloric step-down from 87kg to 72-74kg, fully compatible with traditional Orthodox Wednesday/Friday vegan fasting periods.
*   **Tomodachi Retro Study Timer:** Fully customizable focus/break interval block matrix designed to optimize deep software engineering and Forex trade monitoring sessions.
*   **Unified Analysis Journal:** Tri-convergent tracking engine analyzing physical performance (sets/reps/running metrics), daily Forex trading positions, and a 1-10 psychological dopamine/mental health baseline index.
*   **Dual-Filtered Media Aggregator:** A focused multimedia screen sourcing performance-mindset mastery videos alongside theological homilies from Orthodox monastic fathers.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend:** Expo (React Native) + Expo Router
*   **Backend Database:** Google Cloud Firestore (with AsyncStorage local demo fallback)
*   **Local State Management:** Zustand reactive stores

### App modules (`ui` branch)

| Tab | Module | Path |
| --- | --- | --- |
| Stars | Star Bank, daily tasks, penalties, rewards shop | `app/(tabs)/index.tsx` |
| Timer | Tomodachi pixel focus/break timer | `app/(tabs)/timer.tsx` |
| Journal | Daily / workout / trading logs + MH gauge | `app/(tabs)/journal.tsx` |
| Media | Mindset Mastery / Orthodox Omilies feeds | `app/(tabs)/media.tsx` |

### Firestore Document Structure
```text
/users/{userId}/
  ├── profile/main -> { currentWeight, targetWeight, currentPhase, waterTargetMl, starBank }
  ├── daily_logs/{YYYY-MM-DD} -> hydration, macros, task flags, stars, mentalHealthScore, journalText
  ├── workout_logs/{logId} -> running + calisthenics sets/reps, RIR, physicalNotes
  ├── trading_logs/{tradeId} -> pair, entry/exit, pips, analysis
```

Star mutations and reward redemptions run through Firestore transactions when Firebase env vars are set (`src/services/starLedger.ts`). Without config, the same API writes to AsyncStorage so the UI remains fully interactive.

---

## ▶️ Run locally

```bash
git checkout ui
npm install
cp .env.example .env   # optional Firebase web config
npm run dev            # Expo Metro bundler (alias of start)
npm run android        # Metro + open Android emulator/device
npm run ios            # Metro + open iOS simulator (macOS)
npm run web            # portrait phone-canvas web preview
npm run typecheck
```

Amber status dot (top-right) = local demo mode. Emerald = Firestore configured.

---

## 🌿 Professional Git & Branching Protocol

To maintain absolute repository health and clean revision deployment, automated or machine-generated branch names are strictly banned. Feature assembly occurs exclusively within decoupled, human-readable structural branches.

### Development Workflow Checklist

1. **Stage Feature Branch:** Initialize generic feature sandbox out of `main`:
   ```bash
   git checkout -b [ui | database | timer | auth | media-player]
   ```
2. **Commit Incremental Changes:** Stage and log descriptive human commits:
   ```bash
   git add .
   git commit -m "feat([feature_context]): implemented clean interactive states"
   ```
3. **Isolate Verification:** Confirm system testing on your feature branch.
4. **Clean Main Consolidation:** Safely fast-forward stable revisions back into production:
   ```bash
   git checkout main
   git merge [ui | database | timer | auth | media-player]
   git push origin main
   ```
