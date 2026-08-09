import { useCallback } from 'react';

import { db } from '@/src/db';
import { shiftTypes } from '@/src/db/schema';
import type { ShiftTypeFormValues } from '../types';

function slugify(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || 'label';
}

export function useCreateShiftType() {
  return useCallback(async (values: ShiftTypeFormValues): Promise<void> => {
    const rows = await db
      .select({ key: shiftTypes.key, sortOrder: shiftTypes.sortOrder })
      .from(shiftTypes);
    const existingKeys = new Set(rows.map((row) => row.key));
    const nextOrder = rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

    let key = slugify(values.label);
    if (existingKeys.has(key)) {
      let suffix = 2;
      while (existingKeys.has(`${key}-${suffix}`)) suffix++;
      key = `${key}-${suffix}`;
    }

    await db.insert(shiftTypes).values({
      key,
      label: values.label.trim(),
      color: values.color,
      sortOrder: nextOrder,
    });
  }, []);
}
