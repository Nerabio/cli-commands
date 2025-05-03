import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function extractImports(): Procedure {
  return (state: FileProcessingState) => {
    const importRegex = /from\s+['"](.+)['"]|require\(['"](.+?)['"]\)/g;
    const imports = new Set<string>();
    let match;

    while ((match = importRegex.exec(state.currentContent)) !== null) {
      const importPath = match[1] || match[2];
      if (importPath) imports.add(importPath);
    }

    const newState = {
      ...state,
      imports: Array.from(imports).filter((i) => !i.startsWith("${")),
    };

    return { state: newState, shouldBreak: false };
  };
}
