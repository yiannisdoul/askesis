/** Energetic high mental-health palette from the reconstruction blueprint. */
export const colors = {
  background: '#121824',
  backgroundElevated: '#1A2233',
  backgroundMuted: '#243044',
  amber: '#FFBF00',
  cyan: '#00E5FF',
  emerald: '#00E676',
  crimson: '#FF1744',
  textPrimary: '#F5F7FA',
  textSecondary: '#9AA7BD',
  textDim: '#667388',
  border: '#2E3A51',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(18, 24, 36, 0.92)',
} as const;

export type AppColor = keyof typeof colors;
