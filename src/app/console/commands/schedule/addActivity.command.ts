import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { addActivityService } from '../../services/schedule.service';
import { IdValueObject } from '../../../../contexts/scheduler/domain/valueObject/id.valueObject';
import { IntegerValueObject } from '../../../../contexts/scheduler/domain/valueObject/integer.valueObject';

export const addActivityCommand = {
  command: 'schadd',
  describe: 'Create activity',
  builder: {
    id: {
      describe: 'Id',
      type: 'string',
      demandOption: true,
    },
    p: {
      describe: 'Posición',
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const id = argv.id as string;
    const position = argv.p as number;

    addActivityService.execute(
      new IdValueObject(id),
      position !== undefined ? new IntegerValueObject(position) : position,
    );

    console.log('Añadido correctamente al horario');
  },
} satisfies CommandModule;
