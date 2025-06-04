import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [AuthModule, FoodsModule, MealsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
