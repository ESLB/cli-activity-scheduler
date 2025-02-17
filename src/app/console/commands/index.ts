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
import { removeLastActivityCommand } from './schedule/removeLastActivity.command';

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
  removeLastActivityCommand,
] satisfies CommandModule[];
