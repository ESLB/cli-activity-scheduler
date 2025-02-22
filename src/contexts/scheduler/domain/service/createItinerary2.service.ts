import { Activity } from '../entity/activity.entity';
import { IntegerValueObject } from '../valueObject/integer.valueObject';
import {
  ActivityPartPrimitive,
  ItineraryActivityPrimitive2,
} from '../entity/itinerary.entity';
import { Time } from '../valueObject/time.valueObject';

export class CreateItinerary2 {
  execute(
    activities: Activity[],
    startTimeHour?: number,
  ): ItineraryActivityPrimitive2[] {
    const itineraryActivities: ItineraryActivityPrimitive2[] = [];
    const startItinerary = startTimeHour
      ? this.getStartTime(startTimeHour)
      : this.getCurrentTime();
    let lastTime = startItinerary;
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const [preparationPart, endPreparation] = this.getPreparationItinerary(
        activity,
        lastTime,
      );
      lastTime = endPreparation;
      const [activityPart, endActivity] = this.getActivityItinerary(
        activity,
        lastTime,
      );
      lastTime = endActivity;
      const [restPart, endRest] = this.getRestItinerary(activity, lastTime);
      lastTime = endRest;
      itineraryActivities.push({
        activityName: `${i + 1}) ${activity.name.value}`,
        description: activity.description.value,
        id: activity.id.value,
        preparation: preparationPart,
        activity: activityPart,
        rest: restPart,
      });
    }

    return itineraryActivities;
  }

  private getStartTime(startTimeHour: number) {
    return new Time(new IntegerValueObject(Math.round(startTimeHour * 60)));
  }

  private getCurrentTime(): Time {
    const minutesTillNow = new Date().getHours() * 60 + new Date().getMinutes();
    return new Time(new IntegerValueObject(minutesTillNow));
  }

  private getPreparationItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ActivityPartPrimitive, Time] {
    const remainingTime = Math.max(
      activity.preparationTime.substract(activity.timeAlreadySpent).value,
      0,
    );
    const startTime = startActivityTime;
    const endTime = startActivityTime.add(
      new IntegerValueObject(remainingTime),
    );
    return [
      {
        label: 'Preparación',
        startTime: startTime.textual,
        endTime: endTime.textual,
        totalMinutes: remainingTime,
      },
      endTime,
    ];
  }

  private getActivityItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ActivityPartPrimitive, Time] {
    const remainingTime = Math.max(
      activity.duration
        .add(activity.preparationTime)
        .substract(activity.timeAlreadySpent).value,
      0,
    );
    const usableTime = Math.min(remainingTime, activity.duration.value);
    const startTime = startActivityTime;
    const endTime = startActivityTime.add(new IntegerValueObject(usableTime));
    return [
      {
        label: 'Actividad',
        startTime: startTime.textual,
        endTime: endTime.textual,
        totalMinutes: usableTime,
      },
      endTime,
    ];
  }

  private getRestItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ActivityPartPrimitive, Time] {
    const remainingTime = Math.max(
      activity.restTime
        .add(activity.duration)
        .add(activity.preparationTime)
        .substract(activity.timeAlreadySpent).value,
      0,
    );
    const usableTime = Math.min(remainingTime, activity.restTime.value);
    const startTime = startActivityTime;
    const endTime = startActivityTime.add(new IntegerValueObject(usableTime));

    return [
      {
        label: 'Descanso',
        startTime: startTime.textual,
        endTime: endTime.textual,
        totalMinutes: usableTime,
      },
      endTime,
    ];
  }
}
