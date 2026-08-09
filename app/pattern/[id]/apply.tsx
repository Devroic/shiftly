import { addDays } from 'date-fns';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import {
  DateRangeModeSelector,
  type DateRangeMode,
} from '@/src/components/pickers/DateRangeModeSelector';
import { FieldLabel } from '@/src/components/ui/FieldLabel';
import { Screen } from '@/src/components/ui/Screen';
import {
  formatDisplayDate,
  fromISODateKey,
  toISODateKey,
  todayKey,
} from '@/src/features/calendar/utils/dateKey';
import { PatternSequenceEditor } from '@/src/features/patterns/components/PatternSequenceEditor';
import { useApplyPattern } from '@/src/features/patterns/hooks/useApplyPattern';
import { usePattern } from '@/src/features/patterns/hooks/usePattern';
import { useUpdatePattern } from '@/src/features/patterns/hooks/useUpdatePattern';
import type { PatternRecord } from '@/src/features/patterns/types';
import type { ShiftType } from '@/src/features/shifts/types';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function ApplyPatternScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pattern = usePattern(Number(id));

  if (!pattern) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Apply pattern' }} />
      </Screen>
    );
  }

  return <ApplyPatternForm pattern={pattern} />;
}

// A separate component so `sequence` only initializes from `pattern` once real data has loaded —
// declaring that state in the parent above would seed it from `pattern` before the async query
// resolves, and useState's initial value is only read on that first, still-empty render.
function ApplyPatternForm({ pattern }: { pattern: PatternRecord }) {
  const { colors, spacing } = useTheme();
  const shiftTypes = useShiftTypes();
  const applyPattern = useApplyPattern();
  const updatePattern = useUpdatePattern();

  const [sequence, setSequence] = useState<ShiftType[]>(pattern.sequence);
  const [dateMode, setDateMode] = useState<DateRangeMode>('auto');
  const [startDate, setStartDate] = useState(todayKey());
  const [endDate, setEndDate] = useState(toISODateKey(addDays(new Date(), 13)));
  const [error, setError] = useState<string | null>(null);

  function handleApply() {
    if (sequence.length === 0) {
      setError('Add at least one step');
      return;
    }

    Alert.alert(
      'Apply pattern',
      `This will set the shift for every day from ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}, overwriting any existing shifts in that range. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            void (async () => {
              await updatePattern(pattern.id, { name: pattern.name, sequence });
              applyPattern(
                pattern.id,
                sequence,
                fromISODateKey(startDate),
                fromISODateKey(endDate),
              );
              // Back to the Patterns list, not the Calendar tab — this screen is reached by
              // tapping a pattern to edit/apply it, so returning there is the expected result.
              router.back();
            })();
          },
        },
      ],
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: pattern.name }} />
      <ScrollView contentContainerStyle={{ gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <PatternSequenceEditor
          shiftTypes={shiftTypes}
          sequence={sequence}
          onChange={(next) => {
            setSequence(next);
            setError(null);
          }}
        />

        <View>
          <FieldLabel>Apply to</FieldLabel>
          <DateRangeModeSelector
            mode={dateMode}
            onChangeMode={setDateMode}
            startDate={startDate}
            endDate={endDate}
            onChangeRange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            autoHint={(start) =>
              `Starts ${formatDisplayDate(start)} and keeps going automatically for about 2 years — reapply later to extend further.`
            }
          />
        </View>

        {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

        <Button onPress={handleApply}>Save & apply</Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 13,
  },
});
