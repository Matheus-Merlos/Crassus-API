import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FoodsService } from './foods.service';

@ApiTags('Foods')
@Controller('foods')
@UseGuards(AuthGuard)
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  @ApiOperation({ summary: 'List all foods' })
  @ApiResponse({ status: 200, description: 'Return a list of foods.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
