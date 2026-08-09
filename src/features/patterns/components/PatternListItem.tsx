import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ShiftTypeRecord } from '@/src/features/shiftTypes/types';
import { useTheme } from '@/src/theme/ThemeProvider';

import type { PatternRecord } from '../types';

interface PatternListItemProps {
  pattern: PatternRecord;
  shiftTypeMap: Record<string, ShiftTypeRecord>;
  onPress: () => void;
  onDelete: () => void;
}

export function PatternListItem({
  pattern,
  shiftTypeMap,
  onPress,
  onDelete,
}: PatternListItemProps) {
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
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {pattern.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete"
          onPress={onDelete}
          hitSlop={8}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
      <View style={[styles.sequenceRow, { gap: 6, marginTop: 8 }]}>
        {pattern.sequence.map((step, index) => (
          <View
            key={`${step}-${index}`}
            style={[styles.chip, { backgroundColor: shiftTypeMap[step]?.color ?? colors.border }]}
          >
            <Text style={styles.chipLabel}>{shiftTypeMap[step]?.label ?? step}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  sequenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
