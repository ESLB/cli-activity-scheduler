import { v4 as uuidv4 } from 'uuid';
import { IdValueObject } from '../valueObject/id.valueObject';
import { IntegerValueObject } from '../valueObject/integer.valueObject';
import { StringValueObject } from '../valueObject/string.valueObject';
import { BooleanValueObject } from '../valueObject/boolean.valueObject';

export interface ActivityPrimitivies {
  id: string;
  _v: number;
  name: string;
  description: string;
  duration: number;
  doesNeedRestAfter: boolean;
  timeAlreadySpent: number;
  finished: boolean;
  predecessors: string[];
  restTime: number;
  preparationTime: number;
}

export interface CreateActivityRequest {
  name: Activity['name'];
  duration: Activity['duration'];
  doesNeedRestAfter?: Activity['doesNeedRestAfter'];
  restTime?: Activity['restTime'];
  preparationTime?: Activity['preparationTime'];
  description?: Activity['description'];
}

export class Activity {
  public id: IdValueObject;
  public _v: IntegerValueObject;
  public name: StringValueObject;
  public description: StringValueObject;
  public duration: IntegerValueObject;
  public doesNeedRestAfter: BooleanValueObject;
  public restTime: IntegerValueObject;
  public preparationTime: IntegerValueObject;
  public timeAlreadySpent: IntegerValueObject;
  public finished: BooleanValueObject;
  public predecessors: IdValueObject[];
  get remainingTime() {
    return this.duration.substract(this.timeAlreadySpent);
  }

  constructor({
    id,
    name,
    duration,
    doesNeedRestAfter,
    timeAlreadySpent,
    finished: current,
    _v,
    predecessors,
    restTime,
    preparationTime,
    description,
  }: {
    name: StringValueObject;
    duration: IntegerValueObject;
    doesNeedRestAfter: BooleanValueObject;
    timeAlreadySpent: IntegerValueObject;
    finished: BooleanValueObject;
    id: IdValueObject;
    _v: IntegerValueObject;
    restTime: IntegerValueObject;
    preparationTime: IntegerValueObject;
    predecessors: IdValueObject[];
    description: StringValueObject;
  }) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.duration = duration;
    this.doesNeedRestAfter = doesNeedRestAfter;
    this.timeAlreadySpent = timeAlreadySpent;
    this._v = _v;
    this.finished = current;
    this.predecessors = predecessors;
    this.restTime = restTime;
    this.preparationTime = preparationTime;
    this.description = description;
  }

  static create({
    name,
    duration,
    doesNeedRestAfter,
    restTime,
    preparationTime,
    description,
  }: CreateActivityRequest): Activity {
    return new Activity({
      name,
      duration,
      doesNeedRestAfter: doesNeedRestAfter ?? new BooleanValueObject(true),
      id: IdValueObject.random(),
      _v: new IntegerValueObject(0),
      finished: new BooleanValueObject(false),
      timeAlreadySpent: new IntegerValueObject(0),
      predecessors: [],
      restTime: restTime ?? new IntegerValueObject(10),
      preparationTime: preparationTime ?? new IntegerValueObject(0),
      description: description ?? new StringValueObject(''),
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
      predecessors: primitives.predecessors.map((i) => new IdValueObject(i)),
      restTime: new IntegerValueObject(primitives.restTime),
      preparationTime: new IntegerValueObject(primitives.preparationTime),
      description: new StringValueObject(primitives.description),
    });
  }

  get values(): ActivityPrimitivies {
    return {
      id: this.id.value,
      _v: this._v.value,
      name: this.name.value,
      description: this.description.value,
      duration: this.duration.value,
      doesNeedRestAfter: this.doesNeedRestAfter.value,
      timeAlreadySpent: this.timeAlreadySpent.value,
      finished: this.finished.value,
      predecessors: this.predecessors.map((i) => i.value),
      preparationTime: this.preparationTime.value,
      restTime: this.restTime.value,
    };
  }
}
