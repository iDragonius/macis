import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionTypes } from '../core/exceptions';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const checkCategory = await this.prisma.category.findUnique({
      where: {
        name: data.name,
      },
    });
    if (checkCategory) {
      throw new BadRequestException(ExceptionTypes.CATEGORY_ALREADY_EXIST);
    }
    return await this.prisma.category.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async remove(id: string) {
    return await this.prisma.category.delete({ where: { id } });
  }
}
