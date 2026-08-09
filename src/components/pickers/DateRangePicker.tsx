import { Ionicons } from '@expo/vector-icons';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { Button } from '@/src/components/ui/Button';
import {
  formatDisplayDate,
  fromISODateKey,
  toISODateKey,
} from '@/src/features/calendar/utils/dateKey';
import { useTheme } from '@/src/theme/ThemeProvider';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChangeRange: (startDate: string, endDate: string) => void;
  /** When true, every tap just picks a single day (startDate === endDate) instead of a two-tap range. */
  singleDate?: boolean;
}

/**
 * A compact field showing the current date (or range) — tapping it opens the full calendar in a
 * sheet instead of the grid sitting permanently inline, which made every screen that embeds this
 * (new/apply pattern, clear calendar) feel a lot heavier than picking one or two dates warrants.
 */
export function DateRangePicker({
  startDate,
  endDate,
  onChangeRange,
  singleDate = false,
}: DateRangePickerProps) {
  const { colors, spacing } = useTheme();
  const [visible, setVisible] = useState(false);

  function handleDayPress(day: DateData) {
    const tapped = day.dateString;

    if (singleDate) {
      onChangeRange(tapped, tapped);
      return;
    }

    const hasCompleteRange = startDate !== endDate;
    if (hasCompleteRange || !startDate) {
      onChangeRange(tapped, tapped);
      return;
    }

    if (tapped < startDate) {
      onChangeRange(tapped, startDate);
    } else {
      onChangeRange(startDate, tapped);
    }
  }

  const markedDates = buildRangeMarking(startDate, endDate, colors.tint);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={[styles.field, { borderColor: colors.border, backgroundColor: colors.surface }]}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
        <Text style={[styles.fieldText, { color: colors.text }]}>
          {singleDate
            ? formatDisplayDate(startDate)
            : `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.surfaceElevated, padding: spacing.lg }]}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              {singleDate
                ? 'Tap a date to pick it.'
                : 'Tap a date to start the range, tap again to set the end.'}
            </Text>

            <Calendar
              current={startDate}
              firstDay={1}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
              theme={{
                backgroundColor: colors.background,
                calendarBackground: colors.background,
                textSectionTitleColor: colors.textSecondary,
                monthTextColor: colors.text,
                arrowColor: colors.tint,
                todayTextColor: colors.tint,
                dayTextColor: colors.text,
                textDisabledColor: colors.border,
              }}
            />

            <View style={{ marginTop: spacing.md }}>
              <Button onPress={() => setVisible(false)}>Done</Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/** Marks every day from `start` to `end` (inclusive) as one continuous "period" pill. */
function buildRangeMarking(start: string, end: string, color: string) {
  const marks: Record<
    string,
    { startingDay: boolean; endingDay: boolean; color: string; textColor: string }
  > = {};
  if (!start) return marks;

  const rangeEnd = end || start;
  let cursor = fromISODateKey(start);
  const cursorEnd = fromISODateKey(rangeEnd);

  while (cursor <= cursorEnd) {
    const key = toISODateKey(cursor);
    marks[key] = {
      startingDay: key === start,
      endingDay: key === rangeEnd,
      color,
      textColor: '#FFFFFF',
    };
    cursor = addDays(cursor, 1);
  }
  return marks;
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fieldText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  hint: {
    fontSize: 12,
    marginBottom: 8,
  },
});
