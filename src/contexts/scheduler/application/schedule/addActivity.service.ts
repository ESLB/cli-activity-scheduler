import { Activity } from '../../domain/entity/activity.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';

export class AddActivityService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
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

    const activityIdsInSchedule: IdValueObject[] = [];
    for (const actId of schedule.activities) {
      const predecessors =
        this.activityRepository.getUnfinishedPredecessors(actId);
      if (
        predecessors.length > 0 &&
        !this.areIdsAlreadyIncluded(activityIdsInSchedule, predecessors)
      ) {
        throw new Error(
          'No se puede realizar la operación porque ocasionaría una inconsistencia',
        );
      }
      activityIdsInSchedule.push(actId);
    }

    this.scheduleRepository.save(schedule);
  }

  private areIdsAlreadyIncluded(
    previousActivityIds: IdValueObject[],
    activities: Activity[],
  ): boolean {
    for (const activity of activities) {
      if (
        !previousActivityIds.map((i) => i.value).includes(activity.id.value)
      ) {
        return false;
      }
    }
    return true;
  }
}
