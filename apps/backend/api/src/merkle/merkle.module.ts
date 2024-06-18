import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { DatabaseModule } from '@gc/database-common';
import { StorageModule } from '@gc/storage';
import { MerkleService } from './merkle.service';
import { MerkleController } from './merkle.controller';

@Module({
  imports: [DatabaseModule],
  exports: [MerkleService],
  providers: [MerkleService],
  controllers: [MerkleController],
})
export class MerkleModule {}
