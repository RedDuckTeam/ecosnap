import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { Coupon } from './Coupon.entity';

@Entity({ name: 'user_coupon' })
export class UserCoupon extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (a) => a.coupons)
  user: User;

  @ManyToOne(() => Coupon)
  coupon: Coupon;

  @Column({ type: 'boolean', default: false })
  merkleSubmitted: boolean;

  @Column({ type: 'boolean', default: false })
  isRedeemed: boolean;

  @Column({ type: String })
  buySignature: string;

  @ManyToMany(() => MerkleSubmission)
  @JoinTable()
  merkleSubmissions?: MerkleSubmission[];
}
