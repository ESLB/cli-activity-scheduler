import { ArgumentsCamelCase, CommandModule } from 'yargs';
import {
  addSpentTimeService,
  generateItineraryService,
} from '../../services/schedule.service';
import { IntegerValueObject } from '../../../../contexts/scheduler/domain/valueObject/integer.valueObject';
import { printItineraryActivities } from './getItinerary.command';

export const addSpentTimeCommand = {
  command: 'spend',
  describe: 'Create activity',
  builder: {
    t: {
      describe: 'Tiempo ya utilizado en la tarea',
      demandOption: true,
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const spentTime = argv.t as number;

    addSpentTimeService.execute(new IntegerValueObject(spentTime));

    printItineraryActivities(generateItineraryService.execute());
  },
} satisfies CommandModule;
