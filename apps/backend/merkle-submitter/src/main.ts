import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SubmitterService } from './submitter/submitter.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const logger = app.get(Logger);
  const submitter = app.get(SubmitterService);

  logger.log(`🚀 Running a merkle submitter cron`);

  await submitter.process();

  logger.log(`Cron successfully finished`);
}
bootstrap();
