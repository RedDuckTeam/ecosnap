import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { GarbageCollect } from './GarbageCollect.entity';

@Entity({ name: 'auth_nonce' })
export class AuthNonce extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  used: boolean;

  @ManyToOne(() => User, (v) => v.authNonces, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
