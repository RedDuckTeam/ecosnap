import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';

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
