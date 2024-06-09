import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from './core/exceptions/validation/validation.exception';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            error: `${error.property} has wrong value ${error.value}.`,
            message: Object.values(error.constraints).join(''),
          };
        });

        return new ValidationException(messages);
      },
    }),
  );

  await app.listen(4000);
}
bootstrap();
