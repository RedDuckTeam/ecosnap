import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
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
