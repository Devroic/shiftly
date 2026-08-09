import type { patterns } from '@/src/db/schema';
import type { ShiftType } from '@/src/features/shifts/types';

export type PatternRecord = typeof patterns.$inferSelect;

export interface PatternFormValues {
  name: string;
  sequence: ShiftType[];
}
