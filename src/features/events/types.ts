import type { events } from '@/src/db/schema';

export type EventRecord = typeof events.$inferSelect;

export interface EventFormValues {
  title: string;
  time: string | null;
  notes: string | null;
}
