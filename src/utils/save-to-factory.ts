import { FileProcessingState } from "../procedures";
import { convertToJson, convertToText } from "./index";

export const saveToFactory = (
  state: FileProcessingState[],
  pathOutput: string,
  format: "json" | "txt" | undefined = "json"
): void => {
  const filePath = pathOutput ? `${pathOutput}` : `output.${format}`;

  if (state.length === 0) {
    console.log("No files to process");
    return;
  }
  const content =
    format !== "json" ? convertToText(state) : convertToJson(state);
  require("fs").writeFileSync(filePath, content);
  console.log(`File saved to ${filePath}`);
};
