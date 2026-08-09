import type { BackupData } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** Structural check for a file picked from disk — an external boundary, so worth validating before it overwrites the whole database. */
export function isValidBackup(value: unknown): value is BackupData {
  if (!isRecord(value) || value.version !== 1 || typeof value.exportedAt !== 'string') {
    return false;
  }

  return (
    Array.isArray(value.shiftTypes) &&
    value.shiftTypes.every(
      (type) =>
        isRecord(type) &&
        typeof type.key === 'string' &&
        typeof type.label === 'string' &&
        typeof type.color === 'string' &&
        typeof type.sortOrder === 'number',
    ) &&
    Array.isArray(value.patterns) &&
    value.patterns.every(
      (pattern) =>
        isRecord(pattern) &&
        typeof pattern.id === 'number' &&
        typeof pattern.name === 'string' &&
        isStringArray(pattern.sequence),
    ) &&
    Array.isArray(value.shifts) &&
    value.shifts.every(
      (shift) =>
        isRecord(shift) &&
        typeof shift.date === 'string' &&
        typeof shift.type === 'string' &&
        (shift.sourcePatternId === null || typeof shift.sourcePatternId === 'number'),
    ) &&
    Array.isArray(value.events) &&
    value.events.every(
      (event) =>
        isRecord(event) &&
        typeof event.date === 'string' &&
        (event.time === null || typeof event.time === 'string') &&
        typeof event.title === 'string' &&
        (event.notes === null || typeof event.notes === 'string'),
    )
  );
}
