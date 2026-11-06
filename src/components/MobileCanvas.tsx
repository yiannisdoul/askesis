import { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme';
import { MOBILE_MAX_WIDTH } from '../constants/layout';

interface MobileCanvasProps {
  children: ReactNode;
}

/**
 * Locks the app onto a portrait smartphone viewport.
 * On wide web/desktop screens the UI sits in a centered phone canvas
 * instead of stretching edge-to-edge.
 */
export function MobileCanvas({ children }: MobileCanvasProps) {
  const { width } = useWindowDimensions();
  const constrain = Platform.OS === 'web' && width > MOBILE_MAX_WIDTH;

  return (
    <View style={styles.stage}>
      <View
        style={[
          styles.phone,
          constrain && styles.phoneConstrained,
          { maxWidth: MOBILE_MAX_WIDTH },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: '#070B12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  phoneConstrained: {
    width: MOBILE_MAX_WIDTH,
    maxHeight: '100%',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...Platform.select({
      web: {
        boxShadow: '0 0 0 1px rgba(46,58,81,0.5), 0 24px 80px rgba(0,0,0,0.55)',
      },
      default: {},
    }),
  },
});
