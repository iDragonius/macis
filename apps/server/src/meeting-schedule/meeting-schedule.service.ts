import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingScheduleDto } from './dto/create-meeting-schedule.dto';
import { UpdateMeetingScheduleDto } from './dto/update-meeting-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import { CallResult, MeetingResult } from '@prisma/client';
import { ChangeMeetingResultDto } from './dto/change-meeting-result.dto';

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
  async updateMeeting(data: UpdateMeetingScheduleDto, id: string) {
    const meeting = await this.prisma.meetingSchedule.findUnique({
      where: {
        id,
      },
    });

    if (!meeting) {
      throw new BadRequestException(ExceptionTypes.MEETING_NOT_FOUND);
    }

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }

    if (
      meeting.result === MeetingResult.UNKNOWN ||
      meeting.result === MeetingResult.CONTRACT_SIGNED
    ) {
      return await this.prisma.meetingSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          meetingTime: data.meetingTime,
          meetingDate: data.meetingDate,
        },
      });
    } else if (meeting.result === MeetingResult.REFUSED) {
      return await this.prisma.meetingSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          meetingTime: data.meetingTime,
          meetingDate: data.meetingDate,
          reasonForRejection: data.reasonForRejection,
        },
      });
    } else if (meeting.result === MeetingResult.WILL_BE_FOLLOWED) {
      return await this.prisma.meetingSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: data.customerId,
          contactDate: data.contactDate,
          notes: data.notes,
          meetingTime: data.meetingTime,
          meetingDate: data.meetingDate,
          nextMeetingDate: data.nextMeetingDate,
          nextContactDate: data.nextContactDate,
        },
      });
    }
  }

  async getMeeting(id: string) {
    return await this.prisma.meetingSchedule.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });
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
    const formattedDate = new Date(
      currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate(),
    );

    formattedDate.setHours(4);
    return await this.prisma.meetingSchedule.findMany({
      include: {
        customer: true,
      },
      where: {
        meetingDate: {
          equals: formattedDate,
        },
      },
    });
  }

  async changeMeetingResult(data: ChangeMeetingResultDto, meetingId: string) {
    return await this.prisma.meetingSchedule.update({
      where: {
        id: meetingId,
      },
      data: {
        result: data.result,
      },
    });
  }
}
