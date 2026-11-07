import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { LedgerTask, TaskStatus } from '../models/types';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';

interface TaskToggleProps {
  task: LedgerTask;
  status: TaskStatus;
  taskValue: number;
  slipValue: number;
  onComplete: () => void;
  onSlip: () => void;
  editing?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function TaskToggle({
  task,
  status,
  taskValue,
  slipValue,
  onComplete,
  onSlip,
  editing,
  onEdit,
  onRemove,
}: TaskToggleProps) {
  const completed = status === 'completed';
  const slipped = status === 'slip';

  return (
    <View style={[styles.row, completed && styles.rowChecked, slipped && styles.rowSlip]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onComplete();
        }}
        style={styles.mainPress}
      >
        <View style={[styles.box, completed && styles.boxChecked, slipped && styles.boxSlip]}>
          {completed ? <Text style={styles.check}>✓</Text> : null}
          {slipped ? <Text style={styles.check}>!</Text> : null}
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{task.title}</Text>
          {task.description ? (
            <Text style={typography.label}>{task.description}</Text>
          ) : null}
          <Text style={styles.valueMeta}>
            +{formatStars(taskValue)} · slip −{formatStars(slipValue)}
          </Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            void Haptics.notificationAsync(
              slipped
                ? Haptics.NotificationFeedbackType.Success
                : Haptics.NotificationFeedbackType.Warning,
            );
            onSlip();
          }}
          style={[styles.slipBtn, slipped && styles.slipBtnActive]}
        >
          <Text style={[styles.slipText, slipped && styles.slipTextActive]}>
            {slipped ? 'Clear' : 'Slip'}
          </Text>
        </Pressable>
        {editing ? (
          <>
            <Pressable onPress={onEdit} style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
            <Pressable onPress={onRemove} style={styles.editBtn}>
              <Text style={styles.removeText}>Del</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  rowSlip: {
    borderColor: colors.crimson,
    backgroundColor: '#2A1520',
  },
  mainPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
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
  boxSlip: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  check: {
    color: colors.black,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  valueMeta: {
    marginTop: 2,
    fontFamily: fonts.bodyMedium,
    color: colors.amber,
    fontSize: 12,
  },
  actions: { gap: 6, alignItems: 'stretch' },
  slipBtn: {
    minWidth: 56,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.crimson,
    alignItems: 'center',
  },
  slipBtnActive: {
    backgroundColor: colors.crimson,
  },
  slipText: {
    fontFamily: fonts.bodyBold,
    color: colors.crimson,
    fontSize: 12,
  },
  slipTextActive: {
    color: colors.white,
  },
  editBtn: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  editText: {
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    fontSize: 12,
  },
  removeText: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    fontSize: 12,
  },
});
