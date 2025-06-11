import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get(':userId')
  async performance(
    @Param('userId', ParseIntPipe, ParseUserPipe) userId: number,
  ) {
    try {
      return await this.performanceService.getPerformanceByUser(userId);
    } catch (error) {
      console.log(error);
    }
  }
}
