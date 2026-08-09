import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const shiftTypes = sqliteTable(
  'shift_types',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    /** Stable identifier stored on `shifts.type` and inside pattern `sequence` JSON — never shown to the user. */
    key: text('key').notNull(),
    label: text('label').notNull(),
    color: text('color').notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [uniqueIndex('shift_types_key_unique').on(table.key)],
);

export const patterns = sqliteTable('patterns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  /** Ordered cycle of shift types, e.g. ["day","night","off","off"]. */
  sequence: text('sequence', { mode: 'json' }).$type<string[]>().notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const shifts = sqliteTable(
  'shifts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    /** ISO local calendar date "YYYY-MM-DD" — not a timestamp, avoids timezone ambiguity. */
    date: text('date').notNull(),
    /** References `shiftTypes.key` — not a DB-enforced FK since it's also embedded in `patterns.sequence` JSON. */
    type: text('type').notNull(),
    sourcePatternId: integer('source_pattern_id').references(() => patterns.id, {
      onDelete: 'set null',
    }),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    // Exactly one shift status per day is a product invariant — enforced here, not just in app code.
    uniqueIndex('shifts_date_unique').on(table.date),
  ],
);

export const events = sqliteTable(
  'events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(),
    /** Optional "HH:mm", null means an all-day/untimed event. */
    time: text('time'),
    title: text('title').notNull(),
    notes: text('notes'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [index('events_date_idx').on(table.date)],
);
