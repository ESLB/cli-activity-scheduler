import { IntegerValueObject } from './integer.valueObject';

export class Time {
  get textual(): string {
    const hours = Math.floor(this.minutes.value / 60);
    const minutes = this.minutes.value % 60;
    return `${hours}:${minutes}`;
  }

  constructor(public readonly minutes: IntegerValueObject) {}

  public add(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.add(minutes));
  }

  public substract(minutes: IntegerValueObject): Time {
    return new Time(this.minutes.substract(minutes));
  }
}
