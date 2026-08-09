import { eq } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { patterns, shifts, shiftTypes } from '@/src/db/schema';

export interface DeleteShiftTypeResult {
  blocked: boolean;
  /** User-facing reason, set only when `blocked` is true. */
  reason?: string;
}

/**
 * Deletes a shift type, unless doing so would leave a dangling reference: a calendar day
 * currently set to it, a pattern that still steps through it, or it being the last type left.
 * Blocking here (rather than cascading or nulling) keeps every existing shift/pattern valid.
 */
export function useDeleteShiftType() {
  return useCallback(async (id: number, key: string): Promise<DeleteShiftTypeResult> => {
    const allTypes = await db.select({ id: shiftTypes.id }).from(shiftTypes);
    if (allTypes.length <= 1) {
      return { blocked: true, reason: 'You need at least one shift type.' };
    }

    const [shiftInUse] = await db
      .select({ id: shifts.id })
      .from(shifts)
      .where(eq(shifts.type, key))
      .limit(1);
    if (shiftInUse) {
      return {
        blocked: true,
        reason: 'This label is set on one or more days in the calendar. Change those days first.',
      };
    }

    const allPatterns = await db.select({ sequence: patterns.sequence }).from(patterns);
    if (allPatterns.some((pattern) => pattern.sequence.includes(key))) {
      return {
        blocked: true,
        reason: 'This label is used inside one or more patterns. Remove it from those first.',
      };
    }

    await db.delete(shiftTypes).where(eq(shiftTypes.id, id));
    return { blocked: false };
  }, []);
}
