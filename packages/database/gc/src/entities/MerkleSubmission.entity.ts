import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SolanaPubKeyColumn, TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';
import { PublicKey } from '@solana/web3.js';
import { File } from './File.entity';
import { CleanupEvent } from './CleanupEvent.entity';
import { Achievement } from './Achievement.entity';

export enum MerkleTreeType {
  FULL,
  ONLY_PROOFS,
}

@Entity({ name: 'merkle_submission' })
export class MerkleSubmission extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  merkleRootHash: string;

  @Column({ type: 'varchar' })
  submissionTxHash: string;

  @Column({ type: 'enum', enum: MerkleTreeType })
  treeType: MerkleTreeType;

  @OneToOne(() => File, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  treeFile: File;
}
