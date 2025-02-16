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
      describe: 'First number',
      type: 'string',
    },
    d: {
      describe: 'Second number',
      type: 'number',
    },
    r: {
      describe: 'Second number',
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;

    console.log({
      id,
    });

    patchActivityService.execute({
      id,
    });

    console.log('Actualizado correctamente');
  },
} satisfies CommandModule;
