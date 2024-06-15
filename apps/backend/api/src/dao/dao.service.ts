import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { DataSource } from 'typeorm';
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

      if (votes.length === votesThreshold) {
        const votesFor = votes.filter((v) => v.voteDirection === CastVoteDirection.FOR).length;

        if (votesFor >= Math.floor(votesThreshold / 2) + 1) {
          gc.pointsGiven = this.pointsPerSuccessFullGc;
          await manager.save(gc);
        }
      }

      return {
        newVoteId: newVote,
      };
    });
  }

  votesThreshold() {
    return 101;
  }

  getSignMessage(gcId: string, castDirection: CastVoteDirection) {
    return `Confirming vote cast for: ${gcId}, cast direction: ${castDirection}`;
  }
}
