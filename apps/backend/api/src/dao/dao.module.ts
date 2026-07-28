import { Module } from '@nestjs/common';
import { DaoService } from './dao.service';
import { DatabaseModule } from '@gc/database-common';
import { DaoController } from './dao.controller';

@Module({
  imports: [DatabaseModule],
  exports: [DaoService],
  providers: [DaoService],
  controllers: [DaoController],
})
export class DaoModule {}
