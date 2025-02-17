import { ItineraryActivityPrimitive } from '../../domain/entity/itinerary.entity';
import { ActivityRepository } from '../../domain/repository/activity.repository';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { CreateItinerary } from '../../domain/service/createItinerary.service';

export class GenerateItinerary {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly activityRepository: ActivityRepository,
    private readonly createItinerary: CreateItinerary,
  ) {}

  execute(): ItineraryActivityPrimitive[] {
    const schedule = this.scheduleRepository.get();
    const activities = this.activityRepository.getActivities({
      ids: schedule.activities,
    });

    return this.createItinerary.execute(
      schedule.activities.map(
        (i) => activities.find((act) => act.id.isEqual(i))!,
      ),
    );
  }
}
