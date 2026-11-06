import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { PenaltyPanel } from '../../src/components/PenaltyPanel';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { RewardsShop } from '../../src/components/RewardsShop';
import { Screen } from '../../src/components/Screen';
import { StarBalanceHero } from '../../src/components/StarBalanceHero';
import { TaskToggle } from '../../src/components/TaskToggle';
import { DAILY_TASKS } from '../../src/constants/starFramework';
import { isFirebaseConfigured } from '../../src/services/firebase';
import { useStarStore } from '../../src/stores/starStore';
import { colors, fonts, typography } from '../../src/theme';

export default function StarLedgerScreen() {
  const {
    profile,
    daily,
    loading,
    error,
    showConfetti,
    adminPenaltiesOpen,
    shopOpen,
    hydrate,
    toggleTask,
    applyPenalty,
    redeemReward,
    clearConfetti,
    setAdminPenaltiesOpen,
    setShopOpen,
  } = useStarStore();

  useEffect(() => {
    if (!useStarStore.getState().hydrated) {
      void hydrate();
    }
  }, [hydrate]);

  return (
    <View style={styles.root}>
      <Screen
        title="Star Ledger"
        subtitle="Earn. Redeem. Never bankrupt."
        rightSlot={
          <PrimaryButton
            label="Shop"
            tone="cyan"
            onPress={() => setShopOpen(true)}
            style={styles.shopButton}
          />
        }
      >
        <StarBalanceHero
          balance={profile.starBank}
          phase={profile.currentPhase}
          earnedToday={daily.starsEarnedToday}
          deductedToday={daily.starsDeductToday}
        />

        <Text style={styles.section}>Today's Core Tasks</Text>
        {DAILY_TASKS.map((task) => (
          <TaskToggle
            key={task.id}
            task={task}
            checked={daily.completedTaskIds.includes(task.id)}
            onToggle={() => void toggleTask(task.id)}
          />
        ))}

        <PenaltyPanel
          open={adminPenaltiesOpen}
          onToggleOpen={() => setAdminPenaltiesOpen(!adminPenaltiesOpen)}
          onApply={(id) => void applyPenalty(id)}
          loading={loading}
        />

        <Text style={typography.label}>
          Persistence:{' '}
          {isFirebaseConfigured
            ? 'Cloud Firestore transactions'
            : 'Local AsyncStorage demo mode'}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Screen>

      <ConfettiOverlay active={showConfetti} onComplete={clearConfetti} />
      <RewardsShop
        open={shopOpen}
        balance={profile.starBank}
        loading={loading}
        onClose={() => setShopOpen(false)}
        onRedeem={(id) => void redeemReward(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  shopButton: { alignSelf: 'flex-start', minWidth: 88 },
  section: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
    marginTop: 4,
  },
  error: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    fontSize: 14,
  },
});
