import { Schedule } from '../entity/schedule.entity';

export interface ScheduleRepository {
  save(schedule: Schedule): void;
  get(): Schedule;
  flush(): void;
}
