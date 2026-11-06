import { Tabs } from 'expo-router';
import {
  FloatingPillTabBar,
  type FloatingPillTabBarProps,
} from '../../src/components/FloatingPillTabBar';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <FloatingPillTabBar {...(props as unknown as FloatingPillTabBarProps)} />
      )}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 0,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Stars',
          tabBarAccessibilityLabel: 'Stars ledger',
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarAccessibilityLabel: 'Tomodachi study timer',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarAccessibilityLabel: 'Unified journal',
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Media',
          tabBarAccessibilityLabel: 'Source refresher media',
        }}
      />
    </Tabs>
  );
}
