-- Custom SQL migration file, put your code below! --
-- Seeds the four built-in shift types exactly once, ever. Migrations are tracked in
-- __drizzle_migrations and never re-run, unlike the old app-start effect this replaces —
-- that effect used onConflictDoNothing on the `key` column, so deleting a default type (e.g.
-- "Day") made it silently reappear on the next app launch since there was no longer a
-- conflicting row to skip over. INSERT OR IGNORE here only guards existing installs that
-- already have these rows from that effect; from this point on a deleted default stays deleted.
INSERT OR IGNORE INTO `shift_types` (`key`, `label`, `color`, `sort_order`) VALUES
	('day', 'Day', '#0EA5E9', 0),
	('night', 'Night', '#6366F1', 1),
	('off', 'Off', '#9CA3AF', 2),
	('leave', 'Leave', '#16A34A', 3);