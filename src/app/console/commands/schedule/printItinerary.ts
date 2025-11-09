import {
  ActivityPartPrimitive,
  ItineraryActivityPrimitive2,
  ItineraryBlockedTimePrimitive,
  ItineraryItemPrimitive,
} from '../../../../contexts/scheduler/domain/entity/itinerary.entity';

const addWithNewLine = (target: string, text: string): string => {
  return target + text + '\n';
};

const addPart = (text: string, activityPart: ActivityPartPrimitive): string => {
  if (activityPart.totalMinutes === 0) {
    return text;
  }
  return addWithNewLine(
    text,
    `  ${activityPart.label}:\t${activityPart.totalMinutes} min\t${activityPart.startTime} - ${activityPart.endTime}`,
  );
};

const addText = (target: string, text?: string): string => {
  if (text === undefined || text === '') return target;
  return addWithNewLine(target, `  ${text}`);
};

const printActivity = (
  activity: ItineraryActivityPrimitive2 & { type: 'activity' },
): string => {
  let text = '';

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

  return text;
};

const printBlockedTime = (block: ItineraryBlockedTimePrimitive): string => {
  let text = '';

  text = addText(text, `🔒 ${block.name} (Bloque Fijo)`);
  text = addPart(text, block.preBreak);
  text = addPart(text, block.blockedTime);
  text = addPart(text, block.postBreak);

  return text;
};

export const printItineraryWithBlocks = (items: ItineraryItemPrimitive[]) => {
  let text = '';
  text = addWithNewLine(text, '');

  for (const item of items) {
    if (item.type === 'blocked') {
      text += printBlockedTime(item);
    } else {
      text += printActivity(item);
    }
    text = addWithNewLine(text, '');
  }

  console.log(text);
};

// Keep backward compatibility
export const printItineraryActivities = (
  activities: ItineraryActivityPrimitive2[],
) => {
  const items: ItineraryItemPrimitive[] = activities.map((a) => ({
    ...a,
    type: 'activity' as const,
  }));
  printItineraryWithBlocks(items);
};
