import { Activity } from '../domain/entity/activity.entity';
import { ActivityRepository } from '../domain/repository/activity.repository';

export type PatchActivityRequest = Partial<Activity>;

export class PatchActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(request: PatchActivityRequest) {
    const id = request.id;
    if (id === undefined) {
      throw Error('Missing required id');
    }
    const activity = this.activityRepository.getActivity(id);
    if (activity === undefined) {
      throw Error('Activity not found');
    }
    if (request.name !== undefined) {
      activity.name = request.name;
    }
    if (request.duration !== undefined) {
      activity.duration = request.duration;
    }
    if (request.doesNeedRestAfter !== undefined) {
      activity.doesNeedRestAfter = request.doesNeedRestAfter;
    }
    if (request.timeAlreadySpent !== undefined) {
      activity.timeAlreadySpent = request.timeAlreadySpent;
    }
    if (request.finished !== undefined) {
      activity.finished = request.finished;
    }
  }
}
