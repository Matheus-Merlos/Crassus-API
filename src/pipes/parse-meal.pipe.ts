import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/db';
import { meal } from 'src/db/schema';

@Injectable()
export class ParseMealPipe implements PipeTransform {
  async transform(value: number, _metadata: ArgumentMetadata) {
    const [usr] = await db.select().from(meal).where(eq(meal.id, value));

    if (!usr) {
      throw new NotFoundException('Meal not found with this id');
    }

    return value;
  }
}
