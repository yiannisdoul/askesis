import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_PROFILE,
  EMPTY_DAILY_LOG,
  type DailyLog,
  type TradingLog,
  type UserProfile,
  type WorkoutLog,
} from '../models/types';
import { todayKey } from '../utils/dates';

const KEYS = {
  profile: '@askesis/profile',
  dailyPrefix: '@askesis/daily/',
  workouts: '@askesis/workouts',
  trades: '@askesis/trades',
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  async getProfile(): Promise<UserProfile> {
    return readJson(KEYS.profile, DEFAULT_PROFILE);
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await writeJson(KEYS.profile, profile);
  },

  async getDailyLog(date = todayKey()): Promise<DailyLog> {
    return readJson(`${KEYS.dailyPrefix}${date}`, {
      ...EMPTY_DAILY_LOG,
    });
  },

  async saveDailyLog(date: string, log: DailyLog): Promise<void> {
    await writeJson(`${KEYS.dailyPrefix}${date}`, log);
  },

  async listWorkouts(): Promise<WorkoutLog[]> {
    return readJson(KEYS.workouts, []);
  },

  async addWorkout(log: WorkoutLog): Promise<WorkoutLog> {
    const existing = await this.listWorkouts();
    const withId = { ...log, id: log.id ?? `wo_${Date.now()}` };
    await writeJson(KEYS.workouts, [withId, ...existing]);
    return withId;
  },

  async listTrades(): Promise<TradingLog[]> {
    return readJson(KEYS.trades, []);
  },

  async addTrade(log: TradingLog): Promise<TradingLog> {
    const existing = await this.listTrades();
    const withId = { ...log, id: log.id ?? `tr_${Date.now()}` };
    await writeJson(KEYS.trades, [withId, ...existing]);
    return withId;
  },
};
