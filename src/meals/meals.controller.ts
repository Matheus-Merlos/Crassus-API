import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MealDTO } from './meals.dto';
import { FoodNotFoundException } from './meals.exceptions';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealService: MealsService) {}

  @Get('types')
  async listTypes() {
    try {
      return await this.mealService.listTypes();
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId')
  async listMeals() {}

  @Post(':userId')
  async createMeal(@Param('userId') userId: string, @Body() mealBody: MealDTO) {
    try {
      return this.mealService.createMeal(+userId, mealBody);
    } catch (error) {
      if (error instanceof FoodNotFoundException)
        throw new BadRequestException(error.message);
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId/:mealId')
  retrieveMeal() {}

  @Delete(':userId/:mealId')
  deleteMeal() {}
}
