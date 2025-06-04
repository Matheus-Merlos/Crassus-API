import { Injectable } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';
import db from 'src/db';
import { food, meal, mealFood, mealType } from 'src/db/schema';
import { MealDTO } from './meals.dto';
import { FoodNotFoundException } from './meals.exceptions';

@Injectable()
export class MealsService {
  async listTypes() {
    return await db.select().from(mealType);
  }

  async createMeal(
    userId: number,
    body: MealDTO,
  ): Promise<InferSelectModel<typeof meal> | null> {
    let createdMeal: InferSelectModel<typeof meal> | null = null;
    await db.transaction(async (trx) => {
      [createdMeal] = await trx
        .insert(meal)
        .values({ name: body.name ?? null, mealType: body.type })
        .returning();

      for (const foodItem of body.foods) {
        const [dbFood] = await db
          .select()
          .from(food)
          .where(eq(food.id, foodItem.foodId));
        if (!dbFood) {
          throw new FoodNotFoundException(
            `Food id ${foodItem.foodId} does not exist`,
          );
        }

        await trx.insert(mealFood).values({
          foodId: foodItem.foodId,
          mealId: createdMeal.id,
          quantity: foodItem.grams,
        });
      }
    });
    return createdMeal;
  }
}
