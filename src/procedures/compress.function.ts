import { Procedure } from "./processing-result.interface";
import { brotliCompressSync } from "zlib";
import { FileProcessingState } from "./file-processing-state";

export function compress(): Procedure {
  return (state: FileProcessingState) => {
    const compressedSource = brotliCompressSync(state.currentContent).toString(
      "base64"
    );
    state.currentContent = compressedSource;
    const newState = {
      ...state,
      compression: "brotli+base64",
    };
    return { state: newState, shouldBreak: false };
  };
}
