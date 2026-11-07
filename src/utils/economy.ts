import type {
  DailyLog,
  LedgerSection,
  TaskStatus,
  UserProfile,
} from '../models/types';
import {
  DEFAULT_SECTIONS,
  DEFAULT_SHOP_ITEMS,
  EMPTY_DAILY_LOG,
} from '../models/types';
import { roundStars } from './dates';

/** Task fractional value = Section Value / Total Tasks in Section. */
export function taskValue(section: LedgerSection): number {
  const count = section.tasks.length;
  if (count <= 0) return 0;
  return roundStars(section.sectionValue / count);
}

/** Slip penalty = 50% of the task's gaining value. */
export function slipPenalty(section: LedgerSection): number {
  return roundStars(taskValue(section) * 0.5);
}

/** Critical-miss extra = 50% of the section baseline when every task is a slip. */
export function criticalMissPenalty(section: LedgerSection): number {
  return roundStars(section.sectionValue * 0.5);
}

export function shopUnlockTarget(balance: number): number {
  if (balance >= 0) return 0;
  return Math.ceil(Math.abs(balance) * 1.5);
}

export function isShopLocked(balance: number): boolean {
  return balance < 0;
}

export function getTaskStatus(
  daily: DailyLog,
  taskId: string,
): TaskStatus {
  const fromMap = daily.taskStatuses?.[taskId];
  if (fromMap) return fromMap;
  if (daily.completedTaskIds?.includes(taskId)) return 'completed';
  return 'pending';
}

export function findSectionForTask(
  sections: LedgerSection[],
  taskId: string,
): LedgerSection | undefined {
  return sections.find((section) =>
    section.tasks.some((task) => task.id === taskId),
  );
}

export function sectionIsAllSlip(
  section: LedgerSection,
  daily: DailyLog,
): boolean {
  if (section.tasks.length === 0) return false;
  return section.tasks.every(
    (task) => getTaskStatus(daily, task.id) === 'slip',
  );
}

/**
 * Star delta when moving a task from `from` → `to`, plus critical-miss
 * adjustments if the section flips into/out of all-slip.
 */
export function computeTaskTransitionDelta(options: {
  section: LedgerSection;
  daily: DailyLog;
  taskId: string;
  nextStatus: TaskStatus;
}): { delta: number; nextCriticalMissIds: string[] } {
  const { section, daily, taskId, nextStatus } = options;
  const current = getTaskStatus(daily, taskId);
  if (current === nextStatus) {
    return {
      delta: 0,
      nextCriticalMissIds: [...(daily.criticalMissSectionIds ?? [])],
    };
  }

  const earn = taskValue(section);
  const slip = slipPenalty(section);

  const effectOf = (status: TaskStatus): number => {
    if (status === 'completed') return earn;
    if (status === 'slip') return -slip;
    return 0;
  };

  let delta = roundStars(effectOf(nextStatus) - effectOf(current));

  const provisionalStatuses: Record<string, TaskStatus> = {
    ...(daily.taskStatuses ?? {}),
    [taskId]: nextStatus,
  };
  const provisionalDaily: DailyLog = {
    ...daily,
    taskStatuses: provisionalStatuses,
  };

  const wasAllSlip = sectionIsAllSlip(section, daily);
  const nowAllSlip = sectionIsAllSlip(section, provisionalDaily);
  const criticalIds = new Set(daily.criticalMissSectionIds ?? []);
  const crit = criticalMissPenalty(section);

  if (!wasAllSlip && nowAllSlip && !criticalIds.has(section.id)) {
    delta = roundStars(delta - crit);
    criticalIds.add(section.id);
  } else if (wasAllSlip && !nowAllSlip && criticalIds.has(section.id)) {
    delta = roundStars(delta + crit);
    criticalIds.delete(section.id);
  }

  return {
    delta,
    nextCriticalMissIds: Array.from(criticalIds),
  };
}

/** Normalize legacy profile/daily payloads from local or Firestore. */
export function normalizeProfile(raw: Partial<UserProfile> | null | undefined): UserProfile {
  const base = {
    currentWeight: raw?.currentWeight ?? 87,
    targetWeight: raw?.targetWeight ?? 73,
    currentPhase: (raw?.currentPhase ?? 1) as 1 | 2 | 3,
    waterTargetMl: raw?.waterTargetMl ?? 4000,
    starBank: typeof raw?.starBank === 'number' ? raw.starBank : 0,
    sections:
      Array.isArray(raw?.sections) && raw.sections.length > 0
        ? raw.sections.map(normalizeSection)
        : DEFAULT_SECTIONS.map((s) => ({
            ...s,
            tasks: s.tasks.map((t) => ({ ...t })),
          })),
    shopItems:
      Array.isArray(raw?.shopItems) && raw.shopItems.length > 0
        ? raw.shopItems.map(normalizeShopItem)
        : DEFAULT_SHOP_ITEMS.map((item) => ({ ...item })),
  };
  return base;
}

function normalizeSection(section: LedgerSection): LedgerSection {
  return {
    id: section.id || `sec_${Date.now()}`,
    title: section.title || 'Untitled Section',
    sectionValue:
      typeof section.sectionValue === 'number' && section.sectionValue > 0
        ? section.sectionValue
        : 1.0,
    tasks: Array.isArray(section.tasks)
      ? section.tasks.map((task) => ({
          id: task.id || `task_${Date.now()}`,
          title: task.title || 'Untitled Task',
          description: task.description ?? '',
        }))
      : [],
  };
}

function normalizeShopItem(item: {
  id?: string;
  title?: string;
  description?: string;
  cost?: number;
}) {
  return {
    id: item.id || `reward_${Date.now()}`,
    title: item.title || 'Untitled Reward',
    description: item.description ?? '',
    cost: typeof item.cost === 'number' ? Math.max(0, item.cost) : 0,
  };
}

export function normalizeDailyLog(
  raw: Partial<DailyLog> | null | undefined,
): DailyLog {
  const completedTaskIds = Array.isArray(raw?.completedTaskIds)
    ? raw.completedTaskIds
    : [];
  const taskStatuses: Record<string, TaskStatus> = {
    ...(raw?.taskStatuses ?? {}),
  };

  for (const id of completedTaskIds) {
    if (!taskStatuses[id]) {
      taskStatuses[id] = 'completed';
    }
  }

  return {
    ...EMPTY_DAILY_LOG,
    ...raw,
    completedTaskIds,
    taskStatuses,
    criticalMissSectionIds: Array.isArray(raw?.criticalMissSectionIds)
      ? raw.criticalMissSectionIds
      : [],
    starsEarnedToday:
      typeof raw?.starsEarnedToday === 'number' ? raw.starsEarnedToday : 0,
    starsDeductToday:
      typeof raw?.starsDeductToday === 'number' ? raw.starsDeductToday : 0,
  };
}

export function syncLegacyFlags(
  daily: DailyLog,
  taskId: string,
  status: TaskStatus,
): void {
  if (taskId === 'morning_crucible') {
    daily.morningCrucibleCompleted = status === 'completed';
  }
  if (taskId === 'fasting_window') {
    daily.fastingWindowMet = status === 'completed';
  }
}

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}
