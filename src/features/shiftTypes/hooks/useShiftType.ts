import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { shiftTypes } from '@/src/db/schema';
import type { ShiftTypeRecord } from '../types';

export function useShiftType(id: number): ShiftTypeRecord | null {
  const { data } = useLiveQuery(db.select().from(shiftTypes).where(eq(shiftTypes.id, id)), [id]);
  return data[0] ?? null;
}
