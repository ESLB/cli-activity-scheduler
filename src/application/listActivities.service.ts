import { ActivityRepository } from '../domain/repository/activity.repository';

export class ListActivitiesService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute() {
    console.log(this.activityRepository.getActivities({ current: false }));
  }
}
