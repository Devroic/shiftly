import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { patterns } from '@/src/db/schema';

import type { PatternRecord } from '../types';

export function usePattern(id: number): PatternRecord | null {
  const { data } = useLiveQuery(db.select().from(patterns).where(eq(patterns.id, id)), [id]);
  return data[0] ?? null;
}
