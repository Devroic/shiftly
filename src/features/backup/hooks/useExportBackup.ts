import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useCallback } from 'react';

import { db } from '@/src/db';
import { events, patterns, shifts, shiftTypes } from '@/src/db/schema';

import type { BackupData } from '../types';

/**
 * Snapshots every table into a JSON file and opens the OS share sheet so the user can save it
 * wherever they like (Files, Drive, email, …) — there's no in-app cloud storage, so sharing the
 * file out is the only way to get a copy off the device.
 */
export function useExportBackup() {
  return useCallback(async (): Promise<void> => {
    const [typeRows, patternRows, shiftRows, eventRows] = await Promise.all([
      db.select().from(shiftTypes),
      db.select().from(patterns),
      db.select().from(shifts),
      db.select().from(events),
    ]);

    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      shiftTypes: typeRows.map(({ key, label, color, sortOrder }) => ({
        key,
        label,
        color,
        sortOrder,
      })),
      patterns: patternRows.map(({ id, name, sequence }) => ({ id, name, sequence })),
      shifts: shiftRows.map(({ date, type, sourcePatternId }) => ({
        date,
        type,
        sourcePatternId,
      })),
      events: eventRows.map(({ date, time, title, notes }) => ({ date, time, title, notes })),
    };

    const file = new File(Paths.cache, `shiftly-backup-${backup.exportedAt.slice(0, 10)}.json`);
    file.write(JSON.stringify(backup, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Shiftly backup',
      });
    }
  }, []);
}
