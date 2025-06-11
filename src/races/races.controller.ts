import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePointDto } from './races.dto';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly svc: RacesService) {}

  @Get()
  listRaces(@Query('userId', ParseIntPipe) userId: number) {
    return this.svc.findAllByUser(userId);
  }

  @Get(':id')
  async getRace(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.svc.findOneByUser(id, userId);
  }

  // Criado desta maneira para caso usuário não for encontrado já cair fora
  @Post(':id/points')
  async addPoint(
    @Param('id', ParseIntPipe) raceId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Body() dto: CreatePointDto,
  ) {
    const race = await this.svc.findOneByUser(raceId, userId);
    if (!race) {
      throw new NotFoundException('Corrida não encontrada para usuáio');
    }
    return await this.svc.createPoint(dto);
  }
}
