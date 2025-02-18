import { ActivityPrimitivies } from '../../domain/entity/activity.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { BooleanValueObject } from '../../domain/valueObject/boolean.valueObject';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';
import { StringValueObject } from '../../domain/valueObject/string.valueObject';

export type PatchActivityRequest = Partial<ActivityPrimitivies>;

export class PatchActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(request: PatchActivityRequest) {
    const id = request.id;
    if (id === undefined) {
      throw Error('Missing required id');
    }
    const activity = this.activityRepository.getActivity(new IdValueObject(id));
    if (activity === undefined) {
      throw Error('Activity not found');
    }
    if (request.name !== undefined) {
      activity.name = new StringValueObject(request.name);
    }
    if (request.duration !== undefined) {
      activity.duration = new IntegerValueObject(request.duration);
    }
    if (request.doesNeedRestAfter !== undefined) {
      activity.doesNeedRestAfter = new BooleanValueObject(
        request.doesNeedRestAfter,
      );
    }
    if (request.timeAlreadySpent !== undefined) {
      activity.timeAlreadySpent = new IntegerValueObject(
        request.timeAlreadySpent,
      );
    }
    if (request.description !== undefined) {
      activity.description = new StringValueObject(request.description);
    }
    if (request.restTime !== undefined) {
      activity.restTime = new IntegerValueObject(request.restTime);
    }
    if (request.preparationTime !== undefined) {
      activity.preparationTime = new IntegerValueObject(
        request.preparationTime,
      );
    }
    if (request.finished !== undefined) {
      activity.finished = new BooleanValueObject(request.finished);
    }

    this.activityRepository.saveActivities([activity]);
  }
}
