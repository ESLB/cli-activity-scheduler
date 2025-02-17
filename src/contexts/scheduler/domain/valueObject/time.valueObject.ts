import { IntegerValueObject } from './integer.valueObject';

export class Time {
  get textual(): string {
    const hours = Math.floor(this.minutes.value / 60);
    const minutes = this.minutes.value % 60;
    const hoursText = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hoursText}:${minutesText}`;
  }

  constructor(public readonly minutes: IntegerValueObject) {}

  public add(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.add(minutes));
  }

  public substract(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.substract(minutes));
  }
}
