import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import user from './user';

export default pgTable('race', {
  id: serial().primaryKey().notNull(),
  startTime: timestamp({ mode: 'date' }).notNull(),
  endTime: timestamp({ mode: 'date' }).notNull(),
  elevation: integer().default(0),
  user: integer()
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});
