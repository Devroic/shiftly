import { gte } from 'drizzle-orm';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { events, shifts } from '@/src/db/schema';

/**
 * Deletes every shift AND every event, with no date bound — a full reset of the calendar's
 * data. Patterns themselves are left alone (they're reusable templates, not calendar entries).
 * Synchronous transaction — see useApplyPattern for why `.run()` is used instead of `await`.
 *
 * Each delete keeps a (trivially always-true) WHERE clause on purpose: SQLite's "truncate
 * optimization" for an unconditional `DELETE FROM table` skips the update hook entirely, which
 * is what `useLiveQuery` subscribes to — without a WHERE clause the UI would silently go stale
 * until something else (e.g. changing month) happened to re-run the query.
 */
export function useClearAllCalendar() {
  return useCallback((): void => {
    db.transaction((tx) => {
      tx.delete(shifts).where(gte(shifts.id, 0)).run();
      tx.delete(events).where(gte(events.id, 0)).run();
    });
  }, []);
}
