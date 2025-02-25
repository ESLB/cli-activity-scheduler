import yargs, { ArgumentsCamelCase, Argv, command, CommandModule } from 'yargs';
import readline from 'readline';
import { commands } from './commands/';
import { parse } from 'shell-quote';
import { customCompleter } from './customCompleter.readline';

export type CircuiteBreaker = { continue: boolean; showErrorMessage: boolean };

export class App {
  private readonly lineReader;
  private yarg: Argv;
  private readonly circuitBreaker: CircuiteBreaker;

  constructor() {
    this.lineReader = readline
      .createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: customCompleter,
      })
      .on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
      });
    this.circuitBreaker = {
      continue: true,
      showErrorMessage: true,
    };
    this.yarg = yargs();
    this.setUpYargs();
  }

  private setUpYargs() {
    this.setCommands(commands);
    this.setFailureHandler();
  }

  private resetYarg() {
    this.yarg = yargs();
    this.setUpYargs();
  }

  private setCommands(commands: CommandModule[]) {
    commands.forEach((c) => {
      this.yarg.command(injectCircuiteBreaker(c, this.circuitBreaker));
    });
  }

  private setFailureHandler() {
    this.yarg.fail((msg, err, yargs) => {
      if (this.circuitBreaker.showErrorMessage) {
        console.log(yargs.help());
        console.log(msg);
      }
      this.circuitBreaker.showErrorMessage = false;
      this.circuitBreaker.continue = false;
    });
  }

  private promp() {
    this.lineReader.question('> ', (input) => {
      if (input.toLowerCase() === 'exit') {
        return this.lineReader.close();
      }
      this.executeCommand(input);
      this.promp();
    });
  }

  private executeCommand(input: string) {
    try {
      const args = parse(input);
      this.yarg.parse(args.map((i) => i.toString()));
      this.resetCircuitBreaker();
    } catch (error: any) {
      this.resetYarg();
      if ('message' in error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  }

  private resetCircuitBreaker() {
    this.circuitBreaker.continue = true;
    this.circuitBreaker.showErrorMessage = true;
  }

  public start(): void {
    console.log('Welcome to the REPL! Type "exit" to quit.');
    this.promp();
  }
}

export const injectCircuiteBreaker = (
  commandModule: CommandModule,
  circuiteBreaker: CircuiteBreaker,
) => {
  const { handler, ...others } = commandModule;
  const injectedHandler = (argv: ArgumentsCamelCase) => {
    if (!circuiteBreaker.continue) return;
    commandModule.handler(argv);
  };
  return {
    ...others,
    handler: injectedHandler,
  };
};
