import { FileProcessingState } from "./file-processing-state";

export interface ProcessingResult {
  state: FileProcessingState;
  shouldBreak: boolean;
}

export type Procedure = (state: FileProcessingState) => ProcessingResult;
