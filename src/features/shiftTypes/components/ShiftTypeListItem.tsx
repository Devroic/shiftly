import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import type { ShiftTypeRecord } from '../types';

interface ShiftTypeListItemProps {
  shiftType: ShiftTypeRecord;
  onPress: () => void;
}

export function ShiftTypeListItem({ shiftType, onPress }: ShiftTypeListItemProps) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border, padding: spacing.md },
      ]}
    >
      <View style={[styles.swatch, { backgroundColor: shiftType.color }]} />
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
        {shiftType.label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
    gap: 12,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
