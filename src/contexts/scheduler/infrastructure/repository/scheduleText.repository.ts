import fs from 'fs';
import path from 'path';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import {
  Schedule,
  SchedulePrimitives,
} from '../../domain/entity/schedule.entity';

export class ScheduleTextRepository implements ScheduleRepository {
  private filePath = path.resolve(__dirname, 'schedule.json');

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}), 'utf-8');
    }
  }

  public save(schedule: Schedule): void {
    this.saveScheduleJSON(schedule.values);
  }

  public get(): Schedule {
    const schedulePrimitive = this.getScheduleJSON();
    return Schedule.fromPrimitives(schedulePrimitive);
  }

  private saveScheduleJSON(schedule: SchedulePrimitives): void {
    const savedSchedule = this.getScheduleJSON();
    if (savedSchedule._v !== schedule._v) {
      throw Error(`Version mismatch`);
    }
    savedSchedule._v = savedSchedule._v + 1;
    savedSchedule.activities = schedule.activities;
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(savedSchedule, null, 2),
      'utf-8',
    );
  }

  private getScheduleJSON(): SchedulePrimitives {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    const primitiveSchedule = JSON.parse(raw) as SchedulePrimitives;
    if (primitiveSchedule._v === undefined || primitiveSchedule._v === null) {
      primitiveSchedule._v = 1;
    }
    if (
      primitiveSchedule.activities === undefined ||
      primitiveSchedule.activities === null
    ) {
      primitiveSchedule.activities = [];
    }
    return primitiveSchedule;
  }
}
