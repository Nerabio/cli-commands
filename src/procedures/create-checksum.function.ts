import { getChecksum } from "../utils";
import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function createChecksum(): Procedure {
  return (state: FileProcessingState) => {
    const checksum = getChecksum(state.originalContent);
    const newState = {
      ...state,
      checksum,
    };

    return { state: newState, shouldBreak: false };
  };
}
