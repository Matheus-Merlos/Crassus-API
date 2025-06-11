import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';

@Module({
  providers: [PerformanceService],
  controllers: [PerformanceController],
})
export class PerformanceModule {}
