import { Module } from '@nestjs/common';
import { GcService } from './gc.service';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { GcController } from './gc.controller';
import { StorageModule } from '@gc/storage';
import { DaoModule } from '../dao/dao.module';

@Module({
  imports: [DatabaseModule, StorageModule, DaoModule],
  exports: [GcService],
  providers: [GcService],
  controllers: [GcController],
})
export class GcModule {}
