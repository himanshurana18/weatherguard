import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION - the process would otherwise exit silently:');
  console.error(reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION - the process would otherwise exit silently:');
  console.error(err);
});

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting WeatherGuard API...');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`API running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('FATAL: bootstrap() failed:');
  console.error(err);
  process.exit(1);
});

