import { Module } from '@nestjs/common';
import { CurationMeetingService } from './curation-meeting.service';
import { CurationMeetingController } from './curation-meeting.controller';

@Module({
  controllers: [CurationMeetingController],
  providers: [CurationMeetingService],
})
export class CurationMeetingModule {}
