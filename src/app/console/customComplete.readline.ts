import { parse } from 'shell-quote';
import type { Completer } from 'readline';
import { getMatchingIdsService } from './services/activity.service';

const getId = (line: string): string | undefined => {
  let searchingId = undefined;
  const options = parse(line);
  const antepenultimo = options[options.length - 2]?.toString();
  const last = options[options.length - 1]?.toString();
  if (antepenultimo === '--id') {
    searchingId = last;
  } else if (last.includes('--id=')) {
    const parts = last.split('--id=');
    searchingId = parts[1];
  }
  return searchingId;
};

export const customCompleter: Completer = (line) => {
  if (line.length < 3) {
    return [[], line];
  }

  const searchingId = getId(line);
  if (searchingId === undefined) {
    return [[], line];
  }

  const matchingIds = getMatchingIdsService
    .execute(searchingId)
    .map((i) => i.value);

  if (matchingIds.length === 1) {
    const firstPart = line.substring(0, line.length - searchingId.length);
    return [[firstPart + matchingIds[0]], line];
  }

  return [matchingIds, line];
};
