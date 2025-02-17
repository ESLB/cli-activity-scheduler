import { IdValueObject } from '../valueObject/id.valueObject';
import { IntegerValueObject } from '../valueObject/integer.valueObject';

export interface SchedulePrimitives {
  _v: number;
  activities: string[];
}

export class Schedule {
  _v: IntegerValueObject;
  activities: IdValueObject[];

  constructor({
    _v,
    activities,
  }: {
    _v: IntegerValueObject;
    activities: IdValueObject[];
  }) {
    this._v = _v;
    this.activities = activities;
  }

  static fromPrimitives(primitives: SchedulePrimitives) {
    return new Schedule({
      _v: new IntegerValueObject(primitives._v),
      activities: primitives.activities.map((i) => new IdValueObject(i)),
    });
  }

  get values(): SchedulePrimitives {
    return {
      _v: this._v.value,
      activities: this.activities.map((i) => i.value),
    };
  }
}
