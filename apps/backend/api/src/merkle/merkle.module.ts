import { Module } from '@nestjs/common';
import { DatabaseModule } from '@gc/database-common';
import { MerkleService } from './merkle.service';
import { MerkleController } from './merkle.controller';

@Module({
  imports: [DatabaseModule],
  exports: [MerkleService],
  providers: [MerkleService],
  controllers: [MerkleController],
})
export class MerkleModule {}
