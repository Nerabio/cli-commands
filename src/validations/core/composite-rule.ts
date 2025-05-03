import { ValidationError, ValidationRule } from "../../interfaces";

export class CompositeRule<T = any> implements ValidationRule<T> {
  constructor(
    public fieldName: string,
    private rules: Array<ValidationRule<T>>
  ) {}

  validate(fieldName: string, value: any, input: T): ValidationError | null {
    for (const rule of this.rules) {
      const error = rule.validate(fieldName, value, input);
      if (error) {
        return error;
      }
    }
    return null;
  }
}
