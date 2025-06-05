import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';

@Module({
  providers: [MealsService],
  controllers: [MealsController],
})
export class MealsModule {}
