import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';

@Entity({ name: 'achievement' })
export class Achievement extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => MerkleSubmission, (v) => v.garbageCollects, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  merkleSubmission?: MerkleSubmission;
}
