import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../src/theme';
import { useStarStore } from '../src/stores/starStore';
import { isFirebaseConfigured } from '../src/services/firebase';

export default function RootLayout() {
  const hydrate = useStarStore((state) => state.hydrate);
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.amber} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      {/* Mode badge for operators: local vs Firestore */}
      <View pointerEvents="none" style={styles.modeBadge}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isFirebaseConfigured
                ? colors.emerald
                : colors.amber,
            },
          ]}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  boot: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
