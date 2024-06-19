import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource, EntityManager, IsNull, Not } from 'typeorm';
import { StorageService } from '@gc/storage';
import 'multer';
import {
  CastVoteDirection,
  File,
  GarbageCollect,
  MerkleSubmission,
  MerkleTreeType,
  SubmissionType,
  User,
} from '@gc/database-gc';

import crypto from 'crypto';
import { getFileExtensionFromFile } from '../lib/utils/utils';
import { DaoService } from '../dao/dao.service';
@Injectable()
export class GcService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
    private readonly daoService: DaoService
  ) {}

  async getGcsByPubkey({ pubkey }: { pubkey: PublicKey }) {
    const allGcs = await this.dataSource.getRepository(GarbageCollect).find({
      where: {
        user: { pubKey: pubkey },
      },
      relations: {
        files: true,
        daoVotes: true,
      },
    });

    return this.formatGcs(allGcs);
  }

  async getGcs() {
    const allGcs = await this.dataSource.getRepository(GarbageCollect).find({
      relations: {
        files: true,
        daoVotes: true,
        user: true,
      },
    });

    return this.formatGcs(allGcs);
  }

  formatGcs(gcs: GarbageCollect[]) {
    return gcs.map((v) => ({
      daoVotes: {
        for: v.daoVotes.filter((d) => d.voteDirection === CastVoteDirection.FOR).length,
        against: v.daoVotes.filter((d) => d.voteDirection === CastVoteDirection.AGAINST).length,
        threshold: this.daoService.votesThreshold(),
      },
      merkleSubmitted: v.merkleSubmitted,
      pointsGiven: v.merkleSubmitted ?? 0,
      description: v.description,
      id: v.id,
      files: v.files,
      user: v.user.pubKey.toBase58(),
    }));
  }

  async getLastSubmissions(manager: EntityManager) {
    const lastFull = await manager.getRepository(MerkleSubmission).findOne({
      order: {
        createdAt: 'DESC',
      },
      where: {
        submissionType: SubmissionType.GC,
        treeType: MerkleTreeType.FULL,
        treeFile: Not(IsNull()),
        submissionTxHash: Not(IsNull()),
      },
      relations: {
        treeFile: true,
      },
    });

    const lastProofs = await manager.getRepository(MerkleSubmission).findOne({
      order: {
        createdAt: 'DESC',
      },
      where: {
        submissionType: SubmissionType.GC,
        treeType: MerkleTreeType.ONLY_PROOFS,
        treeFile: Not(IsNull()),
        submissionTxHash: Not(IsNull()),
      },
      relations: {
        treeFile: true,
      },
    });

    return {
      lastFull,
      lastProofs,
    };
  }

  async publish({
    files,
    publisher,
    description,
  }: {
    files: { photos: Express.Multer.File[]; videos: Express.Multer.File[] };
    publisher: PublicKey;
    description?: string;
  }) {
    files.photos.forEach((v) => {
      if (v.size > 5_000_000) throw new BadRequestException('Photo file size should be <=5mb');
    });

    files.videos.forEach((v) => {
      if (v.size > 100_000_000) throw new BadRequestException('Video file size should be <=100mb');
    });

    return await this.dataSource.manager.transaction(async (manager) => {
      const fileRepo = manager.getRepository(File);
      const gcRepo = manager.getRepository(GarbageCollect);
      const userRepo = manager.getRepository(User);

      const user = await userRepo.findOneBy({
        pubKey: publisher,
      });

      if (!user) throw new BadRequestException('User is not found');

      const garbageCollect = await gcRepo.save(
        gcRepo.create({
          user,
          description,
        })
      );

      for (const file of [...files.photos, ...files.videos]) {
        const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
        let dbFile = await fileRepo.findOneBy({
          contentHash: fileHash,
        });

        if (dbFile) throw new BadRequestException('This file was already upload');

        dbFile = await fileRepo.save(
          fileRepo.create({
            contentHash: fileHash,
            garbageCollect,
            fileExtension: getFileExtensionFromFile(file.originalname),
          })
        );

        // TODO: not a good idea to have it inside of a db transaction
        dbFile = {
          ...dbFile,
          ...(await this.storageService.writeFile({
            content: file.buffer,
            extension: dbFile.fileExtension,
            id: dbFile.id,
          })),
        };

        await fileRepo.save(dbFile);
      }

      return garbageCollect;
    });
  }
}
