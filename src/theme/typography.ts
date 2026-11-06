import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  display: 'PressStart2P_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  brand: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 28,
    color: colors.amber,
    letterSpacing: 1,
  } satisfies TextStyle,
  pixelTitle: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 22,
    color: colors.cyan,
  } satisfies TextStyle,
  pixelTimer: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 48,
    color: colors.amber,
    textAlign: 'center',
  } satisfies TextStyle,
  h1: {
    fontFamily: fonts.bodyBold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
  } satisfies TextStyle,
  h2: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.textPrimary,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  } satisfies TextStyle,
  metric: {
    fontFamily: fonts.bodyBold,
    fontSize: 48,
    lineHeight: 54,
    color: colors.emerald,
  } satisfies TextStyle,
} as const;
