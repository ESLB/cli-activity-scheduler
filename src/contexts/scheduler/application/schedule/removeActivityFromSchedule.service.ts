import { ScheduleRepository } from '../../domain/repository/schedule.repository';
import { ValidateScheduleIntegrity } from '../../domain/service/validateScheduleIntegrity.service';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';

export class RemoveActivityFromScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly validateScheduleIntegrity: ValidateScheduleIntegrity,
  ) {}

  execute(position: IntegerValueObject): void {
    if (position.value < 1) {
      throw Error('La posición debe empezar desde 1');
    }
    const arrayPosition = position.value - 1;

    const schedule = this.scheduleRepository.get();

    schedule.activities.splice(arrayPosition, 1);

    this.validateScheduleIntegrity.execute(schedule);

    this.scheduleRepository.save(schedule);
  }
}
