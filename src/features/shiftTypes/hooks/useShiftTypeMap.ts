import { useMemo } from 'react';

import type { ShiftTypeRecord } from '../types';
import { useShiftTypes } from './useShiftTypes';

/** Keyed lookup for O(1) label/color access — for use where a list is rendered per-item (e.g. a calendar grid). */
export function useShiftTypeMap(): Record<string, ShiftTypeRecord> {
  const types = useShiftTypes();
  return useMemo(() => Object.fromEntries(types.map((type) => [type.key, type])), [types]);
}
