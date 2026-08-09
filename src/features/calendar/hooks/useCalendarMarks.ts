import { endOfMonth, startOfMonth } from 'date-fns';
import { and, asc, gte, lte } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';

import { db } from '@/src/db';
import { events, shifts } from '@/src/db/schema';
import type { ShiftType } from '@/src/features/shifts/types';

import { toISODateKey } from '../utils/dateKey';

export interface DayEventPreview {
  id: number;
  title: string;
  time: string | null;
}

export interface DayMarking {
  shiftType: ShiftType | null;
  events: DayEventPreview[];
}

export const EMPTY_MARKING: DayMarking = { shiftType: null, events: [] };

export function useCalendarMarks(visibleMonth: Date): Record<string, DayMarking> {
  const rangeStart = toISODateKey(startOfMonth(visibleMonth));
  const rangeEnd = toISODateKey(endOfMonth(visibleMonth));

  const { data: shiftRows } = useLiveQuery(
    db
      .select({ date: shifts.date, type: shifts.type })
      .from(shifts)
      .where(and(gte(shifts.date, rangeStart), lte(shifts.date, rangeEnd))),
    [rangeStart, rangeEnd],
  );

  const { data: eventRows } = useLiveQuery(
    db
      .select({ id: events.id, date: events.date, title: events.title, time: events.time })
      .from(events)
      .where(and(gte(events.date, rangeStart), lte(events.date, rangeEnd)))
      .orderBy(asc(events.time)),
    [rangeStart, rangeEnd],
  );

  return useMemo(() => {
    const marks: Record<string, DayMarking> = {};
    for (const row of shiftRows) {
      marks[row.date] = { shiftType: row.type, events: [] };
    }
    for (const row of eventRows) {
      const existing = marks[row.date] ?? { shiftType: null, events: [] };
      existing.events.push({ id: row.id, title: row.title, time: row.time });
      marks[row.date] = existing;
    }
    return marks;
  }, [shiftRows, eventRows]);
}
