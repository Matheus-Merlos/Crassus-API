import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IsUserPipe } from 'src/pipes/is-user.pipe';
import { ParseMealPipe } from 'src/pipes/parse-meal.pipe';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { MealDTO, MealPatchDTO } from './meals.dto';
import { FoodNotFoundException } from './meals.exceptions';
import { MealsService } from './meals.service';

@ApiTags('Meals')
@Controller('meals')
@UseGuards(AuthGuard)
export class MealsController {
  constructor(private readonly mealService: MealsService) {}

  @Get('types')
  @ApiOperation({ summary: 'List all meal types' })
  @ApiResponse({ status: 200, description: 'Return a list of meal types.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
  @ApiOperation({ summary: 'List all meals for a user' })
  @ApiResponse({ status: 200, description: 'Return a list of meals.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async listMeals(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
  ) {
    try {
      return this.mealService.listUserMeals(+userId);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':userId/:mealId')
  @ApiOperation({ summary: 'Update a meal' })
  @ApiResponse({
    status: 200,
    description: 'The meal has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Food not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new meal' })
  @ApiResponse({
    status: 201,
    description: 'The meal has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Food not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createMeal(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Body() mealBody: MealDTO,
  ) {
    try {
      return await this.mealService.createMeal(userId, mealBody);
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
  @ApiOperation({ summary: 'Get a specific meal' })
  @ApiResponse({ status: 200, description: 'Return a meal.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async retrieveMeal(
    @Param('userId', ParseIntPipe, ParseUserPipe, IsUserPipe) userId: number,
    @Param('mealId', ParseIntPipe, ParseMealPipe) mealId: number,
  ) {
    try {
      return await this.mealService.describeMeal(+mealId);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':mealId')
  @ApiOperation({ summary: 'Delete a meal' })
  @ApiResponse({
    status: 200,
    description: 'The meal has been successfully deleted.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteMeal(
    @Param('mealId', ParseIntPipe, ParseMealPipe) mealId: string,
  ) {
    try {
      await this.mealService.deleteUserMeal(+mealId);
    } catch (error) {
      throw new HttpException(
        `Internal server error: ${(error as Error).message}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
