import { EnergyRepository } from '../../domain/repository/energy.repository';

export interface UpdateEnergyRequest {
  hoursTime?: number;
  lowEnergy?: number;
}

export class UpdateEnergyService {
  constructor(private readonly energyRepository: EnergyRepository) {}

  execute({ hoursTime, lowEnergy }: UpdateEnergyRequest): void {
    const energy = this.energyRepository.get();
    if (hoursTime) {
      energy.availableTime = hoursTime * 60;
    }
    if (lowEnergy) {
      energy.availableEnergy = lowEnergy;
    }
    this.energyRepository.save(energy);
  }
}
