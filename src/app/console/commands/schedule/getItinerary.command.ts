import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { generateItineraryService } from '../../services/schedule.service';

export const getItineraryCommand = {
  command: 'it',
  describe: 'Print itinerary',
  builder: {},
  handler: (argv: ArgumentsCamelCase) => {
    console.log(JSON.stringify(generateItineraryService.execute(), null, 2));
  },
} satisfies CommandModule;
