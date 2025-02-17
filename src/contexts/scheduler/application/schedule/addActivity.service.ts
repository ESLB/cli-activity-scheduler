import { Activity } from '../../domain/entity/activity.entity';
import { Schedule } from '../../domain/entity/schedule.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';

export class AddActivityService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  execute(activityId: IdValueObject): void {
    const activity = this.activityRepository.getActivity(activityId);
    const schedule = this.scheduleRepository.get();

    if (activity === undefined) {
      throw new Error('Actividad no encontrada');
    }
    const predecessors = this.activityRepository.getPredecessors(activityId);
    if (
      predecessors.length > 0 &&
      !this.areActivitiesInSchedule(schedule, predecessors)
    ) {
      throw new Error(
        'No se puede añadir una actividad que tiene predecesores si no están incluídos en el horario primero',
      );
    }
    if (schedule.activities.map((i) => i.value).includes(activityId.value)) {
      throw new Error(
        'No se puede añadir dos veces la misma actividad al horario',
      );
    }

    schedule.activities.push(activityId);
    this.scheduleRepository.save(schedule);
  }

  private areActivitiesInSchedule(
    schedule: Schedule,
    activities: Activity[],
  ): boolean {
    for (const activity of activities) {
      if (
        !schedule.activities.map((i) => i.value).includes(activity.id.value)
      ) {
        return false;
      }
    }
    return true;
  }
}
