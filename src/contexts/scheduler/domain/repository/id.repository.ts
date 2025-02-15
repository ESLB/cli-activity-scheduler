import { IdValueObject } from '../valueObject/id.valueObject';

export interface IdRepository {
  getMatchingId(firstLetters: string): IdValueObject[];
}
