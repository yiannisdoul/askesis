import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import type { DailyLog, TradingLog, WorkoutLog } from '../models/types';
import { todayKey } from '../utils/dates';
import {
  DEFAULT_USER_ID,
  getFirestoreDb,
  isFirebaseConfigured,
  userPaths,
} from './firebase';
import { localStore } from './localStore';

export const journalService = {
  async saveDailyMetrics(
    partial: Partial<DailyLog>,
    userId = DEFAULT_USER_ID,
  ): Promise<DailyLog> {
    const date = todayKey();

    if (!isFirebaseConfigured) {
      const current = await localStore.getDailyLog(date);
      const next = { ...current, ...partial };
      await localStore.saveDailyLog(date, next);
      return next;
    }

    const db = getFirestoreDb();
    const paths = userPaths(userId);
    const ref = doc(db, paths.dailyLogs, date);
    const snap = await getDoc(ref);
    const current = (snap.exists() ? snap.data() : {}) as DailyLog;
    const next = { ...current, ...partial };
    await setDoc(ref, next, { merge: true });
    return next;
  },

  async saveWorkout(
    log: Omit<WorkoutLog, 'id'>,
    userId = DEFAULT_USER_ID,
  ): Promise<WorkoutLog> {
    if (!isFirebaseConfigured) {
      return localStore.addWorkout(log);
    }

    const db = getFirestoreDb();
    const paths = userPaths(userId);
    const payload = {
      ...log,
      date: Timestamp.fromDate(new Date(log.date)),
    };
    const ref = await addDoc(collection(db, paths.workoutLogs), payload);
    return { ...log, id: ref.id };
  },

  async saveTrade(
    log: Omit<TradingLog, 'id'>,
    userId = DEFAULT_USER_ID,
  ): Promise<TradingLog> {
    if (!isFirebaseConfigured) {
      return localStore.addTrade(log);
    }

    const db = getFirestoreDb();
    const paths = userPaths(userId);
    const payload = {
      ...log,
      date: Timestamp.fromDate(new Date(log.date)),
      marketAnalysis: log.analysis,
    };
    const ref = await addDoc(collection(db, paths.tradingLogs), payload);
    return { ...log, id: ref.id };
  },
};
