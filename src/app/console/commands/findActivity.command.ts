import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { findActivityService } from '../services/activity.service';

export const findActivityCommand = {
  command: 'find',
  describe: 'Find activity by Id',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;

    console.log(findActivityService.execute(id).values);
  },
} satisfies CommandModule;
