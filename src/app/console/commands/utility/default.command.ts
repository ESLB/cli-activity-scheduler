import { CommandModule } from 'yargs';

export const defaultCommand = {
  command: '*',
  describe: 'Default command',
  handler() {
    console.log('< Not recognized command');
  },
} satisfies CommandModule;
