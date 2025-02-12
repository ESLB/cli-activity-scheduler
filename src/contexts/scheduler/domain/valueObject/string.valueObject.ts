export class StringValueObject {
  readonly value: string;

  constructor(value: string) {
    this.validateString(value);
    this.value = value;
  }

  private validateString(value: string) {
    if (typeof value !== 'string') {
      throw Error('Not correct string');
    }
  }
}
