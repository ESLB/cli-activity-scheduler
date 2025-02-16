import { CreateActivityService } from '../../../contexts/scheduler/application/createActivity.service';
import { GetActivityById } from '../../../contexts/scheduler/application/getActivityById.service';
import { GetMatchingIdsService } from '../../../contexts/scheduler/application/getMatchingIds.service';
import { ListActivitiesService } from '../../../contexts/scheduler/application/listActivities.service';
import { PatchActivityService } from '../../../contexts/scheduler/application/patchActivity.service';
import { SetDependencyService } from '../../../contexts/scheduler/application/setDependency.service';
import { ActivityTextRepository } from '../../../contexts/scheduler/infrastructure/repository/activityText.repository';
import { IdTextRepository } from '../../../contexts/scheduler/infrastructure/repository/idText.repository';

export const activityTextRepository = new ActivityTextRepository();
export const listActivitiesService = new ListActivitiesService(
  activityTextRepository,
);
export const createActivityService = new CreateActivityService(
  activityTextRepository,
);
export const patchActivityService = new PatchActivityService(
  activityTextRepository,
);
export const findActivityService = new GetActivityById(activityTextRepository);
export const setDependencyService = new SetDependencyService(
  activityTextRepository,
);
export const idTextRepository = new IdTextRepository();
export const getMatchingIdsService = new GetMatchingIdsService(
  idTextRepository,
);
