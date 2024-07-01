import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}
  async me(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            fatherName: true,
            phoneNumber: true,
            gender: true,
          },
        },
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const potentialExistingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (potentialExistingUser) {
      throw new BadRequestException(ExceptionTypes.USER_ALREADY_EXIST);
    }
    const hashedPassword = await this.hashData(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            fatherName: data.fatherName,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException(ExceptionTypes.UNEXPECTED_ERROR);
    }
    this.mailService.sendUserCredentials({
      fullName: data.firstName + ' ' + data.lastName,
      email: data.email,
      password: data.password,
    });
    return {
      success: true,
    };
  }

  async getUser(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        customers: {
          include: {
            meetings: {
              include: {
                customer: true,
              },
            },
            calls: true,
          },
        },
      },
    });
  }
  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
  hashData(data): Promise<string> {
    return bcrypt.hash(data, 10);
  }
}
