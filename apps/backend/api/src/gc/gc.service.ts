import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import { StorageService } from '@gc/storage';
import 'multer';
import { File, GarbageCollect, User } from '@gc/database-gc';

import crypto from 'crypto';
@Injectable()
export class GcService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService
  ) {}

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
        const fileHash = crypto.createHash('sha3').update(file.buffer).digest('hex');
        let dbFile = await fileRepo.findOneBy({
          contentHash: fileHash,
        });

        if (dbFile) throw new BadRequestException('This file was already upload');

        dbFile = await fileRepo.save(
          fileRepo.create({
            contentHash: fileHash,
            garbageCollect,
            fileExtension: this._getFileExtensionFromFile(file.originalname),
          })
        );

        // TODO: not a good idea to have it inside of a db transaction
        await this.storageService.writeFile(file.buffer);
      }

      return garbageCollect;
    });
  }

  _getFileExtensionFromFile(fileName: string) {
    const fileNameSplitted = fileName.split('.');
    fileNameSplitted.shift();

    return fileNameSplitted.length ? fileNameSplitted[fileNameSplitted.length - 1] : '';
  }
}
