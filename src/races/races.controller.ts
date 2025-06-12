import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsUserPipe } from 'src/pipes/is-user.pipe';
import { ParseRacePipe } from 'src/pipes/parse-race.pipe';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { CreatePointDto, CreateRaceDto, PatchRaceDTO } from './races.dto';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly svc: RacesService) {}

  @Get(':userId')
  listRaces(@Param('userId', ParseIntPipe, ParseUserPipe) userId: number) {
    return this.svc.findAllByUser(userId);
  }

  @Get(':userId/:raceId')
  async getRace(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
  ) {
    return this.svc.findOneByUser(raceId, userId);
  }

  @Post(':userId')
  async createRace(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Body() dto: CreateRaceDto,
  ) {
    return await this.svc.createRace(userId, dto);
  }

  @Post(':userId/:raceId/points')
  async addPoint(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Body() dto: CreatePointDto,
  ) {
    return await this.svc.createPoint(raceId, dto);
  }

  @Patch(':userId/:raceId')
  async patchRace(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Body() dto: PatchRaceDTO,
  ) {
    return await this.svc.patchRace(raceId, dto);
  }

  @Delete(':userId/:raceId')
  async deleteRace(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
  ) {
    return await this.svc.deleteRace(raceId);
  }
}
