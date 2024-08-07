import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Periods } from '../core/enums/periods';
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id')
  async getReportByPeriodOfTime(
    @Query('period') period: Periods,
    @Param('id') managerId: string,
  ) {
    return this.reportService.getReportByPeriodOfTime(period, managerId);
  }
}
