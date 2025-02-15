import { CommandModule, ArgumentsCamelCase } from 'yargs';
import { ActivityTextRepository } from '../../contexts/scheduler/infrastructure/repository/activityText.repository';
import { ListActivitiesService } from '../../contexts/scheduler/application/listActivities.service';
import { CreateActivityService } from '../../contexts/scheduler/application/createActivity.service';
import { PatchActivityService } from '../../contexts/scheduler/application/patchActivity.service';
import { GetMatchingIdsService } from '../../contexts/scheduler/application/getMatchingIds.service';
import { IdTextRepository } from '../../contexts/scheduler/infrastructure/repository/idText.repository';
import type { Completer } from 'readline';
import { GetActivityById } from '../../contexts/scheduler/application/getActivityById.service';
import { parse } from 'shell-quote';
import { ActivityPrimitivies } from '../../contexts/scheduler/domain/entity/activity.entity';

const activityTextRepository = new ActivityTextRepository();
const listActivitiesService = new ListActivitiesService(activityTextRepository);
const createActivityService = new CreateActivityService(activityTextRepository);
const patchActivityService = new PatchActivityService(activityTextRepository);
const findActivityService = new GetActivityById(activityTextRepository);
const idTextRepository = new IdTextRepository();
const getMatchingIdsService = new GetMatchingIdsService(idTextRepository);

const addWithNewLine = (target: string, payload: string | boolean | number) => {
  return target + payload + '\n';
};

const addFieldIfAvailable = (
  target: string,
  payload: Record<string, any>,
  field: string,
) => {
  const availableTypes = ['string', 'boolean', 'number'];
  if (field in payload && availableTypes.includes(typeof payload[field])) {
    const value =
      field === 'id' ? payload[field].substring(0, 13) : payload[field];
    const withPrefix = `  ${field}: ${value}`;
    return addWithNewLine(target, withPrefix);
  } else {
    return target;
  }
};

const noEndingCharacters = ['\n', '-'];

const getCleanText = (text: string) => {
  let last = text[text.length - 1];
  while (noEndingCharacters.includes(last)) {
    text = text.substring(0, text.length - 1);
    last = text[text.length - 1];
  }

  return text + '\n';
};

const displaySimpleActivities = (activities: ActivityPrimitivies[]) => {
  let text = '';
  for (const activity of activities) {
    text = addFieldIfAvailable(text, activity, 'id');
    text = addFieldIfAvailable(text, activity, 'name');
    text = addWithNewLine(text, '');
  }
  text = getCleanText(text);
  console.log(text);
};

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

export const commands: CommandModule[] = [];

const setDependencyCommand = {
  command: 'sd',
  describe: 'Set dependency on activity',
  builder: {
    t_id: {
      describe: 'Target activity Id',
      type: 'string',
      demandOption: true,
    },
    p_id: {
      describe: 'Predecessor activity Id',
      type: 'string',
      demandOption: true,
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const t_id = argv.t_id as string;
    const p_id = argv.p_id as string;

    console.log({ t_id, p_id });
  },
} satisfies CommandModule;

const listActivitiesCommand = {
  command: 'list',
  describe: 'List activities',
  handler: () => {
    const activities = listActivitiesService.execute().map((i) => i.values);
    displaySimpleActivities(activities);
  },
} satisfies CommandModule;

const findActivityCommand = {
  command: 'find',
  describe: 'Find activity by Id',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;

    console.log(findActivityService.execute(id).values);
  },
} satisfies CommandModule;

const greeting = {
  command: 'hi',
  describe: 'Greet the user',
  handler: (argv: ArgumentsCamelCase) => {
    console.log(`< Hola, ¿qué desea hacer hoy?`);
  },
} satisfies CommandModule;

const createActivityCommand = {
  command: 'create',
  describe: 'Create activity',
  builder: {
    n: {
      describe: 'First number',
      demandOption: true,
      type: 'string',
    },
    d: {
      describe: 'Second number',
      demandOption: true,
      type: 'number',
    },
    r: {
      describe: 'Second number',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const name = argv.n as string;
    const duration = argv.d as number;
    const rest = argv.r as boolean;

    console.log({
      name,
      duration,
      doesNeedRestAfter: rest,
    });

    createActivityService.execute({
      name,
      duration,
      doesNeedRestAfter: rest,
    });

    console.log('Creado correctamente');
  },
} satisfies CommandModule;

const patchActivityCommand = {
  command: 'update',
  describe: 'Update activity',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
    n: {
      describe: 'First number',
      type: 'string',
    },
    d: {
      describe: 'Second number',
      type: 'number',
    },
    r: {
      describe: 'Second number',
      type: 'boolean',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;

    console.log({
      id,
    });

    patchActivityService.execute({
      id,
    });

    console.log('Actualizado correctamente');
  },
} satisfies CommandModule;

const add = {
  command: 'add',
  describe: 'Add two numbers',
  builder: {
    a: {
      describe: 'First number',
      demandOption: true,
      type: 'number',
    },
    b: {
      describe: 'Second number',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv: ArgumentsCamelCase) {
    const a = argv.a as number;
    const b = argv.b as number;
    console.log(`< La suma de ${a} y ${b} es ${a + b}`);
  },
} satisfies CommandModule;

const clear = {
  command: 'clear',
  describe: 'Clear console',
  handler() {
    console.clear();
  },
} satisfies CommandModule;

const defaultCommand = {
  command: '*',
  describe: 'Default command',
  handler() {
    console.log('< Not recognized command');
  },
} satisfies CommandModule;

commands.push(
  greeting,
  add,
  clear,
  defaultCommand,
  listActivitiesCommand,
  createActivityCommand,
  patchActivityCommand,
  findActivityCommand,
  setDependencyCommand,
);
