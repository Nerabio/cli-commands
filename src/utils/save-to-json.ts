import { FileProcessingState } from "../procedures/file-processing-state";

export const saveToJson = (
  state: FileProcessingState[],
  pathOutput: string
): void => {
  const filePath = pathOutput ? `${pathOutput}` : "output.json";

  if (state.length === 0) {
    console.log("No files to process");
    return;
  }

  const content = state.map((fileState) => {
    return {
      filePath: fileState.filePath,
      imports: fileState.imports,
      exports: fileState.exports,
      checksum: fileState.checksum,
      source: fileState.currentContent,
    };
  });

  require("fs").writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`File saved to ${filePath}`);
};
