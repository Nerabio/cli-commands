import { CommandDecorator } from "./core/command.decorator";
import path from "path";
import {
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
} from "../procedures";
import { FileProcessingState } from "../procedures/file-processing-state";
import fs, { constants } from "fs/promises";
import { Command } from "../interfaces/command.interface";
import { JsonScheme } from "../interfaces/json-scheme.interface";
import { FileExistsRule, FileExtensionRule, Validate } from "../validations";

@CommandDecorator({
  name: "add",
  description: "Add single file to project JSON",
})
export class AddFileCommand implements Command {
  @Validate([
    new FileExistsRule("filePath"),
    new FileExtensionRule("filePath", [".ts", ".js"]),
  ])
  async execute([{ filePath }, options]: [
    { filePath: string },
    { db?: string }
  ]): Promise<void> {
    const fullPath = path.resolve(filePath);
    const jsonFile = options?.db ?? "src.json";

    const currentData = await this.getProjectData(jsonFile);

    if (currentData.some((f: any) => path.resolve(f.filePath) === fullPath)) {
      console.log(`File ${filePath} already exists in src.json`);
      return;
    }

    const content = await fs.readFile(fullPath, "utf-8");
    let processingState = new FileProcessingState(content, fullPath);

    processingState = processFile(
      processingState,
      createChecksum(),
      extractImports(),
      extractExports(),
      removeEmptyLines(),
      removeLinesWithWord("TODO"),
      replaceComments()
    );

    currentData.push({
      filePath: filePath,
      imports: processingState.imports,
      exports: processingState.exports,
      checksum: processingState.checksum,
      source: content,
    });

    await this.writeFile(jsonFile, currentData);

    console.log(`File ${filePath} successfully added to ${jsonFile}`);
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
