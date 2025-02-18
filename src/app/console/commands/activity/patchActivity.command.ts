import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { patchActivityService } from '../../services/activity.service';

export const patchActivityCommand = {
  command: 'update',
  describe: 'Update activity',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
    n: {
      describe: 'Nombre de la actividad',
      type: 'string',
    },
    d: {
      describe: 'Duración',
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
    a: {
      describe: 'Tiempo ya ejecutado',
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;
    const name = argv.n as string;
    const duration = argv.d as number;
    const rest = argv.r as boolean;
    const restTime = argv.t as number;
    const preparationTime = argv.p as number;
    const description = argv.e as string;
    const alreadySpent = argv.a as number;

    patchActivityService.execute({
      id,
      name,
      duration,
      doesNeedRestAfter: rest,
      restTime: restTime,
      preparationTime: preparationTime,
      description: description,
      timeAlreadySpent: alreadySpent,
    });

    console.log('Actualizado correctamente');
  },
} satisfies CommandModule;
