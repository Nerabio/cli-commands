import { ValidationRule, ValidationError } from "../interfaces";
import path from "path";

export class FileExtensionRule<T = any> implements ValidationRule<T> {
  constructor(
    public fieldName: string,
    private readonly allowedExtensions: string[] = [".ts"]
  ) {}

  validate(fieldName: string, value: any, input: T): ValidationError | null {
    const ext = path.extname(value).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      return {
        field: this.fieldName,
        message: `Invalid file extension. Allowed: ${this.allowedExtensions.join(
          ", "
        )}`,
      };
    }
    return null;
  }
}
