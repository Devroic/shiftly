import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

interface FieldLabelProps extends PropsWithChildren {
  style?: TextStyle;
}

export function FieldLabel({ children, style }: FieldLabelProps) {
  const { colors } = useTheme();
  return <Text style={[styles.label, { color: colors.textSecondary }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
});
