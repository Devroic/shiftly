import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

interface SectionHeaderProps extends PropsWithChildren {
  style?: TextStyle;
}

export function SectionHeader({ children, style }: SectionHeaderProps) {
  const { colors } = useTheme();
  return <Text style={[styles.title, { color: colors.text }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
});
