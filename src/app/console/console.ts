import yargs, { exitProcess } from 'yargs';
import readline from 'readline';
import { CommandInjector } from './commands';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let circuitBreaker = { continue: true, showErrorMessage: true };

const yarg = yargs()
  .fail((msg, err, yargs) => {
    // Just don't throw
    if (circuitBreaker.showErrorMessage) {
      console.log(yargs.help());
      console.log(msg);
    }
    circuitBreaker.showErrorMessage = false;
    circuitBreaker.continue = false;
  })
  .help();

new CommandInjector(circuitBreaker, yarg).execute(yarg);

// addCommands(yarg, circuitBreaker);

function executeCommand(input: string) {
  yarg.parse(input.split(' ').filter((i) => i !== ''));
}

export function startREPL() {
  rl.question('> ', (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    try {
      executeCommand(input);
    } catch (error) {
      console.log(error);
    } finally {
      circuitBreaker.continue = true;
      circuitBreaker.showErrorMessage = true;
      startREPL();
    }
  });
}

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
