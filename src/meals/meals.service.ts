import { Injectable } from '@nestjs/common';
import { eq, InferSelectModel } from 'drizzle-orm';
import db from 'src/db';
import { food, meal, mealFood, mealType } from 'src/db/schema';
import { MealDTO } from './meals.dto';
import {
  FoodNotFoundException,
  MealNotFoundException,
} from './meals.exceptions';

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
        .values({
          name: body.name ?? null,
          mealType: body.type,
          userId,
        })
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

  async listUserMeals(userId: number) {
    //Pega os nomes dos topos de comidas (para não precisar ficar consultando o banco infinitamente)
    const mealTypesSelect = await db.select().from(mealType);
    const mealTypes = Object.fromEntries(
      mealTypesSelect.map((m) => [m.id, m.description]),
    );

    const meals = await db.select().from(meal).where(eq(meal.userId, userId));

    //Formada do jeito que a gente quer
    const formattedMeals = await Promise.all(
      meals.map(async (meal, index) => {
        const d = meal.createdAt;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        //Calcula todas as calorias de todas as comidas
        const foods = await db
          .select({ calories: food.calories, quantity: mealFood.quantity })
          .from(mealFood)
          .where(eq(mealFood.mealId, meal.id))
          .innerJoin(food, eq(mealFood.foodId, food.id));

        let totalCalories = 0;

        foods.forEach((food) => {
          const { calories } = food;
          let { quantity } = food;
          quantity = quantity / 100;

          const kcal = Number(calories) * quantity;
          totalCalories += kcal;
        });

        return {
          id: meal.id,
          mealTypeId: meal.mealType,
          mealType: mealTypes[meal.mealType],
          createdAt: `${day}/${month}/${year}`,
          //Serve para "criar um nome" para a comida caso seja NULL
          name: meal.name ?? `${mealTypes[meal.mealType]} ${index + 1}`,
          calories: totalCalories.toFixed(2),
        };
      }),
    );

    const formattedMealsGroupedByDate = {};
    formattedMeals.forEach((meal) => {
      const date = meal.createdAt;

      if (!formattedMealsGroupedByDate[date]) {
        formattedMealsGroupedByDate[date] = [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      formattedMealsGroupedByDate[date].push(meal);
    });

    return formattedMealsGroupedByDate;
  }

  async deleteUserMeal(mealId: number) {
    const [dbMeal] = await db.select().from(meal).where(eq(meal.id, mealId));
    if (!dbMeal) {
      throw new MealNotFoundException('This meal does not exists');
    }

    await db.delete(meal).where(eq(meal.id, mealId));
  }
}
