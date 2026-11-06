import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { DailyTaskDefinition } from '../models/types';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';

interface TaskToggleProps {
  task: DailyTaskDefinition;
  checked: boolean;
  onToggle: () => void;
}

export function TaskToggle({ task, checked, onToggle }: TaskToggleProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onToggle();
      }}
      style={[styles.row, checked && styles.rowChecked]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={typography.label}>{task.description}</Text>
      </View>
      <Text style={styles.value}>+{formatStars(task.starValue)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  rowChecked: {
    borderColor: colors.emerald,
    backgroundColor: '#12291F',
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  check: {
    color: colors.black,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  copy: { flex: 1, gap: 2 },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  value: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 15,
  },
});
