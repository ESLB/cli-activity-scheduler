import { ActivityRepository } from '../domain/repository/activity.repository';
import { IdValueObject } from '../domain/valueObject/id.valueObject';

export class SetDependencyService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  execute(targetId: IdValueObject, predecessorId: IdValueObject) {
    const targetActivity = this.activityRepository.getActivity(targetId);
    const predecessorActivity =
      this.activityRepository.getActivity(predecessorId);

    if (!targetActivity) {
      throw Error('The target activity doesn\t exists');
    }
    if (!predecessorActivity) {
      throw Error('The predecessor activity doesn\t exists');
    }
    if (targetId.isEqual(predecessorId)) {
      throw Error("A target can't be its own predecessor");
    }
    for (const activity of this.activityRepository.getPredecessors(
      predecessorId,
    )) {
      if (activity.predecessors.map((i) => i.value).includes(targetId.value)) {
        throw Error('The dependency would create a circle dependency');
      }
    }

    targetActivity.predecessors.push(predecessorActivity.id);

    this.activityRepository.saveActivities([targetActivity]);
  }
}
