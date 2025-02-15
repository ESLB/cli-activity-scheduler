import { v4 as uuidv4, validate } from 'uuid';

export class IdValueObject {
  readonly value: string;

  constructor(id: string) {
    this.validateId(id);
    this.value = id;
  }

  private validateId(id: string) {
    if (!validate(id)) {
      throw Error('Not valid ID');
    }
  }

  static random() {
    return new IdValueObject(uuidv4());
  }

  isEqual(other: IdValueObject) {
    return this.value === other.value;
  }
}
