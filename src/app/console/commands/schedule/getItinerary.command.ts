import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { generateItineraryService } from '../../services/schedule.service';
import { ItineraryActivityPrimitive } from '../../../../contexts/scheduler/domain/entity/itinerary.entity';
import { addWithNewLine } from '../activity/listActivities.command';

const addHours = (text: string, activity: ItineraryActivityPrimitive) => {
  return addWithNewLine(text, `  ${activity.startTime} - ${activity.endtime}`);
};

const printName = (text: string, activity: ItineraryActivityPrimitive) => {
  return addWithNewLine(text, `  ${activity.label}`);
};
const printId = (text: string, id: string) => {
  return addWithNewLine(text, `  ${id.substring(0, 13)}`);
};

const printItineraryActivities = (activities: ItineraryActivityPrimitive[]) => {
  let text = '';
  text = addWithNewLine(text, '');
  for (const activity of activities) {
    text = addHours(text, activity);
    text = printName(text, activity);
    if (activity.id) text = printId(text, activity.id);
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
