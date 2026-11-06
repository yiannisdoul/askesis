import {
  doc,
  getDoc,
  runTransaction,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import { EMPTY_DAILY_LOG, type DailyLog, type UserProfile } from '../models/types';
import { clampStars, todayKey } from '../utils/dates';
import {
  DEFAULT_USER_ID,
  getFirestoreDb,
  isFirebaseConfigured,
  userPaths,
} from './firebase';
import { localStore } from './localStore';

export class InsufficientStarsError extends Error {
  constructor(required: number, available: number) {
    super(`Need ${required} stars, have ${available}.`);
    this.name = 'InsufficientStarsError';
  }
}

async function ensureRemoteProfile(
  db: Firestore,
  userId: string,
): Promise<UserProfile> {
  const paths = userPaths(userId);
  const profileRef = doc(db, paths.profile);
  const snap = await getDoc(profileRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  const seed = await localStore.getProfile();
  await setDoc(profileRef, seed);
  return seed;
}

async function ensureRemoteDaily(
  db: Firestore,
  userId: string,
  date: string,
): Promise<DailyLog> {
  const paths = userPaths(userId);
  const dailyRef = doc(db, paths.dailyLogs, date);
  const snap = await getDoc(dailyRef);
  if (snap.exists()) {
    return snap.data() as DailyLog;
  }
  await setDoc(dailyRef, EMPTY_DAILY_LOG);
  return { ...EMPTY_DAILY_LOG };
}

export const starLedger = {
  async load(userId = DEFAULT_USER_ID): Promise<{
    profile: UserProfile;
    daily: DailyLog;
    date: string;
  }> {
    const date = todayKey();

    if (!isFirebaseConfigured) {
      const [profile, daily] = await Promise.all([
        localStore.getProfile(),
        localStore.getDailyLog(date),
      ]);
      return { profile, daily, date };
    }

    const db = getFirestoreDb();
    const [profile, daily] = await Promise.all([
      ensureRemoteProfile(db, userId),
      ensureRemoteDaily(db, userId, date),
    ]);
    return { profile, daily, date };
  },

  /**
   * Apply a star delta with bankruptcy protection (floor at 0).
   * Uses a Firestore transaction when configured; otherwise AsyncStorage.
   */
  async applyDelta(options: {
    userId?: string;
    delta: number;
    taskId?: string;
    complete?: boolean;
    reason: 'earn' | 'penalty' | 'redeem';
  }): Promise<{ starBank: number; daily: DailyLog }> {
    const userId = options.userId ?? DEFAULT_USER_ID;
    const date = todayKey();

    if (!isFirebaseConfigured) {
      const profile = await localStore.getProfile();
      const daily = await localStore.getDailyLog(date);
      const nextBank = clampStars(profile.starBank + options.delta);

      if (options.reason === 'redeem' && options.delta < 0) {
        if (profile.starBank < Math.abs(options.delta)) {
          throw new InsufficientStarsError(Math.abs(options.delta), profile.starBank);
        }
      }

      const nextDaily: DailyLog = { ...daily };
      if (options.delta > 0) {
        nextDaily.starsEarnedToday = clampStars(
          nextDaily.starsEarnedToday + options.delta,
        );
      } else if (options.delta < 0 && options.reason !== 'redeem') {
        nextDaily.starsDeductToday = clampStars(
          nextDaily.starsDeductToday + Math.abs(options.delta),
        );
      }

      if (options.taskId) {
        const set = new Set(nextDaily.completedTaskIds);
        if (options.complete) {
          set.add(options.taskId);
          if (options.taskId === 'morning_crucible') {
            nextDaily.morningCrucibleCompleted = true;
          }
          if (options.taskId === 'fasting_window') {
            nextDaily.fastingWindowMet = true;
          }
        } else {
          set.delete(options.taskId);
          if (options.taskId === 'morning_crucible') {
            nextDaily.morningCrucibleCompleted = false;
          }
          if (options.taskId === 'fasting_window') {
            nextDaily.fastingWindowMet = false;
          }
        }
        nextDaily.completedTaskIds = Array.from(set);
      }

      const nextProfile = { ...profile, starBank: nextBank };
      await Promise.all([
        localStore.saveProfile(nextProfile),
        localStore.saveDailyLog(date, nextDaily),
      ]);
      return { starBank: nextBank, daily: nextDaily };
    }

    const db = getFirestoreDb();
    const paths = userPaths(userId);
    const profileRef = doc(db, paths.profile);
    const dailyRef = doc(db, paths.dailyLogs, date);

    return runTransaction(db, async (tx) => {
      const [profileSnap, dailySnap] = await Promise.all([
        tx.get(profileRef),
        tx.get(dailyRef),
      ]);

      const profile = (
        profileSnap.exists() ? profileSnap.data() : await localStore.getProfile()
      ) as UserProfile;
      const daily = (
        dailySnap.exists() ? dailySnap.data() : { ...EMPTY_DAILY_LOG }
      ) as DailyLog;

      if (options.reason === 'redeem' && options.delta < 0) {
        if (profile.starBank < Math.abs(options.delta)) {
          throw new InsufficientStarsError(
            Math.abs(options.delta),
            profile.starBank,
          );
        }
      }

      const nextBank = clampStars(profile.starBank + options.delta);
      const nextDaily: DailyLog = { ...daily };

      if (options.delta > 0) {
        nextDaily.starsEarnedToday = clampStars(
          nextDaily.starsEarnedToday + options.delta,
        );
      } else if (options.delta < 0 && options.reason !== 'redeem') {
        nextDaily.starsDeductToday = clampStars(
          nextDaily.starsDeductToday + Math.abs(options.delta),
        );
      }

      if (options.taskId) {
        const set = new Set(nextDaily.completedTaskIds ?? []);
        if (options.complete) {
          set.add(options.taskId);
          if (options.taskId === 'morning_crucible') {
            nextDaily.morningCrucibleCompleted = true;
          }
          if (options.taskId === 'fasting_window') {
            nextDaily.fastingWindowMet = true;
          }
        } else {
          set.delete(options.taskId);
          if (options.taskId === 'morning_crucible') {
            nextDaily.morningCrucibleCompleted = false;
          }
          if (options.taskId === 'fasting_window') {
            nextDaily.fastingWindowMet = false;
          }
        }
        nextDaily.completedTaskIds = Array.from(set);
      }

      tx.set(profileRef, { ...profile, starBank: nextBank }, { merge: true });
      tx.set(dailyRef, nextDaily, { merge: true });
      return { starBank: nextBank, daily: nextDaily };
    });
  },

  async redeem(cost: number, userId = DEFAULT_USER_ID) {
    return this.applyDelta({
      userId,
      delta: -Math.abs(cost),
      reason: 'redeem',
    });
  },
};
