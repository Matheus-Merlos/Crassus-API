import { decimal, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export default pgTable('food', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  calories: decimal({ precision: 12, scale: 2 }).notNull().default('0.00'),
  proteins: decimal({ precision: 12, scale: 2 }).notNull().default('0.00'),
  carbs: decimal({ precision: 12, scale: 2 }).notNull().default('0.00'),
  fats: decimal({ precision: 12, scale: 2 }).notNull().default('0.00'),
});
