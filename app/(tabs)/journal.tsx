import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Field } from '../../src/components/Field';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import NativeSlider from '../../src/components/NativeSlider';
import { useJournalStore } from '../../src/stores/journalStore';
import { colors, fonts, typography } from '../../src/theme';
import type { TradePosition, TradeSession, WorkoutType } from '../../src/models/types';

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmentRow}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function JournalScreen() {
  const store = useJournalStore();

  useEffect(() => {
    void store.hydrate();
  }, []);

  return (
    <Screen
      title="Unified Journal"
      subtitle="Workouts · Forex · Dopamine baseline"
    >
      <Text style={styles.section}>Daily Metrics</Text>
      <Field
        label="Water (ml)"
        keyboardType="numeric"
        value={String(store.waterIntakeMl)}
        onChangeText={(text) =>
          store.setField('waterIntakeMl', Number(text.replace(/[^\d]/g, '')) || 0)
        }
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Field
            label="Calories"
            keyboardType="numeric"
            value={String(store.totalCalories)}
            onChangeText={(text) =>
              store.setField(
                'totalCalories',
                Number(text.replace(/[^\d]/g, '')) || 0,
              )
            }
          />
        </View>
        <View style={styles.half}>
          <Field
            label="Protein (g)"
            keyboardType="numeric"
            value={String(store.proteinG)}
            onChangeText={(text) =>
              store.setField('proteinG', Number(text.replace(/[^\d]/g, '')) || 0)
            }
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <Field
            label="Carbs (g)"
            keyboardType="numeric"
            value={String(store.carbsG)}
            onChangeText={(text) =>
              store.setField('carbsG', Number(text.replace(/[^\d]/g, '')) || 0)
            }
          />
        </View>
        <View style={styles.half}>
          <Field
            label="Fats (g)"
            keyboardType="numeric"
            value={String(store.fatsG)}
            onChangeText={(text) =>
              store.setField('fatsG', Number(text.replace(/[^\d]/g, '')) || 0)
            }
          />
        </View>
      </View>

      <Text style={styles.section}>Daily Dopamine & Mental Health</Text>
      <View style={styles.gauge}>
        <Text style={styles.gaugeValue}>{store.mentalHealthScore}/10</Text>
        <NativeSlider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={store.mentalHealthScore}
          onValueChange={(value) => store.setField('mentalHealthScore', value)}
          minimumTrackTintColor={colors.emerald}
          thumbTintColor={colors.cyan}
        />
        <Text style={typography.label}>
          1 = depleted · 10 = clear, stable, high agency
        </Text>
      </View>

      <Field
        label="Journal notes"
        multiline
        numberOfLines={4}
        style={styles.multiline}
        value={store.journalText}
        onChangeText={(text) => store.setField('journalText', text)}
        placeholder="Evening reflection..."
      />
      <PrimaryButton
        label="Save Daily Log"
        tone="emerald"
        loading={store.saving}
        onPress={() => void store.saveDaily()}
      />

      <Text style={styles.section}>Workout Log</Text>
      <Segmented<WorkoutType>
        value={store.workoutType}
        onChange={(value) => store.setField('workoutType', value)}
        options={[
          { label: 'Calisthenics', value: 'calisthenics' },
          { label: 'Running', value: 'running' },
        ]}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Field
            label="Distance (km)"
            value={store.distanceKm}
            onChangeText={(text) => store.setField('distanceKm', text)}
          />
        </View>
        <View style={styles.half}>
          <Field
            label="Duration (min)"
            value={store.durationMin}
            onChangeText={(text) => store.setField('durationMin', text)}
          />
        </View>
      </View>
      <Field
        label="Pace (min/km)"
        value={store.paceMinKm}
        onChangeText={(text) => store.setField('paceMinKm', text)}
      />
      <Field
        label="Push-ups sets (comma-separated)"
        value={store.pushups}
        onChangeText={(text) => store.setField('pushups', text)}
      />
      <Field
        label="Rows sets"
        value={store.rows}
        onChangeText={(text) => store.setField('rows', text)}
      />
      <Field
        label="Squats sets"
        value={store.squats}
        onChangeText={(text) => store.setField('squats', text)}
      />
      <View style={styles.gauge}>
        <Text style={styles.subLabel}>RIR Target: {store.rirTarget}</Text>
        <NativeSlider
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={store.rirTarget}
          onValueChange={(value) => store.setField('rirTarget', value)}
          minimumTrackTintColor={colors.amber}
          thumbTintColor={colors.amber}
        />
      </View>
      <Field
        label="Injuries / physical fatigue notes"
        multiline
        numberOfLines={3}
        style={styles.multiline}
        value={store.physicalNotes}
        onChangeText={(text) => store.setField('physicalNotes', text)}
        placeholder="Joints, fatigue, structural warnings..."
      />
      <PrimaryButton
        label="Save Workout"
        tone="cyan"
        loading={store.saving}
        onPress={() => void store.saveWorkout()}
      />

      <Text style={styles.section}>Forex Trading Log</Text>
      <Segmented<TradeSession>
        value={store.session}
        onChange={(value) => store.setField('session', value)}
        options={[
          { label: 'Morning', value: 'morning' },
          { label: 'Evening', value: 'evening' },
        ]}
      />
      <Segmented<TradePosition>
        value={store.positionType}
        onChange={(value) => store.setField('positionType', value)}
        options={[
          { label: 'Buy', value: 'buy' },
          { label: 'Sell', value: 'sell' },
        ]}
      />
      <Field
        label="Currency pair"
        autoCapitalize="characters"
        value={store.pair}
        onChangeText={(text) => store.setField('pair', text)}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Field
            label="Entry"
            value={store.entryPrice}
            onChangeText={(text) => store.setField('entryPrice', text)}
          />
        </View>
        <View style={styles.half}>
          <Field
            label="Exit"
            value={store.exitPrice}
            onChangeText={(text) => store.setField('exitPrice', text)}
          />
        </View>
      </View>
      <Field
        label="Net pips"
        value={store.resultPips}
        onChangeText={(text) => store.setField('resultPips', text)}
      />
      <Field
        label="Operational market analysis"
        multiline
        numberOfLines={4}
        style={styles.multiline}
        value={store.analysis}
        onChangeText={(text) => store.setField('analysis', text)}
        placeholder="H1 alignment, structure, invalidation..."
      />
      <PrimaryButton
        label="Save Trade"
        tone="amber"
        loading={store.saving}
        onPress={() => void store.saveTrade()}
      />

      {store.message ? <Text style={styles.message}>{store.message}</Text> : null}
      {store.error ? <Text style={styles.error}>{store.error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
    marginTop: 8,
  },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  gauge: {
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  gaugeValue: {
    fontFamily: fonts.bodyBold,
    color: colors.emerald,
    fontSize: 28,
  },
  subLabel: {
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
  },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
  },
  segmentActive: {
    borderColor: colors.cyan,
    backgroundColor: '#12303A',
  },
  segmentText: {
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
  },
  segmentTextActive: { color: colors.cyan },
  message: {
    fontFamily: fonts.bodyMedium,
    color: colors.emerald,
  },
  error: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
  },
});
