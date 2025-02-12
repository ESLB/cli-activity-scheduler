/**
 * Everything in minutes
 * All hours in absolute time
 */
import { v4 as uuidv4 } from 'uuid';

export class Activity {
  readonly id: string;
  readonly _v: number;
  readonly name: string;
  readonly duration: number;
  readonly doesNeedRestAfter: boolean;
  readonly timeAlreadySpent: number;
  readonly finished: boolean;

  constructor({
    id,
    name,
    duration,
    doesNeedRestAfter,
    timeAlreadySpent,
    finished: current,
    _v,
  }: {
    name: string;
    duration: number;
    doesNeedRestAfter: boolean;
    timeAlreadySpent: number;
    finished: boolean;
    id?: string;
    _v?: number;
  }) {
    this.id = id ?? uuidv4();
    this.name = name;
    this.duration = duration;
    this.doesNeedRestAfter = doesNeedRestAfter;
    this.timeAlreadySpent = timeAlreadySpent;
    this._v = _v ?? 1;
    this.finished = current;
  }
}
