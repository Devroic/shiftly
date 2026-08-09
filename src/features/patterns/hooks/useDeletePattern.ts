import { eq } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { patterns } from '@/src/db/schema';

export function useDeletePattern() {
  return useCallback(async (id: number): Promise<void> => {
    await db.delete(patterns).where(eq(patterns.id, id));
  }, []);
}
