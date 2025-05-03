import { ValidationError, ValidationRule } from "../../interfaces/index";
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

    descriptor.value = async function (...args: any[]) {
      const errors: ValidationError[] = [];

      const [commandArgs] = args;
      const [mainArg, options] = commandArgs;

      const validationInput = {
        ...(typeof mainArg === "object" && mainArg !== null
          ? mainArg
          : { value: mainArg }),
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

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
