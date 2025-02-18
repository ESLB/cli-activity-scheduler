import { CommandModule } from 'yargs';
import { listActivitiesService } from '../../services/activity.service';
import { ActivityPrimitivies } from '../../../../contexts/scheduler/domain/entity/activity.entity';

export const addWithNewLine = (
  target: string,
  payload: string | boolean | number,
) => {
  return target + payload + '\n';
};

export const addFieldIfAvailable = (
  target: string,
  payload: Record<string, any>,
  field: string,
) => {
  const availableTypes = ['string', 'boolean', 'number'];
  if (field in payload && availableTypes.includes(typeof payload[field])) {
    // const value =
    //   field === 'id' ? payload[field].substring(0, 13) : payload[field];
    const value = payload[field];
    const withPrefix = `  ${field}: ${value}`;
    return addWithNewLine(target, withPrefix);
  } else {
    return target;
  }
};

export const noEndingCharacters = ['\n', '-'];

export const getCleanText = (text: string) => {
  let last = text[text.length - 1];
  while (noEndingCharacters.includes(last)) {
    text = text.substring(0, text.length - 1);
    last = text[text.length - 1];
  }

  return text + '\n';
};

export const displaySimpleActivities = (activities: ActivityPrimitivies[]) => {
  let text = '';
  for (const activity of activities) {
    text = addFieldIfAvailable(text, activity, 'id');
    text = addFieldIfAvailable(text, activity, 'name');
    text = addFieldIfAvailable(text, activity, 'totalTime');
    text = addWithNewLine(text, '');
  }
  text = getCleanText(text);
  console.log(text);
};

export const listActivitiesCommand = {
  command: 'list',
  describe: 'List activities',
  handler: () => {
    const activities = listActivitiesService.execute().map((i) => i.values);
    displaySimpleActivities(activities);
  },
} satisfies CommandModule;
