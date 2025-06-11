import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';
import { MealsModule } from './meals/meals.module';
import { PerformanceModule } from './performance/performance.module';
import { RacesModule } from './races/races.module';

@Module({
  imports: [
    AuthModule,
    FoodsModule,
    MealsModule,
    RacesModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
