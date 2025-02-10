import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { input } from '@inquirer/prompts';
import { CreateActivityService } from './application/createActivity.service';
import { ListActivitiesService } from './application/listActivities.service';
import { ActivityTextRepository } from './infrastructure/repository/activityText.repository';

const activityTextRepository = new ActivityTextRepository();
const listActivities = new ListActivitiesService(activityTextRepository);
const createActivity = new CreateActivityService(activityTextRepository);

// listActivities.execute();
// console.log('saving new activity');
// createActivity.execute({
//   name: 'Nueva actividad',
//   duration: 19,
//   doesNeedRestAfter: true,
//   timeAlreadySpent: 0,
//   finished: false,
// });

// yargs(hideBin(process.argv));

// yargs.version('1.1.0');

// const ask = async () => {
//   const answer = await input({ message: 'Enter you name:' });
//   const answer1 = await input({ message: 'Enter you name:' });
//   const answer2 = await input({ message: 'Enter you name:' });
//   const answer3 = await input({ message: 'Enter you name:' });
//   const answer4 = await input({ message: 'Enter you name:' });

//   console.log('this is you name: ' + answer);

//   ask();
// };

// ask();

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const yarg = yargs()
  .fail((msg, err, yargs) => {
    console.error(msg || err.message);
    yargs.showHelpOnFail(true);
  })
  .command({
    command: 'greet <name>',
    describe: 'Greet the user',
    builder: {
      name: {
        describe: 'Your name',
        demandOption: true,
        type: 'string',
      },
    },
    handler(argv) {
      console.log(`< Hola ${argv.name}`);
    },
  })
  .command({
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
    handler(argv) {
      const { a, b } = argv;
      console.log(`< La suma de ${a} y ${b} es ${a + b}`);
    },
  })
  .command({
    command: 'clear',
    describe: 'Clear console',
    handler() {
      console.clear();
    },
  })
  .command('*', 'default command', () => {
    console.log('< Not recognized command');
  })
  .help();

// Function to parse and execute commands
function executeCommand(input: string) {
  yarg.parse(input.split(' '));
}

function startREPL() {
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
      startREPL();
    }
  });
}

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});

console.log('Welcome to the REPL! Type "exit" to quit.');
startREPL();

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
