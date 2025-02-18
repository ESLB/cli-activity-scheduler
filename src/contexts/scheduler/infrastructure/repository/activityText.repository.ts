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
  private filePath = path.resolve(__dirname, '../../../../../activities.json');

  constructor() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  public saveActivities(activities: Activity[]): void {
    this.saveActivitiesJSON(activities.map((i) => i.values));
  }

  public getActivities(query: GetActivitiesQuery): Activity[] {
    const activitiesJSON = this.getActivitiesJSON(query);
    const selectedActivities: ActivityPrimitivies[] = [];

    const queryId = query.id;
    const queryIds = query.ids;

    if (queryId !== undefined) {
      const found = activitiesJSON.find((i) => i.id === queryId.value);
      if (found) {
        selectedActivities.push(found);
      }
    } else if (queryIds !== undefined) {
      const values = queryIds.map((i) => i.value);
      const found = activitiesJSON.filter((i) => values.includes(i.id));
      selectedActivities.push(...found);
    } else {
      selectedActivities.push(...activitiesJSON);
    }

    return selectedActivities
      .filter(
        (i) => query.current === undefined || !i.finished === query.current,
      )
      .map((i) => Activity.fromPrimities(i));
  }

  public getActivity(id: IdValueObject): Activity | undefined {
    const activities = this.getActivitiesJSON({ current: undefined });
    const activityJSON = activities.find((i) => i.id === id.value);
    if (activityJSON === undefined) {
      return undefined;
    }
    return Activity.fromPrimities(activityJSON);
  }

  public getPredecessors(id: IdValueObject): Activity[] {
    const jsonActivities = this.getActivitiesJSON({});
    const rootActivity = jsonActivities.find((i) => i.id === id.value);
    if (rootActivity === undefined) {
      return [];
    }
    const allPredecessors: ActivityPrimitivies[] = [];
    let predecessorIds: string[] = rootActivity.predecessors;
    let predecessorActivities = [];
    while (predecessorIds.length > 0) {
      predecessorActivities = jsonActivities.filter((i) =>
        predecessorIds.includes(i.id),
      );
      allPredecessors.push(...predecessorActivities);
      predecessorIds = predecessorActivities.flatMap((i) => i.predecessors);
    }
    return allPredecessors.map((i) => Activity.fromPrimities(i));
  }

  private saveActivitiesJSON(activities: ActivityPrimitivies[]): void {
    const savedActivies = this.getActivitiesJSON({ current: undefined });
    for (const activity of activities) {
      const index = savedActivies.findIndex((i) => i.id === activity.id);
      if (index === -1) {
        savedActivies.push(activity);
        continue;
      } else {
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
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    const primitiveActivities = JSON.parse(raw) as ActivityPrimitivies[];
    primitiveActivities.forEach((i) => {
      if (i.predecessors === undefined || i.predecessors === null) {
        i.predecessors = [];
      }
      if (i.restTime === undefined) {
        i.restTime = 0;
      }
      if (i.description === undefined) {
        i.description = '';
      }
      if (i.preparationTime === undefined) {
        i.preparationTime = 0;
      }
    });

    return primitiveActivities;
  }
}
