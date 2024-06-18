import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { User } from './User.entity';

@Entity({ name: 'merkle_proof' })
@Index(['user', 'submission'], { unique: true })
export class MerkleProof extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MerkleSubmission)
  submission: MerkleSubmission;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'bytea', array: true })
  proof: Buffer[];

  @Column({ type: 'jsonb' })
  leaf: Object;
}
