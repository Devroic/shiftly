import { and, gte, lte } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { events, shifts } from '@/src/db/schema';

/**
 * Deletes every shift assignment AND every event whose date falls within
 * [startDate, endDate], inclusive. Runs inside a synchronous transaction — the expo-sqlite
 * Drizzle driver commits right after the callback returns without awaiting it, so each
 * statement must be run synchronously via `.run()` rather than `await`ed (see useApplyPattern).
 */
export function useClearCalendarRange() {
  return useCallback((startDate: string, endDate: string): void => {
    db.transaction((tx) => {
      tx.delete(shifts)
        .where(and(gte(shifts.date, startDate), lte(shifts.date, endDate)))
        .run();
      tx.delete(events)
        .where(and(gte(events.date, startDate), lte(events.date, endDate)))
        .run();
    });
  }, []);
}
