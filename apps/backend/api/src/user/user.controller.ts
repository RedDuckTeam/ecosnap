import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';

export const GC_API_TAG = 'User';

@Controller('user')
@ApiTags(GC_API_TAG)
export class UserController {
  constructor(private readonly pointsService: UserService) {}

  @Get('/')
  @UseUserAuthGuard()
  async getUser(@RequestUser() user: UserClaims) {
    return { user: await this.pointsService.getUser(user.pubKey) };
  }
}
