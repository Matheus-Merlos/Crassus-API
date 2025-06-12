import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import db from 'src/db';
import { race, racePoint } from '../db/schema/index';
import { CreatePointDto, CreateRaceDto, PatchRaceDTO } from './races.dto';

@Injectable()
export class RacesService {
  async findAllByUser(userId: number) {
    const races = await db
      .select()
      .from(race)
      .where(eq(race.user, userId))
      .orderBy(desc(race.startTime))
      .limit(25);

    races.forEach((race) => {
      const dateArray = race.startTime.toISOString().split('T');
      const date = dateArray[0];

      const [year, month, day] = date.split('-');

      race['date'] = `${day}/${month}/${year}`;
      if (!race.name) {
        race.name = `Corrida ${race.startTime.getDate().toString().padStart(2, '0')}/${(race.startTime.getMonth() + 1).toString().padStart(2, '0')}/${race.startTime.getFullYear()}`;
      }
    });

    return races;
  }
  async findOneByUser(id: number, userId: number) {
    const [userRace] = await db
      .select()
      .from(race)
      .where(and(eq(race.id, id), eq(race.user, userId)));

    if (!userRace.name) {
      userRace.name = `Corrida ${userRace.startTime.getDate().toString().padStart(2, '0')}/${(userRace.startTime.getMonth() + 1).toString().padStart(2, '0')}/${userRace.startTime.getFullYear()}`;
    }

    const racePoints = await db
      .select({
        latitude: racePoint.latitude,
        longitude: racePoint.longitude,
        timestamp: racePoint.timestamp,
      })
      .from(racePoint)
      .where(eq(racePoint.race, id))
      .orderBy(asc(racePoint.timestamp));

    userRace['points'] = racePoints;

    return userRace;
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

    if (!createdRace.name) {
      createdRace.name = `Corrida ${createdRace.startTime.getDate().toString().padStart(2, '0')}/${(createdRace.startTime.getMonth() + 1).toString().padStart(2, '0')}/${createdRace.startTime.getFullYear()}`;
    }

    return createdRace;
  }

  async createPoint(raceId: number, dto: CreatePointDto) {
    const [point] = await db
      .insert(racePoint)
      .values({
        latitude: dto.latitude,
        longitude: dto.longitude,
        timestamp: new Date(dto.timestamp),
        race: raceId,
      })
      .returning();

    return point;
  }

  async patchRace(raceId: number, dto: PatchRaceDTO) {
    const [patchedRace] = await db
      .update(race)
      .set({ ...dto, endTime: new Date(dto.endTime) })
      .where(eq(race.id, raceId))
      .returning();

    if (!patchedRace.name) {
      patchedRace.name = `Corrida ${patchedRace.startTime.getDate().toString().padStart(2, '0')}/${(patchedRace.startTime.getMonth() + 1).toString().padStart(2, '0')}/${patchedRace.startTime.getFullYear()}`;
    }

    return patchedRace;
  }

  async deleteRace(raceId: number) {
    await db.delete(race).where(eq(race.id, raceId));
  }
}
