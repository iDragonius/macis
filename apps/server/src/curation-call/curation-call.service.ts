import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCurationCallDto } from './dto/create-curation-call.dto';
import { UpdateCurationCallDto } from './dto/update-curation-call.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';

@Injectable()
export class CurationCallService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCurationCallDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }
    return await this.prisma.curationCall.create({
      data: data,
    });
  }

  async findAll() {
    return await this.prisma.curationCall.findMany({
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.curationCall.findUnique({
      where: { id },
      include: { customer: true },
    });
  }

  async update(id: string, data: UpdateCurationCallDto) {
    const curationCall = await this.prisma.curationCall.findUnique({
      where: { id },
    });
    if (!curationCall) {
      throw new BadRequestException(ExceptionTypes.CURATION_CALL_NOT_FOUND);
    }
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }
    return await this.prisma.curationCall.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async remove(id: string) {
    return await this.prisma.curationCall.delete({ where: { id } });
  }
}
