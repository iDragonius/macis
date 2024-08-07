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
    const manager = await this.prisma.user.findUnique({
      where: {
        id: data.managerId,
      },
    });
    if (!manager) {
      throw new BadRequestException(ExceptionTypes.MANAGER_NOT_FOUND);
    }
    if (data.status === 'ACTIVE') {
      if (!data.managerId) {
        throw new BadRequestException();
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
          paymentAmount: data.paymentAmount,

          companyEstablishmentDate: data.companyEstablishmentDate,
          ownersBirthday: data.ownersBirthday,
          curator: data.curator,
          managerId: manager.id,
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
          managerId: manager.id,
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
          curator: data.curator,
          service: data.service,
          termsOfPayment: data.termsOfPayment,
          terminationReason: data.terminationReason,
          managerId: manager.id,
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
            manager: {
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
            manager: {
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
            manager: {
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
          manager: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
  }

  async getCustomer(id: string) {
    return await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        calls: true,
        meetings: true,
        manager: true,
      },
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new BadRequestException(ExceptionTypes.CUSTOMER_NOT_FOUND);
    }

    const manager = await this.prisma.user.findUnique({
      where: {
        id: data.managerId,
      },
    });
    if (!manager) {
      throw new BadRequestException(ExceptionTypes.MANAGER_NOT_FOUND);
    }
    if (data.status === 'ACTIVE') {
      if (!data.managerId) {
        throw new BadRequestException();
      }

      await this.prisma.customer.update({
        where: { id },
        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,
          contractDate: data.contractDate,

          service: data.service,
          paymentAmount: data.paymentAmount,
          paymentInformation: data.paymentInformation,
          companyEstablishmentDate: data.companyEstablishmentDate,
          ownersBirthday: data.ownersBirthday,
          curator: data.curator,
          managerId: manager.id,
        },
      });
    } else if (data.status === 'POTENTIAL') {
      await this.prisma.customer.update({
        where: { id },

        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,

          service: data.service,
          source: data.source,
          notes: data.notes,
          managerId: manager.id,
        },
      });
    } else {
      await this.prisma.customer.update({
        where: { id },
        data: {
          status: data.status,
          company: data.company,
          head: data.head,
          contactNumber: data.contactNumber,
          position: data.position,
          contractDate: data.contractDate,
          contractExpirationDate: data.contractExpirationDate,
          curator: data.curator,
          service: data.service,
          termsOfPayment: data.termsOfPayment,
          terminationReason: data.terminationReason,
          managerId: manager.id,
        },
      });
    }

    return {
      success: true,
    };
  }

  async deleteCustomer(id: string) {
    return await this.prisma.customer.delete({
      where: {
        id,
      },
    });
  }
}
