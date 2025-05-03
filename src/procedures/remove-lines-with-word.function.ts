import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function removeLinesWithWord(word: string): Procedure {
  return (state: FileProcessingState) => {
    const lines = state.currentContent.split("\n");
    const filteredLines = lines.filter((line) => !line.includes(word));
    const linesRemoved = lines.length - filteredLines.length;

    const newState = {
      ...state,
      currentContent: filteredLines.join("\n"),
      stats: {
        ...state.stats,
        linesRemoved: state.stats.linesRemoved + linesRemoved,
        transformationsApplied: state.stats.transformationsApplied + 1,
      },
    };

    return { state: newState, shouldBreak: false };
  };
}
