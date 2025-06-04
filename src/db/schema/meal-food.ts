import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import food from './food';
import meal from './meal';

export default pgTable('meal_food', {
  id: serial().notNull().primaryKey(),
  foodId: integer('food_id')
    .notNull()
    .references(() => food.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  mealId: integer('meal_id')
    .notNull()
    .references(() => meal.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  quantity: integer().notNull(),
});
