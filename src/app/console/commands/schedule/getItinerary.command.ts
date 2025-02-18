import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { generateItineraryService } from '../../services/schedule.service';
import { ItineraryActivityPrimitive } from '../../../../contexts/scheduler/domain/entity/itinerary.entity';
import { addWithNewLine } from '../activity/listActivities.command';

const addHours = (text: string, activity: ItineraryActivityPrimitive) => {
  return addWithNewLine(text, `  ${activity.startTime} - ${activity.endtime}`);
};

const addText = (target: string, text?: string) => {
  if (text === undefined) return target;
  return addWithNewLine(target, `  ${text}`);
};

const printItineraryActivities = (activities: ItineraryActivityPrimitive[]) => {
  let text = '';
  text = addWithNewLine(text, '');
  for (const activity of activities) {
    text = addHours(text, activity);
    text = addText(text, activity.label);
    text = addText(text, activity.description);
    text = addText(text, `Remaining: ${activity.minutes}`);
    text = addText(text, activity.id?.substring(0, 13));
    text = addWithNewLine(text, '');
  }
  console.log(text);
};

export const getItineraryCommand = {
  command: 'it',
  describe: 'Print itinerary',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    printItineraryActivities(generateItineraryService.execute());
  },
} satisfies CommandModule;
