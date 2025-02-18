import { Activity } from '../entity/activity.entity';
import { Schedule } from '../entity/schedule.entity';
import { ActivityRepository } from '../repository/activity.repository';
import { IdValueObject } from '../valueObject/id.valueObject';

export class ValidateScheduleIntegrity {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(schedule: Schedule) {
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
