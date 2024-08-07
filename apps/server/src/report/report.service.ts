import { Injectable } from '@nestjs/common';
import { Periods } from '../core/enums/periods';
import { PrismaService } from '../prisma/prisma.service';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}
  async getReportByPeriodOfTime(period: Periods, managerId: string) {
    let start;
    let end;
    const currentDate = new Date();
    if (period === 'year') {
      start = startOfYear(currentDate);
      end = endOfYear(currentDate);
    } else if (period === 'month') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    } else if (period === 'week') {
      start = startOfWeek(currentDate);
      end = endOfWeek(currentDate);
    } else {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    }

    const followedMeetings = await this.prisma.meetingSchedule.findMany({
      where: {
        result: 'WILL_BE_FOLLOWED',
        managerId,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });
    const refusedMeetings = await this.prisma.meetingSchedule.findMany({
      where: {
        result: 'REFUSED',
        managerId,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });
    const contractSignedMeetings = await this.prisma.meetingSchedule.findMany({
      where: {
        result: 'CONTRACT_SIGNED',
        managerId,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });
    const followedCalls = await this.prisma.callSchedule.findMany({
      where: {
        result: 'WILL_BE_FOLLOWED',
        managerId,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });
    const refusedCalls = await this.prisma.callSchedule.findMany({
      where: {
        result: 'REFUSED',
        managerId,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });

    return {
      followedMeetings,
      followedCalls,
      refusedMeetings,
      refusedCalls,
      contractSignedMeetings,
    };
  }
}
