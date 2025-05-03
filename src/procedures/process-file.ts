import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function processFile(
  initialState: FileProcessingState,
  ...procedures: Procedure[]
): FileProcessingState {
  let currentState = initialState;

  for (const procedure of procedures) {
    const { state: newState, shouldBreak } = procedure(currentState);
    currentState = newState;
    if (shouldBreak) break;
  }

  return currentState;
}
