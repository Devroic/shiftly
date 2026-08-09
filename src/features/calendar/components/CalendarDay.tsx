import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ShiftTypeRecord } from '@/src/features/shiftTypes/types';
import { useTheme } from '@/src/theme/ThemeProvider';

import { EMPTY_MARKING, type DayMarking } from '../hooks/useCalendarMarks';
import { todayKey } from '../utils/dateKey';

const MAX_VISIBLE_EVENTS = 2;

export interface CalendarDayDate {
  dateString: string;
  day: number;
}

interface CalendarDayProps {
  date: CalendarDayDate;
  isCurrentMonth: boolean;
  marking?: DayMarking;
  shiftTypeMap: Record<string, ShiftTypeRecord>;
  onPress: () => void;
  height: number;
}

function CalendarDayComponent({
  date,
  isCurrentMonth,
  marking = EMPTY_MARKING,
  shiftTypeMap,
  onPress,
  height,
}: CalendarDayProps) {
  const { colors } = useTheme();

  const isToday = date.dateString === todayKey();
  const { shiftType, events } = marking;
  const shiftInfo = shiftType !== null ? shiftTypeMap[shiftType] : undefined;
  const hasShift = shiftInfo !== undefined;

  const visibleEvents =
    events.length <= MAX_VISIBLE_EVENTS ? events : events.slice(0, MAX_VISIBLE_EVENTS - 1);
  const overflowCount = events.length - visibleEvents.length;

  const cardColor = hasShift ? shiftInfo.color : isToday ? colors.surface : 'transparent';
  const primaryTextColor = hasShift ? '#FFFFFF' : colors.text;
  const secondaryTextColor = hasShift ? 'rgba(255,255,255,0.85)' : colors.textSecondary;
  // A visible ring on today's cell regardless of shift status — white reads on a saturated shift
  // color, tint reads on the plain background — so "where's today" never depends on scanning numbers.
  const todayRingColor = hasShift ? '#FFFFFF' : colors.tint;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.container,
        {
          height,
          backgroundColor: cardColor,
          borderColor: isToday ? todayRingColor : colors.border,
          borderWidth: isToday ? 2 : StyleSheet.hairlineWidth,
          opacity: isCurrentMonth ? 1 : 0.4,
        },
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          { color: primaryTextColor },
          isToday && !hasShift ? { color: colors.tint } : null,
        ]}
      >
        {date.day}
      </Text>

      {hasShift ? (
        <Text style={styles.shiftLabel} numberOfLines={1} adjustsFontSizeToFit>
          {shiftInfo.label}
        </Text>
      ) : null}

      <View style={styles.eventsColumn}>
        {visibleEvents.map((event) => (
          <Text
            key={event.id}
            numberOfLines={1}
            style={[styles.eventText, { color: secondaryTextColor }]}
          >
            {event.title}
          </Text>
        ))}
        {overflowCount > 0 ? (
          <Text
            style={[
              styles.eventText,
              styles.overflowText,
              { color: hasShift ? '#FFFFFF' : colors.tint },
            ]}
          >
            {`+${overflowCount}`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export const CalendarDay = memo(CalendarDayComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 1,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 2,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  shiftLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  eventsColumn: {
    marginTop: 2,
    gap: 1,
  },
  eventText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  overflowText: {
    fontWeight: '700',
  },
});
