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
    `  ${activityPart.label}:\t${activityPart.startTime} - ${activityPart.endTime}\t${formatDuration(activityPart.totalMinutes)}`,
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
  // text = addText(text, `Id:\t\t${activity.id}`);

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

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hStr = m === 0 ? `${h}h` : `${h}h ${m} min`;
  return `${hStr} (${minutes} min)`;
};

// Returns minutes from midnight (0-1439) for a "HH:MMam/pm" string
const parseTimeStr = (timeStr: string): number => {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === 'PM';
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
};

const minutesToTimeStr = (absoluteMinutes: number): string => {
  const totalHours = Math.floor(absoluteMinutes / 60);
  const mins = absoluteMinutes % 60;
  const normalizedHours = totalHours % 24;
  const displayHours =
    normalizedHours === 0 ? 12 : normalizedHours > 12 ? normalizedHours - 12 : normalizedHours;
  const h = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
  const m = mins < 10 ? `0${mins}` : `${mins}`;
  const indicator = normalizedHours >= 12 ? 'PM' : 'AM';
  return `${h}:${m}${indicator}`;
};

const getItemStartStr = (item: ItineraryItemPrimitive): string => {
  if (item.type === 'activity') {
    if (item.preparation.totalMinutes > 0) return item.preparation.startTime;
    if (item.activity.totalMinutes > 0) return item.activity.startTime;
    return item.rest.startTime;
  }
  if (item.preBreak.totalMinutes > 0) return item.preBreak.startTime;
  return item.blockedTime.startTime;
};

const getItemTotalMinutes = (item: ItineraryItemPrimitive): number => {
  if (item.type === 'activity') {
    return (
      item.preparation.totalMinutes + item.activity.totalMinutes + item.rest.totalMinutes
    );
  }
  return item.preBreak.totalMinutes + item.blockedTime.totalMinutes + item.postBreak.totalMinutes;
};

// Resolves the absolute start of an item given the previous absolute end, handling midnight crossing.
const resolveAbsoluteStart = (timeStr: string, prevAbsoluteEnd: number): number => {
  const parsed = parseTimeStr(timeStr);
  const dayBase = Math.floor(prevAbsoluteEnd / 1440) * 1440;
  let absolute = dayBase + parsed;
  if (absolute < prevAbsoluteEnd) absolute += 1440;
  return absolute;
};

const printFreeTime = (startAbsolute: number, endAbsolute: number): string => {
  const duration = endAbsolute - startAbsolute;
  const startStr = minutesToTimeStr(startAbsolute);
  const endStr = minutesToTimeStr(endAbsolute);
  let text = '';
  text = addText(text, `⏳ Tiempo disponible`);
  text = addWithNewLine(
    text,
    `  Libre:\t${startStr} - ${endStr}\t${formatDuration(duration)}`,
  );
  return text;
};

export const printItineraryWithBlocks = (items: ItineraryItemPrimitive[], startMinutes?: number) => {
  let text = '';
  text = addWithNewLine(text, '');

  let absoluteEnd = startMinutes ?? -1;

  for (const item of items) {
    const startStr = getItemStartStr(item);

    if (startStr && absoluteEnd !== -1) {
      const absoluteStart = resolveAbsoluteStart(startStr, absoluteEnd);
      const gap = absoluteStart - absoluteEnd;
      if (gap > 0) {
        text += printFreeTime(absoluteEnd, absoluteStart);
        text = addWithNewLine(text, '');
      }
      absoluteEnd = absoluteStart + getItemTotalMinutes(item);
    } else if (startStr && absoluteEnd === -1) {
      const parsedStart = parseTimeStr(startStr);
      absoluteEnd = parsedStart + getItemTotalMinutes(item);
    }

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
