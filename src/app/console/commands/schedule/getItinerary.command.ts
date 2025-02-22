import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { generateItineraryService } from '../../services/schedule.service';
import {
  ActivityPartPrimitive,
  ItineraryActivityPrimitive2,
} from '../../../../contexts/scheduler/domain/entity/itinerary.entity';
import { addWithNewLine } from '../activity/listActivities.command';

const addPart = (text: string, activityPart: ActivityPartPrimitive) => {
  return addWithNewLine(
    text,
    `  ${activityPart.label}:\t${activityPart.totalMinutes} min\t${activityPart.startTime} - ${activityPart.endTime}`,
  );
};

const addText = (target: string, text?: string) => {
  if (text === undefined) return target;
  return addWithNewLine(target, `  ${text}`);
};

export const printItineraryActivities = (
  activities: ItineraryActivityPrimitive2[],
) => {
  let text = '';
  text = addWithNewLine(text, '');
  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];

    text = addText(text, activity.activityName);
    if (activity.description) {
      text = addText(text, activity.description);
    }
    if (activity.preparation.totalMinutes > 0) {
      text = addPart(text, activity.preparation);
    }
    if (activity.activity.totalMinutes > 0) {
      text = addPart(text, activity.activity);
    }
    if (activity.rest.totalMinutes > 0) {
      text = addPart(text, activity.rest);
    }
    text = addText(text, `Id:\t\t${activity.id}`);
    text = addWithNewLine(text, '');
  }
  console.log(text);
};

export const getItineraryCommand = {
  command: 'it',
  describe: 'Print itinerary',
  builder: {
    t: {
      describe: 'Tiempo de inicio en horas',
      demandOption: false,
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    console.clear();
    const startTimeHour = argv.t as number;
    printItineraryActivities(generateItineraryService.execute(startTimeHour));
  },
} satisfies CommandModule;
