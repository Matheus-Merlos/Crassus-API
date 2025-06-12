import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import user from './user';

export default pgTable('race', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  startTime: timestamp({ mode: 'date' }).notNull(),
  endTime: timestamp({ mode: 'date' }),
  elevation: integer().default(0),
  user: integer()
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});
