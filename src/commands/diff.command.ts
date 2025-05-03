import path from "path";
import fs, { constants } from "fs/promises";
import { Validate, FileExistsRule, FileExtensionRule } from "../validations";
import { Command, JsonScheme } from "../interfaces";
import { getChecksum } from "../utils/";
import {
  createChecksum,
  extractExports,
  extractImports,
  processFile,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
  FileProcessingState,
} from "../procedures";
import { injectable } from "inversify";
import { CommandDecorator } from "../decorators/command.decorator";

@CommandDecorator({
  name: "diff",
  description:
    "From the general dump make a new one only for those who have changed.",
})
@injectable()
export class DiffCommand implements Command {
  @Validate([
    new FileExistsRule("filePath"),
    new FileExtensionRule("filePath", [".json"]),
  ])
  async execute([{ filePath }, options]: [
    { filePath: string },
    { db?: string }
  ]): Promise<void> {
    const pathDumpFile = path.resolve(filePath);
    const jsonFile = options?.db ?? "src.json";
    const dump = await this.getProjectData(pathDumpFile);

    const changedList = await Promise.all(
      dump.map(async (metaFile) => {
        const { filePath, checksum } = metaFile;
        try {
          const content = await fs.readFile(filePath, "utf-8");
          if (getChecksum(content) !== checksum) {
            let processingState = new FileProcessingState(content, filePath);
            processingState = processFile(
              processingState,
              createChecksum(),
              extractImports(),
              extractExports(),
              removeEmptyLines(),
              removeLinesWithWord("TODO"),
              replaceComments()
            );
            return {
              filePath: processingState.filePath,
              imports: processingState.imports,
              exports: processingState.exports,
              checksum: processingState.checksum,
              source: processingState.currentContent,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
          return null;
        }
      })
    );

    const filteredChangedList = changedList.filter(Boolean) as JsonScheme[];

    await this.writeFile(jsonFile, filteredChangedList);
    console.log(
      `Changed files (${filteredChangedList.length}) successfully added to ${jsonFile}`
    );
  }

  private async getProjectData(filePath: string): Promise<JsonScheme[]> {
    const projectJsonPath = path.resolve(filePath);
    try {
      console.log(projectJsonPath);
      await fs.access(projectJsonPath, constants.R_OK | constants.W_OK);
      return Promise.resolve(
        JSON.parse(await fs.readFile(projectJsonPath, "utf-8"))
      );
    } catch {
      await this.writeFile(projectJsonPath);
      return Promise.resolve([]);
    }
  }

  private async writeFile(
    filePath: string,
    currentData: JsonScheme[] = []
  ): Promise<void> {
    return await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
  }
}
