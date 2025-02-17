import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { getScheduleService } from '../../services/schedule.service';

export const getScheduleCommand = {
  command: 'schlist',
  describe: 'List activities in schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    console.log(JSON.stringify(getScheduleService.execute), null, 2);
  },
} satisfies CommandModule;
