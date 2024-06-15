import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import { StorageService } from '@gc/storage';

@Injectable()
export class SubmitterService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService
  ) {}

  async process() {}
}
