export class IntegerValueObject {
  readonly value: number;

  constructor(integer: number) {
    this.validateInteger(integer);
    this.value = integer;
  }

  private validateInteger(integer: number) {
    if (typeof integer !== 'number') {
      throw Error('Not correct number');
    }
    if (integer % 1 > 0) {
      throw Error('Not integer');
    }
  }

  add(other: IntegerValueObject): IntegerValueObject {
    return new IntegerValueObject(this.value + other.value);
  }

  substract(other: IntegerValueObject): IntegerValueObject {
    return new IntegerValueObject(this.value - other.value);
  }
}
