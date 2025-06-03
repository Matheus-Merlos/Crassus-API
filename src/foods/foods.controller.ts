import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FoodsService } from './foods.service';

@Controller('foods')
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
