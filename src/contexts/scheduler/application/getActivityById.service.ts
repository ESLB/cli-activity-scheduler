import { ActivityRepository } from '../domain/repository/activity.repository';
import { IdValueObject } from '../domain/valueObject/id.valueObject';

export class GetActivityById {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(id: string) {
    const activities = this.activityRepository.getActivities({
      id: new IdValueObject(id),
    });
    if (activities.length === 0) {
      throw Error('Activity not found');
    }
    if (activities.length > 1) {
      throw Error('More than one activity found');
    }
    return activities[0];
  }
}
