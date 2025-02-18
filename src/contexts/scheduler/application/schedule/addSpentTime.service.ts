import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { BooleanValueObject } from '../../domain/valueObject/boolean.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';

export class AddSpentTimeService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  execute(time: IntegerValueObject): void {
    const schedule = this.scheduleRepository.get();

    if (schedule.activities.length === 0) {
      throw Error('No hay actividad a qué añadirle tiempo utilizado');
    }

    const activity = this.activityRepository.getActivity(
      schedule.activities[0],
    );

    if (activity === undefined) {
      throw Error('Actividad no encontrada');
    }

    activity.timeAlreadySpent = activity.timeAlreadySpent.add(time);

    if (activity.hasNoRemainingTime) {
      activity.finished = new BooleanValueObject(true);
      schedule.activities.shift();
    }

    this.activityRepository.saveActivities([activity]);
    this.scheduleRepository.save(schedule);
  }
}
