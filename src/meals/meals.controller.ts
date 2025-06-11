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
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsUserPipe } from 'src/pipes/is-user.pipe';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { MealDTO, MealPatchDTO } from './meals.dto';
import {
  FoodNotFoundException,
  MealNotFoundException,
} from './meals.exceptions';
import { MealsService } from './meals.service';

@Controller('meals')
@UseGuards(AuthGuard)
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
  async listMeals(@Param('userId') userId: string) {
    try {
      return this.mealService.listUserMeals(+userId);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  @Patch(':userId/:mealId')
  async patchMeal(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Param('mealId', ParseIntPipe) mealId: number,
    @Body() body: MealPatchDTO,
  ) {
    try {
      return await this.mealService.patchMeals(userId, mealId, body);
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
  async retrieveMeal(@Param('mealId') mealId: string) {
    try {
      return await this.mealService.describeMeal(+mealId);
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
