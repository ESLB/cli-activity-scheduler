import { ActivityPrimitivies } from '../../domain/entity/activity.entity';
import { Schedule } from '../../domain/entity/schedule.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';

type OrderedActivityPrimity = ActivityPrimitivies & { order: number };

export interface ScheduleDetail {
  activities: OrderedActivityPrimity[];
}

export class GetScheduleDetailService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  execute(): ScheduleDetail {
    const schedule = this.scheduleRepository.get();
    const activities = this.activityRepository.getActivities({
      ids: schedule.activities,
    });

    return {
      activities: schedule.activities.map((id, index) => {
        const activity = activities.find((activity) =>
          activity.id.isEqual(id),
        )!;
        return {
          order: index + 1,
          ...activity.values,
        };
      }),
    };
  }
}
