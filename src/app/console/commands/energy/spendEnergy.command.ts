import { ArgumentsCamelCase, CommandModule } from 'yargs';
import {
  getEnergyService,
  spendEnergyService,
} from '../../services/energy.service';
import {
  EnergyType,
  highEnergy,
  lowEnergy,
  midEnergy,
} from '../../../../contexts/scheduler/domain/entity/energyManagement.entity';
import { printEnergy } from './setEnergyValues.command';

export const spendEnergyCommand = {
  command: 'spend-energy',
  aliases: ['spe'],
  describe: '',
  builder: {
    et: {
      describe: 'Energy type (low, mid, high)',
      demandOption: true,
      type: 'string',
      choices: ['l', 'm', 'h'],
    },
    m: {
      describe: 'minutes to spend energy',
      demandOption: true,
      type: 'number',
    },
    s: {
      describe: 'Parámetro de seguridad',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    let et = argv.et as string;
    const m = argv.m as number;

    if (!['l', 'm', 'h'].includes(et)) {
      console.error('Invalid energy type. Use "l", "m", or "h".');
      return;
    }

    switch (et) {
      case 'l':
        et = lowEnergy;
        break;
      case 'm':
        et = midEnergy;
        break;
      case 'h':
        et = highEnergy;
        break;
    }

    console.clear();
    console.log('Antes');
    printEnergy(getEnergyService.execute());

    spendEnergyService.execute({
      energyType: et as EnergyType,
      minutes: m,
    });

    console.log('\n');

    console.log('Después');
    printEnergy(getEnergyService.execute());
  },
} satisfies CommandModule;

// Ejemplo
// create --n "Limpiar mi escritorio test 1" --e "Quiero sacar el polvo, botar los papeles, volver a poner el tacho de basura, quitar el polvo de los equipos, acomodar algunas cosas a otros lados" --d 60 --r true --t 30 --p 15
// spend-energy --et low --m 45
