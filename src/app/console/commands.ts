import { CommandModule, ArgumentsCamelCase } from 'yargs';

export const commands: CommandModule[] = [];

const greeting = {
  command: 'greet <name>',
  describe: 'Greet the user',
  builder: {
    name: {
      describe: 'Your name',
      demandOption: true,
      requiresArg: true,
      type: 'string',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    console.log(`< Hola ${argv.name}`);
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

commands.push(greeting, add, clear, defaultCommand);
