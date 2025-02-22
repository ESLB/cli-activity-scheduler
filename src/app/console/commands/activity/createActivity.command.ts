import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { createActivityService } from '../../services/activity.service';

export const createActivityCommand = {
  command: 'create',
  describe: 'Create activity',
  builder: {
    n: {
      describe: 'Nombre de la actividad',
      demandOption: true,
      type: 'string',
    },
    d: {
      describe: 'Duración',
      demandOption: true,
      type: 'number',
    },
    r: {
      describe: '¿Necesita descanso?',
      type: 'boolean',
    },
    t: {
      describe: 'Tiempo de descanso',
      type: 'number',
    },
    p: {
      describe: 'Tiempo de preparación',
      type: 'number',
    },
    e: {
      describe: 'Descripción',
      type: 'string',
    },
    s: {
      describe: 'Parámetro de seguridad',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const name = argv.n as string;
    const duration = argv.d as number;
    const rest = argv.r as boolean;
    const t = argv.t as number;
    const p = argv.p as number;
    const e = argv.e as string;

    createActivityService.execute({
      name,
      duration,
      doesNeedRestAfter: rest,
      restTime: t,
      preparationTime: p,
      description: e,
    });

    console.log('Creado correctamente');
  },
} satisfies CommandModule;

// Ejemplo
// create --n "Limpiar mi escritorio test 1" --e "Quiero sacar el polvo, botar los papeles, volver a poner el tacho de basura, quitar el polvo de los equipos, acomodar algunas cosas a otros lados" --d 60 --r true --t 30 --p 15
