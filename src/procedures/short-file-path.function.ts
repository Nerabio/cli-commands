import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function shortFilePath(fullPath: string): Procedure {
  return (state: FileProcessingState) => {
    const path = state.filePath ?? "";
    const shortPath = path.replace(fullPath, "");

    const newState = {
      ...state,
      filePathShort: shortPath,
    };

    return { state: newState, shouldBreak: false };
  };
}
