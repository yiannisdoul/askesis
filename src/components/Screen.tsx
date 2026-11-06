import { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { FLOATING_NAV_CONTENT_INSET } from '../constants/layout';

interface ScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  rightSlot?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  title,
  subtitle,
  children,
  scroll = true,
  rightSlot,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = FLOATING_NAV_CONTENT_INSET + Math.max(insets.bottom, 8);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPad },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        styles.flex,
        { paddingBottom: bottomPad },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background, '#0D121C', colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <View style={[styles.flex, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={typography.brand}>ASKESIS</Text>
            <Text style={typography.h1}>{title}</Text>
            {subtitle ? <Text style={typography.body}>{subtitle}</Text> : null}
          </View>
          {rightSlot}
        </View>
        {body}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, width: '100%', maxWidth: '100%' },
  header: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: { flex: 1, gap: 4, minWidth: 0 },
  content: {
    paddingHorizontal: 18,
    gap: 14,
    width: '100%',
  },
});
