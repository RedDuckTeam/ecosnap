import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeKnownEntity } from '@gc/database-common';
import { Achievement } from './Achievement.entity';
import { CleanupEvent } from './CleanupEvent.entity';

@Entity({ name: 'achievement_boost_reward' })
export class AchievementBoostReward extends TimeKnownEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Achievement)
  achievement: Achievement;

  @Column({ type: 'int' })
  boostPoints: number;

  @ManyToMany(() => CleanupEvent, (v) => v.achievementBoosts)
  cleanupEvent: CleanupEvent[];
}
