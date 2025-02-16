import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { createActivityService } from '../services/activity.service';

export const createActivityCommand = {
  command: 'create',
  describe: 'Create activity',
  builder: {
    n: {
      describe: 'First number',
      demandOption: true,
      type: 'string',
    },
    d: {
      describe: 'Second number',
      demandOption: true,
      type: 'number',
    },
    r: {
      describe: 'Second number',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const name = argv.n as string;
    const duration = argv.d as number;
    const rest = argv.r as boolean;

    console.log({
      name,
      duration,
      doesNeedRestAfter: rest,
    });

    createActivityService.execute({
      name,
      duration,
      doesNeedRestAfter: rest,
    });

    console.log('Creado correctamente');
  },
} satisfies CommandModule;
