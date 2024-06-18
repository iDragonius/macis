import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async me(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
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

    return {
      success: true,
    };
  }

  hashData(data): Promise<string> {
    return bcrypt.hash(data, 10);
  }
}
