import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';

const MONTH_LABELS = Array.from({ length: 12 }, (_, month) =>
  format(new Date(2000, month, 1), 'LLL', { locale: enUS }),
);

interface MonthYearPickerProps {
  visible: boolean;
  year: number;
  /** 0-11, the currently visible month — highlighted in the grid. */
  month: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

/** A year-at-a-time month grid for jumping several months ahead or back in one tap. */
export function MonthYearPicker({ visible, year, month, onSelect, onClose }: MonthYearPickerProps) {
  const { colors, spacing } = useTheme();
  const [browseYear, setBrowseYear] = useState(year);

  // Re-center on the actual current year every time the picker opens, rather than remembering
  // wherever it was left browsing the last time it was open.
  useEffect(() => {
    if (visible) setBrowseYear(year);
  }, [visible, year]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surfaceElevated, padding: spacing.lg }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={[styles.yearRow, { gap: spacing.xl, marginBottom: spacing.lg }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous year"
              onPress={() => setBrowseYear((current) => current - 1)}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={22} color={colors.tint} />
            </Pressable>
            <Text style={[styles.yearLabel, { color: colors.text }]}>{browseYear}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next year"
              onPress={() => setBrowseYear((current) => current + 1)}
              hitSlop={8}
            >
              <Ionicons name="chevron-forward" size={22} color={colors.tint} />
            </Pressable>
          </View>

          <View style={[styles.grid, { rowGap: spacing.sm }]}>
            {MONTH_LABELS.map((label, index) => {
              const isSelected = browseYear === year && index === month;
              return (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onSelect(browseYear, index)}
                  style={[
                    styles.monthCell,
                    {
                      backgroundColor: isSelected ? colors.tint : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.monthLabel, { color: isSelected ? '#FFFFFF' : colors.text }]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearLabel: {
    fontSize: 17,
    fontWeight: '700',
    minWidth: 64,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Fixed width, not flexGrow — see ShiftTypePicker for why a flex item left alone on the last
  // row would otherwise stretch to fill the whole line instead of keeping a normal cell width.
  monthCell: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
