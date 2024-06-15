import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { GarbageCollect } from './GarbageCollect.entity';

export enum CastVoteDirection {
  FOR,
  AGAINST,
}

@Entity({ name: 'dao_vote' })
export class DaoVote extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  voteSignature: string;

  @Column({ type: 'enum', enum: CastVoteDirection })
  voteDirection: CastVoteDirection;

  @ManyToOne(() => User, (v) => v.daoVotes, { eager: true, onDelete: 'CASCADE' })
  voter: User;

  @ManyToOne(() => GarbageCollect, (v) => v.daoVotes, { eager: true, onDelete: 'CASCADE' })
  garbageCollect: GarbageCollect;
}
