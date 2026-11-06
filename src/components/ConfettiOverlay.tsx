import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');
const PIECE_COUNT = 42;
const PALETTE = [colors.amber, colors.cyan, colors.emerald, colors.crimson];

interface ConfettiOverlayProps {
  active: boolean;
  onComplete?: () => void;
}

interface Piece {
  left: number;
  delay: number;
  drift: number;
  color: string;
  size: number;
  rotate: number;
}

export function ConfettiOverlay({ active, onComplete }: ConfettiOverlayProps) {
  const progress = useRef(new Animated.Value(0)).current;

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, index) => ({
        left: Math.random() * width,
        delay: Math.random() * 400,
        drift: (Math.random() - 0.5) * 120,
        color: PALETTE[index % PALETTE.length],
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
      })),
    [],
  );

  useEffect(() => {
    if (!active) {
      progress.setValue(0);
      return;
    }

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      // false keeps opacity + multi-transform interpolation reliable on web.
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onComplete?.();
    });
  }, [active, onComplete, progress]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {pieces.map((piece, index) => {
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, height + 40],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, piece.drift],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.15, 0.85, 1],
          outputRange: [0, 1, 1, 0],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [`${piece.rotate}deg`, `${piece.rotate + 540}deg`],
        });

        return (
          <Animated.View
            key={`confetti-${index}`}
            style={[
              styles.piece,
              {
                left: piece.left,
                width: piece.size,
                height: piece.size * 0.55,
                backgroundColor: piece.color,
                opacity,
                transform: [{ translateY }, { translateX }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});
