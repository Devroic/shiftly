import { eq, sql } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { shifts } from '@/src/db/schema';
import type { ShiftType } from '@/src/features/shifts/types';

import { generatePatternShifts } from '../generatePatternShifts';

/**
 * Applies a pattern to a date range: generates one {date, type} per day (pure), then
 * upserts them all inside a single transaction.
 *
 * The expo-sqlite Drizzle driver runs `transaction()` fully synchronously (it issues
 * `commit` right after the callback returns, without awaiting it) — so the callback here
 * must stay synchronous and call `.run()` on each statement directly, rather than
 * `await`-ing each insert as you normally would outside a transaction.
 */
export function useApplyPattern() {
  return useCallback(
    (patternId: number, sequence: ShiftType[], startDate: Date, endDate: Date): void => {
      const generated = generatePatternShifts(sequence, startDate, endDate);

      db.transaction((tx) => {
        // A pattern has one active application at a time: wipe whatever it previously wrote
        // before laying down the new range. Without this, editing a pattern to start later
        // (or with a different sequence) would leave the old cycle's days from the previous
        // application untouched, making the edit look like it had no effect.
        tx.delete(shifts).where(eq(shifts.sourcePatternId, patternId)).run();

        for (const { date, type } of generated) {
          tx.insert(shifts)
            .values({ date, type, sourcePatternId: patternId })
            .onConflictDoUpdate({
              target: shifts.date,
              set: { type, sourcePatternId: patternId, updatedAt: sql`(current_timestamp)` },
            })
            .run();
        }
      });
    },
    [],
  );
}
