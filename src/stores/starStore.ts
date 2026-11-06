import { create } from 'zustand';
import { DAILY_TASKS, PENALTIES, REWARDS } from '../constants/starFramework';
import {
  EMPTY_DAILY_LOG,
  DEFAULT_PROFILE,
  type DailyLog,
  type UserProfile,
} from '../models/types';
import { InsufficientStarsError, starLedger } from '../services/starLedger';

interface StarState {
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  profile: UserProfile;
  daily: DailyLog;
  showConfetti: boolean;
  adminPenaltiesOpen: boolean;
  shopOpen: boolean;
  hydrate: () => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  applyPenalty: (penaltyId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
  clearConfetti: () => void;
  setAdminPenaltiesOpen: (open: boolean) => void;
  setShopOpen: (open: boolean) => void;
}

export const useStarStore = create<StarState>((set, get) => ({
  hydrated: false,
  loading: false,
  error: null,
  profile: DEFAULT_PROFILE,
  daily: EMPTY_DAILY_LOG,
  showConfetti: false,
  adminPenaltiesOpen: false,
  shopOpen: false,

  clearConfetti: () => set({ showConfetti: false }),
  setAdminPenaltiesOpen: (open) => set({ adminPenaltiesOpen: open }),
  setShopOpen: (open) => set({ shopOpen: open }),

  hydrate: async () => {
    set({ loading: true, error: null });
    try {
      const { profile, daily } = await starLedger.load();
      set({ profile, daily, hydrated: true, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load ledger',
      });
    }
  },

  toggleTask: async (taskId) => {
    const task = DAILY_TASKS.find((item) => item.id === taskId);
    if (!task) return;

    const { daily } = get();
    const alreadyDone = daily.completedTaskIds.includes(taskId);
    const delta = alreadyDone ? -task.starValue : task.starValue;

    set({ loading: true, error: null });
    try {
      const result = await starLedger.applyDelta({
        delta,
        taskId,
        complete: !alreadyDone,
        reason: alreadyDone ? 'penalty' : 'earn',
      });
      set({
        profile: { ...get().profile, starBank: result.starBank },
        daily: result.daily,
        loading: false,
        showConfetti: !alreadyDone,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Task update failed',
      });
    }
  },

  applyPenalty: async (penaltyId) => {
    const penalty = PENALTIES.find((item) => item.id === penaltyId);
    if (!penalty) return;

    set({ loading: true, error: null });
    try {
      const result = await starLedger.applyDelta({
        delta: penalty.starValue,
        reason: 'penalty',
      });
      set({
        profile: { ...get().profile, starBank: result.starBank },
        daily: result.daily,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Penalty failed',
      });
    }
  },

  redeemReward: async (rewardId) => {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (!reward) return;

    set({ loading: true, error: null });
    try {
      const result = await starLedger.redeem(reward.cost);
      set({
        profile: { ...get().profile, starBank: result.starBank },
        daily: result.daily,
        loading: false,
        shopOpen: false,
      });
    } catch (error) {
      const message =
        error instanceof InsufficientStarsError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Redemption failed';
      set({ loading: false, error: message });
    }
  },
}));
