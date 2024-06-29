import { PartialType } from '@nestjs/mapped-types';
import { CreateCurationMeetingDto } from './create-curation-meeting.dto';

export class UpdateCurationMeetingDto extends PartialType(CreateCurationMeetingDto) {}
