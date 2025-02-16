import { ScheduleRepository } from '../../domain/repository/schedule.repository';

export class RemoveLastActivityService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(): void {
    const schedule = this.scheduleRepository.get();
    schedule.activities.pop();

    this.scheduleRepository.save(schedule);
  }
}
