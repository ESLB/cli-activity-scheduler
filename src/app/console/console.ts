import yargs, { exitProcess } from 'yargs';
import readline from 'readline';
import { CommandInjector } from './commands';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let circuitBreaker = { continue: true, showErrorMessage: true };

const yarg = yargs().fail((msg, err, yargs) => {
  if (circuitBreaker.showErrorMessage) {
    console.log(yargs.help());
    console.log(msg);
  }
  circuitBreaker.showErrorMessage = false;
  circuitBreaker.continue = false;
});

new CommandInjector(circuitBreaker).execute(yarg);

function executeCommand(input: string) {
  yarg.parse(input.trim().split(' '));
}

const resetCircuitBreaker = () => {
  circuitBreaker.continue = true;
  circuitBreaker.showErrorMessage = true;
};

const promp = () => {
  rl.question('> ', (input) => {
    if (input.toLowerCase() === 'exit') {
      return rl.close();
    }
    executeCommand(input);
    resetCircuitBreaker();
    promp();
  });
};

export function startREPL() {
  promp();
}

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
