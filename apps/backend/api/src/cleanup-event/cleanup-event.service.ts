import { BadRequestException, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
import {
  CleanupEvent,
  CleanupEventParticipation,
  CleanupEventPassCode,
  ParticipationResultsStatus,
  ParticipationStatus,
  User,
  File,
} from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import crypto from 'crypto';
import { getFileExtensionFromFile } from '../lib/utils/utils';
import { StorageService } from '@gc/storage';
import { AchievementsService } from '../achievements/achievements.service';
import { DaoService } from '../dao/dao.service';

@Injectable()
export class CleanupEventService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly achievementsService: AchievementsService,
    private readonly storageService: StorageService,
    private readonly daoService: DaoService
  ) {}

  async getAllEvents() {
    return await this.dataSource.manager.transaction(async (manager) => {
      const eventRepo = manager.getRepository(CleanupEvent);
      const events = await eventRepo.find({
        relations: {
          participants: true,
          admins: true,
          files: true,
        },
      });
      return events.map((v) => ({
        id: v.id,
        city: v.city,
        name: v.name,
        pictureUrl: v.pictureUrl,
        rewards: v.rewards,
        eventStartsAt: v.eventStartsAt,
        eventEndsAt: v.eventEndsAt,
        participants: v.participants.length,
        maximumParticipants: v.maximumParticipants,
        description: v.description,
        admins: v.admins.map((a) => a.pubKey.toBase58()),
        files: v.files,
      }));
    });
  }

  async generatePassCode({ eventId, adminPubKey }: { eventId: string; adminPubKey: PublicKey }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const eventRepo = manager.getRepository(CleanupEvent);
      const userRepo = manager.getRepository(User);
      const passCodeRepo = manager.getRepository(CleanupEventPassCode);

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      const event = await eventRepo.findOneBy({
        id: eventId,
      });

      if (!event) throw new BadRequestException('Event is not found');

      const newPassCode = await passCodeRepo.save(
        passCodeRepo.create({
          cleanupEvent: event,
          code: this._generateRandomPassKey(),
        })
      );

      return newPassCode.code;
    });
  }

  async participate({
    signature,
    eventEntryCode,
    userPubKey,
  }: {
    signature: string;
    eventEntryCode: string;
    userPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const eventRepo = manager.getRepository(CleanupEvent);
      const userRepo = manager.getRepository(User);
      const passCodeRepo = manager.getRepository(CleanupEventPassCode);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const entryCode = await passCodeRepo.findOne({
        where: {
          code: eventEntryCode,
        },
        relations: {
          cleanupEvent: true,
        },
      });

      if (!entryCode) throw new BadRequestException('Entry code is not found');
      if (entryCode.isUsed) throw new BadRequestException('Entry code was already used');

      const event = await eventRepo.findOneBy({
        id: entryCode.cleanupEvent.id,
      });

      if (!event) throw new BadRequestException('Event is not found');

      const user = await userRepo.findOneBy({
        pubKey: userPubKey,
      });

      if (!user) throw new BadRequestException('User is not found');

      const signedMessage = this.getParticipateMessage(event.id);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        userPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      const existingParticipation = await eventParticipationRepo.findOneBy({
        participant: {
          id: user.id,
        },
      });

      if (existingParticipation) throw new BadRequestException('Already participated to this event');

      entryCode.isUsed = true;

      await manager.save(entryCode);

      return await eventParticipationRepo.save(
        eventParticipationRepo.create({
          participant: user,
          cleanupEvent: event,
          participationSignature: signature,
          passCode: entryCode,
        })
      );
    });
  }

  async acceptParticipation({
    signature,
    participationId,
    eventId,
    adminPubKey,
  }: {
    signature: string;
    participationId: string;
    eventId: string;
    adminPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const participation = await eventParticipationRepo.findOneBy({
        id: participationId,
        cleanupEvent: { id: eventId },
      });

      if (!participation) throw new BadRequestException('Participation is not found by id');

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      // TODO: move to separate package
      const signedMessage = this.getAcceptParticipationMessage(participationId);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        adminPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      participation.participationSignature = signature;
      participation.participationStatus = ParticipationStatus.ACCEPTED;

      await manager.save(participation);
    });
  }

  async acceptEventResult({
    signature,
    participationId,
    eventId,
    adminPubKey,
  }: {
    signature: string;
    participationId: string;
    eventId: string;
    adminPubKey: PublicKey;
  }) {
    return await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const eventParticipationRepo = manager.getRepository(CleanupEventParticipation);

      const participation = await eventParticipationRepo.findOne({
        where: {
          id: participationId,
          cleanupEvent: { id: eventId },
        },
        relations: {
          cleanupEvent: {
            achievementBoosts: true,
          },
          participant: true,
        },
      });

      if (!participation) throw new BadRequestException('Participation is not found by id');

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      // TODO: move to separate package
      const signedMessage = this.getAcceptResultMessage(participationId);

      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(signedMessage),
        bs58.decode(signature),
        adminPubKey.toBuffer()
      );

      if (!verified) throw new BadRequestException('Invalid signature');

      participation.resultStatusSignature = signature;
      participation.resultsStatus = ParticipationResultsStatus.ACCEPTED;
      participation.participant.points += participation.cleanupEvent.rewards;

      await this.achievementsService.updateUserFinishedCleanupEventAchievement(
        {
          event: participation.cleanupEvent,
          user: participation.participant,
        },
        manager
      );

      await this.daoService.updateCanVote(participation.participant, manager);
      await manager.save(participation);
    });
  }

  async publishEvent({
    eventId,
    adminPubKey,
    files,
  }: {
    eventId: string;
    adminPubKey: PublicKey;
    files: { photos: Express.Multer.File[]; videos: Express.Multer.File[] };
  }) {
    files.photos.forEach((v) => {
      if (v.size > 5_000_000) throw new BadRequestException('Photo file size should be <=5mb');
    });

    files.videos.forEach((v) => {
      if (v.size > 100_000_000) throw new BadRequestException('Video file size should be <=100mb');
    });

    return await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const eventRepo = manager.getRepository(CleanupEvent);
      const fileRepo = manager.getRepository(File);

      const admin = await userRepo.findOneBy({
        pubKey: adminPubKey,
        cleanUpEventsAdmin: {
          id: eventId,
        },
      });

      if (!admin) throw new BadRequestException('Admin User for provided event is not found');

      const event = await eventRepo.findOneBy({
        id: eventId,
      });

      if (!event) throw new BadRequestException('Event is not found');

      for (const file of [...files.photos, ...files.videos]) {
        const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
        let dbFile = await fileRepo.findOneBy({
          contentHash: fileHash,
        });

        if (dbFile) throw new BadRequestException('This file was already uploaded');
        dbFile = await fileRepo.save(
          fileRepo.create({
            contentHash: fileHash,
            cleanupEvent: event,
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
      return event;
    });
  }

  private _generateRandomPassKey() {
    return '';
  }

  getParticipateMessage(id: string) {
    return `Confirming participation for: ${id}`;
  }

  getAcceptParticipationMessage(id: string) {
    return `Accepting participation for: ${id}`;
  }

  getAcceptResultMessage(id: string) {
    return `Accepting cleanup result for: ${id}`;
  }
}
