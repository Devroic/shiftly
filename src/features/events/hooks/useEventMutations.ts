import { eq, sql } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { events } from '@/src/db/schema';

import type { EventFormValues } from '../types';

export function useEventMutations() {
  const createEvent = useCallback(async (date: string, values: EventFormValues): Promise<void> => {
    await db.insert(events).values({ date, ...values });
  }, []);

  const updateEvent = useCallback(async (id: number, values: EventFormValues): Promise<void> => {
    await db
      .update(events)
      .set({ ...values, updatedAt: sql`(current_timestamp)` })
      .where(eq(events.id, id));
  }, []);

  const deleteEvent = useCallback(async (id: number): Promise<void> => {
    await db.delete(events).where(eq(events.id, id));
  }, []);

  const clearEventsForDate = useCallback(async (date: string): Promise<void> => {
    await db.delete(events).where(eq(events.date, date));
  }, []);

  return { createEvent, updateEvent, deleteEvent, clearEventsForDate };
}
