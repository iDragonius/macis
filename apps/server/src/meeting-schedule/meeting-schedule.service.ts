import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingScheduleDto } from './dto/create-meeting-schedule.dto';
import { UpdateMeetingScheduleDto } from './dto/update-meeting-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import { CallResult, MeetingResult } from '@prisma/client';

@Injectable()
export class MeetingScheduleService {
  constructor(private prisma: PrismaService) {}

  async createMeeting(data: CreateMeetingScheduleDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }

    await this.prisma.meetingSchedule.create({
      data: {
        customerId: data.customerId,
        contactDate: data.contactDate,
        meetingDate: data.meetingDate,
        notes: data.notes,
      },
    });

    return {
      success: true,
    };
  }

  async getAllMeetings(result?: MeetingResult) {
    return await this.prisma.meetingSchedule.findMany({
      where: {
        result,
      },
      include: {
        customer: true,
      },
    });
  }

  async getDailyMeetingSchedule() {
    const currentDate = new Date();
    const formattedDate =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate();
    return await this.prisma.meetingSchedule.findMany({
      include: {
        customer: true,
      },
      where: {
        meetingDate: {
          gte: new Date(formattedDate),
        },
      },
    });
  }
}
