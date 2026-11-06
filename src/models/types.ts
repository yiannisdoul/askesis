export type WorkoutType = 'calisthenics' | 'running';
export type TradePosition = 'buy' | 'sell';
export type TradeSession = 'morning' | 'evening';

export interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  currentPhase: 1 | 2 | 3;
  waterTargetMl: number;
  starBank: number;
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
  completedTaskIds: string[];
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

export interface MediaClip {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
  queryTag: string;
}

export type MediaTab = 'mindset' | 'orthodox';

export const DEFAULT_PROFILE: UserProfile = {
  currentWeight: 87,
  targetWeight: 73,
  currentPhase: 1,
  waterTargetMl: 4000,
  starBank: 0,
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
};
