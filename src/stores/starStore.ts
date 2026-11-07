import { create } from 'zustand';
import { PENALTIES } from '../constants/starFramework';
import {
  DEFAULT_PROFILE,
  EMPTY_DAILY_LOG,
  type DailyLog,
  type LedgerSection,
  type LedgerTask,
  type ShopItem,
  type TaskStatus,
  type UserProfile,
} from '../models/types';
import {
  InsufficientStarsError,
  ShopLockedError,
  starLedger,
} from '../services/starLedger';
import { createId } from '../utils/economy';

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
  setTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  /** Convenience: cycle pending → completed → pending for checkbox UX. */
  toggleTaskComplete: (taskId: string) => Promise<void>;
  markSlip: (taskId: string) => Promise<void>;
  clearSlip: (taskId: string) => Promise<void>;
  applyPenalty: (penaltyId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
  addSection: (input: { title: string; sectionValue?: number }) => Promise<void>;
  updateSection: (
    sectionId: string,
    patch: Partial<Pick<LedgerSection, 'title' | 'sectionValue'>>,
  ) => Promise<void>;
  removeSection: (sectionId: string) => Promise<void>;
  addTask: (
    sectionId: string,
    input: { title: string; description?: string },
  ) => Promise<void>;
  updateTask: (
    sectionId: string,
    taskId: string,
    patch: Partial<Pick<LedgerTask, 'title' | 'description'>>,
  ) => Promise<void>;
  removeTask: (sectionId: string, taskId: string) => Promise<void>;
  addShopItem: (input: {
    title: string;
    description?: string;
    cost: number;
  }) => Promise<void>;
  updateShopItem: (
    itemId: string,
    patch: Partial<Pick<ShopItem, 'title' | 'description' | 'cost'>>,
  ) => Promise<void>;
  removeShopItem: (itemId: string) => Promise<void>;
  clearConfetti: () => void;
  setAdminPenaltiesOpen: (open: boolean) => void;
  setShopOpen: (open: boolean) => void;
}

function applyResult(
  set: (partial: Partial<StarState>) => void,
  get: () => StarState,
  result: { profile: UserProfile; daily: DailyLog },
  extra?: Partial<StarState>,
) {
  set({
    profile: result.profile,
    daily: result.daily,
    loading: false,
    ...extra,
  });
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

  setTaskStatus: async (taskId, status) => {
    const previous = get().daily.taskStatuses?.[taskId] ?? 'pending';
    set({ loading: true, error: null });
    try {
      const result = await starLedger.setTaskStatus({ taskId, status });
      applyResult(set, get, result, {
        showConfetti: status === 'completed' && previous !== 'completed',
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Task update failed',
      });
    }
  },

  toggleTaskComplete: async (taskId) => {
    const current = get().daily.taskStatuses?.[taskId] ?? 'pending';
    const next: TaskStatus = current === 'completed' ? 'pending' : 'completed';
    await get().setTaskStatus(taskId, next);
  },

  markSlip: async (taskId) => {
    await get().setTaskStatus(taskId, 'slip');
  },

  clearSlip: async (taskId) => {
    const current = get().daily.taskStatuses?.[taskId] ?? 'pending';
    if (current === 'slip') {
      await get().setTaskStatus(taskId, 'pending');
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
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Penalty failed',
      });
    }
  },

  redeemReward: async (rewardId) => {
    const reward = get().profile.shopItems.find((item) => item.id === rewardId);
    if (!reward) return;

    set({ loading: true, error: null });
    try {
      const result = await starLedger.redeem(reward.cost);
      applyResult(set, get, result, { shopOpen: false });
    } catch (error) {
      const message =
        error instanceof ShopLockedError || error instanceof InsufficientStarsError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Redemption failed';
      set({ loading: false, error: message });
    }
  },

  addSection: async ({ title, sectionValue = 1.0 }) => {
    const sections: LedgerSection[] = [
      ...get().profile.sections,
      {
        id: createId('sec'),
        title: title.trim() || 'New Section',
        sectionValue: sectionValue > 0 ? sectionValue : 1.0,
        tasks: [],
      },
    ];
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Add section failed',
      });
    }
  },

  updateSection: async (sectionId, patch) => {
    const sections = get().profile.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            title: patch.title?.trim() || section.title,
            sectionValue:
              typeof patch.sectionValue === 'number' && patch.sectionValue > 0
                ? patch.sectionValue
                : section.sectionValue,
          }
        : section,
    );
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Update section failed',
      });
    }
  },

  removeSection: async (sectionId) => {
    const sections = get().profile.sections.filter((s) => s.id !== sectionId);
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Remove section failed',
      });
    }
  },

  addTask: async (sectionId, input) => {
    const sections = get().profile.sections.map((section) => {
      if (section.id !== sectionId) return section;
      const task: LedgerTask = {
        id: createId('task'),
        title: input.title.trim() || 'New Task',
        description: input.description?.trim() ?? '',
      };
      return { ...section, tasks: [...section.tasks, task] };
    });
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Add task failed',
      });
    }
  },

  updateTask: async (sectionId, taskId, patch) => {
    const sections = get().profile.sections.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        tasks: section.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                title: patch.title?.trim() || task.title,
                description:
                  patch.description !== undefined
                    ? patch.description
                    : task.description,
              }
            : task,
        ),
      };
    });
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Update task failed',
      });
    }
  },

  removeTask: async (sectionId, taskId) => {
    const sections = get().profile.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            tasks: section.tasks.filter((task) => task.id !== taskId),
          }
        : section,
    );
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveSections(sections);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Remove task failed',
      });
    }
  },

  addShopItem: async (input) => {
    const shopItems: ShopItem[] = [
      ...get().profile.shopItems,
      {
        id: createId('reward'),
        title: input.title.trim() || 'New Reward',
        description: input.description?.trim() ?? '',
        cost: Math.max(0, input.cost),
      },
    ];
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveShopItems(shopItems);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Add shop item failed',
      });
    }
  },

  updateShopItem: async (itemId, patch) => {
    const shopItems = get().profile.shopItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            title: patch.title?.trim() || item.title,
            description:
              patch.description !== undefined
                ? patch.description
                : item.description,
            cost:
              typeof patch.cost === 'number'
                ? Math.max(0, patch.cost)
                : item.cost,
          }
        : item,
    );
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveShopItems(shopItems);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : 'Update shop item failed',
      });
    }
  },

  removeShopItem: async (itemId) => {
    const shopItems = get().profile.shopItems.filter((item) => item.id !== itemId);
    set({ loading: true, error: null });
    try {
      const result = await starLedger.saveShopItems(shopItems);
      applyResult(set, get, result);
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : 'Remove shop item failed',
      });
    }
  },
}));
