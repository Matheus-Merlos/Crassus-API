import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import mealType from './meal-type';

export default pgTable('meal', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  mealType: integer()
    .notNull()
    .references(() => mealType.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
