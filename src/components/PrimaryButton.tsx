import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';
import { colors, fonts } from '../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  tone?: 'amber' | 'cyan' | 'emerald' | 'crimson' | 'muted';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const TONES = {
  amber: { bg: colors.amber, text: colors.black },
  cyan: { bg: colors.cyan, text: colors.black },
  emerald: { bg: colors.emerald, text: colors.black },
  crimson: { bg: colors.crimson, text: colors.white },
  muted: { bg: colors.backgroundMuted, text: colors.textPrimary },
} as const;

export function PrimaryButton({
  label,
  onPress,
  tone = 'amber',
  disabled,
  loading,
  style,
}: PrimaryButtonProps) {
  const palette = TONES[tone];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, opacity: pressed || disabled ? 0.7 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
