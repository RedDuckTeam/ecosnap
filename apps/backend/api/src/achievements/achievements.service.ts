import { CleanupEvent, User, UserAchievement, UserAchievementBoostReward } from '@gc/database-gc';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DaoService } from '../dao/dao.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly dataSource: DataSource) {}

  async updateUserFinishedCleanupEventAchievement(
    { user, event }: { user: User; event: CleanupEvent },
    manager: EntityManager
  ) {
    const boost = event.achievementBoosts;

    const userAchievementRepo = manager.getRepository(UserAchievement);
    const userAchievementBoostRepo = manager.getRepository(UserAchievementBoostReward);

    for (let eventBoost of boost) {
      const events = eventBoost.cleanupEvent;
      const achievement = eventBoost.achievement;

      let userAchievements = await userAchievementRepo.findBy({
        achievement: { id: achievement.id },
        received: false,
      });

      if (!userAchievements.length && !achievement.canHaveMany) {
        continue;
      }

      userAchievements ??= [
        await userAchievementRepo.save(
          userAchievementRepo.create({
            achievement: achievement,
            user,
          })
        ),
      ];

      for (let userAchievement of userAchievements) {
        await userAchievementBoostRepo.save(
          userAchievementBoostRepo.create({
            achievementBoost: eventBoost,
            userAchievement: achievement,
          })
        );
        userAchievement.currentPoints += eventBoost.boostPoints;

        // TODO: distribute extra points to new achievement
        if (userAchievement.currentPoints >= achievement.pointsRequired) {
          userAchievement.received = true;
        }
      }
    }
  }
}
