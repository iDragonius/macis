import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMonthlyTargetDto } from './dto/create-monthly-target.dto';
import { UpdateMonthlyTargetDto } from './dto/update-monthly-target.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';

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
        managerId: manager.id,
        meetingTarget: data.meetingTarget,
        month: data.month,
      },
    });
  }

  async getAllMonthlyTargets() {
    return await this.prisma.monthlyTarget.findMany({
      include: {
        manager: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
