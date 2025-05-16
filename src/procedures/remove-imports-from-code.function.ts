import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function removeImportsFromCode(): Procedure {
  return (state: FileProcessingState) => {
    let cleanedCode = state.currentContent.replace(
      /import\s+(?:.*?\s+from\s+)?["'][^"']+["'][^\n;]*;?\n?/g,
      ""
    );

    // Удаляем оставшиеся пустые строки после удаления импортов
    cleanedCode = cleanedCode.replace(/\n{3,}/g, "\n\n");

    // Удаляем пустые строки в начале файла
    cleanedCode = cleanedCode.replace(/^\s*\n/, "");

    const newState = {
      ...state,
      currentContent: cleanedCode,
    };

    return { state: newState, shouldBreak: false };
  };
}
