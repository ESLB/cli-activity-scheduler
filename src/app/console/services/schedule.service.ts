import { AddActivityService } from '../../../contexts/scheduler/application/schedule/addActivity.service';
import { FlushActivitiesService } from '../../../contexts/scheduler/application/schedule/flushActivities.service';
import { GetScheduleService } from '../../../contexts/scheduler/application/schedule/getSchedule.service';
import { GetScheduleDetailService } from '../../../contexts/scheduler/application/schedule/getScheduleDetail.service';
import { RemoveLastActivityService } from '../../../contexts/scheduler/application/schedule/removeLastActivity.service';
import { ScheduleTextRepository } from '../../../contexts/scheduler/infrastructure/repository/scheduleText.repository';
import { activityTextRepository } from './activity.service';

export const scheduleTextRepository = new ScheduleTextRepository();
export const addActivityService = new AddActivityService(
  scheduleTextRepository,
  activityTextRepository,
);
export const getScheduleService = new GetScheduleService(
  scheduleTextRepository,
);
export const removeLastActivityService = new RemoveLastActivityService(
  scheduleTextRepository,
);
export const flushActivitiesService = new FlushActivitiesService(
  scheduleTextRepository,
);
export const getScheduleDetailService = new GetScheduleDetailService(
  scheduleTextRepository,
  activityTextRepository,
);
