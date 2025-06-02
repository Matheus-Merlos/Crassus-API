import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export default pgTable('meal_type', {
  id: serial().primaryKey().notNull(),
  description: varchar({ length: 255 }).notNull(),
});
