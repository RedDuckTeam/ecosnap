import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { File } from './File.entity';

export enum MerkleTreeType {
  FULL,
  ONLY_PROOFS,
}

export enum SubmissionType {
  GC,
  ACHIEVEMENTS,
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

  @Column({ type: 'enum', enum: SubmissionType, default: SubmissionType.GC })
  submissionType: SubmissionType;

  @OneToOne(() => File, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  treeFile: File;
}
