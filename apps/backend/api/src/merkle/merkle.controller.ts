import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import 'multer';
import { DataSource } from 'typeorm';
import { MerkleService } from './merkle.service';
import { PublicKey } from '@solana/web3.js';

export const MERKLE_API_TAG = 'Merkle';

@Controller('merkle')
@ApiTags(MERKLE_API_TAG)
export class MerkleController {
  constructor(
    private readonly merkleService: MerkleService,
    private readonly dataSource: DataSource
  ) {}

  @Get('/proof/:pubkey/:submissionId')
  async getProofs(@Query('pubkey') pubkey: string, @Query('submissionId') submissionId: string) {
    return await this.merkleService.getProofs({
      submissionId,
      user: new PublicKey(pubkey),
    });
  }
}
