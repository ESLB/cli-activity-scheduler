import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { removeLastActivity } from '../../services/schedule.service';

export const removeLastActivityCommand = {
  command: 'schrl',
  describe: 'Remove last activity from schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    removeLastActivity.execute();

    console.log('Última actividad removida');
  },
} satisfies CommandModule;
