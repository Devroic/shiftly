import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useCallback } from 'react';

import { isValidBackup } from '../validateBackup';
import type { BackupData } from '../types';

export type PickBackupResult =
  | { status: 'canceled' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: BackupData };

/** Opens the system file picker and returns a validated backup, without touching the database. */
export function usePickBackupFile() {
  return useCallback(async (): Promise<PickBackupResult> => {
    const picked = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
    if (picked.canceled || !picked.assets[0]) {
      return { status: 'canceled' };
    }

    let raw: string;
    try {
      raw = await new File(picked.assets[0].uri).text();
    } catch {
      return { status: 'error', message: "Couldn't read that file." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { status: 'error', message: "That file isn't valid JSON." };
    }

    if (!isValidBackup(parsed)) {
      return { status: 'error', message: "That file doesn't look like a Shiftly backup." };
    }

    return { status: 'success', data: parsed };
  }, []);
}
