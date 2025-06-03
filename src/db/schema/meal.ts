import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import mealType from './meal-type';

export default pgTable('meal', {
  id: serial().primaryKey().notNull(),
  mealType: integer()
    .notNull()
    .references(() => mealType.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
