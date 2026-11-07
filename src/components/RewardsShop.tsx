import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ACTIVITY_PRESETS } from '../constants/starFramework';
import type { ShopItem } from '../models/types';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import { isShopLocked, shopUnlockTarget } from '../utils/economy';
import { Field } from './Field';
import { PrimaryButton } from './PrimaryButton';

interface RewardsShopProps {
  open: boolean;
  balance: number;
  items: ShopItem[];
  loading?: boolean;
  onClose: () => void;
  onRedeem: (rewardId: string) => void;
  onAddItem: (input: {
    title: string;
    description: string;
    cost: number;
  }) => void;
  onUpdateItem: (
    itemId: string,
    patch: { title?: string; description?: string; cost?: number },
  ) => void;
  onRemoveItem: (itemId: string) => void;
}

export function RewardsShop({
  open,
  balance,
  items,
  loading,
  onClose,
  onRedeem,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: RewardsShopProps) {
  const locked = isShopLocked(balance);
  const unlockTarget = shopUnlockTarget(balance);

  const [manageMode, setManageMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setManageMode(false);
      setEditingId(null);
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCost('');
    setSelectedPreset('');
    setPresetMenuOpen(false);
    setEditingId(null);
  };

  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setPresetMenuOpen(false);
    const preset = ACTIVITY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTitle(preset.title);
    setDescription(preset.description);
    setCost(String(preset.cost));
  };

  const selectedPresetLabel =
    ACTIVITY_PRESETS.find((p) => p.id === selectedPreset)?.title ??
    'Select a reward activity…';

  const submitForm = () => {
    const parsedCost = Number.parseFloat(cost);
    if (!title.trim() || !Number.isFinite(parsedCost)) return;

    if (editingId) {
      onUpdateItem(editingId, {
        title: title.trim(),
        description: description.trim(),
        cost: parsedCost,
      });
    } else {
      onAddItem({
        title: title.trim(),
        description: description.trim(),
        cost: parsedCost,
      });
    }
    resetForm();
  };

  const beginEdit = (item: ShopItem) => {
    setManageMode(true);
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCost(String(item.cost));
    setSelectedPreset('');
  };

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.titleRow}>
              <Text style={styles.title}>Rewards Shop</Text>
              <PrimaryButton
                label={manageMode ? 'Done' : 'Edit Catalog'}
                tone="muted"
                onPress={() => {
                  setManageMode((v) => !v);
                  if (manageMode) resetForm();
                }}
                style={styles.manageBtn}
              />
            </View>
            <Text style={typography.body}>
              Available balance: {formatStars(balance)} ★
            </Text>

            {locked ? (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockEyebrow}>LOCKOUT ACTIVE</Text>
                <Text style={styles.lockHeadline}>
                  Shop Locked. Earn {unlockTarget} Stars to clear debt + 50% fine.
                </Text>
                <Text style={styles.lockBody}>
                  Redemptions are disabled while Star Bank is negative. Clear the
                  debt target to unlock the catalog.
                </Text>
              </View>
            ) : null}

            <View style={locked ? styles.catalogDimmed : undefined}>
              {items.map((reward) => {
                const affordable = !locked && balance >= reward.cost;
                return (
                  <View key={reward.id} style={styles.item}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{reward.title}</Text>
                      {reward.description ? (
                        <Text style={typography.label}>{reward.description}</Text>
                      ) : null}
                      <Text style={styles.cost}>{reward.cost} stars</Text>
                    </View>
                    {manageMode ? (
                      <View style={styles.itemActions}>
                        <PrimaryButton
                          label="Edit"
                          tone="cyan"
                          onPress={() => beginEdit(reward)}
                          style={styles.smallBtn}
                        />
                        <PrimaryButton
                          label="Del"
                          tone="crimson"
                          onPress={() => onRemoveItem(reward.id)}
                          style={styles.smallBtn}
                        />
                      </View>
                    ) : (
                      <PrimaryButton
                        label={locked ? 'Locked' : affordable ? 'Redeem' : 'Need ★'}
                        tone={affordable ? 'amber' : 'muted'}
                        disabled={!affordable}
                        loading={loading}
                        onPress={() => onRedeem(reward.id)}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            {manageMode ? (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {editingId ? 'Edit Item' : 'Add Item'}
                </Text>
                <Text style={styles.presetLabel}>Activity Generator</Text>
                <View style={styles.dropdown}>
                  <Pressable
                    onPress={() => setPresetMenuOpen((open) => !open)}
                    style={styles.dropdownTrigger}
                  >
                    <Text style={styles.dropdownTriggerText}>
                      {selectedPresetLabel}
                    </Text>
                    <Text style={styles.dropdownCaret}>
                      {presetMenuOpen ? '▴' : '▾'}
                    </Text>
                  </Pressable>
                  {presetMenuOpen ? (
                    <View style={styles.dropdownMenu}>
                      {ACTIVITY_PRESETS.map((preset) => {
                        const active = selectedPreset === preset.id;
                        return (
                          <Pressable
                            key={preset.id}
                            onPress={() => applyPreset(preset.id)}
                            style={[
                              styles.dropdownOption,
                              active && styles.dropdownOptionActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                active && styles.dropdownOptionTextActive,
                              ]}
                            >
                              {preset.title}
                            </Text>
                            <Text style={styles.dropdownOptionCost}>
                              {preset.cost} ★
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
                <Text style={typography.label}>
                  Selecting an activity auto-fills title and price for immediate
                  create or edit.
                </Text>

                <Field
                  label="Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Reward title"
                />
                <Field
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional detail"
                />
                <Field
                  label="Cost (stars)"
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 3"
                />
                <View style={styles.formActions}>
                  <PrimaryButton
                    label={editingId ? 'Save Changes' : 'Create Item'}
                    tone="emerald"
                    loading={loading}
                    disabled={!title.trim() || !cost.trim()}
                    onPress={submitForm}
                    style={{ flex: 1 }}
                  />
                  {editingId ? (
                    <PrimaryButton
                      label="Cancel"
                      tone="muted"
                      onPress={resetForm}
                      style={{ minWidth: 96 }}
                    />
                  ) : null}
                </View>
              </View>
            ) : null}

            <Pressable onPress={onClose} style={styles.close}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </ScrollView>
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
    maxHeight: '92%',
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: colors.border,
    borderWidth: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 24,
    color: colors.amber,
    flex: 1,
  },
  manageBtn: { minWidth: 120 },
  lockOverlay: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.crimson,
    backgroundColor: 'rgba(255, 23, 68, 0.18)',
    padding: 16,
    gap: 8,
  },
  lockEyebrow: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    letterSpacing: 1.2,
    fontSize: 12,
  },
  lockHeadline: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 24,
  },
  lockBody: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  catalogDimmed: {
    opacity: 0.45,
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
  itemActions: { gap: 8 },
  smallBtn: { minWidth: 64, minHeight: 40 },
  form: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
  },
  formTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 16,
  },
  presetLabel: {
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  dropdown: {
    gap: 0,
  },
  dropdownTrigger: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownTriggerText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.textPrimary,
    fontSize: 15,
  },
  dropdownCaret: {
    fontFamily: fonts.bodyBold,
    color: colors.cyan,
    fontSize: 14,
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  dropdownOptionActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
  },
  dropdownOptionText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 14,
  },
  dropdownOptionTextActive: {
    color: colors.cyan,
  },
  dropdownOptionCost: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 13,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
  },
  close: { alignItems: 'center', paddingVertical: 8 },
  closeText: {
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
    fontSize: 16,
  },
});
