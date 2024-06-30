import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMonthlyTargetDto } from './dto/create-monthly-target.dto';
import { UpdateMonthlyTargetDto } from './dto/update-monthly-target.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import { Months } from '../core/enums/months';

@Injectable()
export class MonthlyTargetService {
  constructor(private prisma: PrismaService) {}

  async createMonthlyTarget(data: CreateMonthlyTargetDto) {
    const manager = await this.prisma.user.findUnique({
      where: {
        id: data.managerId,
      },
    });

    if (!manager) {
      throw new BadRequestException(ExceptionTypes.MANAGER_NOT_FOUND);
    }

    return await this.prisma.monthlyTarget.create({
      data: {
        managerId: data.managerId,
        meetingTarget: data.meetingTarget,
        month: data.month,
      },
    });
  }

  async getAllMonthlyTargets() {
    const monthlyTargets = await this.prisma.monthlyTarget.findMany({
      include: {
        manager: {
          include: {
            profile: true,
          },
        },
      },
    });
    const temp: any[] = [];
    const promises = monthlyTargets.map(async (monthlyTarget) => {
      const customers = await this.prisma.customer.findMany({
        where: {
          managerId: monthlyTarget.managerId,
        },
        include: {
          meetings: true,
          calls: true,
        },
      });
      let meetingCount = 0;
      let signedContractCount = 0;
      let totalAmount = 0;
      customers.map((customer) => {
        customer.meetings.map((meeting) => {
          if (
            Months[new Date(meeting.meetingDate).getMonth()] ===
            monthlyTarget.month
          ) {
            meetingCount++;
            if (meeting.result === 'CONTRACT_SIGNED') {
              signedContractCount++;

              totalAmount += customer.paymentAmount;
            }
          }
        });
      });

      temp.push({
        data: monthlyTarget,
        meetingCount,
        signedContractCount,
        totalAmount,
      });
    });
    await Promise.all(promises);
    return temp;
  }
}
