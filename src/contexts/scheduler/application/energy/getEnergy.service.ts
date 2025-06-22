import { EnergyManagement } from '../../domain/entity/energyManagement.entity';
import { EnergyRepository } from '../../domain/repository/energy.repository';

export class GetEnergyService {
  constructor(private readonly eneryRepository: EnergyRepository) {}

  execute(): EnergyManagement {
    return this.eneryRepository.get();
  }
}
