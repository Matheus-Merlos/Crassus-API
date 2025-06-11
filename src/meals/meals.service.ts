import { Injectable } from '@nestjs/common';
import { desc, eq, InferSelectModel } from 'drizzle-orm';
import db from 'src/db';
import { food, meal, mealFood, mealType } from 'src/db/schema';
import { MealDTO, MealPatchDTO } from './meals.dto';
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

  async patchMeals(userId: number, mealId: number, body: MealPatchDTO) {
    let editedMeal: InferSelectModel<typeof meal> | null = null;
    if (Object.keys(body).includes('name')) {
      [editedMeal] = await db.update(meal).set({ name: body.name }).returning();
    }

    if (Object.keys(body).includes('foods')) {
      await db.transaction(async (trx) => {
        await trx.delete(mealFood).where(eq(mealFood.mealId, mealId));

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
            mealId,
            quantity: foodItem.grams,
          });
        }
      });
    }

    return editedMeal;
  }

  async listUserMeals(userId: number) {
    //Pega os nomes dos topos de comidas (para não precisar ficar consultando o banco infinitamente)
    const mealTypesSelect = await db.select().from(mealType);
    const mealTypes = Object.fromEntries(
      mealTypesSelect.map((m) => [m.id, m.description]),
    );

    const meals = await db
      .select()
      .from(meal)
      .where(eq(meal.userId, userId))
      .orderBy(desc(meal.createdAt))
      .limit(25);

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

    const formattedMealsGroupedByDate: Record<
      string,
      Array<{
        id: number;
        mealTypeId: number;
        mealType: string;
        createdAt: string;
        name: string;
        calories: string;
      }>
    > = {};
    formattedMeals.forEach((meal) => {
      const date = meal.createdAt;

      if (!formattedMealsGroupedByDate[date]) {
        formattedMealsGroupedByDate[date] = [];
      }

      formattedMealsGroupedByDate[date].push(meal);
    });

    const response: Array<{
      date: string;
      meals: Array<{
        id: number;
        mealTypeId: number;
        mealType: string;
        createdAt: string;
        name: string;
        calories: string;
      }>;
    }> = [];
    for (const [date, meals] of Object.entries(formattedMealsGroupedByDate)) {
      response.push({
        date,
        meals,
      });
    }

    return response;
  }

  async describeMeal(mealId: number) {
    const [dbMeal] = await db
      .select({
        id: meal.id,
        createdAt: meal.createdAt,
      })
      .from(meal)
      .where(eq(meal.id, mealId));
    if (!dbMeal) {
      throw new MealNotFoundException('This meal does not exists');
    }

    const foods = await db
      .select({
        foodId: food.id,
        name: food.name,
        quantity: mealFood.quantity,
        kcal: food.calories,
        carbs: food.carbs,
        proteins: food.proteins,
        fats: food.proteins,
      })
      .from(mealFood)
      .where(eq(mealFood.mealId, dbMeal.id))
      .innerJoin(food, eq(mealFood.foodId, food.id));

    //contagem de macronutrientes e calories
    let calories = 0;
    let carbs = 0;
    let proteins = 0;
    let fats = 0;
    for (const foodItem of foods) {
      const { kcal } = foodItem;
      let { quantity } = foodItem;
      quantity = quantity / 100;

      calories += Number(kcal) * quantity;
      carbs += Number(foodItem.carbs);
      proteins += Number(foodItem.proteins);
      fats += Number(foodItem.fats);
    }

    return {
      timestamp: dbMeal.createdAt,
      calories: calories.toFixed(2),
      carbs: carbs.toFixed(2),
      proteins: proteins.toFixed(2),
      fats: fats.toFixed(2),
      foods: foods.map((food) => {
        return {
          id: food.foodId,
          name: food.name,
          grams: food.quantity,
        };
      }),
    };
  }

  async deleteUserMeal(mealId: number) {
    const [dbMeal] = await db.select().from(meal).where(eq(meal.id, mealId));
    if (!dbMeal) {
      throw new MealNotFoundException('This meal does not exists');
    }

    await db.delete(meal).where(eq(meal.id, mealId));
  }
}
