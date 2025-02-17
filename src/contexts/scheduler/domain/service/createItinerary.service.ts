import { Activity } from '../entity/activity.entity';
import { IntegerValueObject } from '../valueObject/integer.valueObject';
import { ItineraryActivityPrimitive } from '../entity/itinerary.entity';
import { Time } from '../valueObject/time.valueObject';

export class CreateItinerary {
  execute(activities: Activity[]) {
    const itineraryActivities: ItineraryActivityPrimitive[] = [];
    const startItinerary = this.getCurrentTime();
    let lastTime = startItinerary;
    for (const activity of activities) {
      const startActivityTime = lastTime;
      const endActivityTime = lastTime.add(activity.remainingTime);
      itineraryActivities.push({
        startTime: startActivityTime.textual,
        endtime: endActivityTime.textual,
        activityName: activity.name.value,
        activityId: activity.id.value,
      });
      lastTime = endActivityTime;
    }
    return itineraryActivities;
  }

  private getCurrentTime(): Time {
    const minutesTillNow = new Date().getHours() * 60 + new Date().getMinutes();
    return new Time(new IntegerValueObject(minutesTillNow));
  }
}
