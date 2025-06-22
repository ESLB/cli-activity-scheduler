import { GetEnergyService } from '../../../contexts/scheduler/application/energy/getEnergy.service';
import { SpendEnergyService } from '../../../contexts/scheduler/application/energy/spendEnergy.service';
import { UpdateEnergyService } from '../../../contexts/scheduler/application/energy/updateEnergy.service';
import { EnergyTextRepository } from '../../../contexts/scheduler/infrastructure/repository/energy.repository';

export const energyTextRepository = new EnergyTextRepository(); // Assuming the same repository is used for energy management
export const getEnergyService = new GetEnergyService(energyTextRepository);
export const saveEnergyService = new UpdateEnergyService(energyTextRepository);
export const spendEnergyService = new SpendEnergyService(energyTextRepository);
