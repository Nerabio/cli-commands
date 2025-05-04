import { CommandDecorator } from "../decorators/command.decorator";
import { injectable } from "inversify";
import { Command } from "../interfaces";
import { saveToJson } from "../utils";
import {
  sourceFilesCollector,
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
} from "../procedures";
import { IsDirectoryRule, Validate } from "../validations";

@CommandDecorator({
  name: "dir",
  description:
    "Recursively collects project files from a given directory example: ./src",
})
@injectable()
export class DirectoryCommand implements Command {
  @Validate([new IsDirectoryRule("dirPath")])
  async execute([{ dirPath }, options]: [
    { dirPath: string },
    { db?: string }
  ]): Promise<void> {
    const collector = sourceFilesCollector(dirPath, [".ts"], async (state) =>
      processFile(
        state,
        createChecksum(),
        extractImports(),
        extractExports(),
        removeEmptyLines(),
        removeLinesWithWord("TODO"),
        replaceComments()
      )
    );

    const processedFiles = await collector.collect();
    const fileDb = options?.db ?? dirPath;
    saveToJson(processedFiles, fileDb);
  }
}
