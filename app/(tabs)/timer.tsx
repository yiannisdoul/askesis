import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { DurationSlider } from '../../src/components/DurationSlider';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { useTimerStore } from '../../src/stores/timerStore';
import { colors, fonts, typography } from '../../src/theme';
import { formatTimer } from '../../src/utils/dates';

export default function TomodachiTimerScreen() {
  const {
    focusMinutes,
    breakMinutes,
    mode,
    status,
    remainingSeconds,
    setFocusMinutes,
    setBreakMinutes,
    start,
    pause,
    resume,
    reset,
    tick,
    switchMode,
  } = useTimerStore();

  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [status, tick]);

  useEffect(() => {
    if (status === 'finished') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [status]);

  const configuring = status === 'idle' || status === 'finished';

  return (
    <Screen
      title="Tomodachi Timer"
      subtitle="Retro pixel focus blocks for deep work."
    >
      <View style={styles.cabinet}>
        <Text style={styles.modeLabel}>
          {mode === 'focus' ? 'FOCUS BLOCK' : 'BREAK WINDOW'}
        </Text>
        <Text style={styles.timer}>{formatTimer(remainingSeconds)}</Text>
        <Text style={styles.status}>{status.toUpperCase()}</Text>
        <View style={styles.scanlines} />
      </View>

      <DurationSlider
        label="Focus runtime"
        value={focusMinutes}
        min={5}
        max={90}
        accent={colors.amber}
        disabled={!configuring}
        onChange={setFocusMinutes}
      />
      <DurationSlider
        label="Break runtime"
        value={breakMinutes}
        min={1}
        max={30}
        accent={colors.cyan}
        disabled={!configuring}
        onChange={setBreakMinutes}
      />

      <View style={styles.actions}>
        {status === 'idle' || status === 'finished' ? (
          <PrimaryButton label="Start Session" tone="emerald" onPress={start} />
        ) : null}
        {status === 'running' ? (
          <PrimaryButton label="Pause" tone="amber" onPress={pause} />
        ) : null}
        {status === 'paused' ? (
          <PrimaryButton label="Resume" tone="cyan" onPress={resume} />
        ) : null}
        <PrimaryButton label="Reset" tone="muted" onPress={reset} />
        <PrimaryButton
          label={mode === 'focus' ? 'Switch to Break' : 'Switch to Focus'}
          tone="muted"
          onPress={switchMode}
        />
      </View>

      <Text style={typography.label}>
        Defaults: 30-minute focus · 5-minute break. Adjust freely before start.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cabinet: {
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.amber,
    backgroundColor: '#0A0F18',
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
    gap: 10,
  },
  modeLabel: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.cyan,
    letterSpacing: 1,
  },
  timer: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 48,
    color: colors.amber,
    textAlign: 'center',
  },
  status: {
    fontFamily: fonts.display,
    fontSize: 8,
    color: colors.emerald,
  },
  scanlines: {
    ...StyleSheet.absoluteFill,
    opacity: 0.08,
    backgroundColor: colors.cyan,
  },
  actions: { gap: 10 },
});
