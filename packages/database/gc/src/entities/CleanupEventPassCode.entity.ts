import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { CleanupEvent } from './CleanupEvent.entity';

@Entity({ name: 'cleanup_event_pass_code' })
export class CleanupEventPassCode extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'bool', default: false })
  isUsed: boolean;

  @ManyToOne(() => CleanupEvent, (v) => v.passCodes, { eager: true, onDelete: 'CASCADE' })
  cleanupEvent: CleanupEvent;
}
