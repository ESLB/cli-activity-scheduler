import fs from 'fs';
import { ActivityPrimitivies } from '../../domain/entity/activity.entity';
import path from 'path';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';
import { IdRepository } from '../../domain/repository/id.repository';

export class IdTextRepository implements IdRepository {
  private filePath = path.resolve(__dirname, 'data.json');

  public getMatchingId(firstLetters: string): IdValueObject[] {
    const activities = this.getActivitiesJSON();

    return activities
      .filter((i) => i.id.startsWith(firstLetters))
      .map((i) => new IdValueObject(i.id));
  }

  private getActivitiesJSON(): ActivityPrimitivies[] {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as ActivityPrimitivies[];
  }
}
