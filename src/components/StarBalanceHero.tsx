import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';

interface StarBalanceHeroProps {
  balance: number;
  phase: number;
  earnedToday: number;
  deductedToday: number;
}

export function StarBalanceHero({
  balance,
  phase,
  earnedToday,
  deductedToday,
}: StarBalanceHeroProps) {
  return (
    <LinearGradient
      colors={['#1C2740', '#152033', '#101828']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <Text style={styles.eyebrow}>STAR BANK BALANCE</Text>
      <Text style={styles.balance}>{formatStars(balance)}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Phase {phase}</Text>
        <Text style={styles.metaEarn}>+{formatStars(earnedToday)} today</Text>
        <Text style={styles.metaLoss}>-{formatStars(deductedToday)} slips</Text>
      </View>
      <Text style={typography.label}>
        Bankruptcy protection active — balance never drops below 0.0
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  eyebrow: {
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    letterSpacing: 1.4,
    fontSize: 12,
  },
  balance: {
    ...typography.metric,
    fontSize: 56,
    lineHeight: 62,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  meta: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
  },
  metaEarn: {
    fontFamily: fonts.bodyBold,
    color: colors.emerald,
  },
  metaLoss: {
    fontFamily: fonts.bodyBold,
    color: colors.crimson,
  },
});
