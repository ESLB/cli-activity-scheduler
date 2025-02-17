import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { BooleanValueObject } from '../../domain/valueObject/boolean.valueObject';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';

export class FinishActivityService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  execute(activityId: IdValueObject): void {
    const schedule = this.scheduleRepository.get();
    const activity = this.activityRepository.getActivity(activityId);
    if (activity === undefined) {
      throw Error('No existe la actividad');
    }
    activity.finished = new BooleanValueObject(true);
    this.activityRepository.saveActivities([activity]);
    schedule.activities = schedule.activities.filter(
      (i) => !i.isEqual(activityId),
    );
    this.scheduleRepository.save(schedule);
  }
}
