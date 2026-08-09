import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/src/theme/ThemeProvider';

interface ScreenProps extends PropsWithChildren {
  edges?: Edge[];
  style?: ViewStyle;
}

// Every screen in the app renders under a header (tab header or Stack.Screen header), which
// already reserves the top safe-area inset — including the 'top' edge here too would double it,
// pushing content down by an extra status-bar's worth of empty space.
export function Screen({ children, edges = ['left', 'right'], style }: ScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.content, { padding: spacing.md }, style]}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
