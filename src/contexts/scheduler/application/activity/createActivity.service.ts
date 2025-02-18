import { Activity } from '../../domain/entity/activity.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { BooleanValueObject } from '../../domain/valueObject/boolean.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';
import { StringValueObject } from '../../domain/valueObject/string.valueObject';

export type CreateActivityRequest = {
  name: string;
  duration: number;
  doesNeedRestAfter: boolean;
  description?: string;
  restTime?: number;
  preparationTime?: number;
};

export class CreateActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(request: CreateActivityRequest) {
    const activity = Activity.create({
      name: new StringValueObject(request.name),
      duration: new IntegerValueObject(request.duration),
      doesNeedRestAfter: new BooleanValueObject(request.doesNeedRestAfter),
      description: request.description
        ? new StringValueObject(request.description)
        : undefined,
      restTime: request.restTime
        ? new IntegerValueObject(request.restTime)
        : undefined,
      preparationTime: request.preparationTime
        ? new IntegerValueObject(request.preparationTime)
        : undefined,
    });
    this.activityRepository.saveActivities([activity]);
  }
}
