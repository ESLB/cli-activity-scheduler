export class BooleanValueObject {
  readonly value: boolean;

  constructor(value: boolean) {
    this.validateBoolean(value);
    this.value = value;
  }

  private validateBoolean(value: boolean) {
    if (typeof value !== 'boolean') {
      throw Error('Not correct boolean');
    }
  }
}
