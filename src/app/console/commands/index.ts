import { CommandModule } from 'yargs';
import { createActivityCommand } from './activity/createActivity.command';
import { findActivityCommand } from './activity/findActivity.command';
import { listActivitiesCommand } from './activity/listActivities.command';
import { clearCommand } from './utility/clear.command';
import { defaultCommand } from './utility/default.command';
import { greetingCommand } from './utility/greeting.command';
import { patchActivityCommand } from './activity/patchActivity.command';
import { setDependencyCommand } from './activity/setDependency.command';

export const commands = [
  clearCommand,
  createActivityCommand,
  defaultCommand,
  findActivityCommand,
  greetingCommand,
  listActivitiesCommand,
  patchActivityCommand,
  setDependencyCommand,
] satisfies CommandModule[];
