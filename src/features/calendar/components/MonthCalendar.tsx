import { Ionicons } from '@expo/vector-icons';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { useShiftTypeMap } from '@/src/features/shiftTypes/hooks/useShiftTypeMap';
import { useClearCalendarRange } from '@/src/features/shifts/hooks/useClearCalendarRange';
import { useTheme } from '@/src/theme/ThemeProvider';

import { useCalendarMarks } from '../hooks/useCalendarMarks';
import { fromISODateKey, toISODateKey } from '../utils/dateKey';
import { CalendarDay } from './CalendarDay';
import { MonthYearPicker } from './MonthYearPicker';

const MIN_CELL_HEIGHT = 76;
/** Approximate combined height of the month-title row, shift-count summary, and weekday row above the grid. */
const CHROME_HEIGHT_ESTIMATE = 102;

const WEEKDAY_LABELS = eachDayOfInterval({
  start: startOfWeek(new Date(), { weekStartsOn: 1 }),
  end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
}).map((day) => format(day, 'EEEEEE', { locale: enUS }));

interface MonthCalendarProps {
  onDayPress: (dateKey: string) => void;
  /** A date key to jump the grid to (e.g. after applying a pattern elsewhere) — any day within the target month. */
  jumpToMonth?: string;
}

/**
 * Hand-rolled month grid (date-fns + plain flexbox) instead of react-native-calendars' own
 * day-rendering pipeline: a custom `dayComponent` with per-cell explicit heights there caused
 * every week row to render on top of the others instead of stacking, so full control here is
 * both simpler and more reliable than fighting that library's internal layout assumptions.
 */
export function MonthCalendar({ onDayPress, jumpToMonth }: MonthCalendarProps) {
  const { colors, spacing } = useTheme();
  const clearCalendarRange = useClearCalendarRange();
  const shiftTypeMap = useShiftTypeMap();

  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [gridHeight, setGridHeight] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const marks = useCalendarMarks(visibleMonth);

  // Runs on every change, not just mount — the Calendar tab typically stays mounted when you
  // navigate away and back, so a plain useState initial value would never see a later jump target.
  useEffect(() => {
    if (jumpToMonth) {
      setVisibleMonth(startOfMonth(fromISODateKey(jumpToMonth)));
    }
  }, [jumpToMonth]);

  const shiftCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mark of Object.values(marks)) {
      if (mark.shiftType) counts[mark.shiftType] = (counts[mark.shiftType] ?? 0) + 1;
    }
    return counts;
  }, [marks]);

  const summaryEntries = useMemo(
    () =>
      Object.values(shiftTypeMap)
        .filter((type) => shiftCounts[type.key] > 0)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((type) => ({ type, count: shiftCounts[type.key] })),
    [shiftTypeMap, shiftCounts],
  );

  const gridDays = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [visibleMonth]);

  const rowCount = gridDays.length / 7;
  const cellHeight =
    gridHeight > 0
      ? Math.max(MIN_CELL_HEIGHT, Math.floor((gridHeight - CHROME_HEIGHT_ESTIMATE) / rowCount))
      : MIN_CELL_HEIGHT;

  const handleGridLayout = useCallback((event: LayoutChangeEvent) => {
    setGridHeight(event.nativeEvent.layout.height);
  }, []);

  const goToPreviousMonth = useCallback(() => setVisibleMonth((month) => subMonths(month, 1)), []);
  const goToNextMonth = useCallback(() => setVisibleMonth((month) => addMonths(month, 1)), []);
  const goToToday = useCallback(() => setVisibleMonth(startOfMonth(new Date())), []);
  const isViewingCurrentMonth = isSameMonth(visibleMonth, new Date());

  const handleSelectMonth = useCallback((year: number, month: number) => {
    setVisibleMonth(startOfMonth(new Date(year, month, 1)));
    setPickerVisible(false);
  }, []);

  const handleClearMonth = useCallback(() => {
    const monthLabel = format(visibleMonth, 'LLLL yyyy', { locale: enUS });
    Alert.alert(
      `Clear ${monthLabel}?`,
      `This will remove every shift and event in ${monthLabel}. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCalendarRange(
              toISODateKey(startOfMonth(visibleMonth)),
              toISODateKey(endOfMonth(visibleMonth)),
            );
          },
        },
      ],
    );
  }, [visibleMonth, clearCalendarRange]);

  return (
    <View style={styles.container} onLayout={handleGridLayout}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        {isViewingCurrentMonth ? (
          <View style={styles.todaySlot} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go to today"
            onPress={goToToday}
            hitSlop={8}
            style={styles.todaySlot}
          >
            <Text style={[styles.todayLabel, { color: colors.tint }]}>Today</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={goToPreviousMonth}
          hitSlop={8}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={22} color={colors.tint} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose month and year"
          onPress={() => setPickerVisible(true)}
          style={styles.monthTitleButton}
        >
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {format(visibleMonth, 'LLLL yyyy', { locale: enUS })}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={goToNextMonth}
          hitSlop={8}
          style={styles.navButton}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.tint} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear this month"
          onPress={handleClearMonth}
          hitSlop={8}
          style={styles.clearButton}
        >
          <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      {summaryEntries.length > 0 ? (
        <View style={[styles.summaryRow, { paddingHorizontal: spacing.md, gap: spacing.md }]}>
          {summaryEntries.map(({ type, count }) => (
            <View key={type.id} style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: type.color }]} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {count} {type.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text key={index} style={[styles.weekdayLabel, { color: colors.textSecondary }]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {gridDays.map((day) => {
          const dateKey = toISODateKey(day);
          return (
            <View key={dateKey} style={[styles.cellWrapper, { height: cellHeight }]}>
              <CalendarDay
                date={{ dateString: dateKey, day: day.getDate() }}
                isCurrentMonth={isSameMonth(day, visibleMonth)}
                marking={marks[dateKey]}
                shiftTypeMap={shiftTypeMap}
                onPress={() => onDayPress(dateKey)}
                height={cellHeight}
              />
            </View>
          );
        })}
      </View>

      <MonthYearPicker
        visible={pickerVisible}
        year={visibleMonth.getFullYear()}
        month={visibleMonth.getMonth()}
        onSelect={handleSelectMonth}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navButton: {
    paddingHorizontal: 8,
  },
  todaySlot: {
    minWidth: 44,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  todayLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  monthTitleButton: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
  },
  cellWrapper: {
    width: '14.2857%',
  },
});
