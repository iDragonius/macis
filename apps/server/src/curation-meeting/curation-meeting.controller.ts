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

@Controller('curation-meeting')
export class CurationMeetingController {
  constructor(
    private readonly curationMeetingService: CurationMeetingService,
  ) {}

  @Post()
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
  async update(
    @Param('id') id: string,
    @Body() updateCurationMeetingDto: UpdateCurationMeetingDto,
  ) {
    return this.curationMeetingService.update(id, updateCurationMeetingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.curationMeetingService.remove(id);
  }
}
