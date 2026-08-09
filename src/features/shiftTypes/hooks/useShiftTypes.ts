import { asc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { shiftTypes } from '@/src/db/schema';
import type { ShiftTypeRecord } from '../types';

export function useShiftTypes(): ShiftTypeRecord[] {
  const { data } = useLiveQuery(
    db.select().from(shiftTypes).orderBy(asc(shiftTypes.sortOrder), asc(shiftTypes.id)),
  );
  return data;
}
