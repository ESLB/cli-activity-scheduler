import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { MarkdownActivityParser } from '../../../../contexts/scheduler/infrastructure/parser/markdownActivityParser';
import { BlockedTimeParser } from '../../../../contexts/scheduler/infrastructure/parser/blockedTimeParser';
import { CreateActivitiesFromMarkdownService } from '../../../../contexts/scheduler/application/activity/createActivitiesFromMarkdown.service';
import { CreateItinerary3 } from '../../../../contexts/scheduler/domain/service/createItinerary3.service';
import { printItineraryWithBlocks } from './printItinerary';

const activityParser = new MarkdownActivityParser();
const blockedTimeParser = new BlockedTimeParser();
const createActivitiesService = new CreateActivitiesFromMarkdownService();
const createItineraryService = new CreateItinerary3();

const printErrors = (
  errors: { lineNumber: number; message: string; rawLine: string }[],
) => {
  console.log('\n❌ Error parsing activities.md:\n');
  errors.forEach((error) => {
    console.log(`Line ${error.lineNumber}: ${error.message}`);
    if (error.rawLine) {
      console.log(`  → ${error.rawLine}`);
    }
    console.log('');
  });
};

const calculateEnergyConsumption = (
  activities: { energyLevel: { value: number }; duration: { value: number } }[],
): number => {
  return activities.reduce((total, activity) => {
    const energySpent = activity.energyLevel.value * (activity.duration.value / 60);
    return total + energySpent;
  }, 0);
};

const printEnergySummary = (
  totalEnergySpent: number,
  availableEnergy?: number,
) => {
  console.log('══════════════════════════════════');
  if (availableEnergy !== undefined) {
    console.log(`Energía disponible: ${availableEnergy}`);
  }
  console.log(`Energía total gastada: ${totalEnergySpent.toFixed(2)}`);
  if (availableEnergy !== undefined) {
    const balance = availableEnergy - totalEnergySpent;
    const balanceSign = balance >= 0 ? '+' : '';
    const balanceEmoji = balance >= 0 ? '✓' : '✗';
    console.log(`Balance: ${balanceSign}${balance.toFixed(2)} ${balanceEmoji}`);
    if (balance >= 0) {
      console.log('Te sobra energía');
    } else {
      console.log('Te falta energía');
    }
  }
  console.log('══════════════════════════════════');
};

export const newItineraryCommand = {
  command: 'newItinerary',
  describe: 'Generate itinerary from activities.md file',
  builder: {
    t: {
      describe: 'Hora de inicio (en horas, ej: 8.5 para 8:30 AM)',
      demandOption: false,
      type: 'number',
    },
    e: {
      describe: 'Energía disponible',
      demandOption: false,
      type: 'number',
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    console.clear();

    // Parse activities file
    const parseResult = activityParser.parse();

    if (!parseResult.success) {
      printErrors(parseResult.errors);
      return;
    }

    // Parse blocked times file
    const blockedTimeResult = blockedTimeParser.parse();

    if (!blockedTimeResult.success) {
      console.log('\n❌ Error parsing blocked-times.md:\n');
      blockedTimeResult.errors.forEach((error) => {
        console.log(`Line ${error.lineNumber}: ${error.message}`);
        if (error.rawLine) {
          console.log(`  → ${error.rawLine}`);
        }
        console.log('');
      });
      return;
    }

    // Convert to Activity entities
    const activities = createActivitiesService.execute(parseResult.activities);

    if (activities.length === 0) {
      console.log('\n⚠️  No activities found in activities.md\n');
      return;
    }

    // Generate itinerary with blocked times
    const startTimeHour = argv.t as number | undefined;
    const itinerary = createItineraryService.execute(
      activities,
      blockedTimeResult.blockedTimes,
      startTimeHour,
    );

    // Print itinerary
    printItineraryWithBlocks(itinerary);

    // Calculate and print energy summary
    const totalEnergySpent = calculateEnergyConsumption(activities);
    const availableEnergy = argv.e as number | undefined;
    printEnergySummary(totalEnergySpent, availableEnergy);
  },
} satisfies CommandModule;
