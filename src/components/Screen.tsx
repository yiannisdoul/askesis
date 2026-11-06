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
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';

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
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient
      colors={[colors.background, '#0D121C', colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={typography.brand}>ASKESIS</Text>
            <Text style={typography.h1}>{title}</Text>
            {subtitle ? <Text style={typography.body}>{subtitle}</Text> : null}
          </View>
          {rightSlot}
        </View>
        {body}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: { flex: 1, gap: 4 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 16,
  },
});
