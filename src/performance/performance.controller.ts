import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParseUserPipe } from 'src/pipes/parse-user.pipe';
import { PerformanceService } from './performance.service';

@ApiTags('Performance')
@Controller('performance')
@UseGuards(AuthGuard)
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user performance' })
  @ApiResponse({ status: 200, description: 'Return user performance.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
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
