import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { MerkleSubmission } from './MerkleSubmission.entity';
import { Achievement } from './Achievement.entity';
import { AchievementBoostReward } from './AchievementBoostReward.entity';
import { UserAchievement } from './UserAchievement.entity';

@Entity({ name: 'user_achievement_boost_reward' })
export class UserAchievementBoostReward extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AchievementBoostReward)
  achievementBoost: AchievementBoostReward;

  @ManyToOne(() => UserAchievement)
  userAchievement: UserAchievement;
}
