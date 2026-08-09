import { format, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

const DATE_KEY_FORMAT = 'yyyy-MM-dd';

/** Formats a Date as the app's canonical local calendar-date key ("YYYY-MM-DD"). */
export function toISODateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}

/** Parses a "YYYY-MM-DD" key back into a local Date (midnight, local time zone). */
export function fromISODateKey(key: string): Date {
  return parse(key, DATE_KEY_FORMAT, new Date());
}

export function todayKey(): string {
  return toISODateKey(new Date());
}

/** Formats a "YYYY-MM-DD" key for display, e.g. "Fri, 8 Aug 2026". */
export function formatDisplayDate(dateKey: string): string {
  return format(fromISODateKey(dateKey), 'EEE, d MMM yyyy', { locale: enUS });
}
