import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { ValidateScheduleIntegrity } from '../../domain/service/validateScheduleIntegrity.service';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';

export class AddActivityService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly validateScheduleIntegrity: ValidateScheduleIntegrity,
  ) {}

  execute(activityId: IdValueObject, position?: IntegerValueObject): void {
    if (position && position.value < 1) {
      throw new Error('La posición debe ser mayor igual a 1');
    }
    const activity = this.activityRepository.getActivity(activityId);
    const schedule = this.scheduleRepository.get();
    if (activity === undefined) {
      throw new Error('Actividad no encontrada');
    }

    schedule.activities = schedule.activities.filter(
      (i) => !i.isEqual(activityId),
    );
    const arrayIndex = position
      ? position.value - 1
      : schedule.activities.length > 0
        ? schedule.activities.length
        : 0;
    schedule.activities.splice(arrayIndex, 0, activityId);

    this.validateScheduleIntegrity.execute(schedule);

    this.scheduleRepository.save(schedule);
  }
}
