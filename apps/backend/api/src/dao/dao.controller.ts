import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { DaoService } from './dao.service';
import { UseDaoUserAuthGuard } from '../guards/dao-user-auth.guard';
import { RequestUser, UserClaims } from '../decorators/request-user.decorator';
import { CastVoteDirection } from '@gc/database-gc';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export const DAO_API_TAG = 'DAO';

export class CastVoteDTO {
  @ApiProperty({ type: String, nullable: false })
  @IsUUID()
  garbageCollectId: string;

  @ApiProperty({ type: String, nullable: false })
  @IsString()
  signature: string;

  @ApiProperty({ type: CastVoteDirection, nullable: false, enum: CastVoteDirection })
  @IsEnum(CastVoteDirection)
  voteDirection: CastVoteDirection;
}

@Controller('dao')
@ApiTags(DAO_API_TAG)
export class DaoController {
  constructor(private readonly daoService: DaoService) {}

  @Post('/vote')
  @UseDaoUserAuthGuard()
  async postCastVote(@Body() castVote: CastVoteDTO, @RequestUser() { pubKey }: UserClaims) {
    return this.daoService.castVote({ ...castVote, voterPubKey: pubKey });
  }

  @Get('/vote/message')
  getSignMessage(@Query('gcId') gcId: string, @Query('voteDirection') voteDirection: CastVoteDirection) {
    return { message: this.daoService.getSignMessage(gcId, voteDirection) };
  }
}
