import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './core/guards';
import { ValidationFilter } from './core/exceptions/validation/validation.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
})
export class AppModule {}
