import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { UserAchievement } from './UserAchievement.entity';

@Entity({ name: 'achievement' })
export class Achievement extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int', default: 0 })
  pointsRequired: number;

  @Column({ type: 'boolean', default: true })
  canHaveMany: boolean;

  @OneToMany(() => UserAchievement, (a) => a.achievement, { cascade: true })
  userAchievements: UserAchievement[];

  @ManyToMany(() => MerkleSubmission)
  @JoinTable()
  merkleSubmissions?: MerkleSubmission[];
}
