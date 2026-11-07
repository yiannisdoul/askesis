import {
  doc,
  getDoc,
  runTransaction,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import {
  EMPTY_DAILY_LOG,
  type DailyLog,
  type LedgerSection,
  type ShopItem,
  type TaskStatus,
  type UserProfile,
} from '../models/types';
import {
  computeTaskTransitionDelta,
  findSectionForTask,
  normalizeDailyLog,
  normalizeProfile,
  syncLegacyFlags,
} from '../utils/economy';
import { roundStars, todayKey } from '../utils/dates';
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

export class ShopLockedError extends Error {
  readonly unlockTarget: number;

  constructor(balance: number, unlockTarget: number) {
    super(
      `Shop locked. Earn ${unlockTarget} Stars to clear debt + 50% fine.`,
    );
    this.name = 'ShopLockedError';
    this.unlockTarget = unlockTarget;
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
    return normalizeProfile(snap.data() as UserProfile);
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
    return normalizeDailyLog(snap.data() as DailyLog);
  }
  await setDoc(dailyRef, EMPTY_DAILY_LOG);
  return { ...EMPTY_DAILY_LOG };
}

function applyBankDelta(
  daily: DailyLog,
  delta: number,
  reason: 'earn' | 'penalty' | 'redeem' | 'task',
): { daily: DailyLog; nextBankDelta: number } {
  const nextDaily: DailyLog = { ...daily };
  const nextBankDelta = roundStars(delta);

  if (nextBankDelta > 0) {
    nextDaily.starsEarnedToday = roundStars(
      nextDaily.starsEarnedToday + nextBankDelta,
    );
  } else if (nextBankDelta < 0 && reason !== 'redeem') {
    nextDaily.starsDeductToday = roundStars(
      nextDaily.starsDeductToday + Math.abs(nextBankDelta),
    );
  }

  return { daily: nextDaily, nextBankDelta };
}

function applyTaskStatusToDaily(
  daily: DailyLog,
  taskId: string,
  status: TaskStatus,
  criticalMissSectionIds: string[],
): DailyLog {
  const taskStatuses = { ...(daily.taskStatuses ?? {}), [taskId]: status };
  const completed = new Set(daily.completedTaskIds ?? []);
  if (status === 'completed') {
    completed.add(taskId);
  } else {
    completed.delete(taskId);
  }

  const next: DailyLog = {
    ...daily,
    taskStatuses,
    completedTaskIds: Array.from(completed),
    criticalMissSectionIds,
  };
  syncLegacyFlags(next, taskId, status);
  return next;
}

type PersistResult = { profile: UserProfile; daily: DailyLog };

async function persistLocal(
  date: string,
  profile: UserProfile,
  daily: DailyLog,
): Promise<PersistResult> {
  await Promise.all([
    localStore.saveProfile(profile),
    localStore.saveDailyLog(date, daily),
  ]);
  return { profile, daily };
}

async function withProfileDaily(
  userId: string,
  mutator: (profile: UserProfile, daily: DailyLog) => PersistResult,
): Promise<PersistResult> {
  const date = todayKey();

  if (!isFirebaseConfigured) {
    const profile = await localStore.getProfile();
    const daily = await localStore.getDailyLog(date);
    const result = mutator(profile, daily);
    return persistLocal(date, result.profile, result.daily);
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

    const profile = normalizeProfile(
      (profileSnap.exists()
        ? profileSnap.data()
        : await localStore.getProfile()) as UserProfile,
    );
    const daily = normalizeDailyLog(
      (dailySnap.exists()
        ? dailySnap.data()
        : { ...EMPTY_DAILY_LOG }) as DailyLog,
    );

    const result = mutator(profile, daily);
    tx.set(profileRef, result.profile, { merge: true });
    tx.set(dailyRef, result.daily, { merge: true });
    return result;
  });
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
   * Apply a raw star delta. Balance may go negative — no floor at 0.
   */
  async applyDelta(options: {
    userId?: string;
    delta: number;
    reason: 'earn' | 'penalty' | 'redeem';
  }): Promise<PersistResult> {
    const userId = options.userId ?? DEFAULT_USER_ID;

    return withProfileDaily(userId, (profile, daily) => {
      if (options.reason === 'redeem' && options.delta < 0) {
        if (profile.starBank < 0) {
          const target = Math.ceil(Math.abs(profile.starBank) * 1.5);
          throw new ShopLockedError(profile.starBank, target);
        }
        if (profile.starBank < Math.abs(options.delta)) {
          throw new InsufficientStarsError(
            Math.abs(options.delta),
            profile.starBank,
          );
        }
      }

      const { daily: nextDaily, nextBankDelta } = applyBankDelta(
        daily,
        options.delta,
        options.reason,
      );
      const nextBank = roundStars(profile.starBank + nextBankDelta);
      return {
        profile: { ...profile, starBank: nextBank },
        daily: nextDaily,
      };
    });
  },

  async setTaskStatus(options: {
    userId?: string;
    taskId: string;
    status: TaskStatus;
  }): Promise<PersistResult> {
    const userId = options.userId ?? DEFAULT_USER_ID;

    return withProfileDaily(userId, (profile, daily) => {
      const section = findSectionForTask(profile.sections, options.taskId);
      if (!section) {
        throw new Error(`Task not found: ${options.taskId}`);
      }

      const { delta, nextCriticalMissIds } = computeTaskTransitionDelta({
        section,
        daily,
        taskId: options.taskId,
        nextStatus: options.status,
      });

      let nextDaily = applyTaskStatusToDaily(
        daily,
        options.taskId,
        options.status,
        nextCriticalMissIds,
      );

      const applied = applyBankDelta(nextDaily, delta, 'task');
      nextDaily = applied.daily;
      const nextBank = roundStars(profile.starBank + applied.nextBankDelta);

      return {
        profile: { ...profile, starBank: nextBank },
        daily: nextDaily,
      };
    });
  },

  async saveSections(
    sections: LedgerSection[],
    userId = DEFAULT_USER_ID,
  ): Promise<PersistResult> {
    return withProfileDaily(userId, (profile, daily) => ({
      profile: { ...profile, sections },
      daily,
    }));
  },

  async saveShopItems(
    shopItems: ShopItem[],
    userId = DEFAULT_USER_ID,
  ): Promise<PersistResult> {
    return withProfileDaily(userId, (profile, daily) => ({
      profile: { ...profile, shopItems },
      daily,
    }));
  },

  async redeem(cost: number, userId = DEFAULT_USER_ID) {
    return this.applyDelta({
      userId,
      delta: -Math.abs(cost),
      reason: 'redeem',
    });
  },
};
