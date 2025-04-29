import { FileProcessingState } from "./file-processing-state";

export interface ProcedureHandler {
    state: FileProcessingState;
    shouldBreak: boolean;
  }
  
export type Procedure = (state: FileProcessingState) => ProcedureHandler;