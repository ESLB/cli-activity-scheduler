import fs from 'fs';
import path from 'path';
import { EnergyRepository } from '../../domain/repository/energy.repository';
import {
  EnergyManagement,
  EnergyManagementPrimitives,
} from '../../domain/entity/energyManagement.entity';

export class EnergyTextRepository implements EnergyRepository {
  private filePath = path.resolve(
    __dirname,
    '../../../../../energyManagement.json',
  );

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}), 'utf-8');
    }
  }

  public get(): EnergyManagement {
    const energyPrimitives = this.getEnergyManagementJSON();
    return EnergyManagement.fromPrimitives(energyPrimitives);
  }

  public save(energyManagement: EnergyManagement): void {
    this.saveEnergyJSON(energyManagement.values);
  }

  private saveEnergyJSON(energyPrimitives: EnergyManagementPrimitives): void {
    const savedEnergyManagement = this.getEnergyManagementJSON();
    if (savedEnergyManagement._v !== energyPrimitives._v) {
      throw Error(`Version mismatch`);
    }
    savedEnergyManagement._v = savedEnergyManagement._v + 1;
    savedEnergyManagement.availableEnergy = energyPrimitives.availableEnergy;
    savedEnergyManagement.availableTime = energyPrimitives.availableTime;
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(savedEnergyManagement, null, 2),
      'utf-8',
    );
  }

  private getEnergyManagementJSON(): EnergyManagement {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    const primitiveEnergyManagement = JSON.parse(raw) as EnergyManagement;
    if (
      primitiveEnergyManagement._v === undefined ||
      primitiveEnergyManagement._v === null
    ) {
      primitiveEnergyManagement._v = 1;
    }
    if (
      primitiveEnergyManagement.availableEnergy === undefined ||
      primitiveEnergyManagement.availableEnergy === null
    ) {
      primitiveEnergyManagement.availableEnergy = 0;
    }
    if (
      primitiveEnergyManagement.availableEnergy === undefined ||
      primitiveEnergyManagement.availableEnergy === null
    ) {
      primitiveEnergyManagement.availableEnergy = 0;
    }
    return primitiveEnergyManagement;
  }
}
