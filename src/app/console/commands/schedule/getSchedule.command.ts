import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { getScheduleDetailService } from '../../services/schedule.service';

export const getScheduleCommand = {
  command: 'schlist',
  describe: 'List activities in schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    console.log(JSON.stringify(getScheduleDetailService.execute(), null, 2));
  },
} satisfies CommandModule;
