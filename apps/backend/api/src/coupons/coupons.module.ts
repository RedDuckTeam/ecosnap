import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { DatabaseModule } from '@gc/database-common';
import { CouponsController } from './coupons.controller';
import { StorageModule } from '@gc/storage';
import { DaoModule } from '../dao/dao.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [DatabaseModule, StorageModule, DaoModule, AchievementsModule],
  exports: [CouponsService],
  providers: [CouponsService],
  controllers: [CouponsController],
})
export class CouponsModule {}
