import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import race from './race';

export default pgTable('race_point', {
  id: serial().primaryKey().notNull(),
  race: integer()
    .notNull()
    .references(() => race.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  timestamp: timestamp({ mode: 'date' }).notNull(),
  latitude: text('location').notNull(),
  longitude: text('longitude').notNull(),
});
