import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import db from 'src/db';
import { race, racePoint } from '../db/schema/index';
import { CreatePointDto, CreateRaceDto } from './races.dto';

@Injectable()
export class RacesService {
  async findAllByUser(userId: number) {
    return await db.select().from(race).where(eq(race.user, userId));
  }
  async findOneByUser(id: number, userId: number) {
    return await db
      .select()
      .from(race)
      .where(and(eq(race.id, id), eq(race.user, userId)));
  }
  async createRace(dto: CreateRaceDto) {
    return await db.insert(race).values(dto).returning();
  }

  async createPoint(dto: CreatePointDto) {
    return await db.insert(racePoint).values(dto).returning();
  }
}
