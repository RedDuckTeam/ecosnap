import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { PointsService } from './points.service';
import { UseUserAuthGuard } from '../guards/user-auth.guard';
import 'multer';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';

export const GC_API_TAG = 'Points';

@Controller('points')
@ApiTags(GC_API_TAG)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('/')
  @UseUserAuthGuard()
  async postCastVote(@RequestUser() user: UserClaims) {
    return { points: await this.pointsService.getUserPoints(user.pubKey) };
  }
}
