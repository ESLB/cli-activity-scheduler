import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { removeActivityFromSchedule } from '../../services/schedule.service';
import { IntegerValueObject } from '../../../../contexts/scheduler/domain/valueObject/integer.valueObject';

export const removeActivityFromScheduleCommand = {
  command: 'schrm',
  describe: 'Remove last activity from schedule',
  builder: {
    p: {
      describe: 'Posición',
      demandOption: true,
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const position = argv.p as number;

    removeActivityFromSchedule.execute(new IntegerValueObject(position));

    console.log('Última actividad removida');
  },
} satisfies CommandModule;
