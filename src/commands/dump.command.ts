import path from "path";
import fs, { constants } from "fs/promises";
import { Command, CommandArgs } from "../interfaces";
import { Validate, FileExistsRule, FileExtensionRule } from "../validations";
import {
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  FileProcessingState,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
} from "../procedures";
import { saveToFactory } from "../utils";
import { injectable } from "inversify";
import { CommandDecorator } from "../decorators/command.decorator";
import { ConfigService } from "../services";

@CommandDecorator({
  name: "dump",
  description:
    "Creates a selective dump of the listed files for analyzing specific solutions",
})
@injectable()
export class DumpCommand implements Command {
  constructor(private readonly configService: ConfigService) {}

  @Validate([
    new FileExistsRule("filePath"),
    new FileExtensionRule("filePath", [".txt"]),
  ])
  async execute({
    main: { filePath },
    options,
  }: CommandArgs<{ filePath: string }>): Promise<void> {
    const fullPathList = path.resolve(filePath);
    const fileDb =
      options?.db ?? this.configService.getKey("defaultOutputFileName");

    const selectedFiles = await this.getSelectedFiles(fullPathList);

    const processedFiles: FileProcessingState[] = [];
    for (const filePath of selectedFiles) {
      const content = await fs.readFile(filePath, "utf-8");

      let state = new FileProcessingState(content, filePath);
      state = processFile(
        state,
        createChecksum(),
        extractImports(),
        extractExports(),
        removeEmptyLines(),
        removeLinesWithWord("TODO"),
        replaceComments()
      );

      processedFiles.push({
        filePath,
        imports: state.imports,
        exports: state.exports,
        checksum: state.checksum,
        currentContent: state.currentContent,
        originalContent: state.originalContent,
        stats: state.stats,
      });
    }

    saveToFactory(processedFiles, fileDb, options?.format);
    console.log("Dump успешно сохранён!");
  }

  private async getSelectedFiles(filePath: string): Promise<string[]> {
    const textList = path.resolve(filePath);
    try {
      await fs.access(textList, constants.R_OK | constants.W_OK);
      return Promise.resolve(
        (await fs.readFile(textList, "utf-8")).split("\n")
      );
    } catch {
      return Promise.resolve([]);
    }
  }
}
