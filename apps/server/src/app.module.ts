import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './core/guards';
import { ValidationFilter } from './core/exceptions/validation/validation.filter';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './core/services/tasks.service';
import { UserModule } from './user/user.module';
import { MeetingScheduleModule } from './meeting-schedule/meeting-schedule.module';
import { CallScheduleModule } from './call-schedule/call-schedule.module';
import { RolesGuard } from './core/guards/roles.guard';
import { MonthlyTargetModule } from './monthly-target/monthly-target.module';
import { CurationMeetingModule } from './curation-meeting/curation-meeting.module';
import { CurationCallModule } from './curation-call/curation-call.module';
import { CategoryModule } from './category/category.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    MailModule,
    CustomerModule,
    UserModule,
    MeetingScheduleModule,
    CallScheduleModule,
    MonthlyTargetModule,
    CurationCallModule,
    CurationMeetingModule,
    CategoryModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },

    TasksService,
  ],
})
export class AppModule {}
