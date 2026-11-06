import { StyleSheet, Text, View } from 'react-native';
import Slider from './NativeSlider';
import { colors, fonts, typography } from '../theme';

interface DurationSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  accent: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DurationSlider({
  label,
  value,
  min,
  max,
  accent,
  onChange,
  disabled,
}: DurationSliderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: accent }]}>{value} min</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        minimumTrackTintColor={accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={accent}
      />
      <Text style={typography.label}>
        Drag freely before starting the countdown session.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 15,
  },
  value: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
  },
});
