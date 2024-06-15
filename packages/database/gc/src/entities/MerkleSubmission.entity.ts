import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SolanaPubKeyColumn, TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';
import { PublicKey } from '@solana/web3.js';
import { File } from './File.entity';
import { CleanupEvent } from './CleanupEvent.entity';
import { Achievement } from './Achievement.entity';

@Entity({ name: 'merkle_submission' })
export class MerkleSubmission extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  merkleRootHash?: string;

  @Column({ type: 'varchar' })
  submissionTxHash?: string;

  @SolanaPubKeyColumn(undefined, { nullable: true })
  statePubKey?: PublicKey;

  @OneToOne(() => File, undefined, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  treeFile?: File;

  @OneToMany(() => GarbageCollect, (v) => v.merkleSubmission, { cascade: true })
  garbageCollects: GarbageCollect[];

  @OneToMany(() => Achievement, (v) => v.merkleSubmission, { cascade: true })
  achievements: Achievement[];

  @OneToMany(() => CleanupEvent, (v) => v.merkleSubmission, { cascade: true })
  cleanupEvents: CleanupEvent[];
}
