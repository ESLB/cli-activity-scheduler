import { Activity } from '../entity/activity.entity';

export interface GetActivitiesQuery {
  current: boolean | undefined;
}

export interface ActivityRepository {
  saveActivities(activities: Activity[]): void;
  getActivities(query: GetActivitiesQuery): Activity[];
}
