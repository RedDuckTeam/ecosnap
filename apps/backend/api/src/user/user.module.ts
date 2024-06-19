import { Module } from '@nestjs/common';
import { DatabaseModule } from '@gc/database-common';
import { UserController } from './user.controller';
import { StorageModule } from '@gc/storage';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
