import type {
  ActivityPreset,
  DailyTaskDefinition,
  PenaltyDefinition,
  RewardDefinition,
} from '../models/types';
import {
  DEFAULT_SECTIONS,
  DEFAULT_SHOP_ITEMS,
} from '../models/types';
import { taskValue } from '../utils/economy';

/**
 * Derived flat task list for any legacy consumers.
 * Prefer reading `profile.sections` from the star store.
 */
export const DAILY_TASKS: DailyTaskDefinition[] = DEFAULT_SECTIONS.flatMap(
  (section) =>
    section.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      starValue: taskValue(section),
    })),
);

/** Manual admin penalties retained as optional overrides. */
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

/** Seed catalog — live catalog lives on UserProfile.shopItems. */
export const REWARDS: RewardDefinition[] = DEFAULT_SHOP_ITEMS.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  cost: item.cost,
}));

/**
 * Activity generator presets for the Rewards Shop Add/Edit form.
 * Maps common time-dopamine trade-offs to automatic star costs.
 */
export const ACTIVITY_PRESETS: ActivityPreset[] = [
  {
    id: 'preset_games_90',
    title: '1.5h Video Games',
    description: 'Ninety minutes of gaming',
    cost: 3,
  },
  {
    id: 'preset_movie',
    title: 'Movie Night / Outing',
    description: 'Going out or a full movie night',
    cost: 10,
  },
  {
    id: 'preset_premium_meal',
    title: 'Premium Restaurant / Cheat Meal',
    description: 'High-value dining reward',
    cost: 15,
  },
  {
    id: 'preset_streaming',
    title: 'Streaming / Leisure Hour',
    description: 'One leisure streaming hour',
    cost: 2,
  },
];

export const PERFECT_FAST_BONUS = 3.0;
