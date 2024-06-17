import { Module } from '@nestjs/common';
import { CleanupEventService } from './cleanup-event.service';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { CleanupController } from './cleanup-event.controller';
import { StorageModule } from '@gc/storage';
import { DaoModule } from '../dao/dao.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [DatabaseModule, StorageModule, DaoModule, AchievementsModule],
  exports: [CleanupEventService],
  providers: [CleanupEventService],
  controllers: [CleanupController],
})
export class CleanupEventModule {}
