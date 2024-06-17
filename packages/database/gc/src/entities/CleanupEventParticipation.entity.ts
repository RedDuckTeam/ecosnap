import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEvent } from './CleanupEvent.entity';
import { CleanupEventPassCode } from './CleanupEventPassCode.entity';

export enum ParticipationResultsStatus {
  ACCEPTED,
  REJECTED,
}

export enum ParticipationStatus {
  ACCEPTED,
  REJECTED,
}

@Entity({ name: 'cleanup_event_participation' })
export class CleanupEventParticipation extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, undefined, { onDelete: 'CASCADE' })
  participant: User;

  @Column({ type: 'varchar' })
  participationSignature: string;

  @Column({ type: 'enum', nullable: true, enum: ParticipationStatus })
  participationStatus?: ParticipationStatus;

  @Column({ type: 'varchar', nullable: true })
  participationStatusSignature?: string;

  @Column({ type: 'enum', nullable: true, enum: ParticipationResultsStatus })
  resultsStatus?: ParticipationResultsStatus;

  @Column({ type: 'varchar', nullable: true })
  resultStatusSignature?: string;

  @ManyToOne(() => CleanupEvent, (v) => v.participants, { onDelete: 'CASCADE' })
  cleanupEvent: CleanupEvent;

  @ManyToOne(() => CleanupEventPassCode)
  @JoinColumn()
  passCode: CleanupEventPassCode;
}
