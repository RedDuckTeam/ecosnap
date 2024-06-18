import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';

@Entity({ name: 'coupon' })
export class Coupon extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  pointsPrice: number;

  @Column({ type: 'timestamptz' })
  validUntil: Date;

  @Column({ type: 'timestamptz' })
  buysClosesAt: Date;

  @Column({ type: 'varchar' })
  description: string;
}
