import { Module } from '@nestjs/common';
import { DaoService } from './dao.service';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { DaoController } from './dao.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule],
  exports: [DaoService],
  providers: [DaoService],
  controllers: [DaoController],
})
export class DaoModule {}
