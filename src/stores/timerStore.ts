import { create } from 'zustand';

export type TimerMode = 'focus' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface TimerState {
  focusMinutes: number;
  breakMinutes: number;
  mode: TimerMode;
  status: TimerStatus;
  remainingSeconds: number;
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  switchMode: () => void;
}

function minutesToSeconds(minutes: number): number {
  return Math.round(minutes * 60);
}

export const useTimerStore = create<TimerState>((set, get) => ({
  focusMinutes: 30,
  breakMinutes: 5,
  mode: 'focus',
  status: 'idle',
  remainingSeconds: minutesToSeconds(30),

  setFocusMinutes: (minutes) => {
    const clamped = Math.min(120, Math.max(1, Math.round(minutes)));
    const { status, mode } = get();
    set({
      focusMinutes: clamped,
      remainingSeconds:
        status === 'idle' && mode === 'focus'
          ? minutesToSeconds(clamped)
          : get().remainingSeconds,
    });
  },

  setBreakMinutes: (minutes) => {
    const clamped = Math.min(60, Math.max(1, Math.round(minutes)));
    const { status, mode } = get();
    set({
      breakMinutes: clamped,
      remainingSeconds:
        status === 'idle' && mode === 'break'
          ? minutesToSeconds(clamped)
          : get().remainingSeconds,
    });
  },

  start: () => {
    const { mode, focusMinutes, breakMinutes } = get();
    const minutes = mode === 'focus' ? focusMinutes : breakMinutes;
    set({
      status: 'running',
      remainingSeconds: minutesToSeconds(minutes),
    });
  },

  pause: () => set({ status: 'paused' }),
  resume: () => set({ status: 'running' }),

  reset: () => {
    const { mode, focusMinutes, breakMinutes } = get();
    const minutes = mode === 'focus' ? focusMinutes : breakMinutes;
    set({
      status: 'idle',
      remainingSeconds: minutesToSeconds(minutes),
    });
  },

  tick: () => {
    const { status, remainingSeconds } = get();
    if (status !== 'running') return;
    if (remainingSeconds <= 1) {
      set({ remainingSeconds: 0, status: 'finished' });
      return;
    }
    set({ remainingSeconds: remainingSeconds - 1 });
  },

  switchMode: () => {
    const { mode, focusMinutes, breakMinutes } = get();
    const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus';
    const minutes = nextMode === 'focus' ? focusMinutes : breakMinutes;
    set({
      mode: nextMode,
      status: 'idle',
      remainingSeconds: minutesToSeconds(minutes),
    });
  },
}));
