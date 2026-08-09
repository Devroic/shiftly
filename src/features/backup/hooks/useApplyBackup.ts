import { gte } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { events, patterns, shifts, shiftTypes } from '@/src/db/schema';

import type { BackupData } from '../types';

/**
 * Replaces every table's contents with a backup's — patterns and shifts keep their original ids
 * (SQLite allows explicit values for an INTEGER PRIMARY KEY), so `shifts.sourcePatternId` still
 * lines up with the reinserted patterns without needing to remap anything.
 *
 * Synchronous transaction, per-row `.run()`, and a trivially-true WHERE on every delete — same
 * reasoning as useClearAllCalendar: the expo-sqlite driver commits as soon as this callback
 * returns (so nothing here can be `await`ed), and an unconditional `DELETE FROM table` hits
 * SQLite's truncate optimization, which skips the update hook `useLiveQuery` relies on.
 */
export function useApplyBackup() {
  return useCallback((backup: BackupData): void => {
    db.transaction((tx) => {
      tx.delete(events).where(gte(events.id, 0)).run();
      tx.delete(shifts).where(gte(shifts.id, 0)).run();
      tx.delete(patterns).where(gte(patterns.id, 0)).run();
      tx.delete(shiftTypes).where(gte(shiftTypes.id, 0)).run();

      for (const type of backup.shiftTypes) {
        tx.insert(shiftTypes).values(type).run();
      }
      for (const pattern of backup.patterns) {
        tx.insert(patterns).values(pattern).run();
      }
      for (const shift of backup.shifts) {
        tx.insert(shifts).values(shift).run();
      }
      for (const event of backup.events) {
        tx.insert(events).values(event).run();
      }
    });
  }, []);
}
