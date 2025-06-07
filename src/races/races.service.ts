import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import db from 'src/db';
import { race, racePoint } from '../db/schema/index';
import { CreatePointDto, CreateRaceDto } from './races.dto';



@Injectable()
export class RacesService {
  findAllByUser(userId: number) {
  return db
    .select()
    .from(race)
    .where(eq(race.user, userId));
  }
  findOneByUser(id: number, userId: number) {
  return db
    .select()
    .from(race)
    .where(and(eq(race.id, id), eq(race.user, userId)))
  }
  createRace(dto: CreateRaceDto) {
  return db
    .insert(race)
    .values(dto)       
    .returning();
  }

  createPoint(dto: CreatePointDto) {
  return db
    .insert(racePoint)
    .values(dto)    
    .returning();
  }
}

