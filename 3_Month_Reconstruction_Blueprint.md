# 3-MONTH RECONSTRUCTION BLUEPRINT & APP SPECIFICATION

This master document serves as your operational blueprint for the next 12 weeks and the complete technical specification for building your tracking application using Cursor and Firebase Firestore.

---

## SECTION 1: SYSTEM PARAMETERS & METRICS

### 💧 Hydration & Recovery
*   **Daily Target:** 3.5 to 4.0 Liters.
*   **The Golden Rule:** 500-700ml immediately upon waking at 4:00 AM before any activity.
*   **The Baseline Rule:** Nicotine gum narrows blood vessels; water keeps blood viscosity optimal.

### 📈 Progressive Periodization (12 Weeks)
*   **Phase 1 (Weeks 1-4): Structural Accumulation**
    *   **Weight Target:** 87 kg -> 83 kg
    *   **Calorie Target:** 2,100 kcal (160g P / 200g C / 73g F)
    *   **Running Vol:** 2.5 km - 3.5 km (3-min jog / 1-min walk interval at 7:00-7:30 min/km).
    *   **Calisthenics Int:** 3 sets per movement pattern at a strict 3 Reps in Reserve (3 RIR).
*   **Phase 2 (Weeks 5-8): Metabolic Engine**
    *   **Weight Target:** 83 kg -> 78 kg
    *   **Calorie Target:** 1,900 kcal (165g P / 160g C / 66g F)
    *   **Running Vol:** 4.0 km - 5.0 km (Transitioning to longer continuous blocks at 7:00 min/km).
    *   **Calisthenics Int:** Introduce progression variations (e.g., decline push-ups) at 2 RIR.
*   **Phase 3 (Weeks 9-12): Peak Consolidation**
    *   **Weight Target:** 78 kg -> 72-74 kg
    *   **Calorie Target:** 1,750 kcal (170g P / 130g C / 61g F)
    *   **Running Vol:** 5.0 km - 6.0 km (Continuous non-stop running at 6:30 min/km).
    *   **Calisthenics Int:** High-volume circuits pushed to 1 RIR on the final sets.

*Note on Fasting Days (Wednesdays/Fridays): Maintain identical calorie and protein targets using strict Orthodox vegan sources (lentils, chickpeas, split peas, plant protein powder) while dropping added fats to near zero.*

---

## SECTION 2: THE STAR BEHAVIORAL FRAMEWORK

### ⭐ Earning Metrics
*   `+1.0 Star`: Complete the Morning Crucible (Prayer + Workout + Dog Walk before 6:30 AM).
*   `+1.0 Star`: Keep to strict Intermittent Fasting feeding window (8:00 AM - 1:00 PM).
*   `+1.0 Star`: Complete both Deep Work Blocks (Coding + Trading) with zero nicotine slips.
*   `+1.0 Star`: Complete Evening Routine (Night Prayer + 8:00 PM Screen Blackout).
*   `+3.0 Stars`: Perfect execution of Wednesday or Friday Orthodox Vegan Fast.

### ❌ Penalty Metrics (Half-Rate Discipline Rules)
*   `-0.5 Stars`: Fail to complete the Morning Crucible before 6:30 AM.
*   `-0.5 Stars`: Slip outside the 8:00 AM - 1:00 PM feeding window.
*   `-1.0 Star`: Failure to execute the 8:00 PM screen blackout on standard nights.
*   `-1.0 Star`: Violating the Wednesday or Friday Orthodox Vegan Fast.
*   *Guardrail:* The Star Bank balance can never drop below zero (Bankruptcy Protection).

### 🛒 Reward Redemption Shop
*   `3 Stars`: Base Video Game Block (1.5 Hours).
*   `10 Stars`: Going Out / Movie Night Outing.
*   `15 Stars`: Saturday Premium Extended Gaming Block (4-5 Hours Stack).

---

## SECTION 3: FIREBASE FIRESTORE DATA MODELS

To code this instantly in Cursor, use the following schema structural constraints:

```
/users/{userId}/
  ├── profile (document)
  │     └── { currentWeight: 87, targetWeight: 73, currentPhase: 1, waterTargetMl: 4000, starBank: 12.5 }
  │
  ├── daily_logs (collection)
  │     └── {date_YYYY-MM-DD} (document)
  │           └── { waterIntakeMl: 3200, totalCalories: 2050, proteinG: 158, carbsG: 195, fatsG: 71,
  │                 morningCrucibleCompleted: true, fastingWindowMet: true, nicotineSlips: 0,
  │                 starsEarnedToday: 4.0, starsDeductToday: 0.5, journalText: "...", mentalHealthScore: 8 }
  │
  ├── workout_logs (collection)
  │     └── {logId} (document)
  │           └── { date: Timestamp, type: "calisthenics"|"running", distanceKm: 3.2, durationMin: 38,
  │                 paceMinKm: "7:12", calisthenicsReps: {pushups: [10, 10, 9], rows: [8, 8, 8]},
  │                 rirTarget: 3, notes: "Joints felt completely fresh in the Cloudmonsters." }
  │
  ├── trading_logs (collection)
  │     └── {tradeId} (document)
  │           └── { date: Timestamp, session: "morning"|"evening", pair: "EURUSD", positionType: "buy"|"sell",
  │                 entryPrice: 1.0850, exitPrice: 1.0890, resultPips: 40, analysis: "Aligned with H1 trend." }
```

---

## SECTION 4: ENERGETIC HIGH MENTAL HEALTH UI SCHEMA

To bypass the flat dopamine baseline, your UI must avoid drab layouts and use high-energy, vibrant colors modeled below:

*   **Primary Active Elements:** `Electric Amber (#FFBF00)` & `Vibrant Cyan (#00E5FF)` - for high-contrast visibility and immediate visual action.
*   **Background Base:** `Deep Slate Grey (#121824)` - protects eyes during 4:00 AM sessions, providing a sleek contrast against bright metrics.
*   **Success Accents:** `Neon Emerald (#00E676)` - for star updates, checkboxes, and calorie goal fill lines.
*   **Warning Accents:** `Crimson Pink (#FF1744)` - flashes vibrant feedback during star deductions or timeline overshoots.

---

## SECTION 5: MASTER CURSOR PROMPT SPECIFICATION

Paste the prompt below cleanly into your Cursor chat console to build the mobile app:

```text
Act as an expert Mobile Software Engineer specializing in Flutter/React Native and Firebase integration. Build a beautiful mobile application styled with high-contrast, positive mental-health colors (Deep Slate Background #121824, Electric Amber #FFBF00, Vibrant Cyan #00E5FF, and Neon Emerald #00E676). 

The app must link with Cloud Firestore using the schema provided below. Build out these four main modules:

1. THE STAR SYSTEM LEDGER & TASKS:
A home screen dashboard that shows the 'Star Bank Balance' vividly at the top. Display the 4 daily tasks as toggle checkboxes. When checked, add the star value to Firestore and run a confetti celebration animation. Implement the penalty triggers at half-rate value (-0.5 or -1.0 stars) as a 'Deduct Star' toggle option. The balance can never go below 0. Implement a 'Rewards Shop' button where clicking a 1.5-hour game block deducts 3 stars from the bank.

2. TOMODACHI RETRO STUDY TIMER:
An interactive productivity screen featuring a pixel-style retro countdown interface. Default execution parameters: 30 minutes focus block, 5 minutes break block. Include complete UI input forms allowing the user to dynamically modify the focus duration and break duration variables freely before running.

3. WORKOUT, TRADING & MENTAL HEALTH LOGGING JOURNAL:
A unified data logging form writing directly to the 'daily_logs', 'workout_logs', and 'trading_logs' collections. It must include fields for tracking structural injuries/how the user felt during training, an input chart layout for Forex currency pairings, pips gained/lost, and an operational notes box for chart alignment text. Include a 1-10 slider gauge evaluating 'Daily Mental Health and Dopamine Balance'.

4. SOURCE FILTERED YOUTUBE REFRESHER:
A media screen that programmatically queries and displays feeds from YouTube via a clean URL web view or API scraper. The feed must be dual-tabbed:
Tab A: 'Mindset Mastery' (Filtering top high-performance motivational video queries).
Tab B: 'Orthodox Omilies' (Filtering Greek Orthodox Monastic homilies, talks by Church Fathers, and theological lectures).

Generate the complete clean, boilerplate-free architecture with state management and Firestore transaction models included.
```
