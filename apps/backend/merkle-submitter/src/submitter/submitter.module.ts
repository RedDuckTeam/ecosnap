import { Module } from '@nestjs/common';
import { DatabaseModule } from '@gc/database-common';
import { StorageModule } from '@gc/storage';
import { SubmitterService } from './submitter.service';
import { ProvidersModule } from '@gc/providers';

@Module({
  imports: [DatabaseModule, StorageModule, ProvidersModule],
  exports: [SubmitterService],
  providers: [SubmitterService],
})
export class SubmitterModule {}
