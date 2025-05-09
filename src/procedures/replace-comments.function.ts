import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function replaceComments(): Procedure {
  return (state: FileProcessingState) => {
    const lines = state.currentContent.split("\n");
    let linesReplaced = 0;

    const processedLines = lines.map((line) => {
      // Удаляем однострочные комментарии (//)
      if (line.trim().startsWith("//")) {
        linesReplaced++;
        return "";
      }
      // Удаляем inline-комментарии
      const withoutInlineComments = line.replace(/\/\/.*$/, "").trim();
      if (withoutInlineComments !== line.trim()) {
        linesReplaced++;
        return withoutInlineComments;
      }
      return line;
    });

    // Удаляем многострочные комментарии (/* */)
    let inMultilineComment = false;
    const finalLines = processedLines.filter((line, index) => {
      if (line.includes("/*") && !line.includes("*/")) {
        inMultilineComment = true;
        linesReplaced++;
        return false;
      }
      if (inMultilineComment) {
        if (line.includes("*/")) {
          inMultilineComment = false;
          linesReplaced++;
        }
        return false;
      }
      return true;
    });

    // Удаляем двойные пустые строки
    // finalLines.forEach((line, index) => {
    //   line = line.replace(/\n$/, "").trim();
    //   return line;
    // });

    const content = finalLines.join("\n");

    const newState = {
      ...state,
      currentContent: content,
      stats: {
        ...state.stats,
        linesReplaced: state.stats.linesReplaced + linesReplaced,
        transformationsApplied: state.stats.transformationsApplied + 1,
      },
    };

    return { state: newState, shouldBreak: false };
  };
}
