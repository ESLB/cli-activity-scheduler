import { EnergyManagement } from '../entity/energyManagement.entity';

export interface EnergyRepository {
  get(): EnergyManagement;
  save(energyManagement: EnergyManagement): void;
}
