import { ArgumentsCamelCase, CommandModule } from 'yargs';

export const greetingCommand = {
  command: 'hi',
  describe: 'Greet the user',
  handler: (argv: ArgumentsCamelCase) => {
    console.log(`< Hola, ¿qué desea hacer hoy?`);
  },
} satisfies CommandModule;
