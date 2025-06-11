import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { MealDTO } from './meals.dto';
import {
  FoodNotFoundException,
  MealNotFoundException,
} from './meals.exceptions';
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
  async listMeals(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
  ) {
    try {
      return this.mealService.listUserMeals(userId);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':userId')
  async createMeal(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
    @Body() mealBody: MealDTO,
  ) {
    try {
      return this.mealService.createMeal(userId, mealBody);
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
  async retrieveMeal(
    @Param('mealId', ParseIntPipe, ParseUserPipe) mealId: number,
  ) {
    try {
      return await this.mealService.describeMeal(mealId);
    } catch (error) {
      if (error instanceof MealNotFoundException)
        throw new NotFoundException(error.message);
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':mealId')
  async deleteMeal(@Param('mealId') mealId: string) {
    try {
      await this.mealService.deleteUserMeal(+mealId);
    } catch (error) {
      if (error instanceof MealNotFoundException)
        throw new NotFoundException(error.message);
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
