import { Injectable } from '@nestjs/common';
import { ilike, InferSelectModel } from 'drizzle-orm';
import db from 'src/db';
import { food } from 'src/db/schema';

type Food = InferSelectModel<typeof food>;

@Injectable()
export class FoodsService {
  async list(query: string = ''): Promise<Array<Food>> {
    const foods = await db
      .select()
      .from(food)
      .where(ilike(food.name, `%${query}%`))
      .limit(25);

    return foods;
  }
}
