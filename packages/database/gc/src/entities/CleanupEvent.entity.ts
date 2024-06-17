import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { CleanupEventPassCode } from './CleanupEventPassCode.entity';
import { File } from './File.entity';
import { AchievementBoostReward } from './AchievementBoostReward.entity';

@Entity({ name: 'cleanup_event' })
export class CleanupEvent extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rewards: number;

  @Column({ type: 'varchar' })
  city: string;

  // TODO: check those dates in cleanup service
  @Column({ type: 'timestamptz' })
  eventStartsAt: Date;

  @Column({ type: 'timestamptz' })
  eventEndsAt: Date;

  @OneToMany(() => CleanupEventPassCode, (v) => v.cleanupEvent, { cascade: true })
  passCodes: CleanupEventPassCode[];

  @OneToMany(() => CleanupEventParticipation, (v) => v.cleanupEvent, { cascade: true })
  participants: CleanupEventParticipation[];

  @ManyToMany(() => User, (v) => v.cleanUpEventsAdmin, { cascade: true })
  @JoinTable()
  admins: User[];

  @ManyToMany(() => AchievementBoostReward, (v) => v.cleanupEvent)
  @JoinTable()
  achievementBoosts: AchievementBoostReward[];

  @ManyToMany(() => MerkleSubmission)
  @JoinTable()
  merkleSubmissions?: MerkleSubmission[];

  @OneToMany(() => File, (v) => v.cleanupEvent, { cascade: true })
  files: File[];
}
