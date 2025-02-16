import { ArgumentsCamelCase, CommandModule } from 'yargs';
import { IdValueObject } from '../../../../contexts/scheduler/domain/valueObject/id.valueObject';
import { setDependencyService } from '../../services/activity.service';

export const setDependencyCommand = {
  command: 'sd',
  describe: 'Set dependency on activity',
  builder: {
    t_id: {
      describe: 'Target activity Id',
      type: 'string',
      demandOption: true,
    },
    p_id: {
      describe: 'Predecessor activity Id',
      type: 'string',
      demandOption: true,
    },
  },
  handler: (argv: ArgumentsCamelCase) => {
    const t_id = argv.t_id as string;
    const p_id = argv.p_id as string;

    setDependencyService.execute(
      new IdValueObject(t_id),
      new IdValueObject(p_id),
    );

    console.log('Dependency set correctly');
    // TODO: Tal vez añadir el nombre de las tareas, o un resumen de la relación creada, feedback visual
  },
} satisfies CommandModule;
