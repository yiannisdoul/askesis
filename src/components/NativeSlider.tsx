import { useMemo } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import { useState } from 'react';

interface NativeSliderProps {
  minimumValue: number;
  maximumValue: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  disabled?: boolean;
}

/**
 * Lightweight dependency-free slider for Expo web/native.
 * Avoids community slider native modules while preserving drag UX.
 */
export default function NativeSlider({
  minimumValue,
  maximumValue,
  step = 1,
  value,
  onValueChange,
  minimumTrackTintColor = '#00E5FF',
  maximumTrackTintColor = '#2E3A51',
  thumbTintColor = '#FFBF00',
  disabled,
}: NativeSliderProps) {
  const [width, setWidth] = useState(1);
  const range = maximumValue - minimumValue;
  const ratio = range === 0 ? 0 : (value - minimumValue) / range;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (evt) => {
          updateFromX(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (evt) => {
          updateFromX(evt.nativeEvent.locationX);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, width, minimumValue, maximumValue, step],
  );

  function updateFromX(x: number) {
    const clampedX = Math.min(Math.max(x, 0), width);
    const raw = minimumValue + (clampedX / width) * range;
    const stepped = Math.round(raw / step) * step;
    const next = Math.min(maximumValue, Math.max(minimumValue, stepped));
    onValueChange(next);
  }

  function onLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      style={styles.track}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.rail,
          { backgroundColor: maximumTrackTintColor },
        ]}
      />
      <View
        style={[
          styles.fill,
          {
            width: `${ratio * 100}%`,
            backgroundColor: minimumTrackTintColor,
          },
        ]}
      />
      <View
        style={[
          styles.thumb,
          {
            left: Math.max(0, ratio * width - 10),
            backgroundColor: thumbTintColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 28,
    justifyContent: 'center',
  },
  rail: {
    height: 6,
    borderRadius: 999,
    width: '100%',
  },
  fill: {
    position: 'absolute',
    height: 6,
    borderRadius: 999,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
