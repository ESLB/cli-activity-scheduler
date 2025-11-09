import { Activity } from '../../domain/entity/activity.entity';
import { ParsedActivityLine } from '../../domain/types/parsedActivity.type';
import { StringValueObject } from '../../domain/valueObject/string.valueObject';
import { IntegerValueObject } from '../../domain/valueObject/integer.valueObject';

export class CreateActivitiesFromMarkdownService {
  execute(parsedLines: ParsedActivityLine[]): Activity[] {
    return parsedLines.map((line) => this.createActivity(line));
  }

  private createActivity(parsedLine: ParsedActivityLine): Activity {
    const name = new StringValueObject(
      `${parsedLine.topic}: ${parsedLine.title}`,
    );
    const duration = new IntegerValueObject(parsedLine.durationMinutes);
    const description = parsedLine.description
      ? new StringValueObject(parsedLine.description)
      : new StringValueObject('');
    const energyLevel = new IntegerValueObject(parsedLine.energyLevel);
    const preparationTime = parsedLine.preparationTime
      ? new IntegerValueObject(parsedLine.preparationTime)
      : new IntegerValueObject(0);
    const restTime = parsedLine.restTime
      ? new IntegerValueObject(parsedLine.restTime)
      : new IntegerValueObject(0);

    return Activity.create({
      name,
      duration,
      description,
      energyLevel,
      preparationTime,
      restTime,
    });
  }
}
