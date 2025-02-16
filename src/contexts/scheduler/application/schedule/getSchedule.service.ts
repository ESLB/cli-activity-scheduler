import { Schedule } from '../../domain/entity/schedule.entity';
import { ScheduleRepository } from '../../domain/repository/schedule.repository';

export class GetScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  execute(): Schedule {
    return this.scheduleRepository.get();
  }
}
