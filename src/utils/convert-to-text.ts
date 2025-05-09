import { FileProcessingState } from "../procedures";

export const convertToText = (state: FileProcessingState[]): string => {
  return state
    .map(
      (fileState) =>
        `file:"${fileState.filePathShort}"\nsource:"${fileState.currentContent}"`
    )
    .join("\n");
};
