import { FileProcessingState } from "../procedures";

export const convertToJson = (state: FileProcessingState[]): string => {
  const content = state.map((fileState) => {
    return {
      filePath: fileState.filePath,
      imports: fileState.imports,
      exports: fileState.exports,
      checksum: fileState.checksum,
      source: fileState.currentContent,
      compression: fileState.compression,
    };
  });

  return JSON.stringify(content, null, 2);
};
