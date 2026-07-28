import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { GarbageCollect } from './GarbageCollect.entity';
import { CleanupEvent } from './CleanupEvent.entity';

@Entity({ name: 'file' })
export class File extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  remoteStorageId?: string;

  @Column({ type: 'varchar', nullable: true })
  uri?: string;

  @Column({ type: 'varchar', length: 64 })
  contentHash: string;

  @Column({ type: 'char', length: 5 })
  fileExtension: string;

  @ManyToOne(() => GarbageCollect, (v) => v.files, { nullable: true, onDelete: 'SET NULL' })
  garbageCollect?: GarbageCollect;

  @ManyToOne(() => CleanupEvent, (v) => v.files, { nullable: true, onDelete: 'SET NULL' })
  cleanupEvent?: CleanupEvent;
}
