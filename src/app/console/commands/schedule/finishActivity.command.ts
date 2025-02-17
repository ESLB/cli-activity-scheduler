import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { finishActivityService } from '../../services/schedule.service';
import { IdValueObject } from '../../../../contexts/scheduler/domain/valueObject/id.valueObject';

export const finishActivityCommand = {
  command: 'finish',
  describe: 'Create activity',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;

    finishActivityService.execute(new IdValueObject(id));

    console.log('Actividad finalizada');
  },
} satisfies CommandModule;
