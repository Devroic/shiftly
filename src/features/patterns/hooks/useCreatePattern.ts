import { useCallback } from 'react';

import { db } from '@/src/db';
import { patterns } from '@/src/db/schema';

import type { PatternFormValues } from '../types';

export function useCreatePattern() {
  return useCallback(async (values: PatternFormValues): Promise<number> => {
    const [row] = await db
      .insert(patterns)
      .values({ name: values.name, sequence: values.sequence })
      .returning({ id: patterns.id });
    return row.id;
  }, []);
}
