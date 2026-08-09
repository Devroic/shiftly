import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ShiftTypeRecord } from '@/src/features/shiftTypes/types';
import { useTheme } from '@/src/theme/ThemeProvider';

import type { ShiftType } from '@/src/features/shifts/types';

interface PatternSequenceEditorProps {
  shiftTypes: ShiftTypeRecord[];
  sequence: ShiftType[];
  onChange: (sequence: ShiftType[]) => void;
}

/** Tap a palette chip to append a step; reorder or remove steps with the controls on each chip. */
export function PatternSequenceEditor({
  shiftTypes,
  sequence,
  onChange,
}: PatternSequenceEditorProps) {
  const { colors, spacing } = useTheme();
  const shiftTypeMap = useMemo(
    () => Object.fromEntries(shiftTypes.map((type) => [type.key, type])),
    [shiftTypes],
  );

  function addStep(type: ShiftType) {
    onChange([...sequence, type]);
  }

  function removeStep(index: number) {
    onChange(sequence.filter((_, i) => i !== index));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sequence.length) return;
    const next = [...sequence];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Tap to add a step. This cycle repeats for the whole range.
      </Text>

      <View style={[styles.stepsRow, { gap: spacing.sm }]}>
        {sequence.length === 0 ? (
          <Text style={[styles.emptyLabel, { color: colors.textSecondary }]}>
            Add at least one step
          </Text>
        ) : (
          sequence.map((step, index) => (
            <View
              key={`${step}-${index}`}
              style={[styles.step, { backgroundColor: shiftTypeMap[step]?.color ?? colors.border }]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Move earlier"
                onPress={() => moveStep(index, -1)}
                disabled={index === 0}
                hitSlop={6}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color="#FFFFFF"
                  style={{ opacity: index === 0 ? 0.3 : 1 }}
                />
              </Pressable>
              <Text style={styles.stepLabel}>{shiftTypeMap[step]?.label ?? step}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Move later"
                onPress={() => moveStep(index, 1)}
                disabled={index === sequence.length - 1}
                hitSlop={6}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#FFFFFF"
                  style={{ opacity: index === sequence.length - 1 ? 0.3 : 1 }}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove"
                onPress={() => removeStep(index)}
                hitSlop={6}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <View style={[styles.paletteRow, { gap: spacing.sm }]}>
        {shiftTypes.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => addStep(type.key)}
            style={[styles.paletteChip, { borderColor: type.color }]}
          >
            <Text style={[styles.paletteLabel, { color: type.color }]}>{`+ ${type.label}`}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 12,
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyLabel: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paletteChip: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  paletteLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
