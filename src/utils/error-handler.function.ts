import { ValidationFieldError } from "../validations";

export const errorHandler = (err: Error) => {
  if (err instanceof ValidationFieldError) {
    console.error("Validation errors:");
    console.error(err.errors.join("\n"));
  } else if (err instanceof Error) {
    console.error("An unexpected error occurred:", err.message);
  } else {
    console.error("An unknown error occurred:", err);
  }
  process.exit(1);
};
