import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { MonthCalendar } from '@/src/features/calendar/components/MonthCalendar';

export default function CalendarScreen() {
  // Set by screens that just changed a date range elsewhere (e.g. applying a pattern) and want
  // to land the user on the month that actually changed, instead of wherever the grid was left.
  const { month } = useLocalSearchParams<{ month?: string }>();

  return (
    <Screen style={{ padding: 0 }}>
      <MonthCalendar
        jumpToMonth={month}
        onDayPress={(dateKey) =>
          router.push({ pathname: '/day/[date]', params: { date: dateKey } })
        }
      />
    </Screen>
  );
}
