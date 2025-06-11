import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FoodsService } from './foods.service';

@Controller('foods')
@UseGuards(AuthGuard)
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  async getFoods(@Query('q') query: string) {
    if (query) query = query.replaceAll('+', ' ');
    try {
      return await this.foodService.list(query);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
