import { asc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { events } from '@/src/db/schema';

import type { EventRecord } from '../types';

export function useEventsForDate(date: string): EventRecord[] {
  const { data } = useLiveQuery(
    db.select().from(events).where(eq(events.date, date)).orderBy(asc(events.time)),
    [date],
  );
  return data;
}
