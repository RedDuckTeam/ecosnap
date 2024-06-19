import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';

@Entity({ name: 'coupon' })
export class Coupon extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ type: 'int', default: 0 })
  pointsPrice: number;
}
