import { addDays, differenceInCalendarDays } from 'date-fns';

import { toISODateKey } from '@/src/features/calendar/utils/dateKey';
import type { ShiftType } from '@/src/features/shifts/types';

export interface GeneratedShift {
  date: string;
  type: ShiftType;
}

/**
 * Given a repeating sequence and an inclusive [startDate, endDate] range, returns one
 * {date, type} entry per day, cycling through `sequence` by day offset from startDate.
 * Pure — no DB, no I/O — so applying a pattern is just generate-then-upsert.
 */
export function generatePatternShifts(
  sequence: readonly ShiftType[],
  startDate: Date,
  endDate: Date,
): GeneratedShift[] {
  if (sequence.length === 0) {
    throw new Error('Pattern sequence must contain at least one shift type.');
  }

  const totalDays = differenceInCalendarDays(endDate, startDate);
  if (totalDays < 0) {
    throw new Error('endDate must not be before startDate.');
  }

  const result: GeneratedShift[] = [];
  for (let dayIndex = 0; dayIndex <= totalDays; dayIndex++) {
    result.push({
      date: toISODateKey(addDays(startDate, dayIndex)),
      type: sequence[dayIndex % sequence.length],
    });
  }
  return result;
}
