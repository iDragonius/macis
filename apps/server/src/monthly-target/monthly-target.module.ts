import { Module } from '@nestjs/common';
import { MonthlyTargetService } from './monthly-target.service';
import { MonthlyTargetController } from './monthly-target.controller';

@Module({
  controllers: [MonthlyTargetController],
  providers: [MonthlyTargetService],
})
export class MonthlyTargetModule {}
