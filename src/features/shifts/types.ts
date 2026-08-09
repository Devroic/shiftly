/**
 * A shift type is a user-manageable row in the `shift_types` table (see
 * src/features/shiftTypes) rather than a fixed set — this alias just names the string "key"
 * that `shifts.type` and pattern `sequence` entries store.
 */
export type ShiftType = string;
