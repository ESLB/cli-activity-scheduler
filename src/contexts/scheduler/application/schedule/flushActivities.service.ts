import { ScheduleRepository } from '../../domain/repository/schedule.repository';

export class FlushActivitiesService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(): void {
    const schedule = this.scheduleRepository.get();
    schedule.activities = [];

    this.scheduleRepository.save(schedule);
  }
}
