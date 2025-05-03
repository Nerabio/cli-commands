import { ValidationRule, ValidationError } from "../interfaces";
import { existsSync, statSync } from "fs";
import path from "path";

export class IsDirectoryRule<T = any> implements ValidationRule<T> {
  constructor(public fieldName: string = "dirPath") {}

  validate(fieldName: string, value: any, input: T): ValidationError | null {
    // Для деструктуризированных параметров value может быть undefined
    if (value === undefined || value === null || value === "") {
      return {
        field: this.fieldName,
        message: `Directory path is required`,
      };
    }

    const fullPath = path.resolve(value);
    if (!existsSync(fullPath)) {
      return {
        field: this.fieldName,
        message: `Directory does not exist: ${fullPath}`,
      };
    }

    if (!statSync(fullPath).isDirectory()) {
      return {
        field: this.fieldName,
        message: `Path is not a directory: ${fullPath}`,
      };
    }

    return null;
  }
}
