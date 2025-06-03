import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [AuthModule, FoodsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
