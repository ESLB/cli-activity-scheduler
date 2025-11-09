import { IntegerValueObject } from './integer.valueObject';

export class Time {
  get textual(): string {
    const totalHours = Math.floor(this.minutes.value / 60);
    const minutes = this.minutes.value % 60;

    // Normalize hours to 0-23 range (handle multi-day scenarios)
    const normalizedHours = totalHours % 24;

    // Convert to 12-hour format
    // 0 (midnight) → 12, 1-11 → 1-11, 12 (noon) → 12, 13-23 → 1-11
    const displayHours = normalizedHours === 0 ? 12 :
                        (normalizedHours > 12 ? normalizedHours - 12 : normalizedHours);

    const hoursText = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
    const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const indicator = normalizedHours >= 12 ? 'PM' : 'AM';

    return `${hoursText}:${minutesText}${indicator}`;
  }

  constructor(public readonly minutes: IntegerValueObject) {}

  public add(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.add(minutes));
  }

  public substract(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.substract(minutes));
  }
}
