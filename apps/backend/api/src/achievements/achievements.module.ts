import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { DatabaseModule } from '@gc/database-common';
import { AchievementsController } from './achievements.controller';

@Module({
  exports: [AchievementsService],
  providers: [AchievementsService],
  imports: [DatabaseModule],
  controllers: [AchievementsController],
})
export class AchievementsModule {}
