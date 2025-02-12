import fs from 'fs';
import {
  Activity,
  ActivityPrimitivies,
} from '../../domain/entity/activity.entity';
import {
  ActivityRepository,
  GetActivitiesQuery,
} from '../../domain/repository/activity.repository';
import path from 'path';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';

export class ActivityTextRepository implements ActivityRepository {
  private filePath = path.resolve(__dirname, 'data.json');

  public saveActivities(activities: Activity[]): void {
    this.saveActivitiesJSON(activities.map((i) => i.values));
  }

  public getActivities(query: GetActivitiesQuery): Activity[] {
    const activitiesJSON = this.getActivitiesJSON({ current: undefined });
    return activitiesJSON.map((i) => Activity.fromPrimities(i));
  }

  public getActivity(id: IdValueObject): Activity | undefined {
    const activities = this.getActivitiesJSON({ current: undefined });
    const activityJSON = activities.find((i) => i.id === id.value);
    if (activityJSON === undefined) {
      return undefined;
    }
    return Activity.fromPrimities(activityJSON);
  }

  private saveActivitiesJSON(activities: ActivityPrimitivies[]): void {
    const savedActivies = this.getActivitiesJSON({ current: undefined });
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

  private getActivitiesJSON(query: GetActivitiesQuery): ActivityPrimitivies[] {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as ActivityPrimitivies[];
  }
}
