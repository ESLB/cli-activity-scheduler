import { CommandModule } from 'yargs';
import { createActivityCommand } from './createActivity.command';
import { findActivityCommand } from './findActivity.command';
import { listActivitiesCommand } from './listActivities.command';
import { clearCommand } from './clear.command';
import { defaultCommand } from './default.command';
import { greetingCommand } from './greeting.command';
import { patchActivityCommand } from './patchActivity.command';
import { setDependencyCommand } from './setDependency.command';

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
