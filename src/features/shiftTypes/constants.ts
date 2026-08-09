/**
 * Seeded once, ever, by migration 0002_seed_default_shift_types — after that, these rows are
 * ordinary user-editable data, just like any shift type someone creates later. Kept here only
 * as the source of truth the migration's literal SQL values were copied from.
 */
export const DEFAULT_SHIFT_TYPES = [
  { key: 'day', label: 'Day', color: '#0EA5E9' },
  { key: 'night', label: 'Night', color: '#6366F1' },
  { key: 'off', label: 'Off', color: '#9CA3AF' },
  { key: 'leave', label: 'Leave', color: '#16A34A' },
] as const;

/** Curated, mutually-distinguishable swatches offered in the color picker. */
export const SHIFT_COLOR_PRESETS = [
  '#EF4444',
  '#F97316',
  '#E8B76A',
  '#EAB308',
  '#84CC16',
  '#22C55E',
  '#16A34A',
  '#14B8A6',
  '#06B6D4',
  '#0EA5E9',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#A855F7',
  '#D946EF',
  '#EC4899',
  '#F43F5E',
  '#78716C',
  '#64748B',
  '#9CA3AF',
] as const;
