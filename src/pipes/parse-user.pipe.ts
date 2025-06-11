import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/db';
import { user } from 'src/db/schema';

@Injectable()
export class ParseUserPipe implements PipeTransform {
  async transform(value: number, metadata: ArgumentMetadata) {
    const [usr] = await db.select().from(user).where(eq(user.id, value));

    if (!usr) {
      throw new NotFoundException('User not found with this id');
    }

    return value;
  }
}
