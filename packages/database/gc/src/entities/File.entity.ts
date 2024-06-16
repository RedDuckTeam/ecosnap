import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SolanaPubKeyColumn, TimeKnownEntity } from '@gc/database-common';
import { DaoVote } from './DaoVote.entity';
import { GarbageCollect } from './GarbageCollect.entity';
import { AuthNonce } from './AuthNonce.entity';
import { PublicKey } from '@solana/web3.js';

@Entity({ name: 'file' })
export class File extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  remoteStorageId: string;

  @Column({ type: 'varchar', length: 64 })
  contentHash: string;

  @Column({ type: 'char', length: 5 })
  fileExtension: string;

  @ManyToOne(() => GarbageCollect, (v) => v.files, { nullable: true, onDelete: 'SET NULL' })
  garbageCollect?: GarbageCollect;
}
