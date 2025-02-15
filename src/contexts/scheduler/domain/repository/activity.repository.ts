import { Activity } from '../entity/activity.entity';
import { IdValueObject } from '../valueObject/id.valueObject';

export interface GetActivitiesQuery {
  current?: boolean | undefined;
  id?: IdValueObject;
}

export interface ActivityRepository {
  saveActivities(activities: Activity[]): void;
  getActivity(id: IdValueObject): Activity | undefined;
  getActivities(query: GetActivitiesQuery): Activity[];
  getPredecessors(id: IdValueObject): Activity[];
}
