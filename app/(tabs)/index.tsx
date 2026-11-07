import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ConfettiOverlay } from '../../src/components/ConfettiOverlay';
import { PenaltyPanel } from '../../src/components/PenaltyPanel';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { RewardsShop } from '../../src/components/RewardsShop';
import { Screen } from '../../src/components/Screen';
import { SectionBoard } from '../../src/components/SectionBoard';
import { StarBalanceHero } from '../../src/components/StarBalanceHero';
import { isFirebaseConfigured } from '../../src/services/firebase';
import { useStarStore } from '../../src/stores/starStore';
import { colors, fonts, typography } from '../../src/theme';
import { isShopLocked } from '../../src/utils/economy';

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
    toggleTaskComplete,
    markSlip,
    clearSlip,
    applyPenalty,
    redeemReward,
    addSection,
    updateSection,
    removeSection,
    addTask,
    updateTask,
    removeTask,
    addShopItem,
    updateShopItem,
    removeShopItem,
    clearConfetti,
    setAdminPenaltiesOpen,
    setShopOpen,
  } = useStarStore();

  useEffect(() => {
    if (!useStarStore.getState().hydrated) {
      void hydrate();
    }
  }, [hydrate]);

  const shopLocked = isShopLocked(profile.starBank);

  return (
    <View style={styles.root}>
      <Screen
        title="Star Ledger"
        subtitle="Earn. Slip. Redeem — dynamic behavioral economy."
        rightSlot={
          <PrimaryButton
            label={shopLocked ? 'Locked' : 'Shop'}
            tone={shopLocked ? 'crimson' : 'cyan'}
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

        <SectionBoard
          sections={profile.sections}
          daily={daily}
          loading={loading}
          onToggleComplete={(taskId) => void toggleTaskComplete(taskId)}
          onToggleSlip={(taskId, current) => {
            if (current === 'slip') {
              void clearSlip(taskId);
            } else {
              void markSlip(taskId);
            }
          }}
          onAddSection={(input) => void addSection(input)}
          onUpdateSection={(sectionId, patch) =>
            void updateSection(sectionId, patch)
          }
          onRemoveSection={(sectionId) => void removeSection(sectionId)}
          onAddTask={(sectionId, input) => void addTask(sectionId, input)}
          onUpdateTask={(sectionId, taskId, patch) =>
            void updateTask(sectionId, taskId, patch)
          }
          onRemoveTask={(sectionId, taskId) =>
            void removeTask(sectionId, taskId)
          }
        />

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
        items={profile.shopItems}
        loading={loading}
        onClose={() => setShopOpen(false)}
        onRedeem={(id) => void redeemReward(id)}
        onAddItem={(input) => void addShopItem(input)}
        onUpdateItem={(itemId, patch) => void updateShopItem(itemId, patch)}
        onRemoveItem={(itemId) => void removeShopItem(itemId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  shopButton: { alignSelf: 'flex-start', minWidth: 88 },
  error: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    fontSize: 14,
  },
});
