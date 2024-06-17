import { Module } from '@nestjs/common';
import { DatabaseModule } from '@gc/database-common';
import { PointsController } from './points.controller';
import { StorageModule } from '@gc/storage';
import { PointsService } from './points.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  exports: [PointsService],
  providers: [PointsService],
  controllers: [PointsController],
})
export class PointsModule {}
