import { CommandModule, ArgumentsCamelCase } from 'yargs';
import { ActivityTextRepository } from '../../contexts/scheduler/infrastructure/repository/activityText.repository';
import { ListActivitiesService } from '../../contexts/scheduler/application/listActivities.service';
import { CreateActivityService } from '../../contexts/scheduler/application/createActivity.service';
import { PatchActivityService } from '../../contexts/scheduler/application/patchActivity.service';
import { GetMatchingIdsService } from '../../contexts/scheduler/application/getMatchingIds.service';
import { IdTextRepository } from '../../contexts/scheduler/infrastructure/repository/idText.repository';
import type { Completer } from 'readline';
import { GetActivityById } from '../../contexts/scheduler/application/getActivityById.service';

const activityTextRepository = new ActivityTextRepository();
const listActivitiesService = new ListActivitiesService(activityTextRepository);
const createActivityService = new CreateActivityService(activityTextRepository);
const patchActivityService = new PatchActivityService(activityTextRepository);
const findActivityService = new GetActivityById(activityTextRepository);
const idTextRepository = new IdTextRepository();
const getMatchingIdsService = new GetMatchingIdsService(idTextRepository);
export const customCompleter: Completer = (line) => {
  const matchingIds = getMatchingIdsService.execute(line);
  return [matchingIds.map((i) => i.value), line];
};

export const commands: CommandModule[] = [];

const listActivitiesCommand = {
  command: 'list',
  describe: 'List activities',
  handler: () => {
    const activities = listActivitiesService.execute().map((i) => i.values);
    console.log(JSON.stringify(activities, null, 2));
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

    console.log({
      id,
    });

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
);
