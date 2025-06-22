import { ArgumentsCamelCase, CommandModule } from 'yargs';
import {
  getEnergyService,
  saveEnergyService,
} from '../../services/energy.service';
import { EnergyManagement } from '../../../../contexts/scheduler/domain/entity/energyManagement.entity';

const minutesToHoursString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  let hoursString = `${hours}`;
  if (hours < 10) {
    hoursString = `${hours}`;
  }
  const minutesRemainder = minutes % 60;
  let minutesRemainderString = `${minutesRemainder}`;
  if (minutesRemainder < 10) {
    minutesRemainderString = `0${minutesRemainder}`;
  }
  return `${hoursString}:${minutesRemainderString}`;
};

export const printEnergy = (energyManagement: EnergyManagement) => {
  console.log('Estado de la energía');
  console.log(
    `Tiempo disponible: ${minutesToHoursString(energyManagement.availableTime)} horas | ${energyManagement.availableTime} minutos`,
  );
  console.log(
    `Energía disponible: ${(energyManagement.availableEnergy / 3).toFixed(2)} high | ${(energyManagement.availableEnergy / 2).toFixed(2)} mid | ${energyManagement.availableEnergy.toFixed(2)} low`,
  );
};

export const setEnergyValuesCommand = {
  command: 'set-energy',
  aliases: ['sete'],
  describe: '',
  builder: {
    ht: {
      describe: 'Tiempo total disponible',
      demandOption: false,
      type: 'number',
    },
    le: {
      describe: 'Energía disponible',
      demandOption: false,
      type: 'number',
    },
    s: {
      describe: 'Parámetro de seguridad',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const ht = argv.ht as number;
    const le = argv.le as number;

    saveEnergyService.execute({
      hoursTime: ht,
      lowEnergy: le,
    });

    console.clear();
    printEnergy(getEnergyService.execute());
  },
} satisfies CommandModule;

// Ejemplo
// create --n "Limpiar mi escritorio test 1" --e "Quiero sacar el polvo, botar los papeles, volver a poner el tacho de basura, quitar el polvo de los equipos, acomodar algunas cosas a otros lados" --d 60 --r true --t 30 --p 15
// set-energy --el 14 --th 4 -s
