import { ValidationError } from "./validation-error.interface";

export type ValidationResult = {
  isValid: boolean;
  errors?: ValidationError[];
};
