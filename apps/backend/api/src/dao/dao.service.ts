import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource, EntityManager } from 'typeorm';
import { AuthNonce, CastVoteDirection, DaoVote, GarbageCollect, User } from '@gc/database-gc';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';

@Injectable()
export class DaoService {
  constructor(
    @Inject('POINTS_PER_SUCCESS_FULL_GC')
    private readonly pointsPerSuccessFullGc: number,
    private readonly dataSource: DataSource
  ) {}

  async castVote({
    signature,
    voterPubKey,
    garbageCollectId,
    voteDirection,
  }: {
    signature: string;
    voterPubKey: PublicKey;
    garbageCollectId: string;
    voteDirection: CastVoteDirection;
  }) {
    const expectedSignedMessage = this.getSignMessage(garbageCollectId, voteDirection);

    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(expectedSignedMessage),
      bs58.decode(signature),
      voterPubKey.toBuffer()
    );

    if (!verified) throw new BadRequestException('Invalid signature');

    await this.dataSource.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const voteRepo = manager.getRepository(DaoVote);
      const gcRepo = manager.getRepository(GarbageCollect);

      const voter = await userRepo.findOne({
        where: {
          pubKey: voterPubKey,
        },
      });

      if (!voter) throw new BadRequestException('Voter is not found');

      const gc = await gcRepo.findOne({
        where: {
          id: garbageCollectId,
        },
        relations: {
          daoVotes: true,
        },
      });

      if (!gc) throw new BadRequestException('Garbage collect is not found');
      if (gc.pointsGiven !== null) throw new BadRequestException('Voting is already finished');

      const votesThreshold = this.votesThreshold();

      // TODO: move to config
      if (gc.daoVotes.length >= votesThreshold) throw new BadRequestException('Voting threshold is reached');

      const voteCasted = await voteRepo.findOneBy({
        garbageCollect: { id: gc.id },
        voter: { id: voter.id },
      });

      if (voteCasted) throw new BadRequestException('Already casted vote');

      const newVote = await voteRepo.save(
        voteRepo.create({
          voter,
          voteDirection: voteDirection,
          voteSignature: signature,
          garbageCollect: gc,
        })
      );

      let votes = [...gc.daoVotes, newVote];

      const votesFor = votes.filter((v) => v.voteDirection === CastVoteDirection.FOR).length;

      // TODO: update achievements statuses
      if (votesFor >= Math.floor(votesThreshold / 2) + 1) {
        gc.pointsGiven = this.pointsPerSuccessFullGc;
        await manager.save(gc);

        await this.updateCanVote(voter, manager);
      }

      return {
        newVoteId: newVote,
      };
    });
  }

  public async updateCanVote(user: User, manager: EntityManager) {
    if (user.canVote) return;

    if (user.points >= this.canVotePointsThreshold()) {
      user.canVote = true;
      await manager.save(user);
    }
  }

  canVotePointsThreshold() {
    return 1000;
  }

  votesThreshold() {
    return 101;
  }

  getSignMessage(gcId: string, castDirection: CastVoteDirection) {
    return `Confirming vote cast for: ${gcId}, cast direction: ${castDirection}`;
  }
}
