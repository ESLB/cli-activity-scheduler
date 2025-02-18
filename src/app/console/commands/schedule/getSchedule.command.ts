import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { getScheduleDetailService } from '../../services/schedule.service';
import { displaySimpleActivities } from '../activity/listActivities.command';

export const getScheduleCommand = {
  command: 'schlist',
  describe: 'List activities in schedule',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    const scheduleDetail = getScheduleDetailService.execute();
    displaySimpleActivities(scheduleDetail.activities);
  },
} satisfies CommandModule;
