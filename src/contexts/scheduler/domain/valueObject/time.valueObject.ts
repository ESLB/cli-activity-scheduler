import { IntegerValueObject } from './integer.valueObject';

export class Time {
  get textual(): string {
    const hours = Math.floor(this.minutes.value / 60);
    const minutes = this.minutes.value % 60;
    const localHours = hours > 12 ? hours % 12 : hours;
    const hoursText = localHours < 10 ? `0${localHours}` : `${localHours}`;
    const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const indicator = hours >= 12 ? 'PM' : 'AM';
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
