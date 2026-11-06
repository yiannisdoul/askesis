import type {
  DailyTaskDefinition,
  PenaltyDefinition,
  RewardDefinition,
} from '../models/types';

/** Four core daily earning tasks from the Star Behavioral Framework. */
export const DAILY_TASKS: DailyTaskDefinition[] = [
  {
    id: 'morning_crucible',
    title: 'Morning Crucible',
    description: 'Prayer + Workout + Dog Walk before 6:30 AM',
    starValue: 1.0,
  },
  {
    id: 'fasting_window',
    title: 'Intermittent Fasting Window',
    description: 'Keep feeding window 8:00 AM – 1:00 PM',
    starValue: 1.0,
  },
  {
    id: 'deep_work_blocks',
    title: 'Deep Work Blocks',
    description: 'Coding + Trading with zero nicotine slips',
    starValue: 1.0,
  },
  {
    id: 'evening_routine',
    title: 'Evening Routine',
    description: 'Night Prayer + 8:00 PM Screen Blackout',
    starValue: 1.0,
  },
];

/** Half-rate discipline penalties. Balance never drops below zero. */
export const PENALTIES: PenaltyDefinition[] = [
  {
    id: 'missed_crucible',
    title: 'Missed Morning Crucible',
    description: 'Failed before 6:30 AM',
    starValue: -0.5,
  },
  {
    id: 'feeding_slip',
    title: 'Feeding Window Slip',
    description: 'Ate outside 8:00 AM – 1:00 PM',
    starValue: -0.5,
  },
  {
    id: 'blackout_fail',
    title: 'Screen Blackout Failure',
    description: 'Missed 8:00 PM blackout',
    starValue: -1.0,
  },
  {
    id: 'fast_violation',
    title: 'Orthodox Fast Violation',
    description: 'Broke Wed/Fri vegan fast',
    starValue: -1.0,
  },
];

export const REWARDS: RewardDefinition[] = [
  {
    id: 'game_block_90',
    title: '1.5-Hour Game Block',
    description: 'Base video game redemption',
    cost: 3,
  },
  {
    id: 'movie_night',
    title: 'Going Out / Movie Night',
    description: 'Guilt-free outing block',
    cost: 10,
  },
  {
    id: 'saturday_premium',
    title: 'Saturday Premium Gaming',
    description: '4–5 hour extended stack',
    cost: 15,
  },
];

export const PERFECT_FAST_BONUS = 3.0;
