import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM, {
    timeZone: 'Asia/Baku',
  })
  dailyCallSchedule() {
    console.log('aaaa');
  }

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_9AM, {
    timeZone: 'Asia/Baku',
  })
  dailyAppointmentSchedule() {
    console.log('aaaa');
  }
}
