import { CommandArgs, ValidationError, ValidationRule } from "../../interfaces";
import { ValidationFieldError } from "./validation.error";

export function Validate<T, U extends { [key: string]: any }>(
  rules: Array<ValidationRule<T>>
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: CommandArgs) {
      const errors: ValidationError[] = [];

      const { main, options } = args;

      const validationInput = {
        ...main,
        ...options,
      };

      for (const rule of rules) {
        const fieldName = rule.fieldName;
        const value = validationInput[fieldName];

        const error = rule.validate(fieldName, value, validationInput as T);
        if (error) {
          errors.push(error);
        }
      }

      if (errors.length > 0) {
        throw new ValidationFieldError(
          "Validation failed",
          errors.map((err) => `- ${err.field}: ${err.message}`)
        );
      }

      return originalMethod.apply(this, [args]);
    };

    return descriptor;
  };
}
