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

*   **Frontend:** Cross-platform Mobile Framework (Flutter / React Native)
*   **Backend Database:** Google Cloud Firestore
*   **Local State Management:** High-performance reactive data streams

### Firestore Document Structure
```text
/users/{userId}/
  ├── profile (document) -> { currentWeight: 87, targetWeight: 73, currentPhase: 1, starBank: 0.0 }
  ├── daily_logs (collection) -> {date_YYYY-MM-DD} -> { waterMl: 4000, calories: 2100, proteinG: 160, morningCrucibleCompleted: true, fastingWindowMet: true, nicotineSlips: 0, mentalHealthScore: 8, journalText: "" }
  ├── workout_logs (collection) -> {logId} -> { date: Timestamp, type: "calisthenics"|"running", distanceKm: 3.0, calisthenicsReps: {}, rirTarget: 3, physicalNotes: "" }
  ├── trading_logs (collection) -> {tradeId} -> { date: Timestamp, pair: "EURUSD", positionType: "buy", resultPips: 40, marketAnalysis: "" }
```

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
