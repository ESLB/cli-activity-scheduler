import fs from 'fs';
import { Activity } from '../../domain/entity/activity.entity';
import {
  ActivityRepository,
  GetActivitiesQuery,
} from '../../domain/repository/activity.repository';
import path from 'path';

export class ActivityTextRepository implements ActivityRepository {
  private filePath = path.resolve(__dirname, 'data.json');

  saveActivities(activities: Activity[]): void {
    const savedActivies = this.getActivities({ current: undefined });
    for (const activity of activities) {
      const index = savedActivies.findIndex((i) => i.id === activity.id);
      if (index === -1) {
        savedActivies.push(activity);
        continue;
      }
      if (index) {
        const found = savedActivies[index];
        if (found._v !== activity._v) {
          throw Error(`Version mismatch`);
        }
        savedActivies.splice(index, 1, {
          ...activity,
          id: activity.id,
          _v: found._v + 1,
        });
      }
    }
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(savedActivies, null, 2),
      'utf-8',
    );
  }

  getActivities(query: GetActivitiesQuery): Activity[] {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as Activity[];
  }
}
