import { AddActivityService } from '../../../contexts/scheduler/application/schedule/addActivity.service';
import { AddSpentTimeService } from '../../../contexts/scheduler/application/schedule/addSpentTime.service';
import { FinishActivityService } from '../../../contexts/scheduler/application/schedule/finishActivity.service';
import { FlushActivitiesService } from '../../../contexts/scheduler/application/schedule/flushActivities.service';
import { GenerateItinerary } from '../../../contexts/scheduler/application/schedule/generateItinerary.service';
import { GenerateItinerary2 } from '../../../contexts/scheduler/application/schedule/generateItinerary2.service';
import { GetScheduleService } from '../../../contexts/scheduler/application/schedule/getSchedule.service';
import { GetScheduleDetailService } from '../../../contexts/scheduler/application/schedule/getScheduleDetail.service';
import { RemoveActivityFromScheduleService } from '../../../contexts/scheduler/application/schedule/removeActivityFromSchedule.service';
import { CreateItinerary } from '../../../contexts/scheduler/domain/service/createItinerary.service';
import { CreateItinerary2 } from '../../../contexts/scheduler/domain/service/createItinerary2.service';
import { ValidateScheduleIntegrity } from '../../../contexts/scheduler/domain/service/validateScheduleIntegrity.service';
import { ScheduleTextRepository } from '../../../contexts/scheduler/infrastructure/repository/scheduleText.repository';
import { activityTextRepository } from './activity.service';

export const scheduleTextRepository = new ScheduleTextRepository();
const validateScheduleIntegrityService = new ValidateScheduleIntegrity(
  activityTextRepository,
);
export const addActivityService = new AddActivityService(
  scheduleTextRepository,
  activityTextRepository,
  validateScheduleIntegrityService,
);
export const getScheduleService = new GetScheduleService(
  scheduleTextRepository,
);
export const removeActivityFromSchedule = new RemoveActivityFromScheduleService(
  scheduleTextRepository,
  validateScheduleIntegrityService,
);
export const flushActivitiesService = new FlushActivitiesService(
  scheduleTextRepository,
);
export const getScheduleDetailService = new GetScheduleDetailService(
  scheduleTextRepository,
  activityTextRepository,
);
export const generateItineraryService = new GenerateItinerary2(
  scheduleTextRepository,
  activityTextRepository,
  new CreateItinerary2(),
);
export const finishActivityService = new FinishActivityService(
  scheduleTextRepository,
  activityTextRepository,
);
export const addSpentTimeService = new AddSpentTimeService(
  scheduleTextRepository,
  activityTextRepository,
);
