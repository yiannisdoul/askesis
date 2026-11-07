import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import { isShopLocked, shopUnlockTarget } from '../utils/economy';

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
  const locked = isShopLocked(balance);
  const unlockTarget = shopUnlockTarget(balance);
  const negative = balance < 0;

  return (
    <LinearGradient
      colors={
        negative
          ? ['#2A1520', '#1A1220', '#101828']
          : ['#1C2740', '#152033', '#101828']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, negative && styles.heroDebt]}
    >
      <Text style={styles.eyebrow}>STAR BANK BALANCE</Text>
      <Text style={[styles.balance, negative && styles.balanceDebt]}>
        {formatStars(balance)}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Phase {phase}</Text>
        <Text style={styles.metaEarn}>+{formatStars(earnedToday)} today</Text>
        <Text style={styles.metaLoss}>-{formatStars(deductedToday)} slips</Text>
      </View>
      {locked ? (
        <View style={styles.lockBanner}>
          <Text style={styles.lockTitle}>Shop Locked · Debt Mode</Text>
          <Text style={styles.lockBody}>
            Earn {unlockTarget} Stars to clear debt + 50% fine.
          </Text>
        </View>
      ) : (
        <Text style={typography.label}>
          Balance may go negative. Shop locks below 0.0 until debt + fine is cleared.
        </Text>
      )}
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
  heroDebt: {
    borderColor: colors.crimson,
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
  balanceDebt: {
    color: colors.crimson,
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
  lockBanner: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 23, 68, 0.16)',
    borderWidth: 1,
    borderColor: colors.crimson,
    gap: 4,
  },
  lockTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.crimson,
    fontSize: 14,
  },
  lockBody: {
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 14,
  },
});
