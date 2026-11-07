export type WorkoutType = 'calisthenics' | 'running';
export type TradePosition = 'buy' | 'sell';
export type TradeSession = 'morning' | 'evening';

/** pending = not acted on; completed = earned; slip = half-rate penalty applied. */
export type TaskStatus = 'pending' | 'completed' | 'slip';

export interface LedgerTask {
  id: string;
  title: string;
  description: string;
}

export interface LedgerSection {
  id: string;
  title: string;
  /** Baseline star value for the section (default 1.0). */
  sectionValue: number;
  tasks: LedgerTask[];
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  currentPhase: 1 | 2 | 3;
  waterTargetMl: number;
  starBank: number;
  sections: LedgerSection[];
  shopItems: ShopItem[];
}

export interface DailyLog {
  waterIntakeMl: number;
  totalCalories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  morningCrucibleCompleted: boolean;
  fastingWindowMet: boolean;
  nicotineSlips: number;
  starsEarnedToday: number;
  starsDeductToday: number;
  journalText: string;
  mentalHealthScore: number;
  /** @deprecated Prefer taskStatuses; retained for migration. */
  completedTaskIds: string[];
  taskStatuses: Record<string, TaskStatus>;
  /** Sections that already had the critical-miss multiplier applied today. */
  criticalMissSectionIds: string[];
}

export interface WorkoutLog {
  id?: string;
  date: string;
  type: WorkoutType;
  distanceKm: number;
  durationMin: number;
  paceMinKm: string;
  calisthenicsReps: Record<string, number[]>;
  rirTarget: number;
  physicalNotes: string;
}

export interface TradingLog {
  id?: string;
  date: string;
  session: TradeSession;
  pair: string;
  positionType: TradePosition;
  entryPrice: number;
  exitPrice: number;
  resultPips: number;
  analysis: string;
}

export interface DailyTaskDefinition {
  id: string;
  title: string;
  description: string;
  starValue: number;
}

export interface PenaltyDefinition {
  id: string;
  title: string;
  description: string;
  starValue: number;
}

export interface RewardDefinition {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export interface ActivityPreset {
  id: string;
  title: string;
  description: string;
  cost: number;
}

export interface MediaClip {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
  queryTag: string;
}

export type MediaTab = 'mindset' | 'orthodox';

export const DEFAULT_SECTIONS: LedgerSection[] = [
  {
    id: 'sec_morning_crucible',
    title: 'Morning Crucible',
    sectionValue: 1.0,
    tasks: [
      {
        id: 'morning_crucible',
        title: 'Morning Crucible',
        description: 'Prayer + Workout + Dog Walk before 6:30 AM',
      },
    ],
  },
  {
    id: 'sec_fasting',
    title: 'Intermittent Fasting',
    sectionValue: 1.0,
    tasks: [
      {
        id: 'fasting_window',
        title: 'Feeding Window',
        description: 'Keep feeding window 8:00 AM – 1:00 PM',
      },
    ],
  },
  {
    id: 'sec_deep_work',
    title: 'Deep Work Blocks',
    sectionValue: 1.0,
    tasks: [
      {
        id: 'deep_work_blocks',
        title: 'Deep Work Blocks',
        description: 'Coding + Trading with zero nicotine slips',
      },
    ],
  },
  {
    id: 'sec_evening',
    title: 'Evening Routine',
    sectionValue: 1.0,
    tasks: [
      {
        id: 'evening_routine',
        title: 'Evening Routine',
        description: 'Night Prayer + 8:00 PM Screen Blackout',
      },
    ],
  },
];

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'game_block_90',
    title: '1.5h Video Games',
    description: 'Base video game redemption',
    cost: 3,
  },
  {
    id: 'movie_night',
    title: 'Movie Night / Outing',
    description: 'Guilt-free outing block',
    cost: 10,
  },
  {
    id: 'premium_meal',
    title: 'Premium Restaurant / Cheat Meal',
    description: 'High-value leisure reward',
    cost: 15,
  },
  {
    id: 'streaming_hour',
    title: 'Streaming / Leisure Hour',
    description: 'One hour of leisure media',
    cost: 2,
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  currentWeight: 87,
  targetWeight: 73,
  currentPhase: 1,
  waterTargetMl: 4000,
  starBank: 0,
  sections: DEFAULT_SECTIONS,
  shopItems: DEFAULT_SHOP_ITEMS,
};

export const EMPTY_DAILY_LOG: DailyLog = {
  waterIntakeMl: 0,
  totalCalories: 0,
  proteinG: 0,
  carbsG: 0,
  fatsG: 0,
  morningCrucibleCompleted: false,
  fastingWindowMet: false,
  nicotineSlips: 0,
  starsEarnedToday: 0,
  starsDeductToday: 0,
  journalText: '',
  mentalHealthScore: 5,
  completedTaskIds: [],
  taskStatuses: {},
  criticalMissSectionIds: [],
};
