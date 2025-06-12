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
  async createRace(userId: number, dto: CreateRaceDto) {
    const [createdRace] = await db
      .insert(race)
      .values({
        startTime: new Date(dto.startTime),
        user: userId,
        elevation: dto.elevation,
        name: dto.name,
      })
      .returning();

    return createdRace;
  }

  async createPoint(raceId: number, dto: CreatePointDto) {
    const [point] = await db
      .insert(racePoint)
      .values({ location: dto.location, race: raceId })
      .returning();

    return point;
  }
}
