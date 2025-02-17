import { IdRepository } from '../../domain/repository/id.repository';
import { IdValueObject } from '../../domain/valueObject/id.valueObject';

export class GetMatchingIdsService {
  constructor(readonly idRepository: IdRepository) {}

  execute(firstLetters: string): IdValueObject[] {
    if (firstLetters.length < 3) {
      return [];
    }
    return this.idRepository.getMatchingId(firstLetters);
  }
}
