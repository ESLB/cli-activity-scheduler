import { v4 as uuidv4 } from 'uuid';
import { IdValueObject } from '../valueObject/id.valueObject';
import { IntegerValueObject } from '../valueObject/integer.valueObject';
import { StringValueObject } from '../valueObject/string.valueObject';
import { BooleanValueObject } from '../valueObject/boolean.valueObject';

export interface ActivityPrimitivies {
  id: string;
  _v: number;
  name: string;
  duration: number;
  doesNeedRestAfter: boolean;
  timeAlreadySpent: number;
  finished: boolean;
}

export interface CreateActivityRequest {
  name: Activity['name'];
  duration: Activity['duration'];
  doesNeedRestAfter: Activity['doesNeedRestAfter'];
}

export class Activity {
  public id: IdValueObject;
  public _v: IntegerValueObject;
  public name: StringValueObject;
  public duration: IntegerValueObject;
  public doesNeedRestAfter: BooleanValueObject;
  public timeAlreadySpent: IntegerValueObject;
  public finished: BooleanValueObject;

  constructor({
    id,
    name,
    duration,
    doesNeedRestAfter,
    timeAlreadySpent,
    finished: current,
    _v,
  }: {
    name: StringValueObject;
    duration: IntegerValueObject;
    doesNeedRestAfter: BooleanValueObject;
    timeAlreadySpent: IntegerValueObject;
    finished: BooleanValueObject;
    id: IdValueObject;
    _v: IntegerValueObject;
  }) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.duration = duration;
    this.doesNeedRestAfter = doesNeedRestAfter;
    this.timeAlreadySpent = timeAlreadySpent;
    this._v = _v;
    this.finished = current;
  }

  static create({
    name,
    duration,
    doesNeedRestAfter,
  }: CreateActivityRequest): Activity {
    return new Activity({
      name,
      duration,
      doesNeedRestAfter,
      id: IdValueObject.random(),
      _v: new IntegerValueObject(0),
      finished: new BooleanValueObject(false),
      timeAlreadySpent: new IntegerValueObject(0),
    });
  }

  static fromPrimities(primitives: ActivityPrimitivies): Activity {
    return new Activity({
      id: new IdValueObject(primitives.id),
      name: new StringValueObject(primitives.name),
      duration: new IntegerValueObject(primitives.duration),
      doesNeedRestAfter: new BooleanValueObject(primitives.doesNeedRestAfter),
      timeAlreadySpent: new IntegerValueObject(primitives.timeAlreadySpent),
      finished: new BooleanValueObject(primitives.finished),
      _v: new IntegerValueObject(primitives._v),
    });
  }

  get values(): ActivityPrimitivies {
    return {
      id: this.id.value,
      _v: this._v.value,
      name: this.name.value,
      duration: this.duration.value,
      doesNeedRestAfter: this.doesNeedRestAfter.value,
      timeAlreadySpent: this.timeAlreadySpent.value,
      finished: this.finished.value,
    };
  }
}
