import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsUserPipe } from 'src/pipes/is-user.pipe';
import { ParseRacePipe } from 'src/pipes/parse-race.pipe';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { CreatePointDto, CreateRaceDto, PatchRaceDTO } from './races.dto';
import { RacesService } from './races.service';

@ApiTags('Races')
@Controller('races')
@UseGuards(AuthGuard)
export class RacesController {
  constructor(private readonly svc: RacesService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'List all races for a user' })
  @ApiResponse({ status: 200, description: 'Return a list of races.' })
  listRaces(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
  ) {
    return this.svc.findAllByUser(userId);
  }

  @Get(':userId/:raceId')
  @ApiOperation({ summary: 'Get a specific race' })
  @ApiResponse({ status: 200, description: 'Return a race.' })
  async getRace(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
  ) {
    return this.svc.findOneByUser(raceId, userId);
  }

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new race' })
  @ApiResponse({
    status: 201,
    description: 'The race has been successfully created.',
  })
  async createRace(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Body() dto: CreateRaceDto,
  ) {
    return await this.svc.createRace(userId, dto);
  }

  @Post(':userId/:raceId/points')
  @ApiOperation({ summary: 'Add a point to a race' })
  @ApiResponse({
    status: 201,
    description: 'The point has been successfully added.',
  })
  async addPoint(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Body() dto: CreatePointDto,
  ) {
    return await this.svc.createPoint(raceId, dto);
  }

  @Patch(':userId/:raceId')
  @ApiOperation({ summary: 'Update a race' })
  @ApiResponse({
    status: 200,
    description: 'The race has been successfully updated.',
  })
  async patchRace(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Body() dto: PatchRaceDTO,
  ) {
    return await this.svc.patchRace(raceId, dto);
  }

  @Delete(':userId/:raceId')
  @ApiOperation({ summary: 'Delete a race' })
  @ApiResponse({
    status: 200,
    description: 'The race has been successfully deleted.',
  })
  async deleteRace(
    @Param('raceId', ParseIntPipe, ParseRacePipe) raceId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
  ) {
    return await this.svc.deleteRace(raceId);
  }
}
