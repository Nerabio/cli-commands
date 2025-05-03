import { ValidationError } from "./validation-error.interface";

export interface ValidationRule<T = any> {
  [x: string]: any;
  validate(fieldName: string, value: any, input: T): ValidationError | null;
}
