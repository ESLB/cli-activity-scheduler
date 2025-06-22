import { CommandModule } from 'yargs';
import { createActivityCommand } from './activity/createActivity.command';
import { findActivityCommand } from './activity/findActivity.command';
import { listActivitiesCommand } from './activity/listActivities.command';
import { clearCommand } from './utility/clear.command';
import { defaultCommand } from './utility/default.command';
import { greetingCommand } from './utility/greeting.command';
import { patchActivityCommand } from './activity/patchActivity.command';
import { setDependencyCommand } from './activity/setDependency.command';
import { addActivityCommand } from './schedule/addActivity.command';
import { getScheduleCommand } from './schedule/getSchedule.command';
import { removeActivityFromScheduleCommand } from './schedule/removeActivityFromSchedule.command';
import { flushActivitiesCommand } from './schedule/flushActivities.command';
import { getItineraryCommand } from './schedule/getItinerary.command';
import { finishActivityCommand } from './schedule/finishActivity.command';
import { addSpentTimeCommand } from './schedule/addSpentTime.command';
import { setEnergyValuesCommand } from './energy/setEnergyValues.command';
import { viewEnergyValuesCommand } from './energy/viewEnergyValues.command';
import { spendEnergyCommand } from './energy/spendEnergy.command';

export const commands = [
  clearCommand,
  createActivityCommand,
  defaultCommand,
  findActivityCommand,
  greetingCommand,
  listActivitiesCommand,
  patchActivityCommand,
  setDependencyCommand,
  addActivityCommand,
  getScheduleCommand,
  removeActivityFromScheduleCommand,
  flushActivitiesCommand,
  getItineraryCommand,
  finishActivityCommand,
  addSpentTimeCommand,
  setEnergyValuesCommand,
  viewEnergyValuesCommand,
  spendEnergyCommand,
] satisfies CommandModule[];
