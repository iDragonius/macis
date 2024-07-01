import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurationCallService } from './curation-call.service';
import { CreateCurationCallDto } from './dto/create-curation-call.dto';
import { UpdateCurationCallDto } from './dto/update-curation-call.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('curation-call')
export class CurationCallController {
  constructor(private readonly curationCallService: CurationCallService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  create(@Body() data: CreateCurationCallDto) {
    return this.curationCallService.create(data);
  }

  @Get()
  findAll() {
    return this.curationCallService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curationCallService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCurationCallDto: UpdateCurationCallDto,
  ) {
    return this.curationCallService.update(id, updateCurationCallDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.curationCallService.remove(id);
  }
}
