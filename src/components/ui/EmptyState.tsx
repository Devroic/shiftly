import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

interface EmptyStateProps {
  message: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl, gap: spacing.sm }]}>
      {icon ? <Ionicons name={icon} size={40} color={colors.border} /> : null}
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
  },
});
