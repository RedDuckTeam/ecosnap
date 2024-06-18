import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { User } from './User.entity';
import { CleanupEventParticipation } from './CleanupEventParticipation.entity';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { Achievement } from './Achievement.entity';
import { UserAchievementBoostReward } from './UserAchievementBoostReward.entity';

@Entity({ name: 'user_achievement' })
export class UserAchievement extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bool', default: false })
  received: boolean;

  @Column({ type: 'int', default: 0 })
  currentPoints: number;

  @ManyToOne(() => User, (a) => a.achievements)
  user: User;

  @ManyToOne(() => Achievement, (a) => a.userAchievements)
  achievement: Achievement;

  @Column({ type: 'boolean', default: false })
  merkleSubmitted: boolean;

  @OneToMany(() => UserAchievementBoostReward, (a) => a.userAchievement)
  boostRewards: UserAchievementBoostReward[];

  @ManyToMany(() => MerkleSubmission)
  @JoinTable()
  merkleSubmissions?: MerkleSubmission[];
}
