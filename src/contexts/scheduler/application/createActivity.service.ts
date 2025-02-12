import { Writable } from 'type-fest';
import { Activity } from '../domain/entity/activity.entity';
import { ActivityRepository } from '../domain/repository/activity.repository';

export type CreateActivityRequest = Omit<Writable<Activity>, 'id' | '_v'>;

export class CreateActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(request: CreateActivityRequest) {
    this.activityRepository.saveActivities([new Activity(request)]);
  }
}
