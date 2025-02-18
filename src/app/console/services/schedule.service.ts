import { AddActivityService } from '../../../contexts/scheduler/application/schedule/addActivity.service';
import { AddSpentTimeService } from '../../../contexts/scheduler/application/schedule/addSpentTime.service';
import { FinishActivityService } from '../../../contexts/scheduler/application/schedule/finishActivity.service';
import { FlushActivitiesService } from '../../../contexts/scheduler/application/schedule/flushActivities.service';
import { GenerateItinerary } from '../../../contexts/scheduler/application/schedule/generateItinerary.service';
import { GetScheduleService } from '../../../contexts/scheduler/application/schedule/getSchedule.service';
import { GetScheduleDetailService } from '../../../contexts/scheduler/application/schedule/getScheduleDetail.service';
import { RemoveLastActivityService } from '../../../contexts/scheduler/application/schedule/removeLastActivity.service';
import { CreateItinerary } from '../../../contexts/scheduler/domain/service/createItinerary.service';
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
export const generateItineraryService = new GenerateItinerary(
  scheduleTextRepository,
  activityTextRepository,
  new CreateItinerary(),
);
export const finishActivityService = new FinishActivityService(
  scheduleTextRepository,
  activityTextRepository,
);
export const addSpentTimeService = new AddSpentTimeService(
  scheduleTextRepository,
  activityTextRepository,
);
