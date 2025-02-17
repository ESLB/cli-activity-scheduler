import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { removeLastActivityService } from '../../services/schedule.service';

export const removeLastActivityCommand = {
  command: 'schrl',
  describe: 'Remove last activity from schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    removeLastActivityService.execute();

    console.log('Última actividad removida');
  },
} satisfies CommandModule;
