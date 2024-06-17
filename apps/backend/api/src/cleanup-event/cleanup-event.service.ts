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
} from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { AchievementsService } from '../achievements/achievements.service';
import { DaoService } from '../dao/dao.service';

@Injectable()
export class CleanupEventService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly achievementsService: AchievementsService,
    private readonly daoService: DaoService
  ) {}

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

      const participation = await eventParticipationRepo.save(
        eventParticipationRepo.create({
          participant: user,
          cleanupEvent: event,
          participationSignature: signature,
          passCode: entryCode,
        })
      );

      return participation;
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
