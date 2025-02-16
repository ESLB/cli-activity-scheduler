import { CommandModule } from 'yargs';

export const clearCommand = {
  command: 'clear',
  describe: 'Clear console',
  handler() {
    console.clear();
  },
} satisfies CommandModule;
