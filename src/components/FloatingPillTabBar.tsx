import { useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';
import {
  ACTIVE_INDICATOR_SIZE,
  FLOATING_NAV_BOTTOM_GAP,
  FLOATING_NAV_HEIGHT,
  FLOATING_NAV_SIDE_INSET,
  TAB_HIT_SIZE,
} from '../constants/layout';

type IconName = keyof typeof Ionicons.glyphMap;

/** Expo Router bottom-tab bar contract (navigateToTab + emitter). */
export interface FloatingPillTabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: object }>;
  };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarAccessibilityLabel?: string;
      };
    }
  >;
  emitter: {
    emit: (event: {
      type: 'tabPress' | 'tabLongPress';
      target: string;
      canPreventDefault?: boolean;
    }) => { defaultPrevented?: boolean };
  };
  navigateToTab: (routeKey: string) => void;
  insets: EdgeInsets;
}

const TAB_ICONS: Record<string, { idle: IconName; active: IconName }> = {
  index: { idle: 'star-outline', active: 'star' },
  timer: { idle: 'timer-outline', active: 'timer' },
  journal: { idle: 'book-outline', active: 'book' },
  media: { idle: 'play-circle-outline', active: 'play-circle' },
};

const SPRING = {
  damping: 18,
  stiffness: 220,
  mass: 0.7,
};

export function FloatingPillTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
}: FloatingPillTabBarProps) {
  const pillWidth = useSharedValue(0);
  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, SPRING);
  }, [state.index, activeIndex]);

  const onPillLayout = (event: LayoutChangeEvent) => {
    pillWidth.value = event.nativeEvent.layout.width;
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const count = Math.max(state.routes.length, 1);
    const slot = pillWidth.value / count;
    const x =
      slot * activeIndex.value + (slot - ACTIVE_INDICATOR_SIZE) / 2;
    return {
      transform: [{ translateX: Number.isFinite(x) ? x : 0 }],
    };
  });

  const bottomOffset = Math.max(insets.bottom, 8) + FLOATING_NAV_BOTTOM_GAP;

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View
        style={[
          styles.anchor,
          {
            bottom: bottomOffset,
            left: FLOATING_NAV_SIDE_INSET,
            right: FLOATING_NAV_SIDE_INSET,
          },
        ]}
      >
        <Animated.View style={[styles.glow, indicatorStyle]} pointerEvents="none" />

        <View style={styles.pill} onLayout={onPillLayout}>
          <BlurView
            intensity={Platform.OS === 'android' ? 48 : 64}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.pillTint} />

          <Animated.View
            pointerEvents="none"
            style={[styles.activeCircle, indicatorStyle]}
          />

          <View style={styles.row} accessibilityRole="tablist">
            {state.routes.map((route, index) => {
              const focused = state.index === index;
              const { options } = descriptors[route.key];
              const icons = TAB_ICONS[route.name] ?? {
                idle: 'ellipse-outline' as IconName,
                active: 'ellipse' as IconName,
              };

              const onPress = () => {
                const event = emitter.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  void Haptics.selectionAsync();
                  navigateToTab(route.key);
                }
              };

              const onLongPress = () => {
                emitter.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="tab"
                  accessibilityState={focused ? { selected: true } : {}}
                  accessibilityLabel={
                    options.tabBarAccessibilityLabel ?? options.title
                  }
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.hit}
                  hitSlop={4}
                >
                  <Ionicons
                    name={focused ? icons.active : icons.idle}
                    size={22}
                    color={focused ? colors.background : colors.textPrimary}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
  anchor: {
    position: 'absolute',
    height: FLOATING_NAV_HEIGHT,
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    left: 0,
    top: (FLOATING_NAV_HEIGHT - ACTIVE_INDICATOR_SIZE) / 2 - 10,
    width: ACTIVE_INDICATOR_SIZE + 20,
    height: ACTIVE_INDICATOR_SIZE + 20,
    marginLeft: -10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 191, 0, 0.38)',
    zIndex: 0,
    ...Platform.select({
      ios: {
        shadowColor: colors.amber,
        shadowOpacity: 0.95,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 0 28px 10px rgba(255, 191, 0, 0.45)',
      },
      default: {},
    }),
  },
  pill: {
    height: FLOATING_NAV_HEIGHT,
    borderRadius: FLOATING_NAV_HEIGHT / 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.45,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
      },
      default: {},
    }),
  },
  pillTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(18, 24, 36, 0.72)',
  },
  activeCircle: {
    position: 'absolute',
    left: 0,
    top: (FLOATING_NAV_HEIGHT - ACTIVE_INDICATOR_SIZE) / 2,
    width: ACTIVE_INDICATOR_SIZE,
    height: ACTIVE_INDICATOR_SIZE,
    borderRadius: ACTIVE_INDICATOR_SIZE / 2,
    backgroundColor: colors.white,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 6,
  },
  hit: {
    minWidth: TAB_HIT_SIZE,
    minHeight: TAB_HIT_SIZE,
    width: TAB_HIT_SIZE,
    height: TAB_HIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
