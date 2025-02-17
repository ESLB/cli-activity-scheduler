import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { addActivityService } from '../../services/schedule.service';
import { IdValueObject } from '../../../../contexts/scheduler/domain/valueObject/id.valueObject';

export const addActivityCommand = {
  command: 'schadd',
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

    addActivityService.execute(new IdValueObject(id));

    console.log('Añadido correctamente al horario');
  },
} satisfies CommandModule;
