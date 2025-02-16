import { Schedule } from '../entity/schedule.entity';

export interface ScheduleRepository {
  saveSchedule(schedule: Schedule): void;
  getSchedule(): Schedule;
  flushSchedule(): void;
}
