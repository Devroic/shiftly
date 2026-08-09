import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

// Filename kept as-is post-rename (app was originally "ShiftPlan"): changing it would point
// existing installs at a new, empty database file instead of their real one.
const sqliteDb = SQLite.openDatabaseSync('shiftplan.db', { enableChangeListener: true });

export const db = drizzle(sqliteDb, { schema });
