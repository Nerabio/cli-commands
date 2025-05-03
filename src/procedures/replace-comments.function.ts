import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function replaceComments(): Procedure {
  return (state: FileProcessingState) => {
    const lines = state.currentContent.split("\n");
    let linesReplaced = 0;

    const processedLines = lines.map((line) => {
      if (line.includes("//")) {
        linesReplaced++;
        return line.split("//")[0]; // Удаляем всё после //
      }
      return line;
    });

    const newState = {
      ...state,
      currentContent: processedLines.join("\n"),
      stats: {
        ...state.stats,
        linesReplaced: state.stats.linesReplaced + linesReplaced,
        transformationsApplied: state.stats.transformationsApplied + 1,
      },
    };

    return { state: newState, shouldBreak: false };
  };
}
