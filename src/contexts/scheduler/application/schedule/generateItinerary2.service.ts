import { ItineraryActivityPrimitive2 } from '../../domain/entity/itinerary.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { CreateItinerary2 } from '../../domain/service/createItinerary2.service';

export class GenerateItinerary2 {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly createItinerary: CreateItinerary2,
  ) {}

  execute(startTimeHour?: number): ItineraryActivityPrimitive2[] {
    const schedule = this.scheduleRepository.get();
    const activities = this.activityRepository.getActivities({
      ids: schedule.activities,
    });

    return this.createItinerary.execute(
      schedule.activities.map(
        (i) => activities.find((act) => act.id.isEqual(i))!,
      ),
      startTimeHour,
    );
  }
}
