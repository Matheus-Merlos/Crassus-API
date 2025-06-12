import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/db';
import { race } from 'src/db/schema';

@Injectable()
export class ParseRacePipe implements PipeTransform {
  async transform(value: number, metadata: ArgumentMetadata) {
    const [usr] = await db.select().from(race).where(eq(race.id, value));

    if (!usr) {
      throw new NotFoundException('Race not found with this id');
    }

    return value;
  }
}
