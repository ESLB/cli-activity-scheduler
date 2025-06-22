import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { getEnergyService } from '../../services/energy.service';
import { printEnergy } from './setEnergyValues.command';

export const viewEnergyValuesCommand = {
  command: 'view-energy',
  aliases: ['ve'],
  describe: '',
  handler: (argv: ArgumentsCamelCase) => {
    console.clear();
    printEnergy(getEnergyService.execute());
  },
} satisfies CommandModule;

// Ejemplo
// create --n "Limpiar mi escritorio test 1" --e "Quiero sacar el polvo, botar los papeles, volver a poner el tacho de basura, quitar el polvo de los equipos, acomodar algunas cosas a otros lados" --d 60 --r true --t 30 --p 15
// view-energy
