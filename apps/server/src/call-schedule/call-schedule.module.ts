import { Module } from '@nestjs/common';
import { CallScheduleService } from './call-schedule.service';
import { CallScheduleController } from './call-schedule.controller';

@Module({
  controllers: [CallScheduleController],
  providers: [CallScheduleService],
})
export class CallScheduleModule {}
