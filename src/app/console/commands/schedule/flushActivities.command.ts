import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { flushActivitiesService } from '../../services/schedule.service';

export const flushActivitiesCommand = {
  command: 'schempt',
  describe: 'Empty activities from schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    flushActivitiesService.execute();

    console.log('Horario limpiado');
  },
} satisfies CommandModule;
