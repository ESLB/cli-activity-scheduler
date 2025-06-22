import { EnergyType } from '../../domain/entity/energyManagement.entity';
import { EnergyRepository } from '../../domain/repository/energy.repository';

export interface SpendEnergyRequest {
  energyType: EnergyType;
  minutes: number;
}

export class SpendEnergyService {
  constructor(private readonly energyRepository: EnergyRepository) {}

  execute({ energyType, minutes }: SpendEnergyRequest): void {
    const energy = this.energyRepository.get();
    energy.spendEnergy(energyType, minutes);
    this.energyRepository.save(energy);
  }
}
