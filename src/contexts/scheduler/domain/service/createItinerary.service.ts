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
      const [preparationItinerary, preparationTime] =
        this.getPreparationItinerary(activity, lastTime);
      itineraryActivities.push(...preparationItinerary);
      lastTime = preparationTime;
      const [activityItinerary, timeActivity] = this.getActivityItinerary(
        activity,
        lastTime,
      );
      itineraryActivities.push(...activityItinerary);
      lastTime = timeActivity;
      const [restItinerary, restLastTime] = this.getRestItinerary(
        activity,
        lastTime,
      );
      itineraryActivities.push(...restItinerary);
      lastTime = restLastTime;
    }
    return itineraryActivities;
  }

  private getCurrentTime(): Time {
    const minutesTillNow = new Date().getHours() * 60 + new Date().getMinutes();
    return new Time(new IntegerValueObject(minutesTillNow));
  }

  private getPreparationItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ItineraryActivityPrimitive[], Time] {
    const possibleRemainingTime = activity.preparationTime.substract(
      activity.timeAlreadySpent,
    );
    if (possibleRemainingTime.value <= 0) {
      return [[], startActivityTime];
    }

    const startTime = startActivityTime;
    const endTime = startActivityTime.add(possibleRemainingTime);
    const text = `Preparación para ${activity.name.value}`;
    return [
      [
        {
          startTime: startTime.textual,
          endtime: endTime.textual,
          minutes: possibleRemainingTime.value,
          label: text,
        },
      ],
      endTime,
    ];
  }

  private getActivityItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ItineraryActivityPrimitive[], Time] {
    const possibleRemainingTime = activity.duration
      .add(activity.preparationTime)
      .substract(activity.timeAlreadySpent);
    if (possibleRemainingTime.value <= 0) {
      return [[], startActivityTime];
    }
    const startTime = startActivityTime;
    const usedTime =
      activity.duration.value < possibleRemainingTime.value
        ? activity.duration
        : possibleRemainingTime;
    const endTime = startActivityTime.add(usedTime);
    const text = `${activity.name.value}`;
    return [
      [
        {
          startTime: startTime.textual,
          endtime: endTime.textual,
          label: text,
          minutes: usedTime.value,
          description: activity.description.value,
          id: activity.id.value,
        },
      ],
      endTime,
    ];
  }

  private getRestItinerary(
    activity: Activity,
    startActivityTime: Time,
  ): [ItineraryActivityPrimitive[], Time] {
    const possibleRemainingTime = activity.restTime
      .add(activity.duration)
      .add(activity.preparationTime)
      .substract(activity.timeAlreadySpent);
    if (activity.restTime.value <= 0 || possibleRemainingTime.value <= 0) {
      return [[], startActivityTime];
    }
    const usedTime =
      activity.restTime.value < possibleRemainingTime.value
        ? activity.restTime
        : possibleRemainingTime;
    const startTime = startActivityTime;
    const endTime = startActivityTime.add(usedTime);
    const text = `Descanso de ${activity.name.value}`;
    return [
      [
        {
          startTime: startTime.textual,
          endtime: endTime.textual,
          label: text,
          minutes: usedTime.value,
        },
      ],
      endTime,
    ];
  }
}
