import { StyleSheet, Text, View } from 'react-native';
import { PENALTIES } from '../constants/starFramework';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import { PrimaryButton } from './PrimaryButton';

interface PenaltyPanelProps {
  open: boolean;
  onToggleOpen: () => void;
  onApply: (penaltyId: string) => void;
  loading?: boolean;
}

export function PenaltyPanel({
  open,
  onToggleOpen,
  onApply,
  loading,
}: PenaltyPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Administration · Penalties</Text>
          <Text style={typography.label}>
            Half-rate discipline triggers (−0.5 / −1.0)
          </Text>
        </View>
        <PrimaryButton
          label={open ? 'Hide' : 'Open'}
          tone="muted"
          onPress={onToggleOpen}
          style={styles.toggle}
        />
      </View>

      {open
        ? PENALTIES.map((penalty) => (
            <View key={penalty.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{penalty.title}</Text>
                <Text style={typography.label}>{penalty.description}</Text>
              </View>
              <PrimaryButton
                label={formatStars(penalty.starValue)}
                tone="crimson"
                loading={loading}
                onPress={() => onApply(penalty.id)}
                style={styles.action}
              />
            </View>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: 14,
    gap: 12,
  },
  header: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  title: {
    fontFamily: fonts.bodyBold,
    color: colors.crimson,
    fontSize: 16,
  },
  toggle: { minWidth: 84 },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowTitle: {
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 15,
  },
  action: { minWidth: 72 },
});
