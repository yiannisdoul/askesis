import { create } from 'zustand';
import type {
  DailyLog,
  TradePosition,
  TradeSession,
  WorkoutType,
} from '../models/types';
import { journalService } from '../services/journalService';
import { todayKey } from '../utils/dates';
import { localStore } from '../services/localStore';
import { EMPTY_DAILY_LOG } from '../models/types';

interface JournalFormState {
  waterIntakeMl: number;
  totalCalories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  journalText: string;
  mentalHealthScore: number;
  workoutType: WorkoutType;
  distanceKm: string;
  durationMin: string;
  paceMinKm: string;
  pushups: string;
  rows: string;
  squats: string;
  rirTarget: number;
  physicalNotes: string;
  session: TradeSession;
  pair: string;
  positionType: TradePosition;
  entryPrice: string;
  exitPrice: string;
  resultPips: string;
  analysis: string;
  saving: boolean;
  message: string | null;
  error: string | null;
  hydrate: () => Promise<void>;
  setField: <K extends keyof JournalFormState>(
    key: K,
    value: JournalFormState[K],
  ) => void;
  saveDaily: () => Promise<void>;
  saveWorkout: () => Promise<void>;
  saveTrade: () => Promise<void>;
}

function parseList(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export const useJournalStore = create<JournalFormState>((set, get) => ({
  waterIntakeMl: 0,
  totalCalories: 2100,
  proteinG: 160,
  carbsG: 200,
  fatsG: 73,
  journalText: '',
  mentalHealthScore: 5,
  workoutType: 'calisthenics',
  distanceKm: '3.0',
  durationMin: '30',
  paceMinKm: '7:12',
  pushups: '10,10,9',
  rows: '8,8,8',
  squats: '12,12,12',
  rirTarget: 3,
  physicalNotes: '',
  session: 'morning',
  pair: 'EURUSD',
  positionType: 'buy',
  entryPrice: '1.0850',
  exitPrice: '1.0890',
  resultPips: '40',
  analysis: '',
  saving: false,
  message: null,
  error: null,

  setField: (key, value) => set({ [key]: value } as Partial<JournalFormState>),

  hydrate: async () => {
    const daily = await localStore.getDailyLog(todayKey());
    set({
      waterIntakeMl: daily.waterIntakeMl || 0,
      totalCalories: daily.totalCalories || 2100,
      proteinG: daily.proteinG || 160,
      carbsG: daily.carbsG || 200,
      fatsG: daily.fatsG || 73,
      journalText: daily.journalText || '',
      mentalHealthScore: daily.mentalHealthScore || 5,
    });
  },

  saveDaily: async () => {
    const state = get();
    set({ saving: true, error: null, message: null });
    try {
      const payload: Partial<DailyLog> = {
        waterIntakeMl: state.waterIntakeMl,
        totalCalories: state.totalCalories,
        proteinG: state.proteinG,
        carbsG: state.carbsG,
        fatsG: state.fatsG,
        journalText: state.journalText,
        mentalHealthScore: state.mentalHealthScore,
      };
      await journalService.saveDailyMetrics(payload);
      set({ saving: false, message: 'Daily log saved to daily_logs.' });
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : 'Daily save failed',
      });
    }
  },

  saveWorkout: async () => {
    const state = get();
    set({ saving: true, error: null, message: null });
    try {
      await journalService.saveWorkout({
        date: new Date().toISOString(),
        type: state.workoutType,
        distanceKm: Number(state.distanceKm) || 0,
        durationMin: Number(state.durationMin) || 0,
        paceMinKm: state.paceMinKm,
        calisthenicsReps: {
          pushups: parseList(state.pushups),
          rows: parseList(state.rows),
          squats: parseList(state.squats),
        },
        rirTarget: state.rirTarget,
        physicalNotes: state.physicalNotes,
      });
      set({
        saving: false,
        message: 'Workout saved to workout_logs.',
        physicalNotes: '',
      });
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : 'Workout save failed',
      });
    }
  },

  saveTrade: async () => {
    const state = get();
    set({ saving: true, error: null, message: null });
    try {
      await journalService.saveTrade({
        date: new Date().toISOString(),
        session: state.session,
        pair: state.pair.toUpperCase(),
        positionType: state.positionType,
        entryPrice: Number(state.entryPrice) || 0,
        exitPrice: Number(state.exitPrice) || 0,
        resultPips: Number(state.resultPips) || 0,
        analysis: state.analysis,
      });
      set({
        saving: false,
        message: 'Trade saved to trading_logs.',
        analysis: '',
      });
    } catch (error) {
      set({
        saving: false,
        error: error instanceof Error ? error.message : 'Trade save failed',
      });
    }
  },
}));

// Keep EMPTY_DAILY_LOG referenced for type stability in hydrate defaults.
void EMPTY_DAILY_LOG;
