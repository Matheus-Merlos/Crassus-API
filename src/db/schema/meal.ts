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
  createAt: timestamp('create_at', { mode: 'date' }).notNull().defaultNow(),
});
