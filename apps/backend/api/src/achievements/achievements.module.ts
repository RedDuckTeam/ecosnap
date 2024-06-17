import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { DatabaseModule } from '@gc/database-common';

@Module({
  exports: [AchievementsService],
  providers: [AchievementsService],
  imports: [DatabaseModule],
})
export class AchievementsModule {}
