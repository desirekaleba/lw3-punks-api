import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(PORT);
  Logger.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
