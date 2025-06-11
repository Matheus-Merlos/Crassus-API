import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import db from 'src/db';
import { food, meal, mealFood, mealType, user } from 'src/db/schema';

@Injectable()
export class PerformanceService {
  async getPerformanceByUser(userId: number) {
    const [usr] = await db.select().from(user).where(eq(user.id, userId));

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const birthdate = new Date(usr.birthdate);

    let age = now.getFullYear() - birthdate.getFullYear();
    if (
      now.getMonth() < birthdate.getMonth() ||
      (now.getMonth() === birthdate.getMonth() &&
        now.getDate() < birthdate.getDate())
    ) {
      age--;
    }

    //TAXA METABÓLICA BASAL
    let tmb = 0;
    if (usr.gender === 'M') {
      tmb =
        88.36 +
        13.4 * Number(usr.weight) +
        4.8 * (Number(usr.height) * 100) -
        5.7 * age;
    } else {
      tmb =
        447.6 +
        9.2 * Number(usr.weight) +
        3.1 * (Number(usr.height) * 100) -
        4.3 * age;
    }

    //GASTO ENERGÉTICO TOTAL
    const necessaryCalories = tmb * 1.375;
    const necessaryProteins = Number(usr.weight) * 1.5;
    const necessaryFats = (necessaryCalories * 0.3) / 9;
    const necessaryCarbs =
      (necessaryCalories - necessaryProteins * 4 - necessaryFats * 9) / 4;

    const necessaryNutrients = {
      necessaryProteins: necessaryProteins.toFixed(2),
      necessaryFats: necessaryFats.toFixed(2),
      necessaryCarbs: necessaryCarbs.toFixed(2),
    };

    const [macroNutrients] = await db
      .select({
        consumedCalories: sql<number>`COALESCE(SUM((${food.calories} * ${mealFood.quantity}) / 100), 0)`,
        consumedProteins: sql<number>`COALESCE(SUM((${food.proteins} * ${mealFood.quantity}) / 100), 0)`,
        consumedCarbs: sql<number>`COALESCE(SUM((${food.carbs} * ${mealFood.quantity}) / 100), 0)`,
        consumedFats: sql<number>`COALESCE(SUM((${food.fats} * ${mealFood.quantity}) / 100), 0)`,
      })
      .from(mealFood)
      .innerJoin(meal, eq(mealFood.mealId, meal.id))
      .innerJoin(food, eq(mealFood.foodId, food.id))
      .where(
        and(
          sql`DATE(${meal.createdAt}) = ${sql.raw(`'${date}'`)}`,
          eq(meal.userId, userId),
        ),
      );

    const necessaryCaloriesByMeal = {
      necessaryCaloriesBreakfast: necessaryCalories * 0.2,
      necessaryCaloriesLunch: necessaryCalories * 0.3,
      necessaryCaloriesDinner: necessaryCalories * 0.25,
      necessaryCaloriesSnacks: necessaryCalories * 0.25,
    };

    const consumedCaloriesByMeal = await db
      .select({
        mealTypeId: mealType.id,
        consumedCalories: sql<number>`COALESCE(SUM((${food.calories} * ${mealFood.quantity}) / 100), 0)`,
      })
      .from(mealType)
      .leftJoin(
        meal,
        and(
          eq(meal.mealType, mealType.id),
          sql`DATE(${meal.createdAt}) = ${sql.raw(`'${date}'`)}`,
          eq(meal.userId, userId),
        ),
      )
      .leftJoin(mealFood, eq(mealFood.mealId, meal.id))
      .leftJoin(food, eq(mealFood.foodId, food.id))
      .groupBy(mealType.id, mealType.description)
      .orderBy(mealType.id);

    return {
      necessaryCalories: necessaryCalories.toFixed(2),
      ...necessaryNutrients,
      ...macroNutrients,
      ...necessaryCaloriesByMeal,
      consumedCaloriesBreakfast: Number(
        consumedCaloriesByMeal[0].consumedCalories,
      ).toFixed(2),
      consumedCaloriesLunch: Number(
        consumedCaloriesByMeal[1].consumedCalories,
      ).toFixed(2),
      consumedCaloriesDinner: Number(
        consumedCaloriesByMeal[2].consumedCalories,
      ).toFixed(2),
      consumedCaloriesSnacks: Number(
        consumedCaloriesByMeal[3].consumedCalories,
      ).toFixed(2),
    };
  }
}
