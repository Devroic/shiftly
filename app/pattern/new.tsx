import { addDays } from 'date-fns';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
import { useCreatePattern } from '@/src/features/patterns/hooks/useCreatePattern';
import { usePatterns } from '@/src/features/patterns/hooks/usePatterns';
import type { ShiftType } from '@/src/features/shifts/types';
import { useShiftTypes } from '@/src/features/shiftTypes/hooks/useShiftTypes';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function NewPatternScreen() {
  const { colors, spacing } = useTheme();
  const shiftTypes = useShiftTypes();
  const existingPatterns = usePatterns();
  const createPattern = useCreatePattern();
  const applyPattern = useApplyPattern();

  const [name, setName] = useState('');
  const [sequence, setSequence] = useState<ShiftType[]>([]);
  const [dateMode, setDateMode] = useState<DateRangeMode>('auto');
  const [startDate, setStartDate] = useState(todayKey());
  const [endDate, setEndDate] = useState(toISODateKey(addDays(new Date(), 13)));
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName || sequence.length === 0) {
      setError(!trimmedName ? 'Title is required' : 'Add at least one step');
      return;
    }
    const isDuplicateName = existingPatterns.some(
      (pattern) => pattern.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicateName) {
      setError('A pattern with this name already exists');
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
              const patternId = await createPattern({ name: trimmedName, sequence });
              applyPattern(patternId, sequence, fromISODateKey(startDate), fromISODateKey(endDate));
              // Back to the Patterns list, not the Calendar tab — this screen is reached from
              // there, so returning there is the expected result (see apply.tsx).
              router.back();
            })();
          },
        },
      ],
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'New pattern' }} />
      <ScrollView contentContainerStyle={{ gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <View>
          <FieldLabel>Pattern name</FieldLabel>
          <TextInput
            value={name}
            onChangeText={(value) => {
              setName(value);
              setError(null);
            }}
            placeholder="e.g. 2 days, 2 nights, 4 off"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
            ]}
          />
        </View>

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

        <Button onPress={handleSave}>Save & apply</Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  error: {
    fontSize: 13,
  },
});
