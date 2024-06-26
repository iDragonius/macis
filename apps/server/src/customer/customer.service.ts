import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import { CustomerStatus } from '@prisma/client';
import { ChangeCustomerStatusDto } from './dto/change-customer-status.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async createCustomer(data: CreateCustomerDto) {
    const potentialExistingCustomer = await this.prisma.customer.findUnique({
      where: { company: data.company },
    });

    if (potentialExistingCustomer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_ALREADY_EXIST);
    }
    if (data.status === 'ACTIVE') {
      if (!data.curatorId) {
        throw new BadRequestException();
      }
      const curator = await this.prisma.user.findUnique({
        where: {
          id: data.curatorId,
        },
      });
      if (!curator) {
        throw new BadRequestException(ExceptionTypes.CURATOR_NOT_FOUND);
      }
      await this.prisma.customer.create({
        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,
          contractDate: data.contractDate,

          service: data.service,
          payment: data.payment,

          companyEstablishmentDate: data.companyEstablishmentDate,
          ownersBirthday: data.ownersBirthday,
          curatorId: curator.id,
        },
      });
    } else if (data.status === 'POTENTIAL') {
      await this.prisma.customer.create({
        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,

          service: data.service,
          source: data.source,
          notes: data.notes,
        },
      });
    } else {
      await this.prisma.customer.create({
        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,
          contractDate: data.contractDate,
          contractExpirationDate: data.contractExpirationDate,

          service: data.service,
          termsOfPayment: data.termsOfPayment,
          terminationReason: data.terminationReason,
        },
      });
    }

    return {
      success: true,
    };
  }

  async changeCustomerStatus(id: string, data: ChangeCustomerStatusDto) {
    await this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });

    return {
      status: data.status,
    };
  }
  async getAllCustomers(status: CustomerStatus) {
    if (status) {
      if (status === CustomerStatus.ACTIVE) {
        return this.prisma.customer.findMany({
          where: {
            status: CustomerStatus.ACTIVE,
          },
          include: {
            curator: {
              include: {
                profile: true,
              },
            },
          },
        });
      } else if (status === CustomerStatus.POTENTIAL) {
        return this.prisma.customer.findMany({
          where: {
            status: CustomerStatus.POTENTIAL,
          },
          include: {
            curator: {
              include: {
                profile: true,
              },
            },
          },
        });
      } else if (status === CustomerStatus.LOST) {
        return this.prisma.customer.findMany({
          where: {
            status: CustomerStatus.LOST,
          },
          include: {
            curator: {
              include: {
                profile: true,
              },
            },
          },
        });
      }
    } else {
      return this.prisma.customer.findMany({
        include: {
          curator: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
  }
  async getActiveCustomers() {
    return this.prisma;
  }
  async getPotentialCustomers() {}
  async getLostCustomers() {}

  async getCustomer(id: string) {
    return await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        calls: true,
        meetings: true,
      },
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  async deleteCustomer(id: string) {
    return await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
