import { eq, sql } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { patterns } from '@/src/db/schema';

import type { PatternFormValues } from '../types';

/**
 * Updates a pattern's own name/sequence. Days already stamped from a previous apply are left
 * untouched — same one-shot-generation model as everywhere else (see useApplyPattern) — so an
 * edited sequence only takes effect the next time the pattern is applied to a date range.
 */
export function useUpdatePattern() {
  return useCallback(async (id: number, values: PatternFormValues): Promise<void> => {
    await db
      .update(patterns)
      .set({ name: values.name, sequence: values.sequence, updatedAt: sql`(current_timestamp)` })
      .where(eq(patterns.id, id));
  }, []);
}
