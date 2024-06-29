import { Module } from '@nestjs/common';
import { CurationCallService } from './curation-call.service';
import { CurationCallController } from './curation-call.controller';

@Module({
  controllers: [CurationCallController],
  providers: [CurationCallService],
})
export class CurationCallModule {}
