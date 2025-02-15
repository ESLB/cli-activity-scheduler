import { App } from './console/app';
import { customCompleter } from './console/commands';

new App(customCompleter).start();
