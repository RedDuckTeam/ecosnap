import { Module } from '@nestjs/common';
import { DatabaseModule } from '@gc/database-common';
import { StorageModule } from '@gc/storage';
import { SubmitterService } from './submitter.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  exports: [SubmitterService],
  providers: [SubmitterService],
})
export class SubmitterModule {}
