import { FileProcessingState } from "./file-processing-state";
import { Procedure } from "./processing-result.interface";

export function createChecksum(): Procedure {
  return (state: FileProcessingState) => {
    const checksum = require("crypto")
      .createHash("md5")
      .update(state.currentContent)
      .digest("hex");

    const newState = {
      ...state,
      checksum,
    };

    return { state: newState, shouldBreak: false };
  };
}
