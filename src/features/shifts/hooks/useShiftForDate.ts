import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { shifts } from '@/src/db/schema';

import type { ShiftType } from '../types';

export function useShiftForDate(date: string): ShiftType | null {
  const { data } = useLiveQuery(db.select().from(shifts).where(eq(shifts.date, date)), [date]);
  return data[0]?.type ?? null;
}
