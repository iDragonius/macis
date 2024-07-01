import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurationMeetingService } from './curation-meeting.service';
import { CreateCurationMeetingDto } from './dto/create-curation-meeting.dto';
import { UpdateCurationMeetingDto } from './dto/update-curation-meeting.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { Role } from '../core/enums/role.enum';

@Controller('curation-meeting')
export class CurationMeetingController {
  constructor(
    private readonly curationMeetingService: CurationMeetingService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async create(@Body() data: CreateCurationMeetingDto) {
    return this.curationMeetingService.create(data);
  }

  @Get()
  async findAll() {
    return this.curationMeetingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.curationMeetingService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCurationMeetingDto: UpdateCurationMeetingDto,
  ) {
    return this.curationMeetingService.update(id, updateCurationMeetingDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.curationMeetingService.remove(id);
  }
}
