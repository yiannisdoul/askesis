import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { REWARDS } from '../constants/starFramework';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import { PrimaryButton } from './PrimaryButton';

interface RewardsShopProps {
  open: boolean;
  balance: number;
  loading?: boolean;
  onClose: () => void;
  onRedeem: (rewardId: string) => void;
}

export function RewardsShop({
  open,
  balance,
  loading,
  onClose,
  onRedeem,
}: RewardsShopProps) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Rewards Shop</Text>
          <Text style={typography.body}>
            Available balance: {formatStars(balance)} ★
          </Text>

          {REWARDS.map((reward) => {
            const affordable = balance >= reward.cost;
            return (
              <View key={reward.id} style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{reward.title}</Text>
                  <Text style={typography.label}>{reward.description}</Text>
                  <Text style={styles.cost}>{reward.cost} stars</Text>
                </View>
                <PrimaryButton
                  label={affordable ? 'Redeem' : 'Locked'}
                  tone={affordable ? 'amber' : 'muted'}
                  disabled={!affordable}
                  loading={loading}
                  onPress={() => onRedeem(reward.id)}
                />
              </View>
            );
          })}

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
    borderColor: colors.border,
    borderWidth: 1,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 24,
    color: colors.amber,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  itemTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  cost: {
    marginTop: 4,
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
  },
  close: { alignItems: 'center', paddingVertical: 8 },
  closeText: {
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
    fontSize: 16,
  },
});
