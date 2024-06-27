import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCallScheduleDto } from './dto/create-call-schedule.dto';
import { UpdateCallScheduleDto } from './dto/update-call-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import { ChangeCallResultDto } from './dto/change-call-result.dto';
import { CallResult } from '@prisma/client';

@Injectable()
export class CallScheduleService {
  constructor(private prisma: PrismaService) {}
  async createCall(data: CreateCallScheduleDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }

    await this.prisma.callSchedule.create({
      data: {
        customerId: data.customerId,
        contactDate: data.contactDate,
        notes: data.notes,
      },
    });

    return {
      success: true,
    };
  }

  async updateCall(data: UpdateCallScheduleDto, id: string) {
    const call = await this.prisma.callSchedule.findUnique({
      where: {
        id,
      },
    });

    if (!call) {
      throw new BadRequestException(ExceptionTypes.CALL_NOT_FOUND);
    }

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });

    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }

    if (call.result === CallResult.UNKNOWN) {
      await this.prisma.callSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: customer.id,
          contactDate: data.contactDate,
          notes: data.notes,
        },
      });
    } else if (call.result === CallResult.REFUSED) {
      await this.prisma.callSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: customer.id,
          contactDate: data.contactDate,
          notes: data.notes,
          reasonForRejection: data.reasonForRejection,
        },
      });
    } else if (call.result === CallResult.WILL_BE_FOLLOWED) {
      await this.prisma.callSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: customer.id,
          contactDate: data.contactDate,
          notes: data.notes,
          nextContactDate: data.nextContactDate,
        },
      });
    } else {
      await this.prisma.callSchedule.update({
        where: {
          id,
        },
        data: {
          customerId: customer.id,
          contactDate: data.contactDate,
          notes: data.notes,
        },
      });
    }
  }
  async getCall(id: string) {
    return await this.prisma.callSchedule.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });
  }
  async changeCallResult(data: ChangeCallResultDto, callId: string) {
    const call = await this.prisma.callSchedule.findUnique({
      where: { id: callId },
    });
    if (!call) {
      throw new BadRequestException(ExceptionTypes.CALL_NOT_FOUND);
    }
    if (data.result === 'WILL_BE_MEETING') {
      await this.prisma.meetingSchedule.create({
        data: {
          customerId: call.customerId,
          meetingDate: call.contactDate,
          contactDate: call.contactDate,
        },
      });
    }
    return await this.prisma.callSchedule.update({
      where: {
        id: callId,
      },
      data: {
        result: data.result,
      },
    });
    // if (data.result === CallResult.REFUSED) {
    //   await this.prisma.callSchedule.update({
    //     where: {
    //       id: callId,
    //     },
    //     data: {
    //       reasonForRejection: data.reasonForRejection,
    //       notes: data.notes,
    //       contactDate: data.contactDate,
    //       result: CallResult.REFUSED,
    //     },
    //   });
    // } else if (data.result === CallResult.WILL_BE_FOLLOWED) {
    //   await this.prisma.callSchedule.update({
    //     where: {
    //       id: callId,
    //     },
    //     data: {
    //       nextContactDate: data.nextContactDate,
    //       notes: data.notes,
    //       contactDate: data.contactDate,
    //       result: CallResult.WILL_BE_FOLLOWED,
    //     },
    //   });
    // } else if (data.result === CallResult.WILL_BE_MEETING) {
    //   await this.prisma.callSchedule.update({
    //     where: {
    //       id: callId,
    //     },
    //     data: {
    //       notes: data.notes,
    //       contactDate: data.contactDate,
    //       result: CallResult.WILL_BE_MEETING,
    //     },
    //   });
    // }
  }

  async getAllCalls(result?: CallResult) {
    return await this.prisma.callSchedule.findMany({
      where: {
        result,
      },
      include: {
        customer: true,
      },
    });
  }

  async getDailyCallSchedule() {
    const currentDate = new Date();
    const formattedDate = new Date(
      currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate(),
    );

    formattedDate.setHours(4);
    return await this.prisma.callSchedule.findMany({
      include: {
        customer: true,
      },
      where: {
        contactDate: {
          equals: formattedDate,
        },
      },
    });
  }
}
