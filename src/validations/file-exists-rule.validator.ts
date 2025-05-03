import { ValidationRule, ValidationError } from "../interfaces";
import { existsSync } from "fs";
import path from "path";

export class FileExistsRule<T = any> implements ValidationRule<T> {
  constructor(public fieldName: string) {}

  validate(fieldName: string, value: any, input: T): ValidationError | null {
    if (!value) {
      return {
        field: this.fieldName,
        message: `${this.fieldName} is required`,
      };
    }

    const fullPath = path.resolve(value);
    if (!existsSync(fullPath)) {
      return {
        field: this.fieldName,
        message: `File does not exist at path: ${fullPath}`,
      };
    }

    return null;
  }
}
