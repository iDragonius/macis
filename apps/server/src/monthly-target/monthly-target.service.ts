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
    const possibleExistedMonthlyTargetForManager =
      await this.prisma.monthlyTarget.findFirst({
        where: {
          managerId: data.managerId,
          year: data.year,
          month: data.month,
        },
      });
    if (possibleExistedMonthlyTargetForManager) {
      throw new BadRequestException(
        ExceptionTypes.MANAGER_MONTHLY_TARGET_ALREADY_EXIST,
      );
    }
    return await this.prisma.monthlyTarget.create({
      data: {
        managerId: data.managerId,
        meetingTarget: data.meetingTarget,
        month: data.month,
        year: data.year,
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
      let followingMeetingsCount = 0;
      let refusedMeetingsCount = 0;
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
            } else if (meeting.result === 'REFUSED') {
              refusedMeetingsCount++;
            } else if (meeting.result === 'WILL_BE_FOLLOWED') {
              followingMeetingsCount++;
            }
          }
        });
      });

      temp.push({
        data: monthlyTarget,
        meetingCount,
        signedContractCount,
        totalAmount,
        followingMeetingsCount,
        refusedMeetingsCount,
      });
    });
    await Promise.all(promises);
    return temp;
  }

  async deleteMonthlyTarget(id: string) {
    return await this.prisma.monthlyTarget.delete({ where: { id } });
  }

  async updateMonthlyTarget(id: string, data: UpdateMonthlyTargetDto) {
    const manager = await this.prisma.user.findUnique({
      where: {
        id: data.managerId,
      },
    });

    if (!manager) {
      throw new BadRequestException(ExceptionTypes.MANAGER_NOT_FOUND);
    }

    return await this.prisma.monthlyTarget.update({
      where: { id },
      data: {
        managerId: data.managerId,
        meetingTarget: data.meetingTarget,
        month: data.month,
        year: data.year,
      },
    });
  }

  async getMonthlyTarget(id: string) {
    return await this.prisma.monthlyTarget.findUnique({
      where: { id },
      include: {
        manager: true,
      },
    });
  }
}
