import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ShiftTypeRecord } from '@/src/features/shiftTypes/types';
import { useTheme } from '@/src/theme/ThemeProvider';

import type { ShiftType } from '../types';

interface ShiftTypePickerProps {
  shiftTypes: ShiftTypeRecord[];
  value: ShiftType | null;
  onChange: (type: ShiftType | null) => void;
}

/** Selector for the day's shift, built from whatever shift types the user currently has. Tapping the selected option clears it. */
export function ShiftTypePicker({ shiftTypes, value, onChange }: ShiftTypePickerProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { rowGap: spacing.sm }]}>
      {shiftTypes.map((type) => {
        const selected = value === type.key;
        return (
          <Pressable
            key={type.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(selected ? null : type.key)}
            style={[
              styles.option,
              {
                backgroundColor: selected ? type.color : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.text }]}>
              {type.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Fixed width instead of flexGrow: with an odd number of shift types, a flexGrow item left
  // alone on the last row stretches to fill the whole line instead of staying half-width.
  option: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
