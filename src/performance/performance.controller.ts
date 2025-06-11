import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { PerformanceService } from './performance.service';

@Controller('performance')
@UseGuards(AuthGuard)
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
