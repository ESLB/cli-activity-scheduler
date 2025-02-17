import { parse } from 'shell-quote';
import type { Completer } from 'readline';
import { getMatchingIdsService } from './services/activity.service';

// TODO: Esto requiere revisión de seguridad
const getLastId = (line: string): string | undefined => {
  let searchingId = undefined;
  const options = parse(line);
  const secondToLast = options[options.length - 2]?.toString() || '';
  const last = options[options.length - 1]?.toString() || '';
  if (secondToLast === '--id') {
    searchingId = last;
  } else if (last.includes('--id=')) {
    // Debería ser startsWith y luego un substring
    const parts = last.split('--id=');
    searchingId = parts[parts.length - 1];
  }
  if (secondToLast.startsWith('--') && secondToLast.endsWith('_id')) {
    searchingId = last;
  } else if (secondToLast.startsWith('--') && last.includes('_id=')) {
    const parts = last.split('_id=');
    searchingId = parts[parts.length - 1];
  }

  return searchingId;
};

export const customCompleter: Completer = (line) => {
  if (line.length < 3) {
    return [[], line];
  }

  const searchingId = getLastId(line);
  if (
    searchingId === undefined ||
    searchingId === '' ||
    searchingId.length < 3
  ) {
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
