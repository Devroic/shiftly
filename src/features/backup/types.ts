/** The full contents of a Shiftly backup file — enough to fully reconstruct the local database. */
export interface BackupData {
  version: 1;
  exportedAt: string;
  shiftTypes: { key: string; label: string; color: string; sortOrder: number }[];
  patterns: { id: number; name: string; sequence: string[] }[];
  shifts: { date: string; type: string; sourcePatternId: number | null }[];
  events: { date: string; time: string | null; title: string; notes: string | null }[];
}
