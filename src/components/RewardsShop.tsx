import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ACTIVITY_PRESETS } from '../constants/starFramework';
import type { ShopItem } from '../models/types';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import { isShopLocked, shopUnlockTarget } from '../utils/economy';
import { Field } from './Field';
import { PrimaryButton } from './PrimaryButton';

const TOUCH_MIN = 44;

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
  const insets = useSafeAreaInsets();
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
        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View style={styles.handle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.headerStack}>
              <Text style={styles.title}>Rewards Shop</Text>
              <Text style={styles.balanceLine}>
                Available balance: {formatStars(balance)} ★
              </Text>
              <PrimaryButton
                label={manageMode ? 'Done' : 'Edit Catalog'}
                tone="muted"
                onPress={() => {
                  setManageMode((v) => !v);
                  if (manageMode) resetForm();
                }}
                style={styles.fullWidthBtn}
              />
            </View>

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

            <View style={[styles.catalog, locked ? styles.catalogDimmed : null]}>
              {items.map((reward) => {
                const affordable = !locked && balance >= reward.cost;
                return (
                  <View key={reward.id} style={styles.item}>
                    <View style={styles.itemCopy}>
                      <Text style={styles.itemTitle}>{reward.title}</Text>
                      {reward.description ? (
                        <Text style={styles.itemDescription}>
                          {reward.description}
                        </Text>
                      ) : null}
                      <Text style={styles.cost}>{reward.cost} stars</Text>
                    </View>

                    {manageMode ? (
                      <View style={styles.itemActions}>
                        <PrimaryButton
                          label="Edit"
                          tone="cyan"
                          onPress={() => beginEdit(reward)}
                          style={styles.fullWidthBtn}
                        />
                        <PrimaryButton
                          label="Del"
                          tone="crimson"
                          onPress={() => onRemoveItem(reward.id)}
                          style={styles.fullWidthBtn}
                        />
                      </View>
                    ) : (
                      <PrimaryButton
                        label={
                          locked ? 'Locked' : affordable ? 'Redeem' : 'Need ★'
                        }
                        tone={affordable ? 'amber' : 'muted'}
                        disabled={!affordable}
                        loading={loading}
                        onPress={() => onRedeem(reward.id)}
                        style={styles.fullWidthBtn}
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
                    onPress={() => setPresetMenuOpen((isOpen) => !isOpen)}
                    style={styles.dropdownTrigger}
                  >
                    <Text style={styles.dropdownTriggerText} numberOfLines={2}>
                      {selectedPresetLabel}
                    </Text>
                    <Text style={styles.dropdownCaret}>
                      {presetMenuOpen ? '▴' : '▾'}
                    </Text>
                  </Pressable>
                  {presetMenuOpen ? (
                    <View style={styles.dropdownMenu}>
                      {ACTIVITY_PRESETS.map((preset, index) => {
                        const active = selectedPreset === preset.id;
                        return (
                          <Pressable
                            key={preset.id}
                            onPress={() => applyPreset(preset.id)}
                            style={[
                              styles.dropdownOption,
                              index === 0 && styles.dropdownOptionFirst,
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
                <Text style={styles.helperText}>
                  Selecting an activity auto-fills title and price for immediate
                  create or edit.
                </Text>

                <Field
                  label="Title"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Reward title"
                  style={styles.fieldInput}
                />
                <Field
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional detail"
                  style={styles.fieldInput}
                />
                <Field
                  label="Cost (stars)"
                  value={cost}
                  onChangeText={setCost}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 3"
                  style={styles.fieldInput}
                />

                <View style={styles.formActions}>
                  <PrimaryButton
                    label={editingId ? 'Save Changes' : 'Create Item'}
                    tone="emerald"
                    loading={loading}
                    disabled={!title.trim() || !cost.trim()}
                    onPress={submitForm}
                    style={styles.fullWidthBtn}
                  />
                  {editingId ? (
                    <PrimaryButton
                      label="Cancel"
                      tone="muted"
                      onPress={resetForm}
                      style={styles.fullWidthBtn}
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
    width: '100%',
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '94%',
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 10,
    marginBottom: 4,
  },
  scrollContent: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 12,
  },
  headerStack: {
    width: '100%',
    gap: 10,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.amber,
    width: '100%',
  },
  balanceLine: {
    ...typography.body,
    width: '100%',
  },
  fullWidthBtn: {
    width: '100%',
    minHeight: TOUCH_MIN,
    alignSelf: 'stretch',
  },
  lockOverlay: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.crimson,
    backgroundColor: 'rgba(255, 23, 68, 0.18)',
    paddingVertical: 14,
    paddingHorizontal: 14,
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
    fontSize: 17,
    lineHeight: 24,
  },
  lockBody: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  catalog: {
    width: '100%',
    gap: 10,
  },
  catalogDimmed: {
    opacity: 0.45,
  },
  item: {
    width: '100%',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  itemCopy: {
    width: '100%',
    gap: 4,
  },
  itemTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  itemDescription: {
    ...typography.label,
    width: '100%',
  },
  cost: {
    marginTop: 2,
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    fontSize: 14,
  },
  itemActions: {
    width: '100%',
    gap: 8,
  },
  form: {
    width: '100%',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
  },
  formTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 17,
    width: '100%',
  },
  presetLabel: {
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    fontSize: 13,
    letterSpacing: 0.4,
    width: '100%',
  },
  dropdown: {
    width: '100%',
  },
  dropdownTrigger: {
    width: '100%',
    minHeight: TOUCH_MIN,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  dropdownTriggerText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  dropdownCaret: {
    fontFamily: fonts.bodyBold,
    color: colors.cyan,
    fontSize: 14,
    minWidth: TOUCH_MIN,
    textAlign: 'center',
  },
  dropdownMenu: {
    width: '100%',
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  dropdownOption: {
    width: '100%',
    minHeight: TOUCH_MIN,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  dropdownOptionFirst: {
    borderTopWidth: 0,
  },
  dropdownOptionActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
  },
  dropdownOptionText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  dropdownOptionTextActive: {
    color: colors.cyan,
  },
  dropdownOptionCost: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 13,
  },
  helperText: {
    ...typography.label,
    width: '100%',
  },
  fieldInput: {
    width: '100%',
    minHeight: TOUCH_MIN,
  },
  formActions: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  close: {
    width: '100%',
    minHeight: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  closeText: {
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
    fontSize: 16,
  },
});
