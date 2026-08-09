import type { shiftTypes } from '@/src/db/schema';

export type ShiftTypeRecord = typeof shiftTypes.$inferSelect;

export interface ShiftTypeFormValues {
  label: string;
  color: string;
}
