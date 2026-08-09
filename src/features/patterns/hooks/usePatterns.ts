import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/src/db';
import { patterns } from '@/src/db/schema';

import type { PatternRecord } from '../types';

export function usePatterns(): PatternRecord[] {
  const { data } = useLiveQuery(db.select().from(patterns).orderBy(desc(patterns.createdAt)));
  return data;
}
