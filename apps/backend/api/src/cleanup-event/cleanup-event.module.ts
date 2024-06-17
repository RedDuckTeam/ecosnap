import { Module } from '@nestjs/common';
import { CleanupEventService } from './cleanup-event.service';
import { DatabaseModule } from '@gc/database-common';
import { CleanupController } from './cleanup-event.controller';
import { StorageModule } from '@gc/storage';

@Module({
  imports: [DatabaseModule, StorageModule],
  exports: [CleanupEventService],
  providers: [CleanupEventService],
  controllers: [CleanupController],
})
export class CleanupEventModule {}
