import {
  char,
  date,
  decimal,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export default pgTable('user', {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar('password', { length: 255 }).notNull(),
  salt: varchar({ length: 16 }).notNull(),
  birthdate: date().notNull(),
  gender: char({ enum: ['M', 'F'] }).notNull(),
  height: decimal().notNull(),
  weight: decimal().notNull(),
});
