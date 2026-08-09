import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import {
  DateRangeModeSelector,
  type DateRangeMode,
} from '@/src/components/pickers/DateRangeModeSelector';
import { Screen } from '@/src/components/ui/Screen';
import { formatDisplayDate, todayKey } from '@/src/features/calendar/utils/dateKey';
import { useClearCalendarRange } from '@/src/features/shifts/hooks/useClearCalendarRange';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function ClearCalendarScreen() {
  const { spacing } = useTheme();
  const clearCalendarRange = useClearCalendarRange();

  const [mode, setMode] = useState<DateRangeMode>('auto');
  const [startDate, setStartDate] = useState(todayKey());
  const [endDate, setEndDate] = useState(todayKey());

  function handleClear() {
    const message =
      mode === 'auto'
        ? `This will remove every shift AND every event from ${formatDisplayDate(startDate)} onward, for about 2 years ahead. This can't be undone.`
        : `This will remove every shift AND every event from ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}. This can't be undone.`;

    Alert.alert('Clear calendar?', message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCalendarRange(startDate, endDate);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Clear calendar' }} />
      <ScrollView contentContainerStyle={{ gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <DateRangeModeSelector
          mode={mode}
          onChangeMode={setMode}
          startDate={startDate}
          endDate={endDate}
          onChangeRange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          autoHint={(start) =>
            `Clears every shift and event from ${formatDisplayDate(start)} onward, for about 2 years ahead.`
          }
        />

        <Button variant="danger" onPress={handleClear}>
          Clear calendar
        </Button>
      </ScrollView>
    </Screen>
  );
}
