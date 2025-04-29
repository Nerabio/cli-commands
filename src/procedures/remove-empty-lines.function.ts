import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./procedure-handler.interface";

export function removeEmptyLines(): Procedure {
    return (state: FileProcessingState) => {
      const lines = state.currentContent.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      const linesRemoved = lines.length - nonEmptyLines.length;
  
      const newState = {
        ...state,
        currentContent: nonEmptyLines.join('\n'),
        stats: {
          ...state.stats,
          linesRemoved: state.stats.linesRemoved + linesRemoved,
          transformationsApplied: state.stats.transformationsApplied + 1,
        },
      };
  
      return { state: newState, shouldBreak: false };
    };
  }