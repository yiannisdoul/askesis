/** Portrait smartphone canvas + floating pill nav geometry. */
export const MOBILE_MAX_WIDTH = 430;

/** Outer pill height (touch-friendly). */
export const FLOATING_NAV_HEIGHT = 68;

/** Detached bottom margin so the pill floats above the screen edge. */
export const FLOATING_NAV_BOTTOM_GAP = 22;

/** Horizontal inset from phone canvas edges. */
export const FLOATING_NAV_SIDE_INSET = 18;

/** Minimum icon hit area inside the pill. */
export const TAB_HIT_SIZE = 44;

/** Active white indicator diameter. */
export const ACTIVE_INDICATOR_SIZE = 48;

/**
 * Extra scroll padding so content can pass under the floating nav.
 * Safe-area padding is added at runtime.
 */
export const FLOATING_NAV_CONTENT_INSET =
  FLOATING_NAV_HEIGHT + FLOATING_NAV_BOTTOM_GAP + 20;
