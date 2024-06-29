import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCurationMeetingDto } from './dto/create-curation-meeting.dto';
import { UpdateCurationMeetingDto } from './dto/update-curation-meeting.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';

@Injectable()
export class CurationMeetingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCurationMeetingDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }
    return await this.prisma.curationMeeting.create({
      data: data,
    });
  }

  async findAll() {
    return await this.prisma.curationMeeting.findMany({
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.curationMeeting.findUnique({
      where: { id },
      include: { customer: true },
    });
  }

  async update(id: string, data: UpdateCurationMeetingDto) {
    const curationMeeting = await this.prisma.curationMeeting.findUnique({
      where: { id },
    });
    if (!curationMeeting) {
      throw new BadRequestException(ExceptionTypes.CURATION_MEETING_NOT_FOUND);
    }
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }
    return await this.prisma.curationMeeting.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async remove(id: string) {
    return await this.prisma.curationMeeting.delete({ where: { id } });
  }
}
