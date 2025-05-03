import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function extractExports(): Procedure {
  return (state: FileProcessingState) => {
    const exports = new Set<string>();
    const patterns = [
      /export\s+(?:default\s+)?(?:const|let|var|function|class|interface|enum)\s+(\w+)/g,
      /export\s+\{([^}]+)\}(?:\s+from\s+['"][^'"]+['"])?/g,
      /export\s+\*\s+from\s+['"]([^'"]+)['"]/g,
    ];

    patterns.forEach((regex) => {
      let match;
      while ((match = regex.exec(state.currentContent)) !== null) {
        if (match[1])
          match[1].split(",").forEach((name) => {
            exports.add(name.trim().split(" as ")[0]);
          });
      }
    });

    const newState = {
      ...state,
      exports: Array.from(exports).filter(Boolean),
    };

    return { state: newState, shouldBreak: false };
  };
}
