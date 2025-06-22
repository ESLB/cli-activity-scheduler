export const lowEnergy = 'low';
export const highEnergy = 'high';
export const midEnergy = 'mid';

export type EnergyType =
  | typeof lowEnergy
  | typeof highEnergy
  | typeof midEnergy;

export interface EnergyManagementPrimitives {
  availableTime: number;
  availableEnergy: number;
  _v?: number;
}

export class EnergyManagement {
  public _v: number;
  public availableTime: number; // Minutes
  public availableEnergy: number; // Low energy/hours

  constructor({
    availableTime,
    availableEnergy,
    _v = 0,
  }: EnergyManagementPrimitives) {
    this._v = _v;
    this.availableTime = availableTime;
    this.availableEnergy = availableEnergy;
  }

  static fromPrimitives(
    primitives: EnergyManagementPrimitives,
  ): EnergyManagement {
    return new EnergyManagement({
      availableTime: primitives.availableTime,
      availableEnergy: primitives.availableEnergy,
      _v: primitives._v,
    });
  }

  get values(): EnergyManagementPrimitives {
    return {
      availableTime: this.availableTime,
      availableEnergy: this.availableEnergy,
      _v: this._v,
    };
  }

  public spendEnergy(energyType: EnergyType, minutes: number): void {
    const energySpent = this.calculateEnergySpent(energyType, minutes);
    this.availableEnergy -= energySpent;
    this.availableTime -= minutes;
  }

  private calculateEnergySpent(type: EnergyType, minutes: number): number {
    const totalHours = minutes / 60;
    if (type === lowEnergy) {
      return 1 * totalHours;
    } else if (type === midEnergy) {
      return 2 * totalHours;
    } else if (type === highEnergy) {
      return 3 * totalHours;
    }
    throw new Error('Invalid energy type');
  }
}
