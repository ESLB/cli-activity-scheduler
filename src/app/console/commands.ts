import { CommandModule, ArgumentsCamelCase } from 'yargs';
import { ActivityTextRepository } from '../../infrastructure/repository/activityText.repository';
import { ListActivitiesService } from '../../application/listActivities.service';

const activityTextRepository = new ActivityTextRepository();
const listActivities = new ListActivitiesService(activityTextRepository);

export const commands: CommandModule[] = [];

const list = {
  command: 'list',
  describe: 'List activities',
  handler: () => {
    const activities = listActivities.execute();
    console.log(JSON.stringify(activities, null, 2));
  },
} satisfies CommandModule;

const greeting = {
  command: 'hi',
  describe: 'Greet the user',
  handler: (argv: ArgumentsCamelCase) => {
    console.log(`< Hola, ¿qué desea hacer hoy?`);
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

commands.push(greeting, add, clear, defaultCommand, list);
