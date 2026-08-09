import { eq } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { shiftTypes } from '@/src/db/schema';
import type { ShiftTypeFormValues } from '../types';

/** Updates a shift type's label/color. The `key` never changes — it's what existing shifts and pattern sequences reference. */
export function useUpdateShiftType() {
  return useCallback(async (id: number, values: ShiftTypeFormValues): Promise<void> => {
    await db
      .update(shiftTypes)
      .set({ label: values.label.trim(), color: values.color })
      .where(eq(shiftTypes.id, id));
  }, []);
}
